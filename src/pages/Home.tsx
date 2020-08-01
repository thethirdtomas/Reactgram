import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { Helmet } from "react-helmet";

//Material UI Components
import {
  Grid,
} from '@material-ui/core';


//Custom Components
import { useAuth, AuthConstraint, Constraints, AuthRedirect } from '../components/AuthProvider';
import {
  CenterLoad,
  Post,
} from '../components/MyComponents';

export const Home: React.FC = () => {
  const auth = useAuth()!
  const [pageLoading, setPageLoading] = useState(true);
  const [redirect, setRedirect] = useState<string | null>(null);

  const authConstraint: AuthConstraint = {
    authLevel: 1,
    constraint: Constraints.greaterThanLevel
  }

  //Redirect Effect
  useEffect(() => {
    AuthRedirect({
      auth: auth,
      authConstraint: authConstraint,
      redirectTo: '/signin',
      redirectHook: setRedirect
    });
  }, [auth, authConstraint])

  //Page Loading Effect
  useEffect(() => {
    if (auth) {
      setPageLoading(false);
    }
  }, [auth]);

  //auth redirect
  if (redirect) {
    return <Redirect to={redirect} />
  } else if (pageLoading) {
    return <CenterLoad />
  }


  let posts = [];
  for (let i = 0; i < 50; i++) {
    posts.push(
      <Grid item>
        <Post />
      </Grid>
    );
  }

  return (
    <div>
      <Helmet><title>Home / Reactgram</title></Helmet>
      <Grid container direction='column' alignItems='center' spacing={4} >
        {posts}
      </Grid>
    </div>

  )
}