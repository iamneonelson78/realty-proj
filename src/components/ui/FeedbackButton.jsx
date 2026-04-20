import { useState } from 'react'
import { MessageSquarePlus, X, Send } from 'lucide-react'

export function FeedbackButton() {
  const [open, setOpen] = useState(false)
  const [text, setText] = useState('')
  const [sent, setSent] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!text.trim()) return
    // Feedback submission placeholder — wire to backend when ready
    setSent(true)
    setTimeout(() => {
      setSent(false)
      setText('')
      setOpen(false)
    }, 2000)
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
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-800 dark:text-slate-100">Send Feedback</h3>
              <button
                onClick={() => setOpen(false)}
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
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Share a bug, suggestion, or anything on your mind..."
                  rows={4}
                  className="w-full border border-slate-300 dark:border-slate-600 rounded-xl px-3 py-2 text-sm bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
                />
                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 w-full py-2 rounded-full bg-brand-600 hover:bg-brand-700 dark:bg-brand-500 dark:hover:bg-brand-600 text-white text-sm font-medium transition-colors"
                >
                  <Send size={14} />
                  Send Feedback
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  )
}
