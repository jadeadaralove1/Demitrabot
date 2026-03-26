import { downloadMediaMessage } from '@whiskeysockets/baileys'

let handler = async (m, { conn }) => {
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || q.mimetype || ''

    if (!mime || !/webp/.test(mime)) {
        await m.react('🌸')
        return m.reply('💗 *Responde a un sticker* darling\~ para convertirlo en foto normal\n\nEjemplo: responde al sticker y escribe #toimg')
    }

    await m.react('🍬')

    try {
        let media = await downloadMediaMessage(q, 'buffer', {}, {
            reuploadRequest: conn.updateMediaMessage
        })

        await conn.sendMessage(m.chat, {
            image: media,
            caption: '> 𓈒  ׂ 🪼੭  ᮫   :  *Aquí tienes ૮(ˊ ᵔ ˋ)ა\n'
        }, { quoted: m })

        await m.react('💗')

    } catch (e) {
        console.error('❌ TOIMG ERROR:', e)
        await m.react('💔')
        m.reply('💔 Uy darling... este sticker se resistió un poquito\~\nPrueba con otro no me dejes sola 🌸')
    }
}

handler.help = ['toimg', 'toimage', 'img']
handler.tags = ['tools', 'stickers']
handler.command = ['toimg', 'toimage', 'img']

export default handler