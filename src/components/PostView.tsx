import React, { useState, useEffect } from 'react';

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

  const toggleLike = () => {
    firebase.functions().httpsCallable("handleLikePost")({
      liked: !liked,
      postId: postData.id,
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
      <CardHeader
        avatar={
          <Avatar
            src={postData.profileURL ? postData.profileURL : ''}
            onClick={() => { console.log("You clicked the avatar") }}
          />
        }
        title={postData.name}
        subheader={`@${postData.username} - 10h`}
      />
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

      <CardActions disableSpacing>
        <IconButton>
          <CommentOutlined />
        </IconButton>
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