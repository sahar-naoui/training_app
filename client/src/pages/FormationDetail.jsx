import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Target,
  ListOrdered,
  Package,
  Layers,
  Clock,
  Users,
  FileText,
  Loader2,
  UserPlus,
  X,
  CheckCircle,
  Send,
} from 'lucide-react';
import LevelBadge from '../components/LevelBadge';
import { getFormationBySlug, sendInscription } from '../services/api';

const tabs = [
  { id: 'objectifs', label: 'Objectifs', icon: Target },
  { id: 'programme', label: 'Programme', icon: ListOrdered },
  { id: 'livrables', label: 'Livrables', icon: Package },
  { id: 'formats', label: 'Formats', icon: Layers },
];

function FormationDetail() {
  const { slug } = useParams();
  const [formation, setFormation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('objectifs');
  const [showInscription, setShowInscription] = useState(false);

  useEffect(() => {
    const fetchFormation = async () => {
      if (!slug) {
        setError('Formation introuvable');
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const data = await getFormationBySlug(slug);
        setFormation(data?.formation ?? data ?? null);
      } catch (err) {
        if (err?.response?.status === 404) {
          setError('Formation introuvable');
        } else {
          setError(err?.message || 'Impossible de charger la formation.');
        }
        setFormation(null);
      } finally {
        setLoading(false);
      }
    };
    fetchFormation();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 lg:pt-28 pb-16 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
          <p className="text-slate-600">Chargement de la formation...</p>
        </div>
      </div>
    );
  }

  if (error || !formation) {
    return (
      <div className="min-h-screen pt-24 lg:pt-28 pb-16">
        <div className="max-w-2xl mx-auto px-4 text-center py-20">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Formation introuvable</h1>
          <p className="text-slate-600 mb-6">{error || 'Cette formation n\'existe pas ou a été supprimée.'}</p>
          <Link
            to="/catalogue"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Retour au catalogue
          </Link>
        </div>
      </div>
    );
  }

  const {
    title,
    subtitle,
    level,
    duration,
    public: targetPublic,
    prerequisites,
    objectives = [],
    program = [],
    deliverables = [],
    formats = [],
  } = formation;

  const activeContent = {
    objectifs: objectives,
    programme: program,
    livrables: deliverables,
    formats,
  };

  const activeData = activeContent[activeTab] || [];

  return (
    <div className="min-h-screen pt-24 lg:pt-28 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back link */}
        <Link
          to="/catalogue"
          className="inline-flex items-center gap-2 text-slate-600 hover:text-indigo-600 mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Retour au catalogue
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2">
            {/* Header */}
            <div className="mb-8">
              <LevelBadge level={level} />
              <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mt-4 mb-2">{title}</h1>
              {subtitle && (
                <p className="text-xl text-slate-600 mb-4">{subtitle}</p>
              )}
              <div className="flex flex-wrap gap-4 text-slate-600">
                {duration && (
                  <span className="inline-flex items-center gap-2">
                    <Clock className="w-5 h-5 text-indigo-500" />
                    {duration}
                  </span>
                )}
                {targetPublic && (
                  <span className="inline-flex items-center gap-2">
                    <Users className="w-5 h-5 text-indigo-500" />
                    {targetPublic}
                  </span>
                )}
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-slate-200 mb-6">
              <div className="flex flex-wrap gap-1 -mb-px">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-3 font-medium border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? 'border-indigo-600 text-indigo-600'
                        : 'border-transparent text-slate-600 hover:text-indigo-600 hover:border-slate-300'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab content */}
            <div className="prose prose-slate max-w-none">
              {Array.isArray(activeData) && activeData.length > 0 ? (
                <ul className="space-y-3">
                  {activeData.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="text-indigo-500 mt-1 shrink-0">•</span>
                      <span className="text-slate-700">{typeof item === 'string' ? item : item?.text ?? item?.title ?? JSON.stringify(item)}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-slate-500 italic">Aucun contenu pour cette section.</p>
              )}
            </div>

            {/* CTA */}
            <div className="mt-12 p-6 rounded-xl bg-indigo-50 border border-indigo-100">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Intéressé par cette formation ?
              </h3>
              <p className="text-slate-600 mb-4">
                Inscrivez-vous dès maintenant ou contactez-nous pour plus d'informations.
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setShowInscription(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors"
                >
                  <UserPlus className="w-5 h-5" />
                  Demander une inscription
                </button>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border-2 border-indigo-200 text-indigo-700 font-medium hover:bg-indigo-100 transition-colors"
                >
                  Nous contacter
                </Link>
              </div>
            </div>

            {/* Modal inscription */}
            {showInscription && (
              <InscriptionModal
                formation={formation}
                onClose={() => setShowInscription(false)}
              />
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 p-6 rounded-xl bg-white border border-slate-200 shadow-sm">
              <h3 className="font-semibold text-slate-900 mb-4">Informations clés</h3>
              <dl className="space-y-4">
                {duration && (
                  <div>
                    <dt className="flex items-center gap-2 text-sm text-slate-500 mb-1">
                      <Clock className="w-4 h-4" /> Durée
                    </dt>
                    <dd className="text-slate-900 font-medium">{duration}</dd>
                  </div>
                )}
                {targetPublic && (
                  <div>
                    <dt className="flex items-center gap-2 text-sm text-slate-500 mb-1">
                      <Users className="w-4 h-4" /> Public
                    </dt>
                    <dd className="text-slate-900">{targetPublic}</dd>
                  </div>
                )}
                {level && (
                  <div>
                    <dt className="text-sm text-slate-500 mb-1">Niveau</dt>
                    <dd>
                      <LevelBadge level={level} />
                    </dd>
                  </div>
                )}
                {prerequisites && prerequisites.length > 0 && (
                  <div>
                    <dt className="flex items-center gap-2 text-sm text-slate-500 mb-1">
                      <FileText className="w-4 h-4" /> Prérequis
                    </dt>
                    <dd className="text-slate-900 text-sm">
                      {Array.isArray(prerequisites)
                        ? prerequisites.join(', ')
                        : prerequisites}
                    </dd>
                  </div>
                )}
              </dl>
              <button
                onClick={() => setShowInscription(true)}
                className="mt-6 w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors"
              >
                <UserPlus className="w-5 h-5" />
                S'inscrire
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal inscription (aussi accessible via sidebar) */}
      {showInscription && (
        <InscriptionModal
          formation={formation}
          onClose={() => setShowInscription(false)}
        />
      )}
    </div>
  );
}

// =============================================
// Modal d'inscription
// =============================================
function InscriptionModal({ formation, onClose }) {
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '', company: '', message: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.firstName.trim()) errs.firstName = 'Prénom requis';
    if (!form.lastName.trim()) errs.lastName = 'Nom requis';
    if (!form.email.trim()) errs.email = 'Email requis';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Email invalide';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await sendInscription({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
        company: form.company,
        formationId: formation._id,
        message: form.message,
      });
      setSuccess(true);
    } catch (err) {
      setErrors({ submit: err.response?.data?.message || 'Une erreur est survenue.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Demande d'inscription</h2>
            <p className="text-sm text-indigo-600 mt-1">{formation.title}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {success ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-emerald-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Inscription envoyée !</h3>
            <p className="text-slate-600 mb-6">
              Votre demande d'inscription a bien été enregistrée. Nous vous contacterons rapidement pour confirmer votre place.
            </p>
            <button
              onClick={onClose}
              className="px-6 py-3 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors"
            >
              Fermer
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Prénom *</label>
                <input name="firstName" value={form.firstName} onChange={handleChange}
                  className={`w-full px-3 py-2.5 rounded-lg border outline-none focus:ring-2 focus:ring-indigo-500 ${errors.firstName ? 'border-red-300' : 'border-slate-200'}`}
                  placeholder="Jean" />
                {errors.firstName && <p className="text-xs text-red-600 mt-1">{errors.firstName}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nom *</label>
                <input name="lastName" value={form.lastName} onChange={handleChange}
                  className={`w-full px-3 py-2.5 rounded-lg border outline-none focus:ring-2 focus:ring-indigo-500 ${errors.lastName ? 'border-red-300' : 'border-slate-200'}`}
                  placeholder="Dupont" />
                {errors.lastName && <p className="text-xs text-red-600 mt-1">{errors.lastName}</p>}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email *</label>
              <input name="email" type="email" value={form.email} onChange={handleChange}
                className={`w-full px-3 py-2.5 rounded-lg border outline-none focus:ring-2 focus:ring-indigo-500 ${errors.email ? 'border-red-300' : 'border-slate-200'}`}
                placeholder="jean.dupont@entreprise.com" />
              {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Téléphone</label>
                <input name="phone" value={form.phone} onChange={handleChange}
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="+33 6 00 00 00 00" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Entreprise</label>
                <input name="company" value={form.company} onChange={handleChange}
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Ma Société" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Message (optionnel)</label>
              <textarea name="message" value={form.message} onChange={handleChange} rows={3}
                className="w-full px-3 py-2.5 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                placeholder="Précisions, questions, dates souhaitées..." />
            </div>

            {errors.submit && (
              <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm">{errors.submit}</div>
            )}

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={onClose}
                className="flex-1 px-4 py-3 rounded-lg border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition-colors">
                Annuler
              </button>
              <button type="submit" disabled={loading}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors">
                {loading ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Envoi...</>
                ) : (
                  <><Send className="w-5 h-5" /> Envoyer</>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default FormationDetail;
