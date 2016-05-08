import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import {Link} from 'react-router';

import MedicalModal from '../../modal/medical-modal.jsx';
import ShowModal from '../../modal/show-modal.jsx';
import RemoveModal from '../../modal/remove-modal.jsx';
import ShowCalendarPage from '../../show-calendar/show-calendar-page.jsx';
import Pedigree from '../../pedigree/pedigree.jsx'

import { Dogs, DogImages, MedicalRecords, MedicalDocuments } from "../../../api/dogs.js";
import { Shows } from "../../../api/shows.js"

export default class DogDetails extends Component {
  constructor(props) {
    super(props);
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    // this.modalCase = this.modalCase.bind(this);
    this.modalShow = this.modalShow.bind(this);
    this.modalRemove = this.modalRemove.bind(this);
    this.modalMedical = this.modalMedical.bind(this);
    const today = new Date();
    const day = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastOftheMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    lastOftheMonth.setMonth(lastOftheMonth.getMonth() + 1);
    lastOftheMonth.setDate(lastOftheMonth.getDate() - 1);
    let i = 0;
    const calendarDays = [];
    while(i < day.getUTCDay()){
      calendarDays.push("null " + i);
      i++;
    }
    do {
      calendarDays.push(new Date(day.getFullYear(), day.getMonth(), day.getDate()));
    } while (day.setDate(day.getDate() + 1) <= lastOftheMonth);
    this.state = {
      modalHelperClass : "hidden",
      modal:"",
      style: {
        backgroundImage : this.props.backgroundUrl,
      },
      calendar: calendarDays,
    };
  }

  modalShow(){
    this.modalCase(this.props.modals.show);
  }

  modalRemove(){
    this.modalCase(this.props.modals.remove);
  }

  modalMedical(){
    this.modalCase(this.props.modals.medical);
  }

  modalCase(typeOfModal){

    this.setState({
      modal: typeOfModal,
      modalHelperClass: '',
    });
  }

  hideModal(){
    this.setState({
      modalHelperClass: 'hidden',
    });
  }

  showModal(){
    this.setState({
      modalHelperClass: '',
    });
  }

  renderModal(){
    switch (this.state.modal) {
      case this.props.modals.show:
        return <ShowModal dog={this.props.dog} dismiss={this.hideModal}/>;
        break;
      case this.props.modals.medical:
        return <MedicalModal dog={this.props.dog} dismiss={this.hideModal}/>;
        break;
      case this.props.modals.remove:
        return <RemoveModal dog={this.props.dog} dismiss={this.hideModal}/>;
        break;
      case this.props.modals.pedigree:
        return <Pedigree dog={this.props.dog} dismiss={this.hideModal}/>;
        break;
      default:
        return "NO MODAL SET";
        break;
    }
  }

  renderPedigree(){
    if(this.props.dog.pedigree || this.props.dog.pedigree === false){
      return null;
    } else {

      return (
        <div className="modal">
          <div className="modal-content">
            <Pedigree dog={this.props.dog}/>
          </div>
        </div>
      )
    }
  }

  renderDOB(){
    if(this.props.dog.dateOfBirth instanceof Date){
      return this.props.dog.dateOfBirth.toISOString();
    }
  }

  sireLink(){
    if(this.props.dog.parentage.sire){
      return <Link to={`/dog/${this.props.dog.parentage.sire}`}>View Sire</Link>
    }
  }

  damLink(){
    if(this.props.dog.parentage.dam){
      return <Link to={`/dog/${this.props.dog.parentage.dam}`}>View Dam</Link>
    }
  }


