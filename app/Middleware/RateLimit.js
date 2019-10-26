'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Redis = use('Redis')
const Format = use('date-fns/format')
const DiffInSeconds = use('date-fns/differenceInSeconds')

class RateLimit {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle ({ request, response }, next) {
    // call next to advance the request

    /// get the token
    const token = request.headers().authorization.split(' ')[1]

    // first, fetch the token from redis database
    let tokenData = await Redis.get(token)
    
    tokenData = JSON.parse(tokenData)
    // next, get the time now
    const diffInSeconds = DiffInSeconds(new Date(), new Date(tokenData.first_used))
    // next, get the time different between now and first_used
    // check if its more than 60 seconds
  
    if (diffInSeconds > 60) {
      await Redis.set(token, JSON.stringify({
        first_used: Format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
        used_count: 1
      }))


      await next()

      return
    }

    if (tokenData.used_count > 3) {
      return response.badRequest(`Too many requests. Please try again in ${60 - diffInSeconds} seconds.`)
    }

    await Redis.set(token, JSON.stringify({
      first_used: tokenData.first_used,
      used_count: tokenData.used_count + 1
    }))
    // if it is,
        // reset first_used to now
        // reset used_count to 0
    // if its not,
        // check the used_count 
              // if its more than 30, reject the request with an error
              // if its less than 30, 
                    // increment the used_count 
                    // accept the request by calling next
    await next()
  }
}

module.exports = RateLimit
