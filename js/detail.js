// ===============================
// DATA TRANSAKSI
// ===============================

let daftarTransaksi = JSON.parse(localStorage.getItem("transaksi")) || [];
let transaksiDipilih = null;
 
// ===============================
// ELEMENT HTML
// ===============================

const jumlahTransaksi = document.getElementById("jumlah-transaksi");
const totalPemasukan = document.getElementById("total-pemasukan");
const totalPengeluaran = document.getElementById("total-pengeluaran");
const transactionCount = document.getElementById("transaction-count");
const transactionList = document.getElementById("transaction-list");
const emptyState = document.getElementById("empty-state");
const searchInput = document.getElementById("search-input");
const filterJenis = document.getElementById("filter-jenis");
const filterKategori = document.getElementById("filter-kategori");

// ===============================
// POPUP DETAIL
// ===============================

const detailPopup = document.getElementById("detail-popup");
const detailClose = document.getElementById("detail-close");
const detailIcon = document.getElementById("detail-icon");
const detailJudul = document.getElementById("detail-judul");
const detailKategori = document.getElementById("detail-kategori");
const detailJenis = document.getElementById("detail-jenis");
const detailTanggal = document.getElementById("detail-tanggal");
const detailNominal = document.getElementById("detail-nominal");
const detailKeterangan = document.getElementById("detail-keterangan");
const btnDelete = document.getElementById("btn-delete");
const btnEdit = document.getElementById("btn-edit");

// ===============================
// POPUP EDIT
// ===============================

const editPopup = document.getElementById("edit-popup");
const editClose = document.getElementById("edit-close");
const editCancel = document.getElementById("edit-cancel");
const editForm = document.getElementById("edit-form");
const editNominal = document.getElementById("edit-nominal");
const editKategori = document.getElementById("edit-kategori");
const editTanggal = document.getElementById("edit-tanggal");
const editKeterangan = document.getElementById("edit-keterangan");
const editJenis = document.querySelectorAll('input[name="edit-jenis"]');

// ===============================
// SUMMARY
// ===============================

function tampilkanSummary() {
    let pemasukan = 0;
    let pengeluaran = 0;

    daftarTransaksi.forEach(
        function (transaksi) {
            if (transaksi.jenis === "Pemasukan") {
                pemasukan += Number(transaksi.nominal);
            }
            if (transaksi.jenis === "Pengeluaran") {
                pengeluaran += Number(transaksi.nominal);
            }
        }
    );

    const jumlah = daftarTransaksi.length;

    jumlahTransaksi.textContent = jumlah;
    transactionCount.textContent = jumlah + " transaksi tercatat";
    totalPemasukan.textContent = "Rp" + formatRupiah(pemasukan);
    totalPengeluaran.textContent = "Rp" + formatRupiah(pengeluaran);
}

// ===============================
// FORMAT TANGGAL
// ===============================

function formatTanggal(tanggal) {
    const date = new Date(tanggal + "T00:00:00");

    return date.toLocaleDateString(
        "id-ID",
        {
            day: "numeric",
            month: "long",
            year: "numeric"
        }
    );
}

// ===============================
// CEK HARI INI
// ===============================

function apakahHariIni(tanggal) {
    const hariIni = new Date();
    const tahun = hariIni.getFullYear();
    const bulan = String(hariIni.getMonth() + 1).padStart(2, "0");
    const hari = String(hariIni.getDate()).padStart(2, "0");
    const tanggalHariIni = `${tahun}-${bulan}-${hari}`;

    return (tanggal === tanggalHariIni);
}

// ===============================
// ICON TRANSAKSI
// ===============================

