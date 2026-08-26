import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import CreateProject from './pages/CreateProject';
import ProjectView from './pages/ProjectView';

import Navbar from './components/Navbar';

function App() {
  useEffect(() => {
    if (window.AOS) {
      window.AOS.init({
        once: true,
        offset: 50,
        duration: 800,
        easing: 'ease-out-cubic',
      });
    }
  }, []);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[var(--background)] flex flex-col transition-colors duration-300">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/create" element={<CreateProject />} />
            <Route path="/project/:id" element={<ProjectView />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
