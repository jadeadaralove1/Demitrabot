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

            let texto = `ᳮ ֶᦒ֒ ꩝꩝ 𝅭〔 *Wҽʅƈσɱҽ* 〕𝅭

Bienvenidx seas a este lindo @group

@desc

For :: @user`

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