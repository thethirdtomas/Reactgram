import React from 'react';
import { Grid } from '@material-ui/core';

import { Header } from './components/Header'
import { Content } from './components/Content';

export const App: React.FC = () => (
    <Grid container direction='column' spacing={4}>
      <Grid item>
        <Header />
      </Grid>
      <Grid item>
        <Content />
      </Grid>
    </Grid>

)