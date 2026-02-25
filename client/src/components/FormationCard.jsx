import { Link } from 'react-router-dom';
import { Clock, Users, ArrowRight } from 'lucide-react';
import LevelBadge from './LevelBadge';

function FormationCard({ formation }) {
  const { title, slug, subtitle, level, public: targetPublic, duration, objectives = [] } = formation || {};

  return (
    <Link
      to={`/formation/${slug || '#'}`}
      className="group block bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
    >
      {/* Level badge */}
      <div className="mb-3">
        <LevelBadge level={level} />
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
        {title || 'Formation'}
      </h3>

      {/* Subtitle */}
      {subtitle && (
        <p className="text-slate-600 text-sm mb-4 line-clamp-2">{subtitle}</p>
      )}

      {/* Meta badges */}
      <div className="flex flex-wrap gap-2 mb-4">
        {duration && (
          <span className="inline-flex items-center gap-1.5 text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
            <Clock className="w-3.5 h-3.5" />
            {duration}
          </span>
        )}
        {targetPublic && (
          <span className="inline-flex items-center gap-1.5 text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
            <Users className="w-3.5 h-3.5" />
            {targetPublic}
          </span>
        )}
      </div>

      {/* Objectives preview */}
      {objectives.length > 0 && (
        <ul className="space-y-1 text-sm text-slate-600 mb-4">
          {objectives.slice(0, 2).map((obj, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-indigo-500 mt-0.5">•</span>
              <span className="line-clamp-2">{obj}</span>
            </li>
          ))}
        </ul>
      )}

      {/* CTA */}
      <span className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 group-hover:gap-3 transition-all">
        Voir la formation
        <ArrowRight className="w-4 h-4" />
      </span>
    </Link>
  );
}

export default FormationCard;
