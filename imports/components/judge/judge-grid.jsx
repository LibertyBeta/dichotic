import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { browserHistory, Link} from 'react-router';
import { createContainer } from 'meteor/react-meteor-data';
import { Dogs } from '../../api/dogs.js';
import { Shows } from '../../api/shows.js';
import { Judges } from '../../api/judges.js';

import JudgeModal from '../modal/judge-modal.jsx';



// Task component - represents a single todo item
export default class JudgeGrid extends Component {
  constructor(props) {
    super(props);
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.state = {
      modalHelperClass : "hidden",
    }
  }

  showModal(){
    this.setState({
      modalHelperClass: ""
    });
  }

  hideModal(){
    this.setState({
      modalHelperClass: "hidden"
    });
  }


  render() {
    return (
          <div className="content">
            <div className={"modal "+ this.state.modalHelperClass}>
              <div className="modal-content">
                <button onClick={this.hideModal}>X</button>
                <JudgeModal dismiss={this.hideModal} showId={this.props.showId}></JudgeModal>
              </div>
            </div>
            <div className="judges">
              {this.props.judges.map((judge)=>{
                return (
                  <div className="judge" key={judge._id}>
                    <h3>{judge.name}</h3>
                    <Link to={`/judge/${judge._id}`}><i className="fa fa-arrow-circle-o-right"></i></Link>
                  </div>
                )
              })}
              <div id="add" onClick={this.showModal}>
                <i className="fa fa-plus-square-o fa-3x"></i>
              </div>
            </div>

            {this.props.children}

          </div>
    );
  }
}

JudgeGrid.defaultProps = {
  judges: [],
}

export default createContainer(({params}) => {
  // Meteor.subscribe("judges");
  let judges = [];
  if(params.ids === undefined){

    Meteor.subscribe("judges");
    const showId = false;
  } else {

    Meteor.subscribe("showJudges", params.ids);
    const showId = params.showId;
  }

  judges = Judges.find({}).fetch();

  return {
    judges,
    showId: params.showId
  };
}, JudgeGrid);
