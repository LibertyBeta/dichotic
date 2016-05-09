import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import {Link} from 'react-router';
import { Meteor } from 'meteor/meteor';

import { Dogs, MedicalDocuments } from "../../api/dogs.js"

// Task component - represents a single todo item
export default class Genealogy extends Component{

  constructor(props) {
    super(props);
  }

  

  render() {
    return (
      <section>
        <canvas id="genealogy-chart"></canvas>
      </section>

    )
  }
};


Genealogy.defaultProps = {
  dog: {},

}

Genealogy.propTypes = {
  dog: React.PropTypes.object,
}

export default createContainer(({params}) => {
  Meteor.subscribe("dogs");

  return {

  }
}, Genealogy)
