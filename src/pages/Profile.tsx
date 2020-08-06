import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { TransitionProps } from '@material-ui/core/transitions/transition';

//Material UI Components
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActionArea,
  Typography,
  CardActions,
  Button,
  Avatar,
  IconButton,
  TextField,
  Dialog,
  DialogContent,
  Slide,
} from '@material-ui/core';

//Material UI Icons
import {
  LocationOnOutlined,
  DateRangeOutlined,
  CakeOutlined,
} from '@material-ui/icons'


//Custom Components
import { useAuth, AuthConstraint, Constraints, AuthRedirect } from '../components/AuthProvider';
import {
  CenterLoad,
  Post,
} from '../components/MyComponents';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      [theme.breakpoints.up('sm')]: {
        minWidth: 500,
        maxWidth: 500,
      },
    },

    avatarLarge: {
      width: theme.spacing(12),
      height: theme.spacing(12),
      marginTop: -70,
      color: 'black',
      boxShadow: "0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23)",
      fontSize: 32,
      borderStyle: 'solid',
      borderColor: 'white',
      borderWidth: 2,

    },
    header: {
      boxShadow: "0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23)",
      width: "100%"
    },
    textField: {
      width: '100%',
      marginBottom: 20,
    },
  }),
);

//Dialog Animation
const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement<any, any> },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});


export const Profile: React.FC = () => {
  const auth = useAuth()!
  const classes = useStyles();
  const [pageLoading, setPageLoading] = useState(true);
  const [redirect, setRedirect] = useState<string | null>(null);
  const [open, setOpen] = React.useState<boolean>(false);

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

  return (
    <div>
      <Helmet><title>My Profile / Reactgram</title></Helmet>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        onClose={() => { setOpen(false); }}
      >
        <DialogContent>
          <Grid container direction='column'>
            <Grid item container justify='flex-end' style={{ padding: 10 }}>
              <Button size="small" color="primary" variant='contained'>Save</Button>
            </Grid>
            <Grid item>
              <CardActionArea>
                <CardMedia
                  height='140'
                  component="img"
                  alt="Profile Header"
                  image="https://i.pinimg.com/originals/1c/3f/76/1c3f76c36819dcff58b9b9a1ebb5a990.jpg"
                  title="Profile Header"
                  className={classes.header}
                />
              </CardActionArea>
            </Grid>
            <Grid item>
              <IconButton>
                {auth.photoURL
                  ? <Avatar className={classes.avatarLarge} src={auth.photoURL} />
                  : <Avatar className={classes.avatarLarge}>{auth.name?.charAt(0).toUpperCase()}</Avatar>
                }
              </IconButton>
            </Grid>
            <Grid item container direction='column' style={{ padding: 10 }}>
              <Grid item>
                <TextField
                  label="Name"
                  variant="outlined"
                  className={classes.textField}
                  helperText='0/20'
                />
              </Grid>
              <Grid item>
                <TextField
                  label="Bio"
                  variant="outlined"
                  className={classes.textField}
                  helperText='0/20'
                />
              </Grid>
              <Grid item>
                <TextField
                  label="Location"
                  variant="outlined"
                  className={classes.textField}
                  helperText='0/20'
                />
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
      <Grid container direction='column' alignItems='center' spacing={4} >
        <Grid item>
          <Card className={classes.root}>
            <CardMedia
              height='140'
              component="img"
              alt="Profile Header"
              image="https://i.pinimg.com/originals/1c/3f/76/1c3f76c36819dcff58b9b9a1ebb5a990.jpg"
              title="Profile Header"
              className={classes.header}
            />
            <CardContent>
              {auth.photoURL
                ? <Avatar className={classes.avatarLarge} src={auth.photoURL} />
                : <Avatar className={classes.avatarLarge}>{auth.name?.charAt(0).toUpperCase()}</Avatar>
              }
              <Typography variant="h5" component="h2">
                {auth.name}
              </Typography>
              <Typography variant='subtitle1' color='textSecondary'>
                @dumpweed
                </Typography>
              <Typography gutterBottom variant='body1'>
                This is my cool bio. What do you think? It's cool right? Yup that's what I thought!
                Why am I talking to myself. Damn I type so slow.
                </Typography>
              <Grid container spacing={1}>
                <Grid item>
                  <Grid container>
                    <Grid item>
                      <LocationOnOutlined color='disabled' />
                    </Grid>
                    <Grid item>
                      <Typography variant='subtitle1' color='textSecondary'>
                        McAllen, TX
                    </Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item>
                  <Grid container>
                    <Grid item>
                      <CakeOutlined color='disabled' />
                    </Grid>
                    <Grid item>
                      <Typography variant='subtitle1' color='textSecondary'>
                        Born January 27, 1997
                    </Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item>
                  <Grid container>
                    <Grid item>
                      <DateRangeOutlined color='disabled' />
                    </Grid>
                    <Grid item>
                      <Typography variant='subtitle1' color='textSecondary'>
                        Joined August 2020
                    </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </CardContent>

            <CardActions>
              <Button size="small" color="primary" onClick={() => { setOpen(true); }}>
                Edit profile
              </Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item>
          <Post />
        </Grid>
      </Grid>
    </div >
  )
}