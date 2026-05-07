import API from '../config';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const ALL_SKILLS = ['JavaScript','React','Node.js','Python','Java','C++','Flutter','Android','iOS','UI/UX Design','Machine Learning','Data Analysis','SQL','MongoDB','AWS','DevOps','Git','PHP','TypeScript','Figma','Django','Spring Boot'];

const inp = (extra = {}) => ({
  width: '100%', padding: '0.65rem 0.9rem',
  border: '1.5px solid #e8e5df', borderRadius: '8px',
  fontSize: '0.92rem', color: '#1a1917', outline: 'none',
  backgroundColor: '#f7f6f3', transition: 'border-color 0.15s',
  ...extra,
});

export default function AuthPage() {
  const [step, setStep] = useState('role'); // role → form
  const [mode, setMode] = useState('login'); // login | register
  const [role, setRole] = useState('');
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', company: '', githubUrl: '', linkedinUrl: '', resumeUrl: '' });
  const { login } = useAuth();
  const navigate = useNavigate();

  const toggleSkill = (s) => setSelectedSkills(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s]);

  const handleRoleSelect = (r) => {
    setRole(r);
    setStep('form');
  };

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const endpoint = mode === 'login'
  ? `${API}/api/auth/login`
  : `${API}/api/auth/register`;
      const payload = mode === 'login'
        ? { email: form.email, password: form.password }
        : { role, ...form, skills: selectedSkills };

      const { data } = await axios.post(endpoint, payload, {
  headers: {
    'Content-Type': 'application/json'
  }
});
      login(data);
      toast.success(mode === 'login' ? `Welcome back, ${data.name}! 👋` : `Account created! Welcome, ${data.name}! 🎉`);
      navigate(data.role === 'hr' ? '/hr/dashboard' : '/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  // Step 1: Choose Role
  if (step === 'role') {
    return (
      <div style={{ minHeight: 'calc(100vh - 60px)', backgroundColor: '#f7f6f3', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
        <div style={{ width: '100%', maxWidth: '460px' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.7rem', fontWeight: 800, color: '#1a1917', marginBottom: '0.4rem' }}>Welcome to InternHub</h2>
            <p style={{ color: '#97948e', fontSize: '0.95rem' }}>Who are you? Choose your role to continue.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
            {[
              { key: 'user', icon: '🎓', title: 'Student / Job Seeker', desc: 'Browse internships and apply to opportunities' },
              { key: 'hr', icon: '🏢', title: 'HR / Recruiter', desc: 'Post internships and manage applications' },
            ].map(r => (
              <div key={r.key} onClick={() => handleRoleSelect(r.key)} style={{
                backgroundColor: '#fff', border: '2px solid #e8e5df',
                borderRadius: '12px', padding: '1.5rem',
                cursor: 'pointer', textAlign: 'center',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#2563eb'; e.currentTarget.style.boxShadow = '0 0 0 4px #dbeafe'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#e8e5df'; e.currentTarget.style.boxShadow = 'none'; }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.7rem' }}>{r.icon}</div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1a1917', marginBottom: '0.3rem' }}>{r.title}</div>
                <div style={{ fontSize: '0.8rem', color: '#97948e', lineHeight: 1.4 }}>{r.desc}</div>
              </div>
            ))}
          </div>

          {/* Toggle login/register hint */}
          <div style={{ textAlign: 'center' }}>
            <button onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setStep('role'); }} style={{
              background: 'none', border: 'none', color: '#2563eb',
              fontSize: '0.88rem', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline',
            }}>
              {mode === 'login' ? "Don't have an account? Register" : 'Already have an account? Login'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Step 2: Login or Register form
  return (
    <div style={{ minHeight: 'calc(100vh - 60px)', backgroundColor: '#f7f6f3', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
      <div style={{ width: '100%', maxWidth: '500px' }}>
        {/* Back */}
        <button onClick={() => setStep('role')} style={{ background: 'none', border: 'none', color: '#97948e', fontSize: '0.88rem', cursor: 'pointer', marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          ← Back
        </button>

        <div style={{ backgroundColor: '#fff', border: '1px solid #e8e5df', borderRadius: '14px', padding: '2rem', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          {/* Header */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
              <span style={{
                backgroundColor: role === 'hr' ? '#ede9fe' : '#dbeafe',
                color: role === 'hr' ? '#7c3aed' : '#2563eb',
                padding: '0.2rem 0.7rem', borderRadius: '20px',
                fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase',
              }}>{role === 'hr' ? '🏢 HR / Recruiter' : '🎓 Student'}</span>
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1a1917' }}>
              {mode === 'login' ? 'Sign In' : 'Create Account'}
            </h2>
          </div>

          <form onSubmit={handleSubmit}>
            {mode === 'register' && (
              <>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', color: '#1a1917', marginBottom: '0.35rem' }}>Full Name *</label>
                  <input name="name" style={inp()} placeholder="Your full name" value={form.name} onChange={handleChange} required
                    onFocus={e => e.target.style.borderColor = '#2563eb'}
                    onBlur={e => e.target.style.borderColor = '#e8e5df'} />
                </div>

                {role === 'hr' && (
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', color: '#1a1917', marginBottom: '0.35rem' }}>Company Name *</label>
                    <input name="company" style={inp()} placeholder="Your company name" value={form.company} onChange={handleChange} required
                      onFocus={e => e.target.style.borderColor = '#2563eb'}
                      onBlur={e => e.target.style.borderColor = '#e8e5df'} />
                  </div>
                )}

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', color: '#1a1917', marginBottom: '0.35rem' }}>Phone Number *</label>
                  <input name="phone" style={inp()} placeholder="+91 98765 43210" value={form.phone} onChange={handleChange} required
                    onFocus={e => e.target.style.borderColor = '#2563eb'}
                    onBlur={e => e.target.style.borderColor = '#e8e5df'} />
                </div>
              </>
            )}

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', color: '#1a1917', marginBottom: '0.35rem' }}>Gmail Address *</label>
              <input name="email" type="email" style={inp()} placeholder="yourname@gmail.com" value={form.email} onChange={handleChange} required
                onFocus={e => e.target.style.borderColor = '#2563eb'}
                onBlur={e => e.target.style.borderColor = '#e8e5df'} />
            </div>

            <div style={{ marginBottom: mode === 'register' ? '1rem' : '1.5rem' }}>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', color: '#1a1917', marginBottom: '0.35rem' }}>Password *</label>
              <input name="password" type="password" style={inp()} placeholder={mode === 'register' ? 'Min 6 characters' : '••••••••'} value={form.password} onChange={handleChange} required
                onFocus={e => e.target.style.borderColor = '#2563eb'}
                onBlur={e => e.target.style.borderColor = '#e8e5df'} />
            </div>

            {mode === 'register' && (
              <>
                {/* Skills */}
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', color: '#1a1917', marginBottom: '0.2rem' }}>
                    Your Skills {role === 'user' ? '*' : '(optional)'}
                  </label>
                  <p style={{ fontSize: '0.78rem', color: '#97948e', marginBottom: '0.6rem' }}>Click to select</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                    {ALL_SKILLS.map(s => (
                      <span key={s} onClick={() => toggleSkill(s)} style={{
                        padding: '0.25rem 0.65rem', borderRadius: '5px',
                        fontSize: '0.78rem', cursor: 'pointer',
                        border: `1.5px solid ${selectedSkills.includes(s) ? '#2563eb' : '#e8e5df'}`,
                        backgroundColor: selectedSkills.includes(s) ? '#dbeafe' : '#f7f6f3',
                        color: selectedSkills.includes(s) ? '#2563eb' : '#514e48',
                        fontWeight: selectedSkills.includes(s) ? 600 : 400,
                        userSelect: 'none',
                      }}>{selectedSkills.includes(s) ? '✓ ' : ''}{s}</span>
                    ))}
                  </div>
                </div>

                {role === 'user' && (
                  <div style={{ borderTop: '1px solid #e8e5df', paddingTop: '1rem', marginBottom: '1rem' }}>
                    <p style={{ fontSize: '0.82rem', fontWeight: 600, color: '#514e48', marginBottom: '0.7rem' }}>
                      Profile Links (optional)
                    </p>
                    <div style={{ marginBottom: '0.7rem' }}>
                      <label style={{ display: 'block', fontSize: '0.82rem', color: '#514e48', marginBottom: '0.3rem' }}>GitHub URL</label>
                      <input name="githubUrl" style={inp()} placeholder="https://github.com/username" value={form.githubUrl} onChange={handleChange} />
                    </div>
                    <div style={{ marginBottom: '0.7rem' }}>
                      <label style={{ display: 'block', fontSize: '0.82rem', color: '#514e48', marginBottom: '0.3rem' }}>LinkedIn URL</label>
                      <input name="linkedinUrl" style={inp()} placeholder="https://linkedin.com/in/username" value={form.linkedinUrl} onChange={handleChange} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', color: '#514e48', marginBottom: '0.3rem' }}>Resume URL (Google Drive / Notion etc.)</label>
                      <input name="resumeUrl" style={inp()} placeholder="https://drive.google.com/..." value={form.resumeUrl} onChange={handleChange} />
                    </div>
                  </div>
                )}
              </>
            )}

            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '0.8rem',
              backgroundColor: loading ? '#93c5fd' : '#2563eb',
              color: '#fff', border: 'none', borderRadius: '9px',
              fontSize: '0.95rem', fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              marginTop: '0.5rem',
            }}>
              {loading ? 'Please wait...' : (mode === 'login' ? 'Sign In →' : 'Create Account →')}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.2rem', borderTop: '1px solid #e8e5df', paddingTop: '1rem' }}>
            <button onClick={() => setMode(mode === 'login' ? 'register' : 'login')} style={{
              background: 'none', border: 'none', color: '#2563eb',
              fontSize: '0.87rem', fontWeight: 600, cursor: 'pointer',
            }}>
              {mode === 'login' ? "New here? Create an account" : "Already have an account? Sign in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
