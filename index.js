// 引用 linebot 套件
import linebot from 'linebot'
// 引用 dotenv 事件
import dotenv from 'dotenv'
// 引用 request 套件
import rp from 'request-promise'

// 讀取 .env 檔
dotenv.config()

const bot = linebot({
  channelId: process.env.CHANNEL_ID,
  channelSecret: process.env.CHANNEL_SECRET,
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
})

let re = []
let msg = ''
let img = ''
let msgerror = ''
const animal = async (word) => {
  try {
    const data = await rp({ uri: 'https://data.coa.gov.tw/Service/OpenData/TransService.aspx?UnitId=QcbUEzN6E6DL', json: true })

    for (let i = 0; i < 1; i++) {
      const number = Math.floor(Math.random() * data.length)

      if (data[number].animal_kind.includes(word) || data[number].animal_place.includes(word)) {
        console.log('0')
        msg = {
          type: 'text',
          text: '品種：' + data[number].animal_kind + '\n' + '性別：' + data[number].animal_sex + '\n' + '毛色：' + data[number].animal_colour + '\n' + '收容所：' + data[number].animal_place + '\n' + '電話：' + data[number].shelter_tel
        }

        img = {
          type: 'image',
          originalContentUrl: data[number].album_file,
          previewImageUrl: data[number].album_file
        }
      } else {
        i--
      }
    }
  } catch (error) {
    msg = '發生錯誤'
  }
  re = [msg, img]
  return re
}

// 當收到訊息時
bot.on('message', async (event) => {
  if (event.message.type === 'text') {
    re = await animal(event.message.text)
    event.reply(re)
    console.log(re)
  } else {
    msgerror = {
      type: 'text',
      text: '📍搜尋品種\n請輸入「狗」或「貓」\n 📍搜尋地區\n請輸入地區名\n \n因相關資料較多，請耐心等候回覆😘😘😘'
    }
    event.reply(msgerror)

    console.log(msgerror)
  }
})

// 在 port 啟動
bot.listen('/', process.env.PORT, () => {
  console.log('機器人已啟動')
})
