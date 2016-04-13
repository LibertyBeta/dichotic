import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import {Link} from 'react-router';
import { Shows } from '../../api/shows.js';

// Task component - represents a single todo item
export default class ShowCalendarSidebar extends Component{
  constructor(props) {
    super(props);
    // this.iconify = this.iconify.bind(this);
    //
    // // this.state{
    // //   class: "wi wi-" +this.props.weather.icon;
    // // }

  }


  render() {
    return (
      <section>
        test
      </section>
    );
  }
};


ShowCalendarSidebar = {
  // This component gets the task to display through a React prop.
  // We can use propTypes to indicate it is required
}

ShowCalendarSidebar.defaultProps = {
  shows: [],
}

ShowCalendarSidebar.proptypes = {
  shows: React.PropTypes.array,
}


export default createContainer(({params}) => {
  // Meteor.subscribe('shows');
  const shows = [];
  return {
    shows,
  };
}, ShowCalendarSidebar);
