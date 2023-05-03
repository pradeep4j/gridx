import React from 'react';
import { deleteNews } from '../../routes/api';
import getDateString from '../../utils/getdatestring';
import '../../hide.css';
import { Button, FormLabel, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Slide } from '@mui/material';
import { Link } from 'react-router-dom';
//import Controls from "../../components/controls/Controls";
import Popup from "../../components/Popup";
import FundApprovereject from './FundApprovereject';
let i = 1;
let statusname = '';

const Allfundrecord = ({ Allfundrecord }) => {
  const [open, setOpen] = React.useState(false);
  const [openPopup, setOpenPopup] = React.useState(false)
  const [recordForEdit, setRecordForEdit] = React.useState(null)
  const Transition = React.forwardRef(function Transition(props, ref) {
   // return <Slide direction="up" ref={ref} {...props} />;
  });

  <Popup
    title="Edit Fund Request Status"
    openPopup={openPopup}
    setOpenPopup={setOpenPopup}
  >
    <FundApprovereject
      recordForEdit={recordForEdit}
    />
  </Popup>

  const openInPopup = (item) => {
    setOpenPopup(true);
    setRecordForEdit(item);
    
  }
  if (Allfundrecord.status === 0) {
    statusname = 'Pending'
  } else if (Allfundrecord.status === 1) {
    statusname = 'Approved'
  }
  else {
    statusname = 'Rejected'
  }
  return (
    <tr key={Allfundrecord._id}>
      <td>{statusname}</td>
      <td>{Allfundrecord.userId}</td>
      <td>{Allfundrecord.userName}</td>
      <td >GDX</td>
      <td >{getDateString(Allfundrecord.created_at)}</td>
      <td >{getDateString(Allfundrecord.updated_at)}</td>
      <td >{(Allfundrecord.gdxamount).toFixed(2)}</td>
      <td ><a /*className='btn btn-success btn-sm'*/ target="_blank" href={Allfundrecord.hashUrl
      } >{(Allfundrecord.hash).slice(0, 30)}</a></td>
      <td >{Allfundrecord.remarks}</td>
      <td><Button variant="contained" /*style={{ backgroundColor: 'green' }}*/ onClick={() => openInPopup(Allfundrecord)}>Approve/Reject</Button></td>
    </tr>
  )
  i++;

}
export default Allfundrecord;
{/* <a className='btn btn-success btn-sm' href={`/editfund/${Allfundrecord._id}`} ></a> */ }