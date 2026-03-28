let handler = async (m, { conn }) => {

  // ✅ Aseguramos que la DB exista
  global.db = global.db || {}
  global.db.data = global.db.data || {}
  global.db.data.users = global.db.data.users || {}

  const user = global.db.data.users[m.sender]

  if (!user) {
    // Inicializamos al usuario si no estaba registrado
    global.db.data.users[m.sender] = { name: 'Sin nombre', description: '' }
    return m.reply('✎ No estabas registrado. Tu descripción ahora está vacía.')
  }

  if (!user.description || user.description === '') {
    return m.reply('   ࣪   ࣭   🫐   ࣪   ♡ No tienes una descripción establecida.')
  }

  // Eliminamos la descripción
  user.description = ''
  return m.reply('˙  .  💬⃞   ҉   ⿻  Tu descripción ha sido eliminada.')
}

handler.help = ['deldescription', 'deldesc']
handler.tags = ['rpg']
handler.command = ['deldescription', 'deldesc']

export default handler