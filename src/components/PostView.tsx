import React from 'react';

/*Types*/
import { PostData } from '../types/myTypes';

/*Material UI Components*/
import {
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Avatar,
  IconButton,
} from '@material-ui/core'

/*Material UI Icons*/
import {
  CommentOutlined,
  FavoriteBorder,
  RepeatOutlined,
  ShareOutlined,
} from '@material-ui/icons'

type Props = {
  postData: PostData
}

export const PostView: React.FC<Props> = ({ postData }) => {
  return (
    <Card>
      <CardHeader
        avatar={
          <Avatar
            src={postData.profileURL ? postData.profileURL : ''}
            onClick={() => { console.log("You clicked the avatar") }}
          />
        }
        title={postData.name}
        subheader={`@${postData.username} - 10h`}
      />
      <CardContent>
        <Typography variant="body1" align='left' color="textSecondary" component="p">
          {postData.text}
        </Typography>
      </CardContent>
      {postData.image &&
        <CardMedia
          component="img"
          image={postData.image}
          title="Post Image"
        />
      }

      <CardActions disableSpacing>
        <IconButton>
          <CommentOutlined />
        </IconButton>
        <Typography variant='subtitle2'>{postData.comments}</Typography>
        <IconButton>
          <RepeatOutlined />
        </IconButton>
        <Typography variant='subtitle2'>{postData.reposts}</Typography>
        <IconButton>
          <FavoriteBorder />
        </IconButton>
        <Typography variant='subtitle2'>{postData.likes}</Typography>
        <IconButton>
          <ShareOutlined />
        </IconButton>
      </CardActions>
    </Card>
  )
}