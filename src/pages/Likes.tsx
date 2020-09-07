import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

/*Utilitles*/
import firebase from '../utilities/FirebaseDAO';

/*Types*/
import { PostData } from '../types/myTypes';

//Material UI Components
import {
  Grid,
} from '@material-ui/core';


//Custom Components
import { useAuth, AuthConstraint, Constraints, AuthRedirect } from '../components/AuthProvider';
import { CenterLoad } from '../components/MyComponents';
import { PostView } from '../components/PostView';

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

export const Likes: React.FC = () => {
  const auth = useAuth()!
  const [pageLoading, setPageLoading] = useState(true);
  const [posts, setPosts] = useState<PostData[]>([]);
  const [redirect, setRedirect] = useState<string | null>(null);
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

  useEffect(() => {
    if (auth) {
      const unsubscribe = firebase.firestore()
        .collectionGroup('likesList')
        .where('user', '==', auth.uid)
        .orderBy('time', 'desc')
        .onSnapshot(snapshot => {
          const dataBuffer: PostData[] = [];
          const docCount = snapshot.docs.length;
          var dataLoaded = 0;
          snapshot.docs.forEach(doc => {
            doc.ref.parent.parent?.get().then(doc => {
              const data = doc.data();
              const postData: PostData = {
                id: doc.ref.id,
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
              }
              dataLoaded += 1;
              dataBuffer.push(postData);
              if (dataLoaded === docCount) {
                setPosts(dataBuffer);
              }

            })
          });
        })
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
      <Helmet><title>Likes / Reactgram</title></Helmet>
      <Grid container alignItems='center' spacing={4}>
        {posts.map((post) => {
          return (
            <Grid item className={classes.item}>
              <PostView postData={post} uid={auth.uid} />
            </Grid>
          )
        })}
      </Grid>
    </div>

  )
}