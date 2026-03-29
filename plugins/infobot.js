let handler = async (m, { conn }) => {
    await m.react('🪻')

    const botname = global.botname || 'Zore Two'
    const prefix = global.prefix || '#'
    const version = 'v2.0'  // cámbiala cuando actualices
    const runtime = process.uptime()
    const hours = Math.floor(runtime / 3600)
    const minutes = Math.floor((runtime % 3600) / 60)
    const seconds = Math.floor(runtime % 60)

    const infoText = `*INFO DEL BOT - ${botname}* 🪼\n\n` +
                     `✨ *Nombre:* ${botname}\n` +
                     `✨ *Prefijo:* ${prefix}\n` +
                     `✨ *Versión:* ${version}\n` +
                     `✨ *Tiempo activo:* ${hours}h ${minutes}m ${seconds}s\n` +
                     `✨ *Creado por:*Adara\n` +
                     `✨ *Canal oficial:* https://whatsapp.com/channel/0029VbBvrmwC1Fu5SYpbBE2A\n\n` +
                     `¡Soy tu waifu favorita lista para ayudarte\n` +
                     `¿Qué quieres hacer hoy?`

    await m.reply(infoText)
    await m.react('🪼')
}

handler.help = ['infobot', 'botinfo']
handler.tags = ['main']
handler.command = ['infobot', 'botinfo', 'info']

export default handler