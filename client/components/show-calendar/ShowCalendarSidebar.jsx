// Task component - represents a single todo item
ShowCalendarSidebar = React.createClass({
  propTypes: {
    // This component gets the task to display through a React prop.
    // We can use propTypes to indicate it is required
    data: React.PropTypes.object.isRequired
  },


  render() {
    return (
      <div className="calendar">

        {this.props.data}
      </div>
    );
  }
});
