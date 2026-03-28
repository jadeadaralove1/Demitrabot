let handlerProfile = {}

// ─── PERFIL ─────────────────────────────
handlerProfile.profile = async (m, { conn }) => {
  global.db = global.db || {}
  global.db.data = global.db.data || {}
  global.db.data.users = global.db.data.users || {}
  global.db.data.chats = global.db.data.chats || {}

  const mentioned = m.mentionedJid || []
  const userId = mentioned[0] || (m.quoted ? m.quoted.sender : m.sender)

  const chat = global.db.data.chats[m.chat] || {}
  const chatUsers = chat.users || {}
  const globalUsers = global.db.data.users || {}

  const user = chatUsers[userId] || {}
  const user2 = globalUsers[userId] || {}

  if (!user2) return m.reply('✎ El usuario no está registrado')

  const botId = conn.user.jid
  const settings = global.db.data.settings?.[botId] || {}
  const currency = settings.currency || 'Coins'

  const name = user2.name || 'Sin nombre'
  const genero = user2.genre || 'Oculto'
  const desc = user2.description || 'Sin descripción'
  const pasatiempo = user2.pasatiempo || 'No definido'

  const pareja = user2.marry && globalUsers[user2.marry]
    ? globalUsers[user2.marry].name
    : 'Nadie'

  const estadoCivil =
    genero === 'Mujer' ? 'Casada con'
    : genero === 'Hombre' ? 'Casado con'
    : 'Casadx con'

  const exp = user2.exp || 0
  const nivel = user2.level || 0

  const coins = user.coins || 0
  const bank = user.bank || 0
  const totalCoins = coins + bank

  // RANK
  const users = Object.entries(globalUsers).map(([jid, data]) => ({ ...data, jid }))
  const sorted = users.sort((a, b) => (b.level || 0) - (a.level || 0))
  const rank = sorted.findIndex(u => u.jid === userId) + 1

  const perfil = await conn.profilePictureUrl(userId, 'image').catch(() => 'https://cdn.yuki-wabot.my.id/files/2PVh.jpeg')

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

// ─── SET DESCRIPTION ─────────────────────────────
handlerProfile.setDescription = async (m, args) => {
  global.db = global.db || {}
  global.db.data = global.db.data || {}
  global.db.data.users = global.db.data.users || {}

  const user = global.db.data.users[m.sender] || (global.db.data.users[m.sender] = { name: 'Sin nombre' })
  const input = args.join(' ')
  if (!input) return m.reply(`Debes especificar una descripción válida.\nEjemplo: #setdescription Hola!`)
  user.description = input
  return m.reply(`Se ha establecido tu descripción.`)
}

// ─── DELETE DESCRIPTION ─────────────────────────────
handlerProfile.delDescription = async (m) => {
  global.db = global.db || {}
  global.db.data = global.db.data || {}
  global.db.data.users = global.db.data.users || {}

  const user = global.db.data.users[m.sender] || (global.db.data.users[m.sender] = { name: 'Sin nombre' })
  if (!user.description || user.description === '') return m.reply(`No tienes una descripción establecida.`)
  user.description = ''
  return m.reply(`Tu descripción ha sido eliminada.`)
}

// ─── SET GENRE ─────────────────────────────
handlerProfile.setGenre = async (m, args) => {
  global.db = global.db || {}
  global.db.data = global.db.data || {}
  global.db.data.users = global.db.data.users || {}

  const user = global.db.data.users[m.sender] || (global.db.data.users[m.sender] = { name: 'Sin nombre' })
  const input = args.join(' ').toLowerCase()
  const genresList = ['Hombre','Mujer','Femboy','Transgénero','Gay','Lesbiana','No Binario','Pansexual','Bisexual','Asexual']
  let genre = genresList.find(g => g.toLowerCase() === input)
  if (!genre) return m.reply(`Elije un género válido:\n${genresList.join('\n')}`)
  user.genre = genre
  return m.reply(`Se ha establecido tu género como: ${user.genre}`)
}

// ─── DELETE GENRE ─────────────────────────────
handlerProfile.delGenre = async (m) => {
  global.db = global.db || {}
  global.db.data = global.db.data || {}
  global.db.data.users = global.db.data.users || {}

  const user = global.db.data.users[m.sender] || (global.db.data.users[m.sender] = { name: 'Sin nombre' })
  if (!user.genre || user.genre === '') return m.reply(`No tienes un género asignado.`)
  user.genre = ''
  return m.reply(`Tu género ha sido eliminado.`)
}

// ─── SET HOBBY ─────────────────────────────
handlerProfile.setHobby = async (m, args) => {
  global.db = global.db || {}
  global.db.data = global.db.data || {}
  global.db.data.users = global.db.data.users || {}

  const user = global.db.data.users[m.sender] || (global.db.data.users[m.sender] = { name: 'Sin nombre' })
  const input = args.join(' ')
  if (!input) return m.reply(`Debes especificar un pasatiempo.\nEjemplo: #sethobby Leer libros`)
  user.pasatiempo = input
  return m.reply(`Se ha establecido tu pasatiempo como: ${user.pasatiempo}`)
}

// ─── DELETE HOBBY ─────────────────────────────
handlerProfile.delHobby = async (m) => {
  global.db = global.db || {}
  global.db.data = global.db.data || {}
  global.db.data.users = global.db.data.users || {}

  const user = global.db.data.users[m.sender] || (global.db.data.users[m.sender] = { name: 'Sin nombre' })
  if (!user.pasatiempo || user.pasatiempo === 'No definido') return m.reply(`No tienes ningún pasatiempo establecido.`)
  user.pasatiempo = 'No definido'
  return m.reply(`Tu pasatiempo ha sido eliminado.`)
}

export default handlerProfile