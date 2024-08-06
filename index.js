const axios = require('axios');
const { Telegraf } = require('telegraf');

require('dotenv').config();

const bot = new Telegraf(process.env.BOT_TOKEN);
const youtubeApiKey = process.env.YOUTUBE_API_KEY;

// Команда /start
bot.start((ctx) => {
  ctx.reply('Добро пожаловать! Введите название нашида для поиска.');
});

// Команда /help
bot.help((ctx) => {
  ctx.reply('Вы можете использовать следующие команды:\n/start - начать работу с ботом\n/search <название нашида> - искать нашид\n/help - помощь');
});

// Обработчик команды /search
bot.command('search', async (ctx) => {
  const query = ctx.message.text.split(' ').slice(1).join(' ');
  if (!query) {
    return ctx.reply('Пожалуйста, укажите название нашида для поиска.');
  }
  
  try {
    const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        part: 'snippet',
        q: query,
        type: 'video',
        key: youtubeApiKey,
        maxResults: 5,  // Максимальное количество результатов
      },
    });

    const videos = response.data.items;
    if (videos.length === 0) {
      return ctx.reply('Не удалось найти нашиды по вашему запросу.');
    }

    let reply = 'Нашиды по вашему запросу:\n';
    videos.forEach((video) => {
      const title = video.snippet.title;
      const url = `https://www.youtube.com/watch?v=${video.id.videoId}`;
      reply += `${title}\n${url}\n\n`;
    });

    ctx.reply(reply);
  } catch (error) {
    console.error('Ошибка при запросе YouTube API:', error);
    ctx.reply('Произошла ошибка при поиске на YouTube. Пожалуйста, попробуйте еще раз.');
  }
});
Users/admin/Documents/GitHub/tverio-team-bot/telegram-bot
// Обработчик текстовых сообщений
bot.on('text', async (ctx) => {
  const query = ctx.message.text;
  try {
    const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        part: 'snippet',
        q: query,
        type: 'video',
        key: youtubeApiKey,
        maxResults: 5,
      },
    });

    const videos = response.data.items;
    if (videos.length === 0) {
      return ctx.reply('Не удалось найти нашиды по вашему запросу.');
    }

    let reply = 'Нашиды по вашему запросу:\n';
    videos.forEach((video) => {
      const title = video.snippet.title;
      const url = `https://www.youtube.com/watch?v=${video.id.videoId}`;
      reply += `${title}\n${url}\n\n`;
    });

    ctx.reply(reply);
  } catch (error) {
    console.error('Ошибка при запросе YouTube API:', error);
    ctx.reply('Произошла ошибка при поиске на YouTube. Пожалуйста, попробуйте еще раз.');
  }
});

// Запуск бота
bot.launch();

// Обработка завершения процесса
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
