class CreateSessions < ActiveRecord::Migration[7.1]
  def change
    create_table :sessions do |t|
      t.string :title, null: false
      t.text :description
      t.datetime :start_time, null: false
      t.datetime :end_time, null: false
      t.string :status, null: false, default: 'scheduled'
      t.references :coach, null: false, foreign_key: { to_table: :users }
      t.references :client, null: false, foreign_key: { to_table: :users }

      t.timestamps null: false
    end

    add_index :sessions, [ :coach_id, :start_time ]
    add_index :sessions, [ :client_id, :start_time ]
  end
end
