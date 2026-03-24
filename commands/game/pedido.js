import axios from 'axios'
import { generateWAMessageFromContent } from '@whiskeysockets/baileys'

async function sendCustomPedido(m, conn, texto) {
  try {
    const img = 'https://files.catbox.moe/j93ra6.jpeg'
    const res = await axios.get(img, { responseType: 'arraybuffer' })
    const imgBuffer = Buffer.from(res.data)

    const orderMessage = {
      orderId: 'FAKE-' + Date.now(),
      thumbnail: imgBuffer,
      itemCount: 1, // fijo (WhatsApp lo requiere)
      status: 1,
      surface: 1,
      message: texto,
      orderTitle: 'Pedido enviado por catálogo',
      token: null,
      sellerJid: null,
      totalAmount1000: '0',
      totalCurrencyCode: 'USD',
      contextInfo: {
        externalAdReply: {
          title: 'WhatsApp Business • Estado',
          body: 'Contacto: Bot',
          thumbnailUrl: img,
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    }

    const msg = generateWAMessageFromContent(
      m.chat,
      { orderMessage },
      { quoted: m }
    )

    await conn.relayMessage(m.chat, msg.message, {
      messageId: msg.key.id
    })

  } catch (err) {
    console.error(err)
    await conn.sendMessage(
      m.chat,
      { text: '⚠️ Error enviando el pedido.' },
      { quoted: m }
    )
  }
}

export default {
  command: ['pedido'],
  tags: ['tools'],
  help: ['pedido <mensaje>'],

  run: async (conn, m, args) => {

    const texto = args.join(' ')

    if (!texto) {
      return await conn.sendMessage(
        m.chat,
        { text: '「🗒️」 Usa: `.pedido mensaje`\n🌻 `` . . . .Ejemplo: `.pedido hola`' },
        { quoted: m }
      )
    }

    await sendCustomPedido(m, conn, texto.trim())
  }
}