// ================= FORM =================

const formTransaksi = document.getElementById("form-transaksi");

// ================= INPUT NOMINAL =================

const inputNominal = document.getElementById("nominal");

inputNominal.addEventListener("input", function () {
    // Hanya mengambil angka
    const angka = this.value.replace(/\D/g, "");
    // Kalau kosong, biarkan kosong
    if (angka === "") {
        this.value = "";
        return;
    }
    // Format angka menjadi format Indonesia
    this.value = formatRupiah(Number(angka));
});

// ================= TANGGAL HARI INI =================

const inputTanggal = document.getElementById("tanggal");
const hariIni = new Date();
const tahun = hariIni.getFullYear();
const bulan = String(hariIni.getMonth() + 1).padStart(2, "0");
const tanggalHariIni = String(hariIni.getDate()).padStart(2, "0");

inputTanggal.value = `${tahun}-${bulan}-${tanggalHariIni}`;

// ================= POPUP =================

const popup = document.getElementById("popup");
const popupTitle = document.getElementById("popup-title");
const popupMessage = document.getElementById("popup-message");
const popupIcon = document.getElementById("popup-icon");
const popupClose = document.getElementById("popup-close");

function popUp(tipePopup) {
    if (tipePopup === "data-kosong") {
        popupTitle.textContent = "Data Belum Lengkap";
        popupMessage.textContent = "Silakan lengkapi semua data sebelum menyimpan transaksi.";

        popupIcon.innerHTML ='<i class="fa-solid fa-circle-exclamation"></i>';
    }

    else if (tipePopup === "nominal-salah") {
        popupTitle.textContent = "Nominal Tidak Valid";
        popupMessage.textContent = "Nominal harus berupa angka dan lebih dari 0.";

        popupIcon.innerHTML ='<i class="fa-solid fa-triangle-exclamation"></i>';
    }

    else if (tipePopup === "kategori-salah") {
        popupTitle.textContent = "Kategori Belum Dipilih";
        popupMessage.textContent = "Silakan pilih kategori transaksi terlebih dahulu.";

        popupIcon.innerHTML = '<i class="fa-solid fa-list"></i>';
    }

    else if (tipePopup === "berhasil") {
        popupTitle.textContent = "Transaksi Berhasil";
        popupMessage.textContent = "Transaksi berhasil disimpan.";

        popupIcon.innerHTML = '<i class="fa-solid fa-check"></i>';
    }

    // Tampilkan popup
    popup.style.display = "flex";
}

// ================= TUTUP POPUP =================

popupClose.addEventListener("click", function () {
    popup.style.display = "none";
});

// ================= SUBMIT FORM =================

formTransaksi.addEventListener("submit", function (event) {
    // Mencegah form melakukan refresh
    event.preventDefault();

    // ================= AMBIL DATA =================

    const jenisElement = document.querySelector('input[name="jenis"]:checked');
    const nominal = Number(inputNominal.value.replace(/\./g, ""));
    const kategori = document.getElementById("kategori").value;
    const tanggal = document.getElementById("tanggal").value;
    const keterangan = document.getElementById("keterangan").value;

    // ================= VALIDASI JENIS =================

    if (!jenisElement) {
        popUp("data-kosong");
        return;
    }

    const jenis = jenisElement.value;

    // ================= VALIDASI NOMINAL =================

    if (
        inputNominal.value === "" ||
        !Number.isFinite(nominal) ||
        nominal <= 0
    ) {
        popUp("nominal-salah");
        return;
    }

    // ================= VALIDASI KATEGORI =================

    if (kategori === "") {
        popUp("kategori-salah");
        return;
    }

    // ================= VALIDASI TANGGAL =================

    if (tanggal === "") {
        popUp("data-kosong");
        return;
    }

    // ================= BUAT OBJECT TRANSAKSI =================

    const transaksi = {
        id: Date.now(),
        jenis: jenis,
        nominal: nominal,
        kategori: kategori,
        tanggal: tanggal,
        keterangan: keterangan
    };

    // ================= AMBIL DATA LAMA =================

    const daftarTransaksi = JSON.parse(localStorage.getItem("transaksi")) || [];

    // ================= MASUKKAN TRANSAKSI BARU =================

    daftarTransaksi.push(transaksi);

    // ================= SIMPAN KE LOCAL STORAGE =================

    localStorage.setItem(
        "transaksi",
        JSON.stringify(daftarTransaksi)
    );

    // ================= BERHASIL =================

    popUp("berhasil");

    // Reset form
    formTransaksi.reset();

    // Kembalikan tanggal ke hari ini
    inputTanggal.value = `${tahun}-${bulan}-${tanggalHariIni}`;
});
