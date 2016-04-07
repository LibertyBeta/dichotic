import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import {Link} from 'react-router';

// Task component - represents a single todo item
export default class MedicalModal extends Component{



  render() {
    return (
      <section>
        <form>
          <input ref="document" type="file"/>
          <input ref="title" type="text" placeholder="title"/>
          <input ref="expires" type="date" />
          <button type="submit"> Add form to Dog</button>
        </form>
      </section>

    );
  }
};


ShowCalendarSidebar = {
  // This component gets the task to display through a React prop.
  // We can use propTypes to indicate it is required
  dog: React.PropTypes.object.isRequired
}
