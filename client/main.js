import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import { renderRoutes } from '../imports/startup/client/routes.jsx';
import React from 'react';

export default class HelloWorld extends React.Component {
  render() {
    return (
      <h1>Hello World</h1>
    );
  }
}


Meteor.startup(() => {
  // render(<HelloWorld/>, document.getElementById('render-target'));
  console.log("starting up router");
  render(renderRoutes(), document.getElementById('render-target'));
});
