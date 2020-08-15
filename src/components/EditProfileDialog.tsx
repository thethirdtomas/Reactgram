import React, { useState, useEffect, useRef } from 'react';
import { TransitionProps } from '@material-ui/core/transitions/transition';
import { useForm } from "react-hook-form";
import { makeStyles, createStyles, Theme, useTheme } from '@material-ui/core/styles';
import DateFnsUtils from '@date-io/date-fns';
import useMediaQuery from '@material-ui/core/useMediaQuery';

//Utilities
import firebase from '../utilities/FirebaseDAO';
import * as FormConstraints from '../utilities/FormConstraints';

//Types
import {
  EditProfileData,
  ProfileData,
} from '../types/myTypes'

//Material UI Components
import {
  Grid,
  CardMedia,
  CardActionArea,
  Typography,
  Button,
  Avatar,
  IconButton,
  TextField,
  Dialog,
  DialogContent,
  Slide,
  CircularProgress,
} from '@material-ui/core';

//Material UI Icons
import {
  CloseOutlined,
} from '@material-ui/icons'

//Material UI Pickers
import {
  MuiPickersUtilsProvider,
  DatePicker,
} from '@material-ui/pickers';

//Styles
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    avatarLarge: {
      width: theme.spacing(12),
      height: theme.spacing(12),
      color: 'black',
      boxShadow: "0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23)",
      fontSize: 32,
      borderStyle: 'solid',
      borderColor: 'white',
      borderWidth: 2,

    },

    profileImageButton: {
      marginTop: -70,
    },

    header: {
      boxShadow: "0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23)",
      width: "100%"
    },
    textField: {
      width: '100%',
    },

    dialog: {
      padding: 0,
      [theme.breakpoints.up('sm')]: {
        width: 500,
      },
    }
  }),
);

//Dialog Animation
const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement<any, any> },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

//Props
type Props = {
  uid: string,
  profileData: ProfileData | undefined,
  open: boolean,
  onClose: () => void,
  onSave: (data: EditProfileData) => void,
}

