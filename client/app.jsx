const {Router, Route, IndexRoute, browserHistory} = ReactRouter;



App = React.createClass({
  userId:2,
  render: function() {
    return (
      <div className="container">
        <ControlBar user={this.userId}/>
        <div className="body">
          {/*}<div className="top">
            stuff goes here!
          </div>*/}
          {this.props.children}
        </div>
      </div>
    );
  }
});

Meteor.startup(function() {
  ReactDOM.render((
    <Router history={browserHistory}>
      <Route path="/" component={App}>
        <IndexRoute component={Home} />
        <Route path="test" component={NotFoundPage} />
        <Route path="dog" component={DogDetails}>
          <Route path="/dog/:id" component={DogDetails} />
        </Route>
        <Route path="*" component={NotFoundPage} />
        {/* ... */}
      </Route>
    </Router>
  ), document.getElementById('render-target'));
});
