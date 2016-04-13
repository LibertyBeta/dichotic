import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import {Link} from 'react-router';

// Task component - represents a single todo item
export default class ShowCalendarPage extends Component{
  constructor(props) {
    super(props);

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

      calendar: calendarDays,
    };
  }

  iconify(args){
    // console.log(this.props);
    // if(this.props.weather){
      // return <i className="wi wi-"+ this.props.weather.icon></i>
      return "wi " + args;
    // } else{
      // return "";
    // }
  }


  render() {
    return (
      <div id="internal" className="calendar">
        {this.state.calendar.map((cDate) => {
          if(typeof cDate !== "object"){
            return <div className="empty"></div>;
          } else if(typeof this.props.shows[cDate.getDate()] === "undefined"){
            return <div className="empty"><div className="date">{cDate.getDate()}</div></div>;
          } else {
            return <div className="show">
                    <div className="date">{cDate.getDate()}</div>
                    {this.props.shows[cDate.getDate()].map((show)=>{
                      return  (
                        <div id={show._id} className="show">
                          {show.name}
                        </div>
                      );
                    })}
                    </div>;
          }
        })}
      </div>
    );
  }
};


ShowCalendarPage = {
  // This component gets the task to display through a React prop.
  // We can use propTypes to indicate it is required
  shows: React.PropTypes.object.isRequired
}

ShowCalendarPage.defaultProps = {
  shows: [],
}
