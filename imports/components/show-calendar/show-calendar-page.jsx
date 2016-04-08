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


  render() {
    return (
      <div id="internal" className="calendar">
        {this.state.calendar.map((cDate) => {
          if(typeof cDate !== "object"){
            return <div className="empty"></div>;
          } else if(typeof this.props.shows[cDate.getDate()] === "undefined"){
            return <div className="empty"><span className="date">{cDate.getDate()}</span></div>;
          } else {
            return <div className="show">
                    <span className="date">{cDate.getDate()}</span>
                    {this.props.shows[cDate.getDate()].map((show)=>{
                      return <span id={show._id} className="show"> {show.name}</span>;
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
