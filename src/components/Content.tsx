import React from 'react';
import { BrowserRouter as Router, Switch, Route} from 'react-router-dom';

import { SignIn } from '../pages/SignIn';
import { SignUp } from '../pages/SignUp';

export const Content: React.FC = () => {
    return (
        <Router>
            <Switch>
                <Route path='/' exact component={SignIn}/>
                <Route path='/signin' component={SignIn}/>
                <Route path='/signup' component={SignUp}/>
            </Switch>
        </Router>
    );
}