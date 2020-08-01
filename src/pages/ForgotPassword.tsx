import React, { useState, useEffect } from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { Redirect } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Helmet } from "react-helmet";

//Utilites
import firebase from '../utilities/FirebaseDAO';

//Material UI Components
import {
  Typography,
  Grid,
  TextField,
  Button,
  CircularProgress,
} from '@material-ui/core';

//Custom Components
import { useAuth, AuthConstraint, Constraints, AuthRedirect } from '../components/AuthProvider';
import {
  CenterLoad,
  FormPaper,
  TitleBanner,
  TextLinkButton,
} from '../components/MyComponents';

//Material UI Icons
import {
  LockOpen,
  MailOutline
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
    textBox: {
      minWidth: 300,
    },
    icon: {
      width: 125,
      height: 125,
    },
  }),
);

type FormData = {
  email: string,
}

export const ForgotPassword: React.FC = () => {
  //State Hooks
  const [redirect, setRedirect] = useState<string | null>(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [invalidEmail, setInvalidEmail] = useState(false);
  const [email, setEmail] = useState("");
  const classes = useStyles();
  const auth = useAuth()!

  const { register, handleSubmit, reset, errors } = useForm<FormData>();

  const authConstraint: AuthConstraint = {
    authLevel: 2,
    constraint: Constraints.lessThanLevel
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

  const onSubmit = (formData: FormData) => {
    setLoading(true);
    firebase.auth().sendPasswordResetEmail(formData.email)
      .then(() => {
        setEmail(formData.email);
        setEmailSent(true);
      })
      .catch(() => {
        setLoading(false);
        setInvalidEmail(true);
        reset({ email: '' });
      })
  }


  if (redirect) {
    return <Redirect to={redirect} />
  } else if (pageLoading) {
    return <CenterLoad />
  } else if (emailSent) {
    return (
      <div className={classes.root}>
        <Helmet><title>Password Reset / Reactgram</title></Helmet>
        <Grid container direction='column' alignItems='center' spacing={2}>
          <Grid item>
            <form onSubmit={handleSubmit(onSubmit)} noValidate={true}>
              <FormPaper>
                <Grid item container direction='column' alignItems='center' spacing={4}>
                  <Grid item>
                    <TitleBanner />
                  </Grid>
                  <Grid item className={classes.message}>
                    <Typography variant='subtitle1'>
                      We sent a password reset email to {email}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <LockOpen className={classes.icon} />
                  </Grid>
                  <Grid item className={classes.message}>
                    <Typography variant='subtitle1' color='textSecondary'>
                      In order to reset your password follow the instruction in the password reset email. Check your
                      spam/junk folder if you're unable to find the password rest email.
                </Typography>
                  </Grid>
                </Grid>
              </FormPaper>
            </form>
          </Grid>
          <Grid item>
            <FormPaper>
              <TextLinkButton varient='subtitle1' path='/signin' text="Resetted your password? Sign in here!" />
            </FormPaper>
          </Grid>
        </Grid>
      </div>
    )
  }

  return (
    <div className={classes.root}>
      <Helmet><title>Forgot Password / Reactgram</title></Helmet>
      <Grid container direction='column' alignItems='center' spacing={2}>
        <Grid item>
          <form onSubmit={handleSubmit(onSubmit)} noValidate={true}>
            <FormPaper>
              <Grid item container direction='column' alignItems='center' spacing={4}>
                <Grid item>
                  <TitleBanner />
                </Grid>
                <Grid item className={classes.message}>
                  <Typography variant='subtitle1'>
                    Enter your account email
                </Typography>
                </Grid>
                <Grid item container alignItems='center' spacing={2}>
                  <Grid item>
                    <MailOutline />
                  </Grid>
                  <Grid item>
                    <TextField
                      className={classes.textBox}
                      label="Email"
                      variant="outlined"
                      name="email"
                      type="email"
                      inputRef={register({ required: true })}
                      error={!!errors.email}
                    />
                  </Grid>
                </Grid>
                {invalidEmail &&
                  <Grid item>
                    <Typography variant='body2' color='error'> email not found </Typography>
                  </Grid>
                }
                <Grid item>
                  {loading
                    ? <CircularProgress />
                    : <Button type='submit' variant="contained" color="primary" >Submit</Button>
                  }
                </Grid>
                <Grid item className={classes.message}>
                  <Typography variant='caption' color='textSecondary'>
                    By submitting you account email, we'll send you a password rest email.
                </Typography>
                </Grid>
              </Grid>
            </FormPaper>
          </form>
        </Grid>
        <Grid item>
          <FormPaper>
            <TextLinkButton varient='subtitle1' path='/signin' text="Remembered your password? Sign in here!" />
          </FormPaper>
        </Grid>
        <Grid item>
          <FormPaper>
            <TextLinkButton varient='subtitle1' path='/signup' text="Don't have an account? Sign up here!" />
          </FormPaper>
        </Grid>
      </Grid>
    </div>
  );
}