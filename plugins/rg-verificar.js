import { database } from '../lib/database.js'
import { createHash } from 'crypto'
import fetch from 'node-fetch'

const Reg = /^(.+)[.|]\s*([0-9]+)$/i

let handler = async (m, { conn, args, prefix }) => {
    const text = args.join(' ')
    const user = database.data.users[m.sender]
    const name2 = m.pushName || 'Darling'
    const zeroImg = 'https://causas-files.vercel.app/fl/9vs2.jpg'

    if (user.registered) return m.reply(
        `◜࣭࣭࣭࣭࣭᷼🔐̸̷ׁᮬᰰᩫ࣭࣭࣭࣭ Ya estás registrado\n\n
Qué eficiencia tan encantadora. 
Si deseas desaparecer…\n
#unreg`
    )

    if (!Reg.test(text)) return m.reply(
        `𝅄💮⃞፝͜͡⌒𝅄ㅤׄㅤ⌢ㅤ𝄄ㅤ𝗔𝗁, 𝗊𝗎𝖾́ 𝖽𝗂𝗅𝗂𝗀𝗲𝗻𝗍𝖾… 𝗌𝗂 𝗊𝗎𝗂𝖾𝗋𝗲𝘀 𝗋𝖾𝗀𝗂𝗌𝗍𝗋𝖺𝗋𝗍𝖾, 𝗌𝗈𝗅𝗈 𝗌𝗂𝗴𝘂𝖾 𝖾𝗅 𝗋𝗶𝘁𝗎𝖺𝗅.
𝖯𝗎𝗅𝗌𝖺, 𝖾𝗌𝖼𝗋𝗂𝖻𝖾, 𝖾𝗌𝗉𝗲𝗿𝖺… 𝗒 𝗋𝖾𝖼𝘂𝗲𝗋𝖽𝖺: 𝖼𝖺𝖽𝖺 𝗽𝖺𝗌𝗈 𝗊𝗎𝖾 𝗱𝗮𝗌 𝗆𝖾 𝖾𝗇𝗍𝗋𝖾𝘁𝗶𝗲𝗇𝖾.
𝗛𝖺𝗓𝗅𝗈 𝖻𝗂𝖾𝗇, 𝗊𝘂𝗲𝗋𝗂𝖽𝗈, 𝗇𝗈 𝗆𝖾 𝗁𝖺𝗀𝖺𝗌 𝗋𝖾𝗉𝖾𝗍𝗂𝗋𝗅𝗈 𝖽𝗼𝘀 𝗏𝖾𝖼𝗲𝘀.

Next command. :: 
#reg name.age
#reg ${name2}.18`
    contextInfo: {
            externalAdReply: {
                title: '𝗗𝗘𝗠𝗜𝗧𝗥𝗔 - Registro',
                body: 'Formato incorrecto',
                mediaType: 1,
                renderLargerThumbnail: true,
                thumbnailUrl: 'https://files.catbox.moe/723ln7.jpg'
            }
        }
    }, { quoted: m })
 }
) 
    let [_, name, age] = text.match(Reg)
    if (!name) return m.reply('◜࣭࣭࣭࣭࣭᷼🚫̸̷ׁᮬᰰᩫ࣭࣭࣭࣭El nombre no puede estar vacío.')
    if (!age) return m.reply('◜࣭࣭࣭࣭࣭᷼🚫̸̷ׁᮬᰰᩫ࣭࣭࣭࣭La edad no puede estar vacía.')
    if (name.length >= 30) return m.reply('◜࣭࣭࣭࣭࣭᷼🚫̸̷ׁᮬᰰᩫ࣭࣭࣭࣭El nombre es muy largo. Usa menos de 30 caracteres.')
    age = parseInt(age)
    if (age > 100) return m.reply('◜࣭࣭࣭࣭࣭᷼🚫̸̷ׁᮬᰰᩫ࣭࣭࣭࣭Esa edad es demasiado alta.')
    if (age < 10) return m.reply('◜࣭࣭࣭࣭࣭᷼🚫̸̷ׁᮬᰰᩫ࣭࣭࣭࣭ Eres muy pequeño para usar el bot.')

    user.name = name.trim()
    user.age = age
    user.regTime = +new Date
    user.registered = true

    const sn = createHash('md5').update(m.sender).digest('hex').slice(0, 20)

    const regbot = `૮   ּ    ۟   ㅤ 𝗣𝗘𝗥𝗙𝗜𝗟 ֗   ぅ   𓈒   <𝟯!\n\n

໒    ׂ     𝓝𝗈𝗆𝖻𝗋𝖾  ੭୧   ᮫    

> 𓈒    ׂ   🪼੭       ᮫      : ${name}\n


໒    ׂ     𝓔𝖽𝖺𝖽   ੭୧   ᮫    

> 𓈒    ׂ   💭੭       ᮫      : ${age}\n


໒   ׂ   “Id.”   ੭୧   ᮫    

> 𓈒    ׂ   🔮੭       ᮫  : ${sn}\n\n



> 𝗘𝘅𝖼𝖾𝗅𝖾𝗇𝗍𝖾, 𝗊𝗎𝖾𝗋𝗂𝖽𝗈 𝗇𝗈𝗏𝖺𝘁𝗼… 𝗍𝗎 𝗋𝖾𝗀𝗂𝗌𝘁𝗿𝗈 𝗁𝖺 𝗌𝗂𝖽𝗈 𝗎𝗇 𝖾́𝗑𝗂𝗍𝗼.\n\n
> 𝖠𝗊𝗎𝗂́ 𝗍𝗂𝗲𝗻𝖾𝗌 𝗍𝗎 𝗉𝖾𝗿𝖿𝗂𝗅, 𝗋𝖾𝗅𝗎𝖼𝗂𝖾𝗇𝗍𝖾 𝗒 𝗅𝗂𝗌𝗍𝗈 𝗉𝖺𝗋𝖺 𝘂𝗌𝖺𝗋.
> 𝗔𝖽𝗆𝗂́𝗋𝖺𝗅𝗈, 𝗍𝗈́𝗰𝖺𝗅𝗈, 𝗁𝖺𝘇𝗅𝗈 𝗍𝗎𝗒𝗈… 𝗉𝖾𝗿𝗈 𝗋𝖾𝖼𝗎𝖾𝗋𝖽𝖺, 𝗌𝗂𝖾𝗆𝗉𝗋𝖾 𝖻𝖺𝗃𝗈 𝗺𝗂 𝗆𝗂𝗋𝖺𝗱𝖺.`

    await m.react('🪻')

    try {
        const res = await fetch(zeroImg)
        thumbBuffer = Buffer.from(await res.arrayBuffer())
    } catch (e) {
        console.error('Error descargando imagen:', e)
    }

           a    await conn.sendMessage(m.chat, {
        text: regbot,
        contextInfo: {
            externalAdReply: {
                title: '𝗗𝗘𝗠𝗜𝗧𝗥𝗔 - Registro',
                body: 'BOMSHACALAKA',
                thumbnail: thumbBuffer,
                mediaType: 1,
                renderLargerThumbnail: true
            }
        }
    }, { quoted: m })

    await database.save()
}

handler.help = ['reg']
handler.tags = ['main']
handler.command = ['reg', 'register', 'registrar']

export default handler