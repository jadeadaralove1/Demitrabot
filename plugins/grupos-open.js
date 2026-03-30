let handler = async (m, { conn }) => {
    try {
        await conn.groupSettingUpdate(m.chat, 'not_announcement')
    } catch {
        try {
            await conn.groupSettingUpdate(m.chat, 'unlocked')
        } catch {
            return m.reply('*😔 No pude abrir el grupo.*')
        }
    }
    m.reply(`(＼᳟ㅤ ⃞🔓ㅤ.ᐟ   𝗚𝗋𝗎𝗉𝗈 𝖠𝖻𝗂𝖾𝗋𝗍𝗼.
> ✧  ׁ    𓈒    
> 𝗘𝗌𝗍𝖾 𝗀𝗋𝗎𝗉𝗈 𝖿𝗎𝖾 𝖺𝖻𝗂𝖾𝗋𝗍𝗈, 𝗅𝗈𝗌 𝗂𝗇𝗍𝖾𝗀𝗋𝖺𝗇𝗍𝖾𝗌 𝗒𝖺 𝗉𝗎𝖾𝖽𝖾𝗇 𝗁𝖺𝖻𝗅𝖺𝗋.`)
}


handler.help = ['open']
handler.tags = ['grupo']
handler.command = ['open', 'abrir']
handler.admin = true
handler.group = true
handler.botAdmin = true

export default handler