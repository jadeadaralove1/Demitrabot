// handler_invite.js
const linkRegex = /chat\.whatsapp\.com\/([0-9A-Za-z]{20,24})(?:\s+[0-9]{1,3})?/i;

async function getGroupName(client, chatId) {
  try {
    const metadata = await client.groupMetadata(chatId);
    return metadata.subject || 'Grupo desconocido';
  } catch {
    return 'Chat privado';
  }
}

let handler = async (m, { conn, args }) => {
  const chatDb = global.db?.data?.chats?.[m.chat] || {};
  const usersDb = chatDb.users || {};
  const user = usersDb[m.sender] || { jointime: 0 };

  const grupo = m.isGroup ? await getGroupName(conn, m.chat) : 'Chat privado';

  const botId = conn.user?.id?.split(':')[0] + '@s.whatsapp.net' || '000@s.whatsapp.net';
  const botSettings = global.db?.data?.settings?.[botId] || {};
  const botname = botSettings.botname || 'Bot';
  const dueño = botSettings.owner || global.owner?.[0] || '000@s.whatsapp.net';

  const cooldown = 10 * 60 * 1000;
  const nextTime = (user.jointime || 0) + cooldown;
  if (Date.now() < nextTime)
    return await conn.sendMessage(
      m.chat,
      { text: `⏳ Espera ${msToTime(nextTime - Date.now())} antes de enviar otra invitación.` },
      { quoted: m }
    );

  if (!args || !args.length)
    return await conn.sendMessage(
      m.chat,
      { text: '⚠️ Ingresa el enlace del grupo para invitar al bot.' },
      { quoted: m }
    );

  const link = args.join(' ');
  const match = link.match(linkRegex);
  if (!match || !match[1])
    return await conn.sendMessage(
      m.chat,
      { text: '⚠️ El enlace ingresado no es válido o está incompleto.' },
      { quoted: m }
    );

  const isOficialBot = botId === conn.user?.id?.split(':')[0] + '@s.whatsapp.net';
  const botType = isOficialBot ? 'Principal/Owner' : 'Sub Bot';
  const pp = await conn.profilePictureUrl(m.sender, 'image').catch(() => 'https://files.catbox.moe/ofitow.jpeg');

  const sugg = `📩 Invitación recibida
> Usuario: ${global.db?.data?.users?.[m.sender]?.name || m.pushName || 'Usuario'}
> Enlace: ${link}
> Chat: ${grupo}
> Bot: ${botname} (${botType})`;

  const destinos = dueño ? [dueño] : global.owner?.map(n => `${n}@s.whatsapp.net`) || [];
  for (const destino of destinos) {
    try {
      await conn.sendContextInfoIndex(destino, sugg, {}, null, false, null, {
        banner: pp,
        title: '⭐ Invitación',
        body: 'Nueva invitación para el bot',
        redes: botSettings.link || ''
      });
    } catch {}
  }

  await conn.sendMessage(
    m.chat,
    { text: '✅ El enlace fue enviado correctamente. ¡Gracias por tu invitación!' },
    { quoted: m }
  );

  // Guardar cooldown
  user.jointime = Date.now();
  usersDb[m.sender] = user;
  chatDb.users = usersDb;
  global.db.data.chats[m.chat] = chatDb;
};

// Propiedades del handler
handler.command = ['invite', 'invitar'];
handler.category = 'info';
handler.help = ['invite', 'invitar'];

export default handler;

// Conversión de ms a tiempo legible
function msToTime(duration) {
  const seconds = Math.floor((duration / 1000) % 60);
  const minutes = Math.floor((duration / (1000 * 60)) % 60);
  return `${minutes} Minuto(s) ${seconds} Segundo(s)`;
}