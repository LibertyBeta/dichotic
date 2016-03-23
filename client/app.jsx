const {Router, Route, IndexRoute, browserHistory} = ReactRouter;



App = React.createClass({
  render: function() {
    return (
      <div>
          {this.props.children}
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
