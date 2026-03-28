let handler = async (m, { conn, args, usedPrefix, command }) => {
  // Inicializar DB
  global.db = global.db || {}
  global.db.data = global.db.data || {}
  global.db.data.users = global.db.data.users || {}
  global.db.data.chats = global.db.data.chats || {}
  const chat = global.db.data.chats[m.chat] ||= {}
  const chatUsers = chat.users ||= {}
  const userData = chatUsers[m.sender] ||= {}
  const userGlobal = global.db.data.users[m.sender] ||= {}

  const formatTiempo = ms => {
    if (!ms) return '0 segundos'
    const h = Math.floor(ms / 3600000)
    const m = Math.floor((ms % 3600000) / 60000)
    const s = Math.floor((ms % 60000) / 1000)
    const parts = []
    if (h) parts.push(`${h} ${h===1?'hora':'horas'}`)
    if (m) parts.push(`${m} ${m===1?'minuto':'minutos'}`)
    if (s || (!h && !m)) parts.push(`${s} ${s===1?'segundo':'segundos'}`)
    return parts.join(' ')
  }

  // ------------------ COMANDO AFK ------------------
  if (command === 'afk') {
    userData.afk = Date.now()
    userData.afkReason = args.join(' ') || 'Sin Especificar!'
    userGlobal.afk = userData.afk
    userGlobal.afkReason = userData.afkReason

    await conn.sendMessage(m.chat, {
      text: `🪄  ❚ ❘ El Usuario *${userGlobal.name || m.sender}* estará AFK.\n> ⭐⃞░ Motivo » *${userData.afkReason}*`,
      mentions: [m.sender]
    }, { quoted: m })
    return
  }

  // ------------------ SALIR DE AFK ------------------
  if (userData.afk && userData.afk > -1) {
    const tiempo = formatTiempo(Date.now() - userData.afk)
    await conn.sendMessage(m.chat, {
      text: `ꕥ *${userGlobal.name || m.sender}* Dejaste de estar inactivo.\n> ○ Motivo » *${userData.afkReason || 'sin especificar'}*\n> ○ Tiempo inactivo » *${tiempo}*`,
      mentions: [m.sender]
    }, { quoted: m })
    userData.afk = -1
    userData.afkReason = ''
    userGlobal.afk = -1
    userGlobal.afkReason = ''
  }

  // ------------------ AVISO DE MENCIONES ------------------
  const mentioned = m.mentionedJid || []
  const quoted = m.quoted ? [m.quoted.sender] : []
  const jids = [...new Set([...mentioned, ...quoted].filter(j => j && j.endsWith('@s.whatsapp.net') && j !== 'status@broadcast'))]

  for (const jid of jids) {
    const target = chatUsers[jid] || global.db.data.users[jid]
    if (!target || !target.afk || target.afk < 0) continue

    const tiempo = formatTiempo(Date.now() - target.afk)
    await conn.sendMessage(m.chat, {
      text: `ꕥ El usuario *${global.db.data.users[jid]?.name || jid}* está AFK.\n> ○ Motivo » *${target.afkReason || 'sin especificar'}*\n> ○ Tiempo inactivo » *${tiempo}*`,
      mentions: [jid]
    }, { quoted: m })
  }
}

handler.help = ['afk']
handler.tags = ['fun']
handler.command = ['afk']
handler.before = true
export default handler