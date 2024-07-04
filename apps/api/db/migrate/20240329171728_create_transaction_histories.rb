class CreateTransactionHistories < ActiveRecord::Migration[7.1]
  def change
    create_table :transaction_histories do |t|
      t.belongs_to :donation
      t.belongs_to :recipient

      t.timestamps
    end
  end
end
