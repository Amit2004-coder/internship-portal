import React, { useState, useEffect, useCallback } from 'react';
import api from '../api';
import JobCard from '../components/JobCard';

const SKILL_SUGGESTIONS = ['React', 'Node.js', 'Python', 'Java', 'Flutter', 'Machine Learning', 'UI/UX', 'AWS', 'SQL', 'MongoDB'];
const JOB_TYPES = ['all', 'Full-time', 'Part-time', 'Remote', 'Hybrid', 'On-site'];

export default function Home() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [skill, setSkill] = useState('');
  const [type, setType] = useState('all');

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (skill) params.skill = skill;
      if (type !== 'all') params.type = type;

      const { data } = await api.get('/api/jobs', { params });

console.log("FETCHED JOBS 👉", data);

setJobs(Array.isArray(data) ? data : []);

      // ✅ FIX (important): ensure always array
      if (Array.isArray(data)) {
        setJobs(data);
      } else if (Array.isArray(data?.jobs)) {
        setJobs(data.jobs);
      } else {
        setJobs([]);
      }

    } catch (err) {
      console.log("API Error:", err);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }, [search, skill, type]);

  useEffect(() => {
    const t = setTimeout(fetchJobs, 300);
    return () => clearTimeout(t);
  }, [fetchJobs]);

  return (
    <div style={{ minHeight: 'calc(100vh - 60px)', backgroundColor: '#f7f6f3' }}>

      {/* Hero */}
      <div style={{
        backgroundColor: '#fff',
        borderBottom: '1px solid #e8e5df',
        padding: '3rem 1.5rem 2.5rem',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          
          <div style={{
            display: 'inline-block',
            backgroundColor: '#dbeafe',
            color: '#2563eb',
            fontSize: '0.78rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            padding: '0.25rem 0.8rem',
            borderRadius: '20px',
            marginBottom: '1rem',
          }}>
            🎯 Fresh Internship Opportunities
          </div>

          <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 800, color: '#1a1917', marginBottom: '0.75rem', lineHeight: 1.15 }}>
            Find Internships That<br />
            <span style={{ color: '#2563eb' }}>Actually Match You</span>
          </h1>

          <p style={{ color: '#514e48', fontSize: '1rem', marginBottom: '2rem' }}>
            Browse {jobs.length > 0 ? `${jobs.length}+ ` : ''}curated internship opportunities from top companies
          </p>

          {/* Search */}
          <div style={{
            display: 'flex',
            gap: '0.5rem',
            backgroundColor: '#fff',
            border: '1.5px solid #e8e5df',
            borderRadius: '12px',
            padding: '0.5rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          }}>
            <input
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                fontSize: '0.95rem',
                color: '#1a1917',
                padding: '0.4rem 0.6rem',
                backgroundColor: 'transparent',
              }}
              placeholder="Search by job title, company..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />

            <button
              onClick={fetchJobs}
              style={{
                backgroundColor: '#2563eb',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                padding: '0.5rem 1.2rem',
                fontWeight: 700,
                fontSize: '0.9rem',
              }}
            >
              Search
            </button>
          </div>

        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem' }}>

        {/* Filters */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.7rem', marginBottom: '1.5rem' }}>

          <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Filter:</span>

          {JOB_TYPES.map(t => (
            <button
              key={t}
              onClick={() => setType(t)}
              style={{
                padding: '0.35rem 0.85rem',
                borderRadius: '20px',
                fontSize: '0.82rem',
                fontWeight: 600,
                border: `1.5px solid ${type === t ? '#2563eb' : '#e8e5df'}`,
                backgroundColor: type === t ? '#dbeafe' : '#fff',
                color: type === t ? '#2563eb' : '#514e48',
                cursor: 'pointer',
              }}
            >
              {t === 'all' ? 'All Types' : t}
            </button>
          ))}

          <input
            placeholder="Skill..."
            value={skill}
            onChange={e => setSkill(e.target.value)}
            style={{
              padding: '0.35rem 0.8rem',
              border: '1.5px solid #e8e5df',
              borderRadius: '20px',
            }}
          />

          {(search || skill || type !== 'all') && (
            <button
              onClick={() => { setSearch(''); setSkill(''); setType('all'); }}
              style={{
                padding: '0.35rem 0.75rem',
                borderRadius: '20px',
                border: '1px solid #e8e5df',
              }}
            >
              Clear
            </button>
          )}

        </div>

        {/* Skills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.5rem' }}>
          {SKILL_SUGGESTIONS.map(s => (
            <button
              key={s}
              onClick={() => setSkill(skill === s ? '' : s)}
              style={{
                padding: '0.25rem 0.7rem',
                borderRadius: '5px',
                border: '1px solid #e8e5df',
              }}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Results */}
        <h2>
          {loading ? 'Loading...' : `${jobs.length} Jobs Found`}
        </h2>

        {/* JOB LIST */}
        {loading ? (
          <p>Loading...</p>
        ) : jobs.length === 0 ? (
          <p>No jobs found</p>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '1rem',
          }}>
            {Array.isArray(jobs) && jobs.map(job => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}