const {
    default: makeWASocket,
    useMultiFileAuthState,
    DisconnectReason,
    fetchLatestBaileysVersion
} = require("@whiskeysockets/baileys");

const qrcode = require("qrcode-terminal");

const {
    handleMessage
} = require("../handler/message");

const {
    setWhatsAppStatus
} = require(
    "./botStats"
);

// ========================================
// STATUS RECONNECT
// ========================================

// Mencegah beberapa reconnect berjalan bersamaan
let reconnecting = false;

// ========================================
// FUNGSI MEMULAI WHATSAPP
// ========================================

async function startWhatsApp() {

    try {

        console.log("");
        console.log("==================================");
        console.log("   MEMULAI KONEKSI WHATSAPP...");
        console.log("==================================");

        // ========================================
        // MEMBACA / MEMBUAT SESSION
        // ========================================

        const {
            state,
            saveCreds
        } = await useMultiFileAuthState(
            "session"
        );

        // ========================================
        // MENGAMBIL VERSI BAILEYS TERBARU
        // ========================================

        const {
            version
        } = await fetchLatestBaileysVersion();

        console.log(
            `📦 Baileys version: ${version.join(".")}`
        );

        // ========================================
        // MEMBUAT KONEKSI WHATSAPP
        // ========================================

        const sock = makeWASocket({

            version,

            auth: state,

            // QR dibuat manual dengan qrcode-terminal
            printQRInTerminal: false,

            // Mengambil pesan terbaru saja
            syncFullHistory: false,

            // Mengurangi pemrosesan pesan yang tidak perlu
            markOnlineOnConnect: false

        });

        // ========================================
        // EVENT KONEKSI
        // ========================================

        sock.ev.on(
            "connection.update",
            async (update) => {

                const {
                    connection,
                    qr,
                    lastDisconnect
                } = update;

                // ========================================
                // QR CODE
                // ========================================

                if (qr) {

                    console.clear();

                    console.log(
                        "=================================="
                    );

                    console.log(
                        "      SCAN QR WHATSAPP"
                    );

                    console.log(
                        "=================================="
                    );

                    qrcode.generate(
                        qr,
                        {
                            small: true
                        }
                    );

                }

                // ========================================
                // KONEKSI BERHASIL
                // ========================================

                if (
    connection === "open"
) {

    // Ubah status WhatsApp
    // menjadi online

    setWhatsAppStatus(
        true
    );


    console.clear();

    console.log(
        "=================================="
    );

    console.log(
        " WhatsApp Connected Successfully"
    );

    console.log(
        "=================================="
    );

                    console.log(
                        "🟢 KeliBot siap menerima pesan."
                    );

                }

                // ========================================
                // KONEKSI TERPUTUS
                // ========================================

                if (
                    connection === "close"
                ) {

                setWhatsAppStatus(
                false
                );

                    const statusCode =
                        lastDisconnect
                            ?.error
                            ?.output
                            ?.statusCode;

                    const isLoggedOut =
                        statusCode ===
                        DisconnectReason.loggedOut;

                    console.log("");
                    console.log(
                        "🔴 Koneksi WhatsApp terputus."
                    );

                    console.log(
                        "Status:",
                        statusCode ||
                        "tidak diketahui"
                    );

                    // ====================================
                    // JIKA LOGOUT
                    // ====================================

                    if (isLoggedOut) {

                        console.log("");
                        console.log(
                            "⚠️ Session Logout."
                        );

                        console.log(
                            "Hapus folder 'session',"
                        );

                        console.log(
                            "lalu jalankan ulang bot"
                        );

                        return;

                    }

                    // ====================================
                    // RECONNECT OTOMATIS
                    // ====================================

                    if (!reconnecting) {

                        reconnecting = true;

                        console.log(
                            "🔄 Mencoba reconnect..."
                        );

                        // Jeda kecil sebelum reconnect
                        setTimeout(
                            () => {

                                startWhatsApp();

                            },
                            3000
                        );

                    }

                }

            }
        );

        // ========================================
        // PESAN MASUK
        // ========================================

        sock.ev.on(
            "messages.upsert",
            async ({
                messages,
                type
            }) => {

                // Hanya proses pesan baru
                if (
                    type !== "notify"
                ) {

                    return;

                }

                // Proses semua pesan
                for (
                    const message
                    of messages
                ) {

                    // Abaikan pesan kosong
                    if (
                        !message?.message
                    ) {

                        continue;

                    }

                    // Abaikan pesan yang dikirim bot sendiri
                    if (
                        message.key?.fromMe
                    ) {

                        continue;

                    }

                    // Abaikan pesan lama
                    if (
                        message.messageTimestamp
                    ) {

                        const timestamp =
                            Number(
                                message
                                    .messageTimestamp
                            ) * 1000;

                        const age =
                            Date.now() -
                            timestamp;

                        // Pesan lebih dari 2 menit
                        // tidak diproses
                        if (
                            age >
                            2 * 60 * 1000
                        ) {

                            console.log(
                                "⏭️ Pesan lama diabaikan."
                            );

                            continue;

                        }

                    }

                    // Kirim ke message handler
                    await handleMessage(
                        sock,
                        message
                    );

                }

            }
        );

        // ========================================
        // SIMPAN SESSION
        // ========================================

        sock.ev.on(
            "creds.update",
            saveCreds
        );

        return sock;

    } catch (error) {

        console.error("");
        console.error(
            "❌ Gagal menjalankan WhatsApp:"
        );

        console.error(
            error
        );

        // Jika gagal membuat koneksi,
        // coba ulang setelah 5 detik
        if (!reconnecting) {

            reconnecting = true;

            console.log(
                "🔄 Mencoba menjalankan ulang..."
            );

            setTimeout(
                () => {

                    startWhatsApp();

                },
                5000
            );

        }

    }

}

// ========================================
// EXPORT
// ========================================

module.exports = {

    startWhatsApp

};