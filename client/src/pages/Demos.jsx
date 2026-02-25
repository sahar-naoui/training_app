import { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Sparkles,
  TrendingUp,
  HelpCircle,
  MessageCircle,
  Loader2,
  CheckCircle,
  ArrowRight,
  Lightbulb,
  Copy,
  Check,
  Info,
} from 'lucide-react';

/* =========================================
   DONNÉES
   ========================================= */

const promptCategories = [
  { id: 'email', label: 'Email professionnel', icon: '✉️' },
  { id: 'analyse', label: 'Analyse de données', icon: '📊' },
  { id: 'contenu', label: 'Création de contenu', icon: '✍️' },
  { id: 'code', label: 'Développement / Code', icon: '💻' },
  { id: 'strategie', label: 'Stratégie / Décision', icon: '🎯' },
  { id: 'rh', label: 'Ressources humaines', icon: '👥' },
];

const promptTones = [
  { id: 'professionnel', label: 'Professionnel' },
  { id: 'convaincant', label: 'Convaincant' },
  { id: 'simple', label: 'Simple & clair' },
  { id: 'creatif', label: 'Créatif' },
];

function buildPrompt(task, category, tone) {
  const catLabel = promptCategories.find(c => c.id === category)?.label || 'Général';
  const toneLabel = promptTones.find(t => t.id === tone)?.label || 'Professionnel';

  const roleMap = {
    email: 'un expert en communication professionnelle avec 15 ans d\'expérience',
    analyse: 'un data analyst senior spécialisé en business intelligence',
    contenu: 'un rédacteur de contenu expérimenté spécialisé en marketing digital',
    code: 'un développeur senior full-stack avec une expertise en architecture logicielle',
    strategie: 'un consultant en stratégie d\'entreprise certifié',
    rh: 'un directeur des ressources humaines expérimenté',
  };

  const constraintsMap = {
    professionnel: 'Adopte un ton formel et structuré. Utilise un vocabulaire précis et évite le jargon inutile.',
    convaincant: 'Utilise des arguments percutants, des chiffres concrets et des formulations qui incitent à l\'action.',
    simple: 'Utilise des phrases courtes et un vocabulaire accessible. Évite les termes techniques sauf si nécessaire.',
    creatif: 'Sois original dans ton approche. Propose des angles inattendus et des formulations engageantes.',
  };

  const role = roleMap[category] || 'un expert polyvalent';
  const constraints = constraintsMap[tone] || constraintsMap.professionnel;

  return `## RÔLE
Tu es ${role}.

## CONTEXTE
Domaine : ${catLabel}
Ton souhaité : ${toneLabel}

## TÂCHE
${task.trim()}

## CONSIGNES
${constraints}

## FORMAT DE SORTIE
- Commence par un résumé en 1-2 phrases
- Structure ta réponse avec des titres clairs
- Termine par les prochaines étapes recommandées

## CONTRAINTES
- Sois concis mais complet
- Donne des exemples concrets quand c'est pertinent
- Si tu fais des hypothèses, indique-les clairement`;
}

