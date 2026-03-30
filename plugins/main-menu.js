import fs from 'fs'
import fetch from 'node-fetch'
import { database } from '../lib/database.js'

const handler = async (m, { conn }) => {
    try {
        const botname = global.botname || global.botName || 'Zero Two'
        const pluginFiles = fs.readdirSync('./plugins').filter(file => file.endsWith('.js'))
        const grouped = {}

        for (const file of pluginFiles) {
            try {
                const plugin = (await import(`../plugins/${file}`)).default
                const tags = plugin?.tags || ['misc']
                const cmd = plugin?.command?.[0] || file.replace('.js', '')

                for (const tag of tags) {
                    if (!grouped[tag]) grouped[tag] = []
                    grouped[tag].push(cmd)
                }
            } catch {
                const cmd = file.replace('.js', '')
                if (!grouped['misc']) grouped['misc'] = []
                grouped['misc'].push(cmd)
            }
        }

        const totalCmds = Object.values(grouped).flat().length
        const totalUsers = Object.keys(database.data.users || {}).length
        const registeredUsers = Object.values(database.data.users || {}).filter(u => u.registered).length

        let seccionesTexto = Object.entries(grouped).map(([tag, cmds]) =>
`𖤐 *${tag.toUpperCase()}*
${cmds.map(c => `  ꕦ ${c}`).join('\n')}
`
        ).join('\n')

        const zonaHoraria = 'America/Bogota'
        const ahora = new Date()
        const hora = parseInt(ahora.toLocaleTimeString('es-CO', { timeZone: zonaHoraria, hour: '2-digit', hour12: false }))

        let saludo, carita
        if (hora >= 5 && hora < 12) {
            saludo = 'buenos días'
            carita = '(＊^▽^＊) ☀️'
        } else if (hora >= 12 && hora < 18) {
            saludo = 'buenas tardes'
            carita = '(｡•̀ᴗ-)✧ 🌸'
        } else {
            saludo = 'buenas noches'
            carita = '(◕‿◕✿) 🌙'
        }

        let menuTexto = `
ㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ
橫㈵𓂂ㅤㅤ𓐮𝖣ۣؗ𝖤ۣؗ𝖬ۣؗ𝖨ۣؗ𝖳ۣؗ𝖱ۣؗ𝖠ㅤㅤ▞ㅤㅤ𓆭𓆭₂₈₎
◯◯▸ㅤㅤ⎯⎯▬𝖫ؗOVEㅤㅤ🔘ㅤㅤ ▓█

⟍𝄄𝄄𝄄𝄄𝄄₂₈₎ㅤㅤ 🔲ㅤㅤ#𝖼𝗋𝖾𝖺𝗍𝗈𝗋ㅤㅤ⬤⬤⏋

> ㅤㅤㅤㅤ﹫Demitra(Adara) ㅤㅤ𔘓



ㅤ  𝗐𝖾𝗅𝖼𝗈𝗆𝖾ㅤ𝗌𝗈𝗒ㅤ𝗗᤻͟𝗲᤻͟𝗺᤻͟𝗶᤻͟𝗍᤻͟𝗋᤻͟𝗮᤻͟ㅤ𝗅𝖺ㅤ
ㅤ     𝗌𝗈𝗇𝗋𝗂𝗌𝖺ㅤ𝗁𝖾𝖼𝗁𝖺ㅤ𝖼͟𝗈᤻͟𝖽⵿𝗂𝗀᤻͟𝗈

ㅤ   𝖺ㅤ𝖼𝗈𝗇𝗍𝗂𝗇𝗎𝖺𝖼𝗂𝗈𝗇ㅤ𝗅𝖾ㅤ𝗆𝗎𝖾𝗌
ㅤㅤ   -𝗍𝗋𝗈ㅤ𝗆𝗂𝗌ㅤ𝖼⵿𝗈͟𝗆᤻͟𝖺᤻͟𝗇᤻͟𝖽᤻͟𝗈⵿𝗌 75

＿＿／ ㅤㅤ ◢Principal + Main. ㅤㅤ  攤䥵𓌙

.reg
.unreg
.perfil

＿＿／ ㅤ ㅤ   Herramientas   ㅤ  攤䥵𓌙


.nable/feature/función
.ping/p
.menu/help/ayuda
.chatgpt
.bot
.modoadmin/soloadmins
.status/estado
.traducir/translate/tr
.ver/read/readvo
.pp/foto/profilepic/ppuser
.iq
.inactivos
.horario/hora/time/times
.hd/upscale/mejorar
.hack
.flux
.cdn
.join
＿＿／ ㅤ ㅤ ◢Groupㅤ ㅤ  攤䥵𓌙

.promote/promover
.open/abrir
.hidetag/notificar/notify/tag/anuncio
.link/enlace
.invocar
.demote
.close/cerrar
.antilink
.advertencias/warnlist
.advertir/advertencia/warn/warning
.gp/groupinfo
.delwarn/unwarn/quitarad
.mute
.unmute
.kick/echar/hechar/sacar/ban
.leave/salir

＿＿／ ㅤ ㅤ ◢Stickers ㅤ ㅤ  攤䥵𓌙

.sticker / .s
.toimg / .toimage
.brat
.bratv
.emojimix
.qq

＿＿／ ㅤ ㅤ ◢Socket+ㅤ ㅤ  攤䥵𓌙
.codes/qr

／ ㅤ ㅤ ◢ Descargas ㅤ ㅤ  攤䥵𓌙

• .tiktok / .tt / .tiktoksearch / .ttsearch / .tts
• .play2
• .play / .ytamp3
• .pinterest / .pin
• .apk / .apkd / .apkdl / .apks
• .ig / .instagram

／ ㅤ ㅤ ◢  Ownerㅤ ㅤ  攤䥵𓌙

.update
.restart/reiniciar
.lid/mylid/tulid
.get
.owner/creatora/dueña
.autoadmin
.kickall

／ ㅤ ㅤ ◢ Expresiones ㅤ ㅤ  攤䥵𓌙

> ㅤㅤㅤㅤ@𝗉𝗋𝗈𝗑𝗂𝗆𝗈ㅤㅤ𔘓



▙▅▚ ㅤ ⇲𝖢ؗ𝖧ۣۤ𝖠ؗ𝖭ۖ𝖭ۤ𝖤ۣ𝖫ㅤ⦙⦙⦙◗ ㅤ 𓂧⁸⁶

> https://whatsapp.com/channel/0029VbBvrmwC1Fu5SYpbBE2A



ㅤㅤㅤㅤ𝖼𝗋𝖾𝖺𝗍𝗈𝗋ㅤㅤ𔘓ㅤㅤ𝗌𝗁𝖾𝗋𝗒`.trim()

        const response = await fetch('https://causas-files.vercel.app/fl/9vs2.jpg')
const buffer = await response.buffer()

await conn.sendMessage(m.chat, {
    image: buffer,
    caption: menuTexto,
    mentions: [m.sender],
    contextInfo: {
        externalAdReply: {
            title: 'Demitra bot',
            body: 'BOMSHAKALACA',
            mediaType: 1,
            renderLargerThumbnail: true,
            sourceUrl: 'https://whatsapp.com/channel/0029Vb6p68rF6smrH4Jeay3Y'
        }
    }
}, { quoted: m })

    } catch (e) {
        console.error(e)
        m.reply('Uy.. lgo salió mal al generar el menú... prueba de nuevo')
    }
}

handler.help = ['menu']
handler.tags = ['main']
handler.command = ['menu', 'help', 'ayuda']

export default handler