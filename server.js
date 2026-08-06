// ========================================
// KELIBOT WEB DASHBOARD SERVER
// ========================================


// ========================================
// IMPORT
// ========================================

const express =
    require("express");


const path =
    require("path");


const {
    getStats
} = require("./lib/botStats");

// ========================================
// KONFIGURASI SERVER
// ========================================

const app =
    express();


const PORT =
    process.env.PORT ||
    3000;


// ========================================
// FOLDER DASHBOARD
// ========================================

const publicPath =

    path.join(
        __dirname,
        "public"
    );


// ========================================
// LAYANI FILE DASHBOARD
// ========================================

app.use(

    express.static(
        publicPath
    )

);


// ========================================
// API STATUS BOT
// ========================================

app.get(

    "/api/stats",

    (
        request,
        response
    ) => {

        try {

            const stats =
                getStats();


            response.json({

                success: true,

                data:
                    stats

            });

        } catch (error) {

            console.error(

                "Dashboard API Error:",

                error

            );


            response.status(500).json({

                success: false,

                message:

                    "Gagal mengambil " +

                    "statistik bot."

            });

        }

    }

);


// ========================================
// API CEK SERVER
// ========================================

app.get(

    "/api/health",

    (
        request,
        response
    ) => {

        response.json({

            success: true,

            status:
                "online",

            message:

                "KeliBot Dashboard " +

                "Server aktif."

        });

    }

);


// ========================================
// JALANKAN SERVER
// ========================================

function startDashboard() {

    app.listen(

        PORT,

        () => {

            console.log("");

            console.log(

                "=================================="

            );

            console.log(

                " 🌐 KELIBOT DASHBOARD AKTIF"

            );

            console.log(

                "=================================="

            );

            console.log(

                `Dashboard: ` +

                `http://localhost:${PORT}`

            );

            console.log(

                `API Stats: ` +

                `http://localhost:${PORT}` +

                `/api/stats`

            );

            console.log(

                "=================================="

            );

            console.log("");

        }

    );

}


// ========================================
// EXPORT
// ========================================

module.exports = {

    startDashboard

};