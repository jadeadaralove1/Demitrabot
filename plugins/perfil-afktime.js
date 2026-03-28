let handler = async (m, { conn }) => {
  // ✅ FIX DB
  global.db = global.db || {}
  global.db.data = global.db.data || {}
  global.db.data.users = global.db.data.users || {}
  global.db.data.chats = global.db.data.chats || {}

  const chat = global.db.data.chats[m.chat] ||= {}
  const chatUsers = chat.users ||= {}
  const user = chatUsers[m.sender] ||= {}

  const formatTiempo = (ms) => {
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

  // ───── SALIR DE AFK ─────
  if (typeof user.afk === 'number' && user.afk > -1) {
    const ms = Date.now() - user.afk
    const tiempo = formatTiempo(ms)
    await conn.sendMessage(m.chat, { text:
      `🧚‍♀️ ❚ ❘ *${global.db.data.users[m.sender]?.name || 'Usuario'}*
╭━━━〔 ✦ AFK OFF ✦ 〕━━━⬣
┃ ⭐⃞░ Motivo » *${user.afkReason || 'sin especificar'}*
┃ ⏳ Tiempo » *${tiempo}*
╰━━━━━━━━━━━━━━━━⬣`
    }, { quoted: m })
    user.afk = -1
    user.afkReason = ''
  }

  // ───── DETECTAR MENCIONES ─────
  const mentioned = m.mentionedJid || []
  const quoted = m.quoted ? m.quoted.sender : null
  const jids = [...new Set([...mentioned, quoted].filter(j => j && j.endsWith('@s.whatsapp.net') && j !== 'status@broadcast'))]

  // ───── AVISO AFK ─────
  for (const jid of jids) {
    const target = chatUsers[jid]
    if (!target || typeof target.afk !== 'number' || target.afk < 0) continue
    const ms = Date.now() - target.afk
    const tiempo = formatTiempo(ms)
    await conn.sendMessage(m.chat, { text:
      `🧚‍♀️ ❚ ❘ *${global.db.data.users[jid]?.name || 'Usuario'}*
╭━━━〔 ✦ AFK ✦ 〕━━━⬣
┃ ⭐⃞░ Motivo » *${target.afkReason || 'sin especificar'}*
┃ ⏳ Tiempo » *${tiempo}*
╰━━━━━━━━━━━━━━⬣`
    }, { quoted: m })
  }
}

handler.before = true
export default handler