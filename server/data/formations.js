const formations = [
  {
    _id: "f1",
    title: "IA pour décideurs : comprendre sans devenir ingénieur",
    slug: "ia-pour-decideurs",
    subtitle: "Comprendre l'IA pour prendre les bonnes décisions stratégiques",
    level: { number: 1, label: "Découverte & Acculturation", color: "green" },
    public: "Dirigeants, managers, fonctions support",
    duration: "1 jour",
    prerequisites: "Aucun",
    objectives: [
      "Comprendre ce que l'IA sait vraiment faire aujourd'hui",
      "Identifier les opportunités rapides dans son organisation",
      "Séparer innovation réelle et poudre aux yeux"
    ],
    program: [
      "Panorama IA & IA générative",
      "Cas d'usage par métiers",
      "Où l'IA fait gagner de l'argent, où elle en brûle",
      "Méthode pour détecter les projets prioritaires"
    ],
    deliverables: [
      "Grille d'identification d'opportunités",
      "Shortlist de quick wins",
      "Plan d'expérimentation sur 90 jours"
    ],
    formats: ["Présentiel", "Distanciel", "Ateliers sur cas réels entreprise", "Démonstrations live"],
    featured: true,
    order: 1
  },
  {
    _id: "f2",
    title: "Travailler avec l'IA au quotidien",
    slug: "travailler-avec-ia-au-quotidien",
    subtitle: "Boostez votre productivité dès maintenant grâce à l'IA",
    level: { number: 1, label: "Découverte & Acculturation", color: "green" },
    public: "Collaborateurs",
    duration: "1 jour",
    prerequisites: "Aucun",
    objectives: [
      "Utiliser l'IA pour produire plus vite",
      "Améliorer mails, synthèses, comptes rendus",
      "Gagner du temps immédiatement"
    ],
    program: [
      "Principes de prompting",
      "Rédaction, résumé, traduction",
      "Automatisation des tâches répétitives",
      "Limites & vérifications humaines"
    ],
    deliverables: [
      "Bibliothèque de prompts métiers",
      "Templates réutilisables"
    ],
    formats: ["Présentiel", "Distanciel", "Ateliers sur cas réels entreprise", "Démonstrations live"],
    featured: true,
    order: 2
  },
  {
    _id: "f3",
    title: "Automatiser ses processus avec l'IA",
    slug: "automatiser-processus-ia",
    subtitle: "Identifiez et automatisez les tâches à forte valeur ajoutée",
    level: { number: 2, label: "Productivité & Automatisation", color: "yellow" },
    public: "Responsables opérations, IT, qualité",
    duration: "2 jours",
    prerequisites: "Aucun",
    objectives: [
      "Cartographier les tâches automatisables",
      "Mettre en place des flux simples",
      "Calculer le ROI d'une automatisation"
    ],
    program: [
      "Identifier les points de friction",
      "IA + workflows",
      "Collecte et structuration de données",
      "Supervision humaine"
    ],
    deliverables: [
      "Carte des processus candidats",
      "1 prototype d'automatisation",
      "Estimation gains temps / coûts"
    ],
    formats: ["Présentiel", "Distanciel", "Ateliers sur cas réels entreprise", "Démonstrations live", "Possibilité de produire un prototype pendant la formation"],
    featured: true,
    order: 3
  },
  {
    _id: "f4",
    title: "Créer un assistant IA interne",
    slug: "creer-assistant-ia-interne",
    subtitle: "Construisez votre premier assistant IA d'entreprise",
    level: { number: 2, label: "Productivité & Automatisation", color: "yellow" },
    public: "Équipes digitales / innovation",
    duration: "2 à 3 jours",
    prerequisites: "Aucun",
    objectives: [
      "Comprendre comment fonctionne un assistant d'entreprise",
      "Définir règles, sources de données, escalade humaine",
      "Construire une première version exploitable"
    ],
    program: [
      "Architecture d'un assistant",
      "Base de connaissances",
      "Scénarios utilisateurs",
      "Sécurité & gouvernance"
    ],
    deliverables: [
      "Blueprint fonctionnel",
      "Script conversationnel",
      "Roadmap MVP → production"
    ],
    formats: ["Présentiel", "Distanciel", "Ateliers sur cas réels entreprise", "Démonstrations live", "Possibilité de produire un prototype pendant la formation"],
    featured: false,
    order: 4
  },
  {
    _id: "f5",
    title: "Définir une feuille de route IA",
    slug: "feuille-de-route-ia",
    subtitle: "Structurez votre stratégie IA avec méthode et pragmatisme",
    level: { number: 3, label: "Transformation & Stratégie", color: "blue" },
    public: "COMEX, direction transformation",
    duration: "2 jours",
    prerequisites: "Aucun",
    objectives: [
      "Prioriser les investissements",
      "Éviter les gadgets",
      "Structurer gouvernance et risques"
    ],
    program: [
      "Benchmark marché",
      "Modèle de maturité",
      "Choix Make vs Buy",
      "Organisation cible"
    ],
    deliverables: [
      "Roadmap stratégique",
      "Matrice valeur / complexité",
      "Budget indicatif"
    ],
    formats: ["Présentiel", "Distanciel", "Ateliers sur cas réels entreprise"],
    featured: true,
    order: 5
  },
  {
    _id: "f6",
    title: "Piloter la performance des projets IA",
    slug: "piloter-performance-projets-ia",
    subtitle: "Mesurez, suivez et optimisez vos projets IA en continu",
    level: { number: 3, label: "Transformation & Stratégie", color: "blue" },
    public: "Management, PMO",
    duration: "1 jour",
    prerequisites: "Aucun",
    objectives: [
      "Mesurer impact réel",
      "Mettre en place des indicateurs utiles",
      "Ajuster rapidement"
    ],
    program: [
      "KPI IA",
      "Adoption utilisateurs",
      "Suivi qualité",
      "Amélioration continue"
    ],
    deliverables: [
      "Dashboard type",
      "Méthode de revue trimestrielle"
    ],
    formats: ["Présentiel", "Distanciel", "Ateliers sur cas réels entreprise"],
    featured: false,
    order: 6
  },
  {
    _id: "f7",
    title: "Concevoir des systèmes intelligents robustes",
    slug: "concevoir-systemes-intelligents",
    subtitle: "Maîtrisez l'architecture et l'industrialisation de systèmes IA avancés",
    level: { number: 4, label: "Expertise & Conception", color: "red" },
    public: "Profils techniques",
    duration: "3 jours",
    prerequisites: "Connaissances techniques en développement",
    objectives: [
      "Comprendre les briques d'un système avancé",
      "Gérer données, mémoire, règles",
      "Préparer l'industrialisation"
    ],
    program: [
      "Orchestration",
      "Qualité des réponses",
      "Gestion des erreurs",
      "Passage à l'échelle"
    ],
    deliverables: [
      "Schéma d'architecture",
      "Standards d'implémentation"
    ],
    formats: ["Présentiel", "Distanciel", "Ateliers sur cas réels entreprise", "Démonstrations live", "Possibilité de produire un prototype pendant la formation"],
    featured: false,
    order: 7
  },
  {
    _id: "f8",
    title: "Sécurité, conformité et éthique de l'IA",
    slug: "securite-conformite-ethique-ia",
    subtitle: "Anticipez les risques et sécurisez vos usages de l'IA",
    level: { number: 4, label: "Expertise & Conception", color: "red" },
    public: "IT, juridique, direction",
    duration: "1 jour",
    prerequisites: "Aucun",
    objectives: [
      "Identifier risques réglementaires",
      "Mettre en place des garde-fous",
      "Sécuriser les usages"
    ],
    program: [
      "Données sensibles",
      "Traçabilité",
      "Responsabilités",
      "Bonnes pratiques"
    ],
    deliverables: [
      "Checklist conformité",
      "Politique d'usage IA"
    ],
    formats: ["Présentiel", "Distanciel", "Ateliers sur cas réels entreprise"],
    featured: false,
    order: 8
  }
];

module.exports = formations;
