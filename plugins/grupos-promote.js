var handler = async (m, { conn, command }) => {

let mentionedJid = m.mentionedJid
let user = mentionedJid?.[0] || m.quoted?.sender || null

if (!user) {
    return await conn.sendMessage(m.chat, {
        text: '𐄹 ۪ ׁ ⚠️ᩚ̼ 𖹭̫ ▎Menciona a alguien para darle admin.'
    }, { quoted: m })
}

try {
    const groupInfo = await conn.groupMetadata(m.chat)
    const ownerGroup = groupInfo.owner || m.chat.split('-')[0] + '@s.whatsapp.net'

    if (user === ownerGroup || groupInfo.participants.some(p => p.id === user && p.admin)) {
        return await conn.sendMessage(m.chat, {
            text: '𐄹 ۪ ׁ ⚠️ᩚ̼ 𖹭̫ ▎Esa persona ya es admin.'
        }, { quoted: m })
    }

    await conn.groupParticipantsUpdate(m.chat, [user], 'promote')

    await conn.sendMessage(m.chat, {
        text: `@${user.split('@')[0]} ahora es admin.`,
        mentions: [user]
    }, { quoted: m })

} catch (e) {
    await conn.sendMessage(m.chat, {
        text: `Error:\n\n> ${e.message}`
    }, { quoted: m })
}}

handler.command = ['promote', 'promover']
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler