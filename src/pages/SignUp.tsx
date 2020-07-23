import React, { useState, useEffect } from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { useForm } from "react-hook-form";
import { Redirect } from 'react-router-dom';

//Utilities
import firebase from '../utilities/FirebaseDAO';
import * as FormConstraints from '../utilities/FormConstraints';

//Custom Components
import { useAuth, AuthConstraint, Constraints, AuthRedirect } from '../components/AuthProvider';
import {
  TextLinkButton,
  CenterLoad,
  FormPaper,
  TitleBanner,
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
  FormHelperText,
  CircularProgress
} from '@material-ui/core';

//Material UI Icons
import {
  MailOutline,
  PersonOutlineOutlined,
  PersonPinCircleOutlined,
  LockOutlined,
  VisibilityOutlined,
  VisibilityOffOutlined,
} from '@material-ui/icons'

//Custom Styles
const useStyles = makeStyles(() =>
  createStyles({
    root: {
      flexGrow: 1,
      marginTop: 100,
    },
    textBox: {
      minWidth: 300,
    },
    message: {
      maxWidth: 300
    },
  }),
);

//State
type SignUpFormData = {
  email: string,
  name: string,
  username: string,
  password: string,
}

export const SignUp: React.FC = () => {

  const [showPassword, setShowPassword] = useState(false);
  const [redirect, setRedirect] = useState<string | null>(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [loading, setLoading] = useState(false) //Sign Up Loading
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const classes = useStyles();

  const { register, handleSubmit, errors } = useForm<SignUpFormData>({
    mode: 'onChange',
  });

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
    })
  }, [auth, authConstraint])

  //Page Loading Effect
  useEffect(() => {
    if (auth) {
      setPageLoading(false);
    }
  }, [auth])

  const onSignUp = (data: SignUpFormData) => {
    setLoading(true);
    usernameTaken(data.username).then(taken => {
      if (taken) {
        setErrorMsg('username taken');
        setLoading(false);
      } else {
        firebase.auth().createUserWithEmailAndPassword(data.email.trim(), data.password.trim())
          .then(response => {
            firebase.firestore().collection('users').doc(response.user?.uid).set({
              name: data.name,
              username: data.username
            });
            response.user?.sendEmailVerification().then(() => {
              setRedirect('/verify-email');
            })
          })
          .catch((error) => {
            switch (error.code) {
              case 'auth/email-already-in-use':
                setErrorMsg('email is already in use')
                break;
              default: {
                setErrorMsg('error during sign up')
              }
            }
            setLoading(false);
          })
      }
    })
  };

  const usernameTaken = async (username: string): Promise<boolean> => {
    const data = await firebase
      .firestore()
      .collection('users')
      .where('username', '==', username)
      .limit(1).get();
    return data.size > 0;
  }

  if (redirect) {
    return <Redirect to={redirect} />
  } else if (pageLoading) {
    return <CenterLoad />
  }

  return (
    <div className={classes.root}>
      <Grid container direction='column' alignItems='center' spacing={2}>
        <Grid item>
          <form onSubmit={handleSubmit(onSignUp)} noValidate={true}>
            <FormPaper>
              <Grid item container direction='column' alignItems='center' spacing={4}>
                <Grid item>
                  <TitleBanner />
                </Grid>
                <Grid item className={classes.message}>
                  <Typography variant='subtitle1' color='textSecondary'>
                    Sign up to see photos and videos from your friends.
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
                      inputRef={register({
                        required: FormConstraints.RequiredMessage,
                        pattern: {
                          value: FormConstraints.EmailPattern,
                          message: FormConstraints.InvaildMessage('email')
                        }
                      })}
                      error={!!errors.email}
                      helperText={!!errors.email ? (errors.email as any).message : ""}
                    />
                  </Grid>
                </Grid>
                <Grid item container alignItems='center' spacing={2}>
                  <Grid item>
                    <PersonOutlineOutlined />
                  </Grid>
                  <Grid item>
                    <TextField
                      className={classes.textBox}
                      label="Full Name"
                      variant="outlined"
                      name="name"
                      inputRef={register({
                        required: "required",
                        pattern: {
                          value: FormConstraints.NamePattern,
                          message: FormConstraints.InvaildMessage('name')
                        },
                        minLength: {
                          value: FormConstraints.NameMinLength,
                          message: FormConstraints.MinLengthMessage(FormConstraints.NameMinLength)
                        },
                        maxLength: {
                          value: FormConstraints.NameMaxLength,
                          message: FormConstraints.MaxLengthMessage(FormConstraints.NameMaxLength),
                        }
                      })}
                      error={!!errors.name}
                      helperText={!!errors.name ? (errors.name as any).message : ""}
                    />
                  </Grid>
                </Grid>
                <Grid item container alignItems='center' spacing={2}>
                  <Grid item>
                    <PersonPinCircleOutlined />
                  </Grid>
                  <Grid item>
                    <TextField
                      className={classes.textBox}
                      label="Username"
                      variant="outlined"
                      name="username"
                      inputRef={register({
                        required: FormConstraints.RequiredMessage,
                        pattern: {
                          value: FormConstraints.UsernamePattern,
                          message: FormConstraints.InvaildMessage('username')
                        },
                        maxLength: {
                          value: FormConstraints.UsernameMaxLength,
                          message: FormConstraints.MaxLengthMessage(FormConstraints.UsernameMaxLength)
                        }
                      })}
                      error={!!errors.username}
                      helperText={!!errors.username ? (errors.username as any).message : ""}
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
                        inputRef={register({
                          required: FormConstraints.RequiredMessage,
                          minLength: {
                            value: FormConstraints.PasswordMinLength,
                            message: FormConstraints.MinLengthMessage(FormConstraints.PasswordMinLength)
                          },
                          maxLength: {
                            value: FormConstraints.PasswordMaxLength,
                            message: FormConstraints.MaxLengthMessage(FormConstraints.PasswordMaxLength)
                          }
                        })}
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
                      <FormHelperText error={!!errors.password}>{!!errors.password ? (errors.password as any).message : ""}</FormHelperText>
                    </FormControl>
                  </Grid>
                </Grid>
                {errorMsg &&
                  <Grid item>
                    <Typography variant='body2' color='error'> {errorMsg} </Typography>
                  </Grid>
                }
                <Grid item>
                  {loading
                    ? <CircularProgress />
                    : <Button type='submit' variant="contained" color="primary" >Sign Up</Button>
                  }
                </Grid>
                <Grid item className={classes.message}>
                  <Typography variant='caption' color='textSecondary'>
                    By signing up, you agree to our <b> Terms , Data Policy</b> and <b>Cookies Policy</b> .
                </Typography>
                </Grid>
              </Grid>
            </FormPaper>
          </form>
        </Grid>
        <Grid item>
          <FormPaper>
            <TextLinkButton varient='subtitle1' path='/signin' text="Already have account? Sign in here!" />
          </FormPaper>
        </Grid>
      </Grid>
    </div>
  );
}