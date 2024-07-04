class Donation < ApplicationRecord
  has_many :transaction_histories
  has_many :recipients, through: :transaction_histories

  validates :amount, presence: true
  validates :no_of_recipients, presence: true
end
