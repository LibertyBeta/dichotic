import React, { Component, PropTypes } from 'react';
import { browserHistory } from 'react-router';
import { createContainer } from 'meteor/react-meteor-data';
import { Dogs, DogImages } from "../../api/dogs.jsx";
import { Shows } from "../../api/shows.jsx"
import Dog from "../dog/dog-tag/dog.jsx"
import ShowCalendarSidebar from "../show-calendar/show-calendar-sidebar.jsx"



// Task component - represents a single todo item
export default class Home extends Component {
  constructor(props) {
    super(props);
    this.addDog = this.addDog.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.showModal = this.showModal.bind(this);
    this.state = {
      modalHelperClass : "hidden",
    };
  }

  renderDogs(){
    return this.props.dogs.map((dog) => {
      // return "test";
      return <Dog key={dog._id} dog={dog} image={this.props.images[dog.image]} />;
    });
  }

  addDog(event){
    event.preventDefault();
    console.log("none");
    console.log(this.refs.image.files[0]);
    let file = DogImages.insert(this.refs.image.files[0]);
    // let file = DogImages.insert(this.refs.image.files[0]);
    console.log(file);
    let dog = {
      image: file._id,
      name: this.refs.name.value,
      breed: this.refs.breed.value,
      // color: this.refs.color.value
    };

    let id = Dogs.insert(dog);
    let tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1)
    console.log(tomorrow.toString());
    let calendarEvent = {
      date: tomorrow,
      dog: id,
      title: "Event for " + dog.name,
      location: "some PLACE"
    };
    Shows.insert(calendarEvent);
    // browserHistory.push('/dog/'+id);
  }

  renderCalendar(){
    // console.log(this.data.shows.length);
    if(this.props.shows.length < 1){
      console.log("No events to see");
      return 'No upcoming events';
    } else {
      return this.props.shows.map((show)=> {
        return <ShowCalendarSidebar key={show._id} show={show} />;
      });
    }

  }


  hideModal(){
    console.log("trying to hide the modal");
    this.setState({
      modalHelperClass: 'hidden',
    });
  }

  showModal(){
    this.setState({
      modalHelperClass: '',
    });
  }

  render() {
    console.log(this.props.ids);
    return (

          <div className="content">
            <div className="dogs">
              {this.renderDogs()}
              <div id="add" onClick={this.showModal}>
                <i className="fa fa-plus-square-o fa-3x"></i>
              </div>
            </div>
            <div className="sidebar">
              {this.renderCalendar()}
            </div>
            <div className={"modal "+ this.state.modalHelperClass}>
              <div className="modal-content">
                <button onClick={this.hideModal}>X</button>
                <form className="new-dog" onSubmit={this.addDog} >
                  <input
                    type="file"
                    ref="image"
                    accept="jpeg/png"
                    />
                  <input
                    type="text"
                    ref="name"
                    placeholder="The Name of the Dog" />
                  <input
                    type="text"
                    ref="breed"
                    placeholder="The Breed of the Dog" />
                  <input type="submit"></input>
                </form>
              </div>
            </div>
          </div>

    );
  }
}

Home.defaultState = {
  id: 1,
  modal : true,
}


export default createContainer(() => {
  let ids = [];
  let idsPre = Dogs.find({}, {fields:{_id:1}}).fetch();
  for (let id of idsPre) {
    ids.push(id._id);
  }let imageIds = [];
  idsPre = Dogs.find({}, {fields:{image:1}}).fetch();
  for (let id of idsPre) {
    imageIds.push(id.image);
  }
  let imageStore = {};
  console.log("IMAGE ID");
  for (file of DogImages.find({_id:{$in:imageIds}}).fetch()) {
    imageStore[file._id] = file;
  }
  console.log(imageStore);

  return {
    dogs: Dogs.find({}).fetch(),
    shows: Shows.find({dog:{$in:ids}}).fetch(),
    images: imageStore,
  };
}, Home);
