let handler = async (m, { conn }) => {
  // ✅ FIX DB
  global.db = global.db || {}
  global.db.data = global.db.data || {}
  global.db.data.users = global.db.data.users || {}
  global.db.data.chats = global.db.data.chats || {}

  const mentioned = m.mentionedJid || []
  const userId = mentioned[0] || (m.quoted ? m.quoted.sender : m.sender)

  const globalUsers = global.db.data.users || {}
  const user2 = globalUsers[userId] || {}

  // Inicializar usuario si no existe
  if (!user2.name) {
    globalUsers[userId] = { name: 'Sin nombre', description: '', genre: '', pasatiempo: 'No definido', level: 0, exp: 0 }
  }

  const user = globalUsers[userId]

  const botId = conn.user.jid
  const settings = global.db.data.settings?.[botId] || {}
  const currency = settings.currency || 'Coins'

  const name = user.name || 'Sin nombre'
  const genero = user.genre || 'Oculto'
  const desc = user.description || 'Sin descripción'
  const pasatiempo = user.pasatiempo || 'No definido'

  const pareja = user.marry && globalUsers[user.marry]
    ? globalUsers[user.marry].name
    : 'Nadie'

  const estadoCivil =
    genero === 'Mujer' ? 'Casada con'
    : genero === 'Hombre' ? 'Casado con'
    : 'Casadx con'

  const exp = user.exp || 0
  const nivel = user.level || 0

  const coins = user.coins || 0
  const bank = user.bank || 0
  const totalCoins = coins + bank

  // 📈 RANK
  const users = Object.entries(globalUsers).map(([jid, data]) => ({ ...data, jid }))
  const sorted = users.sort((a, b) => (b.level || 0) - (a.level || 0))
  const rank = sorted.findIndex(u => u.jid === userId) + 1

  // 🖼️ FOTO
  const perfil = await conn.profilePictureUrl(userId, 'image').catch(() => 'https://cdn.yuki-wabot.my.id/files/2PVh.jpeg')

  // 🧾 TEXTO
  let txt = `
╭───〔 👤 PERFIL 〕───⬣
│
│ 🧑 Nombre: ${name}
│ ⚥ Género: ${genero}
│ 💬 Desc: ${desc}
│ 🎯 Pasatiempo: ${pasatiempo}
│ 💞 ${estadoCivil}: ${pareja}
│
│ 📊 Nivel: ${nivel}
│ ✨ XP: ${exp}
│ 🏆 Rank: #${rank}
│
│ 💰 ${currency}: ${totalCoins}
│
╰──────────────⬣
`.trim()

  await conn.sendMessage(m.chat, {
    image: { url: perfil },
    caption: txt,
    mentions: [userId]
  }, { quoted: m })
}

handler.help = ['perfil']
handler.tags = ['rpg']
handler.command = ['perfil', 'profile']

export default handler