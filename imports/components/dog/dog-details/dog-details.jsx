import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import {Link} from 'react-router';

import { Dogs } from "../../../api/dogs.jsx";
import { Shows } from "../../../api/shows.jsx"

export default class DogDetails extends Component {

  render() {
    return (

          <div className="content dog">
            <div className="bar">
              <span>
                <img></img>
              </span>
              <h1>
                {this.props.dog.name}
              </h1>
            </div>
            <nav>
              <a>add medical document</a>
              <a>add show</a>
              <a>remove dog</a>
            </nav>
            <dig className="specs">
              THIS IS WERE THE DOG SPECS GO
            </dig>
            <div className="calendar">
              Bacon ipsum dolor amet short ribs spare ribs pork loin shoulder ball tip, bacon picanha sausage ground round. Venison doner filet mignon cupim. Kevin cow turkey ribeye short ribs. Leberkas shoulder pig, turkey jerky flank corned beef cupim t-bone meatloaf fatback brisket picanha tail cow. Strip steak t-bone doner shankle. Turkey rump swine flank. Tail rump meatloaf, pork chop beef ribs frankfurter prosciutto cupim drumstick pork hamburger.

Pancetta boudin porchetta shoulder. Leberkas t-bone venison bacon short loin pork chop biltong ham hock pancetta. Pork chop boudin short loin, pork loin turducken andouille short ribs doner filet mignon biltong ground round. Prosciutto rump turducken strip steak.

Leberkas porchetta tri-tip venison cupim. Venison rump jowl biltong tail. Ham ground round andouille fatback shankle sirloin meatball shoulder corned beef brisket drumstick. Chuck filet mignon rump cupim sausage. Turkey ribeye corned beef meatloaf picanha spare ribs ground round tri-tip swine bresaola shank pancetta. Meatball drumstick shoulder turducken hamburger.

Alcatra ribeye tail pork chop. Chicken corned beef pancetta salami, pork chop capicola ham spare ribs swine pastrami venison alcatra. Pork belly jerky beef ribs frankfurter pork chop pancetta drumstick alcatra turkey cow turducken bacon. Tenderloin bacon sirloin tongue kielbasa, sausage turkey biltong salami rump ribeye. Tongue beef ball tip, rump spare ribs tail strip steak flank meatball kevin fatback drumstick. Sirloin picanha ribeye venison meatloaf capicola pancetta short loin.

Chuck tongue cupim, tail pork belly swine capicola beef ham hock. Boudin chicken meatball bacon swine pork loin ribeye. Tri-tip biltong alcatra, kevin meatball cow strip steak salami venison pastrami. Ground round kevin drumstick tongue short loin pork loin porchetta. Picanha strip steak t-bone venison, salami sirloin prosciutto turducken leberkas shoulder shank short ribs.
            </div>
          </div>

    );
  }
};

DogDetails.defaultProps = {
  dog: {},
  shows: [],
}

DogDetails.propTypes = {
  dog: React.PropTypes.object,
  shows: React.PropTypes.array,
}

export default createContainer(({params}) => {
  console.log(params.id);
  let dogQuery = {_id:params.id};
  let showQuery = {dog:params.id};
  // console.log(query);
  return {
    dog: Dogs.findOne(dogQuery),
    shows: Shows.find(showQuery).fetch(),
  };
}, DogDetails);
