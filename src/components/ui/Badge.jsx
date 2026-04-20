const colors = {
  new:       'bg-blue-100 text-blue-700   dark:bg-blue-900/40   dark:text-blue-300',
  contacted: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300',
  viewing:   'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
  reserved:  'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
  closed:    'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  available: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  occupied:  'bg-slate-100 text-slate-600   dark:bg-slate-700      dark:text-slate-400',
  facebook:  'bg-blue-100 text-blue-700     dark:bg-blue-900/40   dark:text-blue-300',
  sms:       'bg-green-100 text-green-700   dark:bg-green-900/40  dark:text-green-300',
  manual:    'bg-slate-100 text-slate-600   dark:bg-slate-700      dark:text-slate-400',
}

export function Badge({ label }) {
  return (
    <span className={`inline-block px-2.5 py-0.5 text-xs font-medium rounded-full capitalize ${colors[label] ?? 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400'}`}>
      {label}
    </span>
  )
}
