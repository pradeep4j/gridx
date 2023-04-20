import React from 'react';
import {deleteNews} from '../../routes/api';

import '../../hide.css';

import {Link} from 'react-router-dom';

const Allnewsrecord = ({AllnewsRecord}) => {
      const deletestudent = async(e,id) => {
            if (window.confirm("Are you sure?")) {
              let targetSet = e.currentTarget;
              targetSet.innerText='Deleting';
               await deleteNews(id);
            }
      }      
    return (
      <tr key={AllnewsRecord._id}>
          <td>{AllnewsRecord.news}</td>
          <td>{AllnewsRecord.occupation}</td>
          <td><a style={{color:'white',textDecoration: 'none'}} className='btn btn-success btn-sm' href={`/editnews/${AllnewsRecord._id}`} >Edit</a></td>
          <td>
              <button className='btn btn-danger btn-sm' onClick={(e) => deletestudent(e,AllnewsRecord._id)}>Delete</button>
          </td>    
      </tr>
    )
}
export default Allnewsrecord;