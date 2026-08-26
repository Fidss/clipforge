import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import ProjectInput from '../components/ProjectInput';

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await api.get('/projects');
      setProjects(res.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return <span className="bg-[var(--success)]/10 text-[var(--success)] border border-[var(--success)]/20 px-2 py-0.5 rounded-full text-xs font-medium"><i className="fa-solid fa-check mr-1"></i>Completed</span>;
      case 'processing':
        return <span className="bg-[var(--primary)]/10 text-[var(--primary)] border border-[var(--primary)]/20 px-2 py-0.5 rounded-full text-xs font-medium animate-pulse"><i className="fa-solid fa-spinner fa-spin mr-1"></i>Processing</span>;
      case 'failed':
        return <span className="bg-[var(--danger)]/10 text-[var(--danger)] border border-[var(--danger)]/20 px-2 py-0.5 rounded-full text-xs font-medium"><i className="fa-solid fa-triangle-exclamation mr-1"></i>Failed</span>;
      default:
        return <span className="bg-[var(--border)] text-secondary px-2 py-0.5 rounded-full text-xs font-medium">{status}</span>;
    }
  };

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-6 relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[1000px] h-[500px] bg-[var(--primary)]/10 blur-[120px] rounded-full"></div>
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10 mb-12" data-aos="fade-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full surface-secondary border border-[var(--border)] text-sm text-[var(--accent)] font-medium mb-6">
            <i className="fa-solid fa-wand-magic-sparkles"></i> AI-Powered Clipping
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-main mb-6 tracking-tight leading-tight">
            Dashboard
          </h1>
          <p className="text-lg text-secondary max-w-2xl mx-auto">
            Paste your YouTube URL below to create a new project.
          </p>
        </div>

        <div className="relative z-20 max-w-3xl mx-auto" data-aos="fade-up" data-aos-delay="100">
          <ProjectInput />
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-16 px-6 max-w-6xl mx-auto border-t border-[var(--border)]/50">
        <div className="flex items-center gap-3 mb-8" data-aos="fade-right">
          <i className="fa-solid fa-clock-rotate-left text-xl text-secondary"></i>
          <h2 className="text-2xl font-bold text-main">Recent Projects</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full py-12 flex justify-center">
              <i className="fa-solid fa-spinner fa-spin text-3xl text-secondary"></i>
            </div>
          ) : projects.length === 0 ? (
            <div className="col-span-full text-center py-24 surface rounded-2xl" data-aos="fade-up">
              <div className="w-16 h-16 rounded-full surface-secondary mx-auto flex items-center justify-center mb-4 border border-[var(--border)]">
                <i className="fa-solid fa-film text-2xl text-muted"></i>
              </div>
              <h3 className="text-xl font-semibold text-main mb-2">No projects yet</h3>
              <p className="text-secondary max-w-sm mx-auto">Paste a YouTube URL above to generate your first AI clips.</p>
            </div>
          ) : (
            projects.map((project, i) => (
              <Link to={`/project/${project.id}`} key={project.id} data-aos="fade-up" data-aos-delay={i * 50} className="group surface rounded-2xl overflow-hidden hover:border-[var(--primary)]/50 transition-all hover:shadow-[0_8px_30px_rgba(124,58,237,0.1)] block">
                <div className="aspect-video bg-[var(--background)] relative overflow-hidden">
                  {project.thumbnail_url ? (
                    <img src={project.thumbnail_url} alt={project.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <i className="fa-solid fa-film text-3xl text-[var(--border)]"></i>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)] to-transparent opacity-60"></div>
                  <div className="absolute bottom-3 right-3 bg-[var(--background)]/80 backdrop-blur border border-[var(--border)] text-main font-mono text-xs px-2 py-1 rounded flex items-center gap-1.5">
                    <i className="fa-regular fa-clock text-muted"></i>
                    {Math.round((project.duration || 0) / 60)} min
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-main text-lg truncate mb-3 group-hover:text-[var(--accent)] transition-colors" title={project.title}>
                    {project.title || 'Untitled Project'}
                  </h3>
                  <div className="flex justify-between items-center">
                    {getStatusBadge(project.status)}
                    <span className="text-muted text-xs font-mono">{new Date(project.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
