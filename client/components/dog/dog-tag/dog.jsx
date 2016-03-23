const {Link} = ReactRouter;

Dog = React.createClass({
  propTypes: {
    // This component gets the task to display through a React prop.
    // We can use propTypes to indicate it is required
    dog: React.PropTypes.object.isRequired
  },


  render() {
    return (
      <div className="dog tag">
        <span className="image">
          <img></img>
        </span>
        <h1>{this.props.dog.name}</h1>
        <span>{this.props.dog.breed}</span>
        <span>{this.props.dog.color}</span>
        <Link to={`/dog/${this.props.dog._id}`}>details</Link>
      </div>
    );
  }
});
