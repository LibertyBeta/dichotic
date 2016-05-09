import React, { Component } from 'react';

export default class DogWrapper extends Component {
  render() {
    return (
      <section>  {this.props.children}</section>
    );
  }
}
