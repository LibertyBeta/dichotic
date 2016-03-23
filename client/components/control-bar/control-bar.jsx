ControlBar = React.createClass({
  propTypes: {
    // This component gets the task to display through a React prop.
    // We can use propTypes to indicate it is required
    user: React.PropTypes.number.isRequired
  },
  render() {
    return (
      <div className="control-bar">Icons go here. </div>
    );
  }
});
