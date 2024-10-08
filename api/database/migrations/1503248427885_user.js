'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserSchema extends Schema {
  up () {
    this.create('users', (table) => {
      table.increments()
      table.string('google_id', 255).notNullable().unique() 
      table.string('email', 254).notNullable().unique() 
      table.string('phone_number', 20).notNullable().unique()
      table.string('username', 80).nullable().unique() 
      table.text('avatar').nullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('users')
  }
}

module.exports = UserSchema
