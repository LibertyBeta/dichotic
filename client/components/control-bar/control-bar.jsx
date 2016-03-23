ControlBar = React.createClass({
  propTypes: {
    // This component gets the task to display through a React prop.
    // We can use propTypes to indicate it is required
    user: React.PropTypes.number.isRequired
  },
  render() {
    return (
      <div className="control-bar">
        <i className="fa fa-2x fa-cog icon"></i>
        <i className="fa fa-2x fa-cog icon"></i>
      </div>
    );
  }
});
