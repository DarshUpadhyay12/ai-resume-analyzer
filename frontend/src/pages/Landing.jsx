import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiCheckCircle, FiUploadCloud, FiBarChart2 } from 'react-icons/fi';

export default function Landing() {
  return (
    <div className="relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-primary-300 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob animation-delay-4000"></div>

      <div className="max-w-7xl mx-auto px-6 pt-32 pb-24 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-8"
          >
            Is your resume <span className="text-gradient">ATS-ready?</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg md:text-xl text-slate-600 mb-10 leading-relaxed"
          >
            Upload your resume and let our advanced AI instantly score it against industry standards. Find missing keywords, fix formatting, and land more interviews.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/dashboard" className="w-full sm:w-auto px-8 py-4 bg-primary-600 text-white rounded-full font-semibold shadow-xl shadow-primary-600/30 hover:bg-primary-700 transition-all hover:-translate-y-1 text-lg flex items-center justify-center gap-2">
              <FiUploadCloud size={24} />
              Analyze My Resume
            </Link>
            <a href="#features" className="w-full sm:w-auto px-8 py-4 bg-white text-slate-700 rounded-full font-semibold shadow-md border border-slate-200 hover:bg-slate-50 transition-all text-lg">
              View Features
            </a>
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
        >
          {[
            { value: "98%", label: "ATS Accuracy" },
            { value: "10x", label: "More Interviews" },
            { value: "2M+", label: "Resumes Analyzed" }
          ].map((stat, i) => (
            <div key={i} className="glass-panel p-8 text-center transform hover:scale-105 transition-transform duration-300">
              <div className="text-4xl font-bold text-gradient mb-2">{stat.value}</div>
              <div className="text-slate-600 font-medium">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Features Section */}
      <div id="features" className="bg-white py-24 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Everything you need to get hired</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">Our AI doesn't just score your resume. It tells you exactly how to fix it.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <FiCheckCircle />, title: "Instant ATS Score", desc: "Get a score from 0-100 based on length, skills, and structure." },
              { icon: <FiBarChart2 />, title: "Keyword Analysis", desc: "Discover missing hard and soft skills that recruiters are looking for." },
              { icon: <FiUploadCloud />, title: "Job Matching", desc: "Paste a job description to see how well your resume matches the role." }
            ].map((feat, i) => (
              <div key={i} className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-xl flex items-center justify-center text-2xl mb-6">
                  {feat.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feat.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
