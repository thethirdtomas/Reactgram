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
  Avatar,
  Card,
  CardMedia,
  CardHeader,
  CardContent,
  CardActions,
  IconButton,
} from '@material-ui/core';

//Material UI Icons
import {
  FavoriteBorder,
  ShareOutlined,
  CommentOutlined,
  RepeatOutlined,

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

//Post
const PostStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      [theme.breakpoints.up('sm')]: {
        minWidth: 450,
        maxWidth: 450,
      },

    },
  }),
);

export const Post: React.FC = () => {
  const classes = PostStyles();
  return (
    <Card className={classes.root}>
      <CardHeader
        avatar={
          <Avatar
            src='https://i.pinimg.com/originals/47/1d/ce/471dceb4de8764f4fc4e166ffe5dd038.jpg'
            onClick={() => { console.log("You clicked the avatar") }}
            draggable={false}
          />
        }
        title="Mar Kar"
        subheader="@coolgirl - 10h"
      />
      <CardContent>
        <Typography variant="body2" align='left' color="textSecondary" component="p">
          This is the coolest post ever! Am I wrong? Yup that's what I thought. How much more can I write?
          Do you even care? Why do I keep asking questions? Oh damn that's a question.
        </Typography>
      </CardContent>
      <CardMedia
        component="img"
        image="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcR8a3DsVCmybKRgqzFfOlO2ahkCnjXWr1lKhg&usqp=CAU"
        title="cool post"
      />
      <CardActions disableSpacing>
        <IconButton>
          <CommentOutlined />
        </IconButton>
        <Typography variant='subtitle2'>33</Typography>
        <IconButton>
          <RepeatOutlined />
        </IconButton>
        <Typography variant='subtitle2'>41</Typography>
        <IconButton>
          <FavoriteBorder />
        </IconButton>
        <Typography variant='subtitle2'>121</Typography>
        <IconButton>
          <ShareOutlined />
        </IconButton>
      </CardActions>

    </Card>
  )
}