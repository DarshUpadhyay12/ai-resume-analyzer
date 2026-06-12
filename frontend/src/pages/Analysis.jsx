import { useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiDownload, FiCheckCircle, FiAlertTriangle, FiXCircle } from 'react-icons/fi';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

export default function Analysis() {
  const location = useLocation();
  const data = location.state?.data;

  if (!data) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-24 text-center">
        <h2 className="text-2xl font-bold mb-4">No analysis data found</h2>
        <Link to="/dashboard" className="text-primary-600 hover:underline">Go back to Dashboard</Link>
      </div>
    );
  }

  const { ats_evaluation, parsed_data } = data;
  const score = ats_evaluation.total_score;

  // Chart data
  const chartData = [
    { name: 'Length', value: ats_evaluation.breakdown.length, fill: '#6366f1' },
    { name: 'Sections', value: ats_evaluation.breakdown.sections, fill: '#8b5cf6' },
    { name: 'Skills', value: ats_evaluation.breakdown.skills, fill: '#ec4899' },
    { name: 'Impact', value: ats_evaluation.breakdown.impact, fill: '#14b8a6' },
  ];

  const getScoreColor = (s) => {
    if (s >= 80) return 'text-green-500';
    if (s >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-8 print:hidden">
        <Link to="/dashboard" className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors font-medium">
          <FiArrowLeft /> Back to Dashboard
        </Link>
        <button 
          onClick={() => window.print()}
          className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg font-medium hover:bg-slate-50 shadow-sm transition-all"
        >
          <FiDownload /> Export PDF
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Left Column - Score & Charts */}
        <div className="md:col-span-1 space-y-8">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-panel p-8 text-center"
          >
            <h2 className="text-xl font-bold text-slate-800 mb-6">Overall ATS Score</h2>
            <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[{ value: score }, { value: 100 - score }]}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={90}
                    startAngle={90}
                    endAngle={-270}
                    dataKey="value"
                    stroke="none"
                  >
                    <Cell fill={score >= 80 ? '#22c55e' : score >= 60 ? '#eab308' : '#ef4444'} />
                    <Cell fill="#f1f5f9" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-5xl font-black ${getScoreColor(score)}`}>{score}</span>
                <span className="text-slate-400 font-medium text-sm mt-1">/ 100</span>
              </div>
            </div>
            <p className="mt-6 text-slate-600 text-sm">
              {score >= 80 ? "Great job! Your resume is highly optimized." : 
               score >= 60 ? "Good start, but needs some improvements." : 
               "Your resume needs significant optimization."}
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-panel p-6"
          >
            <h3 className="font-bold text-slate-800 mb-4">Score Breakdown</h3>
            <div className="space-y-4">
              {chartData.map((item, idx) => (
                <div key={idx}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-600 font-medium">{item.name}</span>
                    <span className="text-slate-800 font-bold">{item.value} pts</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full" 
                      style={{ width: `${(item.value / 30) * 100}%`, backgroundColor: item.fill }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right Column - Details */}
        <div className="md:col-span-2 space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-panel p-8"
          >
            <h3 className="text-xl font-bold text-slate-800 mb-6 border-b pb-4 border-slate-100">Feedback & Recommendations</h3>
            <div className="space-y-4">
              {ats_evaluation.feedback.map((f, idx) => (
                <div key={idx} className={`p-4 rounded-xl flex items-start gap-4 ${
                  f.type === 'success' ? 'bg-green-50/50 text-green-800 border border-green-100' :
                  f.type === 'error' ? 'bg-red-50/50 text-red-800 border border-red-100' :
                  'bg-yellow-50/50 text-yellow-800 border border-yellow-100'
                }`}>
                  <div className="mt-1">
                    {f.type === 'success' && <FiCheckCircle className="text-green-500" size={20} />}
                    {f.type === 'error' && <FiXCircle className="text-red-500" size={20} />}
                    {f.type === 'warning' && <FiAlertTriangle className="text-yellow-500" size={20} />}
                    {f.type === 'info' && <FiAlertTriangle className="text-blue-500" size={20} />}
                  </div>
                  <p className="font-medium leading-relaxed">{f.message}</p>
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
            <h3 className="text-xl font-bold text-slate-800 mb-6 border-b pb-4 border-slate-100">Detected Skills</h3>
            {parsed_data.skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {parsed_data.skills.map((skill, idx) => (
                  <span key={idx} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-semibold border border-slate-200">
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 italic">No technical skills were confidently detected.</p>
            )}
          </motion.div>

          {/* Job Matcher Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-panel p-8 print:hidden"
          >
            <h3 className="text-xl font-bold text-slate-800 mb-6 border-b pb-4 border-slate-100">Job Description Matcher</h3>
            <p className="text-slate-600 mb-4">Paste a job description to see how well your resume matches.</p>
            <textarea 
              className="w-full border border-slate-300 rounded-xl p-4 focus:ring-2 focus:ring-primary-500 outline-none transition-all h-32 resize-none mb-4"
              placeholder="Paste job description here..."
              id="jd-input"
            ></textarea>
            <button 
              id="match-btn"
              onClick={async () => {
                const jd = document.getElementById('jd-input').value;
                if(!jd) return;
                const btn = document.getElementById('match-btn');
                const resultsDiv = document.getElementById('match-results');
                btn.innerText = 'Calculating...';
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
                  
                  let html = `<div class="mt-6 p-6 bg-slate-50 rounded-xl border border-slate-200">
                    <div class="flex items-center justify-between mb-4">
                      <h4 class="font-bold text-slate-800">Match Score</h4>
                      <span class="text-2xl font-black text-primary-600">${matchData.match_percentage}%</span>
                    </div>`;
                    
                  if(matchData.missing_keywords && matchData.missing_keywords.length > 0) {
                    html += `<div class="mb-4">
                      <h5 class="font-semibold text-slate-700 mb-2 text-sm uppercase tracking-wider">Missing Keywords</h5>
                      <div class="flex flex-wrap gap-2">
                        ${matchData.missing_keywords.map(k => `<span class="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium">${k}</span>`).join('')}
                      </div>
                    </div>`;
                  }
                  
                  if(matchData.suggestions && matchData.suggestions.length > 0) {
                    html += `<div>
                      <h5 class="font-semibold text-slate-700 mb-2 text-sm uppercase tracking-wider">AI Suggestions</h5>
                      <ul class="list-disc pl-5 text-sm text-slate-600 space-y-1">
                        ${matchData.suggestions.map(s => `<li>${s}</li>`).join('')}
                      </ul>
                    </div>`;
                  }
                  
                  html += `</div>`;
                  resultsDiv.innerHTML = html;
                } catch(e) {
                  console.error(e);
                  alert('Error matching job');
                } finally {
                  btn.innerText = 'Calculate Match';
                  btn.disabled = false;
                }
              }}
              className="bg-primary-600 text-white px-6 py-2 rounded-full font-medium hover:bg-primary-700 transition-colors disabled:opacity-50"
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
