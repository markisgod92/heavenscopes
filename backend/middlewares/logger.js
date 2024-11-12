const logger = (req, res, next) => {
	const {url, ip, method} = req
    const now = new Date().toISOString()

	console.log(`[${now}] ${method} request to ${url} from ip ${ip}.`)
    
	next()
}

module.exports = logger