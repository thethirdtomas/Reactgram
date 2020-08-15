import React, { useState, useRef } from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Link } from 'react-router-dom'
import * as EmojiPicker from 'emoji-picker-react';

/*Utilitles*/
import { PostTextMaxLength } from '../utilities/FormConstraints';
import firebase from '../utilities/FirebaseDAO';

/*Material UI Components*/
import {
  Card,
  CardContent,
  CardMedia,
  Grid,
  Avatar,
  IconButton,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Box,
  Popover,
} from '@material-ui/core'

/*Material UI Icons*/
import {
  ImageOutlined,
  GifOutlined,
  EmojiEmotionsOutlined,
  EmojiEmotions,
  CloseOutlined,
} from "@material-ui/icons"

/*Types*/
import {
  AuthState,
} from '../types/myTypes'

const styles = makeStyles(({ breakpoints, palette }: Theme) =>
  createStyles({
    root: {
      [breakpoints.up('sm')]: {
        width: 500
      },
    },
    spacer: {
      flexGrow: 1,
    },
    textField: {
      width: "85%",
    },
    postImage: {
      maxHeight: 500,
    },
    clearImageButton: {
      color: 'White',
      backgroundColor: 'grey',
      borderRadius: 15
    }
  })
);

//Props
type Props = {
  auth: AuthState,
}

//State
type State = {
  postText: string,
  textProgress: number,
  progressColor: string,
  charsLeft: number | null,
  postImage: { url: string, file: File } | null,
  loading: boolean,
  errorMsg: string | null,
}

//Defaults
const defaultState: State = {
  postText: '',
  textProgress: 0,
  progressColor: "#3F51B5",
  charsLeft: null,
  postImage: null,
  loading: false,
  errorMsg: null,
}

