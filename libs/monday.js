const rp = require('request-promise');

module.exports = {

    getDailySalary(number) {
        let day = new Date()
        let currentDay = day.getDate()
        
        return number*1.3 / currentDay
    } 
}
