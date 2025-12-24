require('dotenv').config()
const { Telegraf, Markup } = require('telegraf')
const config = require('./config')

const bot = new Telegraf(process.env.BOT_TOKEN)

let round = { id:1, players:[], active:true, startedAt:Date.now() }

bot.start(ctx=>{
  ctx.reply(
    'SpinDraw TON\nEntry: '+config.ENTRY_AMOUNT+' TON\nPlayers: '+config.MAX_PLAYERS,
    Markup.inlineKeyboard([
      [Markup.button.callback('Join Draw','JOIN')],
      [Markup.button.callback('Status','STATUS')]
    ])
  )
})

bot.action('STATUS',ctx=>{
  ctx.answerCbQuery()
  ctx.reply('Players: '+round.players.length+'/'+config.MAX_PLAYERS)
})

bot.action('JOIN',ctx=>{
  ctx.answerCbQuery()
  if(round.players.find(p=>p.id===ctx.from.id)) return ctx.reply('Already joined')
  round.players.push({id:ctx.from.id,username:ctx.from.username||'anon'})
  ctx.reply('Entry reserved')
})

bot.launch()
console.log('SpinDraw bot running')
