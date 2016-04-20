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

            {this.props.judge.name}<br></br>
          {this.props.judge.breed}
          </div>
    );
  }
}

JudgeDetail.defaultState = {
  id: 1,
  modalHelperClass : '',
}

JudgeDetail.defaultProps = {
  judge: [],

}

export default createContainer(({params}) => {
  Meteor.subscribe("judge",params.id);
  const judge = Judges.findOne({});

  console.log(judge);

  return {
    judge,
  };
}, JudgeDetail);
