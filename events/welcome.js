import { database } from '../lib/database.js'

export const event = 'group-participants.update'
export const enabled = (id) => !!database.data.groups?.[id]?.welcome

export const run = async (conn, update) => {
    try {
        const { id, participants, action } = update
        if (action !== 'add') return
        if (!enabled(id)) return

        for (const participant of participants) {
            let ppuser
            try {
                ppuser = await conn.profilePictureUrl(participant, 'image')
            } catch {
                ppuser = 'https://i.imgur.com/0Z2vY6L.jpeg'
            }

            const user = participant.split('@')[0]

            const texto =
                `ᳮ ֶᦒ֒  ꩝꩝    𝅭  〔  *Wҽʅƈσɱҽ*. 〕𝅭 ᡴ ᡴ ⣙⣙
 ࣭࣭۪࣭࣭︶ٰ࣭࣭۪࣭᳐᳑︶࣭࣭۪࣭࣭᳐᳑︶࣭࣭۪࣭࣭᳐᳑︶࣭࣭۪࣭࣭᳐᳑︶࣭࣭۪࣭࣭᳐᳑︶࣭࣭۪࣭࣭᳐᳑︶࣭࣭۪࣭࣭᳐᳑︶࣭࣭۪࣭࣭᳐᳑︶࣭࣭۪࣭࣭᳐᳑︶࣭࣭۪࣭࣭᳐᳑︶࣭࣭۪࣭࣭᳐᳑︶࣭࣭۪࣭࣭᳐᳑︶࣭࣭۪࣭࣭࣭࣭۪࣭࣭᳐᳑︶ٰ࣭࣭۪࣭᳐᳑︶࣭࣭۪࣭࣭᳐᳑︶࣭࣭۪࣭࣭᳐᳑
ּ ֶָ֢ .             ּ ֶָ֢ .             ּ ֶָ֢ .             ּ ֶָ֢ .  
         ּ ֶָ֢ .             ּ ֶָ֢ .             ּ ֶָ֢ .             ּ ֶָ֢ .\n\n` +
                ` ⃧⠖⠖   ּ֪͘🩰⃝ۛ֗༌   𐧼  _ᰫᰫ_         
     𝔹𝚒𝚎𝚗𝚟𝚎𝚗𝚒𝚍𝚡 𝚜𝚎𝚊𝚜 𝚊 𝚎𝚜𝚝𝚎 𝚕𝚒𝚗𝚍𝚘 Grupo
𝔼𝚜𝚙𝚎𝚛𝚘 𝚝𝚎 𝚍𝚒𝚟𝚒𝚎𝚛𝚝𝚊𝚜 𝚖𝚞𝚌𝚑𝚘 𝚓𝚞𝚗𝚝𝚘 𝚊 𝚗𝚘𝚜𝚘𝚝𝚛𝚘𝚜!!
ּ ֶָ֢ .             ּ ֶָ֢ .             ּ ֶָ֢ .             ּ ֶָ֢ .  
         ּ ֶָ֢ .             ּ ֶָ֢ .             ּ ֶָ֢ .             ּ ֶָ֢ .\n\n` +
                ` ⃧⠖⠖   ּ֪͘🎐⃝ۛ֗༌   𐧼  _ᰦᰦ᪶_  𝕄𝚎 𝚙𝚛𝚎𝚜𝚎𝚗𝚝𝚘...
    𝕄𝚒 𝚗𝚘𝚖𝚋𝚛𝚎 𝚎𝚜 `Demitra` , 𝚎𝚜 𝚞𝚗 𝚙𝚕𝚊𝚌𝚎𝚛 𝚌𝚘𝚗𝚘𝚌𝚎𝚛𝚕𝚎,𝚕𝚒𝚗𝚍𝚡!! Para saber más de mi usa #menu
ּ ֶָ֢ .             ּ ֶָ֢ .             ּ ֶָ֢ .             ּ ֶָ֢ .  
         ּ ֶָ֢ .             ּ ֶָ֢ .             ּ ֶָ֢ .             ּ ֶָ֢ .\n\n` +               
                `Te voy a cuidar, mimar y volar contigo en mi Franxx para siempre... ¡no me sueltes nunca!\n\n` +
                `¡Estoy tan feliz de tenerte aquí conmigo, mi Darling más especial! Kyaaah~ Ven aquí, no te escapes 🌷💗`

            await conn.sendMessage(id, {
                image: { url: ppuser },
                caption: texto,
                mentions: [participant]
            })
        }
    } catch (e) {
        console.error('[WELCOME ERROR]', e.message)
    }
}