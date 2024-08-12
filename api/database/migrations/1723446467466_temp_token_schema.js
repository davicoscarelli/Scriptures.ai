'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TempTokenSchema extends Schema {
  up () {
    this.create('temp_tokens', (table) => {
      table.increments()
      table.text('phone_number').notNullable()
      table.string('token', 255).notNullable().unique()
      table.timestamps()
    })
  }

  down () {
    this.drop('temp_tokens')
  }
}

module.exports = TempTokenSchema
