class UpdateRecipients < ActiveRecord::Migration[7.1]
  def change
    add_column :recipients, :full_name, :string
    remove_column :recipients, :donation_id, :string
  end
end
