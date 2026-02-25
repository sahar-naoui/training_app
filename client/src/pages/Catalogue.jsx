import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Loader2, FolderOpen } from 'lucide-react';
import FormationCard from '../components/FormationCard';
import { getFormations, getLevels } from '../services/api';

const levelFilters = [
  { value: null, label: 'Tous', color: 'bg-slate-400' },
  { value: 1, label: 'Niveau 1', color: 'bg-emerald-500' },
  { value: 2, label: 'Niveau 2', color: 'bg-amber-500' },
  { value: 3, label: 'Niveau 3', color: 'bg-blue-500' },
  { value: 4, label: 'Niveau 4', color: 'bg-red-500' },
];

function Catalogue() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [formations, setFormations] = useState([]);
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(() => {
    const niveau = searchParams.get('niveau');
    return niveau ? parseInt(niveau, 10) : null;
  });
  const [search, setSearch] = useState('');

  useEffect(() => {
    const niveau = searchParams.get('niveau');
    setSelectedLevel(niveau ? parseInt(niveau, 10) : null);
  }, [searchParams]);

  useEffect(() => {
    const fetchLevels = async () => {
      try {
        const data = await getLevels();
        setLevels(Array.isArray(data) ? data : data?.levels ?? data?.data ?? []);
      } catch {
        setLevels([]);
      }
    };
    fetchLevels();
  }, []);

  useEffect(() => {
    const fetchFormations = async () => {
      try {
        setLoading(true);
        setError(null);
        const params = {};
        if (selectedLevel) params.level = selectedLevel;
        if (search.trim()) params.search = search.trim();

        const data = await getFormations(params);
        const list = Array.isArray(data) ? data : data?.formations ?? data?.data ?? [];
        setFormations(list);
      } catch (err) {
        setError(err?.message || 'Impossible de charger les formations.');
        setFormations([]);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(fetchFormations, 300);
    return () => clearTimeout(debounce);
  }, [selectedLevel, search]);

  const handleLevelChange = (level) => {
    setSelectedLevel(level);
    const newParams = new URLSearchParams(searchParams);
    if (level) {
      newParams.set('niveau', level);
    } else {
      newParams.delete('niveau');
    }
    setSearchParams(newParams);
  };

  return (
    <div className="min-h-screen pt-24 lg:pt-28 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-2">
            Catalogue des formations
          </h1>
          <p className="text-slate-600 text-lg">
            Explorez nos formations professionnelles à l&apos;intelligence artificielle
          </p>
        </div>

        {/* Filter bar */}
        <div className="mb-8 space-y-4">
          {/* Level tabs */}
          <div className="flex flex-wrap gap-2">
            {levelFilters.map((filter) => (
              <button
                key={filter.label}
                type="button"
                onClick={() => handleLevelChange(filter.value)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all ${
                  selectedLevel === filter.value
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${filter.color} ${
                    selectedLevel === filter.value ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-900' : ''
                  }`}
                />
                {filter.label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher une formation..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow"
            />
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
            <p className="text-slate-600">Chargement des formations...</p>
          </div>
        ) : error ? (
          <div className="py-16 rounded-xl bg-red-50 border border-red-200 text-center text-red-700">
            {error}
          </div>
        ) : formations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 rounded-xl bg-slate-50 border border-slate-200">
            <FolderOpen className="w-16 h-16 text-slate-400 mb-4" />
            <h3 className="text-lg font-semibold text-slate-700 mb-2">Aucune formation trouvée</h3>
            <p className="text-slate-600 text-center max-w-md">
              Essayez de modifier vos filtres ou votre recherche.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {formations.map((formation) => (
              <FormationCard key={formation._id} formation={formation} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Catalogue;
