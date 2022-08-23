const { Scenes, session, Telegraf, Markup } = require('telegraf');
const Calendar = require('telegraf-calendar-telegram')
const token = "5298892699:AAEbpWZZ5hy3BdB25wkJsDSoH_yqwyPNY5o"
const bot = new Telegraf(token);
const { sequelize, User, Master, Date, Time,tatooPics, Order} = require('./models')

const calendar = new Calendar(bot, {
    startWeekDay: 1,
    weekDayNames: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
    monthNames: [
        'Январь',
        'Февраль',
        'Март',
        'Апрель',
        'Май',
        'Июнь',
        'Июль',
        'Август',
        'Сентябрь',
        'Октябрь',
        'Ноябрь',
        'Декабрь'
    ]
})


const SceneGenerator = require('./Scenes')
const currScene = new SceneGenerator(calendar);
const ageScene = currScene.GenEntryScene()
const nameScene = currScene.GenNameScene()
const masterScene = currScene.genMasterScene()
const tatooSizeScene = currScene.genTatooSizeScene()
const designScene = currScene.genDesignScene()
const dateScene = currScene.getDateScene()
const phoneScene = currScene.genPhoneScene()
const orderScene = currScene.genOrderScene()

const stage = new Scenes.Stage([ageScene, nameScene, masterScene, tatooSizeScene, designScene, dateScene,phoneScene,orderScene])
bot.use(session())
bot.use(stage.middleware())


sequelize.sync()
bot.start(async (ctx) => {
    try {
        return await ctx.reply('Добро пожаловать в бота для записи на сеанс тату!😊 Пожалуйста используйте команду /info, чтобы получить информацию о нашей студии. Для записи на сеанс используйте команду /booked', Markup.keyboard([
            ["/info"], ["/booked"]
        ]).oneTime().resize())
    } catch (error) {
        console.log(error)
    }
})
bot.command('booked', async (ctx) => {
    ctx.scene.enter('entry')
})

bot.command('/info', async (ctx) => {
    ctx.reply('Тут должна быть информация о салоне.')
})

bot.launch()

