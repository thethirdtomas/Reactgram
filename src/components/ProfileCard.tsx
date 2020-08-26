import React, { useState, useEffect } from 'react';
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
import { EditProfileDialog } from '../components/EditProfileDialog';
import {
  CenterLoad,
} from '../components/MyComponents';

/*Types*/
import {
  ProfileData,
  EditProfileData
} from '../types/myTypes';

/*Styles*/
const styles = makeStyles(({ spacing, breakpoints }: Theme) =>
  createStyles({
    avatarLarge: {
      width: spacing(12),
      height: spacing(12),
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

/*Props*/
type Props = {
  uid: string | undefined
  editable?: boolean
}

export const ProfileCard: React.FC<Props> = ({ uid, editable }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [profileData, setProfileData] = useState<ProfileData>();
  const [openEditProfile, setOpenEditProfile] = useState<boolean>(false);
  const classes = styles();

  const handleOpenEditProfile = () => {
    setOpenEditProfile(true);
  }

  const handleCloseEditProfile = () => {
    setOpenEditProfile(false);
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

  useEffect(() => {
    if (uid) {
      firebase.firestore().collection('users')
        .doc(uid).get().then((snapshot) => {
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
        }).then(() => {
          setLoading(false);
        });
    }

  }, [uid]);

  if (loading) {
    return <CenterLoad />
  }

  return (
    <div>
      <EditProfileDialog
        uid={uid!}
        profileData={profileData}
        open={openEditProfile}
        onClose={handleCloseEditProfile}
        onSave={saveEditedProfileData}
      />
      <Card>
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

        {editable &&
          <CardActions>
            <Button size="small" color="primary" onClick={handleOpenEditProfile}>
              Edit profile
            </Button>
          </CardActions>
        }
      </Card>
    </div>
  )
}