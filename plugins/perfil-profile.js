// COMANDO PERFIL
let handler = async (m, { conn }) => {
  global.db = global.db || {}
  global.db.data = global.db.data || {}
  global.db.data.users = global.db.data.users || {}

  const userId = m.mentionedJid?.[0] || (m.quoted ? m.quoted.sender : m.sender)
  const users = global.db.data.users

  // Inicializar usuario solo si no existe
  if (!users[userId]) {
    users[userId] = {
      name: '',
      genre: '',
      description: '',
      pasatiempo: '',
      level: 1,
      exp: 0,
      coins: 0,
      bank: 0,
      marry: null
    }
  }

  const user = users[userId]

  const botId = conn.user.jid
  const settings = global.db.data.settings?.[botId] || {}
  const currency = settings.currency || 'Coins'

  const pareja = user.marry && users[user.marry] ? users[user.marry].name : 'Nadie'
  const estadoCivil =
    user.genre === 'Mujer' ? 'Casada con'
    : user.genre === 'Hombre' ? 'Casado con'
    : 'Casadx con'

  const rank = Object.values(users)
    .sort((a, b) => (b.level || 0) - (a.level || 0))
    .findIndex(u => u === user) + 1

  const perfilUrl = await conn.profilePictureUrl(userId, 'image')
    .catch(() => 'https://cdn.yuki-wabot.my.id/files/2PVh.jpeg')

  const txt = `
╭───〔 👤 PERFIL 〕───⬣
│
│ 🧑 Nombre: ${user.name}
│
│ 📊 Nivel: ${user.level}
│ ✨ XP: ${user.exp}
│
╰──────────────⬣
`.trim()

  await conn.sendMessage(m.chat, {
    image: { url: perfilUrl },
    caption: txt,
    mentions: [userId]
  }, { quoted: m })
}

handler.help = ['perfil']
handler.tags = ['rpg']
handler.command = ['perfil', 'profile']

export default handler