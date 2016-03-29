import React, { Component, PropTypes } from 'react';
// import { createContainer } from 'meteor/react-meteor-data';
import {Link} from 'react-router';

// Task component - represents a single todo item
export default class ControlBar extends Component{

// ControlBar = React.createClass({
//   propTypes: {
//     // This component gets the task to display through a React prop.
//     // We can use propTypes to indicate it is required
//     user: React.PropTypes.number.isRequired
//   },
  render() {
    return (
      <div className="control-bar">
        <i className="fa fa-2x fa-cog icon"></i>
        <i className="fa fa-2x fa-cog icon"></i>
      </div>
    );
  }
};
