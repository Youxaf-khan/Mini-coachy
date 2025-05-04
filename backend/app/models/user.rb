class User < ApplicationRecord
  has_secure_password
  
  has_many :coaching_sessions, class_name: 'Session', foreign_key: 'coach_id'
  has_many :client_sessions, class_name: 'Session', foreign_key: 'client_id'
  
  validates :email, presence: true, uniqueness: true, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :password, length: { minimum: 6 }, if: -> { new_record? || !password.nil? }
  validates :role, presence: true, inclusion: { in: %w[admin coach client] }
  validates :name, presence: true
  
  before_validation :set_default_role, on: :create
  
  def admin?
    role == 'admin'
  end

  def coach?
    role == 'coach'
  end

  def client?
    role == 'client'
  end
  
  private
  
  def set_default_role
    self.role ||= 'client'
  end
end
