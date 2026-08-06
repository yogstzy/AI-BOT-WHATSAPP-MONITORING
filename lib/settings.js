// ========================================
// KELIBOT USER SETTINGS
// ========================================

const fs = require("fs");

const path = require("path");


// ========================================
// LOKASI FILE SETTINGS
// ========================================

const DATA_FOLDER = path.join(
    __dirname,
    "..",
    "data"
);

const SETTINGS_FILE = path.join(
    DATA_FOLDER,
    "settings.json"
);


// ========================================
// DATA SETTINGS DI RAM
// ========================================

const userSettings = new Map();


// ========================================
// MEMBUAT FOLDER DATA
// ========================================

function ensureDataFolder() {

    if (
        !fs.existsSync(
            DATA_FOLDER
        )
    ) {

        fs.mkdirSync(
            DATA_FOLDER,
            {
                recursive: true
            }
        );

        console.log(
            "📁 Folder data dibuat."
        );

    }

}


// ========================================
// MEMUAT SETTINGS DARI JSON
// ========================================

function loadSettings() {

    try {

        ensureDataFolder();


        // Jika settings.json belum ada,
        // buat otomatis.

        if (
            !fs.existsSync(
                SETTINGS_FILE
            )
        ) {

            fs.writeFileSync(

                SETTINGS_FILE,

                "{}",

                "utf8"

            );

            console.log(

                "📄 settings.json " +
                "berhasil dibuat."

            );

            return;

        }


        // Membaca isi file

        const fileContent =

            fs.readFileSync(

                SETTINGS_FILE,

                "utf8"

            );


        // Jika file kosong

        if (
            !fileContent.trim()
        ) {

            console.log(

                "⚠️ settings.json kosong."

            );

            return;

        }


        // Mengubah JSON menjadi object

        const savedSettings =

            JSON.parse(
                fileContent
            );


        // Memasukkan data ke Map

        for (

            const [
                jid,
                settings
            ]

            of Object.entries(
                savedSettings
            )

        ) {

            if (

                settings &&

                typeof settings ===
                "object"

            ) {

                userSettings.set(

                    jid,

                    {

                        aiMode:

                            settings.aiMode ===
                            true

                    }

                );

            }

        }


        console.log(

            "⚙️ Pengaturan user " +
            "berhasil dimuat."

        );

        console.log(

            `👥 Total pengaturan: ` +

            `${userSettings.size}`

        );

    } catch (error) {

        console.error(

            "❌ Gagal membaca " +
            "settings.json:",

            error.message

        );

    }

}


// ========================================
// MENYIMPAN SETTINGS KE JSON
// ========================================

function saveSettings() {

    try {

        ensureDataFolder();


        // Mengubah Map menjadi object

        const settingsObject =

            Object.fromEntries(

                userSettings

            );


        // Menyimpan dengan format rapi

        fs.writeFileSync(

            SETTINGS_FILE,

            JSON.stringify(

                settingsObject,

                null,

                2

            ),

            "utf8"

        );


        console.log(

            "💾 Pengaturan user " +
            "disimpan."

        );

    } catch (error) {

        console.error(

            "❌ Gagal menyimpan " +
            "settings.json:",

            error.message

        );

    }

}


// ========================================
// MENGAMBIL SETTINGS USER
// ========================================

function getUserSettings(jid) {

    if (
        !userSettings.has(
            jid
        )
    ) {

        userSettings.set(

            jid,

            {

                // Default:
                // AI Mode OFF

                aiMode: false

            }

        );

    }


    return userSettings.get(
        jid
    );

}


// ========================================
// CEK STATUS AI MODE
// ========================================

function isAIEnabled(jid) {

    const settings =

        getUserSettings(
            jid
        );


    return (

        settings.aiMode ===
        true

    );

}


// ========================================
// MENGUBAH STATUS AI MODE
// ========================================

function setAIEnabled(

    jid,

    enabled

) {

    const settings =

        getUserSettings(
            jid
        );


    settings.aiMode =

        enabled === true;


    // Simpan permanen

    saveSettings();


    console.log(

        `🤖 AI Mode ${

            settings.aiMode
                ? "ON"
                : "OFF"

        } → ${jid}`

    );

}


// ========================================
// HAPUS SETTINGS USER
// ========================================

function clearUserSettings(jid) {

    userSettings.delete(
        jid
    );


    saveSettings();


    console.log(

        `🧹 Settings dihapus: ` +
        `${jid}`

    );

}


// ========================================
// LOAD SETTINGS
// ========================================

loadSettings();


// ========================================
// EXPORT
// ========================================

module.exports = {

    getUserSettings,

    isAIEnabled,

    setAIEnabled,

    clearUserSettings

};