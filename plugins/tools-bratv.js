import axios from 'axios'
import fs from 'fs'
import { spawn } from 'child_process'
import exif from '../lib/exif.js'

const { writeExif } = exif

const fetchStickerVideo = async (text) => {
  const response = await axios.get(
    'https://skyzxu-brat.hf.space/brat-animated',
    {
      params: { text },
      responseType: 'arraybuffer'
    }
  )

  if (!response.data) {
    throw new Error('Error al obtener el video de la API.')
  }

  return response.data
}

const convertToWebp = (input, output) => {
  return new Promise((resolve, reject) => {
    spawn('ffmpeg', [
      '-i', input,
      '-vf',
      'scale=512:512:force_original_aspect_ratio=decrease,fps=15',
      '-loop', '0',
      '-ss', '0',
      '-t', '6',
      '-preset', 'default',
      '-an',
      '-vsync', '0',
      output
    ])
    .on('close', (code) => {
      if (code !== 0) reject(new Error('Error al convertir video'))
      else resolve(true)
    })
  })
}

let handler = async (m, { conn, args, command }) => {
  try {
    let text = m.quoted?.text || args.join(' ')

    if (!text) {
      return conn.reply(
        m.chat,
        'ᐢ. ֑ .ᐢ Por favor, responde a un mensaje o ingresa un texto para crear el sticker.',
        m
      )
    }

    await m.react('🕒')

    let user = globalThis.db?.data?.users?.[m.sender] || {}

    let texto1 = user.metadatos || 'Demitrabot'
    let texto2 = user.metadatos2 || 'Sticker'

    const videoBuffer = await fetchStickerVideo(text)

    const mp4File = `./tmp-${Date.now()}.mp4`
    const webpFile = `./tmp-${Date.now()}.webp`

    fs.writeFileSync(mp4File, videoBuffer)

    await convertToWebp(mp4File, webpFile)

    const sticker = await writeExif(
      {
        mimetype: 'image/webp',
        data: fs.readFileSync(webpFile)
      },
      {
        packname: 'Demitra BOT',
        author: 'Adara'
      }
    )

    await conn.sendMessage(
      m.chat,
      {
        sticker: fs.readFileSync(sticker)
      },
      { quoted: m }
    )

    fs.unlinkSync(mp4File)
    fs.unlinkSync(webpFile)
    if (fs.existsSync(sticker)) fs.unlinkSync(sticker)

    await m.react('✔️')

  } catch (e) {
    await m.react('✖️')
    return m.reply(
      `> Error en *${command}*\n> [${e.message}]`
    )
  }
}

handler.help = ['bratv']
handler.tags = ['sticker']
handler.command = ['bratv']

export default handler