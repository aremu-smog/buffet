class AddUniqToPaystackIdAndFullNameForRecipients < ActiveRecord::Migration[7.1]
  def change
    add_index :recipients, :paystack_id, unique: true, name: 'unique_paystack_id'
    add_index :recipients, :full_name, unique: true, name: 'unique_full_name'

    add_column :recipients, :email, :string
    add_index :recipients, :email, unique: true, name: 'unique_email'
  end
end
