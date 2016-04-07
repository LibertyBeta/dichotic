import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import {Link} from 'react-router';

// Task component - represents a single todo item
export default class ShowCalendarSidebar extends Component{



  render() {
    return (
      <div className="calendar">
        <div>{this.props.show.name}</div>
        <div>{this.props.show.location}</div>
        <div>{this.props.show.date.getFullYear()} - {this.props.show.date.getMonth() + 1} - {this.props.show.date.getDate()}</div>
      </div>
    );
  }
};


ShowCalendarSidebar = {
  // This component gets the task to display through a React prop.
  // We can use propTypes to indicate it is required
  show: React.PropTypes.object.isRequired
}
