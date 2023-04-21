import React from 'react';
import {deleteNews} from '../../routes/api';

import '../../hide.css';

import {Link} from 'react-router-dom';

const WithdrawlrequestRecord = ({Withdrawlrequestrecord}) => {
      const deletefund = async(e,id) => {
            if (window.confirm("Are you sure?")) {
              let targetSet = e.currentTarget;
              targetSet.innerText='Deleting';
               await deleteNews(id);
            }
      }      
    return (
      <tr key={Withdrawlrequestrecord._id}>
          <td>{Withdrawlrequestrecord.news}</td>
          <td>{Withdrawlrequestrecord.occupation}</td>
          <td>{Withdrawlrequestrecord.occupation}</td>
          <td>{Withdrawlrequestrecord.occupation}</td>
          <td>{Withdrawlrequestrecord.occupation}</td>
          <td>{Withdrawlrequestrecord.occupation}</td>
          <td>{Withdrawlrequestrecord.occupation}</td>
          <td>{Withdrawlrequestrecord.occupation}</td>
          <td>{Withdrawlrequestrecord.occupation}</td>
          <td>{Withdrawlrequestrecord.occupation}</td>
          <td>{Withdrawlrequestrecord.occupation}</td>
          <td>{Withdrawlrequestrecord.occupation}</td>
          <td><a style={{color:'white',textDecoration: 'none'}} className='btn btn-success btn-sm' href={`/editfund/${Withdrawlrequestrecord._id}`} >Action</a></td>
      </tr>
    )
}
export default WithdrawlrequestRecord;