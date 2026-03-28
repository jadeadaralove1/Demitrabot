// handler_invite.js
// Comando para enviar invitación del bot a un grupo de WhatsApp
// ⚠️ Validación completa para evitar errores de undefined

const linkRegex = /chat\.whatsapp\.com\/([0-9A-Za-z]{20,24})(?:\s+[0-9]{1,3})?/i;

// Función para obtener nombre de grupo o chat privado
async function getGroupName(client, chatId) {
  try {
    const metadata = await client.groupMetadata(chatId);
    return metadata.subject || 'Grupo desconocido';
  } catch {
    return 'Chat privado';
  }
}

export default {
  command: ['invite', 'invitar'],
  category: 'info',
  run: async (client, m, args) => {
    // Datos del usuario y chat con valores por defecto
    const chatDb = global.db?.data?.chats?.[m.chat] || {};
    const usersDb = chatDb.users || {};
    const user = usersDb[m.sender] || { jointime: 0 };

    const grupo = m.isGroup ? await getGroupName(client, m.chat) : 'Chat privado';

    const botId = conn.user?.id?.split(':')[0] + '@s.whatsapp.net' || '0000000000000@s.whatsapp.net';
    const botSettings = global.db?.data?.settings?.[botId] || {};
    const botname = botSettings.botname || 'Bot';
    const dueño = botSettings.owner || global.owner?.[0] || '0000000000000@s.whatsapp.net';

    // Cooldown de 10 minutos
    const cooldown = 10 * 60 * 1000;
    const nextTime = (user.jointime || 0) + cooldown;
    if (Date.now() < nextTime) {
      return m.reply(
        `⏳ Espera ${msToTime(nextTime - Date.now())} antes de enviar otra invitación.`
      );
    }

    // Validación de enlace
    if (!args || !args.length) {
      return m.reply('⚠️ Ingresa el enlace del grupo para invitar al bot.');
    }
    const link = args.join(' ');
    const match = link.match(linkRegex);
    if (!match || !match[1]) {
      return m.reply('⚠️ El enlace ingresado no es válido o está incompleto.');
    }

    // Datos del bot para mostrar en el mensaje
    const isOficialBot = botId === client.user?.id?.split(':')[0] + '@s.whatsapp.net';
    const botType = isOficialBot ? 'Principal/Owner' : 'Sub Bot';
    const pp = await client.profilePictureUrl(m.sender, 'image').catch(() => 'https://files.catbox.moe/ofitow.jpeg');

    const sugg = `📩 Invitación recibida
> Usuario: ${global.db?.data?.users?.[m.sender]?.name || m.pushName || 'Usuario'}
> Enlace: ${link}
> Chat: ${grupo}
> Bot: ${botname} (${botType})`;

    // Enviar al dueño o lista de owners
    const destinos = dueño ? [dueño] : global.owner?.map(n => `${n}@s.whatsapp.net`) || [];
    for (const destino of destinos) {
      try {
        await client.sendContextInfoIndex(destino, sugg, {}, null, false, null, {
          banner: pp,
          title: '⭐ Invitación',
          body: 'Nueva invitación para el bot',
          redes: botSettings.link || ''
        });
      } catch {}
    }

    // Confirmación al usuario
    await client.reply(
      m.chat,
      '✅ El enlace fue enviado correctamente. ¡Gracias por tu invitación!',
      m
    );

    // Guardar cooldown
    user.jointime = Date.now();
    usersDb[m.sender] = user;
    chatDb.users = usersDb;
    global.db.data.chats[m.chat] = chatDb;
  }
};

// Convertir ms a tiempo legible
function msToTime(duration) {
  const seconds = Math.floor((duration / 1000) % 60);
  const minutes = Math.floor((duration / (1000 * 60)) % 60);
  return `${minutes} Minuto(s) ${seconds} Segundo(s)`;
}