class Recipient < ApplicationRecord
  has_many :transaction_histories
  has_many :donations, through: :transaction_histories
end
