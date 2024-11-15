const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios')
const jsdom = require('jsdom')
const { JSDOM } = jsdom

const proxyUrl = "https://cors-anywhere.herokuapp.com/"
let targetUrl = "https://www.vgtk.by/schedule/lessons/day-today.php"
let cache 

const API_KEY_BOT = '7651336513:AAFt_S28m0fG6wkbtvqAIkdDdw_zWsvLZ14'

const bot = new TelegramBot(API_KEY_BOT, {polling: true})
  bot.on('message', async (msg) => { 
  const chatId = msg.chat.id
  const text = msg.text

  if (text === '/start') {
    try {
      getLessons(proxyUrl + targetUrl)

      async function getLessons(url){
        const response = await axios.get(url, { headers: { 'X-Requested-With': 'XMLHttpRequest' } })
        const dom = new JSDOM(response.data);
        const tableElement = dom.window.document.querySelector('table')
        const date = tableElement.rows[0].cells[0].textContent.trim()
        if(cache != date){
          bot.sendMessage(chatId, "Появилось расписания" + date)
          cache = date
        } 
      }

      setInterval(() => {
        getLessons(proxyUrl + targetUrl)
      }, 3600000)

  } catch (error) {
   console.error("Ошибка:", error);
   bot.sendMessage(chatId, "Произошла ошибка при получении расписания.")
  }
 }
})
