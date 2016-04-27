import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Link } from 'react-router';
import { Dogs, DogImages } from "../../api/dogs.js";
import { Shows } from "../../api/shows.js"
import { Calendar, Oauth } from "../../api/oauth.js"



export default class UserSettingsPage extends Component {
  constructor(props) {
    super(props);
  }




  render() {
    return (
          <div className="wrapper">
            {(() => {
              if(this.props.authorized === true){
                return(
                  <section>
                    Google : True<br/>
                  Calendar : {(() => {
                    if(this.props.authorized === true ) return 'True';
                    else return 'False';
                  })()}
                  </section>
                );
              } else {
                return(
                  <section>
                    <a href="/cal">Go Authorize</a>
                  </section>
                );
              }
            })()}
          </div>

    );
  }
};

UserSettingsPage.defaultProps = {

}

UserSettingsPage.propTypes = {
  // dog: React.PropTypes.object,
  // showId: React.PropTypes.object,
  // show: React.PropTypes.object,
  // dog: React.PropTypes.object,
}

export default createContainer(({params}) => {
  console.log(params);
  Meteor.subscribe("oauth");
  Meteor.subscribe("calendar");
  let authorized = false;
  if(Oauth.find().count() > 0){
    console.info("AUTHORIZED");
    authorized = true;
  }

  let calendar = false;
  if(Calendar.find().count() > 0){
    console.info("CALENARD");
    calendar = true;
  }




  // console.log(show);
  return {
    authorized: authorized,
    calendar: calendar
  };
}, UserSettingsPage);
