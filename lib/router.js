const { Router } = require('express')
const flatten = require('lodash/flatten')
const lowerCase = require('lodash/lowerCase')

class OneusRouter {
  constructor() {
    this.expressRouter = Router()
    this.requestMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
    this.requestMethods.map(lowerCase).forEach(name => this.defineMethod(name))
  }

  defineMethod(name) {
    this[name] = (...args) => this.expressRouter[name](...flatten(args))
  }

  static createRouter() {
    return new OneusRouter()
  }
}

module.exports = OneusRouter
