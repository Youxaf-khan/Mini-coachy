# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.1].define(version: 2025_05_01_174825) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "sessions", force: :cascade do |t|
    t.string "title", null: false
    t.text "description"
    t.datetime "start_time", null: false
    t.datetime "end_time", null: false
    t.string "status", default: "scheduled", null: false
    t.bigint "coach_id", null: false
    t.bigint "client_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["client_id", "start_time"], name: "index_sessions_on_client_id_and_start_time"
    t.index ["client_id"], name: "index_sessions_on_client_id"
    t.index ["coach_id", "start_time"], name: "index_sessions_on_coach_id_and_start_time"
    t.index ["coach_id"], name: "index_sessions_on_coach_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "email"
    t.string "password_digest"
    t.string "role"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "name"
    t.index ["email"], name: "index_users_on_email", unique: true
  end

  add_foreign_key "sessions", "users", column: "client_id"
  add_foreign_key "sessions", "users", column: "coach_id"
end
