import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  Eye,
  Trash2,
  Loader2,
  MessageSquare,
  Filter,
} from 'lucide-react';

const FILTERS = [
  { value: '', label: 'Toutes' },
  { value: 'nouveau', label: 'Nouvelles' },
  { value: 'lu', label: 'Lues' },
  { value: 'traité', label: 'Traitées' },
];

function Demandes() {
  const [demandes, setDemandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchDemandes();
  }, [activeFilter]);

  const fetchDemandes = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = activeFilter ? { statut: activeFilter } : {};
      const response = await axios.get('/api/admin/demandes', { params });
      setDemandes(response.data || []);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Erreur lors du chargement des demandes.');
    } finally {
      setLoading(false);
    }
  };

  const getStatutBadgeClass = (statut) => {
    switch (statut?.toLowerCase()) {
      case 'nouveau':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'lu':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'traité':
      case 'traite':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette demande ?')) {
      return;
    }

    try {
      setDeletingId(id);
      await axios.delete(`/api/admin/demandes/${id}`);
      setDemandes(demandes.filter((d) => d._id !== id));
    } catch (err) {
      alert(err?.response?.data?.message || 'Erreur lors de la suppression.');
    } finally {
      setDeletingId(null);
    }
  };

  const getFilterCount = (filterValue) => {
    if (!filterValue) return demandes.length;
    return demandes.filter((d) => d.status?.toLowerCase() === filterValue.toLowerCase()).length;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center py-32">
            <div className="flex flex-col items-center">
              <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
              <p className="text-slate-600">Chargement des demandes...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Gestion des demandes</h1>

        {/* Error message */}
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700">
            {error}
          </div>
        )}

        {/* Filter Tabs */}
        <div className="mb-6 flex flex-wrap gap-2 border-b border-slate-200">
          {FILTERS.map((filter) => {
            const count = getFilterCount(filter.value);
            const isActive = activeFilter === filter.value;
            return (
              <button
                key={filter.value}
                onClick={() => setActiveFilter(filter.value)}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  isActive
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                {filter.label}
                {count > 0 && (
                  <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                    isActive ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Table */}
        {demandes.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12">
            <div className="text-center">
              <MessageSquare className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <p className="text-lg font-medium text-slate-900 mb-2">Aucune demande</p>
              <p className="text-slate-600">
                {activeFilter
                  ? `Aucune demande avec le statut "${FILTERS.find((f) => f.value === activeFilter)?.label.toLowerCase()}"`
                  : 'Il n\'y a aucune demande pour le moment.'}
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Date</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Nom complet</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Email</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Sujet</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Statut</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {demandes.map((demande) => (
                    <tr
                      key={demande._id}
                      className="border-b border-slate-100 hover:bg-slate-50 transition-colors last:border-b-0"
                    >
                      <td className="py-3 px-4 text-sm text-slate-600">
                        {formatDate(demande.createdAt)}
                      </td>
                      <td className="py-3 px-4 text-sm text-slate-900 font-medium">
                        {demande.firstName} {demande.lastName}
                      </td>
                      <td className="py-3 px-4 text-sm text-slate-600">{demande.email}</td>
                      <td className="py-3 px-4 text-sm text-slate-600">{demande.subject || '-'}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatutBadgeClass(
                            demande.status
                          )}`}
                        >
                          {demande.status || 'nouveau'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/admin/demandes/${demande._id}`}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                            Voir
                          </Link>
                          <button
                            onClick={() => handleDelete(demande._id)}
                            disabled={deletingId === demande._id}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {deletingId === demande._id ? (
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
          </div>
        )}
      </div>
    </div>
  );
}

export default Demandes;
