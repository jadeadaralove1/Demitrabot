import axios from 'axios';

export default {
command: ['meme'],
tags: ['humor', 'diversión'],
category: 'meme',
run: async (client, m, args) => {
try {
// 1️⃣ Obtener meme en español
let memeUrl = null;
try {
const res = await axios.get('https://meme-api.com/gimme/memesESP');
memeUrl = res?.data?.url;
} catch {}
if (!memeUrl) memeUrl = 'https://i.ibb.co/4RY1Y2R/default-meme.jpg';

// 2️⃣ Texto y pie de meme  
  const caption = `🪼ᩖ᷒  ׄ    𝗗ҽოíԵɾα  ׅ   𝗕օԵ  ׄ   ੭੭ㅤ  
       🫐   ׅ     𝗉𖹭︪︩𝗌ł    ׄ    💙᷒ᰰ   ׅ

🦭ㅤᰈ̠ㅤDemitra encontró un meme en español

> Solo disfruta. puede que tenga unos cuantos errores,gracias!



— Demitra bot / owner Adara`;  

  const wm = (typeof global !== 'undefined' && global.wm) ? global.wm : 'Demitrabot 🐢';  

  // 3️⃣ Contacto ficticio  
  const fkontak = {  
    key: { participants: '0@s.whatsapp.net', remoteJid: 'status@broadcast', fromMe: false, id: 'Halo' },  
    message: {  
      contactMessage: {  
        vcard: `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`  
      }  
    },  
    participant: '0@s.whatsapp.net'  
  };  

  // 4️⃣ Enviar meme con botones  
  await client.sendMessage(  
    m.chat,  
    {  
      image: { url: memeUrl },  
      caption: caption,  
      footer: wm,  
      templateButtons: [  
        { quickReplyButton: { displayText: 'Siguiente meme', id: '.meme' } },  
        { quickReplyButton: { displayText: 'Volver al Menú', id: '/menu' } },  
        { urlButton: { displayText: 'Canal', url: 'https://whatsapp.com/channel/0029VbBvrmwC1Fu5SYpbBE2A' } }  
      ],  
      contextInfo: { externalAdReply: fkontak, forwardingScore: 9999, isForwarded: true }  
    },  
    { quoted: m }  
  );  

  // 5️⃣ Reacción separada para no bloquear el envío  
  await client.sendMessage(m.chat, { react: { text: '✅', key: m.key } });  

} catch (e) {  
  console.error(e);  
  await client.sendMessage(m.chat, { text: '⚠️ Demitra no pudo encontrar un meme en español...' });  
}

}
};