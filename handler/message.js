// ========================================
// KELIBOT MESSAGE HANDLER
// ========================================


// ========================================
// IMPORT
// ========================================

const {
    askAI
} = require("../lib/ai");


const {
    isAIEnabled
} = require("../lib/settings");


const {
    handleCommand
} = require("./commands");


const {
    addMessageCount,
    addAIRequest
} = require("../lib/botStats");


// ========================================
// PESAN BANTUAN SAAT AI MODE OFF
// ========================================

function getAICommandHelp() {

    return `
🤖 *UNTUK BERTANYA KE AI*

Gunakan salah satu cara berikut:

*/on ai*

• Untuk mengaktifkan AI Mode

Setelah aktif, kamu bisa langsung
mengirim pesan tanpa menulis
"ai" di awal.

━━━━━━━━━━━━━━━━

*/off ai*

• Untuk menonaktifkan AI Mode

━━━━━━━━━━━━━━━━

*ai <pertanyaan>*

• Untuk bertanya ke AI satu kali

Contoh:

_ai Jelaskan ESP32_

━━━━━━━━━━━━━━━━

Ketik *menu* untuk melihat
semua perintah.
`.trim();

}


// ========================================
// FUNGSI KIRIM PESAN KE AI
// ========================================

async function sendToAI(
    sock,
    jid,
    prompt
) {

    try {

        console.log(
            "🧠 Mengirim pesan ke AI..."
        );


        // Tambah statistik setiap
        // pesan yang dikirim ke AI
        addAIRequest();
        
        // Menampilkan status mengetik
        await sock.sendPresenceUpdate(

            "composing",

            jid

        );


        // Kirim ke AI

        const reply =

            await askAI(

                jid,

                prompt

            );


        // Kirim jawaban ke WhatsApp

        await sock.sendMessage(

            jid,

            {

                text:
                    reply

            }

        );


        console.log(
            "✅ Balasan AI terkirim."
        );


    } catch (error) {

        console.error(

            "❌ Gagal memproses AI:",

            error

        );


        // Pesan error ke pengguna

        await sock.sendMessage(

            jid,

            {

                text:

                    "❌ Maaf, terjadi " +

                    "gangguan saat " +

                    "menghubungi AI.\n\n" +

                    "Silakan coba lagi."

            }

        );


    } finally {

        // Hentikan indikator mengetik

        try {

            await sock.sendPresenceUpdate(

                "paused",

                jid

            );

        } catch (error) {

            console.log(

                "⚠️ Status mengetik " +

                "tidak dapat dihentikan."

            );

        }

    }

}


// ========================================
// FUNGSI UTAMA
// ========================================

async function handleMessage(
    sock,
    message
) {

    try {

        // ====================================
        // VALIDASI PESAN
        // ====================================

        if (

            !message ||

            !message.message

        ) {

            return;

        }


        // ====================================
        // AMBIL JID
        // ====================================

        const jid =

            message.key
                ?.remoteJid;


        if (!jid) {

            return;

        }


        // ====================================
        // ABAIKAN STATUS WHATSAPP
        // ====================================

        if (

            jid ===

            "status@broadcast"

        ) {

            return;

        }


        // ====================================
        // ABAIKAN PESAN DARI BOT SENDIRI
        // ====================================

        if (

            message.key
                ?.fromMe

        ) {

            return;

        }


        // ====================================
        // AMBIL PESAN TEKS
        // ====================================

        const text =

            message.message
                ?.conversation ||

            message.message
                ?.extendedTextMessage
                ?.text ||

            "";


        // Jika bukan pesan teks

        if (

            !text ||

            !text.trim()

        ) {

            return;

        }


        // Bersihkan spasi

        const cleanText =

            text.trim();


        // ====================================
        // TAMBAH STATISTIK PESAN
        // ====================================

        addMessageCount();


        // ====================================
        // LOG PESAN
        // ====================================

        console.log("");

        console.log(

            "===================================="

        );

        console.log(

            "📩 PESAN MASUK"

        );

        console.log(

            "Pesan :",

            cleanText

        );

        console.log(

            "Dari  :",

            jid

        );

        console.log(

            "===================================="

        );


        // ====================================
        // PRIORITAS 1
        // PROSES COMMAND
        // ====================================

        const commandResult =

            await handleCommand(

                sock,

                jid,

                cleanText

            );


        // ====================================
        // COMMAND LOKAL
        // ====================================

        if (

            commandResult
                ?.handled === true

        ) {

            console.log(

                "⚙️ Command lokal " +

                "diproses."

            );

            return;

        }


        // ====================================
        // AI SEKALI PAKAI
        // ====================================

        /*
        Contoh:

        ai Jelaskan ESP32

        commands.js mengembalikan:

        {
            handled: false,
            useAI: true,
            prompt: "Jelaskan ESP32"
        }

        Bagian ini harus dicek
        sebelum AI Mode.
        */

        if (

            commandResult
                ?.useAI === true

        ) {

            console.log(

                "🤖 Mode: AI sekali pakai"

            );


            console.log(

                "📝 Prompt:",

                commandResult.prompt

            );


            await sendToAI(

                sock,

                jid,

                commandResult.prompt

            );


            return;

        }


        // ====================================
        // CEK AI MODE
        // ====================================

        const aiModeActive =

            isAIEnabled(
                jid
            );


        // ====================================
        // AI MODE ON
        // ====================================

        if (

            aiModeActive === true

        ) {

            console.log(

                "🤖 AI Mode: ON"

            );


            await sendToAI(

                sock,

                jid,

                cleanText

            );


            return;

        }


        // ====================================
        // AI MODE OFF
        // ====================================

        console.log(

            "🔕 AI Mode: OFF"

        );


        console.log(

            "ℹ️ Pesan biasa tidak " +

            "diteruskan ke AI."

        );


        // Kirim panduan AI

        await sock.sendMessage(

            jid,

            {

                text:

                    getAICommandHelp()

            }

        );


    } catch (error) {

        console.error("");

        console.error(

            "❌ MESSAGE HANDLER ERROR"

        );

        console.error(

            error

        );

    }

}


// ========================================
// EXPORT
// ========================================

module.exports = {

    handleMessage

};