import { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';

const WELCOME_MESSAGE = {
  text: "Bonjour ! Je suis l'assistant de Qwesty. Je suis là pour répondre à vos questions sur nos formations, les niveaux, les inscriptions ou le catalogue. Pour l'instant je ne peux pas encore répondre en direct — je serai bientôt connecté à un assistant intelligent. N'hésitez pas à explorer le site ou à nous contacter via la page Contact.",
};

/**
 * Bouton flottant + panneau de chat. Ouverture/fermeture au clic.
 * Pas de vraies réponses pour l’instant (à brancher plus tard sur n8n / OpenAPI).
 */
function ChatbotButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    // Statique : pas d'envoi pour l'instant (n8n/OpenAPI plus tard)
    setInputValue('');
  };

  return (
    <div
      className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-3"
      aria-label="Assistant – Posez vos questions"
    >
      {/* Panneau de chat */}
      {isOpen && (
        <div
          className="w-[380px] max-w-[calc(100vw-3rem)] h-[480px] max-h-[80vh] flex flex-col rounded-2xl bg-white shadow-xl border border-slate-200 overflow-hidden animate-fade-in"
          role="dialog"
          aria-label="Fenêtre de chat assistant"
        >
          {/* En-tête */}
          <div className="flex items-center justify-between px-4 py-3 bg-slate-900 text-white shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 via-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 ring-2 ring-white/20">
                <MessageCircle className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Assistant Qwesty</h3>
                <p className="text-xs text-slate-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  En ligne • Bientôt connecté
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-700/80 transition-colors"
              aria-label="Fermer le chat"
            >
              <X className="w-5 h-5" strokeWidth={2.5} />
            </button>
          </div>

          {/* Zone messages */}
          <div className="flex-1 overflow-y-auto p-4 bg-slate-50">
            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shrink-0 shadow-md ring-2 ring-white">
                  <MessageCircle className="w-4 h-4 text-white" strokeWidth={2.5} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-slate-500 mb-1">Assistant</p>
                  <div className="rounded-2xl rounded-tl-sm bg-white px-4 py-3 text-slate-700 text-sm shadow-sm border border-slate-100">
                    {WELCOME_MESSAGE.text}
                  </div>
                </div>
              </div>
              <p className="text-xs text-slate-400 text-center py-2">
                Tapez un message ci-dessous — les réponses automatiques arriveront bientôt.
              </p>
            </div>
          </div>

          {/* Champ de saisie */}
          <form
            onSubmit={handleSubmit}
            className="p-3 bg-white border-t border-slate-200 shrink-0"
          >
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Posez votre question…"
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                aria-label="Votre message"
              />
              <button
                type="submit"
                className="p-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:from-indigo-500 hover:to-violet-500 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
                aria-label="Envoyer"
              >
                <Send className="w-5 h-5" strokeWidth={2.5} />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Bouton flottant */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        title={isOpen ? 'Fermer l’assistant' : 'Ouvrir l’assistant'}
        className={`flex items-center justify-center w-14 h-14 rounded-full text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all ${
          isOpen
            ? 'bg-slate-700 hover:bg-slate-600 shadow-xl shadow-slate-900/30 focus:ring-slate-400'
            : 'bg-gradient-to-br from-indigo-500 via-indigo-600 to-violet-600 shadow-xl shadow-indigo-500/40 hover:shadow-2xl hover:shadow-indigo-500/50 hover:scale-105 focus:ring-indigo-400'
        }`}
      >
        <MessageCircle className="w-7 h-7" strokeWidth={2.5} />
      </button>
    </div>
  );
}

export default ChatbotButton;
