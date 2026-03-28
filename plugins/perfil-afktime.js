import fetch from 'node-fetch'

/** Comando AFK */
export const afkHandler = async (m, { conn, args }) => {
  global.db = global.db || {}
  global.db.data = global.db.data || {}
  global.db.data.users = global.db.data.users || {}
  const user = global.db.data.users[m.sender] ||= {}

  // Guardar estado AFK
  user.afk = Date.now()
  user.afkReason = args.join(' ') || 'Sin especificar!'

  // Preparar thumbnail
  let thumb = null
  try {
    thumb = await (await fetch("https://i.postimg.cc/rFfVL8Ps/image.jpg")).buffer()
  } catch { thumb = null }

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
          productImage: thumb ? { mimetype: "image/jpeg", jpegThumbnail: thumb } : undefined,
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

  await conn.sendMessage(
    m.chat,
    {
      text: `🌌 *Discípulo de las Sombras*\nHas entrado en estado AFK.\n○ Motivo » *${user.afkReason}*`,
      mentions: [m.sender]
    },
    { quoted: shadow_xyz }
  )
}

afkHandler.help = ['afk [razón]']
afkHandler.tags = ['tools']
afkHandler.command = ['afk']

/** Handler BEFORE: desactiva AFK y avisa menciones */
export const afkBefore = async (m, { conn }) => {
  global.db = global.db || {}
  global.db.data = global.db.data || {}
  global.db.data.users = global.db.data.users || {}

  const user = global.db.data.users[m.sender] ||= {}

  const formatTiempo = ms => {
    if (typeof ms !== 'number' || isNaN(ms)) return 'desconocido'
    const h = Math.floor(ms / 3600000)
    const min = Math.floor((ms % 3600000) / 60000)
    const s = Math.floor((ms % 60000) / 1000)
    const parts = []
    if (h) parts.push(`${h} ${h === 1 ? 'hora' : 'horas'}`)
    if (min) parts.push(`${min} ${min === 1 ? 'minuto' : 'minutos'}`)
    if (s || (!h && !min)) parts.push(`${s} ${s === 1 ? 'segundo' : 'segundos'}`)
    return parts.join(' ')
  }

  // 🔹 Salir de AFK automáticamente
  if (typeof user.afk === 'number' && user.afk > -1) {
    const ms = Date.now() - user.afk
    const tiempo = formatTiempo(ms)
    await conn.sendMessage(m.chat, {
      text: `🌑 *Discípulo de las Sombras*\nHas regresado del AFK.\n○ Motivo » *${user.afkReason || 'sin especificar'}*\n○ Tiempo ausente » *${tiempo}*`,
      mentions: [m.sender]
    }, { quoted: m })

    user.afk = -1
    user.afkReason = ''
  }

  // 🔹 Avisar si menciona a alguien AFK
  const mentionedJid = Array.isArray(m.mentionedJid) ? m.mentionedJid : []
  const quoted = m.quoted?.sender ? [m.quoted.sender] : []
  const jids = [...new Set([...mentionedJid, ...quoted].filter(j => j && j.endsWith('@s.whatsapp.net') && j !== 'status@broadcast'))]

  for (const jid of jids) {
    const target = global.db.data.users[jid]
    if (!target || typeof target.afk !== 'number' || target.afk < 0) continue

    const ms = Date.now() - target.afk
    const tiempo = formatTiempo(ms)

    await conn.sendMessage(m.chat, {
      text: `🌌 *Invocación Sombría*\nEl usuario *${await conn.getName(jid)}* está AFK.\n○ Motivo: ${target.afkReason || 'sin especificar'}\n○ Tiempo ausente: *${tiempo}*`,
      mentions: [jid]
    }, { quoted: m })
  }
}