const colors = {
  new: 'bg-blue-100 text-blue-700',
  contacted: 'bg-yellow-100 text-yellow-700',
  viewing: 'bg-purple-100 text-purple-700',
  reserved: 'bg-orange-100 text-orange-700',
  closed: 'bg-emerald-100 text-emerald-700',
  available: 'bg-emerald-100 text-emerald-700',
  occupied: 'bg-slate-100 text-slate-600',
  facebook: 'bg-blue-100 text-blue-700',
  sms: 'bg-green-100 text-green-700',
  manual: 'bg-slate-100 text-slate-600',
}

export function Badge({ label }) {
  return (
    <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full capitalize ${colors[label] ?? 'bg-slate-100 text-slate-600'}`}>
      {label}
    </span>
  )
}
