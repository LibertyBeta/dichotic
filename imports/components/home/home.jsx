import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Dogs } from "../../api/dogs.jsx";
import { Shows } from "../../api/shows.jsx"
import Dog from "../dog/dog-tag/dog.jsx"
import ShowCalendarSidebar from "../show-calendar/show-calendar-sidebar.jsx"



// Task component - represents a single todo item
export default class Home extends Component {
  constructor(props) {
    super(props);
    this.addDog = this.addDog.bind(this);
  }

  renderDogs(){
    return this.props.dogs.map((dog) => {
      // return "test";
      return <Dog key={dog._id} dog={dog} />;
    });
  }

  addDog(event){
    event.preventDefault();
    console.log("none");
    console.log(this.refs.name);
    let dog = {
      name: this.refs.name.value,
      breed: this.refs.breed.value,
      color: this.refs.color.value
    };

    let id = Dogs.insert(dog);
    let calendarEvent = {
      date: new Date("tomorrow"),
      dog: id,
      title: "Event for " + dog.name,
      location: "some PLACE"
    };
    Shows.insert(calendarEvent);
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

  render() {
    return (

          <div className="content">
            <div className="dogs">
              {this.renderDogs()}
              <div className="dog form">
                <form className="new-dog" onSubmit={this.addDog} >
                  <input
                    type="text"
                    ref="name"
                    placeholder="Type to add new tasks" />
                  <input
                    type="text"
                    ref="breed"
                    placeholder="Type to add new tasks" />
                  <input
                    type="text"
                    ref="color"
                    placeholder="Type to add new tasks" />
                  <input type="submit"></input>
                </form>
              </div>


            </div>
            <div className="sidebar">
              {this.renderCalendar()}
            </div>
          </div>
    );
  }
}

export default createContainer(() => {
  return {
    dogs: Dogs.find({}).fetch(),
    shows: Shows.find({}).fetch(),
  };
}, Home);
