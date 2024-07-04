class CreateDonations < ActiveRecord::Migration[7.1]
  def change
    create_table :donations do |t|
      t.integer :amount
      t.integer :no_of_recipients
      t.string :name

      t.timestamps
    end
  end
end
