import React from 'react';
import {deleteNews} from '../../routes/api';

import '../../hide.css';

import {Link} from 'react-router-dom';

const Allfundrecord = ({AllfundRecord}) => {
      const deletefund = async(e,id) => {
            if (window.confirm("Are you sure?")) {
              let targetSet = e.currentTarget;
              targetSet.innerText='Deleting';
               await deleteNews(id);
            }
      }      
    return (
      <tr key={AllfundRecord._id}>
          <td>{AllfundRecord.news}</td>
          <td>{AllfundRecord.occupation}</td>
          <td>{AllfundRecord.occupation}</td>
          <td>{AllfundRecord.occupation}</td>
          <td>{AllfundRecord.occupation}</td>
          <td>{AllfundRecord.occupation}</td>
          <td>{AllfundRecord.occupation}</td>
          <td>{AllfundRecord.occupation}</td>
          <td>{AllfundRecord.occupation}</td>
          <td>{AllfundRecord.occupation}</td>
          <td>{AllfundRecord.occupation}</td>
          {/* <td><a style={{color:'white',textDecoration: 'none'}} className='btn btn-success btn-sm' href={`/editfund/${AllfundRecord._id}`} >Edit</a></td>
          <td>
              <button className='btn btn-danger btn-sm' onClick={(e) => deletefund(e,AllfundRecord._id)}>Delete</button>
          </td>     */}
      </tr>
    )
}
export default Allfundrecord;