import React from 'react';

const candidates=[
 {name:'Rahul Sharma',email:'rahul@gmail.com',phone:'9876543210',status:'Under Review'},
 {name:'Priya Singh',email:'priya@gmail.com',phone:'9876543211',status:'Interview'},
]

export default function CandidatesPage(){
 return (
 <div className='page-container'>
   <div className='dashboard-header'>
    <h1>Candidates Management</h1>
    <p>Manage all applicants from one place</p>
   </div>

   <div className='table-wrapper modern-card'>
    <table className='candidate-table'>
      <thead>
       <tr>
        <th>Name</th>
        <th>Email</th>
        <th>Phone</th>
        <th>Status</th>
        <th>Actions</th>
       </tr>
      </thead>
      <tbody>
      {candidates.map((candidate,index)=>(
       <tr key={index}>
        <td>{candidate.name}</td>
        <td>{candidate.email}</td>
        <td>{candidate.phone}</td>
        <td><span className='status-badge'>{candidate.status}</span></td>
        <td>
         <div className='action-group'>
          <button className='primary-btn small-btn'>Select</button>
          <button className='danger-btn small-btn'>Reject</button>
         </div>
        </td>
       </tr>
      ))}
      </tbody>
    </table>
   </div>
 </div>
 )
}