function buatIcon(kategori, jenis) {

    const icon = document.createElement("div");

    icon.classList.add("transaction-icon");

    let iconClass = "fa-receipt";

    if (kategori === "Makanan") {
        iconClass = "fa-utensils";

        icon.classList.add("food");
    }

    else if (kategori === "Transportasi") {
        iconClass = "fa-car";

        icon.classList.add("transport");
    }

    else if (kategori === "Belanja") {
        iconClass = "fa-bag-shopping";

        icon.classList.add("shopping");
    }

    else if (kategori === "Pendidikan") {
        iconClass = "fa-book";

        icon.classList.add("education");
    }

    else if (kategori === "Hiburan") {
        iconClass = "fa-gamepad";
    }

    else if (kategori === "Tagihan") {
        iconClass = "fa-file-invoice";
    }

    else if (kategori === "Kesehatan") {
        iconClass = "fa-heart-pulse";
    }

    // Icon khusus pemasukan
    if (jenis === "Pemasukan") {
        iconClass = "fa-arrow-down";
        icon.classList.remove(
            "food",
            "transport",
            "shopping",
            "education"
        );
        icon.classList.add("income");
    }

    icon.innerHTML = `<i class="fa-solid ${iconClass}"></i>`;

    return icon;
}


// ===============================
// BUKA DETAIL
// ===============================

function bukaDetail(transaksi) {
    transaksiDipilih = transaksi;

    detailJudul.textContent = transaksi.keterangan || transaksi.kategori;
    detailKategori.textContent = transaksi.kategori;
    detailJenis.textContent = transaksi.jenis;
    detailTanggal.textContent = formatTanggal(transaksi.tanggal);

    const tanda = transaksi.jenis === "Pemasukan" ? "+" : "-";

    detailNominal.textContent = tanda + " Rp" + formatRupiah(transaksi.nominal);
    detailKeterangan.textContent = transaksi.keterangan || "Tidak ada keterangan.";

    const iconBaru = buatIcon(transaksi.kategori, transaksi.jenis);

    detailIcon.className = iconBaru.className;
    detailIcon.innerHTML = iconBaru.innerHTML;
    detailPopup.style.display = "flex";
}

// ===============================
// TUTUP DETAIL
// ===============================

function tutupDetail() {
    detailPopup.style.display = "none";

    transaksiDipilih = null;
}

// Tombol X
detailClose.addEventListener(
    "click",
    function () {
        tutupDetail();
    }
);


// Klik overlay
detailPopup.querySelector(".popup-overlay").addEventListener(
        "click",
        function () {
            tutupDetail();
        }
    );

// ===============================
// HAPUS TRANSAKSI
// ===============================

btnDelete.addEventListener(
    "click",
    function () {
        if (!transaksiDipilih) {
            return;
        }

        const idYangDihapus = transaksiDipilih.id;

        daftarTransaksi =
            daftarTransaksi.filter(
                function (transaksi) {
                    return ( transaksi.id !== idYangDihapus);
                }
            );

        localStorage.setItem("transaksi", JSON.stringify( daftarTransaksi));

        tutupDetail();
        tampilkanSummary();
        filterTransaksi();
    }
);

// ===============================
// BUAT ROW TRANSAKSI
// ===============================

function buatTransactionRow(transaksi) {
    const row =document.createElement("div");

    row.classList.add("transaction-row");
    row.dataset.id = transaksi.id;

    // ===========================
    // MAIN
    // ===========================

    const main = document.createElement("div");

    main.classList.add("transaction-main");

    // ===========================
    // ICON
    // ===========================

    const icon = buatIcon(transaksi.kategori, transaksi.jenis);

    // ===========================
    // DETAIL TRANSAKSI
    // ===========================

    const details = document.createElement("div");

    details.classList.add("transaction-details");

    const judul = document.createElement("h3");

    judul.textContent = transaksi.keterangan || transaksi.kategori;

    const kategori = document.createElement("p");

    kategori.textContent = transaksi.kategori;

    details.appendChild(judul);
    details.appendChild(kategori);
    main.appendChild(icon);
    main.appendChild(details);

    // ===========================
    // TANGGAL
    // ===========================

    const tanggal = document.createElement("div");

    tanggal.classList.add("transaction-date");
    tanggal.textContent = formatTanggal(transaksi.tanggal);

    // ===========================
    // NOMINAL
    // ===========================

    const amount = document.createElement("div");

    amount.classList.add("transaction-amount");

    const amountText = document.createElement("span");
    const amountType = document.createElement("small");
    const tanda = transaksi.jenis === "Pemasukan" ? "+" : "-";

    amountText.textContent = tanda + " Rp" + formatRupiah(transaksi.nominal);
    amountType.textContent = transaksi.jenis;

    if (transaksi.jenis === "Pemasukan") {
        amount.classList.add("income-amount");
    }

    else {
        amount.classList.add("expense-amount");
    }

    amount.appendChild(amountText);
    amount.appendChild(amountType);

    // ===========================
    // MASUKKAN KE ROW
    // ===========================

    row.appendChild(main);
    row.appendChild(tanggal);
    row.appendChild(amount);

    // ===========================
    // KLIK TRANSAKSI
    // ===========================

    row.addEventListener(
        "click",
        function () {
            bukaDetail(transaksi);
        });

    return row;
}