const quizQuestions = [
  {
    id: 1,
    question: "Qu'est-ce que le prompt engineering ?",
    options: [
      'Une technique de programmation traditionnelle',
      "L'art de formuler des instructions pour les modèles IA",
      'Un type de base de données',
      'Un framework de test',
    ],
    correct: 1,
    explanation: "Le prompt engineering consiste à rédiger des instructions précises pour obtenir les meilleurs résultats d'une IA. C'est LA compétence clé enseignée dans nos formations Niveau 1.",
  },
  {
    id: 2,
    question: "Quel est l'avantage principal de l'IA générative en entreprise ?",
    options: [
      "Remplacer complètement l'humain",
      'Accélérer les tâches répétitives et créatives',
      'Réduire les coûts serveur',
      'Augmenter la complexité du code',
    ],
    correct: 1,
    explanation: "L'IA ne remplace pas l'humain, elle l'augmente. En automatisant les tâches répétitives, vos équipes se concentrent sur la valeur ajoutée.",
  },
  {
    id: 3,
    question: "Qu'est-ce que le RAG (Retrieval Augmented Generation) ?",
    options: [
      'Un algorithme de compression',
      "Une technique qui enrichit l'IA avec des documents externes",
      'Un type de réseau neuronal',
      'Un langage de programmation',
    ],
    correct: 1,
    explanation: "Le RAG permet à l'IA de consulter vos documents internes pour donner des réponses contextualisées. C'est la base des assistants IA d'entreprise (Niveau 2).",
  },
  {
    id: 4,
    question: 'Le Vibecoding combine :',
    options: [
      'IA et développement uniquement',
      'IA, développement et méthodologie collaborative',
      'DevOps et cloud computing',
      'Base de données et API',
    ],
    correct: 1,
    explanation: "Le Vibecoding est l'approche de Qwestinum : utiliser l'IA comme partenaire de développement dans un cadre méthodologique collaboratif.",
  },
  {
    id: 5,
    question: "Pourquoi est-il important de vérifier les réponses d'une IA ?",
    options: [
      "L'IA est toujours correcte",
      "L'IA peut générer des informations incorrectes (hallucinations)",
      "Ce n'est pas important",
      "Uniquement pour les questions techniques",
    ],
    correct: 1,
    explanation: "Les « hallucinations » sont un phénomène connu : l'IA peut générer des réponses plausibles mais fausses. La vérification humaine reste indispensable.",
  },
  {
    id: 6,
    question: "Quel est le premier pas pour intégrer l'IA dans une entreprise ?",
    options: [
      'Acheter des licences IA coûteuses',
      'Identifier les tâches répétitives à automatiser',
      'Recruter une équipe de data scientists',
      'Réécrire tous les processus',
    ],
    correct: 1,
    explanation: "On commence toujours par identifier les « quick wins » : les tâches simples et répétitives où l'IA apporte un gain immédiat. C'est ce qu'on enseigne en Niveau 1.",
  },
];

const chatbotResponses = {
  formations: "Nous proposons 4 niveaux de formation :\n• Niveau 1 — Découverte & Acculturation\n• Niveau 2 — Productivité & Automatisation\n• Niveau 3 — Transformation & Stratégie\n• Niveau 4 — Expertise & Conception\n\nConsultez notre catalogue pour plus de détails !",
  catalogue: "Notre catalogue est accessible depuis le menu principal. Vous y trouverez toutes nos formations avec filtres par niveau et recherche.",
  contact: "Pour nous contacter, rendez-vous sur la page Contact ou écrivez-nous à contact@qwestinum.com. Nous vous répondrons dans les 24h.",
  prix: "Les tarifs varient selon le niveau et le format (présentiel/distanciel). Contactez-nous pour un devis personnalisé adapté à vos besoins.",
  qwestinum: "Qwestinum est une entreprise spécialisée dans la formation professionnelle à l'IA et le Vibecoding. Nous accompagnons les entreprises dans leur transformation digitale.",
  ia: "L'IA (Intelligence Artificielle) est un ensemble de technologies qui permettent aux machines d'imiter l'intelligence humaine. Nos formations vous apprennent à l'utiliser concrètement dans votre métier.",
  vibecoding: "Le Vibecoding est la méthodologie de Qwestinum : développer avec l'IA comme co-pilote, dans un cadre collaboratif et orienté valeur métier.",
  inscription: "Pour vous inscrire, rendez-vous sur la page d'une formation et cliquez sur « Demander une inscription ». Nous vous recontacterons rapidement !",
  default: "Je peux vous renseigner sur : nos formations, le catalogue, les tarifs, l'inscription, le Vibecoding ou Qwestinum. Que souhaitez-vous savoir ?",
};

/* =========================================
   PAGE PRINCIPALE
   ========================================= */

function Demos() {
  return (
    <div className="min-h-screen pt-24 lg:pt-28 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-2">
            Démonstrations interactives
          </h1>
          <p className="text-slate-600 text-lg">
            Découvrez concrètement ce que l&apos;IA peut apporter à votre quotidien professionnel. Chaque démo illustre une compétence enseignée dans nos formations.
          </p>
        </div>

        <div className="space-y-4">
          <DemoPrompt />
          <DemoROI />
          <DemoQuiz />
          <DemoChatbot />
        </div>

        <div className="mt-12 p-6 rounded-xl bg-gradient-to-r from-indigo-50 to-violet-50 border border-indigo-100 text-center">
          <p className="text-indigo-800 font-medium mb-1">
            Ces démos ne sont qu&apos;un aperçu.
          </p>
          <p className="text-indigo-600 text-sm">
            Nos formations vous apprennent à maîtriser ces outils et bien plus encore, avec des cas pratiques adaptés à votre métier.
          </p>
        </div>
      </div>
    </div>
  );
}

