let juegos = {}

function generarSopaDeLetras(palabras) {
  const size = 12
  let grid = Array.from({ length: size }, () => Array(size).fill(' '))

  // Insertar palabras
  palabras.forEach((p, idx) => {
    if (idx < size) {
      for (let i = 0; i < p.length && i < size; i++) {
        grid[idx][i] = p[i].toUpperCase()
      }
    }
  })

  const letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (grid[r][c] === ' ') {
        grid[r][c] = letras[Math.floor(Math.random() * letras.length)]
      }
    }
  }

  return grid.map(row => row.join(' ')).join('\n')
}

export default {
  command: ['sopa', 'sopadeletras', 'resolver'],
  tags: ['game'],
  help: ['sopa', 'resolver <palabras>'],
  group: true,

  run: async (conn, m, args) => {
    const command = (m.text || '').split(' ')[0].slice(1).toLowerCase()
    const text = args.join(' ')
    const chatId = m.chat
    const jugador = m.pushName || m.sender

    const palabras = [
  "robot",
  "adara",
  "agua",
  "jugo",
  "dragon",
  "foca",
  "ballena",
  "eterno",
  "infinito",
  "galaxia",
  "cosmos",
  "estrella",
  "aurora",
  "cometa",
  "planeta",
  "universo",
  "medusa",
  "nutria",
  "celular",
  "mariposa",
  "tesoro",
  "diamante",
  "cristal",
  "video",
  "demitra",
  "luz",
  "turtuga",
  "fuego",
  "hielo",
  "gato"
]
    // 🎮 INICIAR JUEGO
    if (['sopa', 'sopadeletras', 'shadowgame'].includes(command)) {
      const sopa = generarSopaDeLetras(palabras)

      juegos[chatId] = {
        jugador,
        palabras,
        inicio: Date.now()
      }

      const mensaje = `‎‎ 
          ׄ    ִ ⏜͡෧ㅤ⚞ํ🫐⚟ㅤ෧͡⏜‎‎ ׅ     ׄ  
       💗 ׂ ᦒ   𝗦𝗼𝗽𝗮 𝗱𝗲 𝗹𝗲𝘁𝗿𝗮𝘀  .ᨻ 𓈒 ⪨
 
. ݁𖦹 👤  Jugador: ${jugador}
   ̨̽⏳⃚̶ ִ Tiempo: 10 minutos


 ⃞⫏̮ׅ🔍̼̼֟፝ ׂ Palabras:
${palabras.join(', ')}

  ۪ ꒰ 🐞 ꒱ 𝗦𝗼𝗽𝗮:
${sopa}

> Usa *.resolver palabra1,palabra2*`

      await conn.sendMessage(m.chat, { text: mensaje }, { quoted: m })

      // ⏱ Avisos
      setTimeout(() => {
        if (juegos[chatId]) {
          conn.sendMessage(m.chat, {
            text: `ೃ ׄ⚠️՞ ִ ${jugador}, 5 minutos...`
          }, { quoted: m })
        }
      }, 5 * 60 * 1000)

      setTimeout(() => {
        if (juegos[chatId]) {
          conn.sendMessage(m.chat, {
            text: `𝆹𝅥ׄ ꣑⏳ִׄ  ꐚ ${jugador}, 1 minuto restante...`
          }, { quoted: m })
        }
      }, 9 * 60 * 1000)

      setTimeout(() => {
        if (juegos[chatId]) {
          conn.sendMessage(m.chat, {
            text: `𐐳ㅤִ 💀⃘ㅤׄ ꘟִ Tiempo agotado ${jugador}`
          }, { quoted: m })
          delete juegos[chatId]
        }
      }, 10 * 60 * 1000)
    }

    // 🧠 RESOLVER
    if (command === 'resolver') {
      if (!juegos[chatId]) {
        return conn.sendMessage(m.chat, {
          text: "ೃ ׄ⚠️՞ ִ No hay sopa activa"
        }, { quoted: m })
      }

      if (!text) {
        return conn.sendMessage(m.chat, {
          text: "✍️ Usa: .resolver palabra1,palabra2"
        }, { quoted: m })
      }

      const encontradas = text
        .split(',')
        .map(p => p.trim().toLowerCase())

      const faltantes = juegos[chatId].palabras
        .filter(p => !encontradas.includes(p))

      if (faltantes.length === 0) {
        await conn.sendMessage(m.chat, {
          text: `❯͟🥳✅͟⃠⏤ ꤦ     𐨺      ׁGa n͟ aste!!  ::  ${jugador}`
        }, { quoted: m })

        delete juegos[chatId]
      } else {
        await conn.sendMessage(m.chat, {
          text: `❌ㅤ⢻ִ Faltan:
${faltantes.join(', ')}`
        }, { quoted: m })
      }
    }
  }
}