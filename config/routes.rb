Rails.application.routes.draw do

  resource :home, path: '/', only: [:index]
  root to: 'home#index'
end
