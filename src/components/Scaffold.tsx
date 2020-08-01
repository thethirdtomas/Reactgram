import React from 'react';
import { Header } from './Header';

//Material UI Components
import {
  Grid,
} from '@material-ui/core';

export const Scaffold: React.FC = props => {
  return (
    <Grid container direction='column' spacing={4}>
      <Grid item>
        <Header />
      </Grid>
      <Grid item>
        {props.children}
      </Grid>
    </Grid>
  )
}