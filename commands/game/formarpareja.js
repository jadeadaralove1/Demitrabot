export default {
  command: ['formarpareja', 'formarparejas'],
  tags: ['fun'],
  help: ['formarpareja'],
  group: true,
  register: true,

  run: async (conn, m, args) => {

    const toM = (a) => '@' + a.split('@')[0];

    // Obtener metadata del grupo
    let metadata;
    try {
      metadata = await conn.groupMetadata(m.chat);
    } catch (e) {
      return conn.sendMessage(m.chat, { text: '⚠️ No se pudo obtener la información del grupo.' }, { quoted: m });
    }

    const participantes = metadata.participants.map(p => p.id);

    if (participantes.length < 2) {
      return conn.sendMessage(
        m.chat,
        { text: '⚠️ Necesitan al menos 2 personas en el grupo.' },
        { quoted: m }
      );
    }

    // Elegir 2 al azar
    const a = participantes[Math.floor(Math.random() * participantes.length)];
    let b;

    do {
      b = participantes[Math.floor(Math.random() * participantes.length)];
    } while (b === a);

    const texto = `
       ꉂꉂㅤׅㅤᰍㅤׁㅤ𝗠𝗔𝗖𝗛ㅤׅㅤ🌸̮᳹ㅤׁㅤ𑇛 ݄
>             Encontrado

        ${toM(a)} 💍 ${toM(b)}

𑇛 ݄ㅤ☆ Deberían casarse... hacen linda 
                pareja 💗`;

    await conn.sendMessage(
      m.chat,
      {
        text: texto,
        mentions: [a, b]
      },
      { quoted: m }
    );
  }
};