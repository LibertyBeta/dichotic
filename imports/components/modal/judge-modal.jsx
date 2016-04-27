import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import {Link} from 'react-router';

import { Judges } from "../../api/judges.js"

// Task component - represents a single todo item
export default class JudgeModal extends Component{
  constructor(props) {
    super(props);
    this.addJudge = this.addJudge.bind(this);

    this.state = {
      addresses: []
    };
  }

  addJudge(event){
    event.preventDefault();
    let modal = this;
    const judge = {
      name: this.refs.name.value,
      breed: null,
      metrics: null,
      dateCreated: new Date(),
    };
    console.log(modal.props.showId);
    const judgeId = Meteor.call("judge.insert", judge, function(err, result){
      if(err){
        console.log(err);
      } else {
        if(modal.props.showId){
          console.log("Adding judge to calendar");
          Meteor.call("calendar.addJudge", modal.props.showId, result);
          modal.props.dismiss();
        }
      }
    });





  }


  render() {
    return (
      <section>
        <form onSubmit={this.addJudge}>
          <h3>Add a Show for this Dog</h3>
          <label htmlFor="judge-name">Name of the Show</label>
          <input name="judge-name" id="event-name" ref="name" type="text" placeholder="Sally Grissim" />

          <button type="submit">Create Judge</button>

        </form>
      </section>
    );
  }
};



JudgeModal.defaultProps = {
  dog: {},
}

JudgeModal.propTypes = {
  dog: React.PropTypes.object,
}
