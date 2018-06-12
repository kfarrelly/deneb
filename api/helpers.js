// ...
const
    axios = require("axios"),
    bcrypt = require("bcrypt"),
    config = require("../config.js"),
    postgresp = require("pg-promise")({}),
    toolbox = require("@xcmats/js-toolbox")




// ...
let db = postgresp(config.attributes.connectionStr)





// ...
const errorMessageToRetCode = function (message) {
    let errorCode = null
    switch (true) {
        case (message.match(/duplicate key/) !== null):
            errorCode = 409
            break

        default:
            errorCode = 500
            break
    }
    return errorCode
}




// ...
const btoh = function (bcryptHash) {
    return new Buffer(bcryptHash, "ascii").toString("hex")
}




// ...
const htob = function (hexString) {
    return new Buffer(hexString, "hex").toString("ascii")
}




// ...
const apiKeyValid = function (hashedApiKey) {
    return bcrypt.compareSync(config.attributes.apiKey, hashedApiKey)
}




// ...
const fetchCMC = function (base="stellar", quot="eur") {
    return axios.get(`https://api.coinmarketcap.com/v1/ticker/${base}/?convert=${quot}`)
        .then((response) => {
            return {
                data: toolbox.head(response.data),
            }
        })
        .catch((error) => {
            throw new Error(JSON.stringify({
                status: error.response.status,
                statusText: error.response.statusText,
            }))
        })
}




// ...
const tokenIsValid = function (token, userId) {
    const tokenASCII = new Buffer(token, "base64").toString("ascii")
    return bcrypt.compareSync(
        `${config.attributes.apiKey}${userId}`, tokenASCII
    )
}




// ...
const getApiKey = function () {
    return config.attributes.apiKey
}




// ...
module.exports = {
    fetchCMC: fetchCMC,
    db: db,
    tokenIsValid: tokenIsValid,
    getApiKey: getApiKey,
    apiKeyValid,
    btoh,
    htob,
    errorMessageToRetCode,
}
