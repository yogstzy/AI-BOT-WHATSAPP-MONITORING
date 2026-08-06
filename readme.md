----- cara run di terminal vscode/cmd(rekomendasi) ------:
npm install -g nodemon
npm init -y
npm install @whiskeysockets/baileys
npm start

----jka pakai API groq maka instal telebih dahulu----:
npm install groq-sdk

-----Struktur Project -----
AI-BOT-WA/
│
├── handler/
│   ├── commands.js
│   └── message.js
│
├── lib/
│   ├── ai.js
│   ├── botStats.js
│   ├── botStatus.js
│   ├── settings.js
│   └── ...
│
├── public/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── data/
│   ├── memory.json      
│
├── session/              ← otomatis
│
├── .env                  
├── .gitignore           
├── index.js              
├── server.js             
├── package.json              
└── package-lock.json             