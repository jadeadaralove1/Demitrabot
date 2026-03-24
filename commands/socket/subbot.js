import { startSubBot } from '../../lib/subs.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
let commandFlags = {};

export default {
  command: ['codes', 'qrs'],
  category: 'socket',
  run: async (client, m, args, usedPrefix, command) => {

    const lastSubs = global.db.data.users[m.sender].Subs || 0;
    const cooldown = 120000; // 2 min
    const remaining = cooldown - (Date.now() - lastSubs);
    if (remaining > 0) return client.reply(m.chat, `🕐 Debes esperar *${msToTime(remaining)}* para volver a intentar.`, m);

    const subsPath = path.join(dirname, '../../Sessions/Subs');
    if (!fs.existsSync(subsPath)) fs.mkdirSync(subsPath, { recursive: true });

    const subsCount = fs.readdirSync(subsPath).filter(dir => fs.existsSync(path.join(subsPath, dir, 'creds.json'))).length;
    if (subsCount >= 50) return client.reply(m.chat, `❌ No hay espacio disponible para un Sub-Bot.`, m);

    const phone = args[0] ? args[0].replace(/\D/g, '') : m.sender.split('@')[0];
    const isQR = command === 'qrs';
    const caption = isQR ? '📸 Escanea el código QR para conectar tu Sub-Bot' 
                         : '🔑 Usa este código para vincular tu Sub-Bot con tu número';

    commandFlags[m.sender] = true;

    // Aquí se conecta automáticamente
    await startSubBot(m, client, caption, !isQR, phone, m.chat, commandFlags, true);

    global.db.data.users[m.sender].Subs = Date.now();
  }
};

function msToTime(duration) {
  const seconds = Math.floor((duration / 1000) % 60);
  const minutes = Math.floor((duration / (1000 * 60)) % 60);
  return minutes ? `${minutes} minuto${minutes>1?'s':''}, ${seconds} segundo${seconds>1?'s':''}` 
                 : `${seconds} segundo${seconds>1?'s':''}`;
}