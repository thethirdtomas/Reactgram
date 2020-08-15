import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { Helmet } from "react-helmet";
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

/*Utilitles*/
import firebase from '../utilities/FirebaseDAO';

/*Types*/
import { PostData } from '../types/myTypes';

/*Custom Components */
import { PostView } from '../components/PostView';

//Material UI Components
import {
  Grid,
} from '@material-ui/core';


//Custom Components
import { useAuth, AuthConstraint, Constraints, AuthRedirect } from '../components/AuthProvider';
import { PostForm } from '../components/PostForm';
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

export const Home: React.FC = () => {
  const auth = useAuth()!
  const [pageLoading, setPageLoading] = useState(true);
  const [redirect, setRedirect] = useState<string | null>(null);
  const [posts, setPosts] = useState<PostData[]>([]);
  const classes = styles();

  const authConstraint: AuthConstraint = {
    authLevel: 1,
    constraint: Constraints.greaterThanLevel
  }

  //Redirect Effect
  useEffect(() => {
    AuthRedirect({
      auth: auth,
      authConstraint: authConstraint,
      redirectTo: '/signin',
      redirectHook: setRedirect
    });
  }, [auth, authConstraint])

  //Page Loading Effect
  useEffect(() => {
    if (auth) {
      setPageLoading(false);
    }
  }, [auth]);

  //Posts Effect
  useEffect(() => {
    const postsStream = firebase.firestore()
      .collection('posts')
      .orderBy('created', 'desc')
      .onSnapshot(snapshot => {
        setPosts(snapshot.docs.map((doc): PostData => {
          const data = doc.data();
          return {
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
        }));
      });

    //Clean Up
    return () => {
      postsStream();
    }
  }, [])

  //auth redirect
  if (redirect) {
    return <Redirect to={redirect} />
  } else if (pageLoading) {
    return <CenterLoad />
  }

  return (
    <div>
      <Helmet><title>Home / Reactgram</title></Helmet>
      <Grid container direction='column' alignItems='center' spacing={4}>
        <Grid item className={classes.item}>
          <PostForm auth={auth} />
        </Grid>
        {posts.map((post) => {
          return (
            <Grid item className={classes.item}>
              <PostView postData={post} />
            </Grid>
          )
        })}
      </Grid>
    </div>
  );
}