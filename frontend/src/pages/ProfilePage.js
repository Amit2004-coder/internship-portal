import React from 'react';

const applications = [
 {title:'Frontend Intern',company:'TechNova',status:'Under Review'},
 {title:'MERN Developer',company:'CodeCraft',status:'Interview Scheduled'},
];

export default function ProfilePage(){
 return (
 <div className='page-container'>
  <div className='dashboard-header'>
   <h1>User Profile</h1>
   <p>Manage your profile and track applications</p>
  </div>
  <div className='responsive-grid'>
   <div className='modern-card'>
    <h2>Personal Information</h2>
    <div className='profile-list'>
      <p><strong>Name:</strong> Amit Kumar</p>
      <p><strong>Email:</strong> amit@example.com</p>
      <p><strong>Phone:</strong> +91 9876543210</p>
      <p><strong>GitHub:</strong> github.com/amit</p>
      <p><strong>LinkedIn:</strong> linkedin.com/in/amit</p>
    </div>
    <button className='primary-btn'>Edit Profile</button>
   </div>

   <div className='modern-card'>
    <h2>Applied Jobs / Internships</h2>
    {applications.map((app,index)=>(
      <div key={index} className='application-item'>
        <div>
          <h3>{app.title}</h3>
          <p>{app.company}</p>
        </div>
        <span className='status-badge'>{app.status}</span>
      </div>
    ))}
   </div>
  </div>
 </div>
 )
}