export const EditProfileDialog: React.FC<Props> = ({ uid, profileData, open, onClose, onSave }) => {
  const classes = useStyles();
  const theme = useTheme();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedProfileImage, setSelectedProfileImage] = useState<string | null>(null);
  const [selectedHeaderImage, setSelectedHeaderImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const smallScreen = useMediaQuery(theme.breakpoints.down('xs'));

  //Input Lengths
  const [nameLen, setNameLen] = useState<number>(0);
  const [bioLen, setBioLen] = useState<number>(0);
  const [locationLen, setLocationLen] = useState<number>(0);

  //React Hook Form
  const { register, handleSubmit, reset, errors } = useForm<EditProfileData>({
    mode: 'onChange',
    defaultValues: {
      name: profileData?.name,
      bio: profileData?.bio,
      location: profileData?.location,
    }
  });

  //Refs
  const profileImageInput = useRef<HTMLInputElement>(null);
  const headerImageInput = useRef<HTMLInputElement>(null);


  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
  };

  const handleSave = async (data: EditProfileData) => {
    setLoading(true);
    setErrorMsg(null);
    if (selectedProfileImage) {
      try {
        profileData!.photoURL = await uploadImage('/profileImages/', profileImageInput.current!.files![0]);
      } catch (error) {
        showError("Image file > 5MB");
        return;
      }
    }

    if (selectedHeaderImage) {
      try {
        profileData!.headerURL = await uploadImage('/headerImages/', headerImageInput.current!.files![0]);
      } catch (error) {
        showError("Image file > 5MB");
        return;
      }
    }

    //Updates User Document
    try {
      await firebase.firestore().collection('users').doc(uid).update({
        name: data.name.trim(),
        bio: data.bio ? data.bio.trim() : null,
        location: data.location ? data.location.trim() : null,
        birthDate: data.birthDate ? firebase.firestore.Timestamp.fromDate(new Date(data.birthDate)) : null,
        photoURL: profileData?.photoURL ? profileData.photoURL : null,
        headerURL: profileData?.headerURL ? profileData.headerURL : null,
      });
    } catch (error) {
      console.log(error);
      showError("Update failed. Please try again");
      return;
    }

    //Updates Auth Profile
    if (selectedProfileImage || profileData?.name !== data.name.trim()) {
      try {
        await firebase.auth().currentUser?.updateProfile({
          displayName: `${profileData?.username}-${data.name.trim()}`,
          photoURL: profileData?.photoURL,
        });
        window.location.reload(true);
      } catch (error) {
        console.log(error);
        showError("Update failed. Please try again");
        return;
      }
    } else {
      onSave(data);
      onClose();
    }
  }

  //Returns image image url after uploading
  const uploadImage = async (path: string, file: File): Promise<string> => {
    let storageRef = firebase.storage().ref().child(`${path}${uid}`);
    await storageRef.put(file);
    return storageRef.getDownloadURL();
  }

  const showError = (msg: string) => {
    setErrorMsg(msg);
    setLoading(false);
  }

  //Resets inputs on open
  useEffect(() => {
    setNameLen(profileData?.name ? profileData.name.length : 0);
    setBioLen(profileData?.bio ? profileData.bio.length : 0);
    setLocationLen(profileData?.location ? profileData.location.length : 0);
    setSelectedProfileImage(null);
    setSelectedHeaderImage(null);
    setSelectedDate(profileData?.birthDate ? profileData.birthDate.toDate() : null);
    setLoading(false);
    setErrorMsg(null);

    reset({
      name: profileData?.name,
      bio: profileData?.bio,
      location: profileData?.location,
    })
  }, [open, reset, profileData]);

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      fullScreen={smallScreen}
    >
      <input
        type="file"
        ref={profileImageInput}
        style={{ display: "none" }}
        accept="image/*"
        onChange={(event) => {
          if (event.target.files && event.target.files!.length !== 0) {
            setSelectedProfileImage(URL.createObjectURL(event.target.files[0]));
          }
        }}
      />
      <input
        type="file"
        ref={headerImageInput}
        style={{ display: "none" }}
        accept="image/*"
        onChange={(event) => {
          if (event.target.files && event.target.files!.length !== 0) {
            setSelectedHeaderImage(URL.createObjectURL(event.target.files[0]));
          }
        }}
      />
      <DialogContent className={classes.dialog}>
        <Grid container direction='column'>
          <form onSubmit={handleSubmit(handleSave)} noValidate={true}>
            <Grid container item alignItems='center' justify='space-between' style={{ padding: 10 }}>
              <Grid item>
                <IconButton onClick={onClose}>
                  <CloseOutlined fontSize='large' />
                </IconButton>
              </Grid>
              <Grid item>
                <Typography variant='h6' color='textSecondary'>Edit Profile</Typography>
              </Grid>
              <Grid item>
                {loading
                  ? <CircularProgress />
                  : <Button type='submit' size='medium' color="primary" variant='contained'>Save</Button>
                }

              </Grid>
            </Grid>
            <Grid item>
              <CardActionArea
                onClick={() => {
                  headerImageInput.current?.click();
                }}
              >
                <CardMedia
                  height='140'
                  component="img"
                  alt="Profile Header"
                  image={selectedHeaderImage ? selectedHeaderImage :
                    (profileData?.headerURL ? profileData.headerURL : "https://i.pinimg.com/originals/1c/3f/76/1c3f76c36819dcff58b9b9a1ebb5a990.jpg")}
                  title="Profile Header"
                  className={classes.header}
                />
              </CardActionArea>
            </Grid>
            <Grid item>
              <IconButton
                className={classes.profileImageButton}
                onClick={() => {
                  profileImageInput.current?.click();
                }}
              >
                <Avatar
                  className={classes.avatarLarge}
                  src={
                    selectedProfileImage ? selectedProfileImage
                      : (profileData?.photoURL ? profileData.photoURL : '')
                  }
                />
              </IconButton>
            </Grid>

            {errorMsg &&
              <Grid container item justify='center'>
                <Typography variant='subtitle1' color='error'>{errorMsg}</Typography>
              </Grid>

            }

            <Grid item container direction='column' spacing={4} style={{ padding: 10 }}>
              <Grid item>
                <TextField
                  label="Name"
                  name="name"
                  onChange={e => { setNameLen(e.target.value.length); }}
                  variant="outlined"
                  className={classes.textField}
                  inputRef={register({
                    required: "required",
                    pattern: {
                      value: FormConstraints.NamePattern,
                      message: FormConstraints.InvaildMessage('name')
                    },
                    maxLength: {
                      value: FormConstraints.NameMaxLength,
                      message: FormConstraints.MaxLengthMessage(FormConstraints.NameMaxLength),
                    }
                  })}
                  error={!!errors.name}
                  helperText={`${nameLen}/${FormConstraints.NameMaxLength}`}
                />
              </Grid>
              <Grid item>
                <TextField
                  label="Bio"
                  name="bio"
                  onChange={e => { setBioLen(e.target.value.length) }}
                  variant="outlined"
                  className={classes.textField}
                  multiline
                  inputRef={register({
                    maxLength: {
                      value: FormConstraints.BioMaxLength,
                      message: FormConstraints.MaxLengthMessage(FormConstraints.BioMaxLength),
                    }
                  })}
                  error={!!errors.bio}
                  helperText={`${bioLen}/${FormConstraints.BioMaxLength}`}
                />
              </Grid>
              <Grid item>
                <TextField
                  label="Location"
                  name="location"
                  onChange={e => { setLocationLen(e.target.value.length); }}
                  variant="outlined"
                  className={classes.textField}
                  inputRef={register({
                    maxLength: {
                      value: FormConstraints.LocationMaxLength,
                      message: FormConstraints.MaxLengthMessage(FormConstraints.LocationMaxLength),
                    }
                  })}
                  error={!!errors.location}
                  helperText={`${locationLen}/${FormConstraints.LocationMaxLength}`}
                />
              </Grid>
              <Grid item>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <DatePicker
                    inputRef={register}
                    className={classes.textField}
                    name='birthDate'
                    variant='dialog'
                    inputVariant="outlined"
                    format="MM/dd/yyyy"
                    minDate="01/01/1900"
                    maxDate={Date()}
                    disableFuture
                    label="Birth Date"
                    value={selectedDate}
                    onChange={handleDateChange}
                    autoOk
                    openTo='year'
                    InputProps={{
                      name: 'birthDate',
                      endAdornment: (
                        <IconButton onClick={() => {
                          setSelectedDate(null);
                        }}>
                          <CloseOutlined />
                        </IconButton>
                      )
                    }}
                  />
                </MuiPickersUtilsProvider>
              </Grid>
            </Grid>
          </form>
        </Grid>
      </DialogContent>
    </Dialog>
  )
}