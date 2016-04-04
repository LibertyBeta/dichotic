import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import {Link} from 'react-router';

import { Dogs, DogImages } from "../../../api/dogs.jsx";
import { Shows } from "../../../api/shows.jsx"

export default class DogDetails extends Component {
  constructor(props) {
    super(props);
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.state = {
      modalHelperClass : "hidden",
    };
  }

  hideModal(){
    this.setState({
      modalHelperClass: 'hidden',
    });
  }

  showModal(){
    this.setState({
      modalHelperClass: '',
    });
  }

  render() {
    return (
          <div className="content dog">
            <div className="bar" >
              {/*<img className="backgrounded" src={this.props.image.url()}></img>*/}
              <div className="thumb-image">
                <img src={this.props.image.url({state:'thumbs'})}></img>
              </div>
              <h1>
                {this.props.dog.name}
              </h1>

            </div>
            <nav>
              <button>add medical document</button>
              <button>add show</button>
              <button>remove dog</button>
            </nav>
            <dig className="specs">
              THIS IS WERE THE DOG SPECS GO
            </dig>
            <div className="calendar">
              <button onClick={this.showModal}>Add event</button>
              Bacon ipsum dolor amet short ribs spare ribs pork loin shoulder ball tip, bacon picanha sausage ground round. Venison doner filet mignon cupim. Kevin cow turkey ribeye short ribs. Leberkas shoulder pig, turkey jerky flank corned beef cupim t-bone meatloaf fatback brisket picanha tail cow. Strip steak t-bone doner shankle. Turkey rump swine flank. Tail rump meatloaf, pork chop beef ribs frankfurter prosciutto cupim drumstick pork hamburger.
            </div>
            <div className={"modal "+ this.state.modalHelperClass}>
              <div className="modal-content">
                <button onClick={this.hideModal}>X</button>
                <form>
                FORM FOR MODAL HERE.
                </form>
              </div>
            </div>
          </div>

    );
  }
};

DogDetails.defaultProps = {
  dog: {},
  shows: [],
  image: {
    url(){
      return '';
    }
  }
}

DogDetails.propTypes = {
  dog: React.PropTypes.object,
  shows: React.PropTypes.array,
}

export default createContainer(({params}) => {
  console.log(params.id);
  let dogQuery = {_id:params.id};
  let showQuery = {dog:params.id};
  let imageId = Dogs.findOne(dogQuery, {fields:{image:true}});
  if(typeof imageId === 'undefined'){
    imageId = {
      image:""
    };
  }
  return {
    dog: Dogs.findOne(dogQuery),
    shows: Shows.find(showQuery).fetch(),
    image: DogImages.findOne({_id:imageId.image}),
  };
}, DogDetails);
