import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import socket from '../services/socket';

export default function ProjectView() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [clips, setClips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [renderProgress, setRenderProgress] = useState(0);
  const [renderModalOpen, setRenderModalOpen] = useState(false);
  const [selectedClipId, setSelectedClipId] = useState(null);
  const [subtitleStyle, setSubtitleStyle] = useState('none');

  useEffect(() => {
    fetchProject();
    fetchClips();
    
    socket.emit('join_project', id);
    socket.on('job:progress', handleJobProgress);
    socket.on('job:completed', handleJobCompleted);
    socket.on('job:failed', handleJobFailed);
    
    return () => {
      socket.off('job:progress');
      socket.off('job:completed');
      socket.off('job:failed');
    };
  }, [id]);

  const fetchProject = async () => {
    try {
      const res = await api.get(`/projects/${id}`);
      setProject(res.data.data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchClips = async () => {
    try {
      const res = await api.get(`/projects/${id}/clips`);
      setClips(res.data.data);
      setLoading(false);
    } catch (e) {
      console.error(e);
    }
  };

  const handleJobProgress = (data) => {
    if (data.stage === 'RENDERING_CLIP') {
       setRenderProgress(data.progress);
    } else if (data.stage === 'DOWNLOADING_SOURCE') {
       setRenderProgress(0);
    }
  };

  const handleJobCompleted = () => {
    setRenderProgress(0);
    fetchClips();
  };
  
  const handleJobFailed = (data) => {
    setRenderProgress(0);
    alert('Job failed: ' + data.error_message);
    fetchClips();
  };

  const openRenderModal = (clipId) => {
    setSelectedClipId(clipId);
    setRenderModalOpen(true);
  };

  const confirmRender = async () => {
    if (!selectedClipId) return;
    setRenderModalOpen(false);
    try {
      setClips(clips.map(c => c.id === selectedClipId ? { ...c, status: 'rendering' } : c));
      await api.post(`/clips/${selectedClipId}/render`, { aspect_ratio: '9:16', subtitle_style: subtitleStyle });
    } catch (e) {
      console.error(e);
      alert('Failed to start render');
      fetchClips();
    }
  };

  const handleDelete = async (clipId) => {
    if (!confirm('Are you sure you want to delete this clip?')) return;
    try {
      await api.delete(`/clips/${clipId}`);
      setClips(clips.filter(c => c.id !== clipId));
    } catch (e) {
      console.error(e);
      alert('Failed to delete clip');
    }
  };

  const formatTimestamp = (seconds) => {
    return new Date(seconds * 1000).toISOString().substr(11, 8);
  };

  if (loading) return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center">
      <i className="fa-solid fa-spinner fa-spin text-4xl text-[var(--primary)] mb-4"></i>
      <p className="text-secondary">Loading your project...</p>
    </div>
  );

  return (
    <div className="min-h-[calc(100vh-4rem)] p-8 max-w-7xl mx-auto">
      <Link to="/dashboard" className="inline-flex items-center gap-2 text-muted hover:text-main mb-8 transition-colors font-medium" data-aos="fade-right">
        <i className="fa-solid fa-arrow-left"></i> Back to Dashboard
      </Link>

      {/* Project Header */}
      <div className="flex flex-col md:flex-row items-start md:items-end gap-6 mb-12 surface p-6 rounded-2xl relative overflow-hidden" data-aos="fade-up">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--primary)]/5 blur-[80px] rounded-full pointer-events-none"></div>
        {project?.thumbnail_url ? (
          <img src={project.thumbnail_url} alt="" className="w-48 md:w-64 aspect-video object-cover rounded-xl shadow-lg border border-[var(--border)] relative z-10" />
        ) : (
          <div className="w-48 md:w-64 aspect-video surface-secondary rounded-xl flex items-center justify-center border border-[var(--border)] relative z-10">
            <i className="fa-solid fa-film text-3xl text-muted"></i>
          </div>
        )}
        <div className="relative z-10 flex-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[var(--accent)]/10 text-[var(--accent)] text-xs font-semibold mb-3 border border-[var(--accent)]/20">
            <i className="fa-solid fa-check"></i> Analysis Complete
          </div>
          <h1 className="text-3xl font-bold mb-3 text-main leading-tight">{project?.title || 'Untitled Project'}</h1>
          <div className="flex flex-wrap gap-4 text-muted text-sm font-mono">
            <span className="flex items-center gap-1.5"><i className="fa-solid fa-clock"></i> {Math.round((project?.duration || 0)/60)} min</span>
            <span className="flex items-center gap-1.5"><i className="fa-solid fa-scissors"></i> {clips.length} Clips generated</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-8" data-aos="fade-right">
        <i className="fa-solid fa-wand-magic-sparkles text-[var(--primary)] text-xl"></i>
        <h2 className="text-2xl font-bold text-main">Generated Highlights</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clips.map((clip, i) => (
          <div key={clip.id} data-aos="fade-up" data-aos-delay={i * 50} className="surface rounded-2xl overflow-hidden hover:border-[var(--primary)]/30 transition-all flex flex-col h-full relative group shadow-sm hover:shadow-[0_8px_30px_rgba(124,58,237,0.1)]">
            
            {/* VIDEO PREVIEW */}
            <div className="aspect-[9/16] w-full bg-[var(--background)] relative overflow-hidden group/video border-b border-[var(--border)]">
              {clip.status === 'completed' && clip.output_url ? (
                <video src={clip.output_url} controls crossOrigin="anonymous" className="w-full h-full object-cover opacity-90 group-hover/video:opacity-100 transition-opacity" preload="metadata" />
              ) : project?.thumbnail_url ? (
                <img src={project.thumbnail_url} className="w-full h-full object-cover opacity-50 blur-sm" alt="Preview" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <i className="fa-solid fa-video-slash text-4xl text-[var(--border)]"></i>
                </div>
              )}

              {/* Score Badge */}
              <div className="absolute top-3 right-3 z-10">
                <div className={`px-2.5 py-1 rounded-full text-xs font-bold shadow-lg border backdrop-blur-md flex items-center gap-1.5 ${
                  clip.score >= 90 ? 'bg-[var(--primary)]/80 text-white border-[var(--primary)]' :
                  clip.score >= 80 ? 'bg-[var(--accent)]/80 text-[var(--background)] border-[var(--accent)]' :
                  'bg-[var(--border)]/80 text-main border-[var(--text-muted)]'
                }`}>
                  <i className="fa-solid fa-fire text-[10px]"></i> {clip.score}
                </div>
              </div>
            </div>

            {/* CONTENT */}
            <div className="p-5 flex-grow flex flex-col">
              <h3 className="font-semibold text-lg text-main mb-3 line-clamp-2 leading-snug group-hover:text-[var(--accent)] transition-colors">{clip.title}</h3>
              
              <div className="flex items-center gap-3 text-xs font-mono text-secondary surface-secondary w-fit px-2.5 py-1.5 rounded-md border border-[var(--border)] mb-4">
                <span>{formatTimestamp(clip.start_time)}</span>
                <i className="fa-solid fa-minus text-muted text-[10px]"></i>
                <span>{formatTimestamp(clip.end_time)}</span>
                <span className="text-[var(--accent)] font-semibold ml-1">{Math.round(clip.duration)}s</span>
              </div>
              
              <div className="surface-secondary rounded-xl p-4 mb-2 border border-[var(--border)] text-sm flex-grow">
                <div className="text-[var(--primary)] font-semibold mb-1 flex items-center gap-1.5"><i className="fa-solid fa-quote-left text-[10px]"></i> Hook</div>
                <div className="text-main italic mb-4">"{clip.hook}"</div>
                
                <div className="text-secondary font-semibold mb-1 flex items-center gap-1.5"><i className="fa-solid fa-lightbulb text-[10px]"></i> Why it works</div>
                <div className="text-muted leading-relaxed line-clamp-3">{clip.reason}</div>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="p-4 border-t border-[var(--border)] bg-[var(--surface)] flex gap-3">
              {clip.status === 'completed' && clip.output_url ? (
                <a href={clip.output_url} download={`${clip.title.substring(0, 30)}.mp4`} className="flex-1 flex items-center justify-center gap-2 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white py-2.5 rounded-xl transition-all shadow-[0_4px_15px_rgba(124,58,237,0.2)] font-semibold text-sm">
                  <i className="fa-solid fa-download"></i> Download Clip
                </a>
              ) : clip.status === 'rendering' ? (
                <div className="flex-1 relative overflow-hidden bg-[var(--surface-secondary)] rounded-xl border border-[var(--border)]">
                  <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] opacity-20 transition-all duration-300" style={{ width: `${renderProgress}%` }}></div>
                  <button disabled className="w-full relative z-10 flex items-center justify-center gap-2 text-[var(--accent)] py-2.5 font-semibold text-sm cursor-not-allowed">
                    <i className="fa-solid fa-spinner fa-spin"></i> Rendering {renderProgress > 0 ? `${renderProgress}%` : '...'}
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => openRenderModal(clip.id)}
                  className="flex-1 flex items-center justify-center gap-2 surface-secondary hover:bg-[var(--border)] text-main border border-[var(--border)] hover:border-[var(--primary)]/50 py-2.5 rounded-xl transition-all font-semibold text-sm group/btn"
                >
                  <i className="fa-solid fa-play text-secondary group-hover/btn:text-[var(--primary)] transition-colors"></i> Render Clip
                </button>
              )}
              <button 
                onClick={() => handleDelete(clip.id)} 
                className="w-11 flex items-center justify-center surface-secondary hover:bg-[var(--danger)]/10 text-muted hover:text-[var(--danger)] border border-[var(--border)] hover:border-[var(--danger)]/30 rounded-xl transition-all"
                title="Delete Clip"
              >
                <i className="fa-solid fa-trash"></i>
              </button>
            </div>
            
          </div>
        ))}
        {clips.length === 0 && !loading && (
          <div className="col-span-full py-20 text-center surface rounded-2xl border border-[var(--border)] border-dashed" data-aos="fade-up">
            <div className="w-16 h-16 rounded-full surface-secondary mx-auto flex items-center justify-center mb-4 border border-[var(--border)]">
              <i className="fa-solid fa-robot text-2xl text-muted"></i>
            </div>
            <h3 className="text-xl font-semibold text-main mb-2">No highlights found</h3>
            <p className="text-secondary max-w-sm mx-auto">The AI might still be analyzing the video or couldn't find suitable moments for clipping.</p>
          </div>
        )}
      </div>

      {/* Render Modal */}
      {renderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="surface p-6 rounded-2xl w-full max-w-md shadow-2xl border border-[var(--border)]">
            <h3 className="text-2xl font-bold text-main mb-2">Render Settings</h3>
            <p className="text-secondary mb-6">Choose your subtitle style. Subtitles will be permanently burned into the video.</p>
            
            <div className="space-y-3 mb-8">
              <label className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${subtitleStyle === 'none' ? 'border-[var(--primary)] bg-[var(--primary)]/10' : 'border-[var(--border)] hover:border-[var(--text-muted)]'}`}>
                <input type="radio" name="subtitleStyle" value="none" checked={subtitleStyle === 'none'} onChange={(e) => setSubtitleStyle(e.target.value)} className="w-4 h-4 text-[var(--primary)] focus:ring-[var(--primary)]" />
                <div>
                  <div className="font-semibold text-main">No Subtitles</div>
                  <div className="text-xs text-muted">Clean video only</div>
                </div>
              </label>
              
              <label className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${subtitleStyle === 'classic' ? 'border-[var(--primary)] bg-[var(--primary)]/10' : 'border-[var(--border)] hover:border-[var(--text-muted)]'}`}>
                <input type="radio" name="subtitleStyle" value="classic" checked={subtitleStyle === 'classic'} onChange={(e) => setSubtitleStyle(e.target.value)} className="w-4 h-4 text-[var(--primary)] focus:ring-[var(--primary)]" />
                <div>
                  <div className="font-semibold text-main">Classic</div>
                  <div className="text-xs text-muted">White text, black outline</div>
                </div>
              </label>

              <label className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${subtitleStyle === 'hormozi' ? 'border-[var(--primary)] bg-[var(--primary)]/10' : 'border-[var(--border)] hover:border-[var(--text-muted)]'}`}>
                <input type="radio" name="subtitleStyle" value="hormozi" checked={subtitleStyle === 'hormozi'} onChange={(e) => setSubtitleStyle(e.target.value)} className="w-4 h-4 text-[var(--primary)] focus:ring-[var(--primary)]" />
                <div>
                  <div className="font-semibold text-main">Hormozi Style</div>
                  <div className="text-xs text-muted">Bold yellow, thick outline</div>
                </div>
              </label>

              <label className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${subtitleStyle === 'neon' ? 'border-[var(--primary)] bg-[var(--primary)]/10' : 'border-[var(--border)] hover:border-[var(--text-muted)]'}`}>
                <input type="radio" name="subtitleStyle" value="neon" checked={subtitleStyle === 'neon'} onChange={(e) => setSubtitleStyle(e.target.value)} className="w-4 h-4 text-[var(--primary)] focus:ring-[var(--primary)]" />
                <div>
                  <div className="font-semibold text-main">Neon</div>
                  <div className="text-xs text-muted">Bright green, glowing shadow</div>
                </div>
              </label>
            </div>
            
            <div className="flex gap-3">
              <button onClick={() => setRenderModalOpen(false)} className="flex-1 py-3 surface-secondary text-main rounded-xl font-semibold hover:bg-[var(--border)] transition-colors">Cancel</button>
              <button onClick={confirmRender} className="flex-1 py-3 bg-[var(--primary)] text-white rounded-xl font-semibold hover:bg-[var(--primary-hover)] shadow-lg shadow-[var(--primary)]/20 transition-colors flex items-center justify-center gap-2">
                <i className="fa-solid fa-play"></i> Start Render
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
