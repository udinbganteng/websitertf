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

document.addEventListener('DOMContentLoaded', async () => {
    const cards = document.getElementById('budgetCards');
    const status = document.createElement('p');
    document.getElementById('budget').appendChild(status);
    const newForm = document.getElementById('newBudgetForm');
    document.getElementById('addBudgetButton').onclick = () => newForm.classList.toggle('hidden');
    async function api(path, options = {}) { const response = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, { ...options, headers: { ...SUPABASE_HEADERS, ...(options.headers || {}) } }); const text = await response.text(); if (!response.ok) { console.error('Supabase:', text); throw new Error('Data gagal disimpan. Periksa tabel dan policy Supabase.'); } return text ? JSON.parse(text) : []; }
    async function loadCard(card, id) { const rows = await api(`budget_transactions?select=jenis,nama,nominal,tanggal&budget_id=eq.${id}&order=tanggal.desc,id.desc`); let balance=0; rows.forEach(row => balance += row.jenis === 'pemasukan' ? Number(row.nominal) : -Number(row.nominal)); card.querySelector('h2').textContent=rupiah(balance); const makeList=(items, kind)=>items.length ? items.map(row=>`<div class="budget-history-item"><div><strong>${safeText(row.nama)}</strong><small>${row.tanggal}</small></div><span class="${kind}-text">${kind === 'income' ? '+' : '-'} ${rupiah(row.nominal)}</span></div>`).join('') : '<p>Belum ada data.</p>'; card.querySelector('.income-history').innerHTML=makeList(rows.filter(row=>row.jenis==='pemasukan'),'income'); card.querySelector('.expense-history').innerHTML=makeList(rows.filter(row=>row.jenis==='pengeluaran'),'expense'); }
    async function render() { const budgets=await api('budgets?select=id,nama,tahun&order=tahun.desc,id.desc'); cards.innerHTML=''; budgets.forEach(budget=>{ const card=document.createElement('div'); card.className='modern-card budget-card'; card.innerHTML=`<span class="role">${safeText(budget.nama)} — ${budget.tahun}</span><h2>Rp0</h2><button class="btn btn-primary income-button">+ Pemasukan</button><form class="budget-form income-form hidden"><label>Nominal pemasukan</label><input class="income-amount" type="text" inputmode="numeric" placeholder="Rp 0" required><button class="btn btn-primary" type="submit">Simpan Pemasukan</button></form><button class="btn btn-secondary expense-button">− Pengeluaran</button><form class="budget-form expense-form hidden"><label>Nama pengeluaran</label><input class="expense-name" type="text" required><label>Nominal</label><input class="expense-amount" type="text" inputmode="numeric" placeholder="Rp 0" required><label>Tanggal</label><input class="expense-date" type="date" required><button class="btn btn-primary" type="submit">Simpan Pengeluaran</button></form><div class="history-columns"><div><span class="role">Pemasukan</span><div class="budget-history income-history"><p>Memuat...</p></div></div><div><span class="role">Pengeluaran</span><div class="budget-history expense-history"><p>Memuat...</p></div></div></div>`; cards.appendChild(card); const income=card.querySelector('.income-form'), expense=card.querySelector('.expense-form'); card.querySelector('.income-button').onclick=()=>income.classList.toggle('hidden'); card.querySelector('.expense-button').onclick=()=>expense.classList.toggle('hidden'); formatInputUang(card.querySelector('.income-amount')); formatInputUang(card.querySelector('.expense-amount')); const save=async(jenis,nama,nominal,tanggal)=>{await api('budget_transactions',{method:'POST',headers:{Prefer:'return=minimal'},body:JSON.stringify({budget_id:budget.id,jenis,nama,nominal:angka(nominal),tanggal})});await render();}; income.onsubmit=async e=>{e.preventDefault();await save('pemasukan','Pemasukan manual',card.querySelector('.income-amount').value,new Date().toISOString().slice(0,10));}; expense.onsubmit=async e=>{e.preventDefault();await save('pengeluaran',card.querySelector('.expense-name').value,card.querySelector('.expense-amount').value,card.querySelector('.expense-date').value);}; loadCard(card,budget.id); }); }
    newForm.onsubmit=async e=>{e.preventDefault();await api('budgets',{method:'POST',headers:{Prefer:'return=representation'},body:JSON.stringify({nama:document.getElementById('newBudgetName').value.trim(),tahun:Number(document.getElementById('newBudgetYear').value)})});newForm.reset();newForm.classList.add('hidden');await render();};
    try { await render(); } catch(error) { status.textContent=error.message; }
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
const angka = value => Number(String(value).replace(/[^0-9]/g, '')) || 0;
function formatInputUang(input) {
    input.addEventListener('input', () => {
        const value = angka(input.value);
        input.value = value ? rupiah(value) : '';
    });
}

async function loadBudget() {
    const budgetId = document.getElementById('budgetSelect').value;
    if (!budgetId) return;
    const response = await fetch(`${SUPABASE_URL}/rest/v1/budget_transactions?select=id,jenis,nama,nominal,tanggal&budget_id=eq.${budgetId}&order=tanggal.desc,id.desc`, { headers: SUPABASE_HEADERS });
    if (!response.ok) throw new Error('Riwayat anggaran gagal dimuat.');
    const rows = await response.json();
    let saldo = 0;
    rows.forEach(row => { saldo += row.jenis === 'pemasukan' ? Number(row.nominal) : -Number(row.nominal); });
    document.getElementById('budgetBalance').textContent = rupiah(saldo);
    document.getElementById('budgetHistory').innerHTML = rows.length ? rows.map(item => `<div class="budget-history-item"><div><strong>${safeText(item.nama)}</strong><small>${item.tanggal}</small></div><span class="${item.jenis === 'pemasukan' ? 'income-text' : 'expense-text'}">${item.jenis === 'pemasukan' ? '+' : '-'} ${rupiah(item.nominal)}</span></div>`).join('') : '<p>Belum ada transaksi.</p>';
}

document.addEventListener('DOMContentLoaded', async () => {
    if (!document.getElementById('budgetSelect')) return;
    const incomeForm = document.getElementById('incomeForm');
    const expenseForm = document.getElementById('expenseForm');
    const status = document.getElementById('budgetStatus');
    const incomeAmountInput = document.getElementById('incomeAmount');
    const expenseAmountInput = document.getElementById('expenseAmount');
    const expenseNameInput = document.getElementById('expenseName');
    const expenseDateInput = document.getElementById('expenseDate');
    formatInputUang(incomeAmountInput);
    formatInputUang(expenseAmountInput);
    const budgetSelect = document.getElementById('budgetSelect');
    const newBudgetForm = document.getElementById('newBudgetForm');
    const newBudgetName = document.getElementById('newBudgetName');
    const newBudgetYear = document.getElementById('newBudgetYear');
    const budgetResponse = await fetch(`${SUPABASE_URL}/rest/v1/budgets?select=id,nama,tahun&order=tahun.desc,id.desc`, { headers: SUPABASE_HEADERS });
    if (!budgetResponse.ok) throw new Error('Daftar anggaran gagal dimuat.');
    let budgets = await budgetResponse.json();
    if (budgets.length === 0) {
        const seedResponse = await fetch(`${SUPABASE_URL}/rest/v1/budgets`, { method:'POST', headers:{...SUPABASE_HEADERS, Prefer:'return=representation'}, body:JSON.stringify({ nama:`Anggaran RT ${new Date().getFullYear()}`, tahun:new Date().getFullYear() }) });
        if (!seedResponse.ok) throw new Error('Anggaran awal gagal dibuat.');
        budgets = await seedResponse.json();
    }
    budgetSelect.innerHTML = budgets.map(budget => `<option value="${budget.id}">${safeText(budget.nama)} (${budget.tahun})</option>`).join('');
    budgetSelect.addEventListener('change', () => loadBudget().catch(error => { status.textContent = error.message; }));
    document.getElementById('addBudgetButton').onclick = () => { newBudgetForm.classList.toggle('hidden'); newBudgetName.focus(); };
    newBudgetForm.addEventListener('submit', async event => { event.preventDefault(); const response = await fetch(`${SUPABASE_URL}/rest/v1/budgets`, { method:'POST', headers:{...SUPABASE_HEADERS, Prefer:'return=representation'}, body:JSON.stringify({ nama:newBudgetName.value.trim(), tahun:Number(newBudgetYear.value) }) }); if (!response.ok) { status.textContent='Anggaran gagal dibuat.'; return; } newBudgetForm.reset(); newBudgetForm.classList.add('hidden'); await loadBudget(); });
    await loadBudget();
    document.getElementById('showIncomeButton').onclick = () => incomeForm.classList.toggle('hidden');
    document.getElementById('showExpenseButton').onclick = () => expenseForm.classList.toggle('hidden');
    async function save(payload) {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/budget_transactions`, { method:'POST', headers:{...SUPABASE_HEADERS, Prefer:'return=minimal'}, body:JSON.stringify({ budget_id:Number(document.getElementById('budgetSelect').value), jenis: payload.action === 'income' ? 'pemasukan' : 'pengeluaran', nama: payload.action === 'income' ? 'Pemasukan manual' : payload.nama, nominal: angka(payload.nominal), tanggal: payload.tanggal || new Date().toISOString().slice(0, 10) }) });
        if (!response.ok) throw new Error('Transaksi gagal disimpan.');
    }
    incomeForm.addEventListener('submit', async e => { e.preventDefault(); try { await save({ action:'income', nominal:incomeAmountInput.value }); incomeForm.reset(); status.textContent='Pemasukan tersimpan.'; await loadBudget(); } catch (error) { status.textContent=error.message; } });
    expenseForm.addEventListener('submit', async e => { e.preventDefault(); try { await save({ action:'expense', nama:expenseNameInput.value, nominal:expenseAmountInput.value, tanggal:expenseDateInput.value }); expenseForm.reset(); status.textContent='Pengeluaran tersimpan.'; await loadBudget(); } catch (error) { status.textContent=error.message; } });
    loadBudget().catch(error => { status.textContent=error.message; });
});
