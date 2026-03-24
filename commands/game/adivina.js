let partidas = {}; // partidas activas por chat

const peliculasSeriesEmojis = [
  { nombre: "El Rey León", emojis: "🦁👑🌅", pistas: ["Es un clásico de Disney", "El protagonista es un león"] },
  { nombre: "La Bella y la Bestia", emojis: "👸🌹🐻", pistas: ["Un castillo encantado", "Un príncipe convertido en bestia"] },
  { nombre: "Aladdín", emojis: "🧞‍♂️🕌💎", pistas: ["Un genio en una lámpara", "Una alfombra voladora"] },
  { nombre: "Frozen", emojis: "❄️👭⛄", pistas: ["Una hermana tiene poderes de hielo", "Canción famosa: Let It Go"] },
  { nombre: "Moana", emojis: "🌊🏝️🛶", pistas: ["Viaje por el océano", "Amiga de un semidiós"] },
  { nombre: "La Sirenita", emojis: "🧜‍♀️🌊🦀", pistas: ["Una sirena quiere ser humana", "Tiene un cangrejo amigo"] },
  { nombre: "Cenicienta", emojis: "👸👠🎃", pistas: ["Zapato perdido", "Baila en el palacio"] },
  { nombre: "Rapunzel", emojis: "👸💛🏰", pistas: ["Cabello largo y mágico", "Está encerrada en una torre"] },
  { nombre: "Mulan", emojis: "⚔️👩🐉", pistas: ["Se disfraza de hombre", "Defiende a China"] },
  { nombre: "Pocahontas", emojis: "🏹🌿🪶", pistas: ["Historia de amor", "Conexión con la naturaleza"] },
  { nombre: "Toy Story", emojis: "🤠🚀🤖", pistas: ["Juguetes que cobran vida", "Va al espacio"] },
  { nombre: "Buscando a Nemo", emojis: "🐟🌊🔍", pistas: ["Un pez perdido", "Su padre lo busca"] },
  { nombre: "Los Increíbles", emojis: "🦸‍♂️🦸‍♀️👨‍👩‍👧‍👦", pistas: ["Familia de superhéroes", "Tiene un villano llamado Síndrome"] },
  { nombre: "Up", emojis: "🎈🏠👴👦", pistas: ["Casa voladora", "Aventura en Sudamérica"] },
  { nombre: "Coco", emojis: "💀🎸🎶", pistas: ["Viaje al mundo de los muertos", "Amor por la música"] },
  { nombre: "Ratatouille", emojis: "🐀👨‍🍳🍲", pistas: ["Rata que cocina", "En París"] },
  { nombre: "Wall-E", emojis: "🤖🌍💚", pistas: ["Robot en la Tierra", "Viaja al espacio"] },
  { nombre: "Intensa-Mente", emojis: "🧠🌈😢", pistas: ["Emociones vivientes", "Personaje principal es una niña"] },
  { nombre: "Soul", emojis: "🎷👨‍🎤✨", pistas: ["Músico de jazz", "Viaje entre mundos"] },
  { nombre: "Luca", emojis: "🧜‍♂️🏖️🍝", pistas: ["Monstruos marinos", "Italia, verano y amistad"] },
  { nombre: "Piratas del Caribe", emojis: "🏴‍☠️⚓💀", pistas: ["Capitán Jack Sparrow", "Busca tesoro"] },
  { nombre: "Maléfica", emojis: "👸🌿🖤", pistas: ["Villana con cuernos", "Protege a un reino"] },
  { nombre: "Alicia en el País de las Maravillas", emojis: "👧🐇🎩", pistas: ["Sigue a un conejo blanco", "Mundo mágico y extraño"] },
  { nombre: "Mary Poppins", emojis: "👩‍🦳☂️🏠", pistas: ["Niñera mágica", "Vuela con un paraguas"] },
  { nombre: "Hércules", emojis: "💪⚡👑", pistas: ["Héroe griego", "Hijo de un dios"] },
  { nombre: "Peter Pan", emojis: "🧚✈️👦", pistas: ["Nunca crece", "Vuela con polvo de hadas"] },
  { nombre: "Tarzán", emojis: "🌴🐒🦵", pistas: ["Criado por gorilas", "Selva africana"] },
  { nombre: "El Jorobado de Notre Dame", emojis: "⛪🔔👨‍🦽", pistas: ["Campanario de París", "Personaje con joroba"] },
  { nombre: "Tiana y el Sapo", emojis: "👸🐸🎺", pistas: ["Beso mágico", "Sueño de restaurante"] },
  { nombre: "Enredados", emojis: "👸💛🏰", pistas: ["Cabello mágico", "Encerrada en una torre"] },
  { nombre: "Titanic", emojis: "🚢💔❤️", pistas: ["Barco famoso", "Historia de amor trágica"] },
  { nombre: "Jurassic Park", emojis: "🦖🌴🚗", pistas: ["Dinosaurios clonados", "Parque temático"] },
  { nombre: "Harry Potter", emojis: "🧙‍♂️⚡🦉", pistas: ["Colegio de magia", "Lleva una cicatriz"] },
  { nombre: "El Señor de los Anillos", emojis: "💍🧙‍♂️🏞️", pistas: ["Un anillo poderoso", "Frodo es protagonista"] },
  { nombre: "El Hobbit", emojis: "👣💍🧝", pistas: ["Pequeño hobbit aventurero", "Viaje para recuperar tesoro"] },
  { nombre: "Matrix", emojis: "🕶️💊🤖", pistas: ["Realidad simulada", "Elegido es Neo"] },
  { nombre: "Avatar", emojis: "👽🌌🪐", pistas: ["Planeta Pandora", "Ser azul con cola"] },
  { nombre: "Los Juegos del Hambre", emojis: "🏹🔥🎯", pistas: ["Competencia mortal", "Katniss con arco"] },
  { nombre: "Crepúsculo", emojis: "🧛‍♂️❤️🌙", pistas: ["Vampiros y romance", "Bella y Edward"] },
  { nombre: "El Gran Gatsby", emojis: "🎩🍸🏰", pistas: ["Fiestas de lujo", "Década de los 20"] },
  { nombre: "Stranger Things", emojis: "👦🏻🚲👽🌌", pistas: ["Pequeña ciudad", "Dimensión Upside Down"] },
  { nombre: "Friends", emojis: "👫☕️🏢", pistas: ["Café Central Perk", "Seis amigos en Nueva York"] },
  { nombre: "The Simpsons", emojis: "👨‍👩‍👦🍩🍺", pistas: ["Familia amarilla", "Ciudad Springfield"] },
  { nombre: "Rick y Morty", emojis: "👴👦🛸", pistas: ["Ciencia y locuras", "Viajes interdimensionales"] },
  { nombre: "Breaking Bad", emojis: "👨‍🔬💊💥", pistas: ["Profesor de química", "Se convierte en criminal"] },
  { nombre: "Game of Thrones", emojis: "👑🐉⚔️", pistas: ["Tronos y dragones", "Casa Stark"] },
  { nombre: "The Mandalorian", emojis: "🤠👶🪐", pistas: ["Cazarrecompensas", "Bebé verde"] },
  { nombre: "The Witcher", emojis: "🧙‍♂️⚔️🐺", pistas: ["Cazador de monstruos", "Geralt de Rivia"] },
  { nombre: "The Office", emojis: "🏢💼😂", pistas: ["Oficina en Scranton", "Comedia en formato documental"] },
  { nombre: "La Casa de Papel", emojis: "💰🎭🔫", pistas: ["Atraco maestro", "Máscara de Dalí"] },
  { nombre: "Spider-Man", emojis: "🕷️🕸️🧑‍🦱", pistas: ["Trepa muros", "Peter Parker"] },
  { nombre: "Iron Man", emojis: "🤖🔥🦾", pistas: ["Tony Stark", "Traje metálico"] },
];

