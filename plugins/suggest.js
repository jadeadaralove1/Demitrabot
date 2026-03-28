const handler = async (m, { conn, args, command, text }) => {
  const texto = (text || args.join(' ')).trim()
  const now = Date.now()
  global.db.data.users[m.sender] = global.db.data.users[m.sender] || {}
  const userData = global.db.data.users[m.sender]

  const cooldown = userData.sugCooldown || 0
  const restante = cooldown - now

  if (restante > 0) return m.reply(`⏳ Espera ${msToTime(restante)} antes de enviar otro reporte.`)
  if (!texto) return m.reply('⚠️ Debes escribir tu reporte o sugerencia.')
  if (texto.length < 10) return m.reply('⚠️ Mensaje demasiado corto (mínimo 10 caracteres).')

  const fechaLocal = new Date().toLocaleDateString('es-MX', { weekday:'long', year:'numeric', month:'long', day:'numeric' })
  const esReporte = ['report','reporte'].includes(command)
  const tipo = esReporte ? 'REPORTE' : 'SUGERENCIA'
  const tipo2 = esReporte ? '⭐⃞░ Reporte' : '⭐⃞░ Sugerencia'
  const user = m.pushName || 'Usuario'
  const numero = m.sender.split('@')[0]

  let pp
  try { pp = await conn.profilePictureUrl(m.sender, 'image') }
  catch { pp = 'https://files.catbox.moe/78jp9j.jpeg' }

  // Mensaje formateado
  const reportMsg =
`▙▅▚  ${tipo} recibido
👤 Usuario: ${user}
📱 Número: wa.me/${numero}
📅 Fecha: ${fechaLocal}

💬 Mensaje:
${texto}`

  for (const num of global.owner || []) {
    try {
      await conn.sendMessage(`${num}@s.whatsapp.net`, {
        text: reportMsg,
        contextInfo: {
          externalAdReply: {
            title: tipo2,
            body: '🫧 Nuevo mensaje para el staff',
            mediaType: 2,
            thumbnail: pp ? await (await fetch(pp)).buffer() : null,
            sourceUrl: 'https://wa.me/' + numero
          }
        }
      })
    } catch(e) { console.error(e) }
  }

  userData.sugCooldown = now + 24 * 60 * 60000
  m.reply('✅ Tu mensaje fue enviado al staff correctamente.')
}

// Formato tiempo
function msToTime(duration) {
  const seconds = Math.floor((duration/1000)%60)
  const minutes = Math.floor((duration/(1000*60))%60)
  const hours = Math.floor((duration/(1000*60*60))%24)
  const days = Math.floor(duration/(1000*60*60*24))
  const parts = []
  if(days) parts.push(`${days} día${days>1?'s':''}`)
  if(hours) parts.push(`${hours} hora${hours>1?'s':''}`)
  if(minutes) parts.push(`${minutes} minuto${minutes>1?'s':''}`)
  parts.push(`${seconds} segundo${seconds>1?'s':''}`)
  return parts.join(', ')
}

handler.help = ['report','reporte','sug','suggest']
handler.tags = ['info']
handler.command = ['report','reporte','sug','suggest']

export default handler