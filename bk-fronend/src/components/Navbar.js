import React, { useState, useEffect, useContext } from 'react';
import { AppBar, Toolbar, Typography, Box, List, Divider, ListItem, ListItemButton, ListItemText, ListItemIcon } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import { makeStyles } from "@material-ui/core/styles";
import Drawer from '@mui/material/Drawer';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import HomeIcon from '@mui/icons-material/Home';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import LogoutIcon from '@mui/icons-material/Logout';
import AtmIcon from '@mui/icons-material/Atm';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import MoneyIcon from '@mui/icons-material/Money';
import AddchartIcon from '@mui/icons-material/Addchart';
import AddBoxIcon from '@mui/icons-material/AddBox';
import HelpIcon from '@mui/icons-material/Help';
import PasswordIcon from '@mui/icons-material/Password';
import { toast } from 'react-toastify';
import { NavLink, useNavigate } from 'react-router-dom';
import '../hide.css';
import AuthContext from '../store/AuthContext';
import axios from 'axios';
import TreeView from '@mui/lab/TreeView';
import TreeItem from '@mui/lab/TreeItem';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { useTreeItem } from '@mui/lab/TreeItem';
import { logout } from '../routes/api';
axios.defaults.withCredentials = true;
const Navbar = () => {
    const navigate = useNavigate();
    const authCTX = useContext(AuthContext);
    const isLoggedIn = authCTX.isLoggedIn;
    const logoutUser = authCTX.logoutUser;
    const [name, setName] = useState('');
    const [userId, setUserid] = useState('');
    const [username, setUsername] = useState('');
    const drawerWidth = 310;

    const useTreeItemStyles = makeStyles(theme => ({
        content: {
            flexDirection: "row-reverse"
        },
        labelRoot: {
            display: "flex",
            alignItems: "center",
            padding: theme.spacing(0.5, 0)
        },
        labelIcon: {
            marginRight: theme.spacing(1)
        },
        labelText: {
            fontWeight: "inherit",
            flexGrow: 1
        },
    }));
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

    ///side bar drawer code start
    const itemsListNotLoggedIn = [
        {
            text: "Dashboard",
            icon: <HomeIcon />,
            onClick: (e) => onDashboard(e)
        },
        {
            text: "Master Management",
            icon: <AddchartIcon />,
            //onClick: (e) => onLogin(e)
        },
        {
            text: "User Management",
            icon: <PersonAddIcon />,
            //onClick: (e) => onLogin(e)
        },
        {
            text: "Accounts",
            icon: <ManageAccountsIcon />,
            // onClick: (e) => onRegister(e)
        },
        {
            text: "Fund Request",
            icon: <MoneyIcon />,
            // onClick: (e) => onRegister(e)
        },
        {
            text: "Withdrawl Request",
            icon: <AtmIcon />,
            //onClick: (e) => onRegister(e)
        },
        {
            text: "Support",
            icon: <HelpIcon />,
            onClick: (e) => onRegister(e)
        },
        {
            text: "Change Password",
            icon: <PasswordIcon />,
            onClick: (e) => onRegister(e)
        },
        {
            text: "2FA",
            icon: <HelpIcon />,
            onClick: (e) => onRegister(e)
        },
        {
            text: "Logout",
            icon: <LogoutIcon />,
            onClick: (e) => onLogout(e)
        }

    ];
    const handlechange = async (values) => {
        /*   if(values === 'Master Management3'){
               alert(values)
               navigate("Addnews");
           }*/
        //   alert(values)
        switch (values) {
            case 'Master Management2':
                navigate("Addoffer");
                break;
            case 'Master Management3':
                navigate("Addnews");
                break;
            case 'Master Management4':
                navigate("Addslider");
                break;
            case 'Master Management9':
                navigate("Priceinsert");
                break;
            case 'Fund Request2':
                navigate("Fundrequest");
                break;
            case 'Fund Request3':
                navigate("Pinactivation");
                break;
            case 'Fund Request4':
            //   navigate("Pinactivationreport");
            //   break;
            case 'Withdrawl Request2':
                navigate("Withdrawlrequest");
                break;
            case 'User Management3':
                navigate("Userreport");
                break;
            case 'User Management9':
                navigate("Pinactivationreport");
                break;
        }
        /*if(values === 'Master Management2'){
           navigate("Addoffer")  
        }*/
    }
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
        // handleDrawerClose();
    }
    const onRegister = (e) => {
        navigate('register');
        // handleDrawerClose();
    }
    const onDashboard = (e) => {
        navigate("Dashboard")
        // handleDrawerClose();
    }
    const onClick = (e) => {
        //  alert(e.target.value)
        // navigate("")
        // handleDrawerClose();
    }

    ///side bar drawer code end
    const onLogout = async (e) => {
        await logout().then(response => {
            if (response.status === 201) {
                setUserid('');
                logoutUser();
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/');
                handleDrawerClose();
                toast.success('GRIDX Admin is Logged out successfully!', {
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
    ///tree view start
    const CustomContent = React.forwardRef(function CustomContent(props, ref) {
        const {
            classes,
            className,
            label,
            nodeId,
            icon: iconProp,
            expansionIcon,
            displayIcon,
        } = props;

        const {
            disabled,
            expanded,
            selected,
            focused,
            handleExpansion,
            handleSelection,
            preventSelection
        } = useTreeItem(nodeId);
        //only expand if icon was clicked
      /*  const handleToggle = (event, nodeIds) => {
            event.persist()
            let iconClicked = event.target.closest(".MuiTreeItem-iconContainer")
            if (iconClicked) {
                setExpanded(nodeIds);
            }
        };

        //only select if icon wasn't clicked
        const handleSelect = (event, accountId) => {
            event.persist()
            let iconClicked = event.target.closest(".MuiTreeItem-iconContainer")
            if (!iconClicked) {
                setSelected(accountId);
            }
        };*/
        const icon = iconProp || expansionIcon || displayIcon;

        const handleMouseDown = (event) => {
            preventSelection(event);
        };

        const handleExpansionClick = (event) => {
            handleExpansion(event);
        };

        const handleSelectionClick = (event) => {
            //  alert(event.target.value)
            handleSelection(event);
        };

        return (
            // eslint-disable-next-line jsx-a11y/no-static-element-interactions
            <div
                className={clsx(className, classes.root, {
                    [classes.expanded]: expanded,
                    [classes.selected]: selected,
                    [classes.focused]: focused,
                    [classes.disabled]: disabled,
                })}
                onMouseDown={handleMouseDown}
                ref={ref}
            >
                {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
                <div onClick={handleExpansionClick} className={classes.iconContainer}>
                    {icon}
                </div>
                <Typography
                    onClick={handleSelectionClick}
                    component="div"
                    className={classes.label}
                >
                    {label}
                </Typography>
            </div>
        );
    });

    CustomContent.propTypes = {
        /**
         * Override or extend the styles applied to the component.
         */
        classes: PropTypes.object.isRequired,
        /**
         * className applied to the root element.
         */
        className: PropTypes.string,
        /**
         * The icon to display next to the tree node's label. Either a parent or end icon.
         */
        displayIcon: PropTypes.node,
        /**
         * The icon to display next to the tree node's label. Either an expansion or collapse icon.
         */
        expansionIcon: PropTypes.node,
        /**
         * The icon to display next to the tree node's label.
         */
        icon: PropTypes.node,
        /**
         * The tree node label.
         */
        label: PropTypes.node,
        /**
         * The id of the node.
         */
        nodeId: PropTypes.string.isRequired,
    };

    const CustomTreeItem = (props) => {

        const classes = useTreeItemStyles();
        const { labelText, labelIcon: LabelIcon, ...other } = props;
        // alert(labelText)
        return <TreeItem label={
            <div className={classes.labelRoot}>
                {/* <LabelIcon color="action" className={classes.labelIcon} /> */}
                <Typography variant="body2" className={classes.labelText} style={{ fontWeight: 'bold' }}>
                    {labelText}
                </Typography>
            </div>
        }
            classes={{
                content: classes.content
            }}
            {...other} />;
    }
    /*const useStyles = makeStyles(theme => ({
        root: {
          height: 216,
          flexGrow: 1,
          maxWidth: 230
        }
      }));*/
    const useStyles = makeStyles({
        root: {
            '&$selected': {
                backgroundColor: 'red',
                '&:hover': {
                    backgroundColor: 'yellow',
                }
            },
        },
        selected: {},
    });

    const IconExpansionTreeView = (item) => {
        const { text, icon, onClick } = item;
        return (
            <TreeView
                aria-label="icon expansion"
                defaultCollapseIcon={<ExpandMoreIcon />}
                //defaultCollapseIcon={`${text === 'Dashboard' ? <ExpandMoreIcon /> : ""}`}
                // defaultExpandIcon={`${text !== 'Dashboard' ? <>{<ChevronRightIcon />} </>: ""}`}
                defaultExpandIcon={<ChevronRightIcon />}
                sx={{ flexGrow: 1 }}
                style={{ fontSize: '10px' }}
            >
                {text === 'Dashboard' ? <>
                    <CustomTreeItem nodeId="1" label={text} sx={{ "& .MuiTreeItem-label": { fontSize: "1.0rem" } }}   >

                    </CustomTreeItem></> : ''}
                {text === 'Master Management' ? <>
                    <CustomTreeItem nodeId="1" label={text} sx={{ "& .MuiTreeItem-label": { fontSize: "1.0rem" } }}>
                        <CustomTreeItem nodeId="2" label="Add Offer" onClick={(e) => handlechange(`${text}` + 2)} sx={{ "& .MuiTreeItem-label": { fontSize: "0.8rem" } }} />
                        <CustomTreeItem nodeId="3" label="Add News" onClick={(e) => handlechange(`${text}` + 3)} sx={{ "& .MuiTreeItem-label": { fontSize: "0.8rem" } }} />
                        <CustomTreeItem nodeId="4" label="Add Slider" onClick={(e) => handlechange(`${text}` + 4)} sx={{ "& .MuiTreeItem-label": { fontSize: "0.8rem" } }} />
                        <CustomTreeItem nodeId="5" label="Add Wallet Type" onClick={(e) => handlechange(`${text}` + 5)} sx={{ "& .MuiTreeItem-label": { fontSize: "0.8rem" } }} />
                        <CustomTreeItem nodeId="6" label="System Settings" onClick={(e) => handlechange(`${text}` + 6)} sx={{ "& .MuiTreeItem-label": { fontSize: "0.8rem" } }} />
                        <CustomTreeItem nodeId="7" label="Contact Request Report" onClick={(e) => handlechange(`${text}` + 7)} sx={{ "& .MuiTreeItem-label": { fontSize: "0.8rem" } }} />
                        <CustomTreeItem nodeId="8" label="Bonanza" onClick={(e) => handlechange(`${text}` + 8)} sx={{ "& .MuiTreeItem-label": { fontSize: "0.8rem" } }} />
                        <CustomTreeItem nodeId="9" label="Price Insert" onClick={(e) => handlechange(`${text}` + 9)} sx={{ "& .MuiTreeItem-label": { fontSize: "0.8rem" } }} />
                    </CustomTreeItem></> : ''}
                {text === 'User Management' ? <>
                    <CustomTreeItem nodeId="1" label={text} sx={{ "& .MuiTreeItem-label": { fontSize: "1.0rem" } }}   >
                        <CustomTreeItem nodeId="2" label="Add User" onClick={(e) => handlechange(`${text}` + 2)} sx={{ "& .MuiTreeItem-label": { fontSize: "0.8rem" } }} />
                        <CustomTreeItem nodeId="3" label="User Report" onClick={(e) => handlechange(`${text}` + 3)} sx={{ "& .MuiTreeItem-label": { fontSize: "0.8rem" } }} />
                        <CustomTreeItem nodeId="4" label="User Report(Balance)" onClick={(e) => handlechange(`${text}` + 4)} sx={{ "& .MuiTreeItem-label": { fontSize: "0.8rem" } }} />

                        <CustomTreeItem nodeId="5" label="Direct Downline Report" onClick={(e) => handlechange(`${text}` + 5)} sx={{ "& .MuiTreeItem-label": { fontSize: "0.8rem" } }} />
                        <CustomTreeItem nodeId="6" label="User Login Report" onClick={(e) => handlechange(`${text}` + 6)} sx={{ "& .MuiTreeItem-label": { fontSize: "0.8rem" } }} />

                        <CustomTreeItem nodeId="7" label="Add Carry Forword" onClick={(e) => handlechange(`${text}` + 7)} sx={{ "& .MuiTreeItem-label": { fontSize: "0.8rem" } }} />
                        <CustomTreeItem nodeId="8" label="Add Carry Forword Report" onClick={(e) => handlechange(`${text}` + 8)} sx={{ "& .MuiTreeItem-label": { fontSize: "0.8rem" } }} />
                        <CustomTreeItem nodeId="9" label="User Topup Report" onClick={(e) => handlechange(`${text}` + 9)} sx={{ "& .MuiTreeItem-label": { fontSize: "0.8rem" } }} />
                        <CustomTreeItem nodeId="10" label="Tree Report" onClick={(e) => handlechange(`${text}` + 10)} sx={{ "& .MuiTreeItem-label": { fontSize: "0.8rem" } }} />
                    </CustomTreeItem></> : ''}
                {text === 'Accounts' ? <>
                    <CustomTreeItem nodeId="1" label={text} sx={{ "& .MuiTreeItem-label": { fontSize: "1.0rem" } }}   >
                        <CustomTreeItem nodeId="2" label="Credit Fund" onClick={(e) => handlechange(`${text}` + 2)} sx={{ "& .MuiTreeItem-label": { fontSize: "0.8rem" } }} />
                        <CustomTreeItem nodeId="3" label="Credit Fund Report" onClick={(e) => handlechange(`${text}` + 3)} sx={{ "& .MuiTreeItem-label": { fontSize: "0.8rem" } }} />
                        <CustomTreeItem nodeId="4" label="Debit Fund" onClick={(e) => handlechange(`${text}` + 4)} sx={{ "& .MuiTreeItem-label": { fontSize: "0.8rem" } }} />
                        <CustomTreeItem nodeId="5" label="Debit Fund Report" onClick={(e) => handlechange(`${text}` + 5)} sx={{ "& .MuiTreeItem-label": { fontSize: "0.8rem" } }} />
                        <CustomTreeItem nodeId="6" label="Direct Fund Report" onClick={(e) => handlechange(`${text}` + 6)} sx={{ "& .MuiTreeItem-label": { fontSize: "0.8rem" } }} />
                        <CustomTreeItem nodeId="7" label="Direct Income Report" onClick={(e) => handlechange(`${text}` + 7)} sx={{ "& .MuiTreeItem-label": { fontSize: "0.8rem" } }} />
                        <CustomTreeItem nodeId="8" label="Matching Income Report" onClick={(e) => handlechange(`${text}` + 8)} sx={{ "& .MuiTreeItem-label": { fontSize: "0.8rem" } }} />
                        <CustomTreeItem nodeId="9" label="Level Acheivement Report" onClick={(e) => handlechange(`${text}` + 9)} sx={{ "& .MuiTreeItem-label": { fontSize: "0.8rem" } }} />
                        <CustomTreeItem nodeId="10" label="Minting Bonus Report" onClick={(e) => handlechange(`${text}` + 10)} sx={{ "& .MuiTreeItem-label": { fontSize: "0.8rem" } }} />
                        <CustomTreeItem nodeId="11" label="Royalty Report" onClick={(e) => handlechange(`${text}` + 11)} sx={{ "& .MuiTreeItem-label": { fontSize: "0.8rem" } }} />
                        <CustomTreeItem nodeId="12" label="Transaction Report(Internal Wallet)" onClick={(e) => handlechange(`${text}` + 12)} sx={{ "& .MuiTreeItem-label": { fontSize: "0.8rem" } }} />
                        <CustomTreeItem nodeId="13" label="Transaction Report(External Wallet)" onClick={(e) => handlechange(`${text}` + 13)} sx={{ "& .MuiTreeItem-label": { fontSize: "0.8rem" } }} />
                        <CustomTreeItem nodeId="14" label="Transaction Report(External Wallet Count)" onClick={(e) => handlechange(`${text}` + 14)} sx={{ "& .MuiTreeItem-label": { fontSize: "0.8rem" } }} />
                        <CustomTreeItem nodeId="15" label="Transaction Report(Coin Wallet)" onClick={(e) => handlechange(`${text}` + 15)} sx={{ "& .MuiTreeItem-label": { fontSize: "0.8rem" } }} />
                        {/* <CustomTreeItem nodeId="16" label="Deposit(Smart Contract)" onClick={(e) => handlechange(`${text}` + 16)} sx={{ "& .MuiTreeItem-label": { fontSize: "0.8rem" } }} />
                        <CustomTreeItem nodeId="17" label="Withdrawl(Smart Contract)" onClick={(e) => handlechange(`${text}` + 17)} sx={{ "& .MuiTreeItem-label": { fontSize: "0.8rem" } }} /> */}
                        <CustomTreeItem nodeId="18" label="Re-Topup Report" onClick={(e) => handlechange(`${text}` + 18)} sx={{ "& .MuiTreeItem-label": { fontSize: "0.8rem" } }} />
                        <CustomTreeItem nodeId="19" label="Withdrawl Report" onClick={(e) => handlechange(`${text}` + 19)} sx={{ "& .MuiTreeItem-label": { fontSize: "0.8rem" } }} />
                        <CustomTreeItem nodeId="20" label="RTC Transfer Report" onClick={(e) => handlechange(`${text}` + 20)} sx={{ "& .MuiTreeItem-label": { fontSize: "0.8rem" } }} />
                        <CustomTreeItem nodeId="21" label="Bonanza Approval Report" onClick={(e) => handlechange(`${text}` + 21)} sx={{ "& .MuiTreeItem-label": { fontSize: "0.8rem" } }} />
                    </CustomTreeItem></> : ''}
                {/*text === 'Staking Requests' ? <>
                    <CustomTreeItem nodeId="1" label={text} sx={{ "& .MuiTreeItem-label": { fontSize: "1.0rem" } }}   >
                        <CustomTreeItem nodeId="2" label="Staking Request Report" onClick={(e) => handlechange(`${text}` + 2)} sx={{ "& .MuiTreeItem-label": { fontSize: "0.8rem" } }} />
                        <CustomTreeItem nodeId="3" label="Coin Request Report" onClick={(e) => handlechange(`${text}` + 3)} sx={{ "& .MuiTreeItem-label": { fontSize: "0.8rem" } }} />
                        <CustomTreeItem nodeId="4" label="Staking Pending" onClick={(e) => handlechange(`${text}` + 4)} sx={{ "& .MuiTreeItem-label": { fontSize: "0.8rem" } }} />
                        <CustomTreeItem nodeId="5" label="Old Staking Request" onClick={(e) => handlechange(`${text}` + 5)} sx={{ "& .MuiTreeItem-label": { fontSize: "0.8rem" } }} />
        </CustomTreeItem></> : ''*/}
                {text === 'Fund Request' ? <>
                    <CustomTreeItem nodeId="1" label={text} sx={{ "& .MuiTreeItem-label": { fontSize: "1.0rem" } }}   >
                        <CustomTreeItem nodeId="2" label="Fund Request Report" onClick={(e) => handlechange(`${text}` + 2)} sx={{ "& .MuiTreeItem-label": { fontSize: "0.8rem" } }} />
                        <CustomTreeItem nodeId="3" label="User Activation" onClick={(e) => handlechange(`${text}` + 3)} sx={{ "& .MuiTreeItem-label": { fontSize: "0.8rem" } }} />
                        <CustomTreeItem nodeId="4" label="Admin Activation Report" onClick={(e) => handlechange(`${text}` + 4)} sx={{ "& .MuiTreeItem-label": { fontSize: "0.8rem" } }} />
                    </CustomTreeItem></> : ''}
                {text === 'Withdrawl Request' ? <>
                    <CustomTreeItem nodeId="1" label={text} sx={{ "& .MuiTreeItem-label": { fontSize: "1.0rem" } }}   >
                        <CustomTreeItem nodeId="2" label="Withdrawl Request Report" onClick={(e) => handlechange(`${text}` + 2)} sx={{ "& .MuiTreeItem-label": { fontSize: "0.8rem" } }} />
                        <CustomTreeItem nodeId="3" label="Withdrawl Request Report(Excel)" onClick={(e) => handlechange(`${text}` + 3)} sx={{ "& .MuiTreeItem-label": { fontSize: "0.8rem" } }} />
                    </CustomTreeItem></> : ''}
                {text === 'Support' ? <>
                    <CustomTreeItem nodeId="1" label={text} sx={{ "& .MuiTreeItem-label": { fontSize: "1.0rem" } }}   >
                        <CustomTreeItem nodeId="2" label="View Ticket" onClick={(e) => handlechange(`${text}` + 2)} sx={{ "& .MuiTreeItem-label": { fontSize: "0.8rem" } }} />
                        <CustomTreeItem nodeId="3" label="Open Ticket" onClick={(e) => handlechange(`${text}` + 3)} sx={{ "& .MuiTreeItem-label": { fontSize: "0.8rem" } }} />
                    </CustomTreeItem></> : ''}
                {text === 'Change Password' ? <>
                    <CustomTreeItem nodeId="1" label={text} sx={{ "& .MuiTreeItem-label": { fontSize: "1.0rem" } }}   >

                    </CustomTreeItem></> : ''}
                {text === '2FA' ? <>
                    <CustomTreeItem nodeId="1" label={text} sx={{ "& .MuiTreeItem-label": { fontSize: "1.0rem" } }}   >
                        <CustomTreeItem nodeId="2" label="2FA" onClick={(e) => handlechange(`${text}` + 2)} sx={{ "& .MuiTreeItem-label": { fontSize: "0.8rem" } }} />
                    </CustomTreeItem></> : ''}
                {text === 'Logout' ? <>
                    <CustomTreeItem nodeId="1" label={text} sx={{ "& .MuiTreeItem-label": { fontSize: "1.0rem" } }}    >
                    </CustomTreeItem></> : ''}
            </TreeView>
        );
    }
    ///tree view ends
    useEffect(() => {
        const user = localStorage.getItem('user');
        const user_detail = JSON.parse(user);
        if (user_detail) {
            setUserid(user_detail._id);
            setUsername(user_detail.username);
            // navigate("Dashboard");
            setOpen(true);
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
                        style={{ pointerEvents: `${!userId ? "none" : ""}`, cursor: `${!userId ? "not-allowed" : ""}` }}
                        sx={{ mr: 2, ...(open && { display: 'none' }) }}
                    >
                        <MenuIcon disabled="disabled" />
                    </IconButton>
                    <Typography variant='h5' component="div" sx={{ flexGrow: 1 }}>GRIDX ECOSYSTEM</Typography>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <Typography component="div" sx={{ flexGrow: 1 }} className={`${!userId ? "mystyle" : ""}`} >Welcome {username}</Typography>
                    {/* <NavLink style={{ color: 'white' }} color="inherit" to="/join" className={`${!userId ? "mystyle" : ""}`} >Join</NavLink>&nbsp;&nbsp;
                    <NavLink style={{ color: 'white' }} to="/tree/:id" className={`${!userId ? "mystyle" : ""}`} >Tree</NavLink>&nbsp;&nbsp; */}
                    <NavLink style={{ color: 'white' }} onClick={(e) => onLogout(e)} className={`${!userId ? "mystyle" : ""}`} ><LogoutIcon /></NavLink>
                    <NavLink style={{ color: 'white' }} to="/" className={`${userId ? "mystyle" : ""}`} ><LoginIcon /></NavLink>
                    {/* <NavLink style={{ color: 'white' }} to="/register" className={`${userId ? "mystyle" : ""}`} >Register</NavLink> */}

                </Toolbar>
            </AppBar>
            {/*///side bar drawer code start*/}
            {userId ? <Drawer
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
                <Typography style={{ marginLeft: '5%', color: '#2462bf', fontWeight: 'bold' }}  >General</Typography>
                <Divider />
                <List >

                    {userId && itemsListNotLoggedIn.map((item, index) => {

                        const { text, icon, onClick } = item;
                        // alert(text)
                        return (
                            <ListItem key={text} onClick={onClick} style={{ width: '280px' }}>
                                {icon && <ListItemIcon style={{ color: '#2462bf', width: '280px' }}>{icon}
                                    {text === 'Dashboard' && IconExpansionTreeView(item)}{/*?<>&nbsp;&nbsp;&nbsp;<ListItemText primary={text} /></>:''*/}
                                    {text === 'Master Management' && IconExpansionTreeView(item)}
                                    {text === 'User Management' && IconExpansionTreeView(item)}
                                    {text === 'Accounts' && IconExpansionTreeView(item)}
                                    {/*text === 'Staking Requests' && IconExpansionTreeView(item)*/}
                                    {text === 'Fund Request' && IconExpansionTreeView(item)}
                                    {text === 'Withdrawl Request' && IconExpansionTreeView(item)}
                                    {text === 'Support' && IconExpansionTreeView(item)}
                                    {text === 'Change Password' && IconExpansionTreeView(item)}
                                    {text === '2FA' && IconExpansionTreeView(item)}
                                    {text === 'Logout' && IconExpansionTreeView(item)}
                                </ListItemIcon>}
                                {/* <ListItemText primary={text} /> */}
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
                : ''}
            {/*///side bar drawer code end*/}
            <Main open={open}>

            </Main>
        </Box>
    )
}

export default Navbar;




