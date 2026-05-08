import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const STATUS_COLOR = {
  pending: { bg: '#fef3c7', color: '#d97706' },
  reviewing: { bg: '#dbeafe', color: '#2563eb' },
  shortlisted: { bg: '#dcfce7', color: '#16a34a' },
  rejected: { bg: '#fee2e2', color: '#dc2626' },
};

export default function JobDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applyOpen, setApplyOpen] = useState(false);
  const [applied, setApplied] = useState(false);
  const [myApp, setMyApp] = useState(null);
  const [applyLoading, setApplyLoading] = useState(false);
  const [form, setForm] = useState({ resumeUrl: '', githubUrl: '', linkedinUrl: '', coverNote: '', skills: [] });
  const ALL_SKILLS = ['JavaScript','React','Node.js','Python','Java','C++','Flutter','UI/UX Design','Machine Learning','SQL','MongoDB','AWS','Git','TypeScript','Figma'];

  useEffect(() => {
    api.get(`/api/jobs/${id}`).then(r => { setJob(r.data); setLoading(false); }).catch(() => setLoading(false));
    if (user?.role === 'user') {
      api.get(`/api/applications/check/${id}`).then(r => {
        setApplied(r.data.applied);
        setMyApp(r.data.application);
        if (r.data.applied && user) {
          setForm(p => ({ ...p, resumeUrl: user.resumeUrl || '', githubUrl: user.githubUrl || '', linkedinUrl: user.linkedinUrl || '', skills: user.skills || [] }));
        }
      }).catch(() => {});
    }
    if (user) {
      setForm(p => ({ ...p, resumeUrl: user.resumeUrl || '', githubUrl: user.githubUrl || '', linkedinUrl: user.linkedinUrl || '', skills: user.skills || [] }));
    }
  }, [id, user]);

  const toggleSkill = s => setForm(p => ({
    ...p, skills: p.skills.includes(s) ? p.skills.filter(x => x !== s) : [...p.skills, s]
  }));

  const handleApply = async e => {
    e.preventDefault();
    if (!form.resumeUrl) { toast.error('Resume URL is required'); return; }
    setApplyLoading(true);
    try {
      await api.post('/api/applications', { jobId: id, ...form });
      setApplied(true);
      setApplyOpen(false);
      toast.success('Application submitted! 🎉');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to apply');
    } finally {
      setApplyLoading(false);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '5rem', color: '#97948e' }}>Loading...</div>;
  if (!job) return <div style={{ textAlign: 'center', padding: '5rem', color: '#dc2626' }}>Job not found</div>;

  return (
    <div style={{ minHeight: 'calc(100vh - 60px)', backgroundColor: '#f7f6f3', padding: '2rem 1rem' }}>
      <div style={{ maxWidth: '860px', margin: '0 auto' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: '#97948e', cursor: 'pointer', fontSize: '0.88rem', marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          ← Back to listings
        </button>

        {/* Header card */}
        <div style={{ backgroundColor: '#fff', border: '1px solid #e8e5df', borderRadius: '14px', padding: '2rem', marginBottom: '1.2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.8rem' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '12px', backgroundColor: '#f7f6f3', border: '1px solid #e8e5df', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem' }}>🏢</div>
                <div>
                  <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1a1917' }}>{job.title}</h1>
                  <p style={{ color: '#514e48', fontWeight: 600, fontSize: '0.95rem' }}>{job.company}</p>
                </div>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                {[
                  { icon: '📍', text: job.location },
                  { icon: '💼', text: job.type },
                  { icon: '⏱', text: job.duration },
                  { icon: '💰', text: job.stipend },
                  { icon: '👥', text: `${job.openings} opening${job.openings !== 1 ? 's' : ''}` },
                ].filter(x => x.text).map((item, i) => (
                  <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', backgroundColor: '#f7f6f3', border: '1px solid #e8e5df', borderRadius: '6px', padding: '0.3rem 0.7rem', fontSize: '0.82rem', color: '#514e48' }}>
                    {item.icon} {item.text}
                  </span>
                ))}
                {job.deadline && (
                  <span style={{ backgroundColor: '#fee2e2', border: '1px solid #fca5a5', borderRadius: '6px', padding: '0.3rem 0.7rem', fontSize: '0.82rem', color: '#dc2626', fontWeight: 600 }}>
                    ⏰ Apply by {new Date(job.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                )}
              </div>

              {/* Required skills */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {job.skills?.map(s => (
                  <span key={s} style={{ backgroundColor: '#dbeafe', color: '#2563eb', border: '1px solid #bfdbfe', borderRadius: '5px', padding: '0.2rem 0.6rem', fontSize: '0.78rem', fontWeight: 600 }}>{s}</span>
                ))}
              </div>
            </div>

            {/* Apply button / status */}
            <div style={{ flexShrink: 0 }}>
              {user?.role === 'user' ? (
                applied ? (
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ backgroundColor: '#dcfce7', border: '1px solid #a7f3d0', borderRadius: '10px', padding: '0.8rem 1.2rem', marginBottom: '0.4rem' }}>
                      <div style={{ fontWeight: 700, color: '#16a34a', fontSize: '0.9rem' }}>✅ Applied!</div>
                    </div>
                    {myApp?.status && (
                      <span style={{ ...STATUS_COLOR[myApp.status], padding: '0.2rem 0.7rem', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 600 }}>
                        Status: {myApp.status}
                      </span>
                    )}
                  </div>
                ) : (
                  <button onClick={() => setApplyOpen(true)} style={{ backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '10px', padding: '0.75rem 1.8rem', fontWeight: 700, fontSize: '1rem', cursor: 'pointer' }}>
                    Apply Now →
                  </button>
                )
              ) : !user ? (
                <button onClick={() => navigate('/auth')} style={{ backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '10px', padding: '0.75rem 1.8rem', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer' }}>
                  Login to Apply
                </button>
              ) : null}
            </div>
          </div>
        </div>

        {/* Details card */}
        <div style={{ backgroundColor: '#fff', border: '1px solid #e8e5df', borderRadius: '14px', padding: '2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
          {/* Description */}
          <section style={{ marginBottom: '1.8rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#1a1917', marginBottom: '0.8rem', borderBottom: '1px solid #e8e5df', paddingBottom: '0.5rem' }}>About the Internship</h3>
            <p style={{ color: '#514e48', lineHeight: 1.75, fontSize: '0.95rem', whiteSpace: 'pre-wrap' }}>{job.description}</p>
          </section>

          {job.responsibilities?.length > 0 && (
            <section style={{ marginBottom: '1.8rem' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#1a1917', marginBottom: '0.8rem', borderBottom: '1px solid #e8e5df', paddingBottom: '0.5rem' }}>Responsibilities</h3>
              <ul style={{ paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {job.responsibilities.map((r, i) => <li key={i} style={{ color: '#514e48', fontSize: '0.92rem', lineHeight: 1.6 }}>{r}</li>)}
              </ul>
            </section>
          )}

          {job.requirements?.length > 0 && (
            <section style={{ marginBottom: '1.8rem' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#1a1917', marginBottom: '0.8rem', borderBottom: '1px solid #e8e5df', paddingBottom: '0.5rem' }}>Requirements</h3>
              <ul style={{ paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {job.requirements.map((r, i) => <li key={i} style={{ color: '#514e48', fontSize: '0.92rem', lineHeight: 1.6 }}>{r}</li>)}
              </ul>
            </section>
          )}

          <section>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#1a1917', marginBottom: '0.8rem', borderBottom: '1px solid #e8e5df', paddingBottom: '0.5rem' }}>Posted By</h3>
            <p style={{ color: '#514e48', fontSize: '0.9rem' }}>
              <strong>{job.postedBy?.name}</strong> · {job.postedBy?.email}
              {job.postedBy?.company && ` · ${job.postedBy.company}`}
            </p>
          </section>
        </div>
      </div>

      {/* Apply Modal */}
      {applyOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999, padding: '1rem' }} onClick={() => setApplyOpen(false)}>
          <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '2rem', maxWidth: '520px', width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.2)', maxHeight: '85vh', overflowY: 'auto', position: 'relative' }} onClick={e => e.stopPropagation()}>
            <button onClick={() => setApplyOpen(false)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#97948e' }}>✕</button>

            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1a1917', marginBottom: '0.3rem' }}>Apply for {job.title}</h3>
            <p style={{ color: '#97948e', fontSize: '0.85rem', marginBottom: '1.5rem' }}>{job.company}</p>

            <form onSubmit={handleApply}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', color: '#1a1917', marginBottom: '0.35rem' }}>Resume URL * <span style={{ fontWeight: 400, color: '#97948e' }}>(Google Drive, Notion, etc.)</span></label>
                <input value={form.resumeUrl} onChange={e => setForm(p => ({ ...p, resumeUrl: e.target.value }))} placeholder="https://drive.google.com/..." required style={{ width: '100%', padding: '0.65rem 0.9rem', border: '1.5px solid #e8e5df', borderRadius: '8px', fontSize: '0.9rem', outline: 'none', backgroundColor: '#f7f6f3' }} />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', color: '#1a1917', marginBottom: '0.35rem' }}>GitHub Profile</label>
                <input value={form.githubUrl} onChange={e => setForm(p => ({ ...p, githubUrl: e.target.value }))} placeholder="https://github.com/username" style={{ width: '100%', padding: '0.65rem 0.9rem', border: '1.5px solid #e8e5df', borderRadius: '8px', fontSize: '0.9rem', outline: 'none', backgroundColor: '#f7f6f3' }} />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', color: '#1a1917', marginBottom: '0.35rem' }}>LinkedIn Profile</label>
                <input value={form.linkedinUrl} onChange={e => setForm(p => ({ ...p, linkedinUrl: e.target.value }))} placeholder="https://linkedin.com/in/username" style={{ width: '100%', padding: '0.65rem 0.9rem', border: '1.5px solid #e8e5df', borderRadius: '8px', fontSize: '0.9rem', outline: 'none', backgroundColor: '#f7f6f3' }} />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', color: '#1a1917', marginBottom: '0.2rem' }}>Skills you'll bring</label>
                <p style={{ fontSize: '0.78rem', color: '#97948e', marginBottom: '0.5rem' }}>Click to select</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                  {ALL_SKILLS.map(s => (
                    <span key={s} onClick={() => toggleSkill(s)} style={{ padding: '0.22rem 0.6rem', borderRadius: '5px', fontSize: '0.77rem', cursor: 'pointer', userSelect: 'none', border: `1.5px solid ${form.skills.includes(s) ? '#2563eb' : '#e8e5df'}`, backgroundColor: form.skills.includes(s) ? '#dbeafe' : '#f7f6f3', color: form.skills.includes(s) ? '#2563eb' : '#514e48', fontWeight: form.skills.includes(s) ? 600 : 400 }}>
                      {form.skills.includes(s) ? '✓ ' : ''}{s}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '1.2rem' }}>
                <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', color: '#1a1917', marginBottom: '0.35rem' }}>Why do you want this internship?</label>
                <textarea value={form.coverNote} onChange={e => setForm(p => ({ ...p, coverNote: e.target.value }))} rows={3} placeholder="A short note about why you're a great fit..." style={{ width: '100%', padding: '0.65rem 0.9rem', border: '1.5px solid #e8e5df', borderRadius: '8px', fontSize: '0.9rem', outline: 'none', backgroundColor: '#f7f6f3', resize: 'vertical', fontFamily: 'inherit' }} />
              </div>

              <button type="submit" disabled={applyLoading} style={{ width: '100%', padding: '0.8rem', backgroundColor: applyLoading ? '#93c5fd' : '#2563eb', color: '#fff', border: 'none', borderRadius: '9px', fontSize: '0.95rem', fontWeight: 700, cursor: applyLoading ? 'not-allowed' : 'pointer' }}>
                {applyLoading ? 'Submitting...' : 'Submit Application 🚀'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
