const LEVEL_STYLES = {
  green: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  yellow: 'bg-amber-100 text-amber-700 border-amber-200',
  blue: 'bg-blue-100 text-blue-700 border-blue-200',
  red: 'bg-red-100 text-red-700 border-red-200',
};

function LevelBadge({ level }) {
  const { number, label, color = 'blue' } = level || {};
  const styles = LEVEL_STYLES[color] || LEVEL_STYLES.blue;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles}`}
    >
      Niveau {number ?? '?'}
    </span>
  );
}

export default LevelBadge;
