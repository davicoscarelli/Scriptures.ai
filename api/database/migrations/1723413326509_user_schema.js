'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserSchema extends Schema {
  up () {
    this.table('users', (table) => {
      table.string('google_id', 255).notNullable().unique() 
      table.string('email', 254).notNullable().unique() 
      table.string('phone_number', 20).notNullable().unique()
      table.string('username', 80).nullable().unique() 
      table.text('avatar').nullable()
    })
  }

  down () {
    this.table('users', (table) => {
      // reverse alternations
    })
  }
}

module.exports = UserSchema
