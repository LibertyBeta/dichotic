import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import {Link} from 'react-router';

import { Shows } from "../../api/shows.js"

// Task component - represents a single todo item
export default class ShowModal extends Component{
  constructor(props) {
    super(props);
    this.addShow = this.addShow.bind(this);
    this.addressChange = this.addressChange.bind(this);
    this.setRealAddress = this.setRealAddress.bind(this);
    this.state = {
      addresses: []
    };
  }

  addShow(event){
    event.preventDefault();
    let modal = this;
    const calendarEvent = {
      name: this.refs.title.value,
      location: this.refs.location.value,
      date: new Date(this.refs.start.value),
      time: this.refs.start.value,
      dateEnd: new Date(this.refs.end.value),
      dog: this.props.dog._id,
      judge: "TBA",
      weather: "TBA",
      score: null,
      judges: [],
      // color: this.refs.color.value
    };
    Meteor.call("calendar.insert", calendarEvent, function(error, result) {
      if(error){
        console.error(error);
      } else {
        console.log(result);
        modal.props.dismiss();
      }
    });


  }

  addressChange(event){
    console.log(event.target);
    let modal = this;
    Meteor.call("calendar.getAddreses", event.target.value, function(error, result) {
      if(error){
        console.error(error);
      } else {
        console.log(result);
        const tempAddress = []
        for(address of result){
          tempAddress.push({key: address.place_id, formatted:address.formatted_address});
        }
        modal.setState({
          addresses: tempAddress
        });
        console.log(modal.state.addresses);
      }
    });
  }

  setRealAddress(value){
    console.log(value)
    this.refs.location.value = value;
    this.setState({
      addresses: []
    });
  }

  hideSuggestions(){
    // alert("HIdding");
    this.setState({
      addresses: []
    });
  }

  render() {
    return (
      <section>
        <form onSubmit={this.addShow}>
          <h3>Add a Show for this Dog</h3>
          <label htmlFor="event-name">Name of the Show</label>
          <input name="event-name" id="event-name" ref="title" type="text" placeholder="title" onFocus={()=>this.hideSuggestions()} required/>
          <label htmlFor="location">Location of the Show</label>
          <input name="location" id="location" ref="location" type="text" placeholder="Location" onChange={this.addressChange} onFocus={this.addressChange} required/>
          <ul>
            {this.state.addresses.map((possible)=>{
              return <li onClick={()=>this.setRealAddress(possible.formatted)} value={possible.key} key={possible.key}> {possible.formatted}</li>
            })}
          </ul>
          <label htmlFor="start">Start</label>
          <input id="start" name="start" ref="start" type="datetime-local" onFocus={()=>this.hideSuggestions()} required/>
          <label htmlFor="end">End</label>
          <input id="end" name="end" ref="end" type="datetime-local" onFocus={()=>this.hideSuggestions()} required/>
          <button type="submit">Create Event</button>

        </form>
      </section>
    );
  }
};



ShowModal.defaultProps = {
  dog: {},
}

ShowModal.propTypes = {
  dog: React.PropTypes.object,
}
