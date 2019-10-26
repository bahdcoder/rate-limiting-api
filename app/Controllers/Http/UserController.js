'use strict'

const Redis = use('Redis')
const Format = use('date-fns/format')

class UserController {
    async login({ auth, request }) {
        const { email, password } = request.all()

        let user = await auth.validate(email, password, true)
        const jwt = await auth.generate(user)

        await Redis.set(jwt.token, JSON.stringify({
            first_used: Format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
            used_count: 0
        }))

        return  {
            jwt,
            user
        }
    }
}

module.exports = UserController
