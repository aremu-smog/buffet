# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#

donations = [
  {
    amount: 500_000,
    no_of_recipients: 10,
    name: 'February',
    active: false
  },
  {
    amount: 500_000,
    no_of_recipients: 10,
    name: 'March',
    active: false
  }
]

recipients = [
  {
    paystack_id: 'RCP_123455',
    full_name: 'Aremu Oluwagbamila'
  },
  {
    paystack_id: 'RCP_124553',
    full_name: 'Isola Ade'
  },
  {
    paystack_id: 'RCP_213455',
    full_name: 'Korede Bello'
  }
]

recipients.each do |recipient|
  Recipient.find_or_create_by!(recipient)
end

donations.each do |donation|
  Donation.find_or_create_by!(donation)
end

# Donation.find_or_create_by!
# %w[Action Comedy Drama Horror].each do |genre_name|
#   MovieGenre.find_or_create_by!(name: genre_name)
# end
