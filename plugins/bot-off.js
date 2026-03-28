import { database } from '../lib/database.js'

let handler = async (m, { conn, args, prefix, command, isOwner }) => {

    if (m.isGroup) {
        const groupData = database.data.groups?.[m.chat]
        if (groupData && groupData.bot === false) {
            if (!isOwner) return
        }
    }

    if (command === 'bot') {
        let action = args[0]?.toLowerCase()

        if (action !== 'on' && action !== 'off') {
                        return m.reply(`Demitra\n\n𐄹 ۪ ׁ ⚠️ᩚ̼ 𖹭̫  Uso incorrecto, darling.\nEjemplo: *${prefix + command} on* o *${prefix + command} off*`)
        }

        if (!database.data.groups) database.data.groups = {}
        if (!database.data.groups[m.chat]) database.data.groups[m.chat] = {}

        const estado = action === 'on'
        database.data.groups[m.chat].bot = estado

        await database.save()

        if (!estado) {
            await m.reply('Demitra\n\n𐄹 ۪ ׁ ❌ᩚ̼ 𖹭̫  *Bot desactivado*\nNo responderé en este grupo.')
            await m.react('❌')
            return
        }

        await m.reply('Demitra\n\n𐄹 ۪ ׁ ✅ᩚ̼ 𖹭̫  *Bot activado*\nAhora responderé a todos en este grupo.')
        await m.react('✅')
    }
}

handler.help = ['bot on', 'bot off']
handler.tags = ['group']
handler.command = ['bot']
handler.group = true
handler.admin = true

export default handler