import { database } from '../lib/database.js'

export const event = 'group-participants.update'
export const enabled = (id) => !!database.data.groups?.[id]?.goodbye

export const run = async (conn, update) => {
    try {
        const { id, participants, action } = update
        if (action !== 'remove') return
        if (!enabled(id)) return

        for (const participant of participants) {
            let ppuser
            try {
                ppuser = await conn.profilePictureUrl(participant, 'image')
            } catch {
                ppuser = 'https://i.imgur.com/0Z2vY6L.jpeg'
            }

            const user = participant.split('@')[0]

            await conn.sendMessage(id, {
                image: { url: ppuser },
                caption:
                    `⠟   ׂ   🪼⃞፝֟͝ꭷ  ׂ 𝗘𝗫𝗜𝗧  𝗣𝗘𝗥𝗦𝗢𝗡    ׂ   ٭ ̼̼⃞   
  ֯  ❀ ❀ ֢ ໋ ⣿   ݁  ֟𝖠𝗱𝗂𝗈𝘀 𝗈 𝗇𝗈..?݂֯   ✦  ֢   ݁ ⏜\n\n` +
                    `> 𝗔𝗰𝗮𝗯𝗮 𝗱𝗲 𝘀𝗮𝗹𝗶𝗿𝘀𝗲 @${user}

⸻̸  𝆳 ׄ⃟̷̸̎ཹ  ᮫   ׁ  ݂  ﴾🫧﴿ 𓄹  
𝗢𝗁, 𝗆𝗂 𝗊𝘂𝗲𝗿𝗶𝖽𝗈 𝖽𝖾𝗌𝖼𝗈𝗻𝘁𝗲𝗻𝘁𝗈, 𝗉𝖺𝗋𝖾𝖼𝖾 𝗊𝗎𝖾 𝗍𝗎 𝖺𝘀𝗶𝗲𝗻𝗍𝗈 𝖾𝗇 𝖾𝗌𝗍𝖾 𝖼𝖺𝗋𝗋𝗎𝗌𝖾𝗅 𝗂𝗇𝗳𝗲𝗿𝗻𝖺𝗅 𝗒𝖺 𝗇𝗈 𝘁𝖾 𝗁𝗮𝗰𝗂́𝖺 𝖼𝗈𝗌𝗾𝘂𝗶𝗹𝗹𝗮𝗌…

𝗡𝗈 𝗍𝖾 𝗉𝗋𝖾𝗼𝗰𝘂𝗽𝖾𝗌, 𝗌𝗂𝗲𝗺𝗽𝗋𝖾 𝗁𝖺𝖻𝗋𝖺́ 𝗈𝗍𝗋𝗮 𝖻𝗮𝗻𝖽𝖺 𝖽𝖾 𝗆𝗂𝗌𝖾𝗿𝗮𝗯𝗹𝖾𝗌 𝖺 𝗅𝖺 𝗊𝗎𝖾 𝖺𝗋𝗋𝗮𝘀𝗍𝗋𝖺𝗋.\n\n` +
                    `ㅤㅤ🫐᪶ㅤㅤׄㅤㅤ𝖤𝗌𝗉𝖾𝗋𝖺𝗆𝗈𝗌 𝗊𝗎𝖾 𝗇𝗎𝗇𝖼𝖺 𝗏𝗎𝖾𝗅𝗏𝖺𝗌. ㅤㅤׅㅤㅤॆㅤㅤׄㅤㅤ𖹭̵`,
                mentions: [participant]
            })
        }
    } catch (e) {
        console.error('[GOODBYE ERROR]', e.message)
    }
}