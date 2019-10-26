'use strict'

/*
|--------------------------------------------------------------------------
| UserSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const User = use('App/Models/User')

class UserSeeder {
  async run () {
    await User.findOrCreate(
      { username: 'frantz' },
      { username: 'frantz', email: 'bahdcoder@gmail.com', password: 'password' }
    )

    await User.findOrCreate(
      { username: 'frantzv' },
      { username: 'frantzv', email: 'frantz@gmail.com', password: 'password' }
    )
  }
}

module.exports = UserSeeder
