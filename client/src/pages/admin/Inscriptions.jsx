import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  UserPlus,
  Loader2,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
} from 'lucide-react';

const statutStyles = {
  nouveau: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Nouveau' },
  'confirmé': { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Confirmé' },
  'refusé': { bg: 'bg-red-100', text: 'text-red-700', label: 'Refusé' },
};

function Inscriptions() {
  const [inscriptions, setInscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');
  const [filterStatut, setFilterStatut] = useState('');

  const fetchInscriptions = async () => {
    try {
      setLoading(true);
      const params = filterStatut ? { statut: filterStatut } : {};
      const res = await axios.get('/api/admin/inscriptions', { params });
      setInscriptions(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchInscriptions(); }, [filterStatut]);

  const handleUpdateStatut = async (id, statut) => {
    try {
      await axios.patch(`/api/admin/inscriptions/${id}/statut`, { statut });
      setSuccess('Statut mis à jour.');
      setTimeout(() => setSuccess(''), 3000);
      fetchInscriptions();
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cette inscription ?')) return;
    try {
      await axios.delete(`/api/admin/inscriptions/${id}`);
      setSuccess('Inscription supprimée.');
      setTimeout(() => setSuccess(''), 3000);
      fetchInscriptions();
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur');
    }
  };

  const filters = [
    { value: '', label: 'Toutes' },
    { value: 'nouveau', label: 'Nouvelles' },
    { value: 'confirmé', label: 'Confirmées' },
    { value: 'refusé', label: 'Refusées' },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <UserPlus className="w-7 h-7 text-indigo-600" />
          <h1 className="text-2xl font-bold text-slate-900">Inscriptions</h1>
        </div>
      </div>

      {success && (
        <div className="mb-4 p-3 rounded-lg bg-emerald-50 text-emerald-700 flex items-center gap-2">
          <CheckCircle className="w-5 h-5" /> {success}
        </div>
      )}
      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700">{error}</div>
      )}

      {/* Filtres */}
      <div className="flex flex-wrap gap-2 mb-6">
        {filters.map(f => (
          <button key={f.value} onClick={() => setFilterStatut(f.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filterStatut === f.value
                ? 'bg-slate-900 text-white'
                : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300'
            }`}>
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
        </div>
      ) : inscriptions.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
          <UserPlus className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500">Aucune inscription pour le moment.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase">Date</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase">Nom</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase">Email</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase">Formation</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase">Statut</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {inscriptions.map(insc => {
                  const style = statutStyles[insc.status] || statutStyles.nouveau;
                  return (
                    <tr key={insc._id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-3 px-4 text-sm text-slate-600">
                        {new Date(insc.createdAt).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="py-3 px-4 text-sm font-medium text-slate-900">
                        {insc.firstName} {insc.lastName}
                      </td>
                      <td className="py-3 px-4 text-sm text-slate-600">{insc.email}</td>
                      <td className="py-3 px-4 text-sm text-slate-700 max-w-[200px] truncate">
                        {insc.formationTitle}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${style.bg} ${style.text}`}>
                          {style.label}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1">
                          <button onClick={() => handleUpdateStatut(insc._id, 'confirmé')}
                            title="Confirmer"
                            className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50">
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleUpdateStatut(insc._id, 'refusé')}
                            title="Refuser"
                            className="p-1.5 rounded-lg text-red-500 hover:bg-red-50">
                            <XCircle className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(insc._id)}
                            title="Supprimer"
                            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-red-500">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default Inscriptions;
