let handler = async (m, { conn, args, usedPrefix, command }) => {
  const groupMetadata = m.isGroup ? await conn.groupMetadata(m.chat).catch(() => null) : null
  const groupParticipants = groupMetadata?.participants || []

  const allMentions = groupParticipants
    .map(p => conn.decodeJid(p.jid || p.id || p.lid || p.phoneNumber))
    .filter(Boolean)

  const userText = (args.join(' ') || '').trim()
  const src = m.quoted || m

  const hasImage = Boolean(src.message?.imageMessage || src.mtype === 'imageMessage')
  const hasVideo = Boolean(src.message?.videoMessage || src.mtype === 'videoMessage')
  const hasAudio = Boolean(src.message?.audioMessage || src.mtype === 'audioMessage')
  const hasSticker = Boolean(src.message?.stickerMessage || src.mtype === 'stickerMessage')

  const originalText = (src.caption || src.text || src.body || '').trim()
  const textToCheck = (userText || originalText || '').trim()

  const explicitMentions = allMentions.filter(jid =>
    textToCheck.includes(jid.split('@')[0])
  )

  try {
    const options = {
      quoted: null,
      mentions: explicitMentions.length ? explicitMentions : []
    }

    if (hasImage || hasVideo) {
      const media = await src.download()

      if (hasImage) {
        return conn.sendMessage(m.chat, {
          image: media,
          caption: textToCheck || '',
          ...options
        })
      } else {
        return conn.sendMessage(m.chat, {
          video: media,
          mimetype: 'video/mp4',
          caption: textToCheck || '',
          ...options
        })
      }
    }

    if (hasAudio) {
      const media = await src.download()
      return conn.sendMessage(m.chat, {
        audio: media,
        mimetype: 'audio/mp4',
        fileName: 'say.mp3',
        ...options
      })
    }

    if (hasSticker) {
      const media = await src.download()
      return conn.sendMessage(m.chat, {
        sticker: media,
        ...options
      })
    }

    if (textToCheck) {
      return conn.sendMessage(m.chat, {
        text: textToCheck,
        ...options
      })
    }

    return m.reply('> 𓈒 ׂ 🦭੭ ᮫ : Por favor, escribe el texto que deseas repetir.')

  } catch (e) {
    return m.reply(
      `> An unexpected error occurred while executing command *${usedPrefix + command}*.\n> [Error: *${e.message}*]`
    )
  }
}

handler.help = ['say', 'decir']
handler.tags = ['grupo']
handler.command = ['say', 'decir']

export default handler