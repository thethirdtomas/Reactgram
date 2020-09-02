import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

/*Utilitles*/
import firebase from '../utilities/FirebaseDAO';

/*Types*/
import { PostData } from '../types/myTypes';

/*Custom Components */
import { PostView } from '../components/PostView';

/*Material UI Components*/
import {
  Grid,
} from '@material-ui/core';

/*Costum Components*/
import { useAuth, AuthConstraint, Constraints, AuthRedirect } from '../components/AuthProvider';
import { ProfileCard } from '../components/ProfileCard';
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

export const Profile: React.FC = () => {
  const auth = useAuth()!
  const classes = styles();
  const [pageLoading, setPageLoading] = useState(true);
  const [redirect, setRedirect] = useState<string | null>(null);
  const [posts, setPosts] = useState<PostData[]>([]);

  const authConstraint: AuthConstraint = {
    authLevel: 1,
    constraint: Constraints.greaterThanLevel
  }

  //Redirect
  useEffect(() => {
    AuthRedirect({
      auth: auth,
      authConstraint: authConstraint,
      redirectTo: '/signin',
      redirectHook: setRedirect
    });
  }, [auth, authConstraint])

  useEffect(() => {
    if (auth) {
      setPageLoading(false);
      const unsubscribe = firebase.firestore()
        .collection('posts')
        .where('uid', '==', auth.uid)
        .orderBy("created", "desc")
        .onSnapshot(snapshots => {
          setPosts(snapshots.docs.map((doc): PostData => {
            const data = doc.data();
            return {
              id: doc.ref.id,
              uid: data.uid,
              username: data.username,
              name: data.name,
              profileURL: data.profileURL,
              text: data.text,
              image: data.image,
              likes: data.likes,
              comments: data.comments,
              reposts: data.reposts,
              created: data.created,
            }
          }
          ));
        });
      return () => {
        unsubscribe();
      }
    }
  }, [auth])

  //auth redirect
  if (redirect) {
    return <Redirect to={redirect} />
  } else if (pageLoading) {
    return <CenterLoad />
  }

  return (
    <div>
      <Helmet><title>My Profile / Reactgram</title></Helmet>
      <Grid container direction='column' alignItems='center' spacing={4} >
        <Grid item className={classes.item}>
          <ProfileCard uid={auth.uid} editable />
        </Grid>
        {posts.map((post) => {
          return (
            <Grid item className={classes.item}>
              <PostView postData={post} uid={auth.uid} />
            </Grid>
          )
        })}
      </Grid>
    </div >
  )
}