export default {
  command: ['adivina', 'adivinaemoji'],
  tags: ['game'],
  help: ['adivina', 'adivina <respuesta>'],
  group: true,

  run: async (conn, m, args) => {
    const chatId = m.chat;

    // 1️⃣ Iniciar juego si no hay argumento
    if (!args[0]) {
      if (partidas[chatId]) {
        return conn.sendMessage(chatId, { text: "⚠️ Ya hay una partida en curso, adivina la película con emojis." }, { quoted: m });
      }

      // Elegir película/serie aleatoria
      const seleccion = peliculasSeriesEmojis[Math.floor(Math.random() * peliculasSeriesEmojis.length)];

      // Guardar partida activa
      partidas[chatId] = {
        nombre: seleccion.nombre.toLowerCase(),
        emojis: seleccion.emojis,
        pistas: seleccion.pistas || [], // si no hay pistas, poner array vacío
        pistaIndex: 0,
        jugador: null,
        timeout: setTimeout(() => {
          clearInterval(partidas[chatId]?.interval);
          delete partidas[chatId];
          conn.sendMessage(chatId, { text: `⌛ Tiempo terminado. La respuesta era: *${seleccion.nombre}*` });
        }, 2 * 60 * 1000) // 2 minutos
      };

      // Mostrar pistas opcionales cada 30s
      if (partidas[chatId].pistas.length > 0) {
        partidas[chatId].interval = setInterval(() => {
          const partida = partidas[chatId];
          if (!partida || partida.pistaIndex >= partida.pistas.length) return clearInterval(partida?.interval);

          conn.sendMessage(chatId, { text: `💡 Pista: ${partida.pistas[partida.pistaIndex]}` });
          partida.pistaIndex++;
        }, 30 * 1000);
      }

      const msg = `🎬 *Adivina la película/serie* 🎬

${seleccion.emojis}

Escribe #adivina <respuesta> para adivinar. ¡Solo la primera correcta gana!`;
      return conn.sendMessage(chatId, { text: msg }, { quoted: m });
    }

    // 2️⃣ Validar respuesta
    const partida = partidas[chatId];
    if (!partida) return; // no hay partida activa

    // Normalizar respuesta: quitar tildes, espacios extra y minúsculas
    const normalizar = str =>
      str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();

    const respuesta = normalizar(args.join(" "));
    const nombrePartida = normalizar(partida.nombre);

    if (respuesta === nombrePartida) {
      // Limpiar timeout e interval
      if (partida.timeout) clearTimeout(partida.timeout);
      if (partida.interval) clearInterval(partida.interval);

      // Borrar la partida
      delete partidas[chatId];

      // Mensaje de victoria
      return conn.sendMessage(chatId, {
        text: `🎉 ¡Correcto! Felicidades ${m.pushName} 😎\nLa respuesta era: *${partida.nombre}*`
      }, { quoted: m });
    } else {
      // Mensaje de intento incorrecto
      return conn.sendMessage(chatId, { text: `❌ Incorrecto, sigue intentando...` }, { quoted: m });
    }
  }
};