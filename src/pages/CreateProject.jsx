import { Link } from 'react-router-dom';
import ProjectInput from '../components/ProjectInput';

export default function CreateProject() {
  return (
    <div className="min-h-[calc(100vh-4rem)] p-8 max-w-4xl mx-auto flex flex-col justify-center relative">
      
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[var(--primary)]/10 blur-[120px] rounded-full"></div>
      </div>

      <div className="relative z-10" data-aos="fade-up">
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-muted hover:text-main mb-12 transition-colors w-fit font-medium">
          <i className="fa-solid fa-arrow-left"></i> Back to Dashboard
        </Link>
        
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-main tracking-tight">Create something worth watching.</h2>
          <p className="text-secondary text-lg">Turn your long-form videos into engaging short clips automatically.</p>
        </div>
        
        <ProjectInput />
      </div>
    </div>
  );
}
