import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 glass-panel mx-4 mt-4 px-6 py-4 flex items-center justify-between print:hidden">
      <Link to="/" className="flex items-center gap-3">
        <motion.div 
          whileHover={{ rotate: 180 }}
          transition={{ duration: 0.3 }}
          className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-500 to-blue-600 flex items-center justify-center text-white font-bold shadow-lg shadow-primary-500/20"
        >
          AI
        </motion.div>
        <span className="text-2xl font-bold text-slate-100 tracking-tight">
          AI Resume <span className="text-gradient">Analyzer</span>
        </span>
      </Link>
    </nav>
  );
}
