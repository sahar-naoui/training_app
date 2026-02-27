import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';
import { Loader2 } from 'lucide-react';

const LEVEL_OPTIONS = [
  { number: 1, label: 'Découverte & Acculturation', color: 'green' },
  { number: 2, label: 'Productivité & Automatisation', color: 'yellow' },
  { number: 3, label: 'Transformation & Stratégie', color: 'blue' },
  { number: 4, label: 'Expertise & Conception', color: 'red' },
];

const FORMAT_OPTIONS = [
  'Présentiel',
  'Distanciel',
  'Ateliers sur cas réels entreprise',
  'Démonstrations live',
  'Possibilité de produire un prototype pendant la formation',
];

function FormationForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    level: null,
    public: '',
    duration: '',
    prerequisites: '',
    objectives: '',
    program: '',
    deliverables: '',
    formats: [],
    featured: false,
  });

  useEffect(() => {
    if (isEditMode) {
      fetchFormation();
    }
  }, [id]);

  const fetchFormation = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/admin/formations/${id}`);
      const formation = response.data;

      setFormData({
        title: formation.title || '',
        subtitle: formation.subtitle || '',
        level: formation.level ? LEVEL_OPTIONS.find((l) => l.number === formation.level.number) || null : null,
        public: formation.public || '',
        duration: formation.duration || '',
        prerequisites: formation.prerequisites || '',
        objectives: Array.isArray(formation.objectives) ? formation.objectives.join('\n') : '',
        program: Array.isArray(formation.program) ? formation.program.join('\n') : '',
        deliverables: Array.isArray(formation.deliverables) ? formation.deliverables.join('\n') : '',
        formats: Array.isArray(formation.formats) ? formation.formats : [],
        featured: formation.featured || false,
      });
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Erreur lors du chargement de la formation.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'level') {
      const selectedLevel = LEVEL_OPTIONS.find((l) => l.number === parseInt(value));
      setFormData((prev) => ({
        ...prev,
        level: selectedLevel || null,
      }));
    } else if (name === 'formats') {
      setFormData((prev) => {
        const newFormats = checked
          ? [...prev.formats, value]
          : prev.formats.filter((f) => f !== value);
        return { ...prev, formats: newFormats };
      });
    } else if (type === 'checkbox') {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.title.trim()) {
      setError('Le titre est requis.');
      return;
    }
    if (!formData.public.trim()) {
      setError('Le public cible est requis.');
      return;
    }
    if (!formData.duration.trim()) {
      setError('La durée est requise.');
      return;
    }

    try {
      setSaving(true);

      // Prepare data for API
      const submitData = {
        title: formData.title.trim(),
        subtitle: formData.subtitle.trim(),
        level: formData.level
          ? {
              number: formData.level.number,
              label: formData.level.label,
              color: formData.level.color,
            }
          : null,
        public: formData.public.trim(),
        duration: formData.duration.trim(),
        prerequisites: formData.prerequisites.trim(),
        objectives: formData.objectives
          .split('\n')
          .map((line) => line.trim())
          .filter((line) => line.length > 0),
        program: formData.program
          .split('\n')
          .map((line) => line.trim())
          .filter((line) => line.length > 0),
        deliverables: formData.deliverables
          .split('\n')
          .map((line) => line.trim())
          .filter((line) => line.length > 0),
        formats: formData.formats,
        featured: formData.featured,
      };

      if (isEditMode) {
        await api.put(`/admin/formations/${id}`, submitData);
      } else {
        await api.post('/admin/formations', submitData);
      }

      navigate('/admin/formations', { state: { success: isEditMode ? 'Formation modifiée avec succès.' : 'Formation créée avec succès.' } });
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Erreur lors de l\'enregistrement.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center items-center py-32">
            <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <h1 className="text-3xl font-bold text-slate-900 mb-8">
          {isEditMode ? 'Modifier la formation' : 'Nouvelle formation'}
        </h1>

        {/* Error message */}
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
          {/* Titre */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-2">
              Titre <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
              placeholder="Titre de la formation"
            />
          </div>

          {/* Sous-titre */}
          <div>
            <label htmlFor="subtitle" className="block text-sm font-medium text-slate-700 mb-2">
              Sous-titre
            </label>
            <input
              id="subtitle"
              name="subtitle"
              type="text"
              value={formData.subtitle}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
              placeholder="Sous-titre de la formation"
            />
          </div>

          {/* Niveau */}
          <div>
            <label htmlFor="level" className="block text-sm font-medium text-slate-700 mb-2">
              Niveau
            </label>
            <select
              id="level"
              name="level"
              value={formData.level?.number || ''}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
            >
              <option value="">Sélectionner un niveau</option>
              {LEVEL_OPTIONS.map((level) => (
                <option key={level.number} value={level.number}>
                  {level.label}
                </option>
              ))}
            </select>
          </div>

          {/* Public cible */}
          <div>
            <label htmlFor="public" className="block text-sm font-medium text-slate-700 mb-2">
              Public cible <span className="text-red-500">*</span>
            </label>
            <input
              id="public"
              name="public"
              type="text"
              value={formData.public}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
              placeholder="Public cible de la formation"
            />
          </div>

          {/* Durée */}
          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-slate-700 mb-2">
              Durée <span className="text-red-500">*</span>
            </label>
            <input
              id="duration"
              name="duration"
              type="text"
              value={formData.duration}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
              placeholder="Ex: 2 jours, 14 heures..."
            />
          </div>

          {/* Prérequis */}
          <div>
            <label htmlFor="prerequisites" className="block text-sm font-medium text-slate-700 mb-2">
              Prérequis
            </label>
            <input
              id="prerequisites"
              name="prerequisites"
              type="text"
              value={formData.prerequisites}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
              placeholder="Prérequis pour suivre la formation"
            />
          </div>

          {/* Objectifs */}
          <div>
            <label htmlFor="objectives" className="block text-sm font-medium text-slate-700 mb-2">
              Objectifs (un par ligne)
            </label>
            <textarea
              id="objectives"
              name="objectives"
              value={formData.objectives}
              onChange={handleChange}
              rows={5}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
              placeholder="Objectif 1&#10;Objectif 2&#10;Objectif 3"
            />
          </div>

          {/* Programme */}
          <div>
            <label htmlFor="program" className="block text-sm font-medium text-slate-700 mb-2">
              Programme (un par ligne)
            </label>
            <textarea
              id="program"
              name="program"
              value={formData.program}
              onChange={handleChange}
              rows={5}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
              placeholder="Point 1&#10;Point 2&#10;Point 3"
            />
          </div>

          {/* Livrables */}
          <div>
            <label htmlFor="deliverables" className="block text-sm font-medium text-slate-700 mb-2">
              Livrables (un par ligne)
            </label>
            <textarea
              id="deliverables"
              name="deliverables"
              value={formData.deliverables}
              onChange={handleChange}
              rows={5}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
              placeholder="Livrable 1&#10;Livrable 2&#10;Livrable 3"
            />
          </div>

          {/* Formats */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Formats
            </label>
            <div className="space-y-2">
              {FORMAT_OPTIONS.map((format) => (
                <label key={format} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="formats"
                    value={format}
                    checked={formData.formats.includes(format)}
                    onChange={handleChange}
                    className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                  />
                  <span className="text-sm text-slate-700">{format}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Mise en avant */}
          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
                className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
              />
              <span className="text-sm font-medium text-slate-700">Mise en avant</span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={() => navigate('/admin/formations')}
              className="px-4 py-2 text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {saving ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Enregistrement...
                </span>
              ) : (
                'Enregistrer'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FormationForm;
