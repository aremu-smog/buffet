class TransactionHistory < ApplicationRecord
  belongs_to :donation
  belongs_to :recipient
end
