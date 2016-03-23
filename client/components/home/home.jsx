// Task component - represents a single todo item
Home = React.createClass({

  // This mixin makes the getMeteorData method work
  mixins: [ReactMeteorData],
  userId: 1,

  // Loads items from the Tasks collection and puts them on this.data.tasks
  getMeteorData() {
    return {
      dogs: Dogs.find({}).fetch(),
      shows: Shows.find({}).fetch(),
    }
  },
  renderDogs(){
    return this.data.dogs.map((dog) => {
      return <Dog key={dog._id} dog={dog} />;
    });
  },
  addDog(event){
    event.preventDefault();
    console.log("none");
    console.log(this.refs.name.value);
    let dog = {
      name: this.refs.name.value,
      breed: this.refs.breed.value,
      color: this.refs.color.value
    };

    Dogs.insert(dog);
  },
  renderCalendar(){
    // console.log(this.data.shows.length);
    if(this.data.shows.length < 1){
      // console.log("No events to see");
      return 'No upcoming events';
    } else {
      return this.data.shows.map((show)=> {
        return <ShowCalendarSidebar data={show} />;
      });
    }

  },

  render() {
    return (

          <div className="content">
            <div className="dogs">
              {this.renderDogs()}
              <div className="dog form">
                <form className="new-dog" onSubmit={this.addDog} >
                  <input
                    type="text"
                    ref="name"
                    placeholder="Type to add new tasks" />
                  <input
                    type="text"
                    ref="breed"
                    placeholder="Type to add new tasks" />
                  <input
                    type="text"
                    ref="color"
                    placeholder="Type to add new tasks" />
                  <input type="submit"></input>
                </form>
              </div>


            </div>
            <div className="sidebar">
              {this.renderCalendar()}
            </div>
          </div>
    );
  }
});
