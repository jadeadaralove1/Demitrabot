import fs from 'fs'
import { database } from '../lib/database.js'

const handler = async (m, { conn }) => {
    try {
        const botname = global.botname || global.botName || 'Demitra'
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
ㅤㅤ   -𝗍𝗋𝗈ㅤ𝗆𝗂𝗌ㅤ𝖼⵿𝗈͟𝗆᤻͟𝖺᤻͟𝗇᤻͟𝖽᤻͟𝗈⵿𝗌 ${totalCmds}

＿＿／ ㅤㅤ ◢Principal + Main. ㅤㅤ  攤䥵𓌙

.report / .reporte / .sug / .suggest
.status / .estado
.ping / .p
.invite / .invitar
.menu / .help / .allmenu

＿＿／ ㅤ ㅤ     Perfil   ㅤ  攤䥵𓌙

.profile / .perfil
.setpasatiempo / .sethobby
.setgenre
.setdescription / .setdesc
.marry / .casarse
.divorce
.delpasatiempo / .removehobby
.delgenre
.deldescription / .deldesc
.afk

＿＿／ ㅤ ㅤ ◢Groupㅤ ㅤ  攤䥵𓌙

.todos / .invocar / .tagall
.setwarnlimit
.warn
.delwarn
.setgpdesc
.setgpbanner
.setgpname
.revoke / .restablecer
.welcome / .bienvenida
.goodbye / .despedida
.alerts / .alertas
.antilink / .antienlaces / .antilinks
.adminonly / .onlyadmin (on, off)
.link
.kick
.hidetag / .tag
.gp / .groupinfo
.promote
.demote
.count / .mensajes / .messages / .msgcount
.open / .abrir
.close / .closet / .cerrar
.bot

＿＿／ ㅤ ㅤ ◢Stickers ㅤ ㅤ  攤䥵𓌙

.sticker / .s
.toimg / .toimage
.brat
.bratv
.emojimix
.qc

＿＿／ ㅤ ㅤ ⊿ Utils ㅤ ㅤ  攤䥵𓌙
.get / .fetch
.pfp / .getpic
.tourl
.hd / .enhance / .remini
.inspect / .inspeccionar
.ver / .read / .readvo
.say / .decir
.translate / .trad / .traducir

＿＿／ ㅤ ㅤ ◢Socket+ㅤ ㅤ  攤䥵𓌙

.join / .unir
.leave
.logout
.reload
.self
.codes / .qrs

／ ㅤ ㅤ ◢ Descargas ㅤ ㅤ  攤䥵𓌙

• .tiktok / .tt / .tiktoksearch / .ttsearch / .tts
• .play2
• .play / .ytamp3
• .pinterest / .pin
• .apk / .apkd / .apkdl / .apks
• .ig / .instagram
／ ㅤ ㅤ ◢  Game ㅤ ㅤ  攤䥵𓌙

.top
.sopa/sopadeletras
.rastrear
.ppt
.pedido
.orcado/ahorcado
.meme
.formarpareja5
.formarpareja/formarparejas
.bot/demi
.confesar/confesiones
.adivina/adivinaemoji
.acertijo/riddle

／ ㅤ ㅤ ◢ Expresiones ㅤ ㅤ  攤䥵𓌙

.hug/abrazo
.happy/feliz
.angry/enojado
.airkiss/lanzarbeso/lanzarkiss
.dance/bailar
.hi/saludos

> ㅤㅤㅤㅤ@𝗉𝗋𝗈𝗑𝗂𝗆𝗈ㅤㅤ𔘓



▙▅▚ ㅤ ⇲𝖢ؗ𝖧ۣۤ𝖠ؗ𝖭ۖ𝖭ۤ𝖤ۣ𝖫ㅤ⦙⦙⦙◗ ㅤ 𓂧⁸⁶

> https://whatsapp.com/channel/0029VbBvrmwC1Fu5SYpbBE2A



ㅤㅤㅤㅤ𝖼𝗋𝖾𝖺𝗍𝗈𝗋ㅤㅤ𔘓ㅤㅤ𝗌𝗁𝖾𝗋𝗒` // dejé esto corto para no duplicarte el bloque gigante

        await conn.sendMessage(m.chat, {
            text: menuTexto,
            mentions: [m.sender],
            contextInfo: {
                mentionedJid: [m.sender],
                isForwarded: true,
                forwardingScore: 999,
                externalAdReply: {
                    title: 'DEMITRA - Menú Principal',
                    body: `${totalCmds} comandos disponibles`,
                    mediaType: 1,
                    renderLargerThumbnail: true,
                    thumbnailUrl: 'https://files.catbox.moe/723ln7.jpg',
                    sourceUrl: 'https://whatsapp.com/channel/0029VbBvrmwC1Fu5SYpbBE2A'
                }
            }
        }, { quoted: m })

    } catch (e) {
        console.error(e)
        m.reply('Demi dice que algo salió mal al generar el menú... prueba de nuevo.')
    }
}

handler.help = ['menu']
handler.tags = ['main']
handler.command = ['menu', 'help', 'ayuda']

export default handler