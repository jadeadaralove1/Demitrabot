const handler = async (m, { conn, args, isAdmin, isOwner }) => {
    await m.react('🍬')

    try {
        const group = await conn.groupMetadata(m.chat)
        const participants = group.participants.map(p => p.jid || p.id.split(':')[0] + '@s.whatsapp.net')

        const anuncio = args.join(' ') || '¡Todos atentos!'

        const mentions = participants.map(p => `@${p.split('@')[0]}`).join(' ')

        const caption =
            `
                ︶𖫲͜⏝ְ〬𔓕    🐞્    𔓕ְ〬︶𖫲͜⏝
     𞅀፝֟͜͝𞅀    🦭⃞͝ ⚭   ׅ   𝗜𝗡𝗩𝗢𝗖𝗔𝗡𝗗𝗢    ׂ     ׂ  🫐̼̼ᩙ\n\n` +
            `

𓏲 ֶָ  ׄ⃟★֗𐚱 ˳  ׁ  ✷̱ ׅ ᭡ 𝗤𝘂𝖾𝗋𝗂𝖽𝗈𝗌 𝗈𝗒𝗲𝗻𝗍𝖾𝗌 𝖺𝗎𝗌𝖾𝗇𝗍𝖾𝗌… 𝖾𝗅 𝗀𝗋𝗎𝗽𝗼 𝗌𝗎𝖾𝗇𝖺 𝗆𝖺́𝗌 𝗆𝗎𝖾𝗋𝘁𝗼 𝗊𝗎𝖾 𝗎𝗇𝖺 𝗋𝖺𝖽𝗂𝗈 𝗌𝗶𝗻 𝗌𝖾𝗇̃𝖺𝗅.
𝖠𝖼𝗍𝗂́𝗏𝖾𝗇𝗌𝖾, 𝗁𝖺𝗀𝖺𝗇 𝗋𝗎𝗂𝖽𝗈, 𝗿𝗲𝗌𝗉𝗂𝗋𝖾𝗇 𝖺𝗎𝗇𝗊𝗎𝖾 𝗌𝖾𝖺 𝗉𝗈𝗋 𝖼𝗈𝗆𝗉𝗿𝗼𝗺𝗂𝗌𝗈.\n\n` +
            `𝗦𝗂 𝗇𝗈, 𝗍𝗲𝗻𝖽𝗋𝖾́ 𝗊𝗎𝖾 𝖺𝘀𝘂𝗆𝗂𝗋 𝗊𝗎𝖾 𝖾𝗌𝗍𝖾 𝗌𝗂𝗅𝖾𝗇𝖼𝗂𝗈 𝖾𝗌 𝗎𝗇𝖺 𝖽𝖾𝗌𝗉𝖾𝖽𝗂𝖽𝖺… 𝗒 𝗒𝗈 𝖽𝖾𝗍𝗲𝘀𝗍𝗈 𝗅𝗈𝗌 𝖿𝗂𝗇𝖺𝗅𝖾𝗌 𝖺𝗯𝘂𝗋𝗋𝗂𝖽𝗼𝘀.


> |                    𝗠𝗲𝗻𝗰𝗶𝗼𝗻𝗲𝘀

${mentions}\n\n` +
            `Anuncio :: 
> ${anuncio}`

        await conn.sendMessage(m.chat, {
            image: { url: 'https://files.catbox.moe/imfx2l.jpg' },
            caption: caption,
            mentions: participants
        }, { quoted: m })

        await m.react('🪻')

    } catch (e) {
        console.error('❌ INVOCAR ERROR:', e)
        await m.react('😞')
        m.reply('😞Uy... la invocación falló esta vez\nInténtalo de nuevo 🦭')
    }
}

handler.help = ['invocar', 'invocar <texto>']
handler.tags = ['group']
handler.command = ['invocar', 'invocarwaifu']
handler.group = true
handler.admin = true

export default handler