import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

/*Utilitles*/
import firebase from '../utilities/FirebaseDAO';

/*Types*/
import { PostData } from '../types/myTypes';

/*Material UI Components*/
import {
  Grid,
} from '@material-ui/core';

/*Costum Components*/
import { useAuth } from '../components/AuthProvider';
import { PostView } from '../components/PostView';
import { CommentForm } from '../components/CommentForm';
import { CommentsView } from '../components/CommentsView';
import {
  CenterLoad,
} from '../components/MyComponents';

/*Styles*/
const styles = makeStyles(({ breakpoints }: Theme) =>
  createStyles({
    item: {
      [breakpoints.up('sm')]: {
        width: 600
      },
      [breakpoints.down('xs')]: {
        width: '100%',
      },
    },
  }),
);


export const Post: React.FC = (props: any) => {
  const auth = useAuth()!
  const id = props.match.params.id;
  const [pageLoading, setPageLoading] = useState(true);
  const [post, setPost] = useState<PostData>();
  const classes = styles();

  useEffect(() => {
    if (auth) {
      firebase.firestore()
        .collection('posts')
        .doc(id)
        .get().then(snap => {
          if (snap.exists) {
            setPageLoading(false);
            const data = snap.data();
            setPost({
              id: snap.id,
              uid: data!.uid,
              username: data!.username,
              name: data!.name,
              profileURL: data!.profileURL,
              text: data!.text,
              image: data!.image,
              likes: data!.likes,
              comments: data!.comments,
              reposts: data!.reposts,
              created: data!.created,
            });
          }
        })
    }

  }, [auth, id]);

  if (pageLoading) {
    return <CenterLoad />
  }

  return (
    <div>
      <Helmet><title>Post/ Reactgram</title></Helmet>
      {post &&
        <Grid container direction='column' alignItems='center' spacing={4} >
          <Grid item className={classes.item}>
            <PostView postData={post} uid={auth.uid ? auth.uid : undefined} />
          </Grid>
          <Grid item className={classes.item}>
            <CommentForm auth={auth} postId={id} />
          </Grid>
          <Grid item className={classes.item}>
            <CommentsView postId={id} />
          </Grid>
        </Grid>
      }
    </div >
  )
}