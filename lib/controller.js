const asyncHandler = require('express-async-handler')
const difference = require('lodash/difference')
const isFunction = require('lodash/isFunction')
const isArray = require('lodash/isArray')
const reverse = require('lodash/reverse')

function isAsyncFunction(object) {
  return isFunction(object) && (object.constructor.name === 'AsyncFunction')
}

class Controller {
  constructor(args) {
    this.middlewares = []
    this.arguments = args || {}
    this.actions = Object.keys(this.arguments)

    for (let action of this.actions) {
      if (isAsyncFunction(this.arguments[action])) {
        this.arguments[action] = asyncHandler(this.arguments[action])
      }
    }
  }

  use(middleware, options) {
    let { only, except } = options || {}

    if (!isArray(only)) { only = this.actions }
    if (!isArray(except)) { except = [] }

    const actions = difference(only, except)
    this.middlewares.push({ middleware, actions })

    return this
  }

  toArguments() {
    for (let { middleware, actions } of this.middlewares) {
      for (let action of reverse(actions)) {
        this.arguments[action] = [middleware].concat(this.arguments[action])
      }
    }

    return this.arguments
  }

  static createController(args) {
    return new Controller(args)
  }
}

module.exports = Controller
