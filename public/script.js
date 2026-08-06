// ========================================
// KELIBOT DASHBOARD
// ========================================


// ========================================
// KONFIGURASI
// ========================================

// Waktu update otomatis
// 3000 ms = 3 detik

const REFRESH_INTERVAL = 3000;


// ========================================
// ELEMENT HTML
// ========================================

// Jam dashboard

const currentTime =
    document.getElementById(
        "currentTime"
    );


// Status server

const serverStatus =
    document.getElementById(
        "serverStatus"
    );


// Total pesan

const totalMessages =
    document.getElementById(
        "totalMessages"
    );


// Total request AI

const aiRequests =
    document.getElementById(
        "aiRequests"
    );


// Total command

const localCommands =
    document.getElementById(
        "localCommands"
    );


// Uptime

const uptime =
    document.getElementById(
        "uptime"
    );


// Tombol refresh

const refreshButton =
    document.getElementById(
        "refreshButton"
    );


// Status WhatsApp

const whatsappStatus =
    document.getElementById(
        "whatsappStatus"
    );


// Status AI

const aiStatus =
    document.getElementById(
        "aiStatus"
    );


// Status dashboard

const dashboardStatus =
    document.getElementById(
        "dashboardStatus"
    );


// Nama bot

const botName =
    document.getElementById(
        "botName"
    );


// Versi bot

const botVersion =
    document.getElementById(
        "botVersion"
    );


// Provider AI

const aiProvider =
    document.getElementById(
        "aiProvider"
    );


// Model AI

const aiModel =
    document.getElementById(
        "aiModel"
    );


// Activity list

const activityList =
    document.getElementById(
        "activityList"
    );


// Tombol hapus activity

const clearActivityButton =
    document.getElementById(
        "clearActivityButton"
    );


// ========================================
// STATUS DASHBOARD
// ========================================

let dashboardOnline =
    false;


// Menyimpan activity sementara

let activities = [];


// ========================================
// FORMAT ANGKA
// ========================================

function formatNumber(
    number
) {

    return new Intl.NumberFormat(
        "id-ID"
    ).format(
        Number(number) || 0
    );

}


// ========================================
// FORMAT JAM
// ========================================

function updateClock() {

    if (!currentTime) {

        return;

    }


    const now =
        new Date();


    const time =
        now.toLocaleTimeString(
            "id-ID",
            {
                hour:
                    "2-digit",

                minute:
                    "2-digit",

                second:
                    "2-digit"
            }
        );


    currentTime.textContent =
        time;

}


// ========================================
// FORMAT UPTIME
// ========================================

function formatUptime(
    seconds
) {

    seconds =
        Number(seconds) || 0;


    const days =
        Math.floor(
            seconds / 86400
        );


    const hours =
        Math.floor(
            (
                seconds % 86400
            ) / 3600
        );


    const minutes =
        Math.floor(
            (
                seconds % 3600
            ) / 60
        );


    const remainingSeconds =
        seconds % 60;


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
        `${remainingSeconds} detik`
    );


    return result.join(
        " "
    );

}


// ========================================
// UBAH STATUS SERVER
// ========================================

function setServerStatus(
    online
) {

    dashboardOnline =
        online;


    if (!serverStatus) {

        return;

    }


    serverStatus.classList.remove(
        "online",
        "offline",
        "loading"
    );


    if (online) {

        serverStatus.classList.add(
            "online"
        );


        serverStatus.textContent =
            "Server Online";

    } else {

        serverStatus.classList.add(
            "offline"
        );


        serverStatus.textContent =
            "Server Offline";

    }

}

// ========================================
// UPDATE STATUS BADGE
// ========================================

function updateBadge(
    element,
    status,
    text
) {

    if (!element) {

        return;

    }


    element.classList.remove(
        "online",
        "offline",
        "loading"
    );


    element.classList.add(
        status
    );


    element.textContent =
        text;

}


// ========================================
// TAMBAH ACTIVITY
// ========================================

function addActivity(
    title,
    description,
    icon = "bi-info-circle"
) {

    const now =
        new Date();


    activities.unshift(
        {
            title,
            description,
            icon,
            time:
                now.toLocaleTimeString(
                    "id-ID",
                    {
                        hour:
                            "2-digit",

                        minute:
                            "2-digit",

                        second:
                            "2-digit"
                    }
                )
        }
    );


    // Maksimal 30 activity

    if (
        activities.length > 30
    ) {

        activities.pop();

    }


    renderActivities();

}


// ========================================
// TAMPILKAN ACTIVITY
// ========================================

function renderActivities() {

    if (!activityList) {

        return;

    }


    // Jika belum ada activity

    if (
        activities.length === 0
    ) {

        activityList.innerHTML = `

            <div class="empty-activity">

                <i class="bi bi-clock-history"></i>

                <h4>
                    Belum ada aktivitas
                </h4>

                <p>
                    Aktivitas bot akan muncul di sini.
                </p>

            </div>

        `;


        return;

    }


    activityList.innerHTML =
        activities
            .map(
                activity => `

                <div class="activity-item">

                    <div class="activity-icon">

                        <i class="${activity.icon}"></i>

                    </div>


                    <div class="activity-content">

                        <h4>
                            ${escapeHTML(
                                activity.title
                            )}
                        </h4>


                        <p>
                            ${escapeHTML(
                                activity.description
                            )}
                        </p>

                    </div>


                    <span class="activity-time">

                        ${activity.time}

                    </span>

                </div>

            `
            )
            .join(
                ""
            );

}


// ========================================
// AMANKAN TEXT HTML
// ========================================

function escapeHTML(
    text
) {

    const element =
        document.createElement(
            "div"
        );


    element.textContent =
        String(text);


    return element.innerHTML;

}


