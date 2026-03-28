let handler = async (m, { args, usedPrefix, command }) => {
  global.db = global.db || {}
  global.db.data = global.db.data || {}
  global.db.data.users = global.db.data.users || {}

  const userId = m.sender
  if (!global.db.data.users[userId]) {
    global.db.data.users[userId] = {
      name: 'Sin nombre',
      genre: 'Oculto',
      description: '',
      pasatiempo: 'No definido',
      level: 0,
      exp: 0,
      coins: 0,
      bank: 0,
      marry: null
    }
  }

  const user = global.db.data.users[userId]
  const input = args.join(' ').trim()

  if (!input) return m.reply(`ᘛ  ࣭   🪼⃝    ࣪   ࣭Debes especificar una descripción válida.\n\n> Ejemplo » *${usedPrefix + command} Me encanta WhatsApp!*`)

  user.description = input
  return m.reply(`✅ Se ha establecido tu descripción. Revisa tu perfil con *${usedPrefix}perfil*`)
}

handler.help = ['setdescription', 'setdesc']
handler.tags = ['rpg']
handler.command = ['setdescription', 'setdesc']

export default handler