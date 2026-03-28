import os from 'os'
import { performance } from 'perf_hooks'
import { sizeFormatter } from 'human-readable'

const format = sizeFormatter({
  std: 'JEDEC',
  decimalPlaces: 2,
  keepTrailingZeroes: false,
  render: (literal, symbol) => `${literal} ${symbol}B`
})

let handler = async (m, { conn }) => {
  const start = performance.now()

  const botId = conn.user.jid || conn.user.id.split(':')[0] + "@s.whatsapp.net"
  const botname = global.db.data.settings?.[botId]?.botname || 'Bot'

  const users = Object.keys(global.db.data.users || {}).length
  const groups = Object.keys(global.db.data.chats || {}).length

  const ramTotal = format(os.totalmem())
  const ramUsada = format(os.totalmem() - os.freemem())

  const totalCommands = Object.values(global.plugins || {}).reduce((acc, plugin) => {
    if (!plugin) return acc

    let cmds = []

    if (Array.isArray(plugin.command)) cmds = plugin.command
    else if (typeof plugin.command === 'string') cmds = [plugin.command]
    else if (Array.isArray(plugin.help)) cmds = plugin.help

    return acc + cmds.length
  }, 0)

  const finalCommands = totalCommands || Object.keys(global.plugins || {}).length

  const uptime = process.uptime()
  const h = Math.floor(uptime / 3600)
  const mnt = Math.floor((uptime % 3600) / 60)
  const s = Math.floor(uptime % 60)

  const ping = (performance.now() - start).toFixed(2)

  const mensaje =
`🧚‍♀️  ㅤ＇   ❚ ❘ *${botname}*
╭━━━〔 ✦ ESTADO ✦ 〕━━━⬣
┃ 👥 Usuarios » *${users}*
┃ 💬 Grupos » *${groups}*
┃ 🎯 Comandos » *${finalCommands}*
┃ 🧠 RAM » *${ramUsada} / ${ramTotal}*
┃ ⚙️ CPU » *${os.cpus().length} cores*
┃ 🖥️ Sistema » *${os.type()}*
┃ ⏱️ Uptime » *${h}h ${mnt}m ${s}s*
┃ ⚡ Ping » *${ping} ms*
╰━━━━━━━━━━━━━━━━⬣`

  await conn.sendMessage(m.chat, {
    image: { url: 'https://files.catbox.moe/ct9p00.jpeg' }, // 🔥 Cambia el link si quieres
    caption: mensaje
  }, { quoted: m })
}

handler.help = ['status', 'estado']
handler.tags = ['info']
handler.command = ['status', 'estado']

export default handler