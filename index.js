const mineflayer = require('mineflayer')
const express = require('express')
const app = express()
const port = process.env.PORT || 3000

let botStatus = 'desconectado'
let onlinePlayers = 0
let botStartTime = null
let chatLog = []

function getUptime() {
  if (!botStartTime) return 'Desconectado'
  const diff = Math.floor((Date.now() - botStartTime) / 1000)
  const h = Math.floor(diff / 3600)
  const m = Math.floor((diff % 3600) / 60)
  const s = diff % 60
  return `${h}h ${m}m ${s}s`
}

const bot = mineflayer.createBot({
  host: 'ip-do-servidor',
  port: 25565,
  username: 'bot_espectador',
  version: '1.21.4'
})

bot.on('spawn', () => {
  console.log('Bot entrou no servidor!')
  botStatus = 'online'
  botStartTime = Date.now()

  setInterval(() => {
    bot.setControlState('jump', true)
    setTimeout(() => bot.setControlState('jump', false), 200)
    bot.look(Math.random() * 360, Math.random() * 360, true)
    onlinePlayers = Object.keys(bot.players).length
  }, 10000)
})

bot.on('chat', (username, message) => {
  if (username !== bot.username) {
    const timestamp = new Date().toLocaleTimeString()
    chatLog.push(`[${timestamp}] <${username}> ${message}`)
    if (chatLog.length > 50) chatLog.shift()
  }
})

bot.on('end', () => {
  botStatus = 'desconectado'
  onlinePlayers = 0
  botStartTime = null
  setTimeout(() => bot.connect(), 5000)
})

bot.on('error', err => {
  console.log('Erro:', err)
  botStatus = 'erro'
})

// Rotas API
app.get('/status', (req, res) => {
  res.json({
    status: botStatus,
    players: onlinePlayers,
    uptime: getUptime(),
    chat: chatLog
  })
})

// Página
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Status do Bot</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #111;
            color: #eee;
            text-align: center;
            padding: 40px;
          }
          h1 { font-size: 2em; margin-bottom: 10px; }
          #status, #players, #uptime { font-size: 1.2em; margin: 5px; }
          #chat { margin-top: 30px; background: #222; padding: 10px; text-align: left; height: 300px; overflow-y: scroll; border-radius: 8px; }
          .msg { margin-bottom: 5px; font-family: monospace; }
        </style>
      </head>
      <body>
        <h1>Bot Mineflayer</h1>
        <div id="status">Status: carregando...</div>
        <div id="players">Jogadores online: carregando...</div>
        <div id="uptime">Tempo online: carregando...</div>
        <div id="chat"></div>

        <script>
          async function atualizarStatus() {
            const res = await fetch('/status')
            const data = await res.json()

            document.getElementById('status').textContent = 'Status: ' + data.status
            document.getElementById('players').textContent = 'Jogadores online: ' + data.players
            document.getElementById('uptime').textContent = 'Tempo online: ' + data.uptime

            const chatDiv = document.getElementById('chat')
            chatDiv.innerHTML = data.chat.map(msg => '<div class="msg">' + msg + '</div>').join('')
            chatDiv.scrollTop = chatDiv.scrollHeight
          }

          setInterval(atualizarStatus, 2000)
          atualizarStatus()
        </script>
      </body>
    </html>
  `)
})

app.listen(port, () => {
  console.log(`Servidor web rodando na porta ${port}`)
})
