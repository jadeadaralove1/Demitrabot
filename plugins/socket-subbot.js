import { startSubBot } from '../lib/subs.js'
import fs from 'fs'
import path from 'path'

let commandFlags = {}

let handler = async (m, { conn, args, command }) => {

  // ✅ FIX GLOBAL DB
  global.db = global.db || {}
  global.db.data = global.db.data || {}
  global.db.data.users = global.db.data.users || {}

  if (!global.db.data.users[m.sender]) {
    global.db.data.users[m.sender] = { Subs: 0 }
  }

  const user = global.db.data.users[m.sender]

  // ⏱️ COOLDOWN
  const lastSubs = user.Subs || 0
  const cooldown = 120000
  const remaining = cooldown - (Date.now() - lastSubs)

  if (remaining > 0) {
    return m.reply(`🕐 Debes esperar *${msToTime(remaining)}* para volver a intentar.`)
  }

  // ✅ RUTA CORRECTA (FIX IMPORTANTE)
  const subsPath = path.join(process.cwd(), 'Sessions', 'Subs')

  if (!fs.existsSync(subsPath)) {
    fs.mkdirSync(subsPath, { recursive: true })
  }

  const subsCount = fs.readdirSync(subsPath)
    .filter(dir => fs.existsSync(path.join(subsPath, dir, 'creds.json')))
    .length

  if (subsCount >= 50) {
    return m.reply(`❌ No hay espacio disponible para un Sub-Bot.`)
  }

  const phone = args[0]
    ? args[0].replace(/\D/g, '')
    : m.sender.split('@')[0]

  const isQR = command === 'qrs'

  const caption = isQR
    ? '📸 Escanea el código QR para conectar tu Sub-Bot'
    : '🔑 Usa este código para vincular tu Sub-Bot con tu número'

  commandFlags[m.sender] = true

  await startSubBot(
    m,
    conn,
    caption,
    !isQR,
    phone,
    m.chat,
    commandFlags,
    true
  )

  user.Subs = Date.now()
}

handler.help = ['codes', 'qrs']
handler.tags = ['socket']
handler.command = ['codes', 'qrs']

export default handler

function msToTime(duration) {
  const seconds = Math.floor((duration / 1000) % 60)
  const minutes = Math.floor((duration / (1000 * 60)) % 60)

  return minutes
    ? `${minutes} minuto${minutes > 1 ? 's' : ''}, ${seconds} segundo${seconds > 1 ? 's' : ''}`
    : `${seconds} segundo${seconds > 1 ? 's' : ''}`
}