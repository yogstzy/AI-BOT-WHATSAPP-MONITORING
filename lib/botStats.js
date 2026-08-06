// ========================================
// KELIBOT CENTRAL STATISTICS
// ========================================


// ========================================
// WAKTU BOT DIMULAI
// ========================================

const startTime = Date.now();


// ========================================
// DATA STATISTIK
// ========================================

const statistics = {

    // Total semua pesan masuk
    totalMessages: 0,

    // Total request ke AI
    aiRequests: 0,

    // Total command lokal
    localCommands: 0,

    // Status koneksi WhatsApp
    whatsappStatus: "Starting",

    // Waktu terakhir ada aktivitas
    lastActivity: null

};


// ========================================
// TAMBAH TOTAL PESAN
// ========================================

function addMessageCount() {

    statistics.totalMessages++;

    statistics.lastActivity =
        new Date().toISOString();

}


// ========================================
// TAMBAH REQUEST AI
// ========================================

function addAIRequest() {

    statistics.aiRequests++;

    statistics.lastActivity =
        new Date().toISOString();

}


// ========================================
// TAMBAH COMMAND LOKAL
// ========================================

function addLocalCommand() {

    statistics.localCommands++;

    statistics.lastActivity =
        new Date().toISOString();

}


// ========================================
// UBAH STATUS WHATSAPP
// ========================================

function setWhatsAppStatus(
    status
) {

    statistics.whatsappStatus =
        status;

    statistics.lastActivity =
        new Date().toISOString();

}


// ========================================
// AMBIL SEMUA STATISTIK
// ========================================

function getStats() {

    return {

        totalMessages:
            statistics.totalMessages,

        aiRequests:
            statistics.aiRequests,

        localCommands:
            statistics.localCommands,

        whatsappStatus:
            statistics.whatsappStatus,

        lastActivity:
            statistics.lastActivity,

        startTime:
            startTime,

        uptime:
            Date.now() -
            startTime

    };

}


// ========================================
// FORMAT UPTIME
// ========================================

function formatUptime(
    milliseconds
) {

    const totalSeconds =

        Math.floor(
            milliseconds / 1000
        );


    const days =

        Math.floor(
            totalSeconds / 86400
        );


    const hours =

        Math.floor(
            (
                totalSeconds %
                86400
            ) / 3600
        );


    const minutes =

        Math.floor(
            (
                totalSeconds %
                3600
            ) / 60
        );


    const seconds =

        totalSeconds %
        60;


    const result = [];


    if (days > 0) {

        result.push(
            `${days} hari`
        );

    }


    if (hours > 0) {

        result.push(
            `${hours} jam`
        );

    }


    if (minutes > 0) {

        result.push(
            `${minutes} menit`
        );

    }


    result.push(
        `${seconds} detik`
    );


    return result.join(
        " "
    );

}


// ========================================
// EXPORT
// ========================================

module.exports = {

    addMessageCount,

    addAIRequest,

    addLocalCommand,

    setWhatsAppStatus,

    getStats,

    formatUptime

};