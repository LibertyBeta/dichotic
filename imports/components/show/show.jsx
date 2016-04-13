import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Link } from 'react-router';



import { Dogs, DogImages } from "../../api/dogs.js";
import { Shows } from "../../api/shows.js"

export default class ShowPage extends Component {
  constructor(props) {
    super(props);


  }


  render() {
    return (
          <div className="modal show">
            <div id="show-display">
              SHOW DATA HERE.
            </div>
          </div>

    );
  }
};

ShowPage.defaultProps = {
  dog: {},
  shows: [],
  image: {
    url(){
      return '';
    }
  },
  backgroundUrl : '',
  modals:{
    'remove':"remove",
    'show':"show",
    'medical':"medical"
  }
}

ShowPage.propTypes = {
  // dog: React.PropTypes.object,
  showId: React.PropTypes.object,
}

export default createContainer(({params}) => {
  console.log(params);
  // console.log(this.props);
  // Meteor.subscribe("dog", params.id);
  Meteor.subscribe("show",params.showId);


  return {
    // dog: Dogs.find(),
    show: Shows.findOne(),
    // image: DogImages.findOne({_id:imageId.image}),
  };
}, ShowPage);
