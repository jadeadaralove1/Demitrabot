// handler-meme-pro-simple.js

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
    // Recargar el pool si se vacía
    if (memePool.length === 0) memePool = [...memes];

    // Elegir un meme aleatorio del pool y removerlo
    const index = Math.floor(Math.random() * memePool.length);
    const randomMeme = memePool.splice(index, 1)[0];

    const caption = `☽ 『 Shadow Garden Memes 』 ☽

🧠 Aquí tienes un meme en español invocado desde las sombras...
✦ Que la risa ilumine tu noche oscura.`;

    // Enviar imagen o video directamente
    await conn.sendMessage(m.chat, {
      caption,
      video: randomMeme.endsWith('.mp4') ? { url: randomMeme } : undefined,
      gifPlayback: randomMeme.endsWith('.gif') ? { url: randomMeme } : undefined,
      image: randomMeme.endsWith('.jpg') || randomMeme.endsWith('.png') ? { url: randomMeme } : undefined
    });

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