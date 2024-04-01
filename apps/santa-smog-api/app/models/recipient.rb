class Recipient < ApplicationRecord
  validates :full_name, presence: true
  validates :paystack_id, presence: true
  validates :email, presence: true

  has_many :transaction_histories
  has_many :donations, through: :transaction_histories
end
