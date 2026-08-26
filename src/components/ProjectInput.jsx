import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import socket from '../services/socket';

export default function ProjectInput() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState({ percent: 0, message: '', stage: '' });
  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      socket.off('job:progress');
      socket.off('job:completed');
      socket.off('job:failed');
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url) return;
    
    setLoading(true);
    try {
      const res = await api.post('/projects', { source_url: url });
      const projectId = res.data.data.id;
      
      socket.emit('join_project', projectId);
      
      socket.off('job:progress');
      socket.off('job:completed');
      socket.off('job:failed');

      socket.on('job:progress', (data) => {
        setProgress({ percent: data.progress, message: data.message, stage: data.stage });
      });
      
      socket.on('job:completed', (data) => {
        setProgress({ percent: 100, message: 'Done!', stage: 'COMPLETED' });
        setTimeout(() => navigate(`/project/${projectId}`), 1000);
      });
      
      socket.on('job:failed', (data) => {
        setProcessing(false);
        setLoading(false);
        alert('Job failed: ' + data.error_message);
      });

      setProcessing(true);
      await api.post(`/projects/${projectId}/process`);
      
    } catch (error) {
      console.error(error);
      alert('Failed to start processing');
      setLoading(false);
      setProcessing(false);
    }
  };

  const getStageIcon = (stage) => {
    switch (stage) {
      case 'SOURCE':
      case 'DOWNLOADING_SOURCE':
        return 'fa-download';
      case 'TRANSCRIPTION':
        return 'fa-closed-captioning';
      case 'AI_ANALYSIS':
        return 'fa-wand-magic-sparkles';
      case 'COMPLETED':
        return 'fa-circle-check';
      default:
        return 'fa-spinner fa-spin';
    }
  };

  if (processing) {
    return (
      <div className="surface p-8 rounded-2xl w-full max-w-2xl mx-auto shadow-xl relative overflow-hidden border border-[var(--border)] transition-colors duration-300">
        <div className="absolute top-0 left-0 w-full h-1" style={{ background: 'linear-gradient(135deg, var(--primary), var(--accent))' }}></div>
        <div className="py-6 text-center">
          <div className="w-16 h-16 rounded-full surface-secondary flex items-center justify-center mx-auto mb-6 border border-[var(--border)] transition-colors duration-300">
             <i className={`fa-solid ${getStageIcon(progress.stage)} text-2xl text-[var(--accent)]`}></i>
          </div>
          <h3 className="text-xl font-semibold text-main mb-2">
            {progress.stage ? progress.stage.replace('_', ' ') : 'Initializing...'}
          </h3>
          <p className="text-secondary mb-8">{progress.message || 'Preparing your workspace...'}</p>
          
          <div className="w-full surface-secondary rounded-full h-2 overflow-hidden border border-[var(--border)] transition-colors duration-300">
            <div 
              className="h-full transition-all duration-500 ease-out"
              style={{ width: `${progress.percent}%`, background: 'linear-gradient(135deg, var(--primary), var(--accent))' }}
            ></div>
          </div>
          <div className="mt-3 text-sm font-mono text-muted text-right">{progress.percent}%</div>
        </div>
      </div>
    );
  }

  return (
    <div className="surface p-8 rounded-2xl w-full max-w-2xl mx-auto shadow-2xl border border-[var(--border)] relative overflow-hidden transition-all duration-300 hover:border-[var(--primary)]/50">
      <div className="absolute top-0 left-0 w-full h-1" style={{ background: 'linear-gradient(135deg, var(--primary), var(--accent))', opacity: 0.8 }}></div>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
            <i className="fa-solid fa-link text-secondary group-focus-within:text-[var(--primary)] transition-colors"></i>
          </div>
          <input 
            type="url"
            value={url}
            onChange={e => setUrl(e.target.value)}
            placeholder="Paste your YouTube URL..."
            className="w-full bg-[var(--background)] border border-[var(--border)] text-main placeholder-muted rounded-xl pl-12 pr-12 py-4 focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-all text-lg"
            required
          />
          {url && (
            <button 
              type="button"
              onClick={() => setUrl('')}
              className="absolute inset-y-0 right-0 pr-5 flex items-center text-muted hover:text-main transition-colors"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          )}
        </div>
        <button 
          type="submit"
          disabled={loading}
          className="w-full bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-semibold py-4 rounded-xl transition-all shadow-[0_4px_20px_rgba(124,58,237,0.2)] hover:shadow-[0_4px_25px_rgba(124,58,237,0.4)] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg"
        >
          {loading ? (
            <i className="fa-solid fa-spinner fa-spin text-xl"></i>
          ) : (
            <i className="fa-solid fa-wand-magic-sparkles text-xl"></i>
          )}
          {loading ? 'Starting Engine...' : 'Generate Clips'}
        </button>
      </form>
    </div>
  );
}
