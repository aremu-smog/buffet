# frozen_string_literal: true

# Payments Object
class PaymentsController < ApplicationController
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

    transfer = make_transfer_to(recipient_code: transaction_recipient_code, name: params[:name])

    render json: { status: 200, data: transfer }
  rescue StandardError => e
    handle_error e
  end

  # TODO: Investigate why this is getting blocked by Cloudflare
  def validate_account_number # rubocop:disable Metrics/AbcSize
    validate_params(expected_keys: %w[account_number bank_code], keys: params.keys)

    paystack_url = URI("https://api.paystack.co/bank/resolve?account_number=#{params[:account_number]}&bank_code=#{params[:bank_code]}")

    req = Net::HTTP::Get.new(paystack_url)
    req['Authorization'] = "Bearer #{ENV.fetch('PAYSTACK_SECRET_KEY')}"
    res = Net::HTTP.start(paystack_url.hostname, paystack_url.port) { |http| http.request(req) }
    render json: res
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

  def make_transfer_to(recipient_code:, name:)
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
    render json: { status: status_code, message: error.message }
  end

  def validate_process_transaction_params(keys:)
    expected_keys = %w[name bank_code account_number]
    has_all_keys = expected_keys.all? { |key| keys.include?(key) }
    raise ArgumentError, "400 Bad Request. Expects: #{expected_keys.join(', ')} in body" unless has_all_keys
  end
end
