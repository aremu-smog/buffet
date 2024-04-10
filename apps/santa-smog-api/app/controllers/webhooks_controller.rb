class WebhooksController < ApplicationController
  def paystack
    paystack_secret_key = ENV.fetch('PAYSTACK_SECRET_KEY')
    request_body = params[:webhook]
    puts "[paystack-webhook] #{request_body}"
    hash = OpenSSL::HMAC.hexdigest('SHA512', paystack_secret_key, request_body.to_json)
    return unless hash == request.headers['x-paystack-signature']

    render json: handle_paystack(request_body)
  end

  private

  def handle_paystack(body) # rubocop:disable Metrics/MethodLength
    response = { status: 200 }

    puts "[paystack-webhook], #{body.to_json}"
    event = body['event']
    data = body['data']
    case event
    when 'transfer.success'
      puts 'Send an email to via a background job'
    when 'charge.success'
      response = { status: 500 } unless topup_or_create_donation(payment_url: data['metadata']['referrer'],
                                                                 amount: data['amount'])
    else
      response = { status: 500 }
      puts 'Event not recognized'
    end

    response
  end

  PAYSTACK_PAYMENT_URL = ENV.fetch('PAYSTACK_PAYMENT_URL')
  def topup_or_create_donation(payment_url:, amount:)
    return false unless payment_url.eql? PAYSTACK_PAYMENT_URL

    last_donation = Donation.last
    amount_per_recipient = ENV.fetch('AMOUNT_PER_RECIPIENT', 500_000)
    no_of_recipients = amount.to_i / amount_per_recipient.to_i

    if last_donation.nil? || !last_donation.active

      new_donation = Donation.create({ amount: amount_per_recipient, no_of_recipients:, active: true,
                                       name: current_month })
      return new_donation.save
    end

    last_donation.update!({ no_of_recipients: no_of_recipients + last_donation.no_of_recipients })
  end

  def current_month
    today = Time.now
    today.strftime('%B')
  end
end
