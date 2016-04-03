import React from 'react';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';

// route components
import App from '../../components/app/app.jsx';
import Home from '../../components/home/home.jsx';
import NotFoundPage from '../../components/NotFoundPage/NotFoundPage.jsx';
import DogDetails from '../../components/dog/dog-details/dog-details.jsx';



export const renderRoutes = () => (
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
);
