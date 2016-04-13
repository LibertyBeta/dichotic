import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { browserHistory, Link} from 'react-router';
import { createContainer } from 'meteor/react-meteor-data';
import { Dogs, DogImages } from '../../api/dogs.js';
import { Shows } from '../../api/shows.js';
import Dog from '../dog/dog-tag/dog.jsx';
import ShowCalendarSidebar from '../show-calendar/show-calendar-sidebar.jsx';
import ShowPage from '../show/show.jsx';



// Task component - represents a single todo item
export default class Home extends Component {
  constructor(props) {
    super(props);
    this.addDog = this.addDog.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.showModal = this.showModal.bind(this);
    this.state = {
      modalHelperClass : "hidden",
      dogName : ""
    };
  }

  renderDogs(){
    return this.props.dogs.map((dog) => {
      // return "test";
      return <Dog key={dog._id} dog={dog} image={this.props.images[dog.image]} />;
    });
  }

  renderUnratedShows(){
    if(this.props.unreatedShows.length > 0){
      return this.props.unreatedShows.map((show) => {
        return(
          <div className='unrated-show' key={show._id}>
            How did you do at they {show.name} show? <Link to={`/show/${show._id}`}><i className="fa fa-arrow-circle-o-right"></i></Link>
          </div>
        )
      });
    }
  }

  addDog(event){
    event.preventDefault();
    const file = DogImages.insert(this.refs.image.files[0]);
    // let file = DogImages.insert(this.refs.image.files[0]);

    const dog = {
      image: file._id,
      name: this.refs.name.value,
      breed: this.refs.breed.value,
      gender: this.refs.gender.value,
      // color: this.refs.color.value
    };
    // console.log(dog);
    // const id = Dogs.insert(dog);
    Meteor.call("dog.insert", dog, function(error, result){
      console.info("FINISHED INSERT");

      console.log(result);
      if(error){
        console.log(error);
      } else {
        browserHistory.push('/dog/'+result);
      }
    });
  }

  // renderCalendar(shows){
  //   if(shows.length < 1){
  //     return "No Upcoming Shows.";
  //   } else {
  //     return shows.map((show)=> {
  //         return <ShowCalendarSidebar key={show._id} show={show} />;
  //       });
  //   }
  //
  // }

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
          <div className="content">

            <div className="dogs">
              {this.renderDogs()}
              <div id="add" onClick={this.showModal}>
                <i className="fa fa-plus-square-o fa-3x"></i>
              </div>
            </div>
            <div className="sidebar">
              {this.renderUnratedShows()}
              <h3>Next Seven Days</h3>
                <ShowCalendarSidebar
                  params={{
                    ids:this.props.dogIds,
                    start:this.props.today,
                    end:this.props.nearEnd
                  }} shows={this.props.unreatedShows}></ShowCalendarSidebar>
              <h3>Next 15 days</h3>
                <ShowCalendarSidebar
                  params={{
                    ids:this.props.dogIds,
                    start:this.props.nearEnd,
                    end:this.props.farEnd
                  }}></ShowCalendarSidebar>
            </div>
            <div className={"modal "+ this.state.modalHelperClass}>
              <div className="modal-content">
                <button className="material" onClick={this.hideModal}>X</button>
                <form className="new-dog" onSubmit={this.addDog} >
                  <input
                    type="file"
                    ref="image"
                    accept="jpeg/png"
                    />
                  <input
                    type="text"
                    ref="name"
                    placeholder="The Name of the Dog"
                    />
                  <input
                    type="text"
                    ref="breed"
                    placeholder="The Breed of the Dog" />
                  <select ref="gender">
                    <option value="Male">Male</option>
                    <option value="Fixed Male">Fixed Male</option>
                    <option value="Female">Female</option>
                    <option value="Fixed Female">Fixed Female</option>
                  </select>
                  <input
                    type="text"
                    ref="breed"
                    placeholder="The Breed of the Dog" />
                  <input type="submit"></input>
                </form>
              </div>
            </div>
          </div>
    );
  }
}

Home.defaultState = {
  id: 1,
  modalHelperClass : '',
}

Home.defaultProps = {
  dogs: [],
  nearShows: [],
  farShows: [],
  unreatedShows: [],
  today: new Date(),
  nearEnd: new Date(),
  farEnd: new Date(),
  dogIds: []

}

export default createContainer(({params}) => {
  Meteor.subscribe('shows')
  Meteor.subscribe('dogs')
  Meteor.subscribe('dogsImages')


  const ids = [];
  const idsPre = Dogs.find({}, {fields:{_id:1}}).fetch();
  for (let id of idsPre) {
    ids.push(id._id);
  }
  Meteor.subscribe('ourShows', ids);


  const imageIds = [];
  const imageIdsPre = Dogs.find({}, {fields:{image:1}}).fetch();
  for (let id of imageIdsPre) {
    imageIds.push(id.image);
  }
  const imageStore = {};
  for (file of DogImages.find({_id:{$in:imageIds}}).fetch()) {
    imageStore[file._id] = file;
  }
  const today = new Date();
  const farEnd = new Date();
  farEnd.setDate(today.getDate() + 20);
  const nearEnd = new Date();
  nearEnd.setDate(today.getDate() + 7);
  today.setDate(today.getDate() - 1);

  
  const pastQuery = {
    dog:
      {$in:ids},
    date:{
      $lt: today
    },
    rated: null
  };
  // console.log(ids);

  return {
    dogs: Dogs.find({}).fetch(),
    unreatedShows: Shows.find(pastQuery).fetch(),
    images: imageStore,
    dogIds: ids,
    today: today,
    nearEnd: nearEnd,
    farEnd: farEnd,
    // aShow: showId,
  };
}, Home);
