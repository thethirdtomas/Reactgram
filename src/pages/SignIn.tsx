import React, { useState } from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { useForm } from 'react-hook-form';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

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
  }),
);

//State
interface State {
  invalidCred: boolean
  showPassword: boolean
}

type SignInFormData = {
  email: String,
  password: String,
}

//Main Component
export const SignIn: React.FC = () => {

  const [state, setState] = useState<State>({
    invalidCred: false,
    showPassword: false,
  })

  const { executeRecaptcha } = useGoogleReCaptcha();
  const classes = useStyles();

  const { register, handleSubmit, errors } = useForm<SignInFormData>();

  const onSubmit = async (data: SignInFormData) => {
    if (!executeRecaptcha) {
      return;
    }
    
    setState({...state, invalidCred: !state.invalidCred})
    const result = await executeRecaptcha('signInPage');
    console.log(result);
    console.log(data);
  }

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
                        type={state.showPassword ? 'text' : 'password'}
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              color='inherit'
                              aria-label="toggle password visibility"
                              edge="end"
                              onClick={() => setState({...state, showPassword: !state.showPassword})}
                            >
                              {state.showPassword ? <VisibilityOutlined /> : <VisibilityOffOutlined />}
                            </IconButton>
                          </InputAdornment>
                        }
                        labelWidth={70}
                        error={!!errors.password}
                      />
                    </FormControl>
                  </Grid>
                </Grid>
                {state.invalidCred &&
                  <Grid item>
                    <Typography variant='body2' color='error'> Invalid email or password. </Typography>
                  </Grid>
                }
                <Grid item>
                  <Button type='submit' variant="contained" color="primary" >Sign In</Button>
                </Grid>
                <Grid item>
                  <TextLinkButton varient='caption' path='/signup' text="Forgot your password?" />
                </Grid>
              </Grid>
            </Paper>
          </form>
        </Grid>
        <Grid item>
          <Paper className={classes.paper}>
            <TextLinkButton varient='subtitle1' path='/signup' text="Don't have an account? Sign up here!" />
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}