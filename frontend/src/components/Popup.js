import React from 'react';
import CloseIcon from '@mui/icons-material/Close';
import {Dialog,DialogContent,DialogContentText,DialogTitle,Typography}from '@mui/material';
import '../hide.css';

const Modals = ({ openPopup, pageTitle, children,  setOpenPopup,modalWidth }) => {
//alert(openPopup)
return (
  <>
      <Dialog open={openPopup} onClose={setOpenPopup} >
            <DialogTitle className='fonts' >
            <Typography variant="h6" component="div" style={{ flexGrow: 1 }}>
                        {pageTitle}
            </Typography>
            <span className='modal__close' onClick={(e) => setOpenPopup(false)}><CloseIcon /></span>
            </DialogTitle>
            <DialogContent style={{width:modalWidth}} >
                  {children}
            </DialogContent>
        </Dialog></>
  );
}
export default Modals;
/*
import React from 'react'
import { Dialog, DialogTitle, DialogContent, makeStyles, Typography } from '@material-ui/core';
import Controls from "./controls/Controls";
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles(theme => ({
    dialogWrapper: {
        padding: theme.spacing(2),
        position: 'absolute',
        top: theme.spacing(5)
    },
    dialogTitle: {
        paddingRight: '0px'
    }
}))

export default function Popup(props) {

    const { title, children, openPopup, setOpenPopup } = props;
    const classes = useStyles();

    return (
        <Dialog open={openPopup} maxWidth="md" classes={{ paper: classes.dialogWrapper }}>
            <DialogTitle className={classes.dialogTitle}>
                <div style={{ display: 'flex' }}>
                    <Typography variant="h6" component="div" style={{ flexGrow: 1 }}>
                        {title}
                    </Typography>
                    <Controls.ActionButton
                        color="secondary"
                        onClick={()=>{setOpenPopup(false)}}>
                        <CloseIcon />
                    </Controls.ActionButton>
                </div>
            </DialogTitle>
            <DialogContent dividers>
                {children}
            </DialogContent>
        </Dialog>
    )
}*/