import { useState, useEffect, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { tasksAPI } from '../services/api'
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Clock3,
  Flag,
  Sparkles,
} from 'lucide-react'

function Dashboard({ user, token }) {
  const [progress, setProgress] = useState(null)
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const navigate = useNavigate()

  useEffect(() => {
    loadDashboardData()
  }, [token])

  const loadDashboardData = async () => {
    try {
      const [progressData, tasksData] = await Promise.all([
        tasksAPI.getProgress(token),
        tasksAPI.getTasks(token),
      ])
      setProgress(progressData)
      setTasks(tasksData)
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const normalizedTasks = useMemo(() => {
    return tasks.map((task, index) => ({
      ...task,
      onboardingStep: index + 1,
      statusLabel:
        task.status === 'completed'
          ? 'Done'
          : task.status === 'in_progress'
            ? 'In progress'
            : task.status === 'blocked'
              ? 'Blocked'
              : 'To do',
    }))
  }, [tasks])

  const filteredTasks = useMemo(() => {
    if (filter === 'all') return normalizedTasks
    if (filter === 'todo') return normalizedTasks.filter((task) => task.status === 'pending')
    if (filter === 'in_progress') return normalizedTasks.filter((task) => task.status === 'in_progress')
    if (filter === 'done') return normalizedTasks.filter((task) => task.status === 'completed')
    return normalizedTasks
  }, [filter, normalizedTasks])

  const blockers = useMemo(() => {
    return normalizedTasks.filter(
      (task) =>
        task.status === 'blocked'
        || task.priority === 'high'
        || task.description?.toLowerCase().includes('blocked')
    ).slice(0, 3)
  }, [normalizedTasks])

  const nextSteps = useMemo(() => {
    return normalizedTasks
      .filter((task) => task.status !== 'completed')
      .slice(0, 4)
  }, [normalizedTasks])

  const resources = [
    {
      title: 'IBM w3 Access Setup',
      description: 'Set up your IBM intranet account and internal tools.',
      meta: 'IBM Systems',
    },
    {
      title: 'IBM Benefits & Wellness',
      description: 'Enroll in health plans, 401k, and wellness programs.',
      meta: 'HR & Benefits',
    },
    {
      title: 'Slack & Teams Communication',
      description: 'Join IBM Slack workspaces and Microsoft Teams channels.',
      meta: 'Collaboration',
    },
    {
      title: 'IBM Development Environment',
      description: 'Laptop setup, VPN, GitHub Enterprise, and dev tools.',
      meta: 'Technical Setup',
    },
  ]

  const summary = progress || {
    completion_percentage: 0,
    completed_tasks: normalizedTasks.filter((task) => task.status === 'completed').length,
    in_progress_tasks: normalizedTasks.filter((task) => task.status === 'in_progress').length,
    pending_tasks: normalizedTasks.filter((task) => task.status === 'pending').length,
  }

  const completedThisWeek = Math.max(1, Math.min(summary.completed_tasks || 0, 3))
  const totalSteps = normalizedTasks.length || 8
  const currentStep = Math.min((summary.completed_tasks || 0) + 1, totalSteps)

  const getStatusClasses = (status) => {
    if (status === 'completed') return 'status-badge status-done'
    if (status === 'in_progress') return 'status-badge status-progress'
    if (status === 'blocked') return 'status-badge status-blocked'
    return 'status-badge status-todo'
  }

  const getPriorityBadge = (priority) => {
    if (priority === 'high') return 'status-badge status-overdue'
    if (priority === 'medium') return 'status-badge status-blocked'
    return 'status-badge status-todo'
  }

  const handleHelperPromptClick = (taskTitle) => {
    // Navigate to chat with the task context
    navigate('/chat', { state: { prompt: `Help me with: ${taskTitle}` } })
  }

  if (loading) {
    return (
      <div className="flex min-h-[420px] items-center justify-center">
        <div className="card-muted text-sm text-[#6f6f6f]">Loading your onboarding workspace…</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_360px]">
        <div className="space-y-6">
          <div className="card">
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="max-w-3xl">
                  <p className="text-sm font-medium text-[#0f62fe]">
                    IBM Onboarding Workspace • Welcome back, {user?.first_name || 'new hire'}
                  </p>
                  <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-[-0.04em] text-[#161616] md:text-[2.6rem]">
                    You're <span className="summary-number-good">{summary.completion_percentage}%</span> through onboarding
                    {' '}— <span className={blockers.length > 0 ? 'summary-number-alert' : 'summary-number-neutral'}>
                      {blockers.length}
                    </span>{' '}
                    {blockers.length === 1 ? 'task needs attention' : 'tasks need attention'}.
                  </h2>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <span className="delta-pill">{completedThisWeek} done this week</span>
                  <Link to="/tasks" className="btn-primary">
                    Continue onboarding
                  </Link>
                </div>
              </div>

              <div className="card-muted">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-medium text-[#525252]">Progress</p>
                    <p className="mt-1 text-sm text-[#6f6f6f]">
                      Step {currentStep} of {totalSteps}
                    </p>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-left sm:text-right">
                    <div>
                      <p className="text-2xl font-semibold text-[#198038]">{summary.completed_tasks || 0}</p>
                      <p className="text-xs text-[#6f6f6f]">Done</p>
                    </div>
                    <div>
                      <p className="text-2xl font-semibold text-[#0f62fe]">{summary.in_progress_tasks || 0}</p>
                      <p className="text-xs text-[#6f6f6f]">In progress</p>
                    </div>
                    <div>
                      <p className="text-2xl font-semibold text-[#525252]">{summary.pending_tasks || 0}</p>
                      <p className="text-xs text-[#6f6f6f]">To do</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 h-3 overflow-hidden rounded-full bg-white">
                  <div
                    className="h-full rounded-full bg-[#0f62fe] transition-all duration-500"
                    style={{ width: `${summary.completion_percentage || 0}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="card-muted">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-[#525252]">Next milestone</p>
                  <p className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-[#161616]">
                    {currentStep}/{totalSteps}
                  </p>
                  <p className="mt-3 text-sm text-[#525252]">
                    Keep moving through your onboarding checklist in order.
                  </p>
                </div>
                <ArrowRight className="text-[#161616]" size={22} />
              </div>
            </div>

            <div className="card-muted">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-[#525252]">In progress</p>
                  <p className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-[#161616]">
                    {summary.in_progress_tasks || 0}
                  </p>
                  <p className="mt-3 text-sm text-[#525252]">
                    Active tasks already underway and ready to finish.
                  </p>
                </div>
                <Clock3 className="text-[#0f62fe]" size={22} />
              </div>
            </div>

            <div className="card-muted">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-[#525252]">Blockers</p>
                  <p className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-[#161616]">
                    {blockers.length}
                  </p>
                  <p className="mt-3 text-sm text-[#525252]">
                    Surface anything waiting on approvals, access, or follow-up.
                  </p>
                </div>
                <Flag className="text-[#da1e28]" size={22} />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="mb-5 flex flex-col gap-4 border-b border-[#e0e0e0] pb-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm font-medium text-[#0f62fe]">IBM Onboarding Steps</p>
                <h3 className="mt-1 text-xl font-semibold tracking-[-0.03em] text-[#161616]">
                  Track your next steps
                </h3>
              </div>

              <div className="segmented-control">
                {[
                  { key: 'all', label: 'All' },
                  { key: 'todo', label: 'To do' },
                  { key: 'in_progress', label: 'In progress' },
                  { key: 'done', label: 'Done' },
                ].map((option) => (
                  <button
                    key={option.key}
                    onClick={() => setFilter(option.key)}
                    className={filter === option.key ? 'segmented-option-active' : 'segmented-option'}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {filteredTasks.length > 0 ? (
                filteredTasks.slice(0, 6).map((task) => (
                  <div
                    key={task.id}
                    className="card-muted transition-transform duration-200 hover:-translate-y-0.5"
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="status-badge status-todo">Step {task.onboardingStep}</span>
                          <span className={getStatusClasses(task.status)}>{task.statusLabel}</span>
                          <span className={getPriorityBadge(task.priority)}>
                            {task.priority || 'Normal'}
                          </span>
                        </div>

                        <h4 className="mt-3 text-lg font-semibold text-[#161616]">{task.title}</h4>
                        <p className="mt-2 max-w-2xl text-sm text-[#525252]">{task.description}</p>

                        <div className="mt-4 flex flex-wrap gap-4 text-xs text-[#6f6f6f]">
                          <span>Owner: {user?.manager || 'Hiring team'}</span>
                          <span>Estimate: {task.estimated_time || '30 min'}</span>
                          {task.due_date && (
                            <span>Due: {new Date(task.due_date).toLocaleDateString()}</span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {task.status === 'completed' ? (
                          <CheckCircle2 className="text-[#198038]" size={22} />
                        ) : task.status === 'blocked' ? (
                          <AlertCircle className="text-[#da1e28]" size={22} />
                        ) : (
                          <ArrowRight className="text-[#161616]" size={22} />
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="card-muted text-center">
                  <CheckCircle2 className="mx-auto text-[#198038]" size={40} />
                  <h4 className="mt-4 text-lg font-semibold text-[#161616]">No tasks yet</h4>
                  <p className="mt-2 text-sm text-[#525252]">
                    Your onboarding plan will appear here once tasks are assigned.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            <div className="card">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-[#198038]">IBM Internal Resources</p>
                  <h3 className="mt-1 text-xl font-semibold tracking-[-0.03em] text-[#161616]">
                    Essential IBM tools and guides
                  </h3>
                </div>
                <Link to="/resources" className="text-sm font-semibold text-[#0043ce]">
                  View all
                </Link>
              </div>

              <div className="mt-5 grid gap-3">
                {resources.map((resource) => (
                  <div key={resource.title} className="card-muted">
                    <div className="flex items-start gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-[#0043ce]">
                        <BookOpen size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#161616]">{resource.title}</p>
                        <p className="mt-1 text-sm text-[#525252]">{resource.description}</p>
                        <p className="mt-2 text-xs uppercase tracking-[0.14em] text-[#6f6f6f]">
                          {resource.meta}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-[#da1e28]">Onboarding Blockers</p>
                  <h3 className="mt-1 text-xl font-semibold tracking-[-0.03em] text-[#161616]">
                    Flag anything slowing you down
                  </h3>
                </div>
                <span className={blockers.length > 0 ? 'status-badge status-blocked' : 'status-badge status-done'}>
                  {blockers.length > 0 ? `${blockers.length} active` : 'Clear'}
                </span>
              </div>

              <div className="mt-5 space-y-3">
                {blockers.length > 0 ? (
                  blockers.map((task) => (
                    <div key={task.id} className="rounded-[18px] border border-[#ffd7d9] bg-[#fff1f1] p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-[#161616]">{task.title}</p>
                          <p className="mt-1 text-sm text-[#525252]">{task.description}</p>
                          <p className="mt-3 text-xs text-[#6f6f6f]">
                            Suggested owner: {user?.manager || 'IT / onboarding lead'}
                          </p>
                        </div>
                        <AlertCircle className="shrink-0 text-[#da1e28]" size={18} />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="card-muted text-center">
                    <CheckCircle2 className="mx-auto text-[#198038]" size={36} />
                    <p className="mt-3 text-sm font-semibold text-[#161616]">No blockers right now</p>
                    <p className="mt-1 text-sm text-[#525252]">
                      You're clear to keep moving through the next onboarding steps.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="helper-panel">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-white/65">IBM Onboarding Helper</p>
                <h3 className="mt-1 text-2xl font-semibold tracking-[-0.03em] text-white">
                  Need a nudge?
                </h3>
              </div>
              <Sparkles className="text-white/80" size={20} />
            </div>

            <div className="mt-6 space-y-3">
              {nextSteps.length > 0 ? (
                nextSteps.map((task) => (
                  <button
                    key={`helper-${task.id}`}
                    onClick={() => handleHelperPromptClick(task.title)}
                    className="block w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left transition hover:bg-white/10"
                  >
                    <p className="text-sm font-semibold text-white">{task.title}</p>
                    <p className="mt-1 text-xs text-white/60">Click for guidance</p>
                  </button>
                ))
              ) : (
                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-5 text-sm text-white/70">
                  You're all caught up. Check back when new onboarding tasks are assigned.
                </div>
              )}
            </div>

            <Link to="/chat" className="mt-5 block rounded-2xl bg-black/20 p-3 transition hover:bg-black/30">
              <input
                type="text"
                placeholder="Ask anything…"
                className="w-full border-0 bg-transparent text-sm text-white placeholder:text-white/45 focus:outline-none pointer-events-none"
                readOnly
              />
            </Link>
          </div>

          <div className="card border-l-4 border-[#0f62fe]">
            <p className="text-sm font-medium text-[#0f62fe]">IBM Onboarding Profile</p>
            <div className="mt-4 space-y-4">
              <div>
                <p className="text-xs uppercase tracking-[0.14em] text-[#6f6f6f]">Role</p>
                <p className="mt-1 text-base font-semibold text-[#161616]">{user?.role || 'New hire'}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.14em] text-[#6f6f6f]">Department</p>
                <p className="mt-1 text-base font-semibold text-[#161616]">{user?.department || 'Team assignment pending'}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.14em] text-[#6f6f6f]">Manager</p>
                <p className="mt-1 text-base font-semibold text-[#161616]">{user?.manager || 'Manager not assigned'}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.14em] text-[#6f6f6f]">Start date</p>
                <p className="mt-1 text-base font-semibold text-[#161616]">
                  {user?.start_date ? new Date(user.start_date).toLocaleDateString() : 'TBD'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Dashboard

// Made with Bob
