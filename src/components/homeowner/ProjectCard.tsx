import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FolderKanban,
  CheckCircle2,
  Users,
  MapPin,
  Clock,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { Project } from '../../types';

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const navigate = useNavigate();

  if (!project || !project.id) {
    return (
      <div className="bg-white rounded-3xl p-8 border border-dashed border-stone-300 text-center space-y-3 flex flex-col items-center justify-center">
        <div className="w-12 h-12 rounded-2xl bg-amber-50 text-primary flex items-center justify-center">
          <FolderKanban size={24} />
        </div>
        <div>
          <h3 className="text-base font-black text-charcoal">No projects yet</h3>
          <p className="text-xs text-charcoal-muted mt-1">
            Create your first project to find skilled workers.
          </p>
        </div>
        <button
          onClick={() => navigate('/homeowner/project/new')}
          className="btn-primary text-xs py-2.5 px-4 inline-flex items-center gap-1.5 font-bold"
        >
          Create Project
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-soft hover:shadow-elevated transition-all flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-[11px] font-black uppercase px-2.5 py-1 rounded-full bg-primary/10 text-primary">
            {project.category}
          </span>
          <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            ● In Progress
          </span>
        </div>

        <h3
          onClick={() => navigate(`/homeowner/project/${project.id}`)}
          className="text-xl font-black text-charcoal hover:text-primary transition-colors cursor-pointer"
        >
          {project.name}
        </h3>
        <p className="text-xs text-charcoal-muted flex items-center gap-1.5 mt-1 mb-4">
          <MapPin size={13} className="text-primary flex-shrink-0" />
          <span>{project.location}</span>
        </p>

        {/* Progress */}
        <div className="mb-4">
          <div className="flex justify-between text-xs font-bold text-charcoal mb-1.5">
            <span>Overall Completion</span>
            <span className="text-primary">{project.progressPercent}%</span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-stone-100 overflow-hidden border border-stone-200/60">
            <div
              className="h-full bg-primary rounded-full transition-all duration-700"
              style={{ width: `${project.progressPercent}%` }}
            />
          </div>
        </div>

        {/* Workers on site today */}
        <div className="p-3.5 rounded-2xl bg-sand-50 border border-stone-200/70 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase font-bold text-charcoal-muted flex items-center gap-1">
              <Users size={12} className="text-primary" />
              <span>Assigned Craftsmen ({project.workers.length})</span>
            </span>
            <span className="text-[10px] text-emerald-700 font-bold">
              ✓ Checked in today
            </span>
          </div>
          <div className="flex items-center -space-x-2 overflow-hidden">
            {project.workers.map((w) => (
              <img
                key={w.id}
                src={w.photo}
                alt={w.name}
                title={`${w.name} (${w.trade})`}
                className="w-8 h-8 rounded-full border-2 border-white object-cover shadow-xs"
              />
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={() => navigate(`/homeowner/project/${project.id}`)}
        className="w-full py-3 px-4 rounded-xl bg-primary hover:bg-primary-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 touch-target shadow-soft transition-colors mt-2"
      >
        <span>Open Project Dashboard</span>
        <ArrowRight size={14} />
      </button>
    </div>
  );
};
