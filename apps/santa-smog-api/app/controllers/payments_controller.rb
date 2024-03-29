# frozen_string_literal: true

# Payments Object
class PaymentsController < ApplicationController # rubocop:disable Metrics/ClassLength
  def list_all_banks
    banks_query = PaystackBanks.new(paystack_object)
    result = banks_query.list
    banks_list = result['data']
    ng_banks = banks_list.filter { |bank| bank['currency'].downcase == 'ngn' }
    render json: { status: 200, data: ng_banks }
  rescue StandardError => e
    handle_error e
  end

  def process_transaction
    validate_process_transaction_params(keys: params.keys)
    transaction_recipient_code = recipient_code(params: params)

    recipient = fetch_recipient_from_db(code: transaction_recipient_code, full_name: params[:name])

    puts recipient

    recipient_paid_for_the_month?(recipient)

    transfer = make_transfer_to(recipient_code: transaction_recipient_code, name: params[:name])

    message = handle_transfer(transfer: transfer, recipient: recipient)
    render json: { status: 200, data: { message: message } }
  rescue StandardError => e
    handle_error e
  end

  def validate_account_number
    validate_params(expected_keys: %w[account_number bank_code], keys: params.keys)

    account_name = get_account_info(account_number: params[:account_number], bank_code: params[:bank_code])

    render json: { status: 200, data: { account_name: account_name } }
  rescue StandardError => e
    handle_error e
  end

  private

  def paystack_object
    paystack_secret_key = ENV.fetch('PAYSTACK_SECRET_KEY')
    paystack_public_key = ENV.fetch('PAYSTACK_PUBLIC_KEY')
    Paystack.new(paystack_public_key, paystack_secret_key)
  end

  def recipient_code(params:)
    recipient = PaystackRecipients.new(paystack_object)
    result = recipient.create(
      type: 'nuban',
      name: params[:name],
      description: '5K for Aremu',
      account_number: params[:account_number],
      bank_code: params[:bank_code],
      currency: 'NGN'
    )
    result['data']['recipient_code']
  end

  # TODO: Move this to a background job
  def make_transfer_to(recipient_code:, name:) # rubocop:disable Metrics/MethodLength
    current_donation = Donation.last
    no_of_recipients_db = current_donation.recipients.count
    limit_reached = no_of_recipients_db <= current_donation.no_of_recipients

    raise StandardError, '501 Limit reached for this month' unless limit_reached

    transfer = PaystackTransfers.new(paystack_object)
    amount_per_recipient = ENV.fetch('AMOUNT_PER_RECIPIENT', 500_000)

    transfer.initializeTransfer(
      source: 'balance',
      reason: "5K for #{name}",
      amount: amount_per_recipient,
      recipient: recipient_code
    )
  end

  def validate_params(expected_keys:, keys:)
    has_all_keys = expected_keys.all? { |key| keys.include?(key) }
    raise ArgumentError, "400 Bad Request. Expects: #{expected_keys.join(', ')} in body" unless has_all_keys
  end

  def handle_error(error)
    status_code = error.message.split.first.to_i
    final_status_code = status_code.zero? ? 500 : status_code
    render json: { status: final_status_code, message: error.message }
  end

  def validate_process_transaction_params(keys:)
    expected_keys = %w[name bank_code account_number]
    has_all_keys = expected_keys.all? { |key| keys.include?(key) }
    raise ArgumentError, "400 Bad Request. Expects: #{expected_keys.join(', ')} in body" unless has_all_keys
  end

  def get_account_info(account_number:, bank_code:)
    paystack_url = URI("https://api.paystack.co/bank/resolve?account_number=#{account_number}&bank_code=#{bank_code}")

    http = Net::HTTP.new(paystack_url.host, paystack_url.port)
    http.use_ssl = true

    request = Net::HTTP::Get.new(paystack_url)
    request['accept'] = 'application/json'
    request['Authorization'] = "Bearer #{ENV.fetch('PAYSTACK_SECRET_KEY')}"

    response = http.request(request)
    response_body = JSON.parse(response.read_body)

    response_body['data']['account_name']
  end

  def fetch_recipient_from_db(code:, full_name:)
    recipient = Recipient.find_by(paystack_id: code)
    recipient ||= Recipient.create!({ paystack_id: code, full_name: full_name })
    recipient
  end

  def recipient_paid_for_the_month?(recipient)
    current_donation = Donation.last
    recipient = current_donation.recipients.find_by(paystack_id: recipient.paystack_id)

    raise StandardError, '409 Too many payment requests this month' unless recipient.nil?
  end

  def handle_transfer(transfer:, recipient:)
    last_donation = Donation.last

    if transfer['status']
      transaction_history = TransactionHistory.create({ recipient_id: recipient.id, donation_id: last_donation.id })
      return 'Transfer Successful' if transaction_history.save

    end

    raise StandardError, 'Unable to make transfer'
  end
end
