import yts from 'yt-search'
import fetch from 'node-fetch'
import { getBuffer } from '../../lib/message.js'

async function getVideoInfo(query, videoMatch) {
  const search = await yts(query)
  if (!search.all.length) return null
  const videoInfo = videoMatch
    ? search.videos.find(v => v.videoId === videoMatch[1]) || search.all[0]
    : search.all[0]
  return videoInfo || null
}

const run = async (client, m, args, usedPrefix, command) => {
  try {

    if (!args[0]) {
      return m.reply('💔 Demitra dice: escribe el nombre o enlace del video.')
    }

    const text = args.join(' ')
    const videoMatch = text.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/|v\/))([a-zA-Z0-9_-]{11})/)
    const query = videoMatch ? 'https://youtu.be/' + videoMatch[1] : text

    let url = query
    let title = null
    let thumbBuffer = null

    try {

      const videoInfo = await getVideoInfo(query, videoMatch)

      if (videoInfo) {

        url = videoInfo.url
        title = videoInfo.title
        thumbBuffer = await getBuffer(videoInfo.image)

        const vistas = (videoInfo.views || 0).toLocaleString()

        const infoMessage = `ㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ
▙▅▚ㅤㅤ⇲DEMITRAㅤㅤ⦙⦙⦙◗ㅤㅤ𓂧⁸⁶
𐇡𐇡 ㅤㅤ ㏩𓄼ㅤㅤ◢𝖫OVEㅤㅤ 🔲ㅤㅤ⬤⬤


ㅤㅤㅤ  ㅤ𝗍𝗎   𝖼𝖺𝗇𝖼𝗂𝗈𝗇   𝗌𝖾ㅤ
ㅤㅤ ㅤ ㅤ𝖾𝗌𝗍𝖺 𝖽𝖾𝗌𝖼𝖺𝗋𝗀𝖺𝗇𝖽𝗈.ㅤ


＿＿／ ㅤㅤ𓐮𝖳𝖨𝖳𝖴𝖫𝖮ㅤㅤ🔘ㅤㅤ ◥
> ${title}.

＿＿／ ㅤㅤ𓐮𝖳𝖨𝖤𝖬𝖯𝖮ㅤ   🔘   ㅤ ◥
> ${videoInfo.timestamp || 'Desconocido'}*.

＿＿／ ㅤㅤ𓐮𝖵𝖨𝖲𝖳𝖠𝖲ㅤㅤ🔘ㅤㅤ ◥
> *${vistas}*.

＿＿／ ㅤㅤ𓐮PUBLICADOㅤㅤ🔘ㅤㅤ ◥
> ${videoInfo.ago || 'Desconocido'}*.

＿＿／ ㅤㅤ𓐮𝖤𝖭𝖫𝖠𝖢𝖤ㅤㅤ🔘ㅤㅤ◥
> *${url}*.


＿＿／⬤ㅤㅤ 𝖲𝖤𝖱𝖵𝖤𝖱 ㅤㅤ[橫㦥]


>𝖤𝖭𝖵𝖨𝖠𝖣𝖮 / 𝖤𝖭𝖵𝖨𝖠𝖭𝖣𝖮 / 𝖫𝖫𝖤𝖦𝖠𝖣𝖮<


ㅤㅤ      𝖼𝗋𝖾𝖺𝗍𝗈𝗋ㅤㅤ𔘓ㅤㅤ𝗌𝗁𝖾𝗋𝗒𝗅
ㅤ`

        await client.sendMessage(
          m.chat,
          { image: thumbBuffer, caption: infoMessage, mentions: [m.sender] },
          { quoted: m }
        )
      }

    } catch {}

    const audio = await getAudioFromApis(url)

if (!audio || !audio.url || typeof audio.url !== 'string') {
  return m.reply('💔 Demitra no pudo descargar el audio. Intenta más tarde.')
}

const audioBuffer = await getBuffer(audio.url)

    const safeTitle = typeof title === 'string' ? title : 'audio'

await client.sendMessage(
  m.chat,
  {
    audio: audioBuffer,
    fileName: `${safeTitle}.mp3`,
    mimetype: 'audio/mpeg'
  },
  { quoted: m }
)

  } catch (e) {

    await m.reply(
`💔 Demitra encontró un error ejecutando *${usedPrefix + command}*

Error: ${e.message}`
    )

  }
}

export default {
  command: ['play', 'mp3', 'ytmp3', 'ytaudio', 'playaudio'],
  category: 'downloader',
  description: 'Descarga audio de YouTube',
  run
}

async function getAudioFromApis(url) {

  const apis = [
    { endpoint: `${global.APIs.adonix.url}/download/ytaudio?apikey=${global.APIs.adonix.key}&url=${encodeURIComponent(url)}`, extractor: r => r?.data?.url },
    { endpoint: `${global.APIs.ootaizumi.url}/downloader/youtube/play?query=${encodeURIComponent(url)}`, extractor: r => r.result?.download },
    { endpoint: `${global.APIs.vreden.url}/api/v1/download/youtube/audio?url=${encodeURIComponent(url)}&quality=256`, extractor: r => r.result?.download?.url },
    { endpoint: `${global.APIs.stellar.url}/dl/ytdl?url=${encodeURIComponent(url)}&format=mp3&key=${global.APIs.stellar.key}`, extractor: r => r.result?.download },
    { endpoint: `${global.APIs.ootaizumi.url}/downloader/youtube?url=${encodeURIComponent(url)}&format=mp3`, extractor: r => r.result?.download },
    { endpoint: `${global.APIs.vreden.url}/api/v1/download/play/audio?query=${encodeURIComponent(url)}`, extractor: r => r.result?.download?.url },
    { endpoint: `${global.APIs.nekolabs.url}/downloader/youtube/v1?url=${encodeURIComponent(url)}&format=mp3`, extractor: r => r.result?.downloadUrl },
    { endpoint: `${global.APIs.nekolabs.url}/downloader/youtube/play/v1?q=${encodeURIComponent(url)}`, extractor: r => r.result?.downloadUrl }
  ]

  for (const { endpoint, extractor } of apis) {

    try {

      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 10000)

      const res = await fetch(endpoint, { signal: controller.signal }).then(r => r.json())

      clearTimeout(timeout)

      const link = extractor(res)

      if (link) return { url: link }

    } catch {}

    await new Promise(r => setTimeout(r, 500))
  }

  return null
}