import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const STATUS_COLOR = {
  pending: { bg: '#fef3c7', color: '#d97706', label: '⏳ Pending' },
  reviewing: { bg: '#dbeafe', color: '#2563eb', label: '🔍 Under Review' },
  shortlisted: { bg: '#dcfce7', color: '#16a34a', label: '⭐ Shortlisted' },
  rejected: { bg: '#fee2e2', color: '#dc2626', label: '❌ Not Selected' },
};

export default function UserDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/applications/my')
      .then(r => { setApplications(r.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const formatDate = d => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  const stats = {
    total: applications.length,
    pending: applications.filter(a => a.status === 'pending').length,
    shortlisted: applications.filter(a => a.status === 'shortlisted').length,
    reviewing: applications.filter(a => a.status === 'reviewing').length,
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 60px)', backgroundColor: '#f7f6f3' }}>
      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.8rem' }}>
          <div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#1a1917' }}>My Dashboard</h1>
            <p style={{ color: '#97948e', fontSize: '0.88rem' }}>Track your internship applications</p>
          </div>
          <button onClick={() => navigate('/')} style={{ backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '9px', padding: '0.65rem 1.4rem', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer' }}>
            Browse Jobs →
          </button>
        </div>

        {/* Profile card */}
        <div style={{ backgroundColor: '#fff', border: '1px solid #e8e5df', borderRadius: '14px', padding: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.2rem', flexWrap: 'wrap', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#dbeafe', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.3rem', flexShrink: 0 }}>
            {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
          </div>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1a1917', marginBottom: '0.2rem' }}>{user?.name}</h2>
            <p style={{ color: '#97948e', fontSize: '0.85rem' }}>{user?.email} · {user?.phone}</p>
            {user?.skills?.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.6rem' }}>
                {user.skills.map(s => <span key={s} style={{ backgroundColor: '#f7f6f3', border: '1px solid #e8e5df', borderRadius: '4px', padding: '0.15rem 0.5rem', fontSize: '0.75rem', color: '#514e48' }}>{s}</span>)}
              </div>
            )}
          </div>
          <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
            {user?.githubUrl && <a href={user.githubUrl} target="_blank" rel="noreferrer" style={{ fontSize: '0.82rem', color: '#514e48', backgroundColor: '#f7f6f3', border: '1px solid #e8e5df', padding: '0.3rem 0.7rem', borderRadius: '6px', textDecoration: 'none' }}>🐙 GitHub</a>}
            {user?.linkedinUrl && <a href={user.linkedinUrl} target="_blank" rel="noreferrer" style={{ fontSize: '0.82rem', color: '#0077b5', backgroundColor: '#e8f4fb', border: '1px solid #bfdbfe', padding: '0.3rem 0.7rem', borderRadius: '6px', textDecoration: 'none' }}>LinkedIn</a>}
            {user?.resumeUrl && <a href={user.resumeUrl} target="_blank" rel="noreferrer" style={{ fontSize: '0.82rem', color: '#16a34a', backgroundColor: '#dcfce7', border: '1px solid #a7f3d0', padding: '0.3rem 0.7rem', borderRadius: '6px', textDecoration: 'none' }}>📄 Resume</a>}
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.8rem', marginBottom: '1.8rem' }}>
          {[
            { label: 'Total Applied', num: stats.total, color: '#1a1917' },
            { label: 'Under Review', num: stats.reviewing, color: '#2563eb' },
            { label: 'Shortlisted', num: stats.shortlisted, color: '#16a34a' },
            { label: 'Pending', num: stats.pending, color: '#d97706' },
          ].map(st => (
            <div key={st.label} style={{ backgroundColor: '#fff', border: '1px solid #e8e5df', borderRadius: '10px', padding: '1.1rem 1.2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <div style={{ fontSize: '1.7rem', fontWeight: 800, color: st.color, lineHeight: 1 }}>{st.num}</div>
              <div style={{ fontSize: '0.78rem', color: '#97948e', fontWeight: 500, marginTop: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{st.label}</div>
            </div>
          ))}
        </div>

        {/* Applications */}
        <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#1a1917', marginBottom: '0.8rem' }}>My Applications</h2>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#97948e' }}>Loading...</div>
        ) : applications.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #e8e5df' }}>
            <div style={{ fontSize: '3rem', marginBottom: '0.8rem' }}>📭</div>
            <h3 style={{ color: '#514e48', fontWeight: 700, marginBottom: '0.4rem' }}>No applications yet</h3>
            <p style={{ color: '#97948e', fontSize: '0.9rem', marginBottom: '1.2rem' }}>Start exploring internships and apply!</p>
            <button onClick={() => navigate('/')} style={{ backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', padding: '0.6rem 1.4rem', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem' }}>
              Browse Internships →
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            {applications.map(app => (
              <div key={app._id} style={{ backgroundColor: '#fff', border: '1px solid #e8e5df', borderRadius: '12px', padding: '1.3rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.8rem', boxShadow: '0 1px 4px rgba(0,0,0,0.05)', cursor: 'pointer' }} onClick={() => navigate(`/jobs/${app.job?._id}`)}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '0.25rem' }}>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1a1917' }}>{app.job?.title}</h3>
                    <span style={{ ...STATUS_COLOR[app.status], padding: '0.18rem 0.6rem', borderRadius: '20px', fontSize: '0.73rem', fontWeight: 600 }}>
                      {STATUS_COLOR[app.status]?.label}
                    </span>
                  </div>
                  <p style={{ color: '#97948e', fontSize: '0.82rem' }}>
                    {app.job?.company} · {app.job?.type} · {app.job?.location}
                    {app.job?.stipend ? ` · ${app.job.stipend}` : ''}
                  </p>
                  <p style={{ color: '#97948e', fontSize: '0.78rem', marginTop: '0.2rem' }}>Applied on {formatDate(app.createdAt)}</p>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#2563eb', fontWeight: 600 }}>View Job →</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
