import './settings.js'
import chalk from 'chalk'
import pino from 'pino'
import qrcode from 'qrcode-terminal'
import fs from 'fs'
import path from 'path'
import readlineSync from 'readline-sync'
import { fileURLToPath } from 'url'
import {
  Browsers,
  makeWASocket,
  makeCacheableSignalKeyStore,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  jidDecode,
  DisconnectReason
} from '@whiskeysockets/baileys'
import { exec } from 'child_process'
import { smsg } from './lib/simple.js'
import { database } from './lib/database.js'
import { handler, loadEvents } from './handler.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const pluginsDir = path.join(__dirname, 'plugins')

const SUBBOTS_DIR = './Sessions/SubBots'
global.conns = []

const log = {
  info: msg => console.log(chalk.bgBlue.white.bold('INFO'), chalk.white(msg)),
  success: msg => console.log(chalk.bgGreen.white.bold('SUCCESS'), chalk.greenBright(msg)),
  warn: msg => console.log(chalk.bgYellow.red.bold('WARNING'), chalk.yellow(msg)),
  error: msg => console.log(chalk.bgRed.white.bold('ERROR'), chalk.redBright(msg))
}

const p1 = chalk.hex('#ffb6c1')
const p2 = chalk.hex('#ff69b4')
const p3 = chalk.hex('#ff1493')
const p4 = chalk.hex('#c71585')

const demiBanner = `
${p3('ꕤ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ꕤ')}
${p1('⠀⠀  ⡠⠒⢄  ⠀⠀  ᨘ⡴⠒⢦⣀⠔⠒⢄')}
${p1('⠀⠀ ⡏  ⠀ ⠉⠉⠉⣽ ⢴⣷⠛⢲⠶⠚⣄')}
${p1('⠀⠀ ⢸ ⠀⠀⠀  ⠀⠀⠓⠚⠛⠤⡞⠛⠀⡞')}
${p2(' ⠀⠀⢸ ⠀⠀⠀⠀⠀⠀⠀ ⠀⠀⠀ᱸ⠉⢉⣇⣀⣀')}
${p2('  ⠉⠉⣇⡀   ⣶⠀⠀  ⣀⠀⠀  ⣶⠀⠀⣾⠤⠤')}
${p2(' ⢎ ⠡⠨ ⣃⡀ ⠀⠀⠀⠉⠀⠀⠀    ⡸⠒⠒')}
${p3('  ⢸⢴⠉⠂⣘ᱸ⠖⢶⠒⠒⡶⢲⠒⡞⢣')}
${p3('⠀ ᱸ⠢⣉⣁⠜⠒⢄  ⠉⠉⠀⡠⠋⠉⠉')}
${p4('⠀⠀       ⠑⠒⠓⠒ᱸ')}
${p3('♡━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━♡')}
${p3('      ♡  ')}${chalk.whiteBright('𝗗𝗘𝗠𝗜𝗧𝗥𝗔 𝗕𝗢𝗧')}${p3('  ♡')}
${chalk.gray('         Love by Adara ♡')}  ${chalk.gray('v' + global.botVersion)}
${p3('♡━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━♡')}
`

const plugins = new Map()

async function loadPlugins () {
  if (!fs.existsSync(pluginsDir)) fs.mkdirSync(pluginsDir, { recursive: true })

  const files = fs.readdirSync(pluginsDir).filter(f => f.endsWith('.js'))

  for (const file of files) {
    try {
      const filePath = path.join(pluginsDir, file)
      const plugin = (await import(`${filePath}?t=${Date.now()}`)).default
      if (plugin) {
        plugins.set(file, plugin)
        log.success(`Plugin cargado: ${file}`)
      }
    } catch (e) {
      log.error(`Error cargando plugin ${file}: ${e.message}`)
    }
  }

  fs.watch(pluginsDir, async (event, filename) => {
    if (!filename?.endsWith('.js')) return

    const filePath = path.join(pluginsDir, filename)

    try {
      if (fs.existsSync(filePath)) {
        const plugin = (await import(`${filePath}?t=${Date.now()}`)).default
        if (plugin) {
          plugins.set(filename, plugin)
          log.success(`Plugin recargado: ${filename}`)
        }
      } else {
        plugins.delete(filename)
        log.warn(`Plugin eliminado: ${filename}`)
      }
    } catch (e) {
      log.error(`Error recargando plugin ${filename}: ${e.message}`)
    }
  })
}

global.sessionName = global.sessionName || './Sessions/Owner'
try {
  fs.mkdirSync(global.sessionName, { recursive: true })
} catch (e) {
  log.error(`No se pudo crear carpeta de sesión: ${e.message}`)
}

const methodCodeQR = process.argv.includes('--qr')
const methodCode = process.argv.includes('--code')
const DIGITS = s => String(s).replace(/\D/g, '')

