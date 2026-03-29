export async function participantsUpdate(update, conn) {
    try {
        const { id, participants, action } = update

        if (action === 'promote') {
            for (let user of participants) {
                await conn.sendMessage(id, {
                    text: `👑 @${user.split('@')[0]} ahora es ADMIN`,
                    mentions: [user]
                })
            }
        }

        if (action === 'demote') {
            for (let user of participants) {
                await conn.sendMessage(id, {
                    text: `⚠️ @${user.split('@')[0]} ya no es admin`,
                    mentions: [user]
                })
            }
        }

    } catch (e) {
        console.error(e)
    }
}