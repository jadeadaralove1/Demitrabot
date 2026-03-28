import axios from 'axios'

// 🔎 validar link
function isInstagram(url = '') {
  return /instagram\.com/i.test(url)
}

let handler = async (m, { conn, args }) => {

  const query = args.join(' ').trim()

  if (!query) return m.reply('𐄹 ۪ ׁ ⚠️ᩚ̼ 𖹭̫ ▎Ingresa un link de Instagram')
  if (!isInstagram(query)) return m.reply('❌ Link inválido')

  try {

    await conn.sendMessage(m.chat, {
      react: { text: '🕒', key: m.key }
    })

    let data = []

    // 🔹 API 1 (vreden)
    try {
      const api1 = `${global.APIs.vreden.url}/api/igdownload?url=${encodeURIComponent(query)}`
      const res1 = await axios.get(api1)

      if (res1.data?.resultado?.respuesta?.datos?.length) {
        data = res1.data.resultado.respuesta.datos.map(v => v.url)
      }

    } catch (e) {
      console.log('API 1 error:', e.message)
    }

    // 🔹 API 2 (delirius)
    if (!data.length) {
      try {
        const api2 = `${global.APIs.delirius.url}/download/instagram?url=${encodeURIComponent(query)}`
        const res2 = await axios.get(api2)

        if (res2.data?.status && res2.data?.data?.length) {
          data = res2.data.data.map(v => v.url)
        }

      } catch (e) {
        console.log('API 2 error:', e.message)
      }
    }

    // ❌ nada encontrado
    if (!data.length) {
      throw new Error('NO_VIDEO')
    }

    // 📤 enviar videos
    for (let media of data) {
      await conn.sendMessage(m.chat, {
        video: { url: media },
        caption: '𐄹 ۪ ׁ ✅ᩚ̼ 𖹭̫ ▎Demitra descargó esto para ti.'
      }, { quoted: m })
    }

    await conn.sendMessage(m.chat, {
      react: { text: '✅', key: m.key }
    })

  } catch (e) {

    let msg = '𐄹 ۪ ׁ ❌ᩚ̼ 𖹭̫ ▎Error\n\n'

    if (e.message === 'NO_VIDEO') {
      msg += '🚫 No se pudo obtener el contenido\n'
      msg += '◜࣭࣭࣭࣭࣭᷼💡̸̷ׁᮬᰰᩫ࣭࣭࣭࣭ Las APIs no respondieron o el link no es válido'
    } else {
      msg += '🌐 Error de conexión\n' + e.message
    }

    await m.reply(msg)
  }
}

handler.command = ['ig', 'instagram']
handler.category = 'downloader'
handler.description = 'Descarga videos de Instagram'

export default handler