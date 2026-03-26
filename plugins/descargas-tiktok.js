import axios from 'axios'

let handler = async (m, { conn, args }) => {

  if (!args.length) {
    return m.reply('ෆ Por favor, ingresa un término de búsqueda o enlace de TikTok.')
  }

  const text = args.join(" ")
  const isUrl = /(?:https?:\/\/)?(?:www\.|vm\.|vt\.|t\.)?tiktok\.com\/[^\s&]+/i.test(text)

  try {

    if (m.react) await m.react('🕒')

    // ======================
    // 🎥 DESCARGA POR LINK
    // ======================
    if (isUrl) {

      const res = await axios.get(`https://www.tikwm.com/api/?url=${encodeURIComponent(text)}&hd=1`)
      const data = res.data?.data

      if (!data || (!data.play && !data.images)) {
        if (m.react) await m.react('✖️')
        return m.reply('《✧》 No se encontró contenido válido.')
      }

      const caption = `▙▅▚  ⇲ DEMITRA
    
     
         tu video se
      está descargando

TÍTULO
> ${data.title || 'Sin título'}

LIKES
> ${(data.digg_count || 0).toLocaleString()}

Aquí tu búsqueda
> HECHO POR DEMITRA


         — Powered by Demitra`.trim()

      // 🖼️ SLIDESHOW
      if (Array.isArray(data.images) && data.images.length > 0) {

        const medias = data.images.slice(0, 10).map(url => ({
          type: 'image',
          data: { url },
          caption
        }))

        await conn.sendAlbumMessage(m.chat, medias, { quoted: m })

        if (data.music) {
          await conn.sendMessage(m.chat, {
            audio: { url: data.music },
            mimetype: 'audio/mp4',
            fileName: 'tiktok_audio.mp4'
          }, { quoted: m })
        }

        if (m.react) await m.react('✔️')
        return
      }

      // 🎬 VIDEO
      if (data.play) {

        await conn.sendMessage(m.chat, {
          video: { url: data.play },
          caption
        }, { quoted: m })

        if (data.music) {
          await conn.sendMessage(m.chat, {
            audio: { url: data.music },
            mimetype: 'audio/mp4',
            fileName: 'tiktok_audio.mp4'
          }, { quoted: m })
        }

        if (m.react) await m.react('✔️')
        return
      }

      if (m.react) await m.react('✖️')
      return m.reply('《✧》 No se pudo procesar el contenido.')
    }

    // ======================
    // 🔍 BÚSQUEDA
    // ======================
    await m.reply('🔎 Buscando...')

    const form = new URLSearchParams()
    form.append('keywords', text)
    form.append('count', '10')
    form.append('cursor', '0')
    form.append('HD', '1')

    const res = await axios({
      method: 'POST',
      url: 'https://tikwm.com/api/feed/search',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Cookie': 'current_language=en'
      },
      data: form.toString()
    })

    let results = res.data?.data?.videos?.filter(v => v.play) || []

    if (!results.length) {
      if (m.react) await m.react('✖️')
      return m.reply('《✧》 No se encontraron resultados.')
    }

    const medias = results.slice(0, 10).map(v => {
      const caption = `ㅤ▙▅▚  ⇲ DEMITRA
    
     
       tu búsqueda se
      está descargando

TÍTULO
> ${v.title || 'Sin título'}

LIKES
> ${(v.digg_count || v.stats?.likes || 0).toLocaleString()}
Aquí tu búsqueda
> HECHO POR DEMITRA


         — Powered by Demitra`

      return {
        type: 'video',
        data: { url: v.play },
        caption
      }
    })

    await conn.sendAlbumMessage(m.chat, medias, { quoted: m })

    if (m.react) await m.react('✔️')

  } catch (e) {
    if (m.react) await m.react('✖️')
    m.reply(`❌ Error: ${e.message}`)
  }
}

handler.command = ['tiktok', 'tt', 'tiktoksearch', 'ttsearch', 'tts']
handler.category = 'downloader'

export default handler