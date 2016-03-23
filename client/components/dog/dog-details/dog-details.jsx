// Task component - represents a single todo item
DogDetails = React.createClass({

  // This mixin makes the getMeteorData method work
  mixins: [ReactMeteorData],
  // propTypes: {
  //   // This component gets the task to display through a React prop.
  //   // We can use propTypes to indicate it is required
  //   id: React.PropTypes.string.isRequired
  // },
  userId: 1,

  // Loads items from the Tasks collection and puts them on this.data.tasks
  getMeteorData() {
    console.log(this.props.params.id);
    let query = {_id:this.props.params.id};
    console.log(query);

    return {
      dog: Dogs.findOne({_id:this.props.params.id})

    }
  },



  render() {
    console.log(this.data.dog);
    return (

          <div className="content dog">
            <div className="bar">
              <span>
                <img></img>
              </span>
              <h1>
                {this.data.dog.name}
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
});