export const PostForm: React.FC<Props> = ({ auth }) => {
  const classes = styles();
  const [state, setState] = useState<State>(defaultState)
  const [emojiAnchor, setEmojiAnchor] = useState<HTMLButtonElement | null>(null)

  //Refs
  const postImageRef = useRef<HTMLInputElement>(null);

  let emojiBuffer: string = "";

  const uploadImage = async (path: string, file: File): Promise<string> => {
    let storageRef = firebase.storage().ref().child(path);
    await storageRef.put(file);
    return storageRef.getDownloadURL();
  }

  const handlePost = async () => {
    setState({ ...state, loading: true });
    const postsRef = firebase.firestore().collection('posts').doc();
    let imageURL = null;

    if (state.postImage?.file) {
      try {
        imageURL = await uploadImage(`/postImages/${postsRef.id}`, state.postImage.file);
      } catch (e) {
        console.log(e);
      }
    }

    try {
      await postsRef.set({
        uid: auth.uid,
        username: auth.username,
        name: auth.name,
        profileURL: auth.photoURL,
        text: state.postText,
        image: imageURL,
        likes: 0,
        comments: 0,
        reposts: 0,
        created: firebase.firestore.Timestamp.now(),
      })
      setState(defaultState);
    } catch (e) {
      console.log(e);
      setState({
        ...state,
        loading: false,
        errorMsg: "Post failed. Please try again."
      });
      return;
    }
  }

  const textChange = (value: string) => {
    let textLen = value.trim().length;
    let textProgress = calcTextProgress(textLen)
    setState({
      ...state,
      postText: value,
      textProgress,
      progressColor: getProgressColor(textProgress),
      charsLeft: calcCharsLeft(textLen),
      errorMsg: null
    })
  }

  const clearPostText = () => {
    textChange('');
  }

  const calcPostDisabled = (value: string): boolean => {
    const textLen = value.trim().length;
    return textLen > PostTextMaxLength || (textLen === 0 && !!!state.postImage)
  }

  const calcTextProgress = (textLen: number): number => {
    const percentage = (textLen / PostTextMaxLength) * 100;
    return percentage > 100 ? 100 : percentage;
  }

  const calcCharsLeft = (textLen: number): number | null => {
    const charsLeft = PostTextMaxLength - textLen;
    if (charsLeft < 50 && charsLeft > -100) {
      return charsLeft;
    }
    return null
  }

  const getProgressColor = (textProgress: number): string => {
    if (textProgress < 33.3) {
      return "#3F51B5";
    } else if (textProgress < 66.6) {
      return "#FFD700";
    }
    return "#CD3700";
  }

  const handlePostImageSelect = (files: FileList | null) => {
    if (files && files.length > 0) {
      setState({
        ...state,
        postImage: {
          file: files[0],
          url: URL.createObjectURL(files[0])
        },
        errorMsg: null
      })
    }
  }

  const clearPostImage = () => {
    setState({
      ...state,
      postImage: null,
      errorMsg: null
    })
  }

  const handleEmojiSelect = (emoji: string) => {
    emojiBuffer += emoji;
    textChange(state.postText + emojiBuffer);
  }

  const openEmojiPicker = (anchor: HTMLButtonElement) => {
    setEmojiAnchor(anchor);
  }

  const closeEmojiPicker = () => {
    setEmojiAnchor(null);
  }

  return (
    <Card>
      <input
        type="file"
        ref={postImageRef}
        style={{ display: "none" }}
        accept="image/*"
        onChange={e => handlePostImageSelect(e.target.files)}
        onClick={e => e.currentTarget.value = ''}
      />

      <Popover
        open={!!emojiAnchor}
        anchorEl={emojiAnchor}
        onClose={closeEmojiPicker}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <EmojiPicker.default onEmojiClick={(event, emoji) => handleEmojiSelect(emoji.emoji)} />
      </Popover>

      <CardContent>
        <Grid container direction='column' alignItems="stretch">
          <Grid item>
            <TextField
              placeholder="What's happening?"
              multiline
              value={state.postText}
              onChange={e => textChange(e.target.value)}
              fullWidth
              InputProps={{
                disableUnderline: true,
                startAdornment: (
                  <div style={{ padding: 10 }}>
                    <Link to='/profile'>
                      <Avatar src={auth.photoURL ? auth.photoURL : ''} />
                    </Link>
                  </div>

                ),
                endAdornment: state.postText.trim().length > 0 ? (
                  <IconButton onClick={clearPostText} >
                    <Box position="relative" display="inline-flex">
                      <CircularProgress variant="static" value={state.textProgress} size={40} style={{ color: state.progressColor }} />
                      <Box
                        top={0}
                        left={0}
                        bottom={0}
                        right={0}
                        position="absolute"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        {state.charsLeft != null
                          ? <Typography variant='subtitle1' component="div" style={{ color: state.progressColor }} >{state.charsLeft}</Typography>
                          : <CloseOutlined style={{ color: state.progressColor }} />
                        }

                      </Box>
                    </Box>
                  </IconButton>
                ) : null
              }}
            />
          </Grid>
          {state.postImage &&
            <Box position="relative" display="inline-flex">
              <CardMedia
                className={classes.postImage}
                component="img"
                image={state.postImage.url}
                title="Post Image"
              />
              <Box
                position="absolute"
                display="flex"
              >
                <IconButton onClick={clearPostImage}>
                  <CloseOutlined className={classes.clearImageButton} />
                </IconButton>
              </Box>

            </Box>
          }

          <Grid container item alignItems='center'>
            <Grid item style={{ paddingLeft: 45 }}>
              <IconButton onClick={() => postImageRef.current?.click()}>
                <ImageOutlined />
              </IconButton>
              <IconButton>
                <GifOutlined fontSize='large' />
              </IconButton>
              <IconButton onClick={e => openEmojiPicker(e.currentTarget)}>
                {emojiAnchor
                  ? <EmojiEmotions style={{ color: "#FFD700" }} />
                  : <EmojiEmotionsOutlined />
                }
              </IconButton>
            </Grid>
            <div className={classes.spacer} />
            <Grid item>
              {state.loading
                ? <CircularProgress />
                : <Button
                  variant='contained'
                  color='primary'
                  disabled={calcPostDisabled(state.postText)}
                  onClick={handlePost}
                >
                  <Typography variant='button'>
                    Post
                  </Typography>
                </Button>
              }
            </Grid>
          </Grid>
          {state.errorMsg &&
            <Grid container item justify='center'>
              <Typography variant='caption' color='error' >
                {state.errorMsg}
              </Typography>
            </Grid>
          }
        </Grid>
      </CardContent>
    </Card >
  );
}