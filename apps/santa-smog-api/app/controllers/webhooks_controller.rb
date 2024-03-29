class WebhooksController < ApplicationController
  def paystack
    paystack_secret_key = ENV.fetch('PAYSTACK_SECRET_KEY')
    request_body = params[:webhook]
    hash = OpenSSL::HMAC.hexdigest('SHA512', paystack_secret_key, request_body.to_json)
    return unless hash == request.headers['x-paystack-signature']

    event = request_body['event']

    render json: handle_paystack(event)
  end

  private

  def handle_paystack(event)
    response = { status: 200 }
    case event
    when 'transfer.success'
      puts 'Send an email to via a background job'
    else
      response = { status: 500 }
      puts 'Event not recognized'
    end

    response
  end
end
