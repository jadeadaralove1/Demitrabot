import { database } from '../lib/database.js'

let handler = async (m, { conn }) => {

  // ✅ Aseguramos que la DB exista
  global.db = global.db || {}
  global.db.data = global.db.data || {}
  global.db.data.users = global.db.data.users || {}

  const user = global.db.data.users[m.sender]

  if (!user) {
    // Inicializamos el usuario si no estaba registrado
    global.db.data.users[m.sender] = { name: 'Sin nombre', genre: '' }
    return m.reply('✎ No estabas registrado. Tu género ahora está vacío.')
  }

  if (!user.genre || user.genre === '') {
    return m.reply('   ࣪   ࣭   🎣   ࣪   ♡ No tienes un género asignado.')
  }

  // Eliminamos el género
  user.genre = ''
  return m.reply('᷼⥃ᩥ 🫧ׅ֟፝͠ᩬ⃞    ﹗ Tu género ha sido eliminado.')
}

handler.help = ['delgenre']
handler.tags = ['rpg']
handler.command = ['delgenre']

export default handler