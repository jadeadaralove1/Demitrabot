import axios from 'axios'
import fs from 'fs'
import exif from '../lib/exif.js'

const { writeExif } = exif

let handler = async (m, { conn, args }) => {
  try {
    let textFinal = args.join(' ') || m.quoted?.text

    if (!textFinal) {
      return conn.reply(m.chat, '《✧》 Ingresa un texto para crear el sticker.', m)
    }

    let target = m.quoted ? m.quoted.sender : m.sender

    const pp = await conn.profilePictureUrl(target).catch(() =>
      'https://telegra.ph/file/24fa902ead26340f3df2c.png'
    )

    let nombre = m.quoted
  ? (m.quoted.pushName || m.quoted.name || 'Usuario')
  : (m.pushName || 'Usuario')

if (/^\d+$/.test(nombre)) nombre = 'Usuario'

    if (textFinal.length > 30) {
      await m.react('✖️')
      return conn.reply(
        m.chat,
        '੭୧ ᮫ ࿀ El texto no puede tener más de 30 caracteres.',
        m
      )
    }

    await m.react('🕒')

    const quoteObj = {
      type: 'quote',
      format: 'png',
      backgroundColor: '#000000',
      width: 512,
      height: 768,
      scale: 2,
      messages: [
        {
          entities: [],
          avatar: true,
          from: {
            id: 1,
            name: nombre,
            photo: { url: pp }
          },
          text: textFinal,
          replyMessage: {}
        }
      ]
    }

    const response = await axios.post(
      'https://bot.lyo.su/quote/generate',
      quoteObj,
      {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 15000
      }
    )

    const imageBase64 = response?.data?.result?.image

    if (!imageBase64) {
      throw new Error('La API no devolvió imagen válida')
    }

    const buffer = Buffer.from(imageBase64, 'base64')

    let user = globalThis.db?.data?.users?.[m.sender] || {}
    const name = user.name || m.sender.split('@')[0]

    let texto1 = user.metadatos || 'Demitrabots'
    let texto2 = user.metadatos2 || `@${name}`

    const tmpFile = `./tmp-${Date.now()}.webp`

    fs.writeFileSync(tmpFile, buffer)

    const sticker = await writeExif(
      { mimetype: 'image/webp', data: fs.readFileSync(tmpFile) },
      {
        packname: texto1,
        author: texto2
      }
    )

    await conn.sendMessage(
      m.chat,
      { sticker: fs.readFileSync(sticker) },
      { quoted: m }
    )

    fs.unlinkSync(tmpFile)
    fs.unlinkSync(sticker)

    await m.react('✔️')

  } catch (e) {
    await m.react('✖️')
    return m.reply(`> Error en *qc*\n> [${e.message}]`)
  }
}

handler.help = ['qc']
handler.tags = ['sticker']
handler.command = ['qc']

export default handler