import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';

/*Utilitles*/
import firebase from '../utilities/FirebaseDAO';

/*Types*/
import { PostData } from '../types/myTypes';

/*Material UI Components*/
import {
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Avatar,
  IconButton,
} from '@material-ui/core'

/*Material UI Icons*/
import {
  CommentOutlined,
  Favorite,
  FavoriteBorderOutlined,
  RepeatOutlined,
  ShareOutlined,
} from '@material-ui/icons'

type Props = {
  postData: PostData,
  uid: string | undefined
}

export const PostView: React.FC<Props> = ({ postData, uid }) => {
  const [liked, setLiked] = useState<boolean>(false);
  TimeAgo.addLocale(en);
  const timeAgo = new TimeAgo('en-US');

  const toggleLike = () => {
    firebase.functions().httpsCallable("handleLikePost")({
      liked: !liked,
      postId: postData.id,
    }).catch(e => {
      console.log(e);
    });
    setLiked(!liked);
  }

  useEffect(() => {
    if (uid) {
      firebase.firestore()
        .collection('posts')
        .doc(postData.id)
        .collection("likesList")
        .doc(uid)
        .get().then(snap => {
          if (snap.exists) {
            setLiked(true);
          } else {
            setLiked(false);
          }
        })
    }
  }, [postData.id, uid])

  return (
    <Card>
      <Link to={`/${postData.username}`} style={{ textDecoration: 'none' }}>
        <CardHeader
          onClick={() => { window.scrollTo(0, 0) }}
          avatar={
            <Avatar
              src={postData.profileURL ? postData.profileURL : ''}
            />
          }
          title={postData.name}
          subheader={`@${postData.username} - ${timeAgo.format(postData.created.toDate(), 'twitter')}`}
        />
      </Link>
      <Link to={`/post/${postData.id}`} style={{ textDecoration: 'none' }}>
        <CardContent>
          <Typography variant="body1" align='left' color="textSecondary" component="p">
            {postData.text}
          </Typography>
        </CardContent>
        {postData.image &&
          <CardMedia
            component="img"
            image={postData.image}
            title="Post Image"
          />
        }
      </Link>

      <CardActions disableSpacing>
        <Link to={`/post/${postData.id}`} style={{ textDecoration: 'none' }}>
          <IconButton>
            <CommentOutlined />
          </IconButton>
        </Link>
        <Typography variant='subtitle2'>{postData.comments}</Typography>
        <IconButton>
          <RepeatOutlined />
        </IconButton>
        <Typography variant='subtitle2'>{postData.reposts}</Typography>
        <IconButton onClick={() => toggleLike()}>
          {liked
            ? <Favorite color='error' />
            : <FavoriteBorderOutlined />
          }
        </IconButton>
        <Typography variant='subtitle2'>{postData.likes}</Typography>
        <IconButton>
          <ShareOutlined />
        </IconButton>
      </CardActions>
    </Card>
  )
}