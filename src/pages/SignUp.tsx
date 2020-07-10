import React, { useState } from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { useForm } from "react-hook-form";
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

//Utilities
import * as Constraints from '../utilities/FormConstraints';

//Custom Components
import { TextLinkButton } from '../components/TextLinkButton';

//Material UI Components
import {
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  FormHelperText,
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
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      marginTop: 100,
    },
    paper: {
      padding: theme.spacing(2),
      minWidth: 400,
      textAlign: 'center',
    },
    title: {
      fontFamily: 'Satisfy',
    },
    textBox: {
      minWidth: 350,
    },
    message: {
      maxWidth: 300
    },
  }),
);


type SignUpFormData = {
  email: String,
  name: String,
  username: String,
  password: String,
}

export const SignUp: React.FC = () => {
  const classes = useStyles();
  const { register, handleSubmit, errors } = useForm<SignUpFormData>({
    mode: 'onChange',
  });
  const [showPassword, setShowPassword] = useState(false);
  const { executeRecaptcha } = useGoogleReCaptcha();

  const onSubmit = async (data: SignUpFormData) => {
    if (!executeRecaptcha) {
      return;
    }
    const result = await executeRecaptcha('signUpPage');
    console.log(result);
    console.log(data)
  };

  return (
    <div className={classes.root}>
      <Grid container direction='column' alignItems='center' spacing={2}>
        <Grid item>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Paper className={classes.paper}>
              <Grid item container direction='column' alignItems='center' spacing={4}>
                <Grid item>
                  <Typography className={classes.title} variant='h3'>Reactgram</Typography>
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
                      type="input"
                      inputRef={register({
                        required: Constraints.RequiredMessage,
                        pattern: {
                          value: Constraints.EmailPattern,
                          message: Constraints.InvaildMessage('email')
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
                          value: Constraints.NamePattern,
                          message: Constraints.InvaildMessage('name')
                        },
                        minLength: {
                          value: Constraints.NameMinLength,
                          message: Constraints.MinLengthMessage(Constraints.NameMinLength)
                        },
                        maxLength: {
                          value: Constraints.NameMaxLength,
                          message: Constraints.MaxLengthMessage(Constraints.NameMaxLength),
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
                        required: Constraints.RequiredMessage,
                        pattern: {
                          value: Constraints.UsernamePattern,
                          message: Constraints.InvaildMessage('username')
                        },
                        maxLength: {
                          value: Constraints.UsernameMaxLength,
                          message: Constraints.MaxLengthMessage(Constraints.UsernameMaxLength)
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
                          required: Constraints.RequiredMessage,
                          minLength: {
                            value: Constraints.PasswordMinLength,
                            message: Constraints.MinLengthMessage(Constraints.PasswordMinLength)
                          },
                          maxLength: {
                            value: Constraints.PasswordMaxLength,
                            message: Constraints.MaxLengthMessage(Constraints.PasswordMaxLength)
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
                <Grid item>
                  <Button type='submit' variant="contained" color="primary" >Sign Up</Button>
                </Grid>
                <Grid item className={classes.message}>
                  <Typography variant='caption' color='textSecondary'>
                    By signing up, you agree to our <b> Terms , Data Policy</b> and <b>Cookies Policy</b> .
                </Typography>
                </Grid>
              </Grid>
            </Paper>
          </form>
        </Grid>
        <Grid item>
          <Paper className={classes.paper}>
            <TextLinkButton varient='subtitle1' path='/signin' text="Already have account? Sign in here!" />
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}