import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import {
  GraduationCap,
  MessageSquare,
  Bell,
  CheckCircle,
  UserPlus,
  ClipboardList,
} from 'lucide-react';

function Dashboard() {
  const [stats, setStats] = useState({
    formations: 0,
    demandes_total: 0,
    demandes_nouvelles: 0,
    demandes_traitees: 0,
    inscriptions_total: 0,
    inscriptions_nouvelles: 0,
  });
  const [contacts, setContacts] = useState([]);
  const [inscriptions, setInscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get('/admin/dashboard');
        const data = response.data;
        const s = data.stats || data;

        setStats({
          formations: s.formations || 0,
          demandes_total: s.demandes_total || 0,
          demandes_nouvelles: s.demandes_nouvelles || 0,
          demandes_traitees: s.demandes_traitees || 0,
          inscriptions_total: s.inscriptions_total || 0,
          inscriptions_nouvelles: s.inscriptions_nouvelles || 0,
        });
        setContacts(data.dernieresDemandes || []);
        setInscriptions(data.dernieresInscriptions || []);
      } catch (err) {
        setError(err?.response?.data?.message || err?.message || 'Erreur lors du chargement.');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const getStatutBadge = (statut) => {
    const styles = {
      nouveau: 'bg-amber-100 text-amber-700',
      lu: 'bg-blue-100 text-blue-700',
      'traité': 'bg-emerald-100 text-emerald-700',
      'confirmé': 'bg-emerald-100 text-emerald-700',
      'refusé': 'bg-red-100 text-red-700',
    };
    return styles[statut] || 'bg-slate-100 text-slate-700';
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
    }).format(new Date(dateString));
  };

  const statCards = [
    { label: 'Formations', value: stats.formations, icon: GraduationCap, color: 'indigo', link: '/admin/formations' },
    { label: 'Demandes totales', value: stats.demandes_total, icon: MessageSquare, color: 'blue', link: '/admin/demandes' },
    { label: 'Nouvelles demandes', value: stats.demandes_nouvelles, icon: Bell, color: 'amber', link: '/admin/demandes' },
    { label: 'Demandes traitées', value: stats.demandes_traitees, icon: CheckCircle, color: 'emerald', link: '/admin/demandes' },
    { label: 'Inscriptions', value: stats.inscriptions_total, icon: UserPlus, color: 'violet', link: '/admin/inscriptions' },
    { label: 'Nouvelles inscriptions', value: stats.inscriptions_nouvelles, icon: ClipboardList, color: 'rose', link: '/admin/inscriptions' },
  ];

  const colorClasses = {
    indigo: { bg: 'bg-indigo-100', text: 'text-indigo-600' },
    blue: { bg: 'bg-blue-100', text: 'text-blue-600' },
    amber: { bg: 'bg-amber-100', text: 'text-amber-600' },
    emerald: { bg: 'bg-emerald-100', text: 'text-emerald-600' },
    violet: { bg: 'bg-violet-100', text: 'text-violet-600' },
    rose: { bg: 'bg-rose-100', text: 'text-rose-600' },
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-32">
        <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Dashboard</h1>

      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700">{error}</div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {statCards.map((card) => {
          const Icon = card.icon;
          const colors = colorClasses[card.color] || colorClasses.indigo;
          return (
            <Link
              key={card.label}
              to={card.link}
              className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 hover:shadow-md hover:border-indigo-200 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-lg ${colors.bg} flex items-center justify-center shrink-0`}>
                  <Icon className={`w-6 h-6 ${colors.text}`} strokeWidth={1.5} />
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900">{card.value}</div>
                  <div className="text-sm text-slate-500">{card.label}</div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Dernières demandes */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900">Dernières demandes</h2>
            <Link to="/admin/demandes" className="text-sm text-indigo-600 hover:text-indigo-700">Voir tout</Link>
          </div>

          {contacts.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <MessageSquare className="w-10 h-10 mx-auto mb-2" />
              <p>Aucune demande</p>
            </div>
          ) : (
            <div className="space-y-3">
              {contacts.map((c) => (
                <Link
                  key={c._id}
                  to={`/admin/demandes/${c._id}`}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors border border-slate-100"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">{c.firstName} {c.lastName}</p>
                    <p className="text-xs text-slate-500">{c.subject || c.email} &middot; {formatDate(c.createdAt)}</p>
                  </div>
                  <span className={`shrink-0 ml-3 px-2 py-0.5 rounded-full text-xs font-medium ${getStatutBadge(c.status)}`}>
                    {c.status || 'nouveau'}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Dernières inscriptions */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900">Dernières inscriptions</h2>
            <Link to="/admin/inscriptions" className="text-sm text-indigo-600 hover:text-indigo-700">Voir tout</Link>
          </div>

          {inscriptions.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <UserPlus className="w-10 h-10 mx-auto mb-2" />
              <p>Aucune inscription</p>
            </div>
          ) : (
            <div className="space-y-3">
              {inscriptions.map((i) => (
                <div
                  key={i._id}
                  className="flex items-center justify-between p-3 rounded-lg border border-slate-100"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">{i.firstName} {i.lastName}</p>
                    <p className="text-xs text-slate-500 truncate">{i.formationTitle} &middot; {formatDate(i.createdAt)}</p>
                  </div>
                  <span className={`shrink-0 ml-3 px-2 py-0.5 rounded-full text-xs font-medium ${getStatutBadge(i.status)}`}>
                    {i.status || 'nouveau'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
