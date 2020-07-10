import React from 'react';
import { AppBar, Toolbar} from '@material-ui/core';

interface Props {
    auth?: boolean
}


export const Header: React.FC<Props> = (props: Props) => {
    if (props.auth) {
        return (
            <AppBar position='static' color='transparent'>
                <Toolbar>

                </Toolbar>
            </AppBar>
        )
    }

    return <span />
}