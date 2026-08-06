// ========================================
// KELIBOT STATUS MANAGER
// ========================================


// Status WhatsApp

let whatsappConnected =
    false;


// ========================================
// UBAH STATUS WHATSAPP
// ========================================

function setWhatsAppStatus(
    status
) {

    whatsappConnected =
        Boolean(status);


    console.log(
        whatsappConnected
            ? "🟢 Status WhatsApp: Online"
            : "🔴 Status WhatsApp: Offline"
    );

}


// ========================================
// AMBIL STATUS WHATSAPP
// ========================================

function getWhatsAppStatus() {

    return whatsappConnected;

}


// ========================================
// EXPORT
// ========================================

module.exports = {

    setWhatsAppStatus,

    getWhatsAppStatus

};