class AddActiveStatusToDonations < ActiveRecord::Migration[7.1]
  def change
    add_column :donations, :active, :boolean
    remove_column :donations, :status, :boolean
  end
end