// ===============================
// TAMPILKAN TRANSAKSI
// ===============================

function tampilkanTransaksi(data) {

    // Hapus group tanggal lama
    const groups = transactionList.querySelectorAll(".date-group");

    groups.forEach(
        function (group) {
            group.remove();
        }
    );

    // Kalau tidak ada data
    if (data.length === 0) {
        emptyState.style.display = "flex";
        
        return;
    }

    emptyState.style.display = "none";

    // ===========================
    // URUTKAN
    // ===========================

    const dataUrut = [...data].sort(
            function (a, b) {
                const tanggalA = new Date(a.tanggal);
                const tanggalB = new Date(b.tanggal);

                if (tanggalA.getTime() === tanggalB.getTime()) {
                    return (Number(b.id) - Number(a.id));
                }

                return (tanggalB - tanggalA);
            }
        );

    // ===========================
    // KELOMPOKKAN TANGGAL
    // ===========================

    const kelompokTanggal = {};

    dataUrut.forEach(
        function (transaksi) {
            if (!kelompokTanggal[transaksi.tanggal]) {
                kelompokTanggal[transaksi.tanggal] = [];
            }

            kelompokTanggal[transaksi.tanggal].push(transaksi);
        }
    );

    // ===========================
    // BUAT GROUP TANGGAL
    // ===========================

    Object.keys(kelompokTanggal).forEach(
        function (tanggal) {
            const group = document.createElement("div");

            group.classList.add("date-group");

            // Header tanggal
            const dateHeader = document.createElement("div");

            dateHeader.classList.add("date-header");

            const dateText = document.createElement("span");

            if (apakahHariIni(tanggal)) {
                dateText.textContent = "Hari Ini";
            }

            else {
                dateText.textContent = formatTanggal(tanggal);
            }

            dateHeader.appendChild(dateText);
            group.appendChild(dateHeader);

            // Masukkan transaksi
            kelompokTanggal[tanggal].forEach(
                function (transaksi) {
                    const row = buatTransactionRow(transaksi);

                    group.appendChild(row);
                }
            );

            transactionList.appendChild(group);
        }
    );
}

// ===============================
// SEARCH + FILTER
// ===============================

function filterTransaksi() {
    const keyword = searchInput.value.toLowerCase().trim();
    const jenis = filterJenis.value;
    const kategori = filterKategori.value;
    const hasil = daftarTransaksi.filter(
            function (transaksi) {

                // ===================
                // SEARCH
                // ===================

                const keterangan = transaksi.keterangan ? transaksi.keterangan.toLowerCase() : "";
                const namaKategori = transaksi.kategori ? transaksi.kategori.toLowerCase() : "";
                const cocokSearch = keterangan.includes(keyword) || namaKategori.includes(keyword);

                // ===================
                // FILTER JENIS
                // ===================

                const cocokJenis = jenis === "Semua" || transaksi.jenis === jenis;

                // ===================
                // FILTER KATEGORI
                // ===================

                const cocokKategori = kategori === "Semua" || transaksi.kategori === kategori;

                // ===================
                // HASIL AKHIR
                // ===================

                return (cocokSearch && cocokJenis && cocokKategori);
            }
        );

    tampilkanTransaksi(hasil);
}

