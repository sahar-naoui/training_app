import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  ArrowLeft,
  Mail,
  Phone,
  Building2,
  User,
  Calendar,
  Loader2,
  Trash2,
  CheckCircle,
  Send,
  MessageSquareReply,
  Clock,
} from 'lucide-react';

const statutStyles = {
  nouveau: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Nouveau', icon: Clock },
  lu: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Lu', icon: Mail },
  'traité': { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Traité', icon: CheckCircle },
};

function DemandeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [demande, setDemande] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');
  const [replyMessage, setReplyMessage] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const fetchDemande = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/admin/demandes/${id}`);
        setDemande(res.data);
      } catch (err) {
        if (err.response?.status === 404) {
          setError('Demande non trouvée');
        } else {
          setError(err.response?.data?.message || 'Erreur lors du chargement');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchDemande();
  }, [id]);

  const handleSendReply = async () => {
    if (!replyMessage.trim()) return;

    try {
      setSending(true);
      setError(null);
      const res = await axios.post(`/api/admin/demandes/${id}/reply`, {
        replyMessage: replyMessage.trim(),
      });
      setDemande(res.data.contact);

      if (res.data.emailSimulated) {
        setSuccess('Réponse enregistrée et statut mis à jour. (Email simulé — configurez SMTP pour l\'envoi réel)');
      } else {
        setSuccess('Réponse envoyée par email avec succès ! Statut mis à jour vers "Traité".');
      }
      setTimeout(() => setSuccess(''), 5000);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l\'envoi de la réponse');
    } finally {
      setSending(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette demande ?')) return;
    try {
      await axios.delete(`/api/admin/demandes/${id}`);
      navigate('/admin/demandes', { state: { success: 'Demande supprimée avec succès.' } });
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la suppression');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
      </div>
    );
  }

  if (error && !demande) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <h2 className="text-xl font-bold text-slate-900 mb-2">Demande non trouvée</h2>
        <p className="text-slate-600 mb-6">{error}</p>
        <Link
          to="/admin/demandes"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour aux demandes
        </Link>
      </div>
    );
  }

  const style = statutStyles[demande?.status] || statutStyles.nouveau;
  const StatusIcon = style.icon;
  const isTraite = demande?.status === 'traité';

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Link
          to="/admin/demandes"
          className="inline-flex items-center gap-2 text-slate-600 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Retour aux demandes
        </Link>
        <div className="flex items-center gap-3">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${style.bg} ${style.text}`}>
            <StatusIcon className="w-4 h-4" />
            {style.label}
          </span>
          <button
            onClick={handleDelete}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 font-medium transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Supprimer
          </button>
        </div>
      </div>

      {/* Messages */}
      {success && (
        <div className="mb-4 p-4 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 shrink-0" />
          {success}
        </div>
      )}

      {error && demande && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 border border-red-200">{error}</div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Colonne principale */}
        <div className="lg:col-span-2 space-y-6">
          {/* Sujet */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h1 className="text-xl font-bold text-slate-900 mb-2">{demande.subject}</h1>
            <div className="flex items-center gap-3 text-sm text-slate-500">
              <Calendar className="w-4 h-4" />
              Reçu le {new Date(demande.createdAt).toLocaleDateString('fr-FR', {
                day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
              })}
            </div>
          </div>

          {/* Message original */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Message reçu</h3>
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
              <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">{demande.message}</p>
            </div>
          </div>

          {/* Réponse déjà envoyée */}
          {demande.reply && (
            <div className="bg-white rounded-xl border border-emerald-200 p-6">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
                <h3 className="text-sm font-semibold text-emerald-700 uppercase tracking-wider">Réponse envoyée</h3>
                {demande.repliedAt && (
                  <span className="text-xs text-slate-400 ml-auto">
                    {new Date(demande.repliedAt).toLocaleDateString('fr-FR', {
                      day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
                    })}
                  </span>
                )}
              </div>
              <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-100">
                <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">{demande.reply}</p>
              </div>
            </div>
          )}

          {/* Formulaire de réponse */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <MessageSquareReply className="w-5 h-5 text-indigo-600" />
              <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">
                {isTraite ? 'Envoyer une nouvelle réponse' : 'Répondre par email'}
              </h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg text-sm text-slate-600">
                <Mail className="w-4 h-4 text-slate-400" />
                <span>La réponse sera envoyée à : <strong className="text-slate-800">{demande.email}</strong></span>
              </div>

              <textarea
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                placeholder="Écrivez votre réponse ici..."
                rows={6}
                className="w-full rounded-lg border border-slate-200 p-4 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-y"
              />

              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-400">
                  Le statut passera automatiquement à "Traité" après l'envoi.
                </p>
                <button
                  onClick={handleSendReply}
                  disabled={sending || !replyMessage.trim()}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {sending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Envoyer la réponse
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar - Contact info */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-slate-200 p-6 sticky top-6">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Contact</h3>
            <dl className="space-y-4">
              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-slate-400 mt-0.5" />
                <div>
                  <dt className="text-xs text-slate-500">Nom complet</dt>
                  <dd className="text-slate-900 font-medium">{demande.firstName} {demande.lastName}</dd>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-slate-400 mt-0.5" />
                <div>
                  <dt className="text-xs text-slate-500">Email</dt>
                  <dd>
                    <a href={`mailto:${demande.email}`} className="text-indigo-600 hover:text-indigo-700">
                      {demande.email}
                    </a>
                  </dd>
                </div>
              </div>
              {demande.phone && (
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-slate-400 mt-0.5" />
                  <div>
                    <dt className="text-xs text-slate-500">Téléphone</dt>
                    <dd className="text-slate-900">{demande.phone}</dd>
                  </div>
                </div>
              )}
              {demande.company && (
                <div className="flex items-start gap-3">
                  <Building2 className="w-5 h-5 text-slate-400 mt-0.5" />
                  <div>
                    <dt className="text-xs text-slate-500">Entreprise</dt>
                    <dd className="text-slate-900">{demande.company}</dd>
                  </div>
                </div>
              )}
            </dl>

            {/* Historique des statuts */}
            <div className="mt-6 pt-6 border-t border-slate-100">
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Statut</h3>
              <div className="space-y-2">
                {['nouveau', 'lu', 'traité'].map((key) => {
                  const s = statutStyles[key];
                  const Icon = s.icon;
                  const isActive = demande.status === key;
                  const isPast =
                    (key === 'nouveau') ||
                    (key === 'lu' && ['lu', 'traité'].includes(demande.status)) ||
                    (key === 'traité' && demande.status === 'traité');

                  return (
                    <div
                      key={key}
                      className={`flex items-center gap-2 p-2 rounded-lg text-sm ${
                        isActive
                          ? `${s.bg} ${s.text} font-medium`
                          : isPast
                          ? 'text-slate-500'
                          : 'text-slate-300'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{s.label}</span>
                      {isActive && (
                        <span className="ml-auto text-xs font-normal opacity-75">actuel</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DemandeDetail;