function normalizePhone (input) {
  let s = DIGITS(input)
  if (!s) return ''
  if (s.startsWith('0')) s = s.replace(/^0+/, '')
  if (s.length === 10 && s.startsWith('3')) s = '57' + s
  if (s.startsWith('52') && !s.startsWith('521') && s.length >= 12) s = '521' + s.slice(2)
  if (s.startsWith('54') && !s.startsWith('549') && s.length >= 11) s = '549' + s.slice(2)
  return s
}

let opcion = ''
let phoneNumber = ''

if (methodCodeQR) opcion = '1'
else if (methodCode) opcion = '2'
else if (!fs.existsSync('./Sessions/Owner/creds.json')) {
  opcion = readlineSync.question(
    chalk.bold.white('\nSeleccione una opción:\n') +
    chalk.blueBright('1. Con código QR\n') +
    chalk.cyan('2. Con código de texto de 8 dígitos\n--> ')
  )

  while (!/^[1-2]$/.test(opcion)) {
    log.error('Solo ingrese 1 o 2.')
    opcion = readlineSync.question('--> ')
  }

  if (opcion === '2') {
    console.log(chalk.yellowBright('\nIngrese su número de WhatsApp:\nEjemplo: +54301******\n'))
    const phoneInput = readlineSync.question(chalk.hex('#ff1493')('ꕤ --> '))
    phoneNumber = normalizePhone(phoneInput)
  }
}

export async function startSubBot (sessionPath) {
  try {
    const { state, saveCreds } = await useMultiFileAuthState(sessionPath)
    const { version } = await fetchLatestBaileysVersion()
    const logger = pino({ level: 'silent' })

    const subConn = makeWASocket({
      version,
      logger,
      printQRInTerminal: false,
      browser: Browsers.macOS('Chrome'),
      auth: {
        creds: state.creds,
        keys: makeCacheableSignalKeyStore(state.keys, logger)
      },
      markOnlineOnConnect: false,
      generateHighQualityLinkPreview: true,
      syncFullHistory: false,
      getMessage: async () => '',
      keepAliveIntervalMs: 45000
    })

    subConn.sessionPath = sessionPath

    subConn.decodeJid = jid => {
      if (!jid) return jid
      if (/:\d+@/gi.test(jid)) {
        const decode = jidDecode(jid) || {}
        return decode.user && decode.server ? decode.user + '@' + decode.server : jid
      }
      return jid
    }

    subConn.ev.on('creds.update', saveCreds)

    subConn.ev.on('connection.update', async update => {
      const { connection, lastDisconnect } = update
      const reason = lastDisconnect?.error?.output?.statusCode

      if (connection === 'open') {
        const idx = global.conns.findIndex(c => c.sessionPath === sessionPath)
        if (idx !== -1) global.conns.splice(idx, 1)
        global.conns.push(subConn)
        log.success(`SubBot conectado: ${subConn.user?.name || 'Desconocido'} [${sessionPath}]`)
        log.info(`Total subbots activos: ${global.conns.length}`)
        await loadEvents(subConn)
      }

      if (connection === 'close') {
        global.conns = global.conns.filter(c => c.sessionPath !== sessionPath)
        log.warn(`SubBot desconectado [${sessionPath}] | Razón: ${reason}`)

        if ([
          DisconnectReason.connectionLost,
          DisconnectReason.connectionClosed,
          DisconnectReason.restartRequired,
          DisconnectReason.timedOut,
          DisconnectReason.badSession
        ].includes(reason)) {
          log.warn(`Reconectando subbot... (${reason})`)
          startSubBot(sessionPath)
        } else if (reason === DisconnectReason.loggedOut) {
          log.warn(`Sesión subbot cerrada. Eliminando [${sessionPath}]...`)
          fs.rmSync(sessionPath, { recursive: true, force: true })
        } else if (reason === DisconnectReason.forbidden) {
          log.error(`Acceso denegado subbot. Eliminando [${sessionPath}]...`)
          fs.rmSync(sessionPath, { recursive: true, force: true })
        } else {
          log.warn(`Reconectando subbot por desconexión desconocida (${reason})...`)
          startSubBot(sessionPath)
        }
      }
    })

    subConn.ev.on('messages.upsert', async ({ messages, type }) => {
      try {
        if (type !== 'notify') return
        let m = messages[0]
        if (!m?.message) return

        if (Object.keys(m.message)[0] === 'ephemeralMessage') {
          m.message = m.message.ephemeralMessage.message
        }

        if (m.key?.remoteJid === 'status@broadcast') return
        if (m.key?.id?.startsWith('BAE5') && m.key.id.length === 16) return

        m = await smsg(subConn, m)
        await handler(m, subConn, plugins)
      } catch (e) {
        log.error(`Error en mensaje subbot: ${e.message}`)
      }
    })

    return subConn
  } catch (e) {
    log.error(`Error iniciando subbot [${sessionPath}]: ${e.message}`)
    return null
  }
}

