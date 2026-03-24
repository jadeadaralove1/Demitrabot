export default {
  command: ['top'],
  tags: ['fun'],
  help: ['top *<texto>*'],
  group: true,

  run: async (conn, m, args) => {
    const text = args.join(' ')
    if (!text) return conn.sendMessage(m.chat, { text: '🌟 :: Ejemplo de uso: .top los más divertidos' }, { quoted: m })

    // Obtener participantes del grupo
    let metadata
    try {
      metadata = await conn.groupMetadata(m.chat)
    } catch (e) {
      return conn.sendMessage(m.chat, { text: '⚠️ No se pudo obtener información del grupo.' }, { quoted: m })
    }

    const participants = metadata.participants.map(v => v.id)

    // Mezclar participantes y tomar hasta 10
    const shuffled = [...participants].sort(() => 0.5 - Math.random())
    const topUsers = shuffled.slice(0, Math.min(10, shuffled.length))

    // Función para mencionar
    const user = a => '@' + a.split('@')[0]

    const emojis = ['🌟 ::','🎉 ::','✨ ::','🐢 ::','🦭 ::','🪄 ::']
    const pickRandom = list => list[Math.floor(Math.random() * list.length)]

    // Construir mensaje
    let topMessage = `    
         𓈒   𓏸  ꒰͡ 𝆬   𓇼 𝆬   ͡꒱    𓏸  𓈒

⋆┆┆  DEMITRA TOP ${topUsers.length} ${text} ┆┆ ⋆\n`

    topUsers.forEach((id, i) => {
      const emoji = pickRandom(emojis)
      topMessage += `\n${emoji} *${i + 1}. ${user(id)}*`
    })

    topMessage += `\n\n১১🐋 :: ¡Los destacados!. ݁𖦹`

    await conn.sendMessage(m.chat, { text: topMessage, mentions: topUsers }, { quoted: m })
  }
}