import React, { useState, useEffect } from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { useForm } from 'react-hook-form';
import { Redirect } from 'react-router-dom';
import { Helmet } from "react-helmet";

//Utilites
import firebase from '../utilities/FirebaseDAO';

//Custom Components
import { useAuth, AuthConstraint, Constraints, AuthRedirect } from '../components/AuthProvider';
import {
  TextLinkButton,
  CenterLoad,
  FormPaper,
  TitleBanner
} from '../components/MyComponents';

//Material UI Components
import {
  Typography,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  CircularProgress,
} from '@material-ui/core';

//Material UI Icons
import {
  MailOutline,
  LockOutlined,
  VisibilityOutlined,
  VisibilityOffOutlined,
} from '@material-ui/icons'

//Custom Styles
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      marginTop: 100,
    },
    textBox: {
      minWidth: 300,
    },
  }),
);

type SignInFormData = {
  email: string,
  password: string,
}

//Main Component
export const SignIn: React.FC = () => {

  //State Hooks
  const [redirect, setRedirect] = useState<string | null>(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [loading, setLoading] = useState(false); //Sign In Loading
  const [showPassword, setShowPassword] = useState(false);
  const [invaildCred, setInvaildCred] = useState(false);


  const classes = useStyles();

  const { register, handleSubmit, reset, errors } = useForm<SignInFormData>();

  const auth = useAuth()!

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


  const onSignIn = (formData: SignInFormData) => {

    setLoading(true)

    firebase.auth().signInWithEmailAndPassword(formData.email, formData.password)
      .then(response => {
        if (!response.user?.emailVerified) {
          response.user?.sendEmailVerification();
          setRedirect('/verify-email');
        }
      })
      .catch(() => {
        setLoading(false);
        setInvaildCred(true);
        reset({ ...formData, password: '' });
      })
  }

  if (redirect) {
    return <Redirect to={redirect} />
  } else if (pageLoading) {
    return <CenterLoad />
  }

  return (
    <div className={classes.root}>
      <Helmet>
        <title>Sign In / Reactgram</title>
      </Helmet>
      <Grid container direction='column' alignItems='center' spacing={2}>
        <Grid item>
          <form onSubmit={handleSubmit(onSignIn)} noValidate={true}>
            <FormPaper>
              <Grid item container direction='column' alignItems='center' spacing={4}>
                <Grid item>
                  <TitleBanner />
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
                <Grid item container alignItems='center' spacing={2}>
                  <Grid item>
                    <LockOutlined />
                  </Grid>
                  <Grid item>
                    <FormControl className={classes.textBox} variant="outlined">
                      <InputLabel htmlFor="outlined-adornment-password" error={!!errors.password}>Password</InputLabel>
                      <OutlinedInput
                        name="password"
                        inputRef={register({ required: true })}
                        type={showPassword ? 'text' : 'password'}
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              color='inherit'
                              aria-label="toggle password visibility"
                              edge="end"
                              onClick={() => setShowPassword(!showPassword)}
                              onMouseDown={(event) => event.preventDefault()}
                            >
                              {showPassword ? <VisibilityOutlined /> : <VisibilityOffOutlined />}
                            </IconButton>
                          </InputAdornment>
                        }
                        labelWidth={70}
                        error={!!errors.password}
                      />
                    </FormControl>
                  </Grid>
                </Grid>
                {invaildCred &&
                  <Grid item>
                    <Typography variant='body2' color='error'> Invalid email or password. </Typography>
                  </Grid>
                }
                <Grid item>
                  {loading
                    ? <CircularProgress />
                    : <Button type='submit' variant="contained" color="primary" >Sign In</Button>
                  }
                </Grid>
                <Grid item>
                  <TextLinkButton varient='caption' path='/forgot-password' text="Forgot your password?" />
                </Grid>
              </Grid>
            </FormPaper>
          </form>
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