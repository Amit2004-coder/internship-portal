import React from 'react';
import { useNavigate } from 'react-router-dom';

const TYPE_COLORS = {
  'Remote': { bg: '#dcfce7', color: '#15803d' },
  'Full-time': { bg: '#dbeafe', color: '#1d4ed8' },
  'Part-time': { bg: '#fef3c7', color: '#d97706' },
  'Hybrid': { bg: '#ede9fe', color: '#7c3aed' },
  'On-site': { bg: '#fee2e2', color: '#dc2626' },
};

export default function JobCard({ job }) {
  const navigate = useNavigate();
  const typeColor = TYPE_COLORS[job.type] || { bg: '#f3f4f6', color: '#4b5563' };
  const daysAgo = Math.floor((Date.now() - new Date(job.createdAt)) / 86400000);

  return (
    <div
      onClick={() => navigate(`/jobs/${job._id}`)}
      style={{
        backgroundColor: '#fff',
        border: '1px solid #e8e5df',
        borderRadius: '12px',
        padding: '1.4rem',
        cursor: 'pointer',
        transition: 'box-shadow 0.15s, border-color 0.15s, transform 0.1s',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
        e.currentTarget.style.borderColor = '#d4cfc6';
        e.currentTarget.style.transform = 'translateY(-1px)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.borderColor = '#e8e5df';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {/* Top row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
        <div style={{
          width: '44px', height: '44px', borderRadius: '10px',
          backgroundColor: '#f7f6f3', border: '1px solid #e8e5df',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.3rem', flexShrink: 0,
        }}>
          🏢
        </div>
        <span style={{
          fontSize: '0.75rem', color: '#97948e',
          marginTop: '0.2rem',
        }}>
          {daysAgo === 0 ? 'Today' : `${daysAgo}d ago`}
        </span>
      </div>

      {/* Title & Company */}
      <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1a1917', marginBottom: '0.2rem', lineHeight: 1.3 }}>
        {job.title}
      </h3>
      <p style={{ fontSize: '0.85rem', color: '#514e48', marginBottom: '0.8rem' }}>
        {job.company}
      </p>

      {/* Tags */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.9rem' }}>
        <span style={{ ...typeColor, padding: '0.2rem 0.6rem', borderRadius: '5px', fontSize: '0.75rem', fontWeight: 600 }}>
          {job.type}
        </span>
        {job.location && (
          <span style={{ backgroundColor: '#f7f6f3', color: '#514e48', border: '1px solid #e8e5df', padding: '0.2rem 0.6rem', borderRadius: '5px', fontSize: '0.75rem' }}>
            📍 {job.location}
          </span>
        )}
        {job.duration && (
          <span style={{ backgroundColor: '#f7f6f3', color: '#514e48', border: '1px solid #e8e5df', padding: '0.2rem 0.6rem', borderRadius: '5px', fontSize: '0.75rem' }}>
            ⏱ {job.duration}
          </span>
        )}
      </div>

      {/* Skills */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '0.9rem' }}>
        {job.skills?.slice(0, 4).map(sk => (
          <span key={sk} style={{
            backgroundColor: '#f7f6f3', color: '#514e48',
            border: '1px solid #e8e5df',
            padding: '0.15rem 0.55rem', borderRadius: '4px', fontSize: '0.75rem',
          }}>{sk}</span>
        ))}
        {job.skills?.length > 4 && (
          <span style={{ backgroundColor: '#dbeafe', color: '#2563eb', padding: '0.15rem 0.55rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>
            +{job.skills.length - 4}
          </span>
        )}
      </div>

      {/* Bottom */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f3f2ee', paddingTop: '0.75rem' }}>
        <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#16a34a' }}>
          {job.stipend || 'Stipend not mentioned'}
        </span>
        <span style={{ fontSize: '0.78rem', color: '#97948e' }}>
          {job.openings} opening{job.openings !== 1 ? 's' : ''}
        </span>
      </div>
    </div>
  );
}
