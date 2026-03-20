'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import Navbar from '@/components/Navbar';
import { Loader2, UploadCloud, FileText, Trash2 } from 'lucide-react';

const SAMPLE_JD = `Senior Data Engineer – TechCorp Inc.

We are looking for a Senior Data Engineer to join our data platform team.

Responsibilities:
- Design, build, and maintain scalable data pipelines using Apache Spark and Airflow
- Work closely with data scientists and analysts to deliver production-grade ML pipelines
- Architect and optimize data warehouses on Snowflake and BigQuery
- Implement real-time streaming pipelines using Apache Kafka
- Ensure data quality, lineage, and governance across all data products
- Mentor junior engineers and participate in architecture reviews

Requirements:
- 5+ years of experience in data engineering
- Strong proficiency in Python and SQL
- Hands-on experience with Spark, Airflow, and Kafka
- Familiarity with cloud platforms (AWS, GCP, or Azure)
- Experience with dbt for data transformation
- Knowledge of data modeling and dimensional design
- Bachelor's or Master's degree in Computer Science, Engineering, or a related field

Nice to have:
- Experience with Kubernetes and Docker
- Knowledge of ML pipelines (MLflow, Kubeflow)
- Contributions to open-source data tools`;

const SAMPLE_RESUMES = [
  {
    name: 'alice_chen_resume.txt',
    content: `Alice Chen | alice.chen@email.com | linkedin.com/in/alicechen

EXPERIENCE
Senior Data Engineer – DataSystems Inc. (2021–Present)
- Built real-time Kafka streaming pipelines processing 2M events/day
- Led migration of 50+ Airflow DAGs to managed Composer on GCP
- Designed Snowflake data warehouse with dbt transformations
- Mentored 3 junior data engineers

Data Engineer – StartupAI (2019–2021)
- Developed Spark ETL pipelines on AWS EMR
- Created ML feature pipelines feeding XGBoost production models

SKILLS: Python, SQL, Apache Spark, Kafka, Airflow, Snowflake, dbt, GCP, AWS, Docker, Kubernetes
EDUCATION: M.S. Computer Science – Stanford University (2019)`,
  },
  {
    name: 'raj_patel_resume.txt',
    content: `Raj Patel | raj.patel@email.com

EXPERIENCE
Data Engineer – CloudData Corp (2020–Present)
- Designed BigQuery pipelines processing 500GB+ daily
- Built Apache Spark jobs for batch data processing on Dataproc
- Implemented Airflow orchestration for 30+ business-critical DAGs
- Used dbt for transformations across 5 data marts

Junior Data Engineer – FinTech Solutions (2018–2020)
- Python ETL automation, SQL optimizations, AWS Glue

SKILLS: Python, SQL, Apache Spark, Airflow, BigQuery, dbt, GCP, AWS
EDUCATION: B.Tech Computer Science – IIT Bombay (2018)`,
  },
  {
    name: 'sofia_martinez_resume.txt',
    content: `Sofia Martinez | sofia.m@email.com

EXPERIENCE
Data Analyst → Data Engineer – RetailCo (2021–Present)
- Migrated data pipelines from Excel/SQL to Python-based Airflow DAGs
- Built Redshift data warehouse using dimensional modeling
- Started learning Spark for big data processing (6 months experience)

Data Analyst – E-commerce Startup (2019–2021)
- SQL reporting, Python scripting, Tableau dashboards

SKILLS: Python, SQL, Airflow, Redshift, Tableau, AWS (basic), Spark (learning)
EDUCATION: B.S. Data Science – UC San Diego (2019)`,
  },
  {
    name: 'james_williams_resume.txt',
    content: `James Williams | j.williams@email.com

EXPERIENCE
Backend Engineer – SaaS Company (2019–Present)
- Built REST APIs with Python (FastAPI, Django)
- PostgreSQL database design and optimization
- Some experience with data extraction scripts and cron jobs
- AWS Lambda functions for lightweight ETL

Software Engineer – Web Agency (2017–2019)
- Full-stack development, MySQL, basic Python

SKILLS: Python, PostgreSQL, MySQL, AWS (basic), FastAPI, Django, Git
EDUCATION: B.S. Software Engineering – State University (2017)`,
  },
  {
    name: 'priya_sharma_resume.txt',
    content: `Priya Sharma | priya.sharma@email.com

EXPERIENCE
Data Engineer – Analytics Firm (2022–Present)
- Built Spark-based batch processing jobs on AWS EMR
- PostgreSQL and Redshift query optimization
- Basic Airflow DAG creation

Data Science Intern – ML Startup (2021–2022)
- Python data analysis, pandas, scikit-learn pipelines

SKILLS: Python, SQL, Apache Spark (intermediate), Redshift, AWS, pandas, basic Airflow
EDUCATION: M.S. Data Science – University of Michigan (2022)`,
  },
  {
    name: 'tom_bradley_resume.txt',
    content: `Tom Bradley | tom.b@email.com

EXPERIENCE
IT Systems Admin – Manufacturing Co. (2018–Present)
- Manage on-premise servers and network infrastructure
- Some SQL queries for reporting
- Excel-based data tracking

Help Desk Technician (2015–2018)

SKILLS: SQL (basic), Excel, Windows Server, Networking, Help Desk Support
EDUCATION: Associate Degree in IT (2015)`,
  },
  {
    name: 'nina_okafor_resume.txt',
    content: `Nina Okafor | nina.okafor@email.com

EXPERIENCE
Business Analyst – Consulting Firm (2020–Present)
- Requirements gathering, Jira, process documentation
- Basic SQL for data pulls, Excel pivot tables
- Power BI dashboard creation

Junior BA – Insurance Co. (2018–2020)

SKILLS: SQL (basic), Excel, Power BI, Jira, Business Analysis
EDUCATION: B.A. Business Administration (2018)`,
  },
  {
    name: 'ethan_park_resume.txt',
    content: `Ethan Park | ethan.park@email.com

EXPERIENCE
Recent Graduate – Job Seeking (2024)
- University projects: built a simple Python data scraper
- SQL coursework, pandas basics
- Personal project: analyzed CSV files with Python

EDUCATION: B.S. Information Systems – Community College (2024)
SKILLS: Python (beginner), SQL (basic), Excel, basic pandas`,
  },
];

