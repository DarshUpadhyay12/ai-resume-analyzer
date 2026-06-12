import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUploadCloud, FiFileText, FiLoader } from 'react-icons/fi';
import { Sparkles } from 'lucide-react';
import axios from 'axios';

export default function Dashboard() {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const onDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    setError('');
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile?.type === 'application/pdf' || droppedFile?.name.endsWith('.docx')) {
      setFile(droppedFile);
    } else {
      setError('Please upload a PDF or DOCX file.');
    }
  }, []);

  const handleFileChange = (e) => {
    setError('');
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.type === 'application/pdf' || selectedFile.name.endsWith('.docx')) {
        setFile(selectedFile);
      } else {
        setError('Please upload a PDF or DOCX file.');
      }
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'https://ai-resume-analyzer-1-i0l2.onrender.com';
      const apiUrl = baseUrl.replace(/\/$/, '');
      const response = await axios.post(`${apiUrl}/api/v1/resume/analyze`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      navigate(`/analysis/${response.data.id}`, { state: { data: response.data } });
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || 'Failed to analyze resume. Make sure backend is running.');
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-20 flex flex-col items-center justify-center min-h-[80vh]">
      
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 text-primary-300 font-medium text-sm mb-6 border border-primary-500/20">
          <Sparkles size={16} /> Powered by Advanced ATS Algorithms
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold text-slate-100 tracking-tight mb-6 leading-tight">
          Optimize Your Resume <br/>
          <span className="text-gradient">Get Hired Faster.</span>
        </h1>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto">
          Drop your resume below to instantly discover your ATS score, uncover missing skills, and perfectly match your profile to your dream job.
        </p>
      </motion.div>

      {/* Upload Zone */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="w-full max-w-3xl relative group"
      >
        {/* Glow behind the box */}
        <div className={`absolute -inset-1 bg-gradient-to-r from-primary-500 to-cyan-400 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200 ${isDragging ? 'opacity-60' : ''}`}></div>
        
        <div 
          className={`relative glass-panel p-16 text-center transition-all duration-300 border-2 ${
            isDragging ? 'border-primary-400 bg-dark-800/90 shadow-[0_0_50px_rgba(6,182,212,0.2)]' : 'border-white/5 hover:border-primary-500/30'
          }`}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
        >
          <AnimatePresence mode="wait">
            {!file ? (
              <motion.div 
                key="upload"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center"
              >
                <div className="w-24 h-24 bg-dark-800/50 border border-white/10 text-primary-400 rounded-full flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
                  <FiUploadCloud size={48} />
                </div>
                <h3 className="text-3xl font-bold text-slate-200 mb-3">Drag & Drop your resume</h3>
                <p className="text-slate-400 mb-10 text-lg">Supports PDF and DOCX</p>
                
                <input 
                  type="file" 
                  id="file-upload" 
                  className="hidden" 
                  accept=".pdf,.docx"
                  onChange={handleFileChange}
                />
                <label 
                  htmlFor="file-upload"
                  className="px-10 py-4 bg-primary-600 text-white rounded-full font-semibold shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:bg-primary-500 hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] cursor-pointer transition-all duration-300 transform hover:-translate-y-1"
                >
                  Browse Files
                </label>
              </motion.div>
            ) : (
              <motion.div 
                key="file"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center py-8"
              >
                <div className="w-24 h-24 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mb-6">
                  <FiFileText size={48} />
                </div>
                <h3 className="text-2xl font-bold text-slate-200 mb-2">{file.name}</h3>
                <p className="text-slate-400 mb-10 text-lg">{(file.size / 1024 / 1024).toFixed(2)} MB • Ready to analyze</p>
                
                <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                  <button 
                    onClick={() => setFile(null)}
                    className="px-8 py-4 bg-dark-800 text-slate-300 border border-white/10 rounded-full font-semibold hover:bg-dark-700 transition-colors"
                    disabled={isUploading}
                  >
                    Select Different File
                  </button>
                  <button 
                    onClick={handleUpload}
                    disabled={isUploading}
                    className="px-10 py-4 bg-gradient-to-r from-primary-600 to-cyan-500 text-white rounded-full font-bold shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_40px_rgba(6,182,212,0.6)] transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed transform hover:-translate-y-1"
                  >
                    {isUploading ? (
                      <>
                        <FiLoader className="animate-spin" size={20} />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Sparkles size={20} />
                        Analyze Resume Now
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          {error && (
            <motion.p initial={{opacity:0}} animate={{opacity:1}} className="text-red-400 mt-6 font-medium p-4 bg-red-500/10 rounded-xl border border-red-500/20">
              {error}
            </motion.p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
