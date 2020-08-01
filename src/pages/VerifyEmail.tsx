import React, { useState, useEffect } from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { Redirect } from 'react-router-dom';
import { Helmet } from 'react-helmet';

//Material UI Components
import {
  Typography,
  Grid,
  Button
} from '@material-ui/core';

//Custom Components
import { useAuth, AuthConstraint, Constraints, AuthRedirect } from '../components/AuthProvider';
import {
  CenterLoad,
  FormPaper,
  TitleBanner,
} from '../components/MyComponents';

//Material UI Icons
import {
  MailOutline,
} from '@material-ui/icons'

//Custom Styles
const useStyles = makeStyles(() =>
  createStyles({
    root: {
      flexGrow: 1,
      marginTop: 100,
    },
    message: {
      maxWidth: 300
    },
    icon: {
      width: 125,
      height: 125,
    },
  }),
);

export const VerifyEmail: React.FC = () => {
  //State Hooks
  const [redirect, setRedirect] = useState<string | null>(null);
  const [pageLoading, setPageLoading] = useState(true);
  const classes = useStyles();
  const auth = useAuth()!

  const authConstraint: AuthConstraint = {
    authLevel: 1,
    constraint: Constraints.equalToLevel
  }

  //Redirect Effect
  useEffect(() => {
    AuthRedirect({
      auth: auth,
      authConstraint: authConstraint,
      redirectTo: '/home',
      redirectHook: setRedirect
    });
  }, [auth, authConstraint])

  //Page Loading Effect
  useEffect(() => {
    if (auth) {
      setPageLoading(false);
    }
  }, [auth]);

  if (redirect) {
    return <Redirect to={redirect} />
  } else if (pageLoading) {
    return <CenterLoad />
  }

  return (
    <div className={classes.root}>
      <Helmet><title>Email Sent / Reactgram</title></Helmet>
      <Grid container direction='column' alignItems='center' spacing={2}>
        <Grid item>
          <FormPaper>
            <Grid item container direction='column' alignItems='center' spacing={4}>
              <Grid item>
                <TitleBanner />
              </Grid>
              <Grid item className={classes.message}>
                <Typography variant='subtitle1'>
                  We sent a verification email to {auth.email}
                </Typography>
              </Grid>
              <Grid item>
                <MailOutline className={classes.icon} />
              </Grid>
              <Grid item className={classes.message}>
                <Typography variant='subtitle1' color='textSecondary'>
                  Please verify your email in order to start using Reactgram. Check your
                  spam/junk folder if you're unable to find the verification email.
                </Typography>
              </Grid>
            </Grid>
          </FormPaper>
        </Grid>
        <Grid item>
          <FormPaper>
            <Button onClick={() => window.location.reload()} >
              <Typography variant='subtitle1'>Verified your email? Click here!</Typography>
            </Button>
          </FormPaper>
        </Grid>
      </Grid>
    </div>
  );
}