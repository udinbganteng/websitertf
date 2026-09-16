/* --- SISTEM NAVIGASI HAMBURGER MOBILE (DENGAN ANIMASI TRANSISI) --- */
function toggleMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.getElementById('navLinks');

    // Switch class untuk memicu animasi silang pada CSS line hamburger
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
}

/* --- ENGINE UTAMA SPA (SINGLE PAGE APPLICATION) --- */
function changeTab(targetId, sectionName) {
    // 1. Ganti Visibilitas Section Konten (Sistem Kelas Active)
    const sections = document.querySelectorAll('.page-section');
    sections.forEach(section => {
        section.classList.remove('active');
        if (section.id === targetId) {
            section.classList.add('active');
        }
    });

    // 2. Pembaruan Status Menu Navigasi Aktif
    const tabs = document.querySelectorAll('.nav-links li');
    tabs.forEach(tab => {
        tab.classList.remove('active-tab');
        const onClickAttr = tab.querySelector('a').getAttribute('onclick');
        if (onClickAttr && onClickAttr.includes(`'${targetId}'`)) {
            tab.classList.add('active-tab');
        }
    });

    // 3. Modifikasi Judul dan Sub-Pill Atas Secara Dinamis
    document.getElementById('headerTitle').innerText = sectionName;
    document.getElementById('headerPill').innerText = `Internal — ${sectionName}`;

    // 4. Tutup Menu Navigasi Secara Otomatis di Layar Ponsel & Kembalikan Animasi Hambuger ke Semula
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.getElementById('navLinks');
    if (hamburger.classList.contains('open')) {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
    }

    // 5. Geser Halus Halaman Kembali ke Atas
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* --- SISTEM DETAIL MODAL PREVIEW IMAGE --- */
function openModal(imageSrc) {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalTargetImg');

    modalImg.src = imageSrc;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden'; // Kunci scroll agar fokus pada pratinjau gambar
}

function closeModal() {
    const modal = document.getElementById('imageModal');
    modal.classList.remove('open');
    document.body.style.overflow = ''; // Aktifkan kembali fungsi scroll halaman
}

// Mencegah modal tertutup jika area gambar utama di dalam modal yang diklik
document.getElementById('modalTargetImg').addEventListener('click', function (e) {
    e.stopPropagation();
});


/* --- ENGINE GENERATOR GALERI AKTIVITAS DINAMIS --- */
function tambahKegiatan(title, imageList) {
    const container = document.getElementById('activitiesContainer');
    if (!container) return;

    // Buat Struktur Container Block Aktivitas
    const activityBlock = document.createElement('div');
    activityBlock.className = 'activity-block';

    // Cetak Judul Kegiatan
    const blockTitle = document.createElement('h3');
    blockTitle.innerText = title;
    activityBlock.appendChild(blockTitle);

    // Buat Kisi Grid Galeri Foto
    const galleryGrid = document.createElement('div');
    galleryGrid.className = 'gallery-grid';

    // Parsing Array Daftar Gambar Warga
    imageList.forEach(srcUrl => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        galleryItem.onclick = function () { openModal(srcUrl); };

        // Integrasi Tag Image Spesifikasi Lazy Loading
        const img = document.createElement('img');
        img.setAttribute('data-src', srcUrl); // Menyimpan alamat gambar asli pada memori cadangan data-src
        img.alt = `Dokumentasi Acara: ${title}`;

        galleryItem.appendChild(img);
        galleryGrid.appendChild(galleryItem);
    });

    activityBlock.appendChild(galleryGrid);
    container.appendChild(activityBlock);
}

/* --- UTALITAS LAZY LOADING ANTI-LAG (INTERSECTION OBSERVER) --- */
function initLazyLoading() {
    const imageTargets = document.querySelectorAll('.gallery-item img');

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                // Pindahkan tautan gambar dari data-src ke src utama saat mulai terdeteksi di layar
                img.src = img.getAttribute('data-src');
                img.onload = () => img.classList.add('loaded');
                observer.unobserve(img); // Lepas pengawasan jika gambar sukses terunduh
            }
        });
    }, {
        root: null,
        threshold: 0.05,
        rootMargin: "0px 0px 150px 0px" // Gambar diunduh otomatis 150px sebelum tergulung masuk ke layar utama
    });

    imageTargets.forEach(image => imageObserver.observe(image));
}


