// ===============================
// AMBIL DATA TRANSAKSI
// ===============================

const daftarTransaksi = JSON.parse(localStorage.getItem("transaksi")) || [];

// ===============================
// HITUNG RINGKASAN
// ===============================

let totalPemasukan = 0;
let totalPengeluaran = 0;

daftarTransaksi.forEach((transaksi) => {
    if (transaksi.jenis === "Pemasukan") {
        totalPemasukan += Number(transaksi.nominal);
    }
    if (transaksi.jenis === "Pengeluaran") {
        totalPengeluaran += Number(transaksi.nominal);
    }
});

const saldo = totalPemasukan - totalPengeluaran;
const jumlahTransaksi = daftarTransaksi.length;

// ===============================
// TAMPILKAN RINGKASAN
// ===============================

document.getElementById("saldo").textContent = "Rp" + formatRupiah(saldo);
document.getElementById("total-pemasukan").textContent = "Rp" + formatRupiah(totalPemasukan);
document.getElementById("total-pengeluaran").textContent = "Rp" + formatRupiah(totalPengeluaran);
document.getElementById("jumlah-transaksi").textContent = jumlahTransaksi;

// ===============================
// TRANSAKSI TERBARU
// ===============================

const activityList = document.getElementById("activity-list");

// Urutkan transaksi dari yang terbaru
const transaksiTerbaru = [...daftarTransaksi]
    .sort((a, b) => b.id - a.id)
    .slice(0, 10);

// ===============================
// JIKA BELUM ADA TRANSAKSI
// ===============================

if (transaksiTerbaru.length === 0) {
    activityList.innerHTML = `
        <div class="empty-state">
            <div class="empty-icon">
                <i class="fa-solid fa-receipt"></i>
            </div>
            <h3>Belum ada transaksi</h3>
            <p>
                Mulai catat pemasukan atau pengeluaranmu
                untuk melihat aktivitas di sini.
            </p>
            <a href="input.html">
                Catat transaksi
            </a>
        </div>
    `;
}

// ===============================
// TAMPILKAN 10 TRANSAKSI TERBARU
// ===============================

else {
    activityList.innerHTML = transaksiTerbaru.map((transaksi) => {
            const pemasukan = transaksi.jenis === "Pemasukan";
            const tanggal = new Date(transaksi.tanggal);
            const tanggalText = tanggal.toLocaleDateString("id-ID",
                    {
                        day: "numeric",
                        month: "short",
                        year: "numeric"
                    }
                );
            return `
                <div class="transaction-item">
                    <div class="transaction-icon ${
                        pemasukan ? "income" : "expense"}">
                        <i class="fa-solid ${
                            pemasukan ? "fa-arrow-down" : "fa-arrow-up"}"></i>
                    </div>
                    <div class="transaction-info">
                        <strong>
                            ${transaksi.keterangan || transaksi.kategori}
                        </strong>
                        <span>
                            ${transaksi.kategori}
                        </span>
                    </div>
                    <div class="transaction-date">
                        ${tanggalText}
                    </div>
                    <div class="transaction-amount ${
                        pemasukan ? "income-amount" : "expense-amount"}">
                        ${pemasukan ? "+" : "-"}Rp${formatRupiah(transaksi.nominal)}
                    </div>
                </div>
            `;
        }).join("");
}
