

import { database } from '../lib/database.js'

let handler = async (m, { conn }) => {
    const user = database.data.users[m.sender]

    if (!user?.registered) return m.reply('No estás registrado')

    user.registered = false
    await database.save()

    await m.reply(' ◜࣭࣭࣭࣭࣭᷼📝̸̷ׁᮬᰰᩫ࣭࣭࣭࣭ Tu registro ya no existe, Qué breve fue tu paso…\nEstaré esperando tu regreso' )
    await m.react('🐞')
}

handler.help = ['unreg']
handler.tags = ['main']
handler.command = ['unreg', 'pito']

export default handler