import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import {Link} from 'react-router';

// Task component - represents a single todo item
export default class ShowCalendarSidebar extends Component{
  constructor(props) {
    super(props);
    this.iconify = this.iconify.bind(this);

    // this.state{
    //   class: "wi wi-" +this.props.weather.icon;
    // }

  }

  iconify(){
    console.log(this.props);
    // if(this.props.weather){
      // return <i className="wi wi-"+ this.props.weather.icon></i>
      return "wi wi-"+ this.props.show.weather.icon;
    // } else{
      // return "";
    // }
  }

  render() {
    return (
      <div className="calendar">
        <div>{this.props.show.name}</div>
        <div>{this.props.show.location}</div>
        <div>{this.props.show.weather.summary}</div>
        <i className={this.iconify()}></i>
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

ShowCalendarSidebar.defaultProps = {
  show: {
    weather:{
      icon: "wi-cloud-refresh"
    }
  },
}
