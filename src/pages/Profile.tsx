import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

/*Utilities*/
import firebase from '../utilities/FirebaseDAO';

/*Material UI Components*/
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Button,
  Avatar,
} from '@material-ui/core';

/*Material UI Icons*/
import {
  LocationOnOutlined,
  DateRangeOutlined,
  CakeOutlined,
} from '@material-ui/icons'


/*Costum Components*/
import { useAuth, AuthConstraint, Constraints, AuthRedirect } from '../components/AuthProvider';
import { EditProfileDialog } from '../components/EditProfileDialog'
import {
  CenterLoad,
  Post,
} from '../components/MyComponents';

/*Types*/
import {
  ProfileData, EditProfileData
} from '../types/myTypes';


/*Styles*/
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      [theme.breakpoints.up('sm')]: {
        width: 500,
      },
    },

    avatarLarge: {
      width: theme.spacing(12),
      height: theme.spacing(12),
      marginTop: -70,
      marginBottom: 10,
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
  }),
);

export const Profile: React.FC = () => {
  const auth = useAuth()!
  const classes = useStyles();
  const [pageLoading, setPageLoading] = useState(true);
  const [redirect, setRedirect] = useState<string | null>(null);
  const [open, setOpen] = React.useState<boolean>(false);
  const [profileData, setProfileData] = React.useState<ProfileData>();
  const authConstraint: AuthConstraint = {
    authLevel: 1,
    constraint: Constraints.greaterThanLevel
  }

  /*Functions*/

  const openEditProfile = () => {
    setOpen(true);
  }

  const closeEditProfile = () => {
    setOpen(false);
  }

  const saveEditedProfileData = (data: EditProfileData) => {
    setProfileData({
      ...profileData!,
      name: data.name,
      bio: data.bio,
      location: data.location,
      birthDate: data.birthDate ? firebase.firestore.Timestamp.fromDate(new Date(data.birthDate)) : null,
    });
  }


  /*Effects*/

  //Profile Data
  useEffect(() => {
    if (auth && auth.authLevel > 1) {
      firebase.firestore().collection('users')
        .doc(auth.uid).get().then((snapshot) => {
          if (snapshot.exists) {
            setProfileData({
              name: snapshot.data()!.name,
              username: snapshot.data()!.username,
              joined: snapshot.data()!.joined,
              bio: snapshot.data()!.bio,
              location: snapshot.data()!.location,
              birthDate: snapshot.data()!.birthDate,
              photoURL: snapshot.data()!.photoURL,
              headerURL: snapshot.data()!.headerURL,
            })
          }
        })
    }
  }, [auth]);

  //Redirect
  useEffect(() => {
    AuthRedirect({
      auth: auth,
      authConstraint: authConstraint,
      redirectTo: '/signin',
      redirectHook: setRedirect
    });
  }, [auth, authConstraint])

  //Page Loading
  useEffect(() => {
    if (auth && profileData) {
      setPageLoading(false);
    }
  }, [auth, profileData]);

  //auth redirect
  if (redirect) {
    return <Redirect to={redirect} />
  } else if (pageLoading) {
    return <CenterLoad />
  }

  return (
    <div>
      <Helmet><title>My Profile / Reactgram</title></Helmet>
      <EditProfileDialog
        auth={auth}
        profileData={profileData}
        open={open}
        onClose={closeEditProfile}
        onSave={saveEditedProfileData}
      />
      <Grid container direction='column' alignItems='center' spacing={4} >
        <Grid item>
          <Card className={classes.root}>
            <CardMedia
              height='140'
              component="img"
              alt="Profile Header"
              image={profileData?.headerURL ? profileData.headerURL : "https://i.pinimg.com/originals/1c/3f/76/1c3f76c36819dcff58b9b9a1ebb5a990.jpg"}
              title="Profile Header"
              className={classes.header}
            />
            <CardContent>
              <Avatar className={classes.avatarLarge} src={profileData?.photoURL ? profileData.photoURL : ''} />
              <Typography variant="h5" component="h2">
                {profileData?.name}
              </Typography>
              <Typography variant='subtitle1' color='textSecondary'>
                @{profileData?.username}
              </Typography>

              {profileData?.bio &&
                <Typography gutterBottom variant='body1'>{profileData.bio} </Typography>
              }

              <Grid container spacing={1}>
                {profileData?.location &&
                  <Grid item>
                    <Grid container>
                      <Grid item>
                        <LocationOnOutlined color='disabled' />
                      </Grid>
                      <Grid item>
                        <Typography variant='subtitle1' color='textSecondary'>
                          {profileData.location}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                }
                {profileData?.birthDate &&
                  <Grid item>
                    <Grid container>
                      <Grid item>
                        <CakeOutlined color='disabled' />
                      </Grid>
                      <Grid item>
                        <Typography variant='subtitle1' color='textSecondary'>
                          Born  {new Intl.DateTimeFormat("en-US", {
                          year: "numeric",
                          day: "2-digit",
                          month: "long",
                        }).format(profileData.birthDate.toDate())}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                }
                {profileData?.joined &&
                  <Grid item>
                    <Grid container>
                      <Grid item>
                        <DateRangeOutlined color='disabled' />
                      </Grid>
                      <Grid item>
                        <Typography variant='subtitle1' color='textSecondary'>
                          Joined {new Intl.DateTimeFormat("en-US", {
                          year: "numeric",
                          month: "long",
                        }).format(profileData.joined.toDate())}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                }
              </Grid>
            </CardContent>

            <CardActions>
              <Button size="small" color="primary" onClick={openEditProfile}>
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