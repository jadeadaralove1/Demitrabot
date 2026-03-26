import fs from 'fs'
import { spawn } from 'child_process'
import fetch from 'node-fetch'
import exif from '../../lib/exif.js'

const { writeExif } = exif

let handler = async (m, { conn, args, prefix, command }) => {
  try {

    if (args[0] === '-list') {
      let helpText = `ꕥ Lista de Formas y Efectos Disponibles para *imagen*:\n\n✦ *Formas:*\n- -c : Círculo\n- -t : Triángulo\n- -s : Estrella\n- -r : Redondeado\n- -h : Hexágono\n- -d : Diamante\n- -f : Marco\n- -b : Borde\n- -w : Onda\n- -m : Espejo\n- -o : Octágono\n- -y : Pentágono\n- -e : Elipse\n- -z : Cruz\n- -v : Corazón\n- -x : Cover\n- -i : Contain\n\n✧ *Efectos:*\n- -blur -sepia -sharpen -brighten -darken -invert -grayscale -rotate90 -rotate180 -flip -flop -normalice -negate -tint\n\n> Ejemplo: *${prefix + command} -c -blur Pack | Autor*`
      return m.reply(helpText)
    }

    const quoted = m.quoted ? m.quoted : m
    const mime = (quoted.msg || quoted).mimetype || ''

    let user = global.db.data.users[m.sender] || {}
    let name = user.name || 'User'

    let texto1 = user.metadatos || `Demitrabot`
    let texto2 = user.metadatos2 || `@${name}`

    let urlArg = null
    let argsWithoutUrl = []

    for (let arg of args) {
      if (isUrl(arg)) urlArg = arg
      else argsWithoutUrl.push(arg)
    }

    let filteredText = argsWithoutUrl.join(' ').replace(/-\w+/g, '').trim()
    let marca = filteredText.split(/[\u2022|]/).map(v => v.trim())

    let pack = marca[0] || texto1
    let author = marca[1] || texto2

    const shapeArgs = { '-c':'circle','-t':'triangle','-s':'star','-r':'roundrect','-h':'hexagon','-d':'diamond','-f':'frame','-b':'border','-w':'wave','-m':'mirror','-o':'octagon','-y':'pentagon','-e':'ellipse','-z':'cross','-v':'heart','-x':'cover','-i':'contain' }

    const effectArgs = { '-blur':'blur','-sepia':'sepia','-sharpen':'sharpen','-brighten':'brighten','-darken':'darken','-invert':'invert','-grayscale':'grayscale','-rotate90':'rotate90','-rotate180':'rotate180','-flip':'flip','-flop':'flop','-normalice':'normalise','-negate':'negate','-tint':'tint' }

    const effects = []

    for (const arg of argsWithoutUrl) {
      if (shapeArgs[arg]) effects.push({ type:'shape', value:shapeArgs[arg] })
      else if (effectArgs[arg]) effects.push({ type:'effect', value:effectArgs[arg] })
    }

    const sendWebpWithExif = async (buffer) => {
      const media = { mimetype:'webp', data:buffer }
      const metadata = { packname:pack, author:author, categories:[''] }
      const stickerPath = await writeExif(media, metadata)

      await conn.sendMessage(m.chat, { sticker:{ url: stickerPath } }, { quoted: m })
      fs.unlinkSync(stickerPath)
    }

    const process = async (inputPath) => {
      const outputPath = `./tmp/sticker-${Date.now()}.webp`
      const vf = buildFFmpegFilters(effects)

      await new Promise((resolve, reject) => {
        const p = spawn('ffmpeg', ['-y','-i',inputPath,'-vf',vf,'-c:v','libwebp','-q:v','70','-loop','0',outputPath])
        p.on('close', code => code === 0 ? resolve() : reject())
      })

      const buffer = fs.readFileSync(outputPath)
      fs.unlinkSync(outputPath)

      await sendWebpWithExif(buffer)
    }

    // 📸 IMAGEN
    if (/image/.test(mime)) {
      let buffer = await quoted.download()
      const input = `./tmp/${Date.now()}.jpg`

      fs.writeFileSync(input, buffer)
      await process(input)
      fs.unlinkSync(input)

    // 🎥 VIDEO
    } else if (/video/.test(mime)) {

      if ((quoted.msg || quoted).seconds > 20) {
        return m.reply('《✧》 El video no puede ser muy largo')
      }

      let buffer = await quoted.download()
      const input = `./tmp/${Date.now()}.mp4`

      fs.writeFileSync(input, buffer)
      await process(input)
      fs.unlinkSync(input)

    // 🌐 URL
    } else if (urlArg) {

      const res = await fetch(urlArg)
      if (!res.ok) return m.reply('《✧》 No pude descargar ese archivo')

      const buffer = Buffer.from(await res.arrayBuffer())
      const input = `./tmp/${Date.now()}.jpg`

      fs.writeFileSync(input, buffer)
      await process(input)
      fs.unlinkSync(input)

    } else {
      return m.reply(`《✧》 Envía imagen/video o URL\n> Usa *${prefix + command} -list*`)
    }

  } catch (e) {
    m.reply(`❌ Error:\n${e.message}`)
  }
}

handler.command = ['sticker', 's']
handler.category = 'utils'

export default handler

// ======================

const isUrl = (text='') => /https?:\/\//.test(text)

const buildFFmpegFilters = (effects) => {
  let filters = ['scale=512:512:force_original_aspect_ratio=decrease','pad=512:512:(ow-iw)/2:(oh-ih)/2:color=0x00000000']

  for (let e of effects) {
    if (e.value === 'grayscale') filters.push('hue=s=0')
    if (e.value === 'invert') filters.push('negate')
    if (e.value === 'blur') filters.push('gblur=sigma=5')
  }

  filters.push('format=yuva420p')
  return filters.join(',')
}