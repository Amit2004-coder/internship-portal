import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const SKILLS_LIST = ['JavaScript','React','Node.js','Python','Java','C++','Flutter','Android','iOS','UI/UX Design','Machine Learning','Data Analysis','SQL','MongoDB','AWS','DevOps','Git','PHP','TypeScript','Figma','Django','Spring Boot'];

const STATUS_COLOR = {
  pending: { bg: '#fef3c7', color: '#d97706' },
  reviewing: { bg: '#dbeafe', color: '#2563eb' },
  shortlisted: { bg: '#dcfce7', color: '#16a34a' },
  rejected: { bg: '#fee2e2', color: '#dc2626' },
};

const inp = { width: '100%', padding: '0.6rem 0.85rem', border: '1.5px solid #e8e5df', borderRadius: '8px', fontSize: '0.9rem', color: '#1a1917', outline: 'none', backgroundColor: '#f7f6f3', fontFamily: 'inherit' };

const emptyJob = { title: '', company: '', location: '', type: 'Full-time', duration: '', stipend: '', description: '', responsibilities: '', requirements: '', openings: 1, deadline: '' };

export default function HRDashboard() {
  const { user } = useAuth();
  const [tab, setTab] = useState('jobs'); // jobs | post | applications
  const [myJobs, setMyJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [skills, setSkills] = useState([]);
  const [form, setForm] = useState({ ...emptyJob, company: user?.company || '' });
  const [loading, setLoading] = useState(false);
  const [editJob, setEditJob] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  useEffect(() => { fetchMyJobs(); }, []);

  const fetchMyJobs = async () => {
    try {
      const { data } = await axios.get('/api/jobs/hr/my-jobs');
      setMyJobs(data);
    } catch { toast.error('Failed to load jobs'); }
  };

  const fetchApplications = async (job) => {
    setSelectedJob(job);
    setTab('applications');
    try {
      const { data } = await axios.get(`/api/applications/job/${job._id}`);
      setApplications(data);
    } catch { toast.error('Failed to load applications'); }
  };

  const toggleSkill = s => setSkills(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s]);

  const handlePost = async e => {
    e.preventDefault();
    if (skills.length === 0) { toast.error('Please select at least one required skill'); return; }
    setLoading(true);
    try {
      const payload = {
        ...form,
        skills,
        openings: Number(form.openings),
        responsibilities: form.responsibilities ? form.responsibilities.split('\n').filter(Boolean) : [],
        requirements: form.requirements ? form.requirements.split('\n').filter(Boolean) : [],
        deadline: form.deadline || undefined,
      };
      if (editJob) {
        await axios.put(`/api/jobs/${editJob._id}`, payload);
        toast.success('Job updated!');
      } else {
        await axios.post('/api/jobs', payload);
        toast.success('Job posted! 🎉');
      }
      setForm({ ...emptyJob, company: user?.company || '' });
      setSkills([]);
      setEditJob(null);
      setTab('jobs');
      fetchMyJobs();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post job');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (job) => {
    setEditJob(job);
    setForm({
      title: job.title, company: job.company, location: job.location || '',
      type: job.type, duration: job.duration || '', stipend: job.stipend || '',
      description: job.description,
      responsibilities: job.responsibilities?.join('\n') || '',
      requirements: job.requirements?.join('\n') || '',
      openings: job.openings,
      deadline: job.deadline ? new Date(job.deadline).toISOString().split('T')[0] : '',
    });
    setSkills(job.skills || []);
    setTab('post');
  };

  const handleDelete = async (jobId) => {
    try {
      await axios.delete(`/api/jobs/${jobId}`);
      toast.success('Job deleted');
      setShowDeleteConfirm(null);
      fetchMyJobs();
    } catch { toast.error('Failed to delete'); }
  };

  const updateStatus = async (appId, status) => {
    try {
      const { data } = await axios.patch(`/api/applications/${appId}/status`, { status });
      setApplications(p => p.map(a => a._id === appId ? { ...a, status: data.status } : a));
      toast.success(`Marked as ${status}`);
    } catch { toast.error('Update failed'); }
  };

  const TabBtn = ({ name, label, count }) => (
    <button onClick={() => setTab(name)} style={{
      padding: '0.55rem 1.1rem', borderRadius: '8px',
      fontWeight: 600, fontSize: '0.88rem',
      border: '1.5px solid transparent',
      backgroundColor: tab === name ? '#2563eb' : '#fff',
      color: tab === name ? '#fff' : '#514e48',
      cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem',
    }}>
      {label}
      {count !== undefined && <span style={{ backgroundColor: tab === name ? 'rgba(255,255,255,0.25)' : '#f7f6f3', padding: '0.05rem 0.45rem', borderRadius: '10px', fontSize: '0.75rem' }}>{count}</span>}
    </button>
  );

  return (
    <div style={{ minHeight: 'calc(100vh - 60px)', backgroundColor: '#f7f6f3' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#1a1917' }}>HR Dashboard</h1>
            <p style={{ color: '#97948e', fontSize: '0.88rem' }}>Welcome back, {user?.name} · {user?.company}</p>
          </div>
          <button onClick={() => { setEditJob(null); setForm({ ...emptyJob, company: user?.company || '' }); setSkills([]); setTab('post'); }} style={{ backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '9px', padding: '0.65rem 1.4rem', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer' }}>
            + Post New Internship
          </button>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', backgroundColor: '#fff', padding: '0.5rem', borderRadius: '10px', border: '1px solid #e8e5df', width: 'fit-content', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <TabBtn name="jobs" label="My Job Posts" count={myJobs.length} />
          <TabBtn name="post" label={editJob ? '✏️ Edit Job' : '+ Post Job'} />
          {selectedJob && <TabBtn name="applications" label={`Applicants — ${selectedJob.title}`} count={applications.length} />}
        </div>

        {/* TAB: My Jobs */}
        {tab === 'jobs' && (
          <div>
            {myJobs.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem', backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #e8e5df' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📋</div>
                <h3 style={{ color: '#514e48', fontWeight: 700, marginBottom: '0.4rem' }}>No jobs posted yet</h3>
                <p style={{ color: '#97948e', fontSize: '0.9rem', marginBottom: '1.2rem' }}>Post your first internship to start receiving applications</p>
                <button onClick={() => setTab('post')} style={{ backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', padding: '0.6rem 1.4rem', fontWeight: 700, cursor: 'pointer' }}>Post Internship</button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                {myJobs.map(job => (
                  <div key={job._id} style={{ backgroundColor: '#fff', border: '1px solid #e8e5df', borderRadius: '12px', padding: '1.3rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.3rem', flexWrap: 'wrap' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1a1917' }}>{job.title}</h3>
                        <span style={{ backgroundColor: job.isActive ? '#dcfce7' : '#f3f4f6', color: job.isActive ? '#16a34a' : '#6b7280', padding: '0.15rem 0.55rem', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 600 }}>
                          {job.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <p style={{ color: '#97948e', fontSize: '0.82rem' }}>
                        {job.type} · {job.location} · {job.openings} opening{job.openings !== 1 ? 's' : ''}
                        {job.stipend ? ` · ${job.stipend}` : ''}
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <button onClick={() => fetchApplications(job)} style={{ padding: '0.45rem 0.9rem', borderRadius: '7px', fontSize: '0.82rem', fontWeight: 600, border: '1.5px solid #bfdbfe', backgroundColor: '#dbeafe', color: '#2563eb', cursor: 'pointer' }}>
                        View Applicants
                      </button>
                      <button onClick={() => handleEdit(job)} style={{ padding: '0.45rem 0.9rem', borderRadius: '7px', fontSize: '0.82rem', fontWeight: 600, border: '1.5px solid #e8e5df', backgroundColor: '#fff', color: '#514e48', cursor: 'pointer' }}>
                        Edit
                      </button>
                      <button onClick={() => setShowDeleteConfirm(job._id)} style={{ padding: '0.45rem 0.9rem', borderRadius: '7px', fontSize: '0.82rem', fontWeight: 600, border: '1.5px solid #fca5a5', backgroundColor: '#fee2e2', color: '#dc2626', cursor: 'pointer' }}>
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB: Post Job */}
        {tab === 'post' && (
          <div style={{ backgroundColor: '#fff', border: '1px solid #e8e5df', borderRadius: '14px', padding: '2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1a1917', marginBottom: '1.5rem' }}>
              {editJob ? '✏️ Edit Internship' : '📋 Post New Internship'}
            </h2>
            <form onSubmit={handlePost}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 600, fontSize: '0.83rem', color: '#1a1917', marginBottom: '0.3rem' }}>Job Title *</label>
                  <input style={inp} value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="e.g. Frontend Developer Intern" required />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: 600, fontSize: '0.83rem', color: '#1a1917', marginBottom: '0.3rem' }}>Company *</label>
                  <input style={inp} value={form.company} onChange={e => setForm(p => ({ ...p, company: e.target.value }))} placeholder="Company name" required />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: 600, fontSize: '0.83rem', color: '#1a1917', marginBottom: '0.3rem' }}>Location</label>
                  <input style={inp} value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))} placeholder="e.g. Bangalore / Remote" />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: 600, fontSize: '0.83rem', color: '#1a1917', marginBottom: '0.3rem' }}>Type</label>
                  <select style={inp} value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}>
                    {['Full-time','Part-time','Remote','Hybrid','On-site'].map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: 600, fontSize: '0.83rem', color: '#1a1917', marginBottom: '0.3rem' }}>Duration</label>
                  <input style={inp} value={form.duration} onChange={e => setForm(p => ({ ...p, duration: e.target.value }))} placeholder="e.g. 3 months, 6 months" />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: 600, fontSize: '0.83rem', color: '#1a1917', marginBottom: '0.3rem' }}>Stipend</label>
                  <input style={inp} value={form.stipend} onChange={e => setForm(p => ({ ...p, stipend: e.target.value }))} placeholder="e.g. ₹15,000/month or Unpaid" />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: 600, fontSize: '0.83rem', color: '#1a1917', marginBottom: '0.3rem' }}>Openings</label>
                  <input style={inp} type="number" min="1" value={form.openings} onChange={e => setForm(p => ({ ...p, openings: e.target.value }))} />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: 600, fontSize: '0.83rem', color: '#1a1917', marginBottom: '0.3rem' }}>Application Deadline</label>
                  <input style={inp} type="date" value={form.deadline} onChange={e => setForm(p => ({ ...p, deadline: e.target.value }))} />
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontWeight: 600, fontSize: '0.83rem', color: '#1a1917', marginBottom: '0.3rem' }}>Job Description *</label>
                <textarea style={{ ...inp, minHeight: '100px', resize: 'vertical' }} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Describe the internship role, team, and work..." required />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 600, fontSize: '0.83rem', color: '#1a1917', marginBottom: '0.3rem' }}>Responsibilities <span style={{ fontWeight: 400, color: '#97948e' }}>(one per line)</span></label>
                  <textarea style={{ ...inp, minHeight: '90px', resize: 'vertical' }} value={form.responsibilities} onChange={e => setForm(p => ({ ...p, responsibilities: e.target.value }))} placeholder={"Build React components\nWrite unit tests\nCollaborate with design team"} />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: 600, fontSize: '0.83rem', color: '#1a1917', marginBottom: '0.3rem' }}>Requirements <span style={{ fontWeight: 400, color: '#97948e' }}>(one per line)</span></label>
                  <textarea style={{ ...inp, minHeight: '90px', resize: 'vertical' }} value={form.requirements} onChange={e => setForm(p => ({ ...p, requirements: e.target.value }))} placeholder={"B.Tech 2nd year or above\nKnowledge of React\nGood communication"} />
                </div>
              </div>

              {/* Skills */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontWeight: 600, fontSize: '0.83rem', color: '#1a1917', marginBottom: '0.2rem' }}>Required Skills *</label>
                <p style={{ fontSize: '0.78rem', color: '#97948e', marginBottom: '0.6rem' }}>Click to select skills candidates should have</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {SKILLS_LIST.map(s => (
                    <span key={s} onClick={() => toggleSkill(s)} style={{ padding: '0.25rem 0.65rem', borderRadius: '5px', fontSize: '0.78rem', cursor: 'pointer', userSelect: 'none', border: `1.5px solid ${skills.includes(s) ? '#2563eb' : '#e8e5df'}`, backgroundColor: skills.includes(s) ? '#dbeafe' : '#f7f6f3', color: skills.includes(s) ? '#2563eb' : '#514e48', fontWeight: skills.includes(s) ? 600 : 400 }}>
                      {skills.includes(s) ? '✓ ' : ''}{s}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.7rem' }}>
                <button type="submit" disabled={loading} style={{ flex: 1, padding: '0.8rem', backgroundColor: loading ? '#93c5fd' : '#2563eb', color: '#fff', border: 'none', borderRadius: '9px', fontSize: '0.95rem', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer' }}>
                  {loading ? 'Saving...' : (editJob ? 'Update Job Post' : 'Post Internship 🚀')}
                </button>
                <button type="button" onClick={() => { setTab('jobs'); setEditJob(null); setForm({ ...emptyJob, company: user?.company || '' }); setSkills([]); }} style={{ padding: '0.8rem 1.4rem', backgroundColor: '#f7f6f3', color: '#514e48', border: '1.5px solid #e8e5df', borderRadius: '9px', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer' }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB: Applications */}
        {tab === 'applications' && selectedJob && (
          <div>
            <div style={{ marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1a1917' }}>
                Applicants for <span style={{ color: '#2563eb' }}>{selectedJob.title}</span>
              </h2>
              <p style={{ color: '#97948e', fontSize: '0.85rem' }}>{applications.length} total application{applications.length !== 1 ? 's' : ''}</p>
            </div>

            {applications.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem', backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #e8e5df' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.8rem' }}>📭</div>
                <h3 style={{ color: '#514e48', fontWeight: 700 }}>No applications yet</h3>
                <p style={{ color: '#97948e', fontSize: '0.9rem', marginTop: '0.3rem' }}>Share the job posting to attract applicants</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                {applications.map(app => (
                  <div key={app._id} style={{ backgroundColor: '#fff', border: '1px solid #e8e5df', borderRadius: '12px', padding: '1.4rem', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
                          <div style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: '#dbeafe', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.9rem', flexShrink: 0 }}>
                            {app.applicant?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                          </div>
                          <div>
                            <p style={{ fontWeight: 700, color: '#1a1917', fontSize: '0.95rem' }}>{app.applicant?.name}</p>
                            <p style={{ color: '#97948e', fontSize: '0.8rem' }}>{app.applicant?.email} · {app.applicant?.phone}</p>
                          </div>
                          <span style={{ ...STATUS_COLOR[app.status], padding: '0.2rem 0.65rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600 }}>
                            {app.status}
                          </span>
                        </div>

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.6rem' }}>
                          {app.resumeUrl && <a href={app.resumeUrl} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()} style={{ fontSize: '0.8rem', color: '#2563eb', fontWeight: 600, backgroundColor: '#dbeafe', padding: '0.2rem 0.6rem', borderRadius: '5px', textDecoration: 'none' }}>📄 Resume</a>}
                          {app.githubUrl && <a href={app.githubUrl} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()} style={{ fontSize: '0.8rem', color: '#514e48', backgroundColor: '#f7f6f3', border: '1px solid #e8e5df', padding: '0.2rem 0.6rem', borderRadius: '5px', textDecoration: 'none' }}>🐙 GitHub</a>}
                          {app.linkedinUrl && <a href={app.linkedinUrl} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()} style={{ fontSize: '0.8rem', color: '#0077b5', backgroundColor: '#e8f4fb', border: '1px solid #bfdbfe', padding: '0.2rem 0.6rem', borderRadius: '5px', textDecoration: 'none' }}>LinkedIn</a>}
                        </div>

                        {app.skills?.length > 0 && (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '0.5rem' }}>
                            {app.skills.map(s => <span key={s} style={{ backgroundColor: '#f7f6f3', border: '1px solid #e8e5df', borderRadius: '4px', padding: '0.15rem 0.5rem', fontSize: '0.75rem', color: '#514e48' }}>{s}</span>)}
                          </div>
                        )}

                        {app.coverNote && (
                          <p style={{ fontSize: '0.85rem', color: '#514e48', backgroundColor: '#f7f6f3', padding: '0.6rem 0.8rem', borderRadius: '7px', border: '1px solid #e8e5df', lineHeight: 1.6 }}>
                            "{app.coverNote}"
                          </p>
                        )}
                      </div>

                      {/* Status actions */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', flexShrink: 0 }}>
                        {['reviewing','shortlisted','rejected','pending'].filter(s => s !== app.status).map(s => (
                          <button key={s} onClick={() => updateStatus(app._id, s)} style={{
                            padding: '0.35rem 0.8rem', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', border: `1.5px solid ${STATUS_COLOR[s].color}22`,
                            backgroundColor: STATUS_COLOR[s].bg, color: STATUS_COLOR[s].color,
                          }}>
                            → {s.charAt(0).toUpperCase() + s.slice(1)}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Delete confirm */}
      {showDeleteConfirm && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '14px', padding: '2rem', maxWidth: '380px', width: '90%', textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.8rem' }}>⚠️</div>
            <h3 style={{ fontWeight: 800, color: '#1a1917', marginBottom: '0.5rem' }}>Delete Job Post?</h3>
            <p style={{ color: '#97948e', fontSize: '0.9rem', marginBottom: '1.5rem' }}>This will also remove all applications. This cannot be undone.</p>
            <div style={{ display: 'flex', gap: '0.7rem' }}>
              <button onClick={() => setShowDeleteConfirm(null)} style={{ flex: 1, padding: '0.7rem', border: '1.5px solid #e8e5df', borderRadius: '8px', backgroundColor: '#fff', color: '#514e48', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
              <button onClick={() => handleDelete(showDeleteConfirm)} style={{ flex: 1, padding: '0.7rem', border: 'none', borderRadius: '8px', backgroundColor: '#dc2626', color: '#fff', fontWeight: 700, cursor: 'pointer' }}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
