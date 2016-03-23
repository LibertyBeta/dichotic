// Task component - represents a single todo item
ShowCalendarSidebar = React.createClass({
  propTypes: {
    // This component gets the task to display through a React prop.
    // We can use propTypes to indicate it is required
    show: React.PropTypes.object.isRequired
  },


  render() {
    return (
      <div className="calendar">
        <p>{this.props.show.title}</p>
        <p>{this.props.show.location}</p>
        <p>{this.props.show.date.toString()}</p>
      </div>
    );
  }
});
