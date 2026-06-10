import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 glass-panel mx-4 mt-4 px-6 py-4 flex items-center justify-between print:hidden">
      <Link to="/" className="flex items-center gap-2">
        <motion.div 
          whileHover={{ rotate: 180 }}
          transition={{ duration: 0.3 }}
          className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary-600 to-violet-600 flex items-center justify-center text-white font-bold"
        >
          AI
        </motion.div>
        <span className="text-xl font-bold text-slate-800 tracking-tight">AI Resume <span className="text-primary-600">Analyzer</span></span>
      </Link>
      
      <div className="flex items-center gap-6">
        {/* Auth links removed for simplicity */}
      </div>
    </nav>
  );
}
