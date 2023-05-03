import React,{useState} from 'react';
import { Typography, FormGroup, styled, Paper, Select, FormControl, MenuItem, InputLabel } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
//import { styled } from '@mui/material/styles';
import { Card, Row, Col, NavLink } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import GroupsIcon from '@mui/icons-material/Groups';
const Container = styled(FormGroup)`
width: 75%;
margin: 2% auto 0 23%;
& > div {
    margin-top:60px;
}
`

const Dashboard = () => {
    const [duration, setDuration] = useState('1');

    const handleChange = (event) => {
        setDuration(event.target.value);
    };
    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
        ...theme.typography.body2,
        padding: theme.spacing(2),
        textAlign: 'left',
        color: theme.palette.text.secondary,
    }));

    return (

        <Container>
            <FormControl sx={1} style={{width:'200px',marginTop:'2%',bottom:0}}>
                <InputLabel id="demo-simple-select-helper-label">Duration</InputLabel>
                <Select
                    labelId="demo-simple-select-helper-label"
                    id="demo-simple-select-helper"
                    value={duration}
                    label="Duration"
                    onChange={handleChange}
                    displayEmpty
                >
                    <MenuItem value={1}>Total</MenuItem>
                    <MenuItem value={2}>Monthly</MenuItem>
                    <MenuItem value={3}>Weekly</MenuItem>
                    <MenuItem value={4}>Today</MenuItem>
                </Select>
            </FormControl>
            <Grid container spacing={3} style={{ marginTop: '2%' }}>
                <Grid xs={3} >
                    <Item style={{ backgroundColor: '#3183bd' }}>

                        <Link to='' style={{ color: 'white', fontWeight: 'bold', textDecoration: 'none' }}>
                            <GroupsIcon style={{ color: 'white', fontSize: '50' }} />

                            <Card.Title > Total Users - Hello</Card.Title>

                        </Link>

                    </Item>

                </Grid>
                <Grid xs={3} >
                    <Item style={{ backgroundColor: '#3183bd' }}>

                        <Link to='' style={{ color: 'white', fontWeight: 'bold', textDecoration: 'none' }}>
                            <GroupsIcon style={{ color: 'white', fontSize: '50' }} />

                            <Card.Title > Activation</Card.Title>

                        </Link>

                    </Item>
                </Grid>
                <Grid xs={3} >
                    <Item style={{ backgroundColor: '#3183bd' }}>

                        <Link to='' style={{ color: 'white', fontWeight: 'bold', textDecoration: 'none' }}>
                            <GroupsIcon style={{ color: 'white', fontSize: '50' }} />

                            <Card.Title >Renew</Card.Title>

                        </Link>

                    </Item>
                </Grid>
                <Grid xs={3} >
                    <Item style={{ backgroundColor: '#3183bd' }}>

                        <Link to='' style={{ color: 'white', fontWeight: 'bold', textDecoration: 'none' }}>
                            <GroupsIcon style={{ color: 'white', fontSize: '50' }} />

                            <Card.Title > Internal Wallet</Card.Title>

                        </Link>

                    </Item>
                </Grid>
                <Grid xs={3} >
                    <Item style={{ backgroundColor: '#3183bd' }}>

                        <Link to='' style={{ color: 'white', fontWeight: 'bold', textDecoration: 'none' }}>
                            <GroupsIcon style={{ color: 'white', fontSize: '50' }} />

                            <Card.Title > Internal GDX Wallet </Card.Title>

                        </Link>

                    </Item>
                </Grid>
                <Grid xs={3} >
                    <Item style={{ backgroundColor: '#3183bd' }}>

                        <Link to='' style={{ color: 'white', fontWeight: 'bold', textDecoration: 'none' }}>
                            <GroupsIcon style={{ color: 'white', fontSize: '50' }} />

                            <Card.Title > External  Wallet</Card.Title>

                        </Link>

                    </Item>
                </Grid>
                <Grid xs={3} >
                    <Item style={{ backgroundColor: '#3183bd' }}>

                        <Link to='' style={{ color: 'white', fontWeight: 'bold', textDecoration: 'none' }}>
                            <GroupsIcon style={{ color: 'white', fontSize: '50' }} />

                            <Card.Title > External GDX Wallet</Card.Title>

                        </Link>

                    </Item>
                </Grid>
                <Grid xs={3} >
                    <Item style={{ backgroundColor: '#3183bd' }}>

                        <Link to='' style={{ color: 'white', fontWeight: 'bold', textDecoration: 'none' }}>
                            <GroupsIcon style={{ color: 'white', fontSize: '50' }} />

                            <Card.Title > Payouts </Card.Title>

                        </Link>

                    </Item>
                </Grid>
                <Grid xs={3} >
                    <Item style={{ backgroundColor: '#3183bd' }}>

                        <Link to='' style={{ color: 'white', fontWeight: 'bold', textDecoration: 'none' }}>
                            <GroupsIcon style={{ color: 'white', fontSize: '50' }} />

                            <Card.Title > Withdrawal</Card.Title>

                        </Link>

                    </Item>
                </Grid>

                <Grid xs={3} >
                    <Item style={{ backgroundColor: '#3183bd' }}>

                        <Link to='' style={{ color: 'white', fontWeight: 'bold', textDecoration: 'none' }}>
                            <GroupsIcon style={{ color: 'white', fontSize: '50' }} />

                            <Card.Title >Active by Payout</Card.Title>

                        </Link>

                    </Item>
                </Grid>
                <Grid xs={3} >
                    <Item style={{ backgroundColor: '#3183bd' }}>

                        <Link to='' style={{ color: 'white', fontWeight: 'bold', textDecoration: 'none' }}>
                            <GroupsIcon style={{ color: 'white', fontSize: '50' }} />

                            <Card.Title >Active By GDX</Card.Title>

                        </Link>

                    </Item>
                </Grid>
                <Grid xs={3} >
                    <Item style={{ backgroundColor: '#3183bd' }}>

                        <Link to='' style={{ color: 'white', fontWeight: 'bold', textDecoration: 'none' }}>
                            <GroupsIcon style={{ color: 'white', fontSize: '50' }} />

                            <Card.Title >P2P</Card.Title>

                        </Link>

                    </Item>
                </Grid>
            </Grid>

        </Container>

    )
}

export default Dashboard;