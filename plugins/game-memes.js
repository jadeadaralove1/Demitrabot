// handler-meme-pro.js

// Lista de memes en Catbox (links directos)
let memes = [
  "https://files.catbox.moe/vh4ep2.mp4",
  "https://files.catbox.moe/2bgp1g.gif",
  "https://files.catbox.moe/7y8r6k.jpg",
  "https://files.catbox.moe/l3n5f2.png",
  "https://files.catbox.moe/d9h4q7.jpg"
];

// Pool de memes aleatorios para no repetir
let memePool = [...memes];

let handler = async (m, { conn }) => {
  try {
    // Si el pool se vacía, recargarlo
    if (memePool.length === 0) memePool = [...memes];

    // Elegir un meme aleatorio del pool
    const index = Math.floor(Math.random() * memePool.length);
    const randomMeme = memePool.splice(index, 1)[0]; // Lo removemos para no repetir

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

🧠 Aquí tienes un meme en español invocado desde las sombras...
✦ Que la risa ilumine tu noche oscura.`;

    // Enviar meme con botones
    await conn.sendButton(
      m.chat,
      caption,
      wm,
      randomMeme || 'https://files.catbox.moe/default.jpg', // fallback
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
    m.reply('⚠️ Las sombras no pudieron encontrar un meme...');
    console.error(e);
  }
};

handler.command = handler.help = ['meme'];
handler.tags = ['diversión', 'humor'];
export default handler;