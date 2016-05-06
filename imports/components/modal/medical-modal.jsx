import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import {Link} from 'react-router';
import { Meteor } from 'meteor/meteor';

import { Dog, MedicalDocuments } from "../../api/dogs.js"

// Task component - represents a single todo item
export default class MedicalModal extends Component{

  constructor(props) {
    super(props);
    this.addMedical = this.addMedical.bind(this);
  }

  addMedical(event){
    event.preventDefault();

    let modal = this;

    const file = MedicalDocuments.insert(this.refs.document.files[0]);

    const medical = {
      title: this.refs.title.value,
      dog: this.props.dog._id,
      // expires: new Date(this.refs.expires.value),
      assosiatedDocument: file._id,
      metrics: null,
      dateCreated: new Date(),
    };

    if(this.refs.expires){
      medical['expires'] = new Date(this.refs.expires.value);
    }


    const medicalId = Meteor.call("dog.medical", medical, function(err, result){
      if(err){
        console.log(err);
      } else {
        if(medical.expires){
          Meteor.call("google.documentExpireEvent", medical);
        }
        modal.props.dismiss();
      }
    });
  }


  render() {
    return (
      <section>
        <form onSubmit={this.addMedical}>
          <input ref="document" type="file"/>
          <input ref="title" type="text" placeholder="title"/>
          <input ref="expires" type="date" />
          <button type="submit"> Add form to Dog</button>
        </form>
      </section>

    );
  }
};


MedicalModal.defaultProps = {
  dog: {},
}

MedicalModal.propTypes = {
  dog: React.PropTypes.object,
}
