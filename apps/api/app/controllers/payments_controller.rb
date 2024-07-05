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

  def process_transaction # rubocop:disable Metrics/AbcSize,Metrics/MethodLength
    validate_process_transaction_params(keys: params.keys)
    account_name = get_account_name(account_number: params[:account_number], bank_code: params[:bank_code])
    can_fullname_be_trusted?(account_name)

    transaction_recipient_code = recipient_code(params:, name: account_name)

    recipient = fetch_recipient_from_db(code: transaction_recipient_code, full_name: account_name,
                                        email: params[:email])

    recipient_paid_for_the_month?(recipient)

    transfer = make_transfer_to(recipient_code: transaction_recipient_code, name: account_name)
    message = handle_transfer(transfer:, recipient:)
    render json: { status: 200, data: { message: } }
  rescue StandardError => e
    handle_error e
  end

  def validate_account_number
    validate_params(expected_keys: %w[account_number bank_code], keys: params.keys)

    account_name = get_account_name(account_number: params[:account_number], bank_code: params[:bank_code])

    render json: { status: 200, data: { account_name: } }
  rescue StandardError => e
    handle_error e
  end

  def current_donation_info

    if current_donation.nil?
      render json: {status: 200, data: {remaining_slots: 0, amount_per_recipient: ENV.fetch("AMOUNT_PER_RECIPIENT"), has_slots: false }}
      return
    end
    no_of_recipients = current_donation.no_of_recipients
    no_of_current_recipients = current_donation.recipients.count
    remaining_slots = no_of_recipients - no_of_current_recipients
    render json: { status: 200, data: {
      remaining_slots:,
      amount_per_recipient: current_donation.amount,
      has_slots: !remaining_slots.zero?
    } }
  end

  private

  def paystack_object
    paystack_secret_key = ENV.fetch('PAYSTACK_SECRET_KEY')
    paystack_public_key = ENV.fetch('PAYSTACK_PUBLIC_KEY')
    Paystack.new(paystack_public_key, paystack_secret_key)
  end

  def recipient_code(params:, name:)
    recipient = PaystackRecipients.new(paystack_object)
    result = recipient.create(
      type: 'nuban',
      name:,
      description: "#{current_donation.amount} for #{params[:name]}",
      account_number: params[:account_number],
      bank_code: params[:bank_code],
      currency: 'NGN'
    )
    result['data']['recipient_code']
  end

  # TODO: Move this to a background job
  def make_transfer_to(recipient_code:, name:) # rubocop:disable Metrics/MethodLength
    no_of_recipients_db = current_donation.recipients.count
    is_limit_reached = no_of_recipients_db >= current_donation.no_of_recipients

    puts "[limit-reached] #{is_limit_reached}"
    raise StandardError, '501 Limit reached for this month' if is_limit_reached

    amount_per_recipient = current_donation.amount

    puts "no_of_recipients_db: #{no_of_recipients_db}"
    puts "recipient_code: #{recipient_code} #{name}"
    puts "amount_per_recipient: #{amount_per_recipient}"

    intitialize_transfer(recipient: 'RCP_ltladdd1ioga0ab', amount: 5000)

  rescue StandardError => e
    puts "[make-transfer-error] #{e}"
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
    expected_keys = %w[email bank_code account_number]
    has_all_keys = expected_keys.all? { |key| keys.include?(key) }
    raise ArgumentError, "400 Bad Request. Expects: #{expected_keys.join(', ')} in body" unless has_all_keys
  end

  def intitialize_transfer(recipient:, amount:, reason: 'Buffet from Aremu')
    paystack_url = URI("https://api.paystack.co/transfer")

    http = Net::HTTP::Post.new(paystack_url.host, paystack_url.port)
    http.use_ssl = true

    request = Net::HTTP::Post.new(paystack_url)
    request['accept'] = 'application/json'
    request['Authorization'] = "Bearer #{ENV.fetch('PAYSTACK_SECRET_KEY')}"

    request.body = {source: 'balance', amount: amount, recipient: recipient, reason: reason}.to_json

    response = http.request(request)
    response_body = JSON.parse(response.read_body)

    puts "[initialize-transfer-response-body]: #{response_body}"
    response_body
  end
  def get_account_name(account_number:, bank_code:)
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

  def fetch_recipient_from_db(code:, full_name:, email:)
    recipient = Recipient.find_by(paystack_id: code)
    recipient ||= Recipient.create!({ paystack_id: code, full_name: full_name.upcase, email: }) if recipient.nil?
    recipient
  end

  def recipient_paid_for_the_month?(recipient)
    recipient = current_donation.recipients.where(paystack_id: recipient.paystack_id)

    raise StandardError, '409 Too many payment requests this month' unless recipient.blank?
  end

  def handle_transfer(transfer:, recipient:)
    unless transfer.nil?
      transaction_history = TransactionHistory.create({ recipient_id: recipient.id, donation_id: current_donation.id })
      return 'Transfer Successful' if transaction_history.save!

    end

    raise StandardError, 'Unable to make transfer'
  end

  def can_fullname_be_trusted?(full_name) # rubocop:disable Metrics/AbcSize,Metrics/MethodLength
    names_array = full_name.split(' ').map(&:strip)
    size_of_name = names_array.size.to_f
    target = 0
    names_array.each do |name|
      puts "[integrity] #{name}"
      recipient = current_donation.recipients.where('full_name LIKE ?', "%#{name.upcase}%")
      puts recipient.blank?
      next if recipient.blank?

      target += 1
      puts "[integrity-target] #{target}"
    end

    integrity = (target / size_of_name)

    puts "[integrity-for-#{full_name.downcase.gsub(' ', '-')}] #{integrity} "
    raise StandardError, '419' unless integrity < 0.75
  end

  def current_donation
    last_active_donation = Donation.where(active: true).last
    last_active_donation
  end
end
