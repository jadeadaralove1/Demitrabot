import fs from 'fs'
import { spawn } from 'child_process'
import fetch from 'node-fetch'
import { Sticker, StickerTypes } from 'wa-sticker-formatter'
import { downloadMediaMessage } from '@whiskeysockets/baileys'

const isUrl = (text = '') => /https?:\/\//.test(text)

const buildFFmpegFilters = (effects) => {
    let filters = [
        'scale=512:512:force_original_aspect_ratio=decrease',
        'pad=512:512:(ow-iw)/2:(oh-ih)/2:color=0x00000000'
    ]

    for (let e of effects) {
        if (e.value === 'grayscale') filters.push('hue=s=0')
        if (e.value === 'invert') filters.push('negate')
        if (e.value === 'blur') filters.push('gblur=sigma=5')
    }

    filters.push('format=yuva420p')
    return filters.join(',')
}

let handler = async (m, { conn, args, prefix, command }) => {
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || q.mimetype || ''

    if (!fs.existsSync('./tmp')) fs.mkdirSync('./tmp')

    const shapeArgs = {
        '-c':'circle',
        '-t':'triangle',
        '-s':'star',
        '-r':'roundrect',
        '-h':'hexagon',
        '-d':'diamond',
        '-f':'frame',
        '-b':'border',
        '-w':'wave',
        '-m':'mirror',
        '-o':'octagon',
        '-y':'pentagon',
        '-e':'ellipse',
        '-z':'cross',
        '-v':'heart',
        '-x':'cover',
        '-i':'contain'
    }

    const effectArgs = {
        '-blur':'blur',
        '-invert':'invert',
        '-grayscale':'grayscale'
    }

    if (args[0] === '-list') {
        return m.reply(`♡ Lista disponible:

Formas:
- -c círculo
- -t triángulo
- -s estrella
- -r redondeado
- -h hexágono
- -d diamante
- -v corazón

Efectos:
- -blur
- -invert
- -grayscale

Ejemplo:
${prefix + command} -c -blur Pack | Autor`)
    }

    if (!mime && !args.find(isUrl)) {
        return m.reply(`Responde una imagen/video o manda URL`)
    }

    await m.react('🪻')

    try {
        let media

        let urlArg = args.find(isUrl)

        if (urlArg) {
            let res = await fetch(urlArg)
            media = Buffer.from(await res.arrayBuffer())
        } else {
            media = await downloadMediaMessage(q, 'buffer', {}, {
                reuploadRequest: conn.updateMediaMessage
            })
        }

        let effects = []
        let shape = null

        for (let arg of args) {
            if (shapeArgs[arg]) shape = shapeArgs[arg]
            if (effectArgs[arg]) effects.push({ value: effectArgs[arg] })
        }

        let packText = args.join(' ').replace(/-\w+/g, '').trim()
        let split = packText.split('|').map(v => v.trim())

        let pack = split[0] || global.packname || 'Demitra bot'
        let author = split[1] || global.author || '© Demitra bot'

        let finalBuffer = media

        if (effects.length > 0) {
            const input = `./tmp/${Date.now()}.jpg`
            const output = `./tmp/${Date.now()}.webp`

            fs.writeFileSync(input, media)

            const vf = buildFFmpegFilters(effects)

            await new Promise((resolve, reject) => {
                const ff = spawn('ffmpeg', [
                    '-y',
                    '-i', input,
                    '-vf', vf,
                    '-c:v', 'libwebp',
                    '-q:v', '70',
                    '-loop', '0',
                    output
                ])

                ff.on('close', code => {
                    if (code === 0) resolve()
                    else reject(new Error('FFmpeg falló'))
                })
            })

            finalBuffer = fs.readFileSync(output)

            fs.unlinkSync(input)
            fs.unlinkSync(output)
        }

        const sticker = new Sticker(finalBuffer, {
            pack,
            author,
            type: StickerTypes.FULL,
            categories: ['🐞'],
            quality: 75,
            ...(shape ? { background: 'transparent', crop: shape } : {})
        })

        const buffer = await sticker.toBuffer()

        await conn.sendMessage(m.chat, { sticker: buffer }, { quoted: m })
        await m.react('🐞')

    } catch (e) {
        console.error('❌ STICKER ERROR:', e)
        await m.react('😞')
        m.reply(`❌ Error:\n${e.message}`)
    }
}

handler.help = ['s', 'sticker']
handler.tags = ['stickers']
handler.command = ['s', 'sticker']

export default handler