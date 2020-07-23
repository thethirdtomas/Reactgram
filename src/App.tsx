import React from 'react';
import { Grid } from '@material-ui/core';

import { Header } from './components/Header'
import { Content } from './components/Content';
import { AuthProvider } from './components/AuthProvider';


export const App: React.FC = () => (
  <AuthProvider>
    <Grid container direction='column' spacing={4}>
      <Grid item>
        <Header />
      </Grid>
      <Grid item>
        <Content />
      </Grid>
    </Grid>
  </AuthProvider>
)