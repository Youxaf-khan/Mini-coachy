# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end

# Create sample clients
clients = [
  {
    name: 'John Doe',
    email: 'john.doe@example.com',
    password: 'password123',
    role: 'client'
  },
  {
    name: 'Yousaf',
    email: 'Yousaf@example.com',
    password: 'password123',
    role: 'client'
  },
  {
    name: 'Ayesha',
    email: 'Ayesha@example.com',
    password: 'password123',
    role: 'client'
  }
]

# Create a sample coach
coach = {
  name: 'Coach Amine',
  email: 'coach.amine@example.com',
  password: 'password123',
  role: 'coach'
}

admin = {
  name: 'Admin Omar',
  email: 'adminomar@example.com',
  password: 'password123',
  role: 'admin'
}

# Create users
puts "Creating users..."
User.create!(admin)
User.create!(coach)
clients.each do |client_data|
  User.create!(client_data)
end

puts "Created #{clients.length + 2} users"
