import React, { useState, useEffect, useContext } from 'react';
import { AppBar, Toolbar, Typography, Box, List, Divider, ListItem, ListItemButton, ListItemText, ListItemIcon } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import LogoutIcon from '@mui/icons-material/Logout';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import { toast } from 'react-toastify';
import { NavLink, useNavigate } from 'react-router-dom';
import '../hide.css';
import AuthContext from '../store/AuthContext';
import axios from 'axios';
axios.defaults.withCredentials = true;
const Navbar = () => {
    const navigate = useNavigate();
    const authCTX = useContext(AuthContext);
    const isLoggedIn = authCTX.isLoggedIn;
    const logoutUser = authCTX.logoutUser;
    const [name, setName] = useState('');
    const [userId, setUserid] = useState('');
    const [email, setEmail] = useState('');
    const drawerWidth = 240;

    const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
        ({ theme, open }) => ({
            flexGrow: 1,
            padding: theme.spacing(3),
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
            marginLeft: `-${drawerWidth}px`,
            ...(open && {
                transition: theme.transitions.create('margin', {
                    easing: theme.transitions.easing.easeOut,
                    duration: theme.transitions.duration.enteringScreen,
                }),
                marginLeft: 0,
            }),
        }),
    );

    const AppBar = styled(MuiAppBar, {
        shouldForwardProp: (prop) => prop !== 'open',
    })(({ theme, open }) => ({
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        ...(open && {
            width: `calc(100% - ${drawerWidth}px)`,
            marginLeft: `${drawerWidth}px`,
            transition: theme.transitions.create(['margin', 'width'], {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
        }),
    }));

    const DrawerHeader = styled('div')(({ theme }) => ({
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
        justifyContent: 'flex-end',
    }));

    const itemsList = [
        {
            text: "Join Peoples",
            icon: <PersonAddIcon />,
            onClick: (e) => onJoin(e)
        },
        {
            text: "Tree",
            icon: <GroupAddIcon />,
            onClick: (e) => onTree(e)
        },
        {
            text: "Logout",
            icon: <LogoutIcon />,
            onClick: (e) => onLogout(e)
        }
    ];
    const itemsListNotLoggedIn = [
        {
            text: "Login",
            icon: <LoginIcon />,
            onClick: (e) => onLogin(e)
        },
        {
            text: "Register",
            icon: <PersonAddIcon />,
            onClick: (e) => onRegister(e)
        }
    ];
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };
    const onLogin = (e) => {
        navigate('login');
        handleDrawerClose();
    }
    const onRegister = (e) => {
        navigate('register');
        handleDrawerClose();
    }
    const onJoin = (e) => {
        navigate("join")
        handleDrawerClose();
    }
    const onTree = (e) => {
        navigate("tree/:id")
        handleDrawerClose();
    }
    const onLogout = async (e) => {
        await axios.get('http://localhost:8000/api/logout').then(response => {
            if (response.status === 201) {
                setUserid('');
                logoutUser();
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/login');
                handleDrawerClose();
                toast.success('User is Logged out successfully!', {
                    position: "bottom-right",
                    hideProgressBar: false,
                    progress: undefined,
                });
            }
            else {
                toast.error(response.data, {
                    position: "bottom-right",
                    hideProgressBar: false,
                    progress: undefined,
                });
            }
        }).catch(error => {
            toast.error(error.message, {
                position: "bottom-right",
                hideProgressBar: false,
                progress: undefined,
            });
        });

    }
    useEffect(() => {
        const user = localStorage.getItem('user');
        const user_detail = JSON.parse(user);
        if (user_detail) {
            setUserid(user_detail._id);
            setEmail(user_detail.email);
        }
    }, [isLoggedIn]);
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="fixed" open={open}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        sx={{ mr: 2, ...(open && { display: 'none' }) }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant='h5' component="div" sx={{ flexGrow: 1 }}>MLM with React JS</Typography>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <Typography component="div" sx={{ flexGrow: 1 }} className={`${!userId ? "mystyle" : ""}`} >Welcome {email}</Typography>
                    <NavLink style={{ color: 'white' }} color="inherit" to="/join" className={`${!userId ? "mystyle" : ""}`} >Join</NavLink>&nbsp;&nbsp;
                    <NavLink style={{ color: 'white' }} to="/tree/:id" className={`${!userId ? "mystyle" : ""}`} >Tree</NavLink>&nbsp;&nbsp;
                    <NavLink style={{ color: 'white' }} onClick={(e) => onLogout(e)} className={`${!userId ? "mystyle" : ""}`} >Logout</NavLink>
                    <NavLink style={{ color: 'white' }} to="/login" className={`${userId ? "mystyle" : ""}`} >Login</NavLink>&nbsp;&nbsp;
                    <NavLink style={{ color: 'white' }} to="/register" className={`${userId ? "mystyle" : ""}`}>Sign Up</NavLink>
                </Toolbar>
            </AppBar>

            <Drawer
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                    },
                }}
                variant="persistent"
                anchor="left"
                open={open}
            >
                <DrawerHeader>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                    </IconButton>
                </DrawerHeader>
                <Divider />
                <List>
                    {userId && itemsList.map((item, index) => {
                        const { text, icon, onClick } = item;
                        return (
                            <ListItem button key={text} onClick={onClick}>
                                {icon && <ListItemIcon>{icon}</ListItemIcon>}
                                <ListItemText primary={text} />
                                {/* <ListItemButton>
                            <ListItemIcon>

                            </ListItemIcon>
                            <ListItemText primary={text} />
                        </ListItemButton> */}
                            </ListItem>
                        )
                    })}
                    {!userId && itemsListNotLoggedIn.map((item, index) => {
                        const { text, icon, onClick } = item;
                        return (
                            <ListItem button key={text} onClick={onClick}>
                                {icon && <ListItemIcon>{icon}</ListItemIcon>}
                                <ListItemText primary={text} />
                                {/* <ListItemButton>
                            <ListItemIcon>

                            </ListItemIcon>
                            <ListItemText primary={text} />
                        </ListItemButton> */}
                            </ListItem>
                        )
                    })}
                </List>
                <Divider />

            </Drawer>
            <Main open={open}>

            </Main>
        </Box>
    )
}

export default Navbar;