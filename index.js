require("dotenv").config();

const { startWhatsApp } = require("./lib/whatsapp");

const {
    startDashboard
} = require("./server");

async function main() {

    console.clear();

    console.log("====================================");
    console.log("      KELIBOT AI STARTING");
    console.log("====================================");

    try {

        startDashboard();

        await startWhatsApp();

    } catch (err) {

        console.error(err);

    }

}

main();