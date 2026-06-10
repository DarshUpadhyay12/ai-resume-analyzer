import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUploadCloud, FiFileText, FiCheckCircle, FiLoader } from 'react-icons/fi';
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
    
    // Create FormData
    const formData = new FormData();
    formData.append('file', file);

    try {
      // Dummy user id for now since auth isn't wired in frontend yet
      // In production, we'd pass the Bearer token in headers
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await axios.post(`${apiUrl}/api/v1/resume/analyze`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          // 'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      navigate(`/analysis/${response.data.id}`, { state: { data: response.data } });
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || 'Failed to analyze resume. Make sure backend is running.');
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-600 mt-2">Upload a new resume to get started.</p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`border-2 border-dashed rounded-3xl p-12 text-center transition-all ${
          isDragging ? 'border-primary-500 bg-primary-50' : 'border-slate-300 bg-white hover:border-primary-400 hover:bg-slate-50'
        }`}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        {!file ? (
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mb-6">
              <FiUploadCloud size={40} />
            </div>
            <h3 className="text-2xl font-semibold text-slate-800 mb-2">Drag & Drop your resume</h3>
            <p className="text-slate-500 mb-8">Supports PDF and DOCX up to 5MB</p>
            
            <input 
              type="file" 
              id="file-upload" 
              className="hidden" 
              accept=".pdf,.docx"
              onChange={handleFileChange}
            />
            <label 
              htmlFor="file-upload"
              className="px-8 py-3 bg-white border border-slate-200 shadow-sm rounded-full text-slate-700 font-medium hover:bg-slate-50 cursor-pointer transition-colors"
            >
              Browse Files
            </label>
            {error && <p className="text-red-500 mt-4 font-medium">{error}</p>}
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
              <FiFileText size={40} />
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-1">{file.name}</h3>
            <p className="text-slate-500 mb-8">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            
            <div className="flex gap-4">
              <button 
                onClick={() => setFile(null)}
                className="px-6 py-2 bg-slate-100 text-slate-600 rounded-full font-medium hover:bg-slate-200 transition-colors"
                disabled={isUploading}
              >
                Cancel
              </button>
              <button 
                onClick={handleUpload}
                disabled={isUploading}
                className="px-8 py-2 bg-primary-600 text-white rounded-full font-medium shadow-md hover:bg-primary-700 transition-colors flex items-center gap-2 disabled:opacity-70"
              >
                {isUploading ? (
                  <>
                    <FiLoader className="animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <FiCheckCircle />
                    Analyze Resume
                  </>
                )}
              </button>
            </div>
            {error && <p className="text-red-500 mt-4 font-medium">{error}</p>}
          </div>
        )}
      </motion.div>
    </div>
  );
}
