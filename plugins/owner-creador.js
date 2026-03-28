let handler = async (m, { conn }) => {
  try {
    // 🐞 Reacción estilo Demitrabot
    await conn.sendMessage(m.chat, {
      react: { text: '🐞', key: m.key }
    });

    // 📞 Datos del owner
    let numberOwner = '5493863447787';
    let nombreOwner = '『 𝗢𝗪𝗡𝗘𝗥 』 𝗔𝖽𝗮𝗋𝖺！🪼';

    // 📇 vCard
    let vcardOwner = `BEGIN:VCARD
VERSION:3.0
N:${nombreOwner};;;
FN:${nombreOwner}
TEL;type=CELL;type=VOICE;waid=${numberOwner}:${numberOwner}
END:VCARD`;

    // 💬 Mensaje estilo anime
    let texto = `╭━━━〔 ♡ Demitra ♡ 〕━━━⬣
┃ ❥ Aquí está mi creador
┃ ❥ Puedes hablar con él si me necesitas
┃ ❥ No seas tímido... 💗
╰━━━━━━━━━━━━━━━━⬣`;

    // 📩 Enviar mensaje
    await conn.sendMessage(m.chat, { text: texto }, { quoted: m });

    // 📇 Enviar contacto
    await conn.sendMessage(m.chat, {
      contacts: {
        displayName: nombreOwner,
        contacts: [{ vcard: vcardOwner }]
      }
    }, { quoted: m });

  } catch (e) {
    console.error(e);
    await m.reply('Ocurrió un error... inténtalo otra vez');
  }
};

handler.help = ['owner'];
handler.tags = ['main'];
handler.command = ['owner', 'creator', 'creador', 'dueño'];

export default handler;