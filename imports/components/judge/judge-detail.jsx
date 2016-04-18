import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { browserHistory, Link} from 'react-router';
import { createContainer } from 'meteor/react-meteor-data';
import { Dogs } from '../../api/dogs.js';
import { Shows } from '../../api/shows.js';
import { Judges } from '../../api/judges.js';



// Task component - represents a single todo item
export default class JudgeDetail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modalHelperClass : "hidden",
      dogName : ""
    };
  }



  render() {
    return (
          <div className="sidebar">

            JUDGE details!!!!
          </div>
    );
  }
}

JudgeDetail.defaultState = {
  id: 1,
  modalHelperClass : '',
}

JudgeDetail.defaultProps = {
  dogs: [],
  nearShows: [],
  farShows: [],
  unreatedShows: [],
  today: new Date(),
  nearEnd: new Date(),
  farEnd: new Date(),
  dogIds: []

}

export default createContainer(({params}) => {
  Meteor.subscribe("judges");

  console.log(params.lenght);

  return {

  };
}, JudgeDetail);