  render() {

    return (
          <div className="content dog">
            {this.renderPedigree()}
            <div className={"modal "+ this.state.modalHelperClass}>
              <div className="modal-content">
                <button onClick={this.hideModal}>X</button>
                {this.renderModal()}
              </div>
            </div>
            <div className="bar" style={this.state.style}>
              <div className="thumb-image">
                <img src={this.props.image.url({store:'thumbs'})}></img>
              </div>
              <h1>
                {this.props.dog.name}
              </h1>
              <nav>
                <button onClick={()=>this.modalCase(this.props.modals.medical)}>add medical document</button>
                <button onClick={()=>this.modalCase(this.props.modals.show)}>add show</button>
                <button onClick={()=>this.modalCase(this.props.modals.remove)}>remove dog</button>
              </nav>
            </div>

            <div className="specs">
              <div className="biological">
                Name: {this.props.dog.name}<br/>
                Breed: {this.props.dog.breed}<br/>
                Color: {this.props.dog.color}<br/>
                Gender: {this.props.dog.gender}
                {(() => {
                  console.log(this.props.dog);
                  if(this.props.dog.pedigree){
                    return (
                      <section>
                        Date of Birth: {this.renderDOB()} <br/>
                        Sire: {this.sireLink()} <br/>
                        Dam: {this.damLink()} <br/>
                      </section>
                    )
                  }
                })()}
                <hr/>
              </div>
              <table className="medical">
                <thead>
                  <tr>
                    <th>
                      Document
                    </th>
                    <th>
                      Expires
                    </th>
                    <th>
                      Paperwork
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {this.props.medical.map((medDoc)=>{
                    return (
                      <tr key={medDoc._id}>
                        <td>
                          {medDoc.title}
                        </td>
                        <td>
                          {medDoc.expires.toDateString()}
                        </td>
                        <td>
                          <a href={this.props.medicalPaperwork[medDoc.assosiatedDocument]}>Link to Document</a>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

            </div>
            <ShowCalendarPage shows={this.props.shows} />

          </div>

    );
  }
};

DogDetails.defaultProps = {
  dog: {},
  shows: [],
  medical: [],
  image: {
    url(){
      return '';
    }
  },
  backgroundUrl : '',
  modals:{
    'remove':"remove",
    'show':"show",
    'medical':"medical",
    'pedigree':"pedigree"
  }
}

DogDetails.propTypes = {
  dog: React.PropTypes.object,
  shows: React.PropTypes.object,
  medical: React.PropTypes.array
}

export default createContainer(({params}) => {
  let dogImageId ='';
  const showId = params.showId;
  Meteor.subscribe("dog", params.id);
  Meteor.subscribe("aDogsShow",params.id);
  Meteor.subscribe("dogMedicalDocuments", params.id);

  const dogQuery = {_id:params.id};

  let imageId = Dogs.findOne(dogQuery, {fields:{image:true}});
  if(typeof imageId === 'undefined'){
    imageId = {
      image:""
    };
  }
  Meteor.subscribe("dogImages", imageId.image);


  let medicalDocIds = [];
  for(med of MedicalRecords.find({}).fetch()){
    medicalDocIds.push(med.assosiatedDocument);
  }


  Meteor.subscribe("medicalPaperwork", medicalDocIds);
  let docS3Store = {};
  for (file of MedicalDocuments.find({}).fetch()) {
    docS3Store[file._id] = file.url();
  }
  const today = new Date();
  const firstOftheMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastOftheMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  lastOftheMonth.setMonth(lastOftheMonth.getMonth() + 1);
  // lastOftheMonth.setDate(lastOftheMonth.getDate() - 1);
  const showQuery = {
    dog:params.id,
    date:{
      $gte: firstOftheMonth,
      $lte: lastOftheMonth
    }
  };

  const shows = Shows.find(showQuery).fetch();

  const monthShows = {};
  for(show of shows){
    if(typeof monthShows[show.date.getUTCDate()] === 'undefined'){
      monthShows[show.date.getUTCDate()] = [];
    }
    monthShows[show.date.getUTCDate()].push(show);
  }



  return {
    dog: Dogs.findOne(dogQuery),
    shows: monthShows,
    image: DogImages.findOne({_id:imageId.image}),
    showId: showId,
    medical: MedicalRecords.find({}).fetch(),
    medicalPaperwork : docS3Store
  };
}, DogDetails);
