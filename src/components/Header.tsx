import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Button } from '@material-ui/core';
import firebase from '../utilities/FirebaseDAO';
import { useAuth } from '../components/AuthProvider';

export const Header: React.FC = () => {
    const auth = useAuth()!
    const authLevel = 2
    const [hidden, setHidden] = useState(true);

    useEffect(() => {
        if (auth && auth.authLevel >= authLevel) {
            setHidden(false);
        } else {
            setHidden(true);
        }
    }, [auth])

    const signOut = () => {
        firebase.auth().signOut();
    }

    if (hidden) {
        return <span />
    }

    return (
        <AppBar position='static' color='transparent'>
            <Toolbar>
                {auth.uid}
                <Button onClick={signOut} variant="contained" color="primary" >Sign Out</Button>
            </Toolbar>
        </AppBar>
    )
}