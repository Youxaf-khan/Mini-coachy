class SessionReminderJob < ApplicationJob
  queue_as :default

  def perform(session)
    return if session.status == "cancelled"

    # Send reminder email to client
    SessionMailer.session_reminder(session).deliver_now

    # Send reminder email to coach
    SessionMailer.session_reminder_coach(session).deliver_now
  end
end
