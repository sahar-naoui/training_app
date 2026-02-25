import { Link } from 'react-router-dom';
import { GraduationCap, Mail, MapPin, Phone, Linkedin, Twitter } from 'lucide-react';

const formationsByLevel = [
  { path: '/catalogue?niveau=1', label: 'Niveau 1 - Découverte & Acculturation' },
  { path: '/catalogue?niveau=2', label: 'Niveau 2 - Productivité & Automatisation' },
  { path: '/catalogue?niveau=3', label: 'Niveau 3 - Transformation & Stratégie' },
  { path: '/catalogue?niveau=4', label: 'Niveau 4 - Expertise & Conception' },
];

function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand info */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <GraduationCap className="w-8 h-8 text-indigo-400" strokeWidth={2} />
              <span>
                <span className="text-white font-bold">Qwesty</span>
                <span className="font-normal text-slate-400">-training</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              Plateforme de formation professionnelle à l&apos;intelligence artificielle, 
              conçue par Qwestinum pour accompagner les entreprises dans leur transformation digitale.
            </p>
          </div>

          {/* Formations */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Formations
            </h3>
            <ul className="space-y-3">
              {formationsByLevel.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className="text-sm hover:text-indigo-400 transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Ressources */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Ressources
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/demos" className="text-sm hover:text-indigo-400 transition-colors">
                  Démos
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm hover:text-indigo-400 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact info */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Nous contacter
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-indigo-400 shrink-0" />
                <a href="mailto:contact@qwestinum.com" className="hover:text-indigo-400 transition-colors">
                  contact@qwestinum.com
                </a>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-indigo-400 shrink-0" />
                <a href="tel:+33000000000" className="hover:text-indigo-400 transition-colors">
                  +33 (0)0 00 00 00 00
                </a>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>France</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-slate-700/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500">
            © 2026 Qwestinum - Qwesty-training. Tous droits réservés.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="#"
              className="text-slate-500 hover:text-indigo-400 transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="text-slate-500 hover:text-indigo-400 transition-colors"
              aria-label="Twitter"
            >
              <Twitter className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