// ========================================
// UPDATE DATA DASHBOARD
// ========================================

// ========================================
// UPDATE DATA DASHBOARD
// ========================================

function updateDashboard(
    data
) {

    // ====================================
    // STATISTIK
    // ====================================

    if (
        totalMessages
    ) {

        totalMessages.textContent =
            formatNumber(
                data.totalMessages
            );

    }


    if (
        aiRequests
    ) {

        aiRequests.textContent =
            formatNumber(
                data.aiRequests
            );

    }


    if (
        localCommands
    ) {

        localCommands.textContent =
            formatNumber(
                data.localCommands
            );

    }


    // ====================================
    // UPTIME
    // ====================================

    if (
        uptime
    ) {

        // API mengirim uptime
        // dalam milidetik

        const uptimeSeconds =

            Math.floor(

                (
                    Number(
                        data.uptime
                    ) || 0
                )

                / 1000

            );


        uptime.textContent =

            formatUptime(
                uptimeSeconds
            );

    }


    // ====================================
    // INFO BOT
    // ====================================

    // Data bot belum dikirim
    // oleh API, jadi gunakan
    // nilai sementara

    if (
        botName
    ) {

        botName.textContent =
            "KeliBot";

    }


    if (
        botVersion
    ) {

        botVersion.textContent =
            "2.0.0";

    }


    if (
        aiProvider
    ) {

        aiProvider.textContent =
            "Groq";

    }


    if (
        aiModel
    ) {

        aiModel.textContent =
            "Llama 3.3 70B";

    }


    // ====================================
    // STATUS WHATSAPP
    // ====================================

    // API mengirim:
    //
    // whatsappStatus: true
    //
    // Jadi cek langsung
    // apakah nilainya true

    const whatsappOnline =

        data.whatsappStatus === true;


    updateBadge(

        whatsappStatus,

        whatsappOnline
            ? "online"
            : "offline",

        whatsappOnline
            ? "Online"
            : "Offline"

    );


    // ====================================
    // STATUS AI
    // ====================================

    // Untuk sementara AI dianggap
    // aktif karena bot menggunakan
    // provider Groq

    const aiOnline =
        true;


    updateBadge(

        aiStatus,

        aiOnline
            ? "online"
            : "offline",

        aiOnline
            ? "Online"
            : "Offline"

    );


    // ====================================
    // STATUS DASHBOARD
    // ====================================

    updateBadge(

        dashboardStatus,

        "online",

        "Online"

    );


    // ====================================
    // SERVER BERHASIL MERESPONS
    // ====================================

    setServerStatus(
        true
    );

}


// ========================================
// AMBIL DATA DARI SERVER
// ========================================

async function loadDashboard(
    showActivity = false
) {

    try {

        // Mengambil data API

        const response =
            await fetch(
                "/api/stats",
                {
                    cache:
                        "no-store"
                }
            );


        // Jika server memberi error

        if (
            !response.ok
        ) {

            throw new Error(
                `HTTP ${response.status}`
            );

        }


        // Ubah ke JSON

        const data =
            await response.json();


        // Update tampilan

        updateDashboard(
            data.data
        );


        // Activity saat refresh manual

        if (
            showActivity
        ) {

            addActivity(
                "Dashboard diperbarui",
                "Data terbaru berhasil diambil dari server.",
                "bi-arrow-clockwise"
            );

        }


    } catch (error) {

        console.error(
            "Dashboard Error:",
            error
        );


        // Ubah status server

        setServerStatus(
            false
        );


        // Status WhatsApp

        updateBadge(
            whatsappStatus,
            "offline",
            "Tidak terhubung"
        );


        // Status AI

        updateBadge(
            aiStatus,
            "offline",
            "Tidak diketahui"
        );


        // Dashboard

        updateBadge(
            dashboardStatus,
            "offline",
            "Offline"
        );


        // Activity hanya jika
        // sebelumnya online

        if (
            dashboardOnline
        ) {

            addActivity(
                "Server tidak dapat dihubungi",
                "Dashboard gagal mengambil data dari server.",
                "bi-exclamation-triangle"
            );

        }

    }

}


// ========================================
// TOMBOL REFRESH
// ========================================

if (
    refreshButton
) {

    refreshButton.addEventListener(
        "click",
        async () => {

            const icon =
                refreshButton.querySelector(
                    "i"
                );


            // Putar icon

            if (icon) {

                icon.classList.add(
                    "spin"
                );

            }


            // Nonaktifkan sementara

            refreshButton.disabled =
                true;


            await loadDashboard(
                true
            );


            // Aktif kembali

            setTimeout(
                () => {

                    refreshButton.disabled =
                        false;


                    if (icon) {

                        icon.classList.remove(
                            "spin"
                        );

                    }

                },
                500
            );

        }
    );

}


// ========================================
// HAPUS ACTIVITY
// ========================================

if (
    clearActivityButton
) {

    clearActivityButton.addEventListener(
        "click",
        () => {

            activities = [];


            renderActivities();

        }
    );

}


// ========================================
// JALANKAN DASHBOARD
// ========================================

// Menampilkan jam

updateClock();


// Update jam setiap 1 detik

setInterval(
    updateClock,
    1000
);


// Tampilkan activity awal

addActivity(
    "Dashboard dimulai",
    "Sistem dashboard KeliBot berhasil dimuat.",
    "bi-speedometer2"
);


// Ambil data pertama

loadDashboard();


// Update otomatis

setInterval(
    () => {

        loadDashboard();

    },
    REFRESH_INTERVAL
);


// ========================================
// LOG
// ========================================

console.log(
    "KeliBot Dashboard aktif."
);