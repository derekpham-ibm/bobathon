import { Briefcase, Building, Calendar, Mail, MapPin, User } from 'lucide-react'

function Profile({ user }) {
  const daysAtCompany = user?.start_date
    ? Math.floor((new Date() - new Date(user.start_date)) / (1000 * 60 * 60 * 24))
    : 0

  return (
    <div className="space-y-6">
      <section className="card">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-5">
            <div className="flex h-24 w-24 items-center justify-center rounded-[28px] bg-[#161616] text-3xl font-semibold text-white">
              {user?.first_name?.[0]}{user?.last_name?.[0]}
            </div>

            <div>
              <p className="text-sm font-medium text-[#6f6f6f]">Profile</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-[#161616]">
                {user?.first_name} {user?.last_name}
              </h2>
              <p className="mt-2 text-sm text-[#525252]">
                {user?.role || 'New hire'} · {user?.department || 'Department pending'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 sm:min-w-[360px]">
            <div className="card-muted p-4">
              <p className="text-xs uppercase tracking-[0.14em] text-[#6f6f6f]">Days here</p>
              <p className="mt-2 text-3xl font-semibold text-[#161616]">{daysAtCompany}</p>
            </div>
            <div className="card-muted p-4">
              <p className="text-xs uppercase tracking-[0.14em] text-[#6f6f6f]">Manager</p>
              <p className="mt-2 text-base font-semibold text-[#161616]">{user?.manager || 'TBD'}</p>
            </div>
            <div className="card-muted p-4">
              <p className="text-xs uppercase tracking-[0.14em] text-[#6f6f6f]">Location</p>
              <p className="mt-2 text-base font-semibold text-[#161616]">{user?.location || 'TBD'}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_360px]">
        <div className="space-y-6">
          <div className="card">
            <p className="text-sm font-medium text-[#6f6f6f]">Personal details</p>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div className="card-muted p-4">
                <div className="flex items-start gap-3">
                  <Mail className="mt-0.5 text-[#6f6f6f]" size={18} />
                  <div>
                    <p className="text-xs uppercase tracking-[0.14em] text-[#6f6f6f]">Email</p>
                    <p className="mt-2 text-sm font-semibold text-[#161616]">{user?.email || 'Not available'}</p>
                  </div>
                </div>
              </div>

              <div className="card-muted p-4">
                <div className="flex items-start gap-3">
                  <Briefcase className="mt-0.5 text-[#6f6f6f]" size={18} />
                  <div>
                    <p className="text-xs uppercase tracking-[0.14em] text-[#6f6f6f]">Role</p>
                    <p className="mt-2 text-sm font-semibold text-[#161616]">{user?.role || 'Not available'}</p>
                  </div>
                </div>
              </div>

              <div className="card-muted p-4">
                <div className="flex items-start gap-3">
                  <Building className="mt-0.5 text-[#6f6f6f]" size={18} />
                  <div>
                    <p className="text-xs uppercase tracking-[0.14em] text-[#6f6f6f]">Department</p>
                    <p className="mt-2 text-sm font-semibold text-[#161616]">{user?.department || 'Not available'}</p>
                  </div>
                </div>
              </div>

              <div className="card-muted p-4">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 text-[#6f6f6f]" size={18} />
                  <div>
                    <p className="text-xs uppercase tracking-[0.14em] text-[#6f6f6f]">Location</p>
                    <p className="mt-2 text-sm font-semibold text-[#161616]">{user?.location || 'Not available'}</p>
                  </div>
                </div>
              </div>

              <div className="card-muted p-4">
                <div className="flex items-start gap-3">
                  <User className="mt-0.5 text-[#6f6f6f]" size={18} />
                  <div>
                    <p className="text-xs uppercase tracking-[0.14em] text-[#6f6f6f]">Manager</p>
                    <p className="mt-2 text-sm font-semibold text-[#161616]">{user?.manager || 'Not available'}</p>
                  </div>
                </div>
              </div>

              <div className="card-muted p-4">
                <div className="flex items-start gap-3">
                  <Calendar className="mt-0.5 text-[#6f6f6f]" size={18} />
                  <div>
                    <p className="text-xs uppercase tracking-[0.14em] text-[#6f6f6f]">Start date</p>
                    <p className="mt-2 text-sm font-semibold text-[#161616]">
                      {user?.start_date
                        ? new Date(user.start_date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })
                        : 'Not available'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <p className="text-sm font-medium text-[#6f6f6f]">About this profile</p>
            <div className="mt-4 space-y-3 text-sm text-[#525252]">
              <p>
                This profile gives new hires a clean summary of who they are, where they sit, and who supports their onboarding.
              </p>
              <p>
                In a fuller version, this area could include editable preferences, connected tools, learning progress, and team context.
              </p>
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="card">
            <p className="text-sm font-medium text-[#6f6f6f]">Account actions</p>
            <div className="mt-4 space-y-3">
              {[
                {
                  title: 'Change password',
                  description: 'Update your account password and recovery settings.',
                },
                {
                  title: 'Notification preferences',
                  description: 'Choose how onboarding reminders reach you.',
                },
                {
                  title: 'Privacy and security',
                  description: 'Review access, privacy, and account protections.',
                },
              ].map((action) => (
                <button
                  key={action.title}
                  className="w-full rounded-2xl bg-[#f4f4f4] px-4 py-4 text-left transition hover:bg-[#ebebeb]"
                >
                  <p className="text-sm font-semibold text-[#161616]">{action.title}</p>
                  <p className="mt-1 text-sm text-[#525252]">{action.description}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="card-muted">
            <p className="text-sm font-medium text-[#6f6f6f]">Profile purpose</p>
            <div className="mt-4 space-y-3 text-sm text-[#525252]">
              <p>Keep key onboarding identity details visible without digging through HR systems.</p>
              <p>Make it easy to know your manager, department, and start-date context at a glance.</p>
            </div>
          </div>
        </aside>
      </section>
    </div>
  )
}

export default Profile

// Made with Bob
