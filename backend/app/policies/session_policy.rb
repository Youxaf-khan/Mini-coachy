class SessionPolicy
  attr_reader :user, :session

  def initialize(user, session)
    @user = user
    @session = session
  end

  def index?
    user.admin? || user.coach? || user.client?
  end

  def show?
    user.admin? || session.coach_id == user.id || session.client_id == user.id
  end

  def create?
    user.admin? || user.coach?
  end

  def update?
    user.admin? || session.coach_id == user.id
  end

  def destroy?
    user.admin? || session.coach_id == user.id
  end
end
