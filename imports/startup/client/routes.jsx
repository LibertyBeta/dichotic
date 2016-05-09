import React from 'react';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';

// route components
import App from '../../components/app/app.jsx';
import Home from '../../components/home/home.jsx';
import NotFoundPage from '../../components/NotFoundPage/NotFoundPage.jsx';
import DogDetails from '../../components/dog/dog-details/dog-details.jsx';
import DogWrapper from '../../components/dog/dog-wrapper/dog-wrapper.jsx';
import ShowPage from '../../components/show/show.jsx';
import JudgeDetail from '../../components/judge/judge-detail.jsx';
import JudgeGrid from '../../components/judge/judge-grid.jsx';
import UserSettingsPage from '../../components/userSettings/user-settings.jsx';
import Genealogy from '../../components/genealogy/genealogy.jsx';



export const renderRoutes = () => (
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={Home} />
      <Route path="test" component={NotFoundPage} />
      <Route path="settings" component={UserSettingsPage} />
      <Route path="dog" component={DogWrapper}>
        <Route path=":id/genealogy" component={Genealogy}/>
        <Route path=":id" component={DogDetails}/>
      </Route>
      <Route path="/genealogy/:id" component={Genealogy} />
      <Route path="judge" component={JudgeGrid}>
        <Route path="/judge/:id" component={JudgeDetail} />
      </Route>
      <Route path="/show/:showId" component={ShowPage} />

      <Route path="*" component={NotFoundPage} />
      {/* ... */}
    </Route>
  </Router>
);
