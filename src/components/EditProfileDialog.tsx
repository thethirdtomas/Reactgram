import React, { useState } from 'react';
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
  AuthState,
  EditProfileData,
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
  InputAdornment
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
  auth: AuthState,
  open: boolean,
  onClose: () => void
}

export const EditProfileDialog: React.FC<Props> = ({ auth, open, onClose }) => {
  const classes = useStyles();
  const theme = useTheme();
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(null);
  const smallScreen = useMediaQuery(theme.breakpoints.down('xs'));

  //Input Lengths
  const [nameLen, setNameLen] = useState<number>(0);
  const [bioLen, setBioLen] = useState<number>(0);
  const [locationLen, setLocationLen] = useState<number>(0);

  //React Hook Form
  const { register, handleSubmit, errors } = useForm<EditProfileData>({
    mode: 'onChange',
    defaultValues: {
      name: "Tomas Torres",
      bio: null,
      location: "",
    }
  });


  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
  };

  const handleSave = (data: EditProfileData) => {
    console.log(data);
    onClose();
  }

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      onClose={onClose}
      fullScreen={smallScreen}
    >
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
                <Button type='submit' size='medium' color="primary" variant='contained'>Save</Button>
              </Grid>
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
              <Grid container item>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <DatePicker
                    className={classes.textField}
                    name="birthDate"
                    variant={smallScreen ? 'dialog' : 'inline'}
                    inputVariant="outlined"
                    format="MM/dd/yyyy"
                    minDate="01/01/1900"
                    maxDate={Date()}
                    disableFuture
                    label="Birth Date"
                    value={selectedDate}
                    inputRef={register}
                    onChange={handleDateChange}
                    openTo='year'
                    autoOk
                    InputProps={{
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