import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import {Link} from 'react-router';

import MedicalModal from '../../modal/medical-modal.jsx';
import ShowModal from '../../modal/show-modal.jsx';
import RemoveModal from '../../modal/remove-modal.jsx';
import ShowCalendarPage from '../../show-calendar/show-calendar-page.jsx';

import { Dogs, DogImages } from "../../../api/dogs.jsx";
import { Shows } from "../../../api/shows.jsx"

export default class DogDetails extends Component {
  constructor(props) {
    super(props);
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
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
        return <MedicalModal dog={this.props.dog}/>;
        break;
      case this.props.modals.remove:
        return <RemoveModal dog={this.props.dog}/>;
        break;
      default:
        return "NO MODAL SET";
        break;
    }
  }

  renderShows(){
    return
  }

  render() {
    return (
          <div className="content dog">
            <div className="bar" style={this.state.style}>
              <div className="thumb-image">
                <img src={this.props.image.url({store:'thumbs'})}></img>
              </div>
              <h1>
                {this.props.dog.name}
              </h1>
              <nav>
                <button onClick={this.modalMedical}>add medical document</button>
                <button onClick={this.modalShow}>add show</button>
                <button onClick={this.modalRemove}>remove dog</button>
              </nav>
            </div>

            <div className="specs">
              <div className="biological">
                Name: {this.props.dog.name}
                Breed: {this.props.dog.breed}
                Color: {this.props.dog.color}
                Gender: {this.props.dog.gender}
              </div>
            </div>
            <ShowCalendarPage shows={this.props.shows} />;
            <div className={"modal "+ this.state.modalHelperClass}>
              <div className="modal-content">
                <button onClick={this.hideModal}>X</button>
                {this.renderModal()}
              </div>
            </div>
          </div>

    );
  }
};

DogDetails.defaultProps = {
  dog: {},
  shows: [],
  image: {
    url(){
      return '';
    }
  },
  backgroundUrl : '',
  modals:{
    'remove':"remove",
    'show':"show",
    'medical':"medical"
  }
}

DogDetails.propTypes = {
  dog: React.PropTypes.object,
  shows: React.PropTypes.object,
}

export default createContainer(({params}) => {
  let dogImageId ='';
  let test = "FART";
  Meteor.subscribe("dog", params.id);
  Meteor.subscribe("aDogsShow",params.id);

  console.log(test);


  const dogQuery = {_id:params.id};

  let imageId = Dogs.findOne(dogQuery, {fields:{image:true}});
  if(typeof imageId === 'undefined'){
    imageId = {
      image:""
    };
  }
  Meteor.subscribe("dogImages", imageId.image);
  const today = new Date();
  const firstOftheMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastOftheMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  lastOftheMonth.setMonth(lastOftheMonth.getMonth() + 1);
  lastOftheMonth.setDate(lastOftheMonth.getDate() - 1);
  console.log("getting events between " + firstOftheMonth + " and " + lastOftheMonth);
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
    if(typeof monthShows[show.date.getDate()+1] === 'undefined'){
      monthShows[show.date.getDate()+1] = [];
    }
    monthShows[show.date.getDate()+1].push(show);
  }


  return {
    dog: Dogs.findOne(dogQuery),
    shows: monthShows,
    image: DogImages.findOne({_id:imageId.image}),
  };
}, DogDetails);
