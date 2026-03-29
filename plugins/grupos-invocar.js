const handler = async (m, { conn, args, isAdmin, isOwner }) => {
    await m.react('🍬')

    try {
        const group = await conn.groupMetadata(m.chat)
        const participants = group.participants.map(p => p.jid || p.id.split(':')[0] + '@s.whatsapp.net')

        const anuncio = args.join(' ') || '¡Todos atentos!'

        const mentions = participants.map(p => `@${p.split('@')[0]}`).join(' ')

        const caption =
            ````       ````︶𖫲͜⏝ְ〬𔓕    🐞્    𔓕ְ〬︶𖫲͜⏝
𞅀፝֟͜͝𞅀    🦭⃞͝ ⚭   ׅ   𝗜𝗡𝗩𝗢𝗖𝗔𝗡𝗗𝗢    ׂ     ׂ  🫐̼̼ᩙ\n\n` +
            `

𓏲 ֶָ  ׄ⃟★֗𐚱 ˳  ׁ  ✷̱ ׅ ᭡ 𝗤𝘂𝖾𝗋𝗂𝖽𝗈𝗌 𝗈𝗒𝗲𝗻𝗍𝖾𝗌 𝖺𝗎𝗌𝖾𝗇𝗍𝖾𝗌… 𝖾𝗅 𝗀𝗋𝗎𝗽𝗼 𝗌𝗎𝖾𝗇𝖺 𝗆𝖺́𝗌 𝗆𝗎𝖾𝗋𝘁𝗼 𝗊𝗎𝖾 𝗎𝗇𝖺 𝗋𝖺𝖽𝗂𝗈 𝗌𝗶𝗻 𝗌𝖾𝗇̃𝖺𝗅.
𝖠𝖼𝗍𝗂́𝗏𝖾𝗇𝗌𝖾, 𝗁𝖺𝗀𝖺𝗇 𝗋𝗎𝗂𝖽𝗈, 𝗿𝗲𝗌𝗉𝗂𝗋𝖾𝗇 𝖺𝗎𝗇𝗊𝗎𝖾 𝗌𝖾𝖺 𝗉𝗈𝗋 𝖼𝗈𝗆𝗉𝗿𝗼𝗺𝗂𝗌𝗈.
> ${anuncio}\n\n` +
            `${mentions}\n\n` +
            `¡Respondan rapido no me dejen sola esperando!`

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