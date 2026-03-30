import { database } from '../lib/database.js'

export const event = 'group-participants.update'
export const enabled = (id) => !!database.data.groups?.[id]?.welcome

export const run = async (conn, update) => {
    try {
        const { id, participants, action } = update
        if (action !== 'add') return
        if (!enabled(id)) return

        const metadata = await conn.groupMetadata(id).catch(() => ({}))

        for (const participant of participants) {
            let ppuser
            try {
                ppuser = await conn.profilePictureUrl(participant, 'image')
            } catch {
                ppuser = 'https://i.imgur.com/0Z2vY6L.jpeg'
            }

            const user = participant.split('@')[0]

            let texto = `
   ๑     𓈒   ⃝🔔   ׅ   🄳ιɳɠ 🄳σɳɠ       ᮫     ୨୧
      `￮   ֹ 🦭⃞    ࣭    𝖡𝗂𝖾𝗇𝗏𝖾𝗇𝗂𝖽𝗑 ✨ྀ  .  ♡`

ʚֵ    ۟    ﹠  🌟̷̷ 𝖣𝖾𝗆𝗂𝗍𝗋𝖺 𝖻𝗈𝗍 𝖽𝖾 𝗐𝗁𝖺𝗍𝗌𝖺𝗉𝗉
                                𝖧𝖺𝗉𝗉𝗒 ࣪ 🪼  ּ    𝅄  𔘓

    `ଓ     ๋    ࣪   🌻⃞      ࣭   @user ࣪      ੭     •`


🪷  ㅤ＇   ❚ ❘ Saludos soy Demitra un bot disponible para cualquier momento, y será un placer recibirte en este lugar donde cada presencia cuenta.

᷼⥃ᩥ🤖ׅ֟፝͠ᩬ⃞    ﹗ Te doy la bienvenida; espero que tu paso por aquí resulte agradable y deje una buena impresión.

᷼⥃ᩥ🧝🏽‍♀️ׅ֟፝͠ᩬ⃞    ﹗Puedes tomar tu lugar, observar con calma y participar cuando lo desees… siempre hay algo interesante por descubrir.  Usa "#menu" para más información.

💎 ㅤ＇   ❚ ❘  @desc

ㅤ୨ৎㅤ⏜︵⏜  ⪩ ⪨  ⏜︵⏜୨ৎ

𝅗ㅤׄㅤㅤִㅤㅤ♡⃘◌ㅤAdara : ownerㅤׄㅤ·ㅤִㅤִ`

            texto = texto
                .replace(/@desc/g, metadata?.desc || 'Sin descripción')
                .replace(/@group/g, metadata?.subject || 'Grupo')
                .replace(/@user/g, `@${user}`)

            await conn.sendMessage(id, {
                image: { url: ppuser },
                caption: texto,
                mentions: [participant]
            })
        }

    } catch (e) {
        console.error('[WELCOME ERROR]', e)
    }
}