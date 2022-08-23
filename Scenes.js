const { Scenes, Markup } = require("telegraf")
const DateController = require('./dateController')
const dateCon = new DateController()
const UserController = require('./userController')
const userCon = new UserController()

class ScenesGenerator {

    constructor(calendar) {
        this.calendar = calendar
    }

    age;
    name;
    phone;
    masterName;
    size;
    individ;
    username;
    times;
    choosenTime;
    choosenDate;
    timesId;
    dateId;
    masterId;
    userId;
    page = 0;
    count = 10;
    mastersInfo = [];

    GenEntryScene() {
        const entry = new Scenes.BaseScene('entry');
        entry.enter(async (ctx) => {
            await ctx.reply('Решился делать тату? Давай сначала узнаем твой возраст :), пожалуйста напиши сколько тебе лет.');
        });
        entry.on('text', async (ctx) => {
            this.username = ctx.update.message.from.username
            const currAge = Number(ctx.message.text)
            if (currAge && currAge > 0) {
                this.age = currAge;
                await ctx.reply('Спасибо.Если вам меньше 18 лет, лучше прийти с родителями.');
                ctx.scene.enter('name')
            } else {
                await ctx.reply('Пожалуйста, укажите ваш возраст корректно.')
            }
        });
        entry.on('message', async (ctx) => {
            await ctx.reply('Пожалуйста, укажите ваш возраст корректно.');
        })
        return entry;
    }

    GenNameScene() {
        const name = new Scenes.BaseScene('name');
        name.enter(async (ctx) => {
            await ctx.reply('Как мне к вам обращаться?');
        });
        name.on('text', async (ctx) => {
            const currName = ctx.message.text
            if (currName) {
                this.name = currName
                await ctx.reply(`Приятно познакомиться, ${currName}`);
                ctx.scene.enter('phone')
            } else {
                await ctx.reply('Я так и не понял как тебя зовут :(');
                ctx.scene.reenter();
            }
        })
        return name;
    }

    genPhoneScene() {
        const phone = new Scenes.BaseScene('phone');
        phone.enter(async (ctx) => {
            await ctx.reply('Укажите пожалуйста ваш контактный номер');
        });
        phone.on('text', async (ctx) => {
            const currPhone = ctx.message.text
            if (currPhone) {
                this.phone = currPhone
                ctx.scene.enter('master')
            } else {
                await ctx.reply('Попробуйте еще раз.');
                ctx.scene.reenter();
            }
        })
        return phone;
    }

    genMasterScene() {
        const master = new Scenes.BaseScene('master');
        let isButton = false;
        master.enter(async (ctx) => {
            await ctx.reply('Вы уже выбрали мастера?', Markup.inlineKeyboard([
                Markup.button.callback('Да', 'yes'),
                Markup.button.callback('Нет', 'no')
            ]))
        })
        master.action('yes', async (ctx) => {
            await ctx.reply('Пожалуйста введите имя выбранного вами мастера');
            isButton = true;
            ctx.answerCbQuery()
        })
        master.action('no', async (ctx) => {
            await ctx.reply('Ниже предоставлен список мастеров, пожалуйста выберите одного и напишите его имя.')
            const res = await userCon.getMasters()
            for (let i = 0; i < res.length; i++) {
                this.mastersInfo.push([res[i].name + ' ' + res[i].description, res[i].instLink])
            }
            this.count = res.length
            isButton = true;
            let markup = Markup.inlineKeyboard([
                [Markup.button.url('❤️', this.mastersInfo[this.page][1])],
                [Markup.button.callback(`${this.page + 1}/${this.count}`, ' '), Markup.button.callback('Вперед', `next-page`)]
            ]).resize()
            await ctx.reply(this.mastersInfo[this.page][0], markup)
            ctx.answerCbQuery()
        })
        master.action('next-page', async (ctx) => {
            if (this.page + 1 < this.count) {
                this.page = this.page + 1
                let markup = Markup.inlineKeyboard([
                    [Markup.button.url('❤️', this.mastersInfo[this.page][1])],
                    [Markup.button.callback('Назад', `back-page`), Markup.button.callback(`${this.page + 1}/${this.count}`, ' '), Markup.button.callback('Вперед', `next-page`)]
                ])
                await ctx.editMessageText(this.mastersInfo[this.page][0], markup)
                ctx.answerCbQuery()
            }
            if (this.page + 1 == this.count) {
                let markup = Markup.inlineKeyboard([
                    [Markup.button.url('❤️', this.mastersInfo[this.page][1])],
                    [Markup.button.callback('Назад', `back-page`), Markup.button.callback(`${this.page + 1}/${this.count}`, ' ')]
                ])
                await ctx.editMessageText(this.mastersInfo[this.page][0], markup)
                ctx.answerCbQuery()
            }
        })

        master.action('back-page', async (ctx) => {
            if (this.page + 1 > 1) {
                this.page = this.page - 1
                let markup = Markup.inlineKeyboard([
                    [Markup.button.url('❤️', this.mastersInfo[this.page][1])],
                    [Markup.button.callback('Назад', `back-page`), Markup.button.callback(`${this.page + 1}/${this.count}`, ' '), Markup.button.callback('Вперед', `next-page`)]
                ])
                await ctx.editMessageText(this.mastersInfo[this.page][0], markup)
                ctx.answerCbQuery()
            }
            if (this.page + 1 == 1) {
                let markup = Markup.inlineKeyboard([
                    [Markup.button.url('❤️', this.mastersInfo[this.page][1])],
                    [Markup.button.callback(`${this.page + 1}/${this.count}`, ' '), Markup.button.callback('Вперед', `next-page`)]
                ])
                await ctx.editMessageText(this.mastersInfo[this.page][0], markup)
                ctx.answerCbQuery()
            }

        })
        master.on('text', async (ctx) => {
            if (isButton) {
                const currMaster = ctx.message.text;
                if (currMaster) {
                    this.masterId = await userCon.getMasterId(currMaster)
                    this.masterName = currMaster
                    await ctx.reply(`Хорошо, идем дальше.`)
                    ctx.scene.enter('tatooSize')
                } else {
                    await ctx.reply('Введите корректное имя мастера.');
                    ctx.scene.reenter();
                }
            } else {
                await ctx.reply('Пожалуйста, нажмите на одну из двух кнопок.');
            }
        })
        return master;
    }

    genTatooSizeScene() {
        const tatooSize = new Scenes.BaseScene('tatooSize');
        tatooSize.enter(async (ctx) => {
            await ctx.reply('Укажите желаемый размер тату.', Markup.inlineKeyboard([
                Markup.button.callback('Большая', 'big'),
                Markup.button.callback('Средняя', 'middle'),
                Markup.button.callback('Маленькая', 'little')
            ]))
        });
        tatooSize.action('big', async (ctx) => {
            this.size = 'Большая'
            ctx.scene.enter('design');
            ctx.answerCbQuery()
        })
        tatooSize.action('middle', async (ctx) => {
            this.size = 'Средняя'
            ctx.scene.enter('design');
            ctx.answerCbQuery()
        })
        tatooSize.action('little', async (ctx) => {
            this.size = 'Маленькая'
            ctx.scene.enter('design');
            ctx.answerCbQuery()
        })
        tatooSize.on('text', async (ctx) => {
            await ctx.reply('Пожалуйста, нажмите на одну из двух кнопок.');
        })
        return tatooSize;
    }

    genDesignScene() {
        const design = new Scenes.BaseScene('design');
        design.enter(async (ctx) => {
            await ctx.reply('У вас есть готовый эскиз или вы хотите чтобы мастер нарисовал индивидуальный эскиз?', Markup.inlineKeyboard([
                Markup.button.callback('Готовый', 'prepared'),
                Markup.button.callback('Индивидуальный', 'individ')
            ]))
        });
        design.action('prepared', async (ctx) => {
            await ctx.reply('Хорошо, отправите его мастеру.');
            ctx.scene.enter('date');
            this.individ = false;
            ctx.answerCbQuery()
        })
        design.action('individ', async (ctx) => {
            await ctx.reply('Хорошо, мастер нарисует индивидуальный эскиз, специально для вас :)');
            ctx.scene.enter('date');
            this.individ = true
            ctx.answerCbQuery()
        })
        return design;
    }

    getDateScene() {
        const date = new Scenes.BaseScene('date');
        date.enter(async (ctx) => {
            ctx.reply("Пожалуйста, выберите желаемую дату.", this.calendar.getCalendar());
            this.calendar.setDateListener(async (ctx, date) => {
                const result = await dateCon.getTimes(date)
                this.times = result.times
                this.dateId = result.dateId
                this.timesId = result.timesId
                const keyboard = []
                for (let i = 0; i < this.times.length; i++) {
                    keyboard.push([{ text: this.times[i], callback_data: `button:${i}` }])
                }
                await ctx.reply(`Вы выбрали дату: ${date} , пожалуйста ознакомьтесь с доступными временными промежутками.`, { reply_markup: { inline_keyboard: keyboard } })
                this.choosenDate = date;
            })
        });
        date.action(/^button:([0-9]+)$/, async (ctx) => {
            const timeIndex = ctx.match[1]
            this.choosenTime = this.times[timeIndex]
            this.times.splice(timeIndex, 1)
            ctx.answerCbQuery()
            ctx.scene.enter('order');
        })
        return date;
    }

    genOrderScene() {
        const order = new Scenes.BaseScene('order');
        order.enter(async (ctx) => {
            await ctx.reply(`Давайте подведем итоги :) Данные ниже корректные?
        Имя: ${this.name}
        Возраст : ${this.age}
        Номер телефона : ${this.phone}
        Имя выбранного мастера: ${this.masterName}
        Размер тату: ${this.size}
        Эскиз : обсуждается лично с мастером.
        Дата : ${this.choosenDate}
        Время: ${this.choosenTime}
           `, Markup.inlineKeyboard([
                Markup.button.callback('Да', 'yes'),
                Markup.button.callback('Нет', 'no')
            ]))
        });
        order.action('yes', async(ctx) =>{
            const userId = await userCon.createUser(this.name, this.age, this.phone, this.username)
            await userCon.createOrder(userId, this.masterId, this.dateId, this.choosenTime, this.individ, this.tatooSize);
            await dateCon.updateTimes(this.timesId, this.times)
            ctx.reply('Ожидайте, скоро с вами свяжется мастер')
            ctx.answerCbQuery()
            ctx.scene.leave();
        })
        order.action('no', async(ctx) =>{
            ctx.answerCbQuery()
            ctx.scene.enter('entry');
        })
        return order;
    }

    getAllInfo() {
        console.log(this.name)
        console.log(this.masterName)
        console.log(this.age)
    }
}

module.exports = ScenesGenerator;