// ===============================
// EVENT SEARCH
// ===============================

searchInput.addEventListener("input", filterTransaksi);

// ===============================
// EVENT FILTER JENIS
// ===============================

filterJenis.addEventListener("change", filterTransaksi);

// ===============================
// EVENT FILTER KATEGORI
// ===============================

filterKategori.addEventListener("change", filterTransaksi);

// ===============================
// BUKA EDIT
// ===============================

btnEdit.addEventListener(
    "click",
    function () {

        if (!transaksiDipilih) {
            return;
        }

        // Isi nominal
        editNominal.value = formatRupiah(transaksiDipilih.nominal);

        // Isi kategori
        editKategori.value = transaksiDipilih.kategori;

        // Isi tanggal
        editTanggal.value = transaksiDipilih.tanggal;

        // Isi keterangan
        editKeterangan.value = transaksiDipilih.keterangan || "";

        // Pilih jenis
        editJenis.forEach(
            function (radio) {
                radio.checked = radio.value === transaksiDipilih.jenis;
            }
        );

        // Tutup detail
        detailPopup.style.display = "none";

        // Buka edit
        editPopup.style.display = "flex";
    }
);

// ===============================
// TUTUP EDIT
// ===============================

function tutupEdit() {
    editPopup.style.display = "none";
}

// Tombol X
editClose.addEventListener(
    "click", function () {
        tutupEdit();
    }
);

// Tombol Batal
editCancel.addEventListener(
    "click", function () {
        tutupEdit();
    }
);

// Klik overlay
editPopup
    .querySelector(".popup-overlay")
    .addEventListener(
        "click", function () {
            tutupEdit();
        }
    );

// ===============================
// FORMAT NOMINAL EDIT
// ===============================

editNominal.addEventListener(
    "input", function () {
        let angka = this.value.replace(/\D/g, "");

        if (!angka) {
            this.value = "";
            return;
        }

        this.value = formatRupiah(Number(angka));
    }
);

// ===============================
// SIMPAN EDIT
// ===============================

editForm.addEventListener(
    "submit",
    function (event) {
        event.preventDefault();

        if (!transaksiDipilih) {
            return;
        }

        // ===========================
        // JENIS
        // ===========================

        let jenisDipilih = "";

        editJenis.forEach(
            function (radio) {
                if (radio.checked) {
                    jenisDipilih = radio.value;
                }
            }
        );

        // ===========================
        // NOMINAL
        // ===========================

        const nominal = Number(editNominal.value.replace(/\./g, ""));

        // ===========================
        // DATA LAIN
        // ===========================

        const kategori = editKategori.value;
        const tanggal = editTanggal.value;
        const keterangan = editKeterangan.value.trim();

        // ===========================
        // VALIDASI
        // ===========================

        if ( !jenisDipilih || !nominal || nominal <= 0 || !kategori || !tanggal) {
            alert("Mohon lengkapi data transaksi.");

            return;
        }

        // ===========================
        // CARI TRANSAKSI
        // ===========================

        const index = daftarTransaksi.findIndex(
                function (transaksi) {
                    return (transaksi.id === transaksiDipilih.id);
                }
            );

        if (index === -1) {
            return;
        }

        // ===========================
        // UPDATE
        // ===========================

        daftarTransaksi[index] = {
            ...daftarTransaksi[index],
            jenis: jenisDipilih,
            nominal: nominal,
            kategori: kategori,
            tanggal: tanggal,
            keterangan: keterangan
        };

        // ===========================
        // SIMPAN
        // ===========================

        localStorage.setItem(
            "transaksi",
            JSON.stringify(
                daftarTransaksi
            )
        );

        // Update transaksi yang dipilih
        transaksiDipilih = daftarTransaksi[index];

        // Tutup popup
        tutupEdit();

        // Update tampilan
        tampilkanSummary();
        filterTransaksi();
    }
);

// ===============================
// LOAD AWAL
// ===============================

tampilkanSummary();
filterTransaksi();
