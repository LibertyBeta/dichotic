import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import {Link} from 'react-router';

import { Shows } from "../../api/shows.jsx"

// Task component - represents a single todo item
export default class ShowModal extends Component{
  constructor(props) {
    super(props);
    this.addShow = this.addShow.bind(this);

  }

  addShow(event){
    event.preventDefault();
    const calendarEvent = {
      name: this.refs.title.value,
      location: this.refs.location.value,
      date: new Date(this.refs.date.value),
      dog: this.props.dog._id,
      judge: "TBA",
      weather: "TBA",
      // color: this.refs.color.value
    };
    console.log(calendarEvent)
    console.log(Shows.insert(calendarEvent));
    this.props.dismiss();
  }

  render() {
    return (
      <section>
        <form onSubmit={this.addShow}>
          <h3>Add a Show for this Dog</h3>
          <label htmlFor="event-name">Name of the Show</label>
          <input name="event-name" id="event-name" ref="title" type="text" placeholder="title"/>
          <label htmlFor="location">Location of the Show</label>
          <input name="location" id="location" ref="location" type="text" placeholder="Location"/>
          <label htmlFor="date">Date</label>
          <input id="date" name="date" ref="date" type="date" />
          <button type="submit">Create Event</button>
        </form>
      </section>
    );
  }
};


ShowCalendarSidebar = {
  // This component gets the task to display through a React prop.
  // We can use propTypes to indicate it is required
  dog: React.PropTypes.object.isRequired
}
