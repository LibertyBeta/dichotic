import React, { Component } from 'react';
import ControlBar from "../control-bar/control-bar.jsx"

console.log()
// App component - represents the whole app
export default class App extends Component {
  render() {
    console.log("rendering home app");
    return (
      <div className="container">
        <ControlBar user={this.userId}/>
        <div className="body">
          {/*}<div className="top">
            stuff goes here!
          </div>*/}
          {this.props.children}
        </div>
      </div>
    );
  }
}
