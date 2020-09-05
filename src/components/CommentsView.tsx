import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom'
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';

/*Utilitles*/
import firebase from '../utilities/FirebaseDAO';

/*Types*/
import { CommentData } from '../types/myTypes';

/*Material UI Components*/
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
}));

type Props = {
  postId: string,
}

export const CommentsView: React.FC<Props> = ({ postId }) => {
  const [comments, setComments] = useState<CommentData[]>([]);
  const classes = useStyles();
  TimeAgo.addLocale(en);
  const timeAgo = new TimeAgo('en-US');

  useEffect(() => {
    const unsubscribe = firebase.firestore()
      .collection('posts')
      .doc(postId)
      .collection('commentList')
      .orderBy('created', 'desc')
      .onSnapshot(snapshots => {
        setComments(snapshots.docs.map((doc): CommentData => {
          const data = doc.data();
          return {
            id: doc.id,
            username: data.username,
            profileURL: data.profileURL,
            comment: data.comment,
            created: data.created,
          }
        }));
      });

    return () => {
      unsubscribe();
    }
  }, [postId])

  return (
    <Card>
      <CardContent>
        {comments.length === 0
          ? <Grid container justify='center'>
            <Grid item>
              <Typography variant='body1' color='textSecondary' >No Comments</Typography>
            </Grid>
          </Grid>
          : <Grid container direction='column' spacing={3}>
            {comments.map((comment: CommentData) => {
              return (
                <Grid container item spacing={1}>

                  <Grid item>
                    <Link to={`/${comment.username}`} style={{ textDecoration: 'none' }}>
                      <Avatar src={comment.profileURL} className={classes.small} />
                    </Link>
                  </Grid>
                  <Grid item>
                    <Link to={`/${comment.username}`} style={{ textDecoration: 'none' }}>
                      <Typography variant='body1' color='textSecondary'>@{comment.username}</Typography>
                    </Link>
                  </Grid>
                  <Grid item>
                    <Typography variant='body2' color='textSecondary'>
                      {timeAgo.format(comment.created.toDate(), 'twitter')}
                    </Typography>
                  </Grid>
                  <Grid container item>
                    <Typography>{comment.comment}</Typography>
                  </Grid>
                </Grid>
              )
            })
            }
          </Grid>
        }
      </CardContent>
    </Card>
  );
}