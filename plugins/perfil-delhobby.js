let handler = async (m, { conn }) => {

  // ✅ Aseguramos que la DB exista
  global.db = global.db || {}
  global.db.data = global.db.data || {}
  global.db.data.users = global.db.data.users || {}

  const user = global.db.data.users[m.sender]

  if (!user) {
    // Inicializamos el usuario si no existe
    global.db.data.users[m.sender] = { name: 'Sin nombre', pasatiempo: 'No definido' }
    return m.reply('✎ No estabas registrado. Tu pasatiempo ahora está vacío.')
  }

  if (!user.pasatiempo || user.pasatiempo === 'No definido') {
    return m.reply('ᘛ   ࣭   🦭⃝      ࣪   ࣭    No tienes ningún pasatiempo establecido.')
  }

  // Guardamos el pasatiempo anterior por si quieres usarlo después
  const pasatiempoAnterior = user.pasatiempo
  user.pasatiempo = 'No definido'

  return m.reply('᷼⥃ᩥ ☁️ׅ֟፝͠ᩬ⃞    ﹗ Se ha eliminado tu pasatiempo.')
}

handler.help = ['delpasatiempo', 'removehobby']
handler.tags = ['rpg']
handler.command = ['delpasatiempo', 'removehobby']

export default handler