import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { browserHistory, Link} from 'react-router';

import MedicalModal from '../../modal/medical-modal.jsx';
import ShowModal from '../../modal/show-modal.jsx';
import RemoveModal from '../../modal/remove-modal.jsx';

import Pedigree from '../../pedigree/pedigree.jsx'

import { Dogs, DogImages } from "../../../api/dogs.js";


export default class DogDetails extends Component {
  constructor(props) {
    super(props);
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    // this.modalCase = this.modalCase.bind(this);
    this.modalShow = this.modalShow.bind(this);
    this.modalRemove = this.modalRemove.bind(this);
    this.modalMedical = this.modalMedical.bind(this);
    this.state = {
      modalHelperClass : "hidden",
      modal:"",
      style: {
        backgroundImage : this.props.backgroundUrl,
      },
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

  goHome(){
    browserHistory.push('/dog/'+this.props.dog._id);
  }

  genealogy(){
    browserHistory.push('/dog/'+this.props.dog._id +'/genealogy');
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
    if(this.props.dog._id){
      if(this.props.dog.pedigree || this.props.dog.pedigree === false){
        return null;
      } else {
        return (
          <div className="modal">
            <div className="modal-content">
              <Pedigree dog={this.props.dog} params={{id:this.props.dog._id}}/>
            </div>
          </div>
        )
      }
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
                <button onClick={()=>this.goHome()}><i className="fa fa-paw fa-lg"></i> Home</button>
                <button onClick={()=>this.modalCase(this.props.modals.medical)}><i className="fa fa-heartbeat fa-lg"></i> Add Medical Document</button>
                <button onClick={()=>this.modalCase(this.props.modals.show)}><i className="fa fa-calendar-o fa-lg"></i> Add Dog Show</button>
                <button onClick={()=>this.modalCase(this.props.modals.remove)}><i className="fa fa-archive fa-lg"></i> Retire Dog</button>
                {(() => {
                  if(this.props.dog.pedigree === true){
                    return <button onClick={()=>this.genealogy()}><i className="fa fa-line-chart fa-lg"></i> Genealogy Chart</button>
                  }
                })()}
              </nav>
            </div>

            {this.props.children}

          </div>

    );
  }
};

DogDetails.defaultProps = {
  dog: {},
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
}

export default createContainer(({params}) => {
  let dogImageId ='';
  Meteor.subscribe("dog", params.id);

  const dogQuery = {_id:params.id};

  let imageId = Dogs.findOne(dogQuery, {fields:{image:true}});
  if(typeof imageId === 'undefined'){
    imageId = {
      image:""
    };
  }
  Meteor.subscribe("dogImages", imageId.image);



  return {
    dog: Dogs.findOne(dogQuery),
    image: DogImages.findOne({_id:imageId.image}),
  };
}, DogDetails);
