import fetch from 'node-fetch'

let handler = async (m, { conn, args }) => {
  // ✅ Inicializar DB de usuarios
  global.db = global.db || {}
  global.db.data = global.db.data || {}
  global.db.data.users = global.db.data.users || {}
  const user = global.db.data.users[m.sender] ||= {}

  // Guardar estado AFK
  user.afk = Date.now()
  user.afkReason = args.join(' ') || 'Sin especificar!'

  // 📸 Preparar thumbnail
  let thumb = null
  try {
    thumb = await (await fetch("https://i.postimg.cc/rFfVL8Ps/image.jpg")).buffer()
  } catch {
    thumb = null
  }

  // 💎 Mensaje "Shadow" especial
  const shadow_xyz = {
    key: {
      remoteJid: "status@broadcast",
      fromMe: false,
      id: "ShadowCatalog",
      participant: "0@s.whatsapp.net"
    },
    message: {
      productMessage: {
        product: {
          productImage: thumb
            ? { mimetype: "image/jpeg", jpegThumbnail: thumb }
            : undefined,
          title: "WhatsApp Business • Estado",
          description: "Shadow team",
          currencyCode: "USD",
          priceAmount1000: 0,
          retailerId: "ShadowCore",
          productImageCount: 1
        },
        businessOwnerJid: "584242773183@s.whatsapp.net"
      }
    }
  }

  // 🧚‍♀️ Enviar mensaje AFK mencionando al usuario
  await conn.sendMessage(
    m.chat,
    {
      text: `🌌 *Discípulo de las Sombras*\nHas entrado en estado AFK.\n○ Motivo » *${user.afkReason}*`,
      mentions: [m.sender]
    },
    { quoted: shadow_xyz }
  )
}

handler.help = ['afk [razón]']
handler.tags = ['tools']
handler.command = ['afk']

export default handler