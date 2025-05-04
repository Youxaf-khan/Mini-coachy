class Session < ApplicationRecord
  belongs_to :coach, class_name: 'User'
  belongs_to :client, class_name: 'User'
  
  validates :title, presence: true
  validates :start_time, presence: true
  validates :end_time, presence: true
  validates :status, presence: true, inclusion: { in: %w[scheduled completed cancelled] }
  validates :client_id, presence: true
  validate :end_time_after_start_time
  validate :no_overlapping_sessions
  
  after_create :schedule_notification_job
  
  private
  
  def end_time_after_start_time
    return if end_time.blank? || start_time.blank?
    
    if end_time <= start_time
      errors.add(:end_time, "must be after start time")
    end
  end
  
  def no_overlapping_sessions
    return if start_time.blank? || end_time.blank?
    
    overlapping = Session.where(coach_id: coach_id)
                        .where.not(id: id)
                        .where('(start_time, end_time) OVERLAPS (?, ?)', start_time, end_time)
    
    if overlapping.exists?
      errors.add(:base, "Coach has an overlapping session during this time")
    end
  end
  
  def schedule_notification_job
    SessionNotificationJob.perform_later(self)
  end
end
