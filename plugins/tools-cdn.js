import { downloadContentFromMessage } from '@whiskeysockets/baileys'

let handler = async (m, { conn }) => {

  const msg = m.quoted ? m.quoted : m
  const mime = msg.msg?.mimetype || msg.mimetype || ''

  if (!mime)
    return m.reply('❌ Responde a un archivo con *.cdn*')

  if (!/gif|video|image|audio/.test(mime))
    return m.reply('❌ Formato no compatible.')

  await m.reply('⏳ Descargando archivo...')

  try {

    const type = mime.split('/')[0]
    const stream = await downloadContentFromMessage(msg.msg || msg, type)

    let buffer = Buffer.from([])
    for await (const chunk of stream) {
      buffer = Buffer.concat([buffer, chunk])
    }

    if (!buffer.length) throw new Error('No se pudo descargar el archivo')

    const extension = mime.split('/')[1] || 'bin'

    await m.reply('⏳ Subiendo a CDN...')

    const form = new FormData()
    form.append('files', new Blob([buffer], { type: mime }), `archivo.${extension}`)
    form.append('expiresIn', 'never')

    const response = await fetch('https://causas-files.vercel.app/upload', {
      method: 'POST',
      body: form
    })

    const data = await response.json()
    if (!response.ok) throw new Error(data.error || 'Error desconocido')

    const publicUrl = data.files?.[0]?.publicUrl
    if (!publicUrl) throw new Error('No se recibió URL pública')

    await m.reply(
      `𐄹 ۪ ׁ ✅ᩚ̼ 𖹭̫ ▎ *Subido exitosamente!*\n\n` +
      `░📦ֶؙ :: *Tipo:* ${mime}\n` +
      `> *URL:*\n${publicUrl}`
    )

  } catch (e) {
    await m.reply(`Error: ${e.message}`)
  }
}

handler.help = ['cdn']
handler.tags = ['tools']
handler.command = ['cdn']

export default handler