async function autoConnectSubBots () {
  try {
    if (!fs.existsSync(SUBBOTS_DIR)) {
      fs.mkdirSync(SUBBOTS_DIR, { recursive: true })
      return
    }
    const folders = fs.readdirSync(SUBBOTS_DIR).filter(f => {
      const fullPath = path.join(SUBBOTS_DIR, f)
      return fs.statSync(fullPath).isDirectory() &&
        fs.existsSync(path.join(fullPath, 'creds.json'))
    })
    if (folders.length === 0) return
    log.info(`Reconectando ${folders.length} subbot(s)...`)
    for (const folder of folders) {
      await startSubBot(path.join(SUBBOTS_DIR, folder))
    }
  } catch (e) {
    log.error(`Error en autoConnectSubBots: ${e.message}`)
  }
}

global.startSubBot = startSubBot
global.subBotsDir = SUBBOTS_DIR

async function startBot () {
  const { state, saveCreds } = await useMultiFileAuthState(global.sessionName)
  const { version } = await fetchLatestBaileysVersion()
  const logger = pino({ level: 'silent' })

  const conn = makeWASocket({
    version,
    logger,
    printQRInTerminal: false,
    browser: Browsers.macOS('Chrome'),
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, logger)
    },
    markOnlineOnConnect: false,
    generateHighQualityLinkPreview: true,
    syncFullHistory: false,
    getMessage: async () => '',
    keepAliveIntervalMs: 45000
  })

  global.conn = conn

  conn.decodeJid = jid => {
    if (!jid) return jid
    if (/:\d+@/gi.test(jid)) {
      const decode = jidDecode(jid) || {}
      return decode.user && decode.server ? decode.user + '@' + decode.server : jid
    }
    return jid
  }

  conn.ev.on('creds.update', saveCreds)

  if (opcion === '2' && !fs.existsSync('./Sessions/Owner/creds.json')) {
    setTimeout(async () => {
      try {
        if (!state.creds.registered) {
          const pairing = await conn.requestPairingCode(phoneNumber)
          const code = pairing?.match(/.{1,4}/g)?.join('-') || pairing
          console.log(
            chalk.hex('#ff1493')('\n♡━━━━━━━━━━━━━━━━━━━━♡\n') +
            chalk.whiteBright('  CÓDIGO DE EMPAREJAMIENTO\n') +
            chalk.hex('#ff1493')('♡━━━━━━━━━━━━━━━━━━━━♡\n') +
            chalk.whiteBright(`  ${code}\n`) +
            chalk.hex('#ff1493')('♡━━━━━━━━━━━━━━━━━━━━♡\n')
          )
        }
      } catch (e) {
        log.error(`Error al generar código: ${e.message}`)
      }
    }, 3000)
  }

  conn.ev.on('connection.update', async update => {
    const { qr, connection, lastDisconnect } = update

    if (qr && opcion === '1') {
      console.log(chalk.hex('#ff1493')('\nꕤ Escanea el código QR:\n'))
      qrcode.generate(qr, { small: true })
    }

    if (connection === 'open') {
      console.log(zeroBanner)
      log.success(`Conectado como: ${conn.user?.name || 'Desconocido'}`)
      log.info(`Plugins cargados: ${plugins.size}`)
      await loadEvents(conn)
      await autoConnectSubBots()
    }

    if (connection === 'close') {
      const reason = lastDisconnect?.error?.output?.statusCode

      if ([
        DisconnectReason.connectionLost,
        DisconnectReason.connectionClosed,
        DisconnectReason.restartRequired,
        DisconnectReason.timedOut,
        DisconnectReason.badSession
      ].includes(reason)) {
        log.warn(`Reconectando... (${reason})`)
        startBot()
      } else if (reason === DisconnectReason.loggedOut) {
        log.warn('Sesión cerrada. Eliminando sesión...')
        exec('rm -rf ./Sessions/Owner/*')
        process.exit(1)
      } else if (reason === DisconnectReason.forbidden) {
        log.error('Acceso denegado. Eliminando sesión...')
        exec('rm -rf ./Sessions/Owner/*')
        process.exit(1)
      } else if (reason === DisconnectReason.multideviceMismatch) {
        log.warn('Multidispositivo no coincide. Reiniciando...')
        exec('rm -rf ./Sessions/Owner/*')
        process.exit(0)
      } else {
        log.error(`Desconexión desconocida: ${reason}`)
        startBot()
      }
    }
  })

  conn.ev.on('messages.upsert', async ({ messages, type }) => {
    try {
      if (type !== 'notify') return
      let m = messages[0]
      if (!m?.message) return

      if (Object.keys(m.message)[0] === 'ephemeralMessage') {
        m.message = m.message.ephemeralMessage.message
      }

      if (m.key?.remoteJid === 'status@broadcast') return
      if (m.key?.id?.startsWith('BAE5') && m.key.id.length === 16) return

      m = await smsg(conn, m)
      await handler(m, conn, plugins)
    } catch (e) {
      log.error(`Error en mensaje: ${e.message}`)
    }
  })
}

;(async () => {
  console.log(chalk.hex('#ff1493')('\n♡ :: Iniciando Demitra bot...\n'))
  await database.read()
  log.success('Base de datos cargada.')
  await loadPlugins()
  global.plugins = plugins
  await startBot()
})()