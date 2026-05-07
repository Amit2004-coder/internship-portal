<<<<<<< HEAD
# 🎓 InternHub — Full Stack Internship Portal

## Kya hai ye?
Ek complete internship portal jisme:
- **HR** internship post karta hai (JD, skills, company details etc.)
- **User/Student** browse karta hai, apply karta hai (resume link, GitHub, LinkedIn)
- Home page pe saari jobs bina login ke dikhti hain
- Role-based login (User / HR)

---

## Project Structure

```
intern-portal/
├── backend/
│   ├── models/      User.js, Job.js, Application.js
│   ├── routes/      auth.js, jobs.js, applications.js
│   ├── middleware/  auth.js (JWT protect)
│   └── server.js
└── frontend/
    └── src/
        ├── pages/
        │   ├── Home.js          ← Job listing (public)
        │   ├── AuthPage.js      ← Login/Register (role-based)
        │   ├── JobDetail.js     ← Job detail + Apply modal
        │   ├── HRDashboard.js   ← Post jobs, view applicants
        │   └── UserDashboard.js ← My applications
        ├── components/
        │   ├── Navbar.js
        │   └── JobCard.js
        └── context/AuthContext.js
```

---

## Setup

### Backend
```bash
cd backend
npm install
cp .env.example .env
# .env mein MONGO_URI aur JWT_SECRET dalo
npm run dev   # runs on http://localhost:5000
```

### Frontend
```bash
cd frontend
npm install
npm start   # runs on http://localhost:3000
```

---

## Flow

1. **Home page** → saari active jobs dikhti hain, search/filter karo
2. **Login/Signup** → pehle role choose karo (User ya HR), phir form
3. **HR Dashboard** → job post karo (title, company, JD, skills, stipend etc.), applicants dekho, status update karo
4. **User** → job detail page pe Apply karo (resume URL, GitHub, LinkedIn, skills)
5. **User Dashboard** → apni saari applications aur unka status dekho

---

## API Endpoints

| Method | Endpoint | Access |
|--------|----------|--------|
| POST | /api/auth/register | Public |
| POST | /api/auth/login | Public |
| GET | /api/jobs | Public |
| GET | /api/jobs/:id | Public |
| POST | /api/jobs | HR only |
| PUT | /api/jobs/:id | HR only |
| DELETE | /api/jobs/:id | HR only |
| GET | /api/jobs/hr/my-jobs | HR only |
| POST | /api/applications | User only |
| GET | /api/applications/my | User only |
| GET | /api/applications/job/:jobId | HR only |
| PATCH | /api/applications/:id/status | HR only |
| GET | /api/applications/check/:jobId | User only |
=======
# internship-portal
>>>>>>> d8280ccd427df2e2b4881c95334ed7bd6f1393d1
