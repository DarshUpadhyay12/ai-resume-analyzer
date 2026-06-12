import { useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiDownload, FiCheckCircle, FiAlertTriangle, FiXCircle } from 'react-icons/fi';
import { Sparkles, Briefcase, Target, Layers } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

export default function Analysis() {
  const location = useLocation();
  const data = location.state?.data;

  if (!data) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-32 text-center">
        <div className="w-24 h-24 bg-dark-800 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/10">
          <FiAlertTriangle className="text-primary-500" size={40} />
        </div>
        <h2 className="text-3xl font-bold text-slate-200 mb-4">No analysis data found</h2>
        <p className="text-slate-400 mb-8 text-lg">Please go back and upload a resume first.</p>
        <Link to="/" className="inline-flex items-center gap-2 px-8 py-3 bg-primary-600 text-white rounded-full font-semibold hover:bg-primary-500 transition-colors shadow-lg shadow-primary-500/20">
          <FiArrowLeft /> Back to Upload
        </Link>
      </div>
    );
  }

  const { ats_evaluation, parsed_data } = data;
  const score = ats_evaluation.total_score;

  const chartData = [
    { name: 'Length', value: ats_evaluation.breakdown.length, fill: '#06b6d4', icon: <Layers size={14}/> },
    { name: 'Sections', value: ats_evaluation.breakdown.sections, fill: '#3b82f6', icon: <Briefcase size={14}/> },
    { name: 'Skills', value: ats_evaluation.breakdown.skills, fill: '#8b5cf6', icon: <Target size={14}/> },
    { name: 'Impact', value: ats_evaluation.breakdown.impact, fill: '#10b981', icon: <Sparkles size={14}/> },
  ];

  const getScoreColor = (s) => {
    if (s >= 80) return 'text-emerald-400';
    if (s >= 60) return 'text-amber-400';
    return 'text-rose-400';
  };

  const getScoreFill = (s) => {
    if (s >= 80) return '#34d399';
    if (s >= 60) return '#fbbf24';
    return '#fb7185';
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-10 print:hidden gap-4">
        <Link to="/" className="flex items-center gap-2 text-slate-400 hover:text-slate-200 transition-colors font-medium">
          <FiArrowLeft /> Back to Dashboard
        </Link>
        <button 
          onClick={() => window.print()}
          className="flex items-center gap-2 bg-dark-800 border border-white/10 text-slate-200 px-6 py-2.5 rounded-full font-medium hover:bg-dark-700 hover:border-primary-500/30 hover:text-primary-300 shadow-lg shadow-black/20 transition-all"
        >
          <FiDownload /> Export PDF
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column - Score & Charts */}
        <div className="lg:col-span-1 space-y-8">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-panel p-8 text-center"
          >
            <h2 className="text-xl font-bold text-slate-200 mb-6 uppercase tracking-wider text-sm">Overall ATS Score</h2>
            <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[{ value: score }, { value: 100 - score }]}
                    cx="50%"
                    cy="50%"
                    innerRadius={75}
                    outerRadius={90}
                    startAngle={90}
                    endAngle={-270}
                    dataKey="value"
                    stroke="none"
                  >
                    <Cell fill={getScoreFill(score)} />
                    <Cell fill="#1e293b" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-6xl font-black ${getScoreColor(score)} drop-shadow-md`}>{score}</span>
                <span className="text-slate-500 font-medium text-sm mt-1">/ 100</span>
              </div>
            </div>
            <p className="mt-8 text-slate-300 font-medium">
              {score >= 80 ? "Outstanding! Your resume is highly optimized." : 
               score >= 60 ? "Good start, but needs some targeted improvements." : 
               "Your resume needs significant optimization."}
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-panel p-8"
          >
            <h3 className="font-bold text-slate-200 mb-6 uppercase tracking-wider text-sm">Score Breakdown</h3>
            <div className="space-y-6">
              {chartData.map((item, idx) => (
                <div key={idx}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-300 font-medium flex items-center gap-2">
                      <span className="text-slate-500">{item.icon}</span> {item.name}
                    </span>
                    <span className="text-slate-100 font-bold">{item.value} <span className="text-slate-500 font-normal">pts</span></span>
                  </div>
                  <div className="w-full bg-dark-800 rounded-full h-2.5 overflow-hidden border border-white/5">
                    <div 
                      className="h-full rounded-full relative" 
                      style={{ width: `${(item.value / 30) * 100}%`, backgroundColor: item.fill }}
                    >
                      <div className="absolute inset-0 bg-white/20 w-full"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right Column - Details */}
        <div className="lg:col-span-2 space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-panel p-8"
          >
            <h3 className="text-xl font-bold text-slate-100 mb-6 border-b border-white/10 pb-4 flex items-center gap-2">
              <Sparkles className="text-primary-400" /> Feedback & Recommendations
            </h3>
            <div className="space-y-4">
              {ats_evaluation.feedback.map((f, idx) => (
                <div key={idx} className={`p-5 rounded-2xl flex items-start gap-4 border ${
                  f.type === 'success' ? 'bg-emerald-500/10 text-emerald-200 border-emerald-500/20' :
                  f.type === 'error' ? 'bg-rose-500/10 text-rose-200 border-rose-500/20' :
                  'bg-amber-500/10 text-amber-200 border-amber-500/20'
                }`}>
                  <div className="mt-0.5">
                    {f.type === 'success' && <FiCheckCircle className="text-emerald-400" size={22} />}
                    {f.type === 'error' && <FiXCircle className="text-rose-400" size={22} />}
                    {f.type === 'warning' && <FiAlertTriangle className="text-amber-400" size={22} />}
                    {f.type === 'info' && <FiAlertTriangle className="text-blue-400" size={22} />}
                  </div>
                  <p className="font-medium leading-relaxed opacity-90">{f.message}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-panel p-8"
          >
            <h3 className="text-xl font-bold text-slate-100 mb-6 border-b border-white/10 pb-4 flex items-center gap-2">
              <Target className="text-primary-400" /> Detected Skills
            </h3>
            {parsed_data.skills.length > 0 ? (
              <div className="flex flex-wrap gap-2.5">
                {parsed_data.skills.map((skill, idx) => (
                  <span key={idx} className="px-4 py-2 bg-dark-800 text-primary-200 rounded-lg text-sm font-semibold border border-primary-500/20 hover:bg-primary-500/10 transition-colors">
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 italic p-4 bg-dark-800 rounded-xl border border-white/5">No technical skills were confidently detected.</p>
            )}
          </motion.div>

          {/* Job Matcher Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-panel p-8 print:hidden border-primary-500/20"
          >
            <div className="flex items-start justify-between mb-6 border-b border-white/10 pb-4">
              <div>
                <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                  <Briefcase className="text-primary-400" /> Job Description Matcher
                </h3>
                <p className="text-slate-400 mt-2 text-sm">Paste a job description to see how well your resume matches the role.</p>
              </div>
              <span className="px-3 py-1 bg-primary-500/20 text-primary-300 text-xs font-bold rounded-full uppercase tracking-wider">AI Powered</span>
            </div>
            
            <textarea 
              className="w-full bg-dark-950 border border-white/10 text-slate-200 rounded-2xl p-5 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all h-40 resize-none mb-6 font-mono text-sm"
              placeholder="Paste the target job description here..."
              id="jd-input"
            ></textarea>
            
            <button 
              id="match-btn"
              onClick={async () => {
                const jd = document.getElementById('jd-input').value;
                if(!jd) return;
                const btn = document.getElementById('match-btn');
                const resultsDiv = document.getElementById('match-results');
                btn.innerHTML = '<span class="flex items-center gap-2"><svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Calculating Match...</span>';
                btn.disabled = true;
                
                try {
                  const baseUrl = import.meta.env.VITE_API_URL || 'https://ai-resume-analyzer-1-i0l2.onrender.com';
                  const apiUrl = baseUrl.replace(/\/$/, '');
                  const res = await fetch(`${apiUrl}/api/v1/jobs/match`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ parsed_data: data.parsed_data, job_description: jd })
                  });
                  const matchData = await res.json();
                  
                  let html = `<div class="mt-8 p-6 bg-dark-800 rounded-2xl border border-white/10 shadow-inner">
                    <div class="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
                      <h4 class="font-bold text-slate-200 uppercase tracking-wider text-sm">Match Score</h4>
                      <span class="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-cyan-300">${matchData.match_percentage}%</span>
                    </div>`;
                    
                  if(matchData.missing_keywords && matchData.missing_keywords.length > 0) {
                    html += `<div class="mb-6">
                      <h5 class="font-semibold text-slate-400 mb-3 text-sm uppercase tracking-wider flex items-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-rose-400"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg> Missing Keywords</h5>
                      <div class="flex flex-wrap gap-2">
                        ${matchData.missing_keywords.map(k => `<span class="px-3 py-1.5 bg-rose-500/10 text-rose-300 rounded-lg text-sm font-medium border border-rose-500/20">${k}</span>`).join('')}
                      </div>
                    </div>`;
                  }
                  
                  if(matchData.suggestions && matchData.suggestions.length > 0) {
                    html += `<div>
                      <h5 class="font-semibold text-slate-400 mb-3 text-sm uppercase tracking-wider flex items-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary-400"><path d="M12 2v20"></path><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg> AI Suggestions</h5>
                      <ul class="space-y-3">
                        ${matchData.suggestions.map(s => `
                          <li class="flex items-start gap-3 text-slate-300 bg-dark-950/50 p-4 rounded-xl border border-white/5">
                            <span class="mt-0.5 text-primary-500">→</span>
                            <span class="leading-relaxed opacity-90">${s}</span>
                          </li>
                        `).join('')}
                      </ul>
                    </div>`;
                  }
                  
                  html += `</div>`;
                  resultsDiv.innerHTML = html;
                } catch(e) {
                  console.error(e);
                  alert('Error matching job. Please ensure backend is running.');
                } finally {
                  btn.innerText = 'Calculate Match';
                  btn.disabled = false;
                }
              }}
              className="bg-gradient-to-r from-primary-600 to-cyan-600 text-white px-8 py-3.5 rounded-full font-bold hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all duration-300 disabled:opacity-50 flex items-center gap-2 w-full justify-center sm:w-auto"
            >
              Calculate Match
            </button>
            <div id="match-results"></div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
