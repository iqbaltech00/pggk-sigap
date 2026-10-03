// ==========================================
// 1. INISIALISASI SUPABASE CLIENT
// ==========================================
const SUPABASE_URL = 'https://ceaouyuwxrtjgtmdjkbh.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_VLyUJwsDuOi3DLpOtBXKYA_X6kJZmUX';
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let db = {};
let currentUser = null;
let chartInstance = null;
let currentSortColumn = 'NO';
let currentSortAsc = true;
let rekapSortColumn = 'Timestamp';
let rekapSortAsc = false;

window.addEventListener('DOMContentLoaded', () => {
    initApp();
});

// ==========================================
// 2. FETCH DATA MENGGUNAKAN SUPABASE QUERY
// ==========================================
async function initApp() {
    let now = new Date();
    let year = now.getFullYear();
    let month = String(now.getMonth() + 1).padStart(2, '0');
    let ym = `${year}-${month}`;

    let monthInputRekap = document.getElementById('filter-bulan');
    if (monthInputRekap) monthInputRekap.value = ym;

    let monthInputDash = document.getElementById('dashboard-bulan');
    if (monthInputDash) monthInputDash.value = ym;

    let resetDateSelect = document.getElementById('config-reset-date');
    if (resetDateSelect) {
        resetDateSelect.innerHTML = '';
        for (let i = 1; i <= 31; i++) {
            let opt = document.createElement('option');
            opt.value = i;
            opt.text = `Tanggal ${i}`;
            resetDateSelect.appendChild(opt);
        }
    }

    startLoading();

    try {
        // Query data dari tabel Supabase secara async
        const [resKaryawan, resLog, resUsers, resConfig] = await Promise.all([
            supabase.from('karyawan').select('*'),
            supabase.from('log_gula_keluar').select('*'),
            supabase.from('users').select('*'),
            supabase.from('config').select('*').single()
        ]);

        if (resKaryawan.error) throw resKaryawan.error;
        if (resLog.error) throw resLog.error;

        // Menyimpan hasil query ke objek db global
        db = {
            karyawan: resKaryawan.data || [],
            log: resLog.data || [],
            users: resUsers.data || [],
            config: resConfig.data || { HargaGulaCurah: 15000, HargaGulaRetail: 16000 }
        };

        endLoading();
        renderUI();
    } catch (error) {
        console.error("Gagal mengambil data dari Supabase:", error);
        endLoading();
        Swal.fire('Error Database', 'Gagal memuat data dari Supabase: ' + error.message, 'error');
    }
}