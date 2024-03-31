Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get 'up' => 'rails/health#show', as: :rails_health_check

  # Defines the root path route ("/")
  # root "posts#index"
  get '/list_banks', to: 'payments#list_all_banks'
  get '/validate_account_number', to: 'payments#validate_account_number'
  post '/pay', to: 'payments#process_transaction'
  get '/donation_info', to: 'payments#current_donation_info'

  # Make this a dynamic route in case of more webhooks?
  post '/webhook/paystack', to: 'webhooks#paystack'
end
