import { database } from '../lib/database.js'

// ==================== COMANDO #antibot (Solo Admins) ====================
let handler = async (m, { conn, args, isAdmin }) => {
    if (!m.isGroup) return m.reply('ㅤᘓ︵ㅤ🐞ㅤ꒰꒰ Demi avisa que este comando solo es para grupos!*')

    if (!isAdmin) return m.reply(`* 𐄹 ۪ ׁ 💣ᩚ̼ 𖹭̫ ▎Solo los administradores pueden controlar mi AntiBot`)

    let chat = database.data.groups[m.chat]
    if (!chat) chat = database.data.groups[m.chat] = { antibot: false }

    if (args[0] === 'on') {
        if (chat.antibot) return m.reply('** 𐄹 ۪ ׁ 💣ᩚ̼ 𖹭̫ ▎¡El AntiBot ya estaba activado!*')
        chat.antibot = true
        await database.save()
        m.reply(`*ㅤᘓ︵ㅤ🐞ㅤ꒰꒰ ¡ANTIBOT ACTIVADO!*\n\nNingún robot imitador podrá entrar`)
    } else if (args[0] === 'off') {
        if (!chat.antibot) return m.reply('* 𐄹 ۪ ׁ 💣ᩚ̼ 𖹭̫ ▎*El AntiBot ya estaba desactivado.*')
        chat.antibot = false
        await database.save()
        m.reply('ㅤᘓ︵ㅤ🧬ㅤ꒰꒰ *AntiBot desactivado...* Espero que no entren bots molestos')
    } else {
        m.reply(`*「 Demitra bot 」*\n\nUso:\n*#antibot on* → Activar\n*#antibot off* → Desactivar\n\n¡Solo admins del grupo!`)
    }
}

handler.help = ['antibot']
handler.tags = ['grupo']
handler.command = ['antibot']
handler.group = true

export default handler

//  Demitra ANTIBOT. 
const registerAntiBotEvent = () => {
    if (global.zeroAntiBotRegistered || !global.conn) {
        setTimeout(registerAntiBotEvent, 2000)
        return
    }

    global.zeroAntiBotRegistered = true

    global.conn.ev.on('group-participants.update', async (update) => {
        try {
            const { id, participants, action } = update
            if (action !== 'add') return

            const chat = database.data.groups[id]
            if (!chat?.antibot) return

            for (const participant of participants) {
                // No kickear al bot propio ni a owners
                if (participant === global.conn.user.id || global.owner?.includes(participant.split('@')[0])) continue

                let name = ''
                try {
                    name = await global.conn.getName(participant) || participant.split('@')[0]
                } catch {}

                const number = participant.split('@')[0]

                // Detección inteligente de bots
                const isBot = 
                    /bot|Bot|BOT|robot|baileys|whatsappbot|spam/i.test(name) ||
                    /([0-9])\1{4,}/.test(number) || // números repetitivos (55555, 77777, etc)
                    number.length < 9

                if (isBot) {
                    // Expulsar al bot
                    await global.conn.groupParticipantsUpdate(id, [participant], 'remove')

                    const kickText = `◜࣭࣭࣭࣭࣭᷼💢̸̷ׁᮬᰰᩫ࣭࣭࣭࣭ ¡BOT DETECTADO Y EXPULSADO!*\n\n` +
                        `◜࣭࣭࣭࣭࣭᷼💢̸̷ׁᮬᰰᩫ࣭࣭࣭࣭  : ¡𝗡O 𝗤UIERO 𝗡INGÚN 𝗕OT 𝗜MITADO. ◜😠!\n` +
                        `◜࣭࣭࣭࣭࣭᷼💢̸̷ׁᮬᰰᩫ࣭࣭࣭࣭ Solo acepto humanos de verdad... ¡tú no eres real!\n\n` +
                        `◜࣭࣭࣭࣭࣭᷼💢̸̷ׁᮬᰰᩫ࣭࣭࣭࣭ ¡Fuera de aquí @${number} ! Vuelve cuando seas una persona de carne y hueso`

                    await global.conn.sendMessage(id, {
                        text: kickText,
                        mentions: [participant]
                    })
                }
            }
        } catch (e) {
            console.error('[DEMIBOT ANTIBOT ERROR]', e.message)
        }
    })

    console.log('Demibot AntiBot registrado correctamente')
}

registerAntiBotEvent()