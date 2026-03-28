// handler-meme-pro-final.js
//desactivado en arreglo
let memes = [
  "https://files.catbox.moe/vh4ep2.mp4",
  "https://files.catbox.moe/2bgp1g.gif",
  "https://files.catbox.moe/7y8r6k.jpg",
  "https://files.catbox.moe/l3n5f2.png",
  "https://files.catbox.moe/d9h4q7.jpg"
];

let memePool = [...memes];

let handler = async (m, { conn }) => {
  try {
    if (memePool.length === 0) memePool = [...memes];

    const index = Math.floor(Math.random() * memePool.length);
    const randomMeme = memePool.splice(index, 1)[0];

    const caption = `☽ 『 Shadow Garden Memes 』 ☽

🧠 Aquí tienes un meme en español invocado desde las sombras...
✦ Que la risa ilumine tu noche oscura.`;

    let messageOptions = { caption };

    if (randomMeme.endsWith('.jpg') || randomMeme.endsWith('.png')) {
      messageOptions.image = { url: randomMeme };
    } else if (randomMeme.endsWith('.gif')) {
      messageOptions.video = { url: randomMeme };
      messageOptions.gifPlayback = true;
    } else if (randomMeme.endsWith('.mp4')) {
      messageOptions.video = { url: randomMeme };
    } else {
      throw 'Formato de meme no soportado';
    }

    await conn.sendMessage(m.chat, messageOptions);

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