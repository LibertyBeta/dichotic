import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import {Link} from 'react-router';

// Task component - represents a single todo item
export default class ShowCalendarSidebar extends Component{



  render() {
    return (
      <div className="calendar">
        <p>{this.props.show.title}</p>
        <p>{this.props.show.location}</p>
        <p>{this.props.show.date.toString()}</p>
      </div>
    );
  }
};


ShowCalendarSidebar = {
  // This component gets the task to display through a React prop.
  // We can use propTypes to indicate it is required
  show: React.PropTypes.object.isRequired
}
