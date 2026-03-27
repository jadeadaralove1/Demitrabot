import fs from 'fs'
import { spawn } from 'child_process'
import fetch from 'node-fetch'
import { Sticker, StickerTypes } from 'wa-sticker-formatter'
import { downloadMediaMessage } from '@whiskeysockets/baileys'

const isUrl = (text = '') => /https?:\/\//.test(text)

const buildFFmpegFilters = (effects) => {
  const W = 512
  const H = 512
  const filters = []

  filters.push(`scale=${W}:${H}:force_original_aspect_ratio=decrease`)
  filters.push(`pad=${W}:${H}:(ow-iw)/2:(oh-ih)/2:color=0x00000000`)
  filters.push('format=rgba')

  for (const effect of effects) {
    switch (effect) {
      case 'blur': filters.push('gblur=sigma=5'); break
      case 'sepia': filters.push('colorchannelmixer=.393:.769:.189:.349:.686:.168:.272:.534:.131'); break
      case 'sharpen': filters.push('unsharp=5:5:1.0'); break
      case 'brighten': filters.push('eq=brightness=0.05'); break
      case 'darken': filters.push('eq=brightness=-0.05'); break
      case 'invert': filters.push('negate'); break
      case 'grayscale': filters.push('hue=s=0'); break
      case 'rotate90': filters.push('transpose=1'); break
      case 'rotate180': filters.push('rotate=PI'); break
      case 'flip': filters.push('hflip'); break
      case 'flop': filters.push('vflip'); break
    }
  }

  filters.push('format=yuva420p')
  return filters.join(',')
}

let handler = async (m, { conn, args, command, prefix }) => {
  let q = m.quoted ? m.quoted : m
  let mime = (q.msg || q).mimetype || q.mimetype || ''

  if (args[0] === '-list') {
    return m.reply(`ꕥ Opciones disponibles:

✦ Formas:
-c círculo
-t triángulo
-s estrella
-r redondeado
-h hexágono
-d diamante
-v corazón

✧ Efectos:
-blur
-sepia
-sharpen
-brighten
-darken
-invert
-grayscale
-rotate90
-rotate180
-flip
-flop

Ejemplo:
${prefix + command} -blur Pack | Autor`)
  }

  if (!mime && !args.find(isUrl)) {
    return m.reply(`Responde a imagen/video o URL\n*${prefix + command}*`)
  }

  if (!/image|video/.test(mime) && !args.find(isUrl)) {
    return m.reply('Solo imagen, video o gif')
  }

  await m.react('🐞')

  try {
    let media

    const urlArg = args.find(isUrl)

    if (urlArg) {
      const res = await fetch(urlArg)
      media = Buffer.from(await res.arrayBuffer())
    } else {
      media = await downloadMediaMessage(q, 'buffer', {}, {
        reuploadRequest: conn.updateMediaMessage
      })
    }

    const effectArgs = {
      '-blur': 'blur',
      '-sepia': 'sepia',
      '-sharpen': 'sharpen',
      '-brighten': 'brighten',
      '-darken': 'darken',
      '-invert': 'invert',
      '-grayscale': 'grayscale',
      '-rotate90': 'rotate90',
      '-rotate180': 'rotate180',
      '-flip': 'flip',
      '-flop': 'flop'
    }

    const effects = args
      .filter(a => effectArgs[a])
      .map(a => effectArgs[a])

    let pack = global.packname || 'Demitra BOT'
    let author = global.author || '© Demitra BOT'

    if (effects.length > 0) {
      const input = `./tmp-${Date.now()}`
      const output = `./tmp-${Date.now()}.webp`

      fs.writeFileSync(input, media)

      await new Promise((resolve, reject) => {
        const ff = spawn('ffmpeg', [
          '-y',
          '-i',
          input,
          '-vf',
          buildFFmpegFilters(effects),
          '-c:v',
          'libwebp',
          '-q:v',
          '70',
          '-loop',
          '0',
          output
        ])

        ff.on('close', code => {
          if (code === 0) resolve()
          else reject(new Error('FFmpeg falló'))
        })
      })

      media = fs.readFileSync(output)

      fs.unlinkSync(input)
      fs.unlinkSync(output)
    }

    const sticker = new Sticker(media, {
      pack,
      author,
      type: StickerTypes.FULL,
      categories: ['🐞'],
      quality: 75
    })

    const buffer = await sticker.toBuffer()

    await conn.sendMessage(m.chat, { sticker: buffer }, { quoted: m })

    await m.react('🐞')

  } catch (e) {
    console.error(e)
    await m.react('😞')
    m.reply(`❌ Error:\n${e.message}`)
  }
}

handler.help = ['s', 'sticker']
handler.tags = ['stickers']
handler.command = ['s', 'sticker']

export default handler