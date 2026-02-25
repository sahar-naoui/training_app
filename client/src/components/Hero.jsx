import { Link } from 'react-router-dom';
import { GraduationCap, Users, Layers, Wrench } from 'lucide-react';

const stats = [
  { value: '8', label: 'Formations', icon: GraduationCap },
  { value: '4', label: 'Niveaux', icon: Layers },
  { value: '+500', label: 'Professionnels formés', icon: Users },
  { value: 'Sur mesure', label: 'Formations personnalisées', icon: Wrench },
];

function Hero() {
  return (
    <section className="relative gradient-hero text-white overflow-hidden pt-24 lg:pt-32 pb-16 lg:pb-24">
      {/* Decorative floating elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-indigo-500/10 blur-3xl animate-float" />
        <div className="absolute top-40 right-20 w-24 h-24 rounded-full bg-violet-500/10 blur-2xl animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-32 left-1/3 w-40 h-40 rounded-full bg-indigo-400/5 blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 right-1/4 w-16 h-16 border border-white/10 rounded-lg rotate-12 animate-float" style={{ animationDelay: '0.5s' }} />
        <div className="absolute bottom-20 right-16 w-8 h-8 border border-indigo-400/30 rounded-full animate-float" style={{ animationDelay: '1.5s' }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          {/* Main title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 animate-fade-in">
            Formez-vous à{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
              l&apos;IA
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed animate-slide-up">
            Des formations professionnelles conçues par Qwestinum pour maîtriser 
            l&apos;intelligence artificielle et accélérer la transformation de votre entreprise.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-slide-up">
            <Link
              to="/catalogue"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg gradient-accent text-white font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-indigo-500/25"
            >
              <GraduationCap className="w-5 h-5" />
              Découvrir nos formations
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg border-2 border-white/30 text-white font-semibold hover:bg-white/10 hover:border-white/50 transition-all"
            >
              Nous contacter
            </Link>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors"
              >
                <stat.icon className="w-8 h-8 text-indigo-400" strokeWidth={1.5} />
                <span className="text-2xl lg:text-3xl font-bold text-white">{stat.value}</span>
                <span className="text-sm text-slate-400">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
