// ========================================
// KELIBOT COMMAND ROUTER
// ========================================


const {
    askAI,
    clearUserMemory,
    getMemoryCount
} = require("../lib/ai");


const {
    isAIEnabled,
    setAIEnabled
} = require("../lib/settings");


const {
    addAIRequest,
    addLocalCommand,
    getStats,
    formatUptime
} = require("../lib/botStats");


// ========================================
// KONFIGURASI BOT
// ========================================

const BOT_NAME = "KeliBot";

const BOT_VERSION = "2.0.0";

const AI_PROVIDER = "Groq";

const AI_MODEL =
    "Llama 3.3 70B";


// Ubah sesuai nama kamu

const OWNER_NAME =
    "Owner KeliBot";


const OWNER_NUMBER =
    "-";


// Setelah ini langsung lanjut
// ke MENU UTAMA

// ========================================
// MENU UTAMA
// ========================================

function getMenu() {

    return `
╭━━━━━━━━━━━━━━━━━━╮
│ 🤖 *AI MODE*
╰━━━━━━━━━━━━━━━━━━╯

/on ai
• Aktifkan AI Mode

/off ai
• Nonaktifkan AI Mode

ai <pertanyaan>
• Untuk Tanya AI satu kali

Contoh:
_ai Jelaskan apa itu ESP32_

━━━━━━━━━━━━━━━━━━

⚙️ *COMMAND SISTEM*

• menu
• help
• ping
• status
• runtime
• info
• owner
• stats

🧠 *COMMAND MEMORI AI*

• memory = Lihat jumlah memori
• reset = Hapus memori

━━━━━━━━━━━━━━━━━━

💡 *CATATAN*

Untuk bertanya ke AI,
gunakan Command berikut:

/on ai
• Untuk mengaktifkan AI Mode

/off ai
• Untuk menonaktifkan AI Mode


*ai <pertanyaan>*  
• Untuk tanya AI satu kali

━━━━━━━━━━━━━━━━━━

🚀 ${BOT_NAME} siap membantu!
`.trim();

}


// ========================================
// INFO BOT
// ========================================

function getInfo() {

    return `
╭━━━━━━━━━━━━━━━━━━╮
│ ℹ️ *INFO KELIBOT*
╰━━━━━━━━━━━━━━━━━━╯

🤖 Nama:
${BOT_NAME}

📦 Versi:
${BOT_VERSION}

🧠 AI:
${AI_PROVIDER}

⚙️ Model:
${AI_MODEL}

💻 Dibuat dengan:
Node.js + Baileys

━━━━━━━━━━━━━━━━━━

KeliBot adalah bot WhatsApp
yang dapat membantu menjawab
pertanyaan menggunakan AI.
`.trim();

}


// ========================================
// STATUS BOT
// ========================================

function getStatus() {

    const stats =
        getStats();


    const uptime =
        formatUptime(
            stats.uptime
        );

    return `
╭━━━━━━━━━━━━━━━━━━╮
│ 📊 *STATUS KELIBOT*
╰━━━━━━━━━━━━━━━━━━╯

🟢 Bot:
Online

🤖 AI:
${AI_PROVIDER}

🧠 Model:
${AI_MODEL}

⏱️ Uptime:
${uptime}

✅ Sistem berjalan normal.
`.trim();

}


// ========================================
// RUNTIME
// ========================================

function getRuntime() {

    const stats =
        getStats();


    const uptime =
        formatUptime(
            stats.uptime
        );

    return `
⏱️ *RUNTIME KELIBOT*

Bot telah aktif selama:

${uptime}
`.trim();

}


// ========================================
// OWNER
// ========================================

function getOwner() {

    return `
╭━━━━━━━━━━━━━━━━━━╮
│ 👤 *OWNER KELIBOT*
╰━━━━━━━━━━━━━━━━━━╯

Nama: Yoga
${OWNER_NAME}

Nomor:
${OWNER_NUMBER}

━━━━━━━━━━━━━━━━━━

Gunakan informasi ini
jika membutuhkan bantuan
terkait KeliBot.
`.trim();

}


// ========================================
// STATISTIK
// ========================================

