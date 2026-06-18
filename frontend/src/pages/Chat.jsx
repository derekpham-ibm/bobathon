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
          message: `Welcome to IBM Onboarding, ${user?.first_name}! I can help you find onboarding steps, resources, and next actions.`,
          timestamp: new Date().toISOString(),
        },
      ])
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const generateContextualResponse = (message) => {
    const lowerMessage = message.toLowerCase()
    
    if (lowerMessage.includes('first') || lowerMessage.includes('week')) {
      return {
        response: `For your first week at IBM, I recommend focusing on these key areas:\n\n1. **Complete w3 Access Setup** - Get your IBM intranet access configured\n2. **Enroll in Benefits** - Review and select your health insurance and 401k options\n3. **Join Communication Channels** - Connect on Slack and Microsoft Teams\n4. **Meet Your Manager & Buddy** - Schedule your first 1:1s\n5. **Complete Security Training** - Required compliance modules\n\nCheck the Tasks page for your full onboarding checklist with detailed steps.`,
        suggestions: ['Show me my tasks', 'Find w3 access guide', 'What training is required?']
      }
    } else if (lowerMessage.includes('setup') || lowerMessage.includes('engineering') || lowerMessage.includes('development')) {
      return {
        response: `The IBM Development Environment guide covers everything you need:\n\n• **Laptop Setup** - Configure your IBM-issued device\n• **VPN Access** - Connect to IBM's secure network\n• **GitHub Enterprise** - Access IBM's code repositories\n• **Development Tools** - Install required IDEs and tools\n• **Team-Specific Setup** - Your team's custom configurations\n\nYou can find this guide in the Resources section under "Technical Setup". Estimated time: 2 hours.`,
        suggestions: ['View all technical resources', 'What about code standards?', 'Show security requirements']
      }
    } else if (lowerMessage.includes('access') || lowerMessage.includes('unblock') || lowerMessage.includes('blocked')) {
      return {
        response: `For access requests or blockers:\n\n• **Manager** - Your first point of contact for most blockers\n• **IT Support** - For technical access issues (w3, VPN, systems)\n• **HR Team** - For benefits, payroll, or policy questions\n• **Your Buddy** - For informal questions and guidance\n\nCheck your Tasks page to see if there are any blocked items that need attention. You can also escalate through your manager if something is time-sensitive.`,
        suggestions: ['View blocked tasks', 'Find my manager contact', 'Check my progress']
      }
    } else if (lowerMessage.includes('manager') || lowerMessage.includes('1:1') || lowerMessage.includes('meeting')) {
      return {
        response: `For your manager 1:1, here's what to prepare:\n\n**Before the meeting:**\n• Review your onboarding progress and completed tasks\n• List any blockers or questions you have\n• Think about your goals for the first 30/60/90 days\n• Prepare questions about your role and team\n\n**Topics to discuss:**\n• Your role expectations and success criteria\n• Team dynamics and how you can contribute\n• Any access or resource needs\n• Feedback on your onboarding experience so far\n\nYour manager wants to help you succeed - don't hesitate to ask questions!`,
        suggestions: ['What should I ask my manager?', 'Show my onboarding progress', 'Find team documentation']
      }
    } else if (lowerMessage.includes('next') || lowerMessage.includes('do')) {
      return {
        response: `Based on your current onboarding progress, here are your next recommended steps:\n\n1. **Review your Tasks page** - See what's pending and in progress\n2. **Complete required training** - Security and compliance modules\n3. **Set up your development environment** - If you haven't already\n4. **Join team channels** - Connect with your team on Slack/Teams\n5. **Schedule your first 1:1s** - With your manager and buddy\n\nFocus on completing tasks in order to maintain a smooth onboarding flow.`,
        suggestions: ['View my tasks', 'What training is required?', 'Show me resources']
      }
    } else if (lowerMessage.includes('benefits') || lowerMessage.includes('portal')) {
      return {
        response: `The IBM Benefits Portal provides access to:\n\n• **Health Insurance** - Medical, dental, and vision plans\n• **401k Retirement** - IBM's matching contribution program\n• **Wellness Programs** - Fitness reimbursement and mental health resources\n• **Employee Assistance** - Confidential counseling and support\n• **Time Off** - PTO accrual and holiday schedule\n\nYou can find the complete Benefits guide in the Resources section under "HR & Benefits". Make sure to complete your enrollment within your first 30 days.`,
        suggestions: ['Find benefits guide', 'What about PTO?', 'Show HR resources']
      }
    } else if (lowerMessage.includes('training') || lowerMessage.includes('learning')) {
      return {
        response: `IBM offers extensive learning opportunities:\n\n**Required Training:**\n• Security & Compliance Training (90 min) - Must complete in first week\n• Data Protection Awareness\n• Code of Conduct\n\n**Optional Development:**\n• Your Learning Portal - Technical courses and certifications\n• IBM Skills Academy - Professional development paths\n• Mentorship Programs - Connect with experienced IBMers\n\nCheck the Resources section under "Training" for links to all learning platforms.`,
        suggestions: ['Show required training', 'Find learning portal', 'What certifications are available?']
      }
    } else if (lowerMessage.includes('progress') || lowerMessage.includes('status')) {
      return {
        response: `You can track your onboarding progress in several ways:\n\n• **Dashboard** - See your overall completion percentage and next steps\n• **Tasks Page** - View detailed checklist with step-by-step progress\n• **Blockers Section** - Identify anything that needs attention\n\nYour progress is automatically updated as you complete tasks. Keep moving through the checklist in order for the smoothest experience.`,
        suggestions: ['Go to dashboard', 'View all tasks', 'Show blockers']
      }
    } else {
      return {
        response: `I'm here to help with your IBM onboarding! I can assist you with:\n\n• Finding the right resources and documentation\n• Understanding your next onboarding steps\n• Answering questions about IBM systems and processes\n• Identifying who to contact for specific needs\n• Tracking your onboarding progress\n\nWhat would you like to know more about?`,
        suggestions: ['What should I do next?', 'Show me resources', 'Check my progress']
      }
    }
  }

  const handleSendMessage = async (messageToSend = null) => {
    const message = messageToSend || inputMessage
    if (!message.trim() || loading) return

    const userMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      message: message,
      timestamp: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage('')
    setLoading(true)

    try {
      const response = await chatAPI.sendMessage(message, token)

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
      
      // Generate contextual response based on the message
      const contextualResponse = generateContextualResponse(message)
      
      const errorMessage = {
        id: `assistant_${Date.now()}`,
        sender: 'assistant',
        message: contextualResponse.response,
        suggestions: contextualResponse.suggestions,
        timestamp: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  const handleSuggestionClick = (suggestion) => {
    // Automatically send the suggestion as a message
    handleSendMessage(suggestion)
  }

  const handleFormSubmit = (e) => {
    e.preventDefault()
    handleSendMessage()
  }

  return (
    <div className="space-y-6">
      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_320px]">
        <div className="space-y-6">
          <div className="helper-panel">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-white/65">IBM Onboarding Helper</p>
                <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-white">
                  Ask for the next best IBM onboarding move.
                </h2>
                <p className="mt-3 max-w-2xl text-sm text-white/70">
                  Get instant guidance on your IBM onboarding journey. Click any prompt below to get started, or type your own question.
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
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm text-white transition hover:bg-white/10 hover:border-white/20"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          <div className="card border-l-4 border-[#0f62fe] h-[620px]">
            <div className="flex h-full flex-col">
              <div className="border-b border-[#e0e0e0] pb-4">
                <p className="text-sm font-medium text-[#0f62fe]">IBM Onboarding Conversation</p>
                <h3 className="mt-1 text-xl font-semibold tracking-[-0.03em] text-[#161616]">
                  IBM Onboarding Helper
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

              <form onSubmit={handleFormSubmit} className="mt-5 border-t border-[#e0e0e0] pt-4">
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
          <div className="card border-l-4 border-[#198038]">
            <p className="text-sm font-medium text-[#198038]">IBM Onboarding Prompts</p>
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

          <div className="card border-l-4 border-[#0f62fe]">
            <p className="text-sm font-medium text-[#0f62fe]">IBM Helper Capabilities</p>
            <div className="mt-4 space-y-3 text-sm text-[#525252]">
              <p>Point you to the right IBM onboarding resource or checklist item.</p>
              <p>Suggest next actions when you are unsure what to do next in your IBM onboarding.</p>
              <p>Surface blockers and help you phrase follow-up questions to your manager or buddy.</p>
            </div>
          </div>
        </aside>
      </section>
    </div>
  )
}

export default Chat

// Made with Bob
