import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import {Link} from 'react-router';
import { Shows } from '../../api/shows.js';

// Task component - represents a single todo item
export default class ShowCalendarSidebar extends Component{
  constructor(props) {
    super(props);
    this.iconify = this.iconify.bind(this);


  }

  iconify(preIcon){
    // console.log(this.props);
    // if(this.props.weather){
      // return <i className="wi wi-"+ this.props.weather.icon></i>
      return "wi " + preIcon;
    // } else{
      // return "";
    // }
  }

  render() {
    return (
      <section>
        {(() => {
          if(this.props.shows.lenght < 1) {
            return "No upcoming shows";
          }

        })()}
        {this.props.shows.map((show)=>{
        return (
          <div className="calendar" key={show._id}>
            <div className="date">{show.date.getFullYear()} - {show.date.getMonth() + 1} - {show.date.getUTCDate()}</div>
            <div className="weather"><i className={this.iconify(show.weather.icon)}></i></div>
            <div className="name">{show.name}</div>
            <div className="location">{show.location}</div>
          </div>
        )
        })}
      </section>
    );
  }
};


ShowCalendarSidebar.defaultProps = {
  show: {
    weather:{
      icon: "wi-cloud-refresh"
    }
  },
  shows: []
}

export default createContainer(({params}) => {
  Meteor.subscribe('shows')


  const query = {
    dog:{$in:params.ids},
    $and:[ {date:{ $gt: params.start}} , {date:{ $lte: params.end}}]
  };
  console.log(Shows.find(query).fetch());

  return {
    shows: Shows.find(query).fetch(),
  };
}, ShowCalendarSidebar);
