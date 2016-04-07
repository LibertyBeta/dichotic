import React, { Component, PropTypes } from 'react';
import { browserHistory } from 'react-router';
import { createContainer } from 'meteor/react-meteor-data';
import { Dogs, DogImages } from '../../api/dogs.jsx';
import { Shows } from '../../api/shows.jsx';
import Dog from '../dog/dog-tag/dog.jsx';
import ShowCalendarSidebar from '../show-calendar/show-calendar-sidebar.jsx';



// Task component - represents a single todo item
export default class Home extends Component {
  constructor(props) {
    super(props);
    this.addDog = this.addDog.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.showModal = this.showModal.bind(this);
    this.state = {
      modalHelperClass : "hidden",
      dogName : ""
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
    const file = DogImages.insert(this.refs.image.files[0]);
    // let file = DogImages.insert(this.refs.image.files[0]);
    console.log(file);

    const dog = {
      image: file._id,
      name: this.refs.name.value,
      breed: this.refs.breed.value,
      gender: this.refs.gender.value,
      // color: this.refs.color.value
    };
    console.log(dog);
    const id = Dogs.insert(dog);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1)
    console.log(tomorrow.toString());
    const calendarEvent = {
      date: tomorrow,
      dog: id,
      title: "Event for " + dog.name,
      location: "some PLACE"
    };
    Shows.insert(calendarEvent);
    browserHistory.push('/dog/'+id);
  }

  renderCalendar(shows){
    console.log(shows);
    if(shows.length < 1){
      return "No Upcoming Shows.";
    } else {
      return shows.map((show)=> {
        console.error(show);
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
    console.log(this.props.nearShows);
    return (
          <div className="content">
            <div className="dogs">
              {this.renderDogs()}
              <div id="add" onClick={this.showModal}>
                <i className="fa fa-plus-square-o fa-3x"></i>
              </div>
            </div>
            <div className="sidebar">
              <h3>Next Seven Days</h3>
              {this.renderCalendar(this.props.nearShows)}
              <h3>Next 15 days</h3>
              {this.renderCalendar(this.props.farShows)}
            </div>
            <div className={"modal "+ this.state.modalHelperClass}>
              <div className="modal-content">
                <button className="material" onClick={this.hideModal}>X</button>
                <form className="new-dog" onSubmit={this.addDog} >
                  <input
                    type="file"
                    ref="image"
                    accept="jpeg/png"
                    />
                  <input
                    type="text"
                    ref="name"
                    placeholder="The Name of the Dog"
                    />
                  <input
                    type="text"
                    ref="breed"
                    placeholder="The Breed of the Dog" />
                  <select ref="gender" value="-">
                    <option value="Male">Male</option>
                    <option value="Fixed Male">Fixed Male</option>
                    <option value="Female">Female</option>
                    <option value="Fixed Female">Fixed Female</option>
                  </select>
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
  modalHelperClass : '',
}

Home.defaultProps = {
  dogs: [],
  nearShows: [],
  farShows: [],

}

export default createContainer(() => {
  let ids = [];
  const idsPre = Dogs.find({}, {fields:{_id:1}}).fetch();
  for (let id of idsPre) {
    ids.push(id._id);
  }
  let imageIds = [];
  const imageIdsPre = Dogs.find({}, {fields:{image:1}}).fetch();
  for (let id of imageIdsPre) {
    imageIds.push(id.image);
  }
  let imageStore = {};
  console.log("IMAGE ID");
  for (file of DogImages.find({_id:{$in:imageIds}}).fetch()) {
    imageStore[file._id] = file;
  }
  console.log(imageStore);

  const today = new Date();

  const farEnd = new Date();
  farEnd.setDate(today.getDate() + 20);
  const nearEnd = new Date();
  nearEnd.setDate(today.getDate() + 7);

  const farShowQuery = {
    dog:
      {$in:ids},
    date:{
      $gte: nearEnd,
      $lte: farEnd
    }
  };

  const nearShowQuery = {
    dog:
      {$in:ids},
    date:{
      $gte: today,
      $lt: nearEnd
    }
  };

  console.info(Shows.find(nearShowQuery).fetch());

  return {
    dogs: Dogs.find({}).fetch(),
    farShows: Shows.find(farShowQuery).fetch(),
    nearShows: Shows.find(nearShowQuery).fetch(),
    images: imageStore,
  };
}, Home);
