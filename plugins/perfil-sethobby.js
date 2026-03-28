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

  const pasatiemposDisponibles = ['📚 Leer','🎤 Cantar','🎮 Jugar','🎨 Dibujar','💃 Bailar','🍳 Cocinar','✈️ Viajar','Otro 🌟']

  if (!input) {
    return m.reply(`🐢 Elige un pasatiempo:\n${pasatiemposDisponibles.map((p,i) => `${i+1}) ${p}`).join('\n')}\n\nEjemplo: *${usedPrefix + command} 1* o *${usedPrefix + command} Leer*`)
  }

  let seleccionado = ''
  if (/^\d+$/.test(input)) {
    const index = parseInt(input) - 1
    if (index >= 0 && index < pasatiemposDisponibles.length) seleccionado = pasatiemposDisponibles[index]
    else return m.reply(`❌ Número inválido (1-${pasatiemposDisponibles.length})`)
  } else {
    const encontrado = pasatiemposDisponibles.find(p => p.toLowerCase().includes(input.toLowerCase()))
    if (!encontrado) return m.reply('❌ Pasatiempo no encontrado')
    seleccionado = encontrado
  }

  user.pasatiempo = seleccionado
  return m.reply(`✅ Pasatiempo establecido:\n> ${user.pasatiempo}\nRevisa tu perfil con *${usedPrefix}perfil*`)
}

handler.help = ['setpasatiempo', 'sethobby']
handler.tags = ['rpg']
handler.command = ['setpasatiempo', 'sethobby']

export default handler