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
      <div className="container">
        <ControlBar user={this.userId}/>
        <div className="body">
          {/*}<div className="top">
            stuff goes here!
          </div>*/}
          <div className="content">
            <div className="dog bar">
              <span>
                <img></img>
              </span>
              <h1>
                {this.data.dog.name}
              </h1>
            </div>
          </div>
        </div>
      </div>
    );
  }
});
