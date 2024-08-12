'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')
Route.post('/sermon/create', 'Sermon/SermonController.create')

Route.group(() => {
    Route.post('whatsapp', 'Sermon/WhatsAppController.webhook').as('whatsapp.webhook')

}).prefix("v1/webhook")

Route.group(() => {
    Route.get('redirect', 'Auth/AuthController.redirectToGoogle').as('google.redirect')
    Route.get('callback', 'Auth/AuthController.handleGoogleCallback').as('google.callback')

}).prefix("v1/google")

// Route for handling the OTP request (when user submits their phone number)
Route.post('/verify-number', 'AuthController.verifyNumber')

// Route for handling the OTP verification (when user submits the OTP)
Route.post('/verify-otp', 'AuthController.verifyOTP')


