const { sequelize, User, Master, Order} = require('./models')

class UserController {
    async createUser(name, age, phoneNumber, tgUserName){
       const result = await User.create({
            name : name,
            age : age,
            phoneNumber : phoneNumber,
            tgUserName : tgUserName
        })
        return result.id
    }

    async getMasters(){
        const result = await Master.findAll({raw:true})
        return result;
    }

    async getMasterId(name){
        const result = await Master.findOne({
            attributes: ['id'],
            where : {name : name}
        })
        return result.id;
    }

    async createOrder(userId, masterId, dateId, time, individTatoo, tatooSize){
        Order.create({
            userId : userId ,
            masterId : masterId,
            dateId : dateId ,
            time : time,
            individTatoo : individTatoo,
            tatooSize : tatooSize
        })
    }
}

module.exports = UserController;