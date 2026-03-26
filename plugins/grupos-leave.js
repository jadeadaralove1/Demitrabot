import { database } from '../lib/database.js'

const handler = async (m, { conn }) => {
    if (!m.isGroup) return m.reply('「 ⚠️ 」 Este comando solo es para grupos.')

    await conn.sendMessage(m.chat, {
        image: { url: 'https://i.imgur.com/0Z2vY6L.jpeg' },
        caption:
            `Me voy...*\n\n` +
            `No lloren por mí 😼\n\n` +
            `❝ Hasta la próxima... si es que vuelvo 🫡🐢 ❞`
    })

    await conn.groupLeave(m.chat)
}

handler.command = ['leave', 'salir']
handler.help = ['leave']
handler.tags = ['grupo']
handler.group = true
handler.owner = true

export default handler