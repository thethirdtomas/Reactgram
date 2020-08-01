import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { AuthProvider } from './components/AuthProvider';
import { Scaffold } from './components/Scaffold';

//Pages
import { SignIn } from './pages/SignIn';
import { SignUp } from './pages/SignUp';
import { VerifyEmail } from './pages/VerifyEmail';
import { ForgotPassword } from './pages/ForgotPassword';
import { Home } from './pages/Home';
import { Likes } from './pages/Likes';
import { Profile } from './pages/Profile';
import { Settings } from './pages/Settings';

export const App: React.FC = () => (
  <Router>
    <AuthProvider>
      <Router>
        <Scaffold>
          <Switch>
            <Route path='/' exact component={SignIn} />
            <Route path='/signin' component={SignIn} />
            <Route path='/signup' component={SignUp} />
            <Route path='/verify-email' component={VerifyEmail} />
            <Route path='/forgot-password' component={ForgotPassword} />
            <Route path='/home' component={Home} />
            <Route path='/likes' component={Likes} />
            <Route path='/profile' component={Profile} />
            <Route path='/settings' component={Settings} />
          </Switch>
        </Scaffold>
      </Router>
    </AuthProvider>
  </Router>
)