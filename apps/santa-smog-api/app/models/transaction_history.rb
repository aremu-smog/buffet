class TransactionHistory < ApplicationRecord
  belongs_to :donation
  belongs_to :recipient

  validates :donation_id, presence: true
  validates :recipient_id, presence: true
end