function getStatsMessage() {

    const stats =
        getStats();


    const uptime =
        formatUptime(
            stats.uptime
        );


    return `
╭━━━━━━━━━━━━━━━━━━╮
│ 📈 *STATISTIK KELIBOT*
╰━━━━━━━━━━━━━━━━━━╯

📩 Total pesan:
${stats.totalMessages}

🤖 Request AI:
${stats.aiRequests}

⚡ Command lokal:
${stats.localCommands}

📱 WhatsApp:
${stats.whatsappStatus}

⏱️ Uptime:
${uptime}

━━━━━━━━━━━━━━━━━━

ℹ️ Statistik akan kembali
ke nol jika bot restart.
`.trim();

}


// ========================================
// PESAN BANTUAN AI
// ========================================

function getAIHelp() {

    return `
🤖 *CARA MENGGUNAKAN AI*

Gunakan format:

*ai <pertanyaan>*

Contoh:

ai Jelaskan ESP32

ai Apa perbedaan
HTML, CSS, dan JavaScript?

ai Buatkan kode
HTML sederhana
`.trim();

}


// ========================================
// COMMAND ROUTER
// ========================================

async function handleCommand(
    sock,
    jid,
    text
) {

    // Bersihkan teks
    const cleanText =
        text.trim();

    // Ubah menjadi huruf kecil
    const command =
        cleanText.toLowerCase();


// ====================================
// AI MODE ON
// ====================================

if (

    command === "/on ai" ||

    command === "/onai" ||

    command === "ai on"

) {

    // Cek apakah AI sudah aktif

    if (
        isAIEnabled(jid)
    ) {

        await sock.sendMessage(
            jid,
            {
                text: `
🤖 *MODE AI SUDAH AKTIF*

Kamu sudah bisa langsung
mengirim pesan tanpa mengetik
"ai" di awal.

Contoh:

Halo
Apa itu ESP32?
Bantu buat kode JavaScript

Untuk mematikan:

*/off ai*
`.trim()
            }
        );

        return {

            handled: true,

            useAI: false

        };

    }


    // Aktifkan AI Mode

    setAIEnabled(
        jid,
        true
    );


    await sock.sendMessage(
        jid,
        {
            text: `
🤖 *MODE AI AKTIF*

Sekarang kamu bisa langsung
mengirim pesan tanpa mengetik
"ai" di awal.

Contoh:

Halo
Apa itu ESP32?
Bantu buat kode JavaScript

🧠 Percakapan akan menggunakan
memori KeliBot.

Untuk menonaktifkan mode AI:

*/off ai*
`.trim()
        }
    );


    return {

        handled: true,

        useAI: false

    };

}


// ====================================
// AI MODE OFF
// ====================================

if (

    command === "/off ai" ||

    command === "/offai" ||

    command === "ai off"

) {

    // Matikan AI Mode

    setAIEnabled(
        jid,
        false
    );


    await sock.sendMessage(
        jid,
        {
            text: `
🔕 *MODE AI DINONAKTIFKAN*

Pesan biasa sekarang tidak akan
langsung diteruskan ke AI.

Untuk bertanya satu kali
tanpa mengaktifkan mode:

*ai <pertanyaan>*

Contoh:

ai Apa itu ESP32?

━━━━━━━━━━━━━━━━

🤖 *COMMAND AI*

/on ai
→ Aktifkan mode AI

/off ai
→ Nonaktifkan mode AI

memory
→ Lihat jumlah memori

reset
→ Hapus memori AI
`.trim()
        }
    );


    return {

        handled: true,

        useAI: false

    };

}

    // ====================================
    // MENU
    // ====================================

    if (

        command === "menu" ||

        command === "!menu" ||

        command === "help" ||

        command === "!help"

    ) {

        addLocalCommand();

        await sock.sendMessage(
            jid,
            {
                text:
                    getMenu()
            }
        );

        return {

            handled: true,

            useAI: false

        };

    }


    // ====================================
    // PING
    // ====================================

    if (

        command === "ping" ||

        command === "!ping"

    ) {

        addLocalCommand();

        const start =
            Date.now();

        await sock.sendMessage(
            jid,
            {
                text:

                    "🏓 *PONG!*\n\n" +

                    "⚡ Bot merespons dalam " +

                    `${Date.now() - start} ms`

            }
        );

        return {

            handled: true,

            useAI: false

        };

    }


    // ====================================
    // STATUS
    // ====================================

    if (

        command === "status" ||

        command === "!status"

    ) {

        addLocalCommand();

        await sock.sendMessage(
            jid,
            {
                text:
                    getStatus()
            }
        );

        return {

            handled: true,

            useAI: false

        };

    }


    // ====================================
    // RUNTIME
    // ====================================

    if (

        command === "runtime" ||

        command === "!runtime"

    ) {

        addLocalCommand();

        await sock.sendMessage(
            jid,
            {
                text:
                    getRuntime()
            }
        );

        return {

            handled: true,

            useAI: false

        };

    }


    // ====================================
    // INFO
    // ====================================

    if (

        command === "info" ||

        command === "!info"

    ) {

        addLocalCommand();

        await sock.sendMessage(
            jid,
            {
                text:
                    getInfo()
            }
        );

        return {

            handled: true,

            useAI: false

        };

    }


    // ====================================
    // OWNER
    // ====================================

    if (

        command === "owner" ||

        command === "!owner"

    ) {

        addLocalCommand();

        await sock.sendMessage(
            jid,
            {
                text:
                    getOwner()
            }
        );

        return {

            handled: true,

            useAI: false

        };

    }


    // ====================================
    // STATS
    // ====================================

    if (

        command === "stats" ||

        command === "!stats"

    ) {

        addLocalCommand();

        await sock.sendMessage(
            jid,
            {
                text:
                    getStatsMessage()
            }
        );

        return {

            handled: true,

            useAI: false

        };

    }

    // ====================================
// MEMORY
// ====================================

if (

    command === "memory" ||

    command === "!memory"

) {

    addLocalCommand();

    const memoryCount =
        getMemoryCount(jid);

    const conversationCount =
        Math.floor(
            memoryCount / 2
        );

    await sock.sendMessage(
        jid,
        {
            text: `
🧠 *MEMORI KELIBOT*

📩 Pesan tersimpan:
${memoryCount}

💬 Perkiraan percakapan:
${conversationCount}

📌 Memori digunakan agar
KeliBot dapat memahami
konteks chat sebelumnya.

Gunakan:

*reset*

atau:

*clear*

untuk menghapus memori.
`.trim()
        }
    );

    return {

        handled: true,

        useAI: false

    };

}

// ====================================
// RESET / CLEAR MEMORY
// ====================================

if (

    command === "reset" ||

    command === "!reset" ||

    command === "clear" ||

    command === "!clear"

) {

    addLocalCommand();

    const memoryCount =
        getMemoryCount(jid);

    // Jika belum ada memori
    if (
        memoryCount === 0
    ) {

        await sock.sendMessage(
            jid,
            {
                text: `
🧠 *MEMORI KOSONG*

Belum ada riwayat AI
yang tersimpan untuk chat ini.
`.trim()
            }
        );

        return {

            handled: true,

            useAI: false

        };

    }

    // Hapus memori pengguna
    clearUserMemory(jid);

    await sock.sendMessage(
        jid,
        {
            text: `
🧹 *MEMORI BERHASIL DIHAPUS*

Riwayat percakapan AI
untuk chat ini sudah dibersihkan.

KeliBot akan memulai
percakapan baru.

Kamu bisa mulai bertanya lagi 🤖
`.trim()
        }
    );

    return {

        handled: true,

        useAI: false

    };

}

    // ====================================
    // AI TANPA PERTANYAAN
    // ====================================

    if (

        command === "ai" ||

        command === "!ai"

    ) {

        addLocalCommand();

        await sock.sendMessage(
            jid,
            {
                text:
                    getAIHelp()
            }
        );

        return {

            handled: true,

            useAI: false

        };

    }


    // ====================================
    // AI DENGAN PERTANYAAN
    // ====================================

    const aiPrefix =

        cleanText
            .toLowerCase()
            .match(
                /^(ai|!ai)\s+(.+)/i
            );


    if (aiPrefix) {

        const prompt =
            aiPrefix[2]
                .trim();


        // Jika prompt kosong
        if (!prompt) {

            addLocalCommand();

            await sock.sendMessage(
                jid,
                {
                    text:
                        getAIHelp()
                }
            );

            return {

                handled: true,

                useAI: false

            };

        }


        // Catat request AI
        addAIRequest();


        return {

            handled: false,

            useAI: true,

            prompt

        };

    }


    // ====================================
    // BUKAN COMMAND
    // ====================================

    return {

        handled: false,

        useAI: false

    };

}


// ========================================
// EXPORT
// ========================================

module.exports = {

    handleCommand

};