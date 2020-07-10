import React from 'react';
import { Link } from 'react-router-dom';
import { Typography, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

interface TextLinkButtonProps {
    text: string
    path: string
    varient: any
}

const useStyles = makeStyles({
    root: {
        textDecoration: 'none',
    }
})

export const TextLinkButton: React.FC<TextLinkButtonProps> = ({ text, path, varient }: TextLinkButtonProps) => {
    const classes = useStyles();
    return (
        <Link to={path} className={classes.root}>
            <Button className={classes.root}>
                <Typography variant={varient}>{text} </Typography>
            </Button>
        </Link>
    );
}
 