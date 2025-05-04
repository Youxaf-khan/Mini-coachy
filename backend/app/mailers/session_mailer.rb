class SessionMailer < ApplicationMailer
  ADMIN_EMAIL = 'admin@minicoachy.com'

  def session_scheduled(session)
    @session = session
    mail(
      to: session.client.email,
      from: ADMIN_EMAIL,
      subject: "Your session '#{session.title}' has been scheduled"
    )
  end

  def session_scheduled_coach(session)
    @session = session
    mail(
      to: session.coach.email,
      from: ADMIN_EMAIL,
      subject: "You have a new coaching session: '#{session.title}'"
    )
  end

  def session_reminder(session)
    @session = session
    mail(
      to: session.client.email,
      from: ADMIN_EMAIL,
      subject: "Reminder: Your session '#{session.title}' is coming up"
    )
  end

  def session_reminder_coach(session)
    @session = session
    mail(
      to: session.coach.email,
      from: ADMIN_EMAIL,
      subject: "Reminder: Coaching session '#{session.title}' is coming up"
    )
  end
end 
