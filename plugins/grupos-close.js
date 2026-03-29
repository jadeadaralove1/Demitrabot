let handler = async (m, { conn }) => {
    await conn.groupSettingUpdate(m.chat, 'announcement')
    m.reply('(＼᳟ㅤ ⃞🔒ㅤ.ᐟ   𝗚𝗿𝗎𝗉𝗈 𝖼𝖾𝗋𝗋𝗮𝗱𝗼.\n>
✧  ׁ    𓈒    
> 𝗦𝖾 𝗰𝗲𝗋𝗋𝗈́ 𝖾𝗅 𝗀𝗋𝗎𝗉𝗈, 𝖠𝗁𝗈𝗋𝖺 𝗌𝗈𝗅𝗈 𝗅𝗈𝗌 𝖺𝖽𝗆𝗂𝗇𝗌 𝗉𝘂𝗲𝖽𝖾𝗇 𝗁𝗮𝗯𝗹𝗮𝗋. 
> 𝖮 𝖾𝗌 𝗁𝗈𝗋𝖺 𝖽𝖾 𝗱𝖾𝗌𝖼𝖺𝗇𝗌𝗮𝗿.')
}

handler.help = ['close']
handler.tags = ['grupo']
handler.command = ['close', 'cerrar']
handler.admin = true
handler.group = true
handler.botAdmin = true

export default handler