class Donation < ApplicationRecord
  has_many :transaction_histories
  has_many :recipients, through: :transaction_histories
end
