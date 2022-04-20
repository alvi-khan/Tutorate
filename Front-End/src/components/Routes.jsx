import React from 'react';
import { Switch, Route } from 'react-router-dom';

import { Results } from './Results';
import { TutorProfile } from "./TutorProfile";
import { ChatRoom } from "./chat/ChatRoom"
export const Routes = () => (
  <Switch>
    <Route exact path="/">
      <Results />
    </Route>
    <Route exact path="/req">
        <ChatRoom />
    </Route>
      <Route path="/:id">
          <TutorProfile />
      </Route>
    
  </Switch>
);
