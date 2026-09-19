const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;


// =========================
// MIDDLEWARE
// =========================

app.use(cors());
app.use(express.json());


// =========================
// TEST BACKEND
// =========================

app.get("/", (req, res) => {
    res.send("Backend HijauTabung aktif!");
});


// =========================
// ANALISIS AI
// =========================

app.post("/analisis", async (req, res) => {
    try {

        // =========================
        // MENERIMA DATA DARI FRONTEND
        // =========================

        const {
            prompt,
            transaksi,
            riwayatChat
        } = req.body;


        // =========================
        // CEK DATA
        // =========================

        if (!prompt || !Array.isArray(transaksi)) {
            return res.status(400).json({
                error: "Data tidak lengkap."
            });
        }


        // =========================
        // MEMBUAT KONTEKS PERCAKAPAN
        // =========================

        const konteksPercakapan = Array.isArray(riwayatChat)
            ? riwayatChat
                .map((chat) => {
                    return `${chat.role}: ${chat.content}`;
                })
                .join("\n")
            : "";


        // =========================
        // LOG DATA
        // =========================

        console.log("================================");
        console.log("Request analisis diterima");
        console.log("Prompt:", prompt);
        console.log("Jumlah transaksi:", transaksi.length);
        console.log("Jumlah chat:", riwayatChat?.length || 0);
        console.log("================================");


        // =========================
        // MEMBUAT PROMPT UNTUK AI
        // =========================

        const promptAI = `
Kamu adalah asisten keuangan bernama HijauTabung AI.

DATA TRANSAKSI PENGGUNA:
${JSON.stringify(transaksi, null, 2)}

RIWAYAT PERCAKAPAN:
${konteksPercakapan}

PESAN TERBARU PENGGUNA:
${prompt}

Tugas kamu adalah menjawab pesan terbaru pengguna dengan mempertimbangkan data transaksi dan riwayat percakapan.

ATURAN:
- Gunakan bahasa Indonesia.
- Gunakan kalimat yang natural dan mudah dipahami.
- Gunakan data transaksi sebagai dasar jawaban.
- Gunakan riwayat percakapan untuk memahami konteks pertanyaan.
- Jangan mengarang angka atau transaksi.
- Jangan menggunakan Markdown.
- Jangan menggunakan simbol #.
- Jangan menggunakan simbol *.
- Jangan menggunakan tanda strip untuk membuat daftar.
- Jangan menggunakan tabel.
- Jangan menggunakan emoji.
- Jangan menggunakan tanda "---".
- Pisahkan paragraf menggunakan satu baris kosong.
- Jika data transaksi masih sedikit, jelaskan bahwa analisis masih terbatas pada data yang tersedia.
- Jawab pertanyaan terbaru secara langsung.
- Jawaban maksimal 180 kata.

Tulis jawaban langsung kepada pengguna.
`;


        // =========================
        // KIRIM KE GEMINI
        // =========================

        const response = await fetch(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=" +
            process.env.GEMINI_API_KEY,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                {
                                    text: promptAI
                                }
                            ]
                        }
                    ]
                })
            }
        );


        // =========================
        // AMBIL RESPONSE GEMINI
        // =========================

        const data = await response.json();


        // =========================
        // CEK ERROR GEMINI
        // =========================

        if (!response.ok) {
            console.error("Gemini Error:");
            console.error(data);

            return res.status(500).json({
                error: "Gagal mendapatkan jawaban AI."
            });
        }


        // =========================
        // AMBIL JAWABAN AI
        // =========================

        let hasilAI =
            data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!hasilAI) {
            hasilAI = "AI tidak memberikan jawaban.";
        }


        console.log("Jawaban AI berhasil diterima.");


        // =========================
        // MEMBERSIHKAN FORMAT
        // =========================

        hasilAI = hasilAI
            .replace(/```[\s\S]*?```/g, "")
            .replace(/^#+\s*/gm, "")
            .replace(/^\s*[-*]\s+/gm, "")
            .replace(/---+/g, "")
            .trim();


        // =========================
        // KIRIM JAWABAN KE FRONTEND
        // =========================

        res.json({
            hasil: hasilAI
        });

    } catch (error) {
        console.error("Server Error:");
        console.error(error);

        res.status(500).json({
            error: "Terjadi kesalahan pada server."
        });
    }
});


// =========================
// MENJALANKAN SERVER
// =========================

app.listen(PORT, "0.0.0.0", () => {
    console.log("================================");
    console.log("HijauTabung Backend aktif");
    console.log(`Server berjalan di port ${PORT}`);
    console.log("================================");
});