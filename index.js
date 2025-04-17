const express = require('express');
const mineflayer = require('mineflayer');
const { pathfinder } = require('mineflayer-pathfinder');
const { Movements, goals } = require('mineflayer-pathfinder');
const Random = require('random-js');  // Importando a biblioteca random-js
const random = new Random();   // Instanciando corretamente o random-js

const app = express();
const port = process.env.PORT || 3000;

let bot;
let chatLog = []; // Guardar os últimos chats
let botStartTime = new Date();

function createBot() {
  bot = mineflayer.createBot({
    host: 'mapatest97.aternos.me',
    port: 18180,
    username: 'junin123123',  // Nome do usuário do bot
    version: '1.21.4',
  });

  bot.loadPlugin(pathfinder);

  bot.on('spawn', () => {
    console.log('🤖 Bot conectado!');
    botStartTime = new Date();
    
    // Começar o movimento aleatório após o spawn
    startRandomMovement();
  });

  bot.on('chat', (username, message) => {
    if (username === bot.username) return;

    if (message === 'andar') {
      bot.chat('Vou andar aleatoriamente!');
      startRandomMovement();
    }

    console.log(`${username}: ${message}`);
    chatLog.unshift({ username, message, timestamp: new Date() });

    if (chatLog.length > 10) chatLog.pop(); // Limitar para os últimos 10 comandos
  });

  bot.on('end', () => {
    console.log('⚠️ Bot desconectado.');
  });

  bot.on('error', (err) => {
    console.error('Erro no bot:', err);
  });
}

function startRandomMovement() {
  const randomX = random.int(100, 200);
  const randomZ = random.int(100, 200);
  const randomY = bot.entity.position.y; // Manter a altura atual

  const goal = new goals.GoalBlock(randomX, randomY, randomZ);
  const movements = new Movements(bot, bot.entity.gameMode);
  
  bot.pathfinder.setMovements(movements);
  bot.pathfinder.setGoal(goal);

  console.log(`🤖 Bot indo para a coordenada aleatória: (${randomX}, ${randomY}, ${randomZ})`);
  
  // Agendar o próximo movimento aleatório após 10-20 segundos
  setTimeout(startRandomMovement, random.int(10000, 20000)); // Tempo aleatório entre 10 a 20 segundos
}

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) => {
  const uptime = Math.floor((new Date() - botStartTime) / 1000);
  const playersOnline = bot?.players ? Object.keys(bot.players).length : 0;

  res.render('index', {
    status: 'online',
    commands: chatLog,
    playersOnline,
    botUptime: uptime
  });
});

app.listen(port, () => {
  console.log(`🌐 Servidor web em http://localhost:${port}`);
  createBot();
});
