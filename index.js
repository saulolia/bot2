const mineflayer = require('mineflayer');
const pathfinder = require('mineflayer-pathfinder');
const mcData = require('minecraft-data');
const { Random } = require('random-js');

const bot = mineflayer.createBot({
  host: 'mapatest97.aternos.me',  // Substitua pelo IP do seu servidor Aternos
  port: 18180,  // A porta fornecida
  username: 'junin123123',  // Substitua pelo seu nome de usuário
  password: 'yourpassword',  // Se necessário
  version: '1.21.4'  // A versão do Minecraft que você está utilizando no servidor
});

const random = new Random();

bot.on('spawn', () => {
  console.log("Bot conectado ao servidor Minecraft!");

  // Exemplo de movimento do bot
  bot.setControlState('forward', true);  // O bot começará a se mover para frente
  setTimeout(() => {
    bot.setControlState('forward', false);  // O bot parará depois de 5 segundos
  }, 5000);
});

bot.on('error', err => {
  console.error('Erro do bot:', err);
});

bot.on('end', () => {
  console.log('Bot desconectado!');
});
