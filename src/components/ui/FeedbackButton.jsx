import { useState } from 'react'
import { MessageSquarePlus, X, Send } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { submitFeedback } from '../../services/feedback'

const CATEGORIES = [
  { value: 'bug',        label: '🐛 Bug Report' },
  { value: 'suggestion', label: '💡 Suggestion' },
  { value: 'question',   label: '❓ Question' },
  { value: 'other',      label: '💬 Other' },
]

export function FeedbackButton() {
  const [open, setOpen] = useState(false)
  const [category, setCategory] = useState('suggestion')
  const [text, setText] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const user = useAuthStore((s) => s.user)

  const handleClose = () => {
    setOpen(false)
    setError(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!text.trim()) return
    setLoading(true)
    setError(null)
    try {
      await submitFeedback({ category, body: text, userId: user?.id })
      setSent(true)
      setTimeout(() => {
        setSent(false)
        setText('')
        setCategory('suggestion')
        setOpen(false)
      }, 2000)
    } catch (err) {
      setError('Failed to send. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setOpen(true)}
        title="Send Feedback"
        className="fixed bottom-8 right-6 z-40 flex items-center gap-2 px-4 py-2.5 rounded-full bg-brand-600 hover:bg-brand-700 dark:bg-brand-500 dark:hover:bg-brand-600 text-white shadow-lg hover:shadow-xl transition-all text-sm font-medium"
      >
        <MessageSquarePlus size={16} />
        <span className="hidden sm:inline">Feedback</span>
      </button>

      {/* Feedback modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleClose} />
          <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-800 dark:text-slate-100">Send Feedback</h3>
              <button
                onClick={handleClose}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-full p-1 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X size={18} />
              </button>
            </div>
            {sent ? (
              <div className="py-6 text-center">
                <p className="text-brand-600 dark:text-brand-400 font-medium">Thanks for your feedback! 🙏</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                {/* Category selector */}
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((c) => (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() => setCategory(c.value)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${
                        category === c.value
                          ? 'bg-brand-600 dark:bg-brand-500 text-white border-brand-600 dark:border-brand-500'
                          : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-600 hover:border-brand-400 dark:hover:border-brand-500 hover:text-brand-600 dark:hover:text-brand-400'
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Share a bug, suggestion, or anything on your mind..."
                  rows={4}
                  className="w-full border border-slate-300 dark:border-slate-600 rounded-xl px-3 py-2 text-sm bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
                />
                {error && <p className="text-xs text-red-500 dark:text-red-400">{error}</p>}
                <button
                  type="submit"
                  disabled={loading || !text.trim()}
                  className="flex items-center justify-center gap-2 w-full py-2 rounded-full bg-brand-600 hover:bg-brand-700 dark:bg-brand-500 dark:hover:bg-brand-600 text-white text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={14} />
                  {loading ? 'Sending…' : 'Send Feedback'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  )
}
