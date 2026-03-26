let handler = async (m, { conn, args, prefix }) => {

    const text = args.join(' ').trim()

    if (!text) {
        const menu = `BOMSHAKALAKA\n\n` +
            `¿Quieres un APK especial?\n` +
            `Dime el nombre de la aplicación y te doy los mejores sitios para descargarla al instante \n\n` +
            `*Ejemplos:*\n` +
            `• ${prefix}apk whatsapp plus\n` +
            `• ${prefix}apk gbwhatsapp\n` +
            `• ${prefix}apk spotify premium\n` +
            `• ${prefix}apk minecraft\n` +
            `• ${prefix}apk free fire max\n\n` +
            `¡Escribe el comando + el nombre!`

        return m.reply(menu)
    }

    const q = encodeURIComponent(text)

    const texto = `*¡BÚSQUEDA APK LISTA!*\n\n` +
        `Buscando *"${text}"\n\n` +
        `*Elige tu sitio favorito:*\n\n` +
        `*Uptodown* (el más seguro y rápido)\nhttps://uptodown.com/android/search?q=${q}\n\n` +
        `🔸 *APKPure* (muchas versiones)\nhttps://apkpure.com/search?q=${q}\n\n` +
        `🔸 *APKCombo* (todas las versiones)\nhttps://apkcombo.com/search?q=${q}\n\n` +
        `🔸 *Aptoide* (fácil de instalar)\nhttps://aptoide.com/search?query=${q}\n\n` +
        `¡Descarga solo de estos sitios de confianza! Si quieres que te recomiende la mejor versión o te ayude con otra cosa, solo dime ♡\n\n` +
        `0 virus.`

    await m.reply(texto)
}

handler.help = ['apk']
handler.tags = ['descargas']
handler.command = ['apk', 'apkd', 'apkdl', 'apks']

export default handler