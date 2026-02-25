import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Target,
  Palette,
  TrendingUp,
  Zap,
  GraduationCap,
  Users,
  Monitor,
  Layers,
  FlaskConical,
  ChevronRight,
} from 'lucide-react';
import Hero from '../components/Hero';
import FormationCard from '../components/FormationCard';
import { getFeaturedFormations, getLevels } from '../services/api';

const valueProps = [
  {
    icon: Target,
    title: 'Expertise pragmatique',
    description: 'Des formateurs terrain qui maîtrisent l\'IA au quotidien. Pas de théorie académique, que du concret applicable dès le lendemain.',
  },
  {
    icon: Palette,
    title: 'Formation sur mesure',
    description: 'Nous adaptons nos contenus à vos enjeux, votre secteur et votre niveau. Chaque formation est personnalisée pour vos équipes.',
  },
  {
    icon: TrendingUp,
    title: 'Résultats concrets',
    description: 'Objectifs mesurables, projets réels, ROI visible. Nos formations sont conçues pour produire des résultats tangibles rapidement.',
  },
  {
    icon: Zap,
    title: 'Approche Vibecoding',
    description: 'Une méthodologie unique qui intègre IA et développement pour accélérer votre productivité et innover différemment.',
  },
];

const formatItems = [
  {
    icon: Users,
    title: 'Présentiel / distanciel',
    description: 'Sessions en salle ou à distance selon vos contraintes.',
  },
  {
    icon: FlaskConical,
    title: 'Ateliers sur cas réels',
    description: 'Travail sur vos propres cas métier pour une mise en pratique immédiate.',
  },
  {
    icon: Monitor,
    title: 'Démonstrations live',
    description: 'Chaque notion est illustrée par des démos en temps réel.',
  },
  {
    icon: Layers,
    title: 'Prototypage pendant la formation',
    description: 'Construisez un premier prototype ou outil IA pendant la session.',
  },
];

const levelColors = {
  1: { bg: 'bg-emerald-500', border: 'border-emerald-500', text: 'text-emerald-600' },
  2: { bg: 'bg-amber-500', border: 'border-amber-500', text: 'text-amber-600' },
  3: { bg: 'bg-blue-500', border: 'border-blue-500', text: 'text-blue-600' },
  4: { bg: 'bg-red-500', border: 'border-red-500', text: 'text-red-600' },
};

function Home() {
  const [featuredFormations, setFeaturedFormations] = useState([]);
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [featured, levelsData] = await Promise.all([
          getFeaturedFormations(),
          getLevels(),
        ]);
        setFeaturedFormations(Array.isArray(featured) ? featured : featured?.formations ?? featured?.data ?? []);
        setLevels(Array.isArray(levelsData) ? levelsData : levelsData?.levels ?? levelsData?.data ?? []);
      } catch (err) {
        setError(err?.message || 'Une erreur est survenue.');
        setFeaturedFormations([]);
        setLevels([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const displayLevels = levels.length > 0
    ? levels
    : [
        { number: 1, label: 'Découverte & Acculturation', description: 'Comprendre l\'IA et identifier les opportunités' },
        { number: 2, label: 'Productivité & Automatisation', description: 'Automatiser les processus et créer des assistants IA' },
        { number: 3, label: 'Transformation & Stratégie', description: 'Définir et piloter votre stratégie IA' },
        { number: 4, label: 'Expertise & Conception', description: 'Concevoir des systèmes IA avancés et sécurisés' },
      ];

  return (
    <div>
      <Hero />

      {/* Pourquoi choisir Qwestinum */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 text-center mb-4">
            Pourquoi choisir Qwestinum ?
          </h2>
          <p className="text-slate-600 text-center max-w-2xl mx-auto mb-12">
            Une approche unique pour former vos équipes à l&apos;intelligence artificielle
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {valueProps.map((item) => (
              <div
                key={item.title}
                className="group p-6 rounded-xl bg-slate-50 border border-slate-200 hover:border-indigo-200 hover:bg-indigo-50/50 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center mb-4 group-hover:bg-indigo-200 transition-colors">
                  <item.icon className="w-6 h-6 text-indigo-600" strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Nos formations phares */}
      <section className="py-16 lg:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 text-center mb-4">
            Nos formations phares
          </h2>
          <p className="text-slate-600 text-center max-w-2xl mx-auto mb-12">
            Découvrez notre sélection de formations recommandées
          </p>

          {loading ? (
            <div className="flex justify-center py-16">
              <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
            </div>
          ) : error ? (
            <div className="text-center py-12 px-6 rounded-xl bg-red-50 text-red-700">
              {error}
            </div>
          ) : featuredFormations.length === 0 ? (
            <div className="text-center py-12 px-6 rounded-xl bg-slate-100 text-slate-600">
              Aucune formation phare pour le moment. Consultez notre catalogue.
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredFormations.map((formation) => (
                <FormationCard key={formation._id} formation={formation} />
              ))}
            </div>
          )}

          {featuredFormations.length > 0 && (
            <div className="text-center mt-10">
              <Link
                to="/catalogue"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors"
              >
                Voir tout le catalogue
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Parcours de formation */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 text-center mb-4">
            Parcours de formation
          </h2>
          <p className="text-slate-600 text-center max-w-2xl mx-auto mb-12">
            Un chemin progressif du niveau débutant à expert
          </p>

          <div className="relative">
            {/* Timeline line */}
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-amber-500 via-blue-500 to-red-500 -translate-y-1/2 rounded-full" />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4">
              {displayLevels.map((level, index) => {
                const colors = levelColors[level.number] || levelColors[index + 1] || levelColors[1];
                return (
                  <Link
                    key={level.number}
                    to={`/catalogue?niveau=${level.number}`}
                    className="group relative flex flex-col items-center text-center p-6 rounded-xl bg-white border-2 border-slate-200 hover:border-indigo-300 hover:shadow-xl transition-all duration-300"
                  >
                    <div
                      className={`w-14 h-14 rounded-full ${colors.bg} flex items-center justify-center mb-4 shadow-lg`}
                    >
                      <span className="text-white font-bold text-lg">{level.number}</span>
                    </div>
                    <h3 className={`font-semibold ${colors.text} mb-2`}>
                      Niveau {level.number} - {level.label}
                    </h3>
                    <p className="text-slate-600 text-sm">{level.description}</p>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Formats proposés */}
      <section className="py-16 lg:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 text-center mb-4">
            Formats proposés
          </h2>
          <p className="text-slate-600 text-center max-w-2xl mx-auto mb-12">
            Des modalités adaptées à vos besoins
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {formatItems.map((item) => (
              <div
                key={item.title}
                className="p-6 rounded-xl bg-white border border-slate-200 hover:shadow-lg transition-shadow"
              >
                <item.icon className="w-10 h-10 text-indigo-600 mb-4" strokeWidth={1.5} />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-600 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 lg:py-28 gradient-hero text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Prêt à transformer votre organisation ?
          </h2>
          <p className="text-slate-400 text-lg mb-8">
            Rejoignez les entreprises qui ont déjà franchi le cap de l&apos;IA avec Qwestinum.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-10 py-4 rounded-lg gradient-accent text-white font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-indigo-500/25"
          >
            <GraduationCap className="w-5 h-5" />
            Nous contacter
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Home;