/* =========================================
   DÉMO 1 — GÉNÉRATION DE PROMPT
   ========================================= */

function DemoPrompt() {
  const [expanded, setExpanded] = useState(true);
  const [task, setTask] = useState('');
  const [category, setCategory] = useState('email');
  const [tone, setTone] = useState('professionnel');
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    if (!task.trim()) return;
    setLoading(true);
    setPrompt('');
    setCopied(false);
    setTimeout(() => {
      setPrompt(buildPrompt(task, category, tone));
      setLoading(false);
    }, 1200);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <DemoCard
      icon={Sparkles}
      title="Générateur de prompt professionnel"
      description="Transformez une simple idée en instruction optimisée pour ChatGPT, Copilot ou toute autre IA"
      expanded={expanded}
      onToggle={() => setExpanded(!expanded)}
    >
      <div className="space-y-5">
        {/* Explication */}
        <div className="p-4 rounded-lg bg-amber-50 border border-amber-200 flex gap-3">
          <Lightbulb className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-sm text-amber-800">
            <p className="font-medium mb-1">Pourquoi c&apos;est important ?</p>
            <p>
              La qualité de la réponse d&apos;une IA dépend à <strong>80% de la qualité de l&apos;instruction</strong> qu&apos;on lui donne.
              Un prompt vague donne une réponse vague. Un prompt structuré donne un résultat exploitable immédiatement.
              C&apos;est la compétence n°1 enseignée dans nos formations.
            </p>
          </div>
        </div>

        {/* Comparaison avant / après */}
        <div className="grid sm:grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-red-50 border border-red-200">
            <p className="text-xs font-semibold text-red-500 uppercase tracking-wider mb-1">Sans formation</p>
            <p className="text-sm text-red-800 italic">&quot;Écris-moi un email de relance&quot;</p>
            <p className="text-xs text-red-500 mt-1">Résultat : générique, inutilisable</p>
          </div>
          <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200">
            <p className="text-xs font-semibold text-emerald-500 uppercase tracking-wider mb-1">Avec nos techniques</p>
            <p className="text-sm text-emerald-800 italic">&quot;Rôle + Contexte + Tâche + Format + Contraintes&quot;</p>
            <p className="text-xs text-emerald-500 mt-1">Résultat : précis, professionnel, prêt à l&apos;emploi</p>
          </div>
        </div>

        {/* Catégorie */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Domaine d&apos;application</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {promptCategories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategory(cat.id)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm font-medium transition-all ${
                  category === cat.id
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700 ring-1 ring-indigo-500'
                    : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Ton */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Ton souhaité</label>
          <div className="flex flex-wrap gap-2">
            {promptTones.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTone(t.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  tone === t.id
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tâche */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Décrivez votre tâche</label>
          <textarea
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="Ex : Rédiger un email de relance pour un client qui n'a pas répondu depuis 2 semaines à notre proposition commerciale de 15 000€"
            rows={3}
            className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none"
          />
        </div>

        <button
          type="button"
          onClick={handleGenerate}
          disabled={loading || !task.trim()}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Génération en cours...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Générer le prompt optimisé
            </>
          )}
        </button>

        {/* Résultat */}
        {prompt && (
          <div className="rounded-xl border border-indigo-200 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 bg-indigo-600">
              <span className="text-sm font-medium text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Prompt optimisé — prêt à coller dans ChatGPT
              </span>
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-white/20 text-white text-xs font-medium hover:bg-white/30 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copié !' : 'Copier'}
              </button>
            </div>
            <pre className="p-5 text-sm text-slate-800 whitespace-pre-wrap font-sans bg-indigo-50/50 leading-relaxed">
              {prompt}
            </pre>
            <div className="px-4 py-3 bg-slate-50 border-t border-indigo-100 flex items-center gap-2 text-xs text-slate-500">
              <ArrowRight className="w-3.5 h-3.5" />
              Copiez ce prompt et collez-le dans ChatGPT, Copilot, Gemini ou Claude pour obtenir un résultat professionnel.
            </div>
          </div>
        )}
      </div>
    </DemoCard>
  );
}

/* =========================================
   DÉMO 2 — CALCULATEUR ROI
   ========================================= */

function DemoROI() {
  const [expanded, setExpanded] = useState(false);
  const [employes, setEmployes] = useState(50);
  const [tempsGagne, setTempsGagne] = useState(30);
  const [coutHoraire, setCoutHoraire] = useState(35);

  const joursOuvres = 220;
  const heuresGagneesJour = tempsGagne / 60;
  const heuresGagneesAn = employes * heuresGagneesJour * joursOuvres;
  const economiesAnnuelles = heuresGagneesAn * coutHoraire;
  const joursEquivalents = Math.round(heuresGagneesAn / 8);

  return (
    <DemoCard
      icon={TrendingUp}
      title="Calculateur de ROI — Retour sur Investissement"
      description="Calculez combien votre entreprise peut économiser en formant ses équipes à l'IA"
      expanded={expanded}
      onToggle={() => setExpanded(!expanded)}
    >
      <div className="space-y-5">
        {/* Explication du ROI */}
        <div className="p-4 rounded-lg bg-blue-50 border border-blue-200 flex gap-3">
          <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Qu&apos;est-ce que le ROI ?</p>
            <p className="mb-2">
              Le <strong>ROI (Retour sur Investissement)</strong> mesure ce que vous <strong>gagnez</strong> par rapport à ce que vous <strong>investissez</strong>.
            </p>
            <p>
              Ici, l&apos;investissement c&apos;est <strong>former vos employés à l&apos;IA</strong>.
              Le gain c&apos;est le <strong>temps qu&apos;ils économisent chaque jour</strong> grâce aux outils IA
              (rédaction plus rapide, automatisation de tâches répétitives, analyses accélérées...).
              Ce temps économisé se traduit directement en <strong>argent économisé</strong>.
            </p>
          </div>
        </div>

        {/* Le raisonnement en 3 étapes */}
        <div className="grid sm:grid-cols-3 gap-3">
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-center">
            <div className="text-2xl mb-1">📚</div>
            <p className="text-xs font-semibold text-slate-500 uppercase">Étape 1</p>
            <p className="text-sm text-slate-700 font-medium">Vous formez vos équipes</p>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-center">
            <div className="text-2xl mb-1">⚡</div>
            <p className="text-xs font-semibold text-slate-500 uppercase">Étape 2</p>
            <p className="text-sm text-slate-700 font-medium">Ils travaillent plus vite avec l&apos;IA</p>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-center">
            <div className="text-2xl mb-1">💰</div>
            <p className="text-xs font-semibold text-slate-500 uppercase">Étape 3</p>
            <p className="text-sm text-slate-700 font-medium">Votre entreprise économise</p>
          </div>
        </div>

        {/* Formulaire */}
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Employés formés
            </label>
            <input
              type="number" min={1} max={10000} value={employes}
              onChange={(e) => setEmployes(Math.max(1, parseInt(e.target.value, 10) || 0))}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Temps gagné / jour <span className="text-slate-400 font-normal">(min)</span>
            </label>
            <input
              type="number" min={1} max={480} value={tempsGagne}
              onChange={(e) => setTempsGagne(Math.max(0, parseInt(e.target.value, 10) || 0))}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Coût horaire moyen <span className="text-slate-400 font-normal">(€)</span>
            </label>
            <input
              type="number" min={1} max={500} value={coutHoraire}
              onChange={(e) => setCoutHoraire(Math.max(1, parseInt(e.target.value, 10) || 0))}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
          </div>
        </div>

        {/* Résultat */}
        <div className="rounded-xl border border-emerald-200 overflow-hidden">
          <div className="p-5 bg-gradient-to-r from-emerald-50 to-teal-50">
            <p className="text-sm text-emerald-700 font-medium mb-2">Économies annuelles estimées</p>
            <p className="text-4xl font-bold text-emerald-700">
              {economiesAnnuelles.toLocaleString('fr-FR')} €
            </p>
          </div>
          <div className="grid grid-cols-2 border-t border-emerald-200">
            <div className="p-4 border-r border-emerald-200">
              <p className="text-xs text-slate-500 mb-1">Heures économisées / an</p>
              <p className="text-xl font-bold text-slate-800">{Math.round(heuresGagneesAn).toLocaleString('fr-FR')}h</p>
            </div>
            <div className="p-4">
              <p className="text-xs text-slate-500 mb-1">Équivalent jours de travail</p>
              <p className="text-xl font-bold text-slate-800">{joursEquivalents.toLocaleString('fr-FR')} jours</p>
            </div>
          </div>
          <div className="px-4 py-3 bg-emerald-50 border-t border-emerald-200 text-xs text-emerald-600">
            Calcul : {employes} employés × {tempsGagne} min/jour × {joursOuvres} jours ouvrés × {coutHoraire}€/h
          </div>
        </div>
      </div>
    </DemoCard>
  );
}

/* =========================================
   DÉMO 3 — QUIZ
   ========================================= */

function DemoQuiz() {
  const [expanded, setExpanded] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showScore, setShowScore] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const handleAnswer = (optionIndex) => {
    setSelectedAnswer(optionIndex);
    setShowExplanation(true);
    const newAnswers = { ...answers, [currentQuestion]: optionIndex };
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    setSelectedAnswer(null);
    setShowExplanation(false);
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion((c) => c + 1);
    } else {
      setShowScore(true);
    }
  };

  const score = Object.entries(answers).filter(
    ([q, a]) => quizQuestions[parseInt(q, 10)].correct === a
  ).length;
  const total = quizQuestions.length;

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowScore(false);
    setSelectedAnswer(null);
    setShowExplanation(false);
  };

  const q = quizQuestions[currentQuestion];

  return (
    <DemoCard
      icon={HelpCircle}
      title="Quiz — Testez vos connaissances IA"
      description="6 questions pour évaluer votre niveau et découvrir ce que nos formations peuvent vous apporter"
      expanded={expanded}
      onToggle={() => setExpanded(!expanded)}
    >
      <div className="space-y-4">
        {showScore ? (
          <div className="text-center py-6">
            <CheckCircle className={`w-16 h-16 mx-auto mb-4 ${score >= total * 0.7 ? 'text-emerald-500' : score >= total * 0.4 ? 'text-amber-500' : 'text-red-400'}`} />
            <h3 className="text-xl font-semibold text-slate-900 mb-1">Votre résultat</h3>
            <p className="text-4xl font-bold text-indigo-600 mb-3">
              {score} / {total}
            </p>
            <div className={`inline-block px-4 py-2 rounded-lg text-sm font-medium mb-4 ${
              score >= total * 0.7
                ? 'bg-emerald-100 text-emerald-700'
                : score >= total * 0.4
                  ? 'bg-amber-100 text-amber-700'
                  : 'bg-red-100 text-red-700'
            }`}>
              {score >= total * 0.7
                ? 'Bravo ! Vous avez de bonnes bases. Nos formations avancées (Niveau 3-4) sont faites pour vous.'
                : score >= total * 0.4
                  ? 'Pas mal ! Nos formations Niveau 1-2 vous aideront à consolider et aller plus loin.'
                  : 'L\'IA est un domaine nouveau pour vous. Nos formations Niveau 1 sont le point de départ idéal !'}
            </div>
            <div>
              <button
                type="button"
                onClick={resetQuiz}
                className="px-5 py-2.5 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors"
              >
                Refaire le quiz
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Barre de progression */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-medium text-slate-500">
                Question {currentQuestion + 1}/{total}
              </span>
              <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-500 rounded-full transition-all duration-300"
                  style={{ width: `${((currentQuestion + 1) / total) * 100}%` }}
                />
              </div>
            </div>

            <p className="font-semibold text-slate-900 text-lg">{q.question}</p>

            <div className="space-y-2">
              {q.options.map((opt, i) => {
                const isSelected = selectedAnswer === i;
                const isCorrect = q.correct === i;
                let btnClass = 'border-slate-200 text-slate-700 hover:border-indigo-300 hover:bg-indigo-50/50';

                if (showExplanation) {
                  if (isCorrect) {
                    btnClass = 'border-emerald-400 bg-emerald-50 text-emerald-800 ring-1 ring-emerald-400';
                  } else if (isSelected && !isCorrect) {
                    btnClass = 'border-red-300 bg-red-50 text-red-700';
                  } else {
                    btnClass = 'border-slate-100 text-slate-400';
                  }
                }

                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => !showExplanation && handleAnswer(i)}
                    disabled={showExplanation}
                    className={`w-full text-left px-4 py-3 rounded-lg border transition-all ${btnClass}`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            {showExplanation && (
              <div className="p-4 rounded-lg bg-indigo-50 border border-indigo-200">
                <p className="text-sm text-indigo-800">
                  <strong>{selectedAnswer === q.correct ? '✓ Correct !' : '✗ Pas tout à fait.'}</strong>{' '}
                  {q.explanation}
                </p>
                <button
                  type="button"
                  onClick={handleNext}
                  className="mt-3 inline-flex items-center gap-1 px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors"
                >
                  {currentQuestion < quizQuestions.length - 1 ? 'Question suivante' : 'Voir le résultat'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </DemoCard>
  );
}

/* =========================================
   DÉMO 4 — CHATBOT
   ========================================= */

function DemoChatbot() {
  const [expanded, setExpanded] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { role: 'bot', text: "Bonjour ! Je suis l'assistant Qwestinum. Posez-moi une question sur nos formations, le catalogue, les tarifs, l'inscription ou le Vibecoding." },
  ]);

  const getResponse = (input) => {
    const lower = input.toLowerCase();
    if (lower.includes('formation') || lower.includes('niveau')) return chatbotResponses.formations;
    if (lower.includes('catalogue')) return chatbotResponses.catalogue;
    if (lower.includes('contact') || lower.includes('mail') || lower.includes('email')) return chatbotResponses.contact;
    if (lower.includes('prix') || lower.includes('tarif') || lower.includes('coût') || lower.includes('cout')) return chatbotResponses.prix;
    if (lower.includes('qwestinum')) return chatbotResponses.qwestinum;
    if (lower.includes('vibecod')) return chatbotResponses.vibecoding;
    if (lower.includes('inscri')) return chatbotResponses.inscription;
    if (lower.includes('ia') || lower.includes('intelligence')) return chatbotResponses.ia;
    return chatbotResponses.default;
  };

  const handleSend = () => {
    if (!message.trim()) return;
    const userMsg = { role: 'user', text: message.trim() };
    setMessages((m) => [...m, userMsg]);
    setMessage('');
    setTimeout(() => {
      setMessages((m) => [...m, { role: 'bot', text: getResponse(userMsg.text) }]);
    }, 800);
  };

  return (
    <DemoCard
      icon={MessageCircle}
      title="Chatbot démo"
      description="Un exemple d'assistant IA comme ceux que vous apprendrez à créer en formation Niveau 2"
      expanded={expanded}
      onToggle={() => setExpanded(!expanded)}
    >
      <div className="space-y-4">
        <div className="h-56 overflow-y-auto rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-3">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] px-4 py-2.5 rounded-lg text-sm whitespace-pre-wrap ${
                  msg.role === 'user'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white border border-slate-200 text-slate-800'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ex : Quelles formations proposez-vous ?"
            className="flex-1 px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
          />
          <button
            type="button"
            onClick={handleSend}
            disabled={!message.trim()}
            className="px-5 py-2.5 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Envoyer
          </button>
        </div>
      </div>
    </DemoCard>
  );
}

/* =========================================
   COMPOSANT RÉUTILISABLE — DEMO CARD
   ========================================= */

function DemoCard({ icon: Icon, title, description, expanded, onToggle, children }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50/50 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center">
            <Icon className="w-6 h-6 text-indigo-600" strokeWidth={1.5} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
            <p className="text-sm text-slate-600">{description}</p>
          </div>
        </div>
        {expanded ? (
          <ChevronUp className="w-5 h-5 text-slate-400 shrink-0" />
        ) : (
          <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
        )}
      </button>
      {expanded && <div className="px-5 pb-5 border-t border-slate-100 pt-5">{children}</div>}
    </div>
  );
}

export default Demos;