export default function ScreenPage() {
  const router = useRouter();
  const [jdTitle, setJdTitle] = useState('');
  const [jdText, setJdText] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [processingStep, setProcessingStep] = useState('');

  const onDrop = useCallback((accepted: File[]) => {
    setFiles((prev) => {
      const all = [...prev, ...accepted];
      return all.slice(0, 10);
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
    },
    multiple: true,
  });

  const removeFile = (idx: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const loadSampleData = () => {
    setJdTitle('Senior Data Engineer – TechCorp Inc.');
    setJdText(SAMPLE_JD);

    const sampleFiles = SAMPLE_RESUMES.map(({ name, content }) => {
      const blob = new Blob([content], { type: 'text/plain' });
      return new File([blob], name, { type: 'text/plain' });
    });
    setFiles(sampleFiles);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jdText.trim() || files.length === 0) {
      setError('Please provide a Job Description and at least one resume.');
      return;
    }

    setError('');
    setIsLoading(true);
    setProcessingStep('Uploading files...');

    const formData = new FormData();
    formData.append('jdTitle', jdTitle || 'Untitled Job Description');
    formData.append('jdText', jdText);
    files.forEach((f) => formData.append('files', f));

    try {
      setProcessingStep('Analyzing candidate profiles...');
      const res = await fetch('/api/screen', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Screening failed');

      setProcessingStep('Saving results...');
      router.push(`/results/${data.sessionId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setIsLoading(false);
    }
  };

  const formatSize = (bytes: number) =>
    bytes < 1024 * 1024
      ? `${(bytes / 1024).toFixed(0)} KB`
      : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

  return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar />
      <div className="container">
        <AnimatePresence mode="wait">
          {!isLoading ? (
            <motion.div
              key="form-content"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <div className="page-header" style={{ marginBottom: 32 }}>
                <div className="section-label" style={{ marginBottom: 6 }}>New Evaluation</div>
                <h1 className="page-title">Screen Candidates</h1>
                <p className="page-subtitle">
                  Upload your job description and up to 10 resumes. Each candidate is scored, ranked and analyzed instantly.
                </p>
              </div>
              <form
                onSubmit={handleSubmit}
                className="screen-layout"
                style={{ paddingBottom: 80 }}
              >
                {/* Left: JD Input */}
              <motion.div
                style={{ display: 'flex', flexDirection: 'column', gap: 24, position: 'sticky', top: 90 }}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div className="section-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ padding: 6, background: 'var(--accent-light)', borderRadius: 8 }}>
                      <FileText size={16} style={{ color: 'var(--accent)' }} />
                    </div>
                    Job Description
                  </div>
                  <button type="button" onClick={loadSampleData} className="btn btn-outline btn-sm">
                    Load Sample Data
                  </button>
                </div>

                <div className="form-group">
                  <label className="form-label">Job Title</label>
                  <input
                    className="form-input"
                    value={jdTitle}
                    onChange={(e) => setJdTitle(e.target.value)}
                    placeholder="e.g. Senior Data Engineer"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Job Details</label>
                  <textarea
                    className="form-textarea"
                    value={jdText}
                    onChange={(e) => setJdText(e.target.value)}
                    placeholder="Paste your full job description here — responsibilities, requirements, nice-to-haves..."
                    style={{ minHeight: 400 }}
                    required
                  />
                </div>
              </motion.div>

              {/* Right: Resume Upload */}
              <motion.div
                style={{ display: 'flex', flexDirection: 'column', gap: 24 }}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 }}
              >
                <div className="section-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ padding: 6, background: 'var(--accent-light)', borderRadius: 8 }}>
                    <UploadCloud size={16} style={{ color: 'var(--accent)' }} />
                  </div>
                  Candidate Resumes
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 500, marginLeft: 4 }}>
                    ({files.length}/10)
                  </span>
                </div>

                {/* Dropzone */}
                <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''}`}>
                  <input {...getInputProps()} />
                  <div className="dropzone-icon" style={{ marginBottom: 12 }}><UploadCloud size={40} /></div>
                  <p className="dropzone-text">
                    {isDragActive ? 'Drop files here...' : 'Drag & drop resumes here'}
                  </p>
                  <p className="dropzone-sub">PDF, DOCX, TXT · Max 10 files · 5MB each</p>
                  <button type="button" className="btn btn-secondary btn-sm" style={{ marginTop: 16 }}>
                    Browse Files
                  </button>
                </div>

                {/* File List */}
                <AnimatePresence>
                  {files.length > 0 && (
                    <motion.div className="file-list" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      {files.map((file, idx) => (
                        <motion.div
                          key={`${file.name}-${idx}`} className="file-item"
                          initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ delay: idx * 0.03 }}
                        >
                          <FileText size={15} style={{ color: 'var(--text-muted)' }} />
                          <span className="file-item-name">{file.name}</span>
                          <span className="file-item-size">{formatSize(file.size)}</span>
                          <button type="button" className="file-item-remove" onClick={() => removeFile(idx)} title="Remove">
                            <Trash2 size={14} />
                          </button>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Error */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                      style={{ color: 'var(--not-fit)', fontSize: '0.82rem', padding: '12px 14px', background: 'rgba(239,68,68,0.08)', borderRadius: 8, border: '1px solid rgba(239,68,68,0.2)' }}
                    >
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submit */}
                <div style={{ marginTop: 'auto', paddingTop: 16 }}>
                  <button
                    type="submit" className="btn btn-primary btn-lg"
                    style={{ width: '100%', justifyContent: 'center' }}
                    disabled={isLoading || !jdText || files.length === 0}
                  >
                    Screen {files.length > 0 ? `${files.length} Candidate${files.length > 1 ? 's' : ''}` : 'Candidates'}
                  </button>
                  <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: 12 }}>
                    Secure & Fast Processing · Results in ~{Math.max(5, files.length * 2)}s
                  </p>
                </div>
              </motion.div>
            </form>
          </motion.div>
        ) : (
            <motion.div
              key="loading-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                minHeight: '75vh', position: 'relative'
              }}
            >
              {/* Background glowing orbs exclusively for loading phase */}
              <div style={{
                position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                width: 600, height: 600, background: 'radial-gradient(circle, rgba(79,70,229,0.1) 0%, transparent 60%)',
                filter: 'blur(50px)', pointerEvents: 'none', zIndex: -1
              }} />

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                style={{ textAlign: 'center', marginBottom: 48, position: 'relative' }}
              >
                <motion.div
                  animate={{ scale: [1, 1.05, 1], opacity: [0.5, 0.8, 0.5] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                  style={{
                    position: 'absolute', top: -30, left: '50%', transform: 'translateX(-50%)',
                    width: 140, height: 140, background: 'var(--accent)', filter: 'blur(60px)', opacity: 0.15, zIndex: -1
                  }}
                />
                <h2 style={{ fontFamily: 'var(--font-space-grotesk)', fontSize: '2.4rem', fontWeight: 700, letterSpacing: '-0.03em', color: 'var(--text-primary)' }}>
                  Analysing Profiles
                </h2>
                <p style={{ color: 'var(--text-muted)', marginTop: 12, fontSize: '1.05rem', maxWidth: 400, marginInline: 'auto' }}>
                  Our AI is intelligently reviewing <strong style={{ color: 'var(--text-primary)' }}>{files.length} resume{files.length !== 1 ? 's' : ''}</strong> against your job description constraints.
                </p>
              </motion.div>

              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.15, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  padding: '28px 32px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)',
                  backdropFilter: 'blur(var(--glass-blur))', borderRadius: 20, display: 'flex', alignItems: 'center', gap: 24, width: '100%', maxWidth: 460,
                  boxShadow: 'var(--glass-shadow)'
                }}
              >
                <div className="ai-loader-container">
                  <div className="ai-loader-ring" />
                  <div className="ai-loader-ring" />
                  <div className="ai-loader-ring" />
                  <div className="ai-loader-pulse" />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={processingStep}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.25 }}
                      style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                    >
                      {processingStep}
                    </motion.div>
                  </AnimatePresence>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 4 }}>
                    Processing securely on our servers
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
