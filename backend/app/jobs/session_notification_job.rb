class SessionNotificationJob < ApplicationJob
  queue_as :default

  def perform(session)
    # Send email notification to client
    SessionMailer.session_scheduled(session).deliver_now

    # Send email notification to coach
    SessionMailer.session_scheduled_coach(session).deliver_now

    # Schedule reminder job
    SessionReminderJob.set(wait_until: 1.minute.from_now).perform_later(session)
  end
end
