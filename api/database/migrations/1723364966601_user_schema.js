'use strict'

const Schema = use('Schema')

class UserSchema extends Schema {
  up () {
    this.table('users', (table) => {
      table.string('username', 80).nullable().alter()
      table.string('password', 60).nullable().alter()
    })
  }

  down () {
    this.table('users', (table) => {
      table.string('username', 80).notNullable().alter()
      table.string('password', 60).notNullable().alter()
    })
  }
}

module.exports = UserSchema