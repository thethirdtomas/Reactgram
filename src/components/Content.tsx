import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import { SignIn } from '../pages/SignIn';
import { SignUp } from '../pages/SignUp';
import { VerifyEmail } from '../pages/VerifyEmail';
import { ForgotPassword } from '../pages/ForgotPassword';
import { Home } from '../pages/Home';

export const Content: React.FC = () => {

    return (

        <Router>
            <Switch>
                <Route path='/' exact component={SignIn} />
                <Route path='/signin' component={SignIn} />
                <Route path='/signup' component={SignUp} />
                <Route path='/verify-email' component={VerifyEmail} />
                <Route path='/forgot-password' component={ForgotPassword} />
                <Route path='/home' component={Home} />
            </Switch>
        </Router>

    );
}