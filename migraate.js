import { db } from './firebase-config.js';
import { collection, doc, setDoc, addDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

async function importJsonToFirestore() {
    try {
        console.log("Membaca file data JSON...");
        
        // Jika file JSON ditaruh dalam satu folder atau di-fetch:
        let response = await fetch('./data-sigap.json'); // Ganti dengan nama file JSON Anda jika berbeda
        let jsonData = await response.json();

        // 1. Migrasi Koleksi Karyawan
        if (jsonData.karyawan && Array.isArray(jsonData.karyawan)) {
            console.log("Memigrasikan data Karyawan...");
            for (let emp of jsonData.karyawan) {
                // Menggunakan ID Pembelian atau Personal Number sebagai ID dokumen agar unik
                let docId = String(emp["ID Pembelian"] || emp["Personal Number"]);
                await setDoc(doc(db, "karyawan", docId), emp);
            }
            console.log("✔ Data Karyawan berhasil diimpor!");
        }

        // 2. Migrasi Koleksi Log Gula Keluar
        if (jsonData.logGulaKeluar && Array.isArray(jsonData.logGulaKeluar)) {
            console.log("Memigrasikan data Log Gula Keluar...");
            for (let logItem of jsonData.logGulaKeluar) {
                let trxId = String(logItem["ID Transaksi"] || "TRX-" + Date.now());
                await setDoc(doc(db, "logGulaKeluar", trxId), logItem);
            }
            console.log("✔ Data Log Gula Keluar berhasil diimpor!");
        }

        // 3. Migrasi Koleksi Users
        if (jsonData.users && Array.isArray(jsonData.users)) {
            console.log("Memigrasikan data Users...");
            for (let usr of jsonData.users) {
                await setDoc(doc(db, "users", usr.Username), usr);
            }
            console.log("✔ Data Users berhasil diimpor!");
        }

        // 4. Migrasi Config (Dokumen tunggal)
        if (jsonData.config) {
            console.log("Memigrasikan data Config...");
            await setDoc(doc(db, "config", "settings"), jsonData.config);
            console.log("✔ Data Config berhasil diimpor!");
        }

        alert("SUKSES! Seluruh data dari Spreadsheet (JSON) berhasil dimigrasikan ke Firebase Firestore!");
    } catch (error) {
        console.error("Gagal melakukan import data:", error);
        alert("Terjadi kesalahan saat migrasi: " + error.message);
    }
}

// Jalankan fungsi otomatis saat tombol diklik atau dipanggil dari console
window.importJsonToFirestore = importJsonToFirestore;
