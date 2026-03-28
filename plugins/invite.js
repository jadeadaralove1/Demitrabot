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
  // ───── INICIALIZAR BASE DE DATOS ─────
  if (!global.db.data.chats) global.db.data.chats = {};
  if (!global.db.data.chats[m.chat]) global.db.data.chats[m.chat] = {};
  if (!global.db.data.chats[m.chat].users) global.db.data.chats[m.chat].users = {};
  if (!global.db.data.chats[m.chat].users[m.sender]) {
    global.db.data.chats[m.chat].users[m.sender] = { jointime: 0 };
  }
  if (!global.db.data.users) global.db.data.users = {};
  if (!global.db.data.users[m.sender]) {
    global.db.data.users[m.sender] = { name: m.pushName || 'Desconocido' };
  }

  const userDb = global.db.data.chats[m.chat].users[m.sender];
  const grupo = m.isGroup ? await getGroupName(conn, m.chat) : 'Chat privado';
  const botId = conn.user.id.split(':')[0] + '@s.whatsapp.net';
  const botSettings = global.db.data.settings?.[botId] || {};
  const botname = botSettings.botname || 'Bot';
  const dueño = botSettings.owner;
  const cooldown = 600000; // 10 min
  const nextTime = userDb.jointime + cooldown;

  if (Date.now() - userDb.jointime < cooldown) {
    return m.reply(`✿ Espera *${msToTime(nextTime - Date.now())}* para volver a enviar otra invitación.`);
  }

  if (!args || !args.length) {
    return m.reply('🧚 Ingresa el enlace para invitar al bot a tu grupo.');
  }

  const link = args.join(' ');
  const match = link.match(linkRegex);
  if (!match || !match[1]) {
    return m.reply('⚠️ El enlace ingresado no es válido o está incompleto.');
  }

  const isOficialBot = botId === global.client.user.id.split(':')[0] + '@s.whatsapp.net';
  const botType = isOficialBot ? 'Principal/Owner' : 'Sub Bot';
  const pp = await conn.profilePictureUrl(m.sender, 'image').catch(() => 'https://files.catbox.moe/ofitow.jpeg');

  const sugg = `☁️ Solicitud recibida
> *Usuario ›* ${global.db.data.users[m.sender]?.name || 'Desconocido'}
⭐⃞░ *Enlace ›* ${args.join(' ')}
🐞ㅤㅤ *Chat ›* ${grupo}

▙▅▚  INFOBOT
> *Tipo ›* ${botType}
🫐 *Nombre ›* ${botname}
⭐⃞░ *Versión ›* ${global.version}`;

  const destinatarios = isOficialBot
    ? (dueño ? [dueño] : global.owner.map(num => `${num}@s.whatsapp.net`))
    : [dueño || botId];

  for (const destino of destinatarios) {
    try {
      await global.client.sendContextInfoIndex(destino, sugg, {}, null, false, null, {
        banner: pp,
        title: '⭐⃞░ Invitación',
        body: '⭐⃞░ Nueva invitación al bot',
        redes: global.db.data.settings?.[botId]?.link
      });
    } catch {}
  }

  await conn.reply(m.chat, '✿ El enlace fue enviado correctamente. ¡Gracias por tu invitación!', m);

  // ───── GUARDAR TIEMPO DE COOLDOWN ─────
  userDb.jointime = Date.now();
};

function msToTime(duration) {
  const seconds = Math.floor((duration / 1000) % 60);
  const minutes = Math.floor((duration / (1000 * 60)) % 60);
  const hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
  return `${hours ? hours + 'h ' : ''}${minutes} Minuto(s) ${seconds} Segundo(s)`;
}

// ───── CONFIGURACIÓN DEL HANDLER ─────
handler.command = ['invite', 'invitar'];
handler.category = 'info';

export default handler;