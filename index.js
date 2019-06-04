addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request))
})

/** Example endpoints and expected results */
const ENDPOINTS = [
    { type: 'BTC', url: 'https://api.coinbase.com/v2/prices/BTC-USD/spot' },
    { type: 'ETH', url: 'https://api.coinbase.com/v2/prices/ETH-USD/spot' },
    { type: 'LTC', url: 'https://api.coinbase.com/v2/prices/LTC-USD/spot' },
]

const fromAPIResult = [
    { data: { base: 'BTC', amount: '7586.0' } },
    { data: { base: 'ETH', amount: '236.435' } },
    { data: { base: 'LTC', amount: '99.875' } },
]
const endResult = [
    { type: 'BTC', amount: '7586.0' },
    { type: 'ETH', amount: '236.435' },
    { type: 'LTC', amount: '99.875' },
]

/**
 * Fetch a single request to an endpoint and parse out the needed JSON objects.
 * Whatever API you use will need to parse out different objects
 *
 * e.g. in this example we expect the API for coinbase to return json
 * in the form typeof fromAPIResult above
 * @param {string} endpoint
 */
async function fetchEndpoint(endpoint) {
    const res = await fetch(endpoint.url)
    const json = await res.json()
    const currency = json.data
    return {
        base: currency.base,
        amount: currency.amount,
    }
}

/**
 * Make multiple requests to different API endpoints, aggregate the responses
 * and send it back as a single response.
 * @param {Request} request
 * @param {*} endpoints
 */
async function fetchResponses(request, endpoints) {
    const responses = await Promise.all(endpoints.map(fetchEndpoint))
    const responseInit = {
        headers: { 'Content-Type': 'application/json' },
    }

    return new Response(JSON.stringify(responses), responseInit)
}

async function handleRequest(request) {
    return fetchResponses(request, ENDPOINTS)
}
