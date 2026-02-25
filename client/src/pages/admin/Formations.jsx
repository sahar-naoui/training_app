import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Plus, Pencil, Trash2, Loader2, Star } from 'lucide-react';

function Formations() {
  const navigate = useNavigate();
  const location = useLocation();
  const [formations, setFormations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(location.state?.success || null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchFormations();
    if (location.state?.success) {
      navigate(location.pathname, { replace: true, state: {} });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const fetchFormations = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('/api/admin/formations');
      setFormations(response.data || []);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Erreur lors du chargement des formations.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette formation ?')) {
      return;
    }

    try {
      setDeletingId(id);
      setError(null);
      await axios.delete(`/api/admin/formations/${id}`);
      setSuccess('Formation supprimée avec succès.');
      setFormations(formations.filter((f) => f._id !== id));

      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Erreur lors de la suppression.');
    } finally {
      setDeletingId(null);
    }
  };

  const getLevelBadgeClass = (level) => {
    if (!level) return 'bg-slate-100 text-slate-800 border-slate-200';

    switch (level.color) {
      case 'green':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'yellow':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'blue':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'red':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center py-32">
            <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Gestion des formations</h1>
          <Link
            to="/admin/formations/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Nouvelle formation
          </Link>
        </div>

        {/* Success message */}
        {success && (
          <div className="mb-6 p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700">
            {success}
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700">
            {error}
          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {formations.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              Aucune formation pour le moment.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Titre</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Niveau</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Durée</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Public</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-slate-700">Inscriptions</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Mise en avant</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {formations.map((formation) => (
                    <tr key={formation._id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 text-sm text-slate-900 font-medium">
                        {formation.title}
                      </td>
                      <td className="py-3 px-4">
                        {formation.level ? (
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getLevelBadgeClass(
                              formation.level
                            )}`}
                          >
                            {formation.level.label}
                          </span>
                        ) : (
                          <span className="text-sm text-slate-500">-</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-sm text-slate-600">
                        {formation.duration || '-'}
                      </td>
                      <td className="py-3 px-4 text-sm text-slate-600">
                        {formation.public || '-'}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-flex items-center justify-center min-w-[28px] px-2 py-0.5 rounded-full text-xs font-semibold ${
                            (formation.inscriptionsCount || 0) > 0
                              ? 'bg-violet-100 text-violet-700'
                              : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {formation.inscriptionsCount || 0}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {formation.featured ? (
                          <span className="inline-flex items-center gap-1 text-sm text-amber-600">
                            <Star className="w-4 h-4 fill-amber-600" />
                            Oui
                          </span>
                        ) : (
                          <span className="text-sm text-slate-500">Non</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/admin/formations/${formation._id}/edit`}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          >
                            <Pencil className="w-4 h-4" />
                            Modifier
                          </Link>
                          <button
                            onClick={() => handleDelete(formation._id)}
                            disabled={deletingId === formation._id}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {deletingId === formation._id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                            Supprimer
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Formations;
