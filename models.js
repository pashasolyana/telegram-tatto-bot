const Sequelize = require("sequelize");
const sequelize = new Sequelize("tattoo", "postgres", "1234", {
  dialect: "postgres"
});

const User = sequelize.define('User', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  age: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  phoneNumber: {
    type: Sequelize.STRING,
    allowNull: false
  },
  tgUserName: {
    type: Sequelize.STRING,
    allowNull: true
  }
});

const Master = sequelize.define('Master', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  description: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  instLink: {
    type: Sequelize.STRING,
    allowNull: false
  },
});

const Date = sequelize.define('Date', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  date: {
    type: Sequelize.DATEONLY,
    allowNull: false
  },
});

const Time = sequelize.define('Time', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  time: {
    type: Sequelize.ARRAY(Sequelize.STRING),
    allowNull: false
  },
  dateId: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  masterId: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
});

const Order = sequelize.define('Order', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement : true,
    primaryKey: true,
    allowNull: false
  },
  userId : {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  masterId: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  dateId : {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  time : {
    type: Sequelize.STRING,
    allowNull: false
  },
  individTatoo : {
    type: Sequelize.BOOLEAN,
    allowNull: false
  },
  tatooSize : {
    type: Sequelize.STRING,
    allowNull: true
  }
})

Time.hasMany(Date, {
  as : 'DateTime',
  foreignKey : 'dateId'
})
Date.belongsTo(Time, {
  foreignKey : 'dateId'
})

Time.hasMany(Master, {
  as : 'MasterTime',
  foreignKey : 'masterId'
})
Master.belongsTo(Time, {
  foreignKey : 'masterId'
})

Order.hasMany(Date, {
  as : 'DateOrder',
  foreignKey : 'dateId'
})
Date.belongsTo(Order, {
  foreignKey : 'dateId'
})

Order.hasMany(User, {
  as : 'UserOrder',
  foreignKey : 'userId'
})
User.belongsTo(Order, {
  foreignKey : 'userId'
})

Order.hasMany(Master, {
  as : 'masterOrder',
  foreignKey : 'masterId'
})
Master.belongsTo(Order, {
  foreignKey : 'masterId'
})

module.exports = { sequelize, User, Master, Date, Time, Order}