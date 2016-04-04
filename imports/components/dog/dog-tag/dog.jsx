import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Link, browserHistory } from 'react-router';

export default class Dog extends Component {
  constructor(props) {
    super(props);
    this.goDetails = this.goDetails.bind(this);
  }

  goDetails(){
    browserHistory.push('/dog/'+this.props.dog._id);
  }

  render() {
    return (
      <div className="dog tag" onClick={this.goDetails}>
        <div className="thumb-image">
          <img src={this.props.image.url({store:"thumbs"})}></img>
        </div>
        <h1>{this.props.dog.name}</h1>
        // <span>{this.props.dog.breed}</span>
        // <span>{this.props.dog.color}</span>
        <Link to={`/dog/${this.props.dog._id}`}>details</Link>
      </div>
    );
  }
};

Dog.defaultProps = {
  image : {
    url(){ return null}
  },
}

Dog.propTypes = {
  // This component gets the task to display through a React prop.
  // We can use propTypes to indicate it is required
  dog: React.PropTypes.object.isRequired,
  image: React.PropTypes.object.isRequired
};
