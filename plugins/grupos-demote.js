const handler = async (m, { conn }) => {
  try {
    // Detectar al usuario a degradar
    let who = m.mentionedJid?.[0] || m.quoted?.sender || null;
    if (!who) {
      return await conn.sendMessage(m.chat, {
        text: '𐄹 ۪ ׁ 🦭ᩚ̼ 𖹭̫ ▎Menciona a alguien para quitarle sus *privilegios altos.*'
      }, { quoted: m });
    }

    const groupMetadata = await conn.groupMetadata(m.chat);
    const participant = groupMetadata.participants.find(p => p.id === who);

    if (!participant || !participant.admin) {
      return await conn.sendMessage(m.chat, {
        text: `☃️ *@${who.split('@')[0]}* no es administrador del grupo!`,
        mentions: [who]
      }, { quoted: m });
    }

    if (who === groupMetadata.owner) {
      return await conn.sendMessage(m.chat, {
        text: '𐄹 ۪ ׁ ⚠️ᩚ̼ 𖹭̫ ▎No puedo quitarle admin al creador del grupo.'
      }, { quoted: m });
    }

    if (who === conn.user.jid) {
      return await conn.sendMessage(m.chat, {
        text: '𐄹 ۪ ׁ ⚠️ᩚ̼ 𖹭̫ ▎No puedo quitarme admin yo misma.'
      }, { quoted: m });
    }

    // Degradar al usuario
    await conn.groupParticipantsUpdate(m.chat, [who], 'demote');

    await conn.sendMessage(m.chat, {
      text: `*@${who.split('@')[0]}* ya no es admin`,
      mentions: [who]
    }, { quoted: m });

  } catch (e) {
    console.error(e);
    await conn.sendMessage(m.chat, { text: '𐄹 ۪ ׁ ⚠️ᩚ̼ 𖹭̫ ▎ Ocurrió un error al intentar degradar al admin.' }, { quoted: m });
  }
};

handler.help = ['demote'];
handler.tags = ['grupo'];
handler.command = ['demote'];
handler.admin = true;
handler.botAdmin = true;

export default handler;