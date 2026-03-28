import axios from 'axios';

// Lista de subreddits en español
const subreddits = [
  'memesESP',
  'SpanishMeme',
  'MemesEnEspanol',
  'LatinoPeopleTwitter'
];

// Función para detectar español en título
const isSpanish = (text) => /[áéíóúñ¿¡]/i.test(text);

// Cache de memes para no repetir
let memeCache = [];

let handler = async (m, { command, conn }) => {
  try {
    let memeUrl = null;
    let attempts = 0;
    let memeTitle = '';

    // Intentos de hasta 10 memes
    while (!memeUrl && attempts < 10) {
      const randomSub = subreddits[Math.floor(Math.random() * subreddits.length)];
      const res = await axios.get(`https://meme-api.com/gimme/${randomSub}`);

      if (res.data && res.data.url && isSpanish(res.data.title)) {
        // Evitar memes repetidos
        if (!memeCache.includes(res.data.url)) {
          memeUrl = res.data.url;
          memeTitle = res.data.title;
          memeCache.push(memeUrl);

          // Limitar cache a últimos 50 memes
          if (memeCache.length > 50) memeCache.shift();
        }
      }
      attempts++;
    }

    if (!memeUrl) throw 'No se encontró meme en español después de varios intentos';

    const wm = (typeof global !== 'undefined' && global.wm) ? global.wm : 'Shadow-BOT-MD ⚔️';
    const bot = 'Shadow-BOT-MD ⚔️';

    let fkontak = {
      key: { participants: '0@s.whatsapp.net', remoteJid: 'status@broadcast', fromMe: false, id: 'Halo' },
      message: {
        contactMessage: {
          vcard: `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
        }
      },
      participant: '0@s.whatsapp.net'
    };

    let caption = `☽ 『 Shadow Garden Memes 』 ☽

🧠 ${memeTitle}
✦ Que la risa ilumine tu noche oscura.`;

    await conn.sendButton(
      m.chat,
      caption,
      wm,
      memeUrl,
      [
        ['☽ Siguiente meme ☽', '.meme'],
        ['☽ Volver al Menú ☽', '/menu']
      ],
      null,
      [[bot, 'https://whatsapp.com/channel/0029VbArz9fAO7RGy2915k3O']],
      fkontak
    );

    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

  } catch (e) {
    await conn.sendMessage(m.chat, { react: { text: '✖️', key: m.key } });
    m.reply('⚠️ Las sombras no pudieron encontrar un meme en español...');
    console.error(e);
  }
};

handler.command = handler.help = ['meme'];
handler.tags = ['diversión', 'humor'];
export default handler;