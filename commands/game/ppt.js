// Diccionarios y funciones necesarias
const textoAEmoji = { piedra: '🪨', papel: '📄', tijera: '✂️' };
const emojiATexto = { '🪨': 'piedra', '📄': 'papel', '✂️': 'tijera' };

const esJugadaValida = txt => {
  if (!txt) return false;
  txt = txt.toLowerCase();
  return ['piedra','papel','tijera','🪨','📄','✂️'].includes(txt);
};

const normalizarJugada = txt => {
  if (!txt) return null;
  txt = txt.toLowerCase();
  if (emojiATexto[txt]) return emojiATexto[txt];
  return txt;
};

// Objeto para almacenar juegos en curso
let pptGames = {};

export default {
  command: ['ppt'],
  tags: ['game'],
  help: ['ppt @usuario', 'ppt piedra|papel|tijera'],
  group: true,

  run: async (conn, m, args) => {
    const chatId = m.chat;

    // --------------------
    // 1️⃣ Retar a alguien
    // --------------------
    if (args[0] && m.mentionedJid?.[0]) {
      const rival = m.mentionedJid[0];
      if (rival === m.sender) return conn.sendMessage(chatId, { text: 'No puedes jugar contigo mismo 😅' }, { quoted: m });

      const gameId = `${chatId}-${rival}`;
      if (pptGames[gameId]) return conn.sendMessage(chatId, { text: 'Ya hay un juego en curso con este usuario.' }, { quoted: m });

      pptGames[gameId] = {
        player1: m.sender,
        player2: rival,
        player1Name: m.pushName || m.sender,
        player2Name: (m.mentionedJidNames?.[0]) || rival,
        group: chatId,
        status: 'waiting',
        choices: {}
      };

      const msg = `🎮 *Piedra Papel o Tijera*\n\n👤 @${pptGames[gameId].player1Name} ha retado a @${pptGames[gameId].player2Name}\nResponde con \`ppt piedra\`, \`ppt papel\` o \`ppt tijera\` dentro del grupo. También puedes usar 🪨 📄 ✂️`;

      await conn.sendMessage(chatId, { text: msg, mentions: [m.sender, rival] }, { quoted: m });

      // Timeout de 2 minutos
      setTimeout(() => {
        if (pptGames[gameId]?.status === 'waiting') {
          delete pptGames[gameId];
          conn.sendMessage(chatId, { text: '⏱️ Juego cancelado por inactividad.' });
        }
      }, 2 * 60 * 1000);

      return;
    }

    // --------------------
    // 2️⃣ Registrar jugada
    // --------------------
    const input = args[0];
    if (!input || !esJugadaValida(input)) return conn.sendMessage(chatId, { text: '❌ Jugada inválida. Usa `piedra`, `papel`, `tijera` o sus emojis.' }, { quoted: m });

    const jugada = normalizarJugada(input);

    // Buscar el juego donde participa el jugador
    const gameId = Object.keys(pptGames).find(id => {
      const g = pptGames[id];
      return g.status === 'waiting' && (m.sender === g.player1 || m.sender === g.player2);
    });

    if (!gameId) return conn.sendMessage(chatId, { text: '❌ No estás en ningún juego activo. Retar a alguien con `ppt @usuario` primero.' }, { quoted: m });

    const game = pptGames[gameId];
    if (game.choices[m.sender]) return conn.sendMessage(chatId, { text: 'Ya has enviado tu jugada.' }, { quoted: m });

    // Registrar jugada
    game.choices[m.sender] = jugada;
    const playerName = m.pushName || m.sender;

    await conn.sendMessage(chatId, { text: `✅ @${playerName} eligió *${jugada.toUpperCase()}* ${textoAEmoji[jugada] || ''}`, mentions: [m.sender], quoted: m });

    // --------------------
    // 3️⃣ Resolver juego
    // --------------------
    if (Object.keys(game.choices).length < 2) return; // Esperando al otro jugador

    game.status = 'done';
    const { player1, player2 } = game;
    const c1 = game.choices[player1];
    const c2 = game.choices[player2];

    let result;
    let winner = null;

    if (c1 === c2) {
      result = '🤝 ¡Empate!';
    } else if (
      (c1 === 'piedra' && c2 === 'tijera') ||
      (c1 === 'papel' && c2 === 'piedra') ||
      (c1 === 'tijera' && c2 === 'papel')
    ) {
      winner = player1;
    } else {
      winner = player2;
    }

    if (winner) {
      const loser = winner === player1 ? player2 : player1;
      result = `🎉 ¡${game[winner + 'Name']} gana! 🎉\n${game[loser + 'Name']} pierde.`;
    }

    await conn.sendMessage(game.group, {
      text: `🏆 *Resultados:*\n\n👤 ${game.player1Name}: ${textoAEmoji[c1]} (${c1})\n👤 ${game.player2Name}: ${textoAEmoji[c2]} (${c2})\n\n${result}`,
      mentions: [player1, player2]
    });

    // Limpiar juego
    delete pptGames[gameId];
  }
};