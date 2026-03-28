let handler = async (m, { conn, args, usedPrefix, command }) => {

  // ✅ FIX DB
  global.db = global.db || {}
  global.db.data = global.db.data || {}
  global.db.data.users = global.db.data.users || {}

  const userId = m.sender
  // Inicializar usuario si no existe
  if (!global.db.data.users[userId]) {
    global.db.data.users[userId] = {
      name: 'Sin nombre',
      genre: 'Oculto',
      description: '',
      pasatiempo: 'No definido',
      exp: 0,
      level: 0,
      coins: 0,
      bank: 0,
      marry: null
    }
  }

  const user = global.db.data.users[userId]

  const input = args.join(' ').trim()
  if (!input) return m.reply(
    `ᘛ  ࣭   🪼⃝    ࣪   ࣭Debes especificar una descripción válida para tu perfil.\n\n> Ejemplo » *${usedPrefix + command} Hola, uso WhatsApp!*`
  )

  // Guardar descripción
  user.description = input

  return m.reply(
    `🐢⃝ Se ha establecido tu descripción correctamente.\nPuedes revisarla con *${usedPrefix}perfil* ૮₍˶• ˔ ก₎ა`
  )
}

handler.help = ['setdescription', 'setdesc']
handler.tags = ['rpg']
handler.command = ['setdescription', 'setdesc']

export default handler