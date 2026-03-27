import fs from 'fs'

let handler = async (m, { conn }) => {

  if (!m.isGroup) {
    return m.reply('⚠️ Este comando solo funciona en grupos')
  }

  // ✅ FIX DB
  global.db = global.db || {}
  global.db.data = global.db.data || {}
  global.db.data.chats = global.db.data.chats || {}
  global.db.data.settings = global.db.data.settings || {}

  const chatId = m.chat
  const chat = global.db.data.chats[chatId] || {}
  const chatUsers = chat.users || {}

  // 🔥 FIX BOT ID
  const botId = conn.user?.id || ''
  const botSettings = global.db.data.settings[botId] || {}

  const botname = botSettings.botname || 'Bot'

  // 🤖 BOT INFO SEGURO
  const botName = conn.user?.name || 'Bot'
  const botNumber = (conn.user?.id || '').split(':')[0]

  // 📌 Metadata
  const groupMetadata = await conn.groupMetadata(chatId).catch(() => null)
  if (!groupMetadata) return m.reply('❌ No se pudo obtener info del grupo')

  const groupName = groupMetadata.subject
  const groupCreator = groupMetadata.owner
    ? '@' + groupMetadata.owner.split('@')[0]
    : 'Desconocido'

  const groupAdmins = groupMetadata.participants.filter(p =>
    p.admin === 'admin' || p.admin === 'superadmin'
  )

  const totalParticipants = groupMetadata.participants.length

  const groupBanner = await conn.profilePictureUrl(chatId, 'image')
    .catch(() => 'https://cdn.yuki-wabot.my.id/files/2PVh.jpeg')

  // 📊 Usuarios
  let registeredUsersInGroup = 0

  groupMetadata.participants.forEach(p => {
    if (chatUsers[p.id]) registeredUsersInGroup++
  })

  // 📊 Personajes
  let totalCharacters = 0
  let claimedCount = 0

  try {
    const data = await fs.promises.readFile('./lib/characters.json', 'utf-8')
    const structure = JSON.parse(data)

    const allCharacters = Object.values(structure)
      .flatMap(s => Array.isArray(s.characters) ? s.characters : [])

    totalCharacters = allCharacters.length

    claimedCount = Object.values(chat.characters || {})
      .filter(c => c.user).length

  } catch {}

  const claimRate = totalCharacters > 0
    ? ((claimedCount / totalCharacters) * 100).toFixed(2)
    : '0.00'

  // ⚙️ Config
  const settings = {
    bot: chat.isBanned ? '✘ Desactivado' : '✓ Activado',
    antilinks: chat.antilinks ? '✓ Activado' : '✘ Desactivado',
    welcome: chat.welcome ? '✓ Activado' : '✘ Desactivado',
    goodbye: chat.goodbye ? '✓ Activado' : '✘ Desactivado',
    alerts: chat.alerts ? '✓ Activado' : '✘ Desactivado',
    adminmode: chat.adminonly ? '✓ Activado' : '✘ Desactivado'
  }

  // 🧾 Mensaje
  let message = `*🍭⃞͝ ⚭ Grupo ◢ :: ${groupName} ◤*\n\n`

  message += `❀ Creador › ${groupCreator}\n`
  message += `🤖 Bot Principal › ${botName} (@${botNumber})\n\n`

  message += `👑 Admins › *${groupAdmins.length}*\n`
  message += `👥 Usuarios › *${totalParticipants}*\n`
  message += `📌 Registrados › *${registeredUsersInGroup}*\n\n`

  message += `🎮 Personajes › *${claimedCount}/${totalCharacters} (${claimRate}%)*\n\n`

  message += `⚙️ *Configuraciones:*\n`
  message += `• ${botname} › *${settings.bot}*\n`
  message += `• AntiLinks › *${settings.antilinks}*\n`
  message += `• Bienvenida › *${settings.welcome}*\n`
  message += `• Despedida › *${settings.goodbye}*\n`
  message += `• Alertas › *${settings.alerts}*\n`
  message += `• ModoAdmin › *${settings.adminmode}*\n`

  await conn.sendMessage(m.chat, {
    image: { url: groupBanner },
    caption: message,
    mentions: [
      ...(groupMetadata.owner ? [groupMetadata.owner] : [])
    ]
  }, { quoted: m })
}

handler.help = ['gp', 'groupinfo']
handler.tags = ['grupo']
handler.command = ['gp', 'groupinfo']

export default handler