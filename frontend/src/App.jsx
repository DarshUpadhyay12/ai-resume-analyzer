import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Analysis from './pages/Analysis';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col font-sans">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/analysis/:id" element={<Analysis />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
