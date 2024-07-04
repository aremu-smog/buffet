class AddStatusToDonations < ActiveRecord::Migration[7.1]
  def change
    add_column :donations, :status, :boolean
  end
end
