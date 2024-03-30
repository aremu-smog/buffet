class WebhooksController < ApplicationController
  def paystack
    paystack_secret_key = ENV.fetch('PAYSTACK_SECRET_KEY')
    request_body = params[:webhook]
    hash = OpenSSL::HMAC.hexdigest('SHA512', paystack_secret_key, request_body.to_json)
    return unless hash == request.headers['x-paystack-signature']

    render json: handle_paystack(request_body)
  end

  private

  def handle_paystack(body) # rubocop:disable Metrics/MethodLength
    response = { status: 200 }

    puts "[paystack-webhook], #{body.to_json}"
    event = body['event']
    case event
    when 'transfer.success'
      puts 'Send an email to via a background job'
    when 'charge.success'
      response = { status: 500 } unless topup_or_create_donation(message: body['message'], amount: body['amount'])
    else
      response = { status: 500 }
      puts 'Event not recognized'
    end

    response
  end

  TRANSACTION_MESSAGE = 'santa smog'.freeze
  def topup_or_create_donation(message:, amount:)
    puts message
    return false unless message.downcase.strip.eql? TRANSACTION_MESSAGE

    last_donation = Donation.last
    amount_per_recipient = ENV.fetch('AMOUNT_PER_RECIPIENT', 500_000)
    no_of_recipients = (amount / amount_per_recipient).to_i
    last_donation.update!({ no_of_recipients: no_of_recipients }) if last_donation.active

    new_donation = Donation.create({ amount: amount_per_recipient, no_of_recipients: no_of_recipients, active: true })
    new_donation.save
  end
end
