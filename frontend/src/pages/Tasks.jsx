import { useState, useEffect, useMemo } from 'react'
import { tasksAPI } from '../services/api'
import {
  ArrowRight,
  CheckCircle2,
  Circle,
  AlertCircle,
  Clock3,
  Lock,
} from 'lucide-react'

function Tasks({ user, token }) {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    loadTasks()
  }, [token])

  const loadTasks = async () => {
    try {
      const data = await tasksAPI.getTasks(token)
      setTasks(data)
    } catch (error) {
      console.error('Failed to load tasks:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCompleteTask = async (taskId) => {
    try {
      await tasksAPI.completeTask(taskId, token)
      await loadTasks()
    } catch (error) {
      console.error('Failed to complete task:', error)
    }
  }

  const orderedTasks = useMemo(() => {
    return tasks.map((task, index) => ({
      ...task,
      stepNumber: index + 1,
      isBlocked:
        task.status === 'blocked'
        || task.description?.toLowerCase().includes('blocked')
        || false,
    }))
  }, [tasks])

  const filteredTasks = useMemo(() => {
    if (filter === 'all') return orderedTasks
    if (filter === 'todo') return orderedTasks.filter((task) => task.status === 'pending')
    if (filter === 'in_progress') return orderedTasks.filter((task) => task.status === 'in_progress')
    if (filter === 'done') return orderedTasks.filter((task) => task.status === 'completed')
    return orderedTasks
  }, [filter, orderedTasks])

  const completedCount = orderedTasks.filter((task) => task.status === 'completed').length
  const blockedCount = orderedTasks.filter((task) => task.isBlocked).length
  const progressPercentage = orderedTasks.length > 0
    ? Math.round((completedCount / orderedTasks.length) * 100)
    : 0

  const getStatusClasses = (task) => {
    if (task.status === 'completed') return 'status-badge status-done'
    if (task.isBlocked) return 'status-badge status-blocked'
    if (task.status === 'in_progress') return 'status-badge status-progress'
    return 'status-badge status-todo'
  }

  const getStatusLabel = (task) => {
    if (task.status === 'completed') return 'Done'
    if (task.isBlocked) return 'Blocked'
    if (task.status === 'in_progress') return 'In progress'
    return 'Not started'
  }

  if (loading) {
    return (
      <div className="flex min-h-[420px] items-center justify-center">
        <div className="card-muted text-sm text-[#6f6f6f]">Loading onboarding steps…</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <section className="card">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-medium text-[#6f6f6f]">Onboarding steps</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-[#161616]">
              Follow the sequence, finish the essentials, and flag blockers early.
            </h2>
            <p className="mt-3 text-sm text-[#525252]">
              This view turns your onboarding plan into a clear step-by-step checklist for {user?.first_name || 'you'}.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 sm:min-w-[320px]">
            <div className="card-muted p-4">
              <p className="text-xs uppercase tracking-[0.14em] text-[#6f6f6f]">Done</p>
              <p className="mt-2 text-3xl font-semibold text-[#198038]">{completedCount}</p>
            </div>
            <div className="card-muted p-4">
              <p className="text-xs uppercase tracking-[0.14em] text-[#6f6f6f]">Remaining</p>
              <p className="mt-2 text-3xl font-semibold text-[#161616]">
                {Math.max(orderedTasks.length - completedCount, 0)}
              </p>
            </div>
            <div className="card-muted p-4">
              <p className="text-xs uppercase tracking-[0.14em] text-[#6f6f6f]">Blocked</p>
              <p className="mt-2 text-3xl font-semibold text-[#da1e28]">{blockedCount}</p>
            </div>
          </div>
        </div>

        <div className="mt-6 card-muted">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-[#525252]">Overall progress</p>
              <p className="mt-1 text-sm text-[#6f6f6f]">
                Step {Math.min(completedCount + 1, orderedTasks.length || 1)} of {orderedTasks.length || 0}
              </p>
            </div>
            <span className="delta-pill">{progressPercentage}% complete</span>
          </div>

          <div className="mt-4 h-3 overflow-hidden rounded-full bg-white">
            <div
              className="h-full rounded-full bg-[#0f62fe] transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </section>

      <section className="flex flex-wrap items-center justify-between gap-4">
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

        <p className="text-sm text-[#6f6f6f]">
          Complete steps in order where possible to keep onboarding smooth.
        </p>
      </section>

      {filteredTasks.length > 0 ? (
        <section className="space-y-4">
          {filteredTasks.map((task, index) => {
            const isCompleted = task.status === 'completed'
            const isInProgress = task.status === 'in_progress'
            const isBlocked = task.isBlocked
            const isLocked = !isCompleted && !isInProgress && index > 0 && filteredTasks[index - 1]?.status !== 'completed'

            return (
              <div key={task.id} className="card">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex min-w-0 gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border text-sm font-semibold ${
                        isCompleted
                          ? 'border-[#198038] bg-[#defbe6] text-[#198038]'
                          : isBlocked
                            ? 'border-[#f1c21b] bg-[#fcf4d6] text-[#8a6a00]'
                            : isInProgress
                              ? 'border-[#78a9ff] bg-[#d0e2ff] text-[#0043ce]'
                              : 'border-[#e0e0e0] bg-[#f4f4f4] text-[#525252]'
                      }`}>
                        {task.stepNumber}
                      </div>
                      {index < filteredTasks.length - 1 && (
                        <div className="mt-2 hidden h-16 w-px bg-[#e0e0e0] lg:block" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={getStatusClasses(task)}>{getStatusLabel(task)}</span>
                        {task.priority && (
                          <span className={task.priority === 'high' ? 'status-badge status-overdue' : 'status-badge status-todo'}>
                            {task.priority} priority
                          </span>
                        )}
                        {task.category && (
                          <span className="status-badge status-todo">{task.category}</span>
                        )}
                      </div>

                      <h3 className={`mt-3 text-xl font-semibold tracking-[-0.03em] ${
                        isCompleted ? 'text-[#6f6f6f] line-through' : 'text-[#161616]'
                      }`}>
                        {task.title}
                      </h3>

                      <p className="mt-2 max-w-3xl text-sm text-[#525252]">{task.description}</p>

                      <div className="mt-4 flex flex-wrap gap-4 text-xs text-[#6f6f6f]">
                        <span>Estimate: {task.estimated_time || '30 min'}</span>
                        {task.due_date && (
                          <span>Due: {new Date(task.due_date).toLocaleDateString()}</span>
                        )}
                        <span>Owner: {user?.manager || 'Onboarding lead'}</span>
                      </div>

                      {task.dependencies && task.dependencies.length > 0 && (
                        <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#f4f4f4] px-3 py-1.5 text-xs text-[#525252]">
                          <AlertCircle size={14} />
                          Depends on {task.dependencies.length} other task(s)
                        </div>
                      )}

                      {isBlocked && (
                        <div className="mt-4 rounded-[18px] border border-[#f1c21b] bg-[#fcf4d6] p-4">
                          <div className="flex items-start gap-3">
                            <AlertCircle className="mt-0.5 text-[#8a6a00]" size={18} />
                            <div>
                              <p className="text-sm font-semibold text-[#161616]">Blocker detected</p>
                              <p className="mt-1 text-sm text-[#525252]">
                                This step appears to need approval, access, or follow-up before it can be completed.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex shrink-0 flex-col gap-2 lg:min-w-[180px]">
                    {isCompleted ? (
                      <div className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#defbe6] px-4 py-3 text-sm font-semibold text-[#198038]">
                        <CheckCircle2 size={18} />
                        Completed
                      </div>
                    ) : isLocked ? (
                      <div className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#e0e0e0] bg-[#f4f4f4] px-4 py-3 text-sm font-medium text-[#6f6f6f]">
                        <Lock size={16} />
                        Finish prior step
                      </div>
                    ) : (
                      <button
                        onClick={() => handleCompleteTask(task.id)}
                        className="btn-primary w-full"
                      >
                        <span className="flex items-center gap-2">
                          {isInProgress ? <ArrowRight size={16} /> : <Circle size={16} />}
                          Mark complete
                        </span>
                      </button>
                    )}

                    <div className="rounded-2xl bg-[#f4f4f4] px-4 py-3 text-sm text-[#525252]">
                      {isCompleted
                        ? 'This step is done and recorded in your onboarding progress.'
                        : isBlocked
                          ? 'Escalate this blocker or request support to keep moving.'
                          : isInProgress
                            ? 'You’re actively working on this step.'
                            : 'Ready when you are.'}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </section>
      ) : (
        <section className="card text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-[#f4f4f4] text-[#198038]">
            <CheckCircle2 size={32} />
          </div>
          <h3 className="mt-5 text-2xl font-semibold tracking-[-0.03em] text-[#161616]">
            No onboarding steps found
          </h3>
          <p className="mx-auto mt-3 max-w-xl text-sm text-[#525252]">
            {filter === 'all'
              ? 'Your onboarding checklist will appear here once tasks are assigned.'
              : `There are no ${filter === 'todo' ? 'to do' : filter.replace('_', ' ')} steps right now.`}
          </p>
        </section>
      )}

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="card-muted">
          <p className="text-sm font-medium text-[#6f6f6f]">Suggested onboarding sequence</p>
          <ul className="mt-4 space-y-3 text-sm text-[#161616]">
            <li>1. Complete HR paperwork</li>
            <li>2. Set up laptop and accounts</li>
            <li>3. Join team channels</li>
            <li>4. Meet your manager</li>
            <li>5. Read the team handbook</li>
            <li>6. Set up your development environment</li>
            <li>7. Ship a starter task</li>
            <li>8. Complete your 30-day check-in</li>
          </ul>
        </div>

        <div className="card-muted">
          <p className="text-sm font-medium text-[#6f6f6f]">How to use this view</p>
          <div className="mt-4 space-y-3 text-sm text-[#525252]">
            <p>Use the filter toggle to focus on what’s next, what’s active, or what’s already done.</p>
            <p>Mark steps complete as you finish them to keep your dashboard progress accurate.</p>
            <p>If something is blocked, surface it early so your manager or IT partner can help unblock you.</p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Tasks

// Made with Bob
