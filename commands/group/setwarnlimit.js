export default {
  command: ['setwarnlimit'],
  category: 'group',
  isAdmin: true,
  run: async (client, m, args) => {
    const chat = global.db.data.chats[m.chat]

    // Detecta el prefijo del bot si existe, o usa "." por defecto
    const prefa = global.db?.data?.settings?.prefa || '.'

    // Primer argumento: límite deseado
    const raw = args[0]
    const limit = parseInt(raw)

    // Validación: debe ser número entre 0 y 10
    if (isNaN(limit) || limit < 0 || limit > 10) {
      return m.reply(
        `𝄄ׄㅤ𝅄🫐⃞፝͜͡⌒𝅄 Límite inválido.\n` +
        `> Debe ser un número entre \`1\` y \`10\`, o \`0\` para desactivar la expulsión automática.\n` +
        `> Ejemplo 1 › *${prefa}setwarnlimit 5*\n` +
        `> Ejemplo 2 › *${prefa}setwarnlimit 0*\n\n` +
        `> Estado actual: ${chat.expulsar ? `\`${chat.warnLimit}\` advertencias` : '`Desactivado`'}`
      )
    }

    // Si el límite es 0, desactivamos expulsión automática
    if (limit === 0) {
      chat.warnLimit = 0
      chat.expulsar = false
      return m.reply(
        `🐢▸ㅤㅤ⏌ㅤHas desactivado la expulsión automática de usuarios al alcanzar el límite de advertencias.\n` +
        `> Ahora los usuarios solo acumularán advertencias sin ser eliminados.`
      )
    }

    // Guardamos el límite y activamos expulsión automática
    chat.warnLimit = limit
    chat.expulsar = true
    await m.reply(
      `🐋▸ㅤㅤ⏌ㅤLímite de advertencias establecido en \`${limit}\` para este grupo.\n` +
      `> 🦭 Los usuarios serán eliminados automáticamente al alcanzar este límite.\n` +
      `> Estado actual: \`${chat.warnLimit}\` advertencias antes de expulsión.`
    )
  },
}