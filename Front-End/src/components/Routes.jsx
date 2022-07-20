import React from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';

import { Results } from './Results';
import { TutorProfile } from "./tutorProfile/TutorProfile";
import { ChatRoom } from "./chat/ChatRoom"
import {useStateContext} from "../contexts/StateContextProvider";
export const Routes = () => {
    const {user} = useStateContext();
    return (
        <Switch>
            <Route exact path="/"
                   render={() => <Results/>}
            />
            <Route exact path="/chats"
                   render={() => user.username !== undefined ? <ChatRoom/> : <Redirect to={{ pathname: '/' }} />}
            />
            <Route path="/:id"
                   render={() => <TutorProfile/>}
            />
        </Switch>
    );
}
