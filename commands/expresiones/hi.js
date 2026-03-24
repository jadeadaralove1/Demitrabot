export default {
  command: ['hi', 'saludos'],
  category: 'expresiones',
  group: true,

  run: async (client, m, args, usedPrefix, command) => {
    try {
      // Solo continuar si hay menciones
      const mentions = Array.isArray(m.mentionedJid) ? m.mentionedJid : [];
      if (!mentions.length) {
        return m.reply('❌ Debes mencionar a alguien para enviar un saludo.');
      }

      // React seguro
      if (typeof m.react === 'function') m.react('👋').catch(() => {});

      // Texto con menciones activas
      // Se menciona al remitente (@sender) y a los destinatarios (@targets)
      const senderTag = `@${m.sender.split('@')[0]}`;
      const targetTags = mentions.map(jid => `@${jid.split('@')[0]}`).join(', ');

      const str = `${senderTag} ha saludado a ${targetTags}!`;

      // Videos aleatorios de saludos
      const videos = [
        'https://files.catbox.moe/7f3wfq.mp4',
        'https://adofiles.i11.eu/dl/assp.mp4',
        'https://files.catbox.moe/63dg1f.mp4',
        'https://adofiles.i11.eu/dl/dskl.mp4',
        'https://files.catbox.moe/s890oi.mp4',
        'https://files.catbox.moe/bcugph.mp4'
];
      const video = videos[Math.floor(Math.random() * videos.length)];

      // Enviar mensaje con menciones activas
      await client.sendMessage(
        m.chat,
        {
          video: { url: video },
          gifPlayback: true,
          caption: str,
          mentions: [m.sender, ...mentions]
        },
        { quoted: m }
      );

    } catch (e) {
      console.error(e);
      m.reply(`⚠️ Ocurrió un error al ejecutar el comando *${usedPrefix + command}*.\n[Error: ${e.message}]`);
    }
  }
};