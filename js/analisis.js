// =====================================================
// DATA TRANSAKSI
// =====================================================

const daftarTransaksi = JSON.parse(localStorage.getItem("transaksi")) || [];

// =====================================================
// HITUNG DATA KEUANGAN
// =====================================================

let totalPemasukan = 0;
let totalPengeluaran = 0;

daftarTransaksi.forEach((transaksi) => {
    if (transaksi.jenis === "Pemasukan") {
        totalPemasukan += transaksi.nominal;
    }
    if (transaksi.jenis === "Pengeluaran") {
        totalPengeluaran += transaksi.nominal;
    }
});

const saldo = totalPemasukan - totalPengeluaran;
const jumlahTransaksi = daftarTransaksi.length;

// =====================================================
// TAMPILKAN RINGKASAN
// =====================================================

document.getElementById("saldo").textContent = "Rp" + formatRupiah(saldo);
document.getElementById("total-pemasukan").textContent = "Rp" + formatRupiah(totalPemasukan);
document.getElementById("total-pengeluaran").textContent = "Rp" + formatRupiah(totalPengeluaran);
document.getElementById("jumlah-transaksi").textContent = jumlahTransaksi;

// =====================================================
// CHAT ELEMENT
// =====================================================

const chatContainer = document.getElementById("chat-container");
const chatForm = document.getElementById("chat-form");
const chatInput = document.getElementById("chat-input");
const chatSend = document.getElementById("chat-send");
const tombolMulaiAnalisis = document.getElementById("btn-mulai-analisis");

// =====================================================
// RIWAYAT PERCAKAPAN
// =====================================================

let riwayatChat = [];

// =====================================================
// PROMPT PERTAMA
// =====================================================

const promptAwal = "Analisis data keuangan saya 30 hari terakhir";

// =====================================================
// MEMULAI ANALISIS
// =====================================================

tombolMulaiAnalisis.addEventListener("click", async () => {
    // Tampilkan pesan user
    tambahPesanUser(promptAwal);

    // Simpan pesan user ke riwayat
    riwayatChat.push({role: "user", content: promptAwal});

    // Sembunyikan tombol analisis
    tombolMulaiAnalisis.style.display = "none";

    // Matikan chat sementara
    chatInput.disabled = true;
    chatSend.disabled = true;
    chatInput.placeholder = "AI sedang menganalisis...";

    try {
        const response = await fetch("https://hijautabung-api.onrender.com/analisis",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    // Pertanyaan terbaru
                    prompt: promptAwal,
                    // Data transaksi
                    transaksi: daftarTransaksi,
                    // Riwayat percakapan
                    riwayatChat: riwayatChat
                })
            }
        );

        if (!response.ok) {
            throw new Error("Gagal menghubungi backend");
        }

        const data = await response.json();

        // Tampilkan jawaban AI
        tambahPesanAI(data.hasil);

        // Simpan jawaban AI ke riwayat
        riwayatChat.push({role: "assistant", content: data.hasil});

        // Aktifkan chat
        chatInput.disabled = false;
        chatSend.disabled = false;
        chatInput.placeholder = "Tanyakan sesuatu tentang keuanganmu...";
        chatInput.focus();

    } catch (error) {
        console.error(error);

        tambahPesanAI("Maaf, terjadi masalah saat menghubungkan ke AI.");

        chatInput.disabled = false;
        chatSend.disabled = false;
        chatInput.placeholder = "Tanyakan sesuatu tentang keuanganmu...";
    }
});

// =====================================================
// CHAT LANJUTAN
// =====================================================

chatForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    // Ambil pertanyaan
    const pertanyaan = chatInput.value.trim();

    // Jangan kirim kalau kosong
    if (!pertanyaan) {
        return;
    }

    // =================================================
    // TAMPILKAN PESAN USER
    // =================================================

    tambahPesanUser(pertanyaan);

    // =================================================
    // SIMPAN PESAN USER KE RIWAYAT
    // =================================================

    riwayatChat.push({role: "user", content: pertanyaan});

    // Kosongkan input
    chatInput.value = "";

    // Matikan input sementara
    chatInput.disabled = true;
    chatSend.disabled = true;
    chatInput.placeholder = "AI sedang menjawab...";

    try {
        const response = await fetch( "http://localhost:3000/analisis",
            {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    // Pertanyaan terbaru
                    prompt: pertanyaan,
                    // Data transaksi
                    transaksi: daftarTransaksi,
                    // Semua percakapan sebelumnya
                    riwayatChat: riwayatChat
                })
            }
        );

        if (!response.ok) {
            throw new Error(
                "Gagal menghubungi backend"
            );
        }

        const data = await response.json();

        // =================================================
        // TAMPILKAN JAWABAN AI
        // =================================================

        tambahPesanAI(data.hasil);

        // =================================================
        // SIMPAN JAWABAN AI KE RIWAYAT
        // =================================================

        riwayatChat.push({role: "assistant", content: data.hasil});

    } catch (error) {
        console.error(error);

        tambahPesanAI("Maaf, terjadi masalah saat menghubungkan ke AI.");

    } finally {
        // Aktifkan kembali chat
        chatInput.disabled = false;
        chatSend.disabled = false;
        chatInput.placeholder = "Tanyakan sesuatu tentang keuanganmu...";
        chatInput.focus();
    }
});

// =====================================================
// TAMBAH PESAN USER
// =====================================================

function tambahPesanUser(pesan) {
    const message = document.createElement("div");

    message.className = "user-message";
    message.innerHTML = `
        <div class="user-message-content">
            <span class="message-name">Kamu</span>
            <p>${pesan}</p>
        </div>
    `;
    chatContainer.appendChild(message);

    // Scroll ke pesan terbaru
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// =====================================================
// TAMBAH PESAN AI
// =====================================================

function tambahPesanAI(pesan) {
    const message = document.createElement("div");

    message.className = "ai-message";
    message.innerHTML = `
        <div class="message-avatar">
            <i class="fa-solid fa-leaf"></i>
        </div>
        <div class="message-content">
            <span class="message-name">HijauTabung AI</span>
            <p>${pesan.replace(/\n/g, "<br>")}</p>
        </div>
    `;

    chatContainer.appendChild(message);

    // Scroll ke pesan terbaru
    chatContainer.scrollTop = chatContainer.scrollHeight;
}
