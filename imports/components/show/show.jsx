import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Link } from 'react-router';
import { Dogs, DogImages } from "../../api/dogs.js";
import { Shows } from "../../api/shows.js"

const weatherKey = {
  'clear-day': "wi-forecast-io-clear-day",
  'clear-night': "wi-forecast-io-clear-night",
  'rain': "wi-forecast-io-rain",
  'snow': "wi-forecast-io-snow",
  'sleet': "wi-forecast-io-sleet",
  'strong-wind': "wi-forecast-io-wind",
  'fog': "wi-forecast-io-fog",
  'cloudy': "wi-forecast-io-cloudy",
  'partly-cloudy-night': "wi-forecast-io-partly-cloudy-day",
  'partly-cloudy-day': "wi-forecast-io-partly-cloudy-night",
  'hail': "wi-forecast-io-hail",
  'thunderstorm': "wi-forecast-io-thunderstorm",
  'tornado': "wi-forecast-io-tornado",
};

export default class ShowPage extends Component {
  constructor(props) {
    super(props);
    this.setScore = this.setScore.bind(this);

  }

  setScore(event){
    console.log(event);
    event.preventDefault();
    Meteor.call("calendar.score", this.props.show._id, this.refs.result.value);
  }

  iconify(preIcon){
    return "wi " + weatherKey[preIcon];
  }

  renderWeather(){
    if(this.props.show.weather.hourly){
      // console.log(this.props.show.weather.hourly);
      return(
        this.props.show.weather.hourly.map((hour)=>{
          // console.log(hour.time);
          const time = new Date(hour.time*1000);
          // console.log(time);
          return(
            <div className="hour">
              <div className="icon">
                <i className={this.iconify(hour.icon)}></i>
                H:{time.getHours()}
              </div>
              <div className="details">
                Temp: {hour.apparentTemperature}<br></br>
                Summary: {hour.summary}
              </div>
            </div>
          )
        })
      )
    } else {
      return (
        <div className="error">
          No weather loaded yet.
        </div>
      )
    }
  }

  renderScore(){
    const today = new Date();
    if(this.props.show.score){
      if(this.props.show.score ==="none"){
        return(
          <div className="cheer">
            <span>Better Luck next time</span>
          </div>
        );
      } else {
        return(
          <div className="final-score">
            Very good! {this.props.dog.name} took {this.props.show.score}.
          </div>
        )
      }

    } else if (!this.props.show.score && this.props.show.date < today) {
      console.log(this.props.show.date);
      console.log(today);
      return(
        <div className="score-form">
          <form onSubmit={this.setScore}>
            <label htmlFor="result">How did you place?</label>
              <select id="result" ref="result">
                <option value="none">NONE</option>
                <option value="Reserve">Reserve</option>
                <option value="Best of Opposites">Best of Opposites</option>
                <option value="Select Dog">Select Dog</option>
                <option value="Best of Breed">Best of Breed</option>
                <option value="Group">Group</option>
                <option value="Reserve Show">Reserve Show</option>
                <option value="Best in Show">Best in Show</option>
              </select>
              <input type="submit" className></input>
          </form>
        </div>
      )
    } else {
      return(
        <div className="cheer">
          <span>GOOD LUCK AT THE SHOW!</span>
        </div>
      );
    }
  }



  render() {
    return (
          <div className="wrapper show">
            <div id="show-display">
              <div id="title">
                <div id="map">
                  <img src={this.props.show.mapUrl}></img>
                </div>
                <div id="tags">
                  <h1>{this.props.show.name}</h1>
                  <h3>{this.props.show.location}</h3>
                  <h4>{this.props.show.weather.summary}</h4>
                </div>
              </div>
              <div id="dog">
                <div className="thumb-image">
                  <img src={this.props.images.url({store:'thumbs'})}></img>
                </div>
                <h1>
                  {this.props.dog.name} - {this.props.dog.breed}
                </h1>
              </div>
              <div id="score">
                {this.renderScore()}
              </div>
              <div id="bottom">
                <div id="judges">
                  <div className="error">
                    No Judges found.
                  </div>
                </div>
                <div id="weather">
                  {this.renderWeather()}

                </div>
              </div>
            </div>
          </div>

    );
  }
};

ShowPage.defaultProps = {
  dog: {},
  show: {
    weather:{
      hourly: ''
    }
  },
  images: {
    url(){
      return '';
    }
  },
}

ShowPage.propTypes = {
  // dog: React.PropTypes.object,
  showId: React.PropTypes.object,
  show: React.PropTypes.object,
  dog: React.PropTypes.object,
}

export default createContainer(({params}) => {
  console.log(params);
  // console.log(this.props);
  // Meteor.subscribe("dog", params.id);
  Meteor.subscribe("show",params.showId);
  const show = Shows.findOne({});
  let dog = {image: null};
  let images = {
      url(){
        return '';
      }
  };
  if(typeof show !== 'undefined'){
    Meteor.subscribe("dog",show.dog);
    dog = Dogs.findOne({_id:show.dog});
    if(typeof dog !== 'undefined'){
      console.log("IMAGES LOADED");
      Meteor.subscribe("dogImages", dog.image);
      images = DogImages.findOne({});
    }
    console.log("Dog LOADED");
  }
  console.log(images);


  console.log(show);
  return {
    // dog: Dogs.find(),
    show,
    dog,
    images,
    // image: DogImages.findOne({_id:imageId.image}),
  };
}, ShowPage);
