import { useState, useEffect, useRef } from 'react'
import { chatAPI } from '../services/api'
import { Bot, Send, Sparkles, User } from 'lucide-react'

function Chat({ user, token }) {
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    loadChatHistory()
  }, [token])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const loadChatHistory = async () => {
    try {
      const data = await chatAPI.getHistory(token)
      setMessages(data.messages || [])
    } catch (error) {
      console.error('Failed to load chat history:', error)
      setMessages([
        {
          id: 'welcome',
          sender: 'assistant',
          message: `Welcome to B2H, ${user?.first_name}! I can help you find onboarding steps, resources, and next actions.`,
          timestamp: new Date().toISOString(),
        },
      ])
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!inputMessage.trim() || loading) return

    const userMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      message: inputMessage,
      timestamp: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage('')
    setLoading(true)

    try {
      const response = await chatAPI.sendMessage(inputMessage, token)

      const assistantMessage = {
        id: `assistant_${Date.now()}`,
        sender: 'assistant',
        message: response.response,
        suggestions: response.suggestions || [],
        resources: response.resources || [],
        timestamp: new Date().toISOString(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error('Failed to send message:', error)
      const errorMessage = {
        id: `error_${Date.now()}`,
        sender: 'assistant',
        message: 'I hit an issue while responding. Please try again in a moment.',
        timestamp: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  const handleSuggestionClick = (suggestion) => {
    setInputMessage(suggestion)
  }

  return (
    <div className="space-y-6">
      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_320px]">
        <div className="space-y-6">
          <div className="helper-panel">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-white/65">Optional helper</p>
                <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-white">
                  Ask for the next best onboarding move.
                </h2>
                <p className="mt-3 max-w-2xl text-sm text-white/70">
                  This helper shell keeps the MVP lightweight while still giving new hires a guided place to ask questions.
                </p>
              </div>
              <Sparkles className="text-white/80" size={22} />
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {[
                'What should I do first this week?',
                'Where do I find the engineering setup guide?',
                'Who can unblock my access request?',
                'What should I prepare for my manager 1:1?',
              ].map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => handleSuggestionClick(prompt)}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm text-white transition hover:bg-white/10"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          <div className="card h-[620px]">
            <div className="flex h-full flex-col">
              <div className="border-b border-[#e0e0e0] pb-4">
                <p className="text-sm font-medium text-[#6f6f6f]">Conversation</p>
                <h3 className="mt-1 text-xl font-semibold tracking-[-0.03em] text-[#161616]">
                  B2H helper panel
                </h3>
              </div>

              <div className="mt-5 flex-1 space-y-4 overflow-y-auto pr-2">
                {messages.map((msg) => (
                  <div key={msg.id}>
                    <div className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`flex max-w-[85%] items-start gap-3 ${
                        msg.sender === 'user' ? 'flex-row-reverse' : ''
                      }`}>
                        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${
                          msg.sender === 'user'
                            ? 'bg-[#0f62fe] text-white'
                            : 'bg-[#161616] text-white'
                        }`}>
                          {msg.sender === 'user' ? <User size={18} /> : <Bot size={18} />}
                        </div>

                        <div>
                          <div className={`rounded-[20px] px-4 py-3 text-sm ${
                            msg.sender === 'user'
                              ? 'bg-[#0f62fe] text-white'
                              : 'bg-[#f4f4f4] text-[#161616]'
                          }`}>
                            <p className="whitespace-pre-wrap">{msg.message}</p>
                          </div>
                          <p className="mt-1 px-1 text-xs text-[#6f6f6f]">
                            {new Date(msg.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    {msg.suggestions && msg.suggestions.length > 0 && (
                      <div className="mt-3 ml-12 flex flex-wrap gap-2">
                        {msg.suggestions.map((suggestion, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="rounded-full bg-[#f4f4f4] px-3 py-1.5 text-xs font-medium text-[#525252] transition hover:bg-[#ebebeb]"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {loading && (
                  <div className="flex justify-start">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#161616] text-white">
                        <Bot size={18} />
                      </div>
                      <div className="rounded-[20px] bg-[#f4f4f4] px-4 py-3">
                        <div className="flex gap-2">
                          <div className="h-2 w-2 animate-bounce rounded-full bg-[#8d8d8d]" style={{ animationDelay: '0ms' }} />
                          <div className="h-2 w-2 animate-bounce rounded-full bg-[#8d8d8d]" style={{ animationDelay: '150ms' }} />
                          <div className="h-2 w-2 animate-bounce rounded-full bg-[#8d8d8d]" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              <form onSubmit={handleSendMessage} className="mt-5 border-t border-[#e0e0e0] pt-4">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Ask anything…"
                    className="input-field flex-1"
                    disabled={loading}
                  />
                  <button
                    type="submit"
                    disabled={loading || !inputMessage.trim()}
                    className="btn-primary h-[52px] w-[52px] rounded-2xl p-0 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Send size={18} />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="card">
            <p className="text-sm font-medium text-[#6f6f6f]">Suggested prompts</p>
            <div className="mt-4 space-y-3">
              {[
                'Show me my next onboarding step',
                'Find the benefits portal',
                'Summarize what is blocked',
                'Help me prepare for my first week',
              ].map((item) => (
                <button
                  key={item}
                  onClick={() => handleSuggestionClick(item)}
                  className="w-full rounded-2xl bg-[#f4f4f4] px-4 py-3 text-left text-sm font-medium text-[#161616] transition hover:bg-[#ebebeb]"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="card">
            <p className="text-sm font-medium text-[#6f6f6f]">What this helper can do</p>
            <div className="mt-4 space-y-3 text-sm text-[#525252]">
              <p>Point you to the right onboarding resource or checklist item.</p>
              <p>Suggest next actions when you are unsure what to do next.</p>
              <p>Surface blockers and help you phrase follow-up questions.</p>
            </div>
          </div>
        </aside>
      </section>
    </div>
  )
}

export default Chat

// Made with Bob
