import React from 'react';
import { Link } from 'react-router-dom';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

//Material UI Components
import {
  Typography,
  Button,
  Grid,
  CircularProgress,
  Paper,
} from '@material-ui/core';

//Material UI Icons
import {


} from '@material-ui/icons'


//CenterLoad
export const CenterLoad: React.FC = () => {
  return (
    <Grid
      container
      spacing={0}
      alignItems='center'
      justify='center'
      direction='column'
      style={{ minHeight: '95vh' }}
    >
      <Grid item>
        <CircularProgress />
      </Grid>
    </Grid>
  )
}




//TextLinkButton
interface TextLinkButtonProps {
  text: string
  path: string
  varient: any
}

export const TextLinkButton: React.FC<TextLinkButtonProps> = ({ text, path, varient }: TextLinkButtonProps) => {
  return (
    <Link to={path} style={{ textDecoration: 'none' }}>
      <Button >
        <Typography variant={varient}>{text} </Typography>
      </Button>
    </Link>
  );
}

//Title Banner
const TitleBannerStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      fontFamily: 'Satisfy',
    },
  }),
);

export const TitleBanner: React.FC = () => {
  const classes = TitleBannerStyles();
  return (
    <Typography className={classes.title} variant='h3'>Reactgram</Typography>
  );
}

//FormPaper
const FormPaperStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(2),
      minWidth: 350,
      maxWidth: 350,
      textAlign: 'center',
      height: 'auto',
    },
  }),
);

export const FormPaper: React.FC = props => {
  const classes = FormPaperStyles();
  return (
    <Paper className={classes.root}>
      {props.children}
    </Paper>
  )
}