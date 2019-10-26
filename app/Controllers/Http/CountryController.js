'use strict'

const Axios = use('axios')
const Config = use('Config')

class CountryController {
    constructor() {
        this.countriesApiUrl = 'https://restcountries.eu/rest/v2/name'

        this.exchangeRatesApiUrl = 'http://data.fixer.io/api/latest'

        this.exchangeAccessKey = Config.get('app.exchangeKey')
    }

    async search({ auth, request, response }) {
        // fetch countries
        const { search } = request.all()

        if (! search) {
            return response.badRequest('Invalid search parameter.')
        }

        try {
            const { data } = await Axios.get(`${this.countriesApiUrl}/${search}`)

            const country = data[0]

            if (! country) 
                throw new Error(`Country not found ${search}`)

            const currencies = country.currencies.map(currency => currency.code).join(',')

            const { data: exchangeData } = await Axios.get(`${this.exchangeRatesApiUrl}?access_key=${this.exchangeAccessKey}&base=EUR&symbols=${currencies}`)
        
            return {
                fullName: country.name,
                currencies: country.currencies,
                population: country.population,
                exchangeRates: exchangeData.rates
            }

        } catch (error) {
            return response.badRequest({
                message: `Error fetching country: ${search}`,
                error
            })
        }
    }
}

module.exports = CountryController
