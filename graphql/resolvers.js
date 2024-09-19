const { text } = require("express")

module.exports = {
    hello(){
        return{
            text: 'Hello World!',
            views: 1245
        }
    }
}