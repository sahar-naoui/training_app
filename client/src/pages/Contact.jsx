import { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle, Loader2, Building2 } from 'lucide-react';
import { sendContact } from '../services/api';

const sujetOptions = [
  { value: '', label: 'Sélectionnez un sujet' },
  { value: 'info', label: 'Demande d\'information' },
  { value: 'surmesure', label: 'Formation sur mesure' },
  { value: 'partenariat', label: 'Partenariat' },
  { value: 'autre', label: 'Autre' },
];

const initialForm = {
  prenom: '',
  nom: '',
  email: '',
  entreprise: '',
  telephone: '',
  sujet: '',
  message: '',
};

function Contact() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!form.prenom.trim()) newErrors.prenom = 'Le prénom est requis';
    if (!form.nom.trim()) newErrors.nom = 'Le nom est requis';
    if (!form.email.trim()) newErrors.email = "L'email est requis";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Email invalide";
    }
    if (!form.sujet) newErrors.sujet = 'Veuillez sélectionner un sujet';
    if (!form.message.trim()) newErrors.message = 'Le message est requis';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setErrors({});
    try {
      await sendContact({
        firstName: form.prenom,
        lastName: form.nom,
        email: form.email,
        company: form.entreprise || undefined,
        phone: form.telephone || undefined,
        subject: form.sujet,
        message: form.message,
      });
      setSuccess(true);
      setForm(initialForm);
    } catch (err) {
      setErrors({
        submit: err?.response?.data?.message || err?.message || 'Une erreur est survenue. Réessayez.',
      });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen pt-24 lg:pt-28 pb-16 flex items-center justify-center">
        <div className="max-w-lg mx-auto px-4 text-center">
          <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-emerald-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Message envoyé !</h1>
          <p className="text-slate-600 mb-6">
            Merci pour votre message. Nous vous répondrons dans les plus brefs délais.
          </p>
          <button
            type="button"
            onClick={() => setSuccess(false)}
            className="px-6 py-3 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors"
          >
            Envoyer un autre message
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 lg:pt-28 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-2">Contact</h1>
          <p className="text-slate-600 text-lg">Une question ? Nous sommes à votre écoute.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Form */}
          <div>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="prenom" className="block text-sm font-medium text-slate-700 mb-1.5">
                    Prénom *
                  </label>
                  <input
                    id="prenom"
                    name="prenom"
                    type="text"
                    value={form.prenom}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow ${
                      errors.prenom ? 'border-red-300' : 'border-slate-200'
                    }`}
                    placeholder="Jean"
                  />
                  {errors.prenom && (
                    <p className="mt-1 text-sm text-red-600">{errors.prenom}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="nom" className="block text-sm font-medium text-slate-700 mb-1.5">
                    Nom *
                  </label>
                  <input
                    id="nom"
                    name="nom"
                    type="text"
                    value={form.nom}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow ${
                      errors.nom ? 'border-red-300' : 'border-slate-200'
                    }`}
                    placeholder="Dupont"
                  />
                  {errors.nom && (
                    <p className="mt-1 text-sm text-red-600">{errors.nom}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">
                  Email *
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow ${
                    errors.email ? 'border-red-300' : 'border-slate-200'
                  }`}
                  placeholder="jean.dupont@entreprise.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="entreprise" className="block text-sm font-medium text-slate-700 mb-1.5">
                    Entreprise (optionnel)
                  </label>
                  <input
                    id="entreprise"
                    name="entreprise"
                    type="text"
                    value={form.entreprise}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow"
                    placeholder="Ma Société SAS"
                  />
                </div>
                <div>
                  <label htmlFor="telephone" className="block text-sm font-medium text-slate-700 mb-1.5">
                    Téléphone (optionnel)
                  </label>
                  <input
                    id="telephone"
                    name="telephone"
                    type="tel"
                    value={form.telephone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow"
                    placeholder="+33 6 00 00 00 00"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="sujet" className="block text-sm font-medium text-slate-700 mb-1.5">
                  Sujet *
                </label>
                <select
                  id="sujet"
                  name="sujet"
                  value={form.sujet}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow ${
                    errors.sujet ? 'border-red-300' : 'border-slate-200'
                  }`}
                >
                  {sujetOptions.map((opt) => (
                    <option key={opt.value || 'empty'} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                {errors.sujet && (
                  <p className="mt-1 text-sm text-red-600">{errors.sujet}</p>
                )}
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-1.5">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={form.message}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none transition-shadow ${
                    errors.message ? 'border-red-300' : 'border-slate-200'
                  }`}
                  placeholder="Votre message..."
                />
                {errors.message && (
                  <p className="mt-1 text-sm text-red-600">{errors.message}</p>
                )}
              </div>

              {errors.submit && (
                <div className="p-4 rounded-lg bg-red-50 text-red-700 text-sm">
                  {errors.submit}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Envoyer le message
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Info sidebar */}
          <div>
            <div className="lg:sticky lg:top-28 p-8 rounded-xl bg-slate-50 border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900 mb-6">Qwestinum</h3>
              <p className="text-slate-600 mb-6">
                Formations professionnelles à l&apos;intelligence artificielle et au Vibecoding. 
                Accompagnons votre entreprise dans sa transformation digitale.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-slate-900">Email</p>
                    <a
                      href="mailto:contact@qwestinum.com"
                      className="text-indigo-600 hover:text-indigo-700"
                    >
                      contact@qwestinum.com
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-slate-900">Téléphone</p>
                    <a href="tel:+33000000000" className="text-indigo-600 hover:text-indigo-700">
                      +33 (0)0 00 00 00 00
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-slate-900">Adresse</p>
                    <p className="text-slate-600">France</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Building2 className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-slate-900">Siège</p>
                    <p className="text-slate-600">Paris, France</p>
                  </div>
                </li>
              </ul>
              <div className="mt-8 h-48 rounded-lg bg-slate-200 flex items-center justify-center text-slate-500 text-sm">
                Carte (placeholder)
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
