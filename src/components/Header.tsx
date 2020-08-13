import React, { useState, useEffect } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { useLocation, Link } from 'react-router-dom'
import firebase from '../utilities/FirebaseDAO'
import { useAuth } from '../components/AuthProvider';

//Material UI Components
import {
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    MenuItem,
    Menu,
    Divider,
    Hidden,
    Avatar,
} from '@material-ui/core';


// Material UI Icons
import {
    HomeOutlined,
    Home,
    FavoriteBorderOutlined,
    Favorite,
    SettingsOutlined,
    Settings,
    MenuOutlined,
    ExitToAppOutlined,
} from '@material-ui/icons'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        grow: {
            flexGrow: 1,
            marginBottom: 50,
        },
        menuButton: {
            marginRight: theme.spacing(2),
        },
        title: {
            display: 'block',
            [theme.breakpoints.up('sm')]: {
                display: 'block',
            },
            fontFamily: 'Satisfy',
        },
        sectionDesktop: {
            display: 'none',
            [theme.breakpoints.up('md')]: {
                display: 'flex',
            },
        },
        sectionMobile: {
            display: 'flex',
            [theme.breakpoints.up('md')]: {
                display: 'none',
            },
        },

        avatar: {
            width: theme.spacing(3),
            height: theme.spacing(3),
            color: 'black',
        }
    }),
);

export const Header: React.FC = () => {
    const auth = useAuth()!
    const authLevel = 2
    const [hidden, setHidden] = useState(true);

    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState<null | HTMLElement>(null);
    const location = useLocation(); //Page Route
    const isMenuOpen = !!anchorEl;
    const isMobileMenuOpen = !!mobileMoreAnchorEl;

    useEffect(() => {
        if (auth && auth.authLevel >= authLevel) {
            setHidden(false);
        } else {
            setHidden(true);
        }
    }, [auth])

    const signOut = () => {
        handleMenuClose();
        firebase.auth().signOut();
    }

    const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget)
    };

    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        handleMobileMenuClose();
    };

    const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setMobileMoreAnchorEl(event.currentTarget);
    };

    const menuId = 'primary-search-account-menu';
    const renderMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            id={menuId}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <Link to='/profile' style={{ textDecoration: 'none' }}>
                <MenuItem onClick={handleMenuClose}>
                    <Typography variant='subtitle1'>
                        My Profile
                </Typography>
                </MenuItem>
            </Link>
            <Link to='/settings' style={{ textDecoration: 'none' }}>
                <MenuItem onClick={handleMenuClose}>
                    <Typography variant='subtitle1'>
                        Settings
                </Typography>
                </MenuItem>
            </Link>
            <Divider />
            <MenuItem onClick={signOut}>
                <Typography variant='subtitle1' style={{ marginRight: 5 }}>
                    Sign Out
                </Typography>
                <ExitToAppOutlined />
            </MenuItem>
        </Menu>
    );

    const mobileMenuId = 'primary-search-account-menu-mobile';
    const renderMobileMenu = (
        <Menu
            anchorEl={mobileMoreAnchorEl}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            id={mobileMenuId}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={isMobileMenuOpen}
            onClose={handleMobileMenuClose}
        >
            <Link to='/home' style={{ textDecoration: 'none' }}>
                <MenuItem onClick={handleMobileMenuClose}>

                    <IconButton color="inherit">
                        {location.pathname === '/home'
                            ? <Home color='primary' />
                            : <HomeOutlined />
                        }
                    </IconButton>
                    <Typography variant='subtitle1'>
                        Home
                    </Typography>

                </MenuItem>
            </Link>
            <Link to='/likes' style={{ textDecoration: 'none' }}>
                <MenuItem onClick={handleMobileMenuClose}>
                    <IconButton color="inherit">
                        {location.pathname === '/likes'
                            ? <Favorite color='error' />
                            : <FavoriteBorderOutlined />
                        }
                    </IconButton>

                    <Typography variant='subtitle1'>
                        Likes
                </Typography>

                </MenuItem>
            </Link>
            <Link to='/profile' style={{ textDecoration: 'none' }}>
                <MenuItem onClick={handleMobileMenuClose}>
                    <IconButton color="inherit">
                        <Avatar className={classes.avatar} src={auth?.photoURL ? auth.photoURL : ''} />
                    </IconButton>
                    <Typography variant='subtitle1'>
                        My Profile
                </Typography>
                </MenuItem>
            </Link>
            <Link to='/settings' style={{ textDecoration: 'none' }}>
                <MenuItem onClick={handleMobileMenuClose}>
                    <IconButton color="inherit">
                        {location.pathname === '/settings'
                            ? <Settings />
                            : <SettingsOutlined />
                        }
                    </IconButton>

                    <Typography variant='subtitle1'>
                        Settings
                </Typography>
                </MenuItem>
            </Link>
            <Divider />
            <MenuItem onClick={signOut}>
                <Typography variant='subtitle1'>
                    Sign Out
                </Typography>
                <IconButton color="inherit">
                    <ExitToAppOutlined />
                </IconButton>
            </MenuItem>
        </Menu>
    );

    if (hidden) {
        return <span />
    }

    return (
        <div className={classes.grow}>
            <AppBar position="fixed" style={{ backgroundColor: 'white' }}>
                <Toolbar>
                    <Hidden smDown>
                        <div className={classes.grow} />
                    </Hidden>
                    <Link to='/home' style={{ textDecoration: 'none' }}>
                        <IconButton color="inherit">
                            <Typography className={classes.title} variant="h5" noWrap>
                                Reactgram
                            </Typography>
                        </IconButton>
                    </Link>

                    <div className={classes.grow} />
                    <div className={classes.sectionDesktop}>
                        <Link to='/home'>
                            <IconButton color="inherit">
                                {location.pathname === '/home'
                                    ? <Home color='primary' />
                                    : <HomeOutlined />
                                }
                            </IconButton>
                        </Link>
                        <Link to='/likes'>
                            <IconButton color="inherit">
                                {location.pathname === '/likes'
                                    ? <Favorite color='error' />
                                    : <FavoriteBorderOutlined />
                                }
                            </IconButton>
                        </Link>
                        <IconButton
                            edge="end"
                            onClick={handleProfileMenuOpen}
                            color="inherit"
                        >
                            <Avatar className={classes.avatar} src={auth?.photoURL ? auth.photoURL : ''} />
                        </IconButton>
                    </div>
                    <div className={classes.grow} />
                    <div className={classes.sectionMobile}>
                        <IconButton
                            onClick={handleMobileMenuOpen}
                            color="inherit"
                        >
                            <MenuOutlined style={{ color: 'black' }} />
                        </IconButton>
                    </div>
                </Toolbar>
            </AppBar>
            {renderMobileMenu}
            {renderMenu}
        </div >
    );
}