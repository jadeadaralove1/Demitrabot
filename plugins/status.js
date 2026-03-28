// status_handler.js
// 🕶️ Informe secreto del bot: uptime, latencia, chats, memoria, CPU, etc.

import os from 'os'
import { execSync } from 'child_process'

let handler = async (m, { conn, isOwner }) => {
  try {
    // ─── Uptime y memoria ───
    const uptimeSeconds = process.uptime()
    const uptime = formatDuration(uptimeSeconds)

    const memTotal = os.totalmem()
    const memFree = os.freemem()
    const memUsed = memTotal - memFree

    // ─── CPU y plataforma ───
    const cpus = os.cpus()
    const cpuModel = cpus[0].model
    const cpuCores = cpus.length
    const load = os.loadavg()
    const nodeVersion = process.version
    const platform = `${os.type()} ${os.arch()} ${os.release()}`
    const pMem = process.memoryUsage()

    // ─── Chats y grupos ───
    let chatsCount = 0, groupsCount = 0, privateChats = 0
    try {
      const store = conn.store || conn.chats || {}
      const allJids = []

      if (conn.chats && typeof conn.chats === 'object' && !Array.isArray(conn.chats)) {
        for (let k of Object.keys(conn.chats)) allJids.push(k)
      } else if (Array.isArray(conn.chats)) {
        for (let item of conn.chats) allJids.push(item.id || item.jid)
      } else if (Array.isArray(Object.keys(store))) {
        for (let k of Object.keys(store)) allJids.push(k)
      }

      const uniq = Array.from(new Set(allJids)).filter(Boolean)
      chatsCount = uniq.length
      groupsCount = uniq.filter(j => j.endsWith('@g.us')).length
      privateChats = chatsCount - groupsCount
    } catch (e) {}

    // ─── Propietario / Bot ───
    const ownerInfo = (conn.user && conn.user.id)
      ? `${conn.user.name || 'Bot'} (${conn.user.id})`
      : 'Desconocido'

    // ─── Latencia ───
    let latency = '⏳ N/A'
    try {
      const start = Date.now()
      const sent = await conn.sendMessage(m.chat, { text: '🧭 Invocando la esencia...' })
      latency = `⚡ ${Date.now() - start} ms`
      try { await conn.deleteMessage(m.chat, { id: sent.key.id, remoteJid: m.chat, fromMe: true }) } catch {}
    } catch { latency = '❌ No disponible' }

    // ─── Info del paquete ───
    let pkgInfo = {}
    try { pkgInfo = JSON.parse(execSync('cat package.json').toString()) } 
    catch { pkgInfo = { name: 'bot', version: '❓ desconocida' } }

    // ─── Reporte ───
    const report = [
      `🕵️‍♂️ Informe Secreto — ${pkgInfo.name} v${pkgInfo.version}`,
      `⏱️ Tiempo activo: ${uptime} (${Math.floor(uptimeSeconds)}s)`,
      `⚡ Latencia espectral: ${latency}`,
      `🖥️ Entorno: ${platform}`,
      `🧬 Node.js: ${nodeVersion}`,
      `🧠 Núcleo: ${cpuModel} — ${cpuCores} núcleos`,
      `📊 Carga (1m/5m/15m): ${load.map(n => n.toFixed(2)).join(' / ')}`,
      `💾 Memoria: total=${formatBytes(memTotal)} usada=${formatBytes(memUsed)} libre=${formatBytes(memFree)}`,
      `📦 Proceso: rss=${formatBytes(pMem.rss)}, heap=${formatBytes(pMem.heapUsed)}, externo=${formatBytes(pMem.external || 0)}`,
      `💬 Chats: ${chatsCount} (👥 Grupos: ${groupsCount} • 👤 Privados: ${privateChats})`,
      `🧑‍💼 Identidad del maestro: ${ownerInfo}`
    ].join('\n')

    await conn.sendMessage(m.chat, { text: report })

    // ─── CSV solo para owner ───
    if (isOwner) {
      try {
        const allJids = []
        if (conn.chats && typeof conn.chats === 'object' && !Array.isArray(conn.chats)) {
          for (let k of Object.keys(conn.chats)) allJids.push(k)
        } else if (Array.isArray(conn.chats)) {
          for (let item of conn.chats) allJids.push(item.id || item.jid)
        }
        const uniq = Array.from(new Set(allJids)).filter(Boolean)
        const lines = ['jid,type,name']
        for (let jid of uniq) {
          const isGroup = jid.endsWith('@g.us')
          let name = ''
          try { name = await conn.getName(jid) } catch {}
          lines.push(`${jid},${isGroup ? 'group' : 'private'},"${name.replace(/"/g, '""')}"`)
        }
        const csv = lines.join('\n')
        await conn.sendMessage(m.chat, {
          document: Buffer.from(csv),
          fileName: '📁 chats_list.csv',
          mimetype: 'text/csv'
        })
      } catch {}
    }

  } catch (err) {
    console.error(err)
    m.reply('💥 La oscuridad ha fallado: ' + err.message)
  }
}

// ─── Helpers ───
function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 B'
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

function formatDuration(seconds) {
  seconds = Math.floor(seconds)
  const d = Math.floor(seconds / (3600 * 24))
  seconds %= 3600 * 24
  const h = Math.floor(seconds / 3600)
  seconds %= 3600
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${d}d ${h}h ${m}m ${s}s`
}

// ─── Comandos válidos ───
handler.command = ['status', 'report', 'estado', 'informe']
handler.tags = ['info']
handler.help = ['status', 'report', 'estado', 'informe']

export default handler