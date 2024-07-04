class CreateRecipients < ActiveRecord::Migration[7.1]
  def change
    create_table :recipients do |t|
      t.string :paystack_id
      t.string :donation_id

      t.timestamps
    end
  end
end
