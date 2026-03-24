import chalk from 'chalk'

export default async (client) => {
  const db = global.db
  const dev = 'Demetra' // Nombre de tu bot o developer

  // Evento cuando alguien entra o sale del grupo
  client.ev.on('group-participants.update', async (anu) => {
    try {
      const metadata = await client.groupMetadata(anu.id).catch(() => null)
      if (!metadata) return

      const chat = db?.data?.chats?.[anu.id] || {}
      const botId = client.user.id.split(':')[0] + '@s.whatsapp.net'
      const primaryBotId = chat?.primaryBot || null
      const isSelf = db.data.settings[botId]?.self ?? false
      if (isSelf) return

      for (const p of anu.participants) {
        const jid = p // p ya es el JID completo
        const phone = jid.split('@')[0]

        // Foto de perfil del usuario, si no tiene usa una por defecto
        const pp = await client.profilePictureUrl(jid, 'image').catch(_ => 'https://cdn.yuki-wabot.my.id/files/2PVh.jpeg')

        // Mensajes de bienvenida y despedida desde la base de datos
        const welcomeText = chat.sWelcome
          ? chat.sWelcome.replace(/{usuario}/g, `@${phone}`).replace(/{grupo}/g, `*${metadata.subject}*`).replace(/{desc}/g, metadata?.desc || '✿ Sin Desc ✿')
          : `ㅤ
   👾ㅤㅤ＃𝖶𝖤𝖫𝖢𝖮𝖬𝖤ㅤㅤ＞ㅤㅤ
     ㅤㅤ𝖭𝖤𝖶 𝖯𝖤𝖱𝖲𝖮𝖭 ㅤㅤ🤲🏻ㅤㅤ𓈒𓈒𓈒ㅤㅤ✽

> ㅤㅤㅤㅤㅤㅤ@ @${phone}

@    ;     𝖡𝗂𝖾𝗇𝗏𝖾𝗇𝗂𝖽𝗈/𝖺 𝖾𝗑𝗍𝗋𝖺𝗍𝖾𝗋𝗋𝖾𝗌𝗍𝗋𝖾. 𝖳𝖾 𝖽𝗈𝗒 𝗅𝖺 𝖻𝗂𝖾𝗇𝗏𝖾𝗇𝗂𝖽𝖺 𝖺 𝖾𝗌𝗍𝖾 𝗀𝗋𝗎𝗉𝗈 *${metadata.subject}. 𝖲𝗈𝗒 𝖲𝗁𝗑𝖽𝗈𝗐𝗅𝗒𝗇 𝖾𝗅 𝖻𝗈𝗍 𝗆𝖺́𝗌 𝗉𝗋𝗈 𝖽𝖾𝗅 𝗀𝗋𝗎𝗉𝗈!. ₍ᐢ..ᐢ₎

  ○REGLASSㅤ/ ㅤㅤ🪼.    #𝖠𝖢𝖢𝖤𝖲𝖲

     ֯  🌿 ֢ ໋    ▒\n> *@desc*\n\n 


★◗꯭ㅤ꯭🪼       𓈓       𝖠𝖢͟𝖢᤻͟𝖤⵿𝖲𝖲
https://whatsapp.com/channel/0029VbBvrmwC1Fu5SYpbBE2A`

        const goodbyeText = chat.sGoodbye
          ? chat.sGoodbye.replace(/{usuario}/g, `@${phone}`).replace(/{grupo}/g, `*${metadata.subject}*`).replace(/{desc}/g, metadata?.desc || '✿ Sin Desc ✿')
          : `⠟   ׂ   🪼⃞፝֟͝ꭷ  ׂ 𝗘𝗫𝗜𝗧  𝗣𝗘𝗥𝗦𝗢𝗡    ׂ   ٭ ̼̼⃞   
  ֯  ❀ ❀ ֢ ໋ ⣿   ݁  ֟𝖠𝗱𝗂𝗈𝘀 𝗈 𝗇𝗈..?݂֯   ✦  ֢   ݁ ⏜
> 𝗔𝗰𝗮𝗯𝗮 𝗱𝗲 𝘀𝗮𝗹𝗶𝗿𝘀𝗲 @ @${phone}

⸻̸  𝆳 ׄ⃟̷̸̎ཹ  ᮫   𓄹  *${metadata.subject}
𝗢𝗁, 𝗆𝗂 𝗊𝘂𝗲𝗿𝗶𝖽𝗈 𝖽𝖾𝗌𝖼𝗈𝗻𝘁𝗲𝗻𝘁𝗈, 𝗉𝖺𝗋𝖾𝖼𝖾 𝗊𝗎𝖾 𝗍𝗎 𝖺𝘀𝗶𝗲𝗻𝗍𝗈 𝖾𝗇 𝖾𝗌𝗍𝖾 𝖼𝖺𝗋𝗋𝗎𝗌𝖾𝗅 𝗂𝗇𝗳𝗲𝗿𝗻𝖺𝗅 𝗒𝖺 𝗇𝗈 𝘁𝖾 𝗁𝗮𝗰𝗂́𝖺 𝖼𝗈𝗌𝗾𝘂𝗶𝗹𝗹𝗮𝗌…

𝗡𝗈 𝗍𝖾 𝗉𝗋𝖾𝗼𝗰𝘂𝗽𝖾𝗌, 𝗌𝗂𝗲𝗺𝗽𝗋𝖾 𝗁𝖺𝖻𝗋𝖺́ 𝗈𝗍𝗋𝗮 𝖻𝗮𝗻𝖽𝖺 𝖽𝖾 𝗆𝗂𝗌𝖾𝗿𝗮𝗯𝗹𝖾𝗌 𝖺 𝗅𝖺 𝗊𝗎𝖾 𝖺𝗋𝗋𝗮𝘀𝗍𝗋𝖺𝗋.


ㅤㅤ🫐᪶ㅤㅤׄㅤㅤ𝖤𝗌𝗉𝖾𝗋𝖺𝗆𝗈𝗌 𝗊𝗎𝖾 𝗇𝗎𝗇𝖼𝖺 𝗏𝗎𝖾𝗅𝗏𝖺𝗌. ㅤㅤׅㅤㅤॆㅤㅤׄㅤㅤ𖹭̵*`

        const fakeContext = {
          contextInfo: {
            isForwarded: true,
            mentionedJid: [jid]
          }
        }

        // ➕ Usuario agregado
        if (anu.action === 'add' && chat?.welcome && (!primaryBotId || primaryBotId === botId)) {
          await client.sendMessage(anu.id, { image: { url: pp }, caption: welcomeText, ...fakeContext })
        }

        // ➖ Usuario eliminado o se fue
        if ((anu.action === 'remove' || anu.action === 'leave') && chat?.goodbye && (!primaryBotId || primaryBotId === botId)) {
          await client.sendMessage(anu.id, { image: { url: pp }, caption: goodbyeText, ...fakeContext })
        }
      }
    } catch (err) {
      console.log(chalk.gray(`[ BOT  ] → ${err}`))
    }
  })
}