/* --- PROSES PENGISIAN DATA SEEDING (SAAT HALAMAN SIAP) --- */
document.addEventListener("DOMContentLoaded", function () {

    // Pengisian data galeri kegiatan awal
    tambahKegiatan("Aksi Penghijauan & Penanaman 100 Bibit Pohon Bersama", [
        "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?q=80&w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1530587191325-3db32d826c18?q=80&w=600&auto=format&fit=crop"
    ]);

    tambahKegiatan("Semarak Perlombaan Tradisional & Pentas Seni Kemerdekaan", [
        "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1505232458627-5671a784ae7e?q=80&w=600&auto=format&fit=crop"
    ]);

    // Jalankan mesin pengawasan pemuatan gambar tertunda
    initLazyLoading();
});

const SUPABASE_URL = 'https://apahbriqkqhmvknbpbdc.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFwYWhicmlxa3FobXZrbmJwYmRjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk1NTc4NzcsImV4cCI6MjEwNTEzMzg3N30.2usxTSQAWIwGpvUt5WlZEP5vHSvgZkXNlPtR5IuDDTs';
const SUPABASE_HEADERS = {
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    'Content-Type': 'application/json'
};
const rupiah = value => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value);
const safeText = value => String(value).replace(/[&<>'"]/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#039;', '"':'&quot;' }[c]));

async function loadBudget() {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/budget_transactions?select=id,jenis,nama,nominal,tanggal&order=tanggal.desc,id.desc`, { headers: SUPABASE_HEADERS });
    if (!response.ok) throw new Error('Riwayat anggaran gagal dimuat.');
    const rows = await response.json();
    let saldo = 0;
    rows.forEach(row => { saldo += row.jenis === 'pemasukan' ? Number(row.nominal) : -Number(row.nominal); });
    document.getElementById('budgetBalance').textContent = rupiah(saldo);
    document.getElementById('budgetHistory').innerHTML = rows.length ? rows.map(item => `<div class="budget-history-item"><div><strong>${safeText(item.nama)}</strong><small>${item.tanggal}</small></div><span class="${item.jenis === 'pemasukan' ? 'income-text' : 'expense-text'}">${item.jenis === 'pemasukan' ? '+' : '-'} ${rupiah(item.nominal)}</span></div>`).join('') : '<p>Belum ada transaksi.</p>';
}

document.addEventListener('DOMContentLoaded', () => {
    const incomeForm = document.getElementById('incomeForm');
    const expenseForm = document.getElementById('expenseForm');
    const status = document.getElementById('budgetStatus');
    document.getElementById('showIncomeButton').onclick = () => incomeForm.classList.toggle('hidden');
    document.getElementById('showExpenseButton').onclick = () => expenseForm.classList.toggle('hidden');
    async function save(payload) {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/budget_transactions`, { method:'POST', headers:{...SUPABASE_HEADERS, Prefer:'return=minimal'}, body:JSON.stringify({ jenis: payload.action === 'income' ? 'pemasukan' : 'pengeluaran', nama: payload.action === 'income' ? 'Pemasukan manual' : payload.nama, nominal: Number(payload.nominal), tanggal: payload.tanggal || new Date().toISOString().slice(0, 10) }) });
        if (!response.ok) throw new Error('Transaksi gagal disimpan.');
    }
    incomeForm.addEventListener('submit', async e => { e.preventDefault(); try { await save({ action:'income', nominal:incomeAmount.value }); incomeForm.reset(); status.textContent='Pemasukan tersimpan.'; await loadBudget(); } catch (error) { status.textContent=error.message; } });
    expenseForm.addEventListener('submit', async e => { e.preventDefault(); try { await save({ action:'expense', nama:expenseName.value, nominal:expenseAmount.value, tanggal:expenseDate.value }); expenseForm.reset(); status.textContent='Pengeluaran tersimpan.'; await loadBudget(); } catch (error) { status.textContent=error.message; } });
    loadBudget().catch(error => { status.textContent=error.message; });
});
