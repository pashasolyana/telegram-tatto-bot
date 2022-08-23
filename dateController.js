const {Date, Time} = require('./models')

class DateController{
    async getTimes(date){

       const dateId = await Date.findOne({
            attributes: ['id'],
            where : {date : date}
        })

        const times = await Time.findOne({
            attributes: ['id', 'time'],
            where : {dateId : dateId.id}
        })    
      
        return {dateId : dateId.id , times :times.time, timesId : times.id}

    }

    async updateTimes(timesId, times){
      await Time.update({time : times},{
            where: {
                id: timesId
              }
        })
    }
    
}

module.exports = DateController