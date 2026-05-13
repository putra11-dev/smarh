// Ganti isi java.js dengan ini
const SUPABASE_URL = 'https://jtlojyrfwccqebfowlof.supabase.co';
const SUPABASE_KEY = 'sb_publishable_miw4K1jRQJTEdm1P2sOH-w_kVV6BSBd';
// Pastikan variabel client namanya berbeda dengan library-nya
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

async function muatBerita() {
    const container = document.getElementById('container-berita');
    if (!container) return;

    const isIndexPage = window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('.html') == false;
    const limitCount = isIndexPage ? 3 : 100;

    try {
        const { data: dataBerita, error } = await supabaseClient // Gunakan supabaseClient
            .from('berita')
            .select('*')
            .order('id', { ascending: false })
            .limit(limitCount);

        if (error) throw error;

        container.innerHTML = '';
        if (dataBerita.length === 0) {
            container.innerHTML = '<p style="text-align:center; grid-column: 1/-1;">Belum ada berita terbaru.</p>';
            return;
        }

        dataBerita.forEach(item => {
            container.innerHTML += `
                <article class="event-card">
                    <img src="${item.gambar}" alt="${item.judul}" onerror="this.src='poto/default.jpg'">
                    <div class="event-content">
                        <div class="meta-berita">
                            <span class="event-date"><i class="fas fa-calendar"></i> ${item.tanggal}</span>
                        </div>
                        <h3>${item.judul}</h3>
                        <p>${item.isi}</p>
                        <a href="detail-berita.html?id=${item.slug}" class="btn-small">Baca Selengkapnya</a>
                    </div>
                </article>`;
        });
    } catch (error) {
        console.error("Gagal muat:", error.message);
    }
}
document.addEventListener('DOMContentLoaded', muatBerita);

const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");

hamburger.addEventListener("click", () => {
    // Jika posisi menu adalah -100% (sembunyi), maka ubah ke 0 (tampil)
    if (navMenu.style.left === "0px") {
        navMenu.style.left = "-100%";
    } else {
        navMenu.style.left = "0";
    }
});

function filterBerita() {
    // 1. Ambil kata kunci pencarian dan ubah ke huruf kecil
    const input = document.getElementById('searchInput');
    const filter = input.value.toLowerCase();
    
    // 2. Ambil semua kartu berita
    const container = document.getElementById('container-berita');
    const cards = container.getElementsByClassName('event-card');

    // 3. Loop semua kartu berita
    for (let i = 0; i < cards.length; i++) {
        // Ambil elemen judul di dalam kartu (biasanya tag <h3>)
        const title = cards[i].querySelector('h3');
        const textValue = title.textContent || title.innerText;

        // 4. Jika judul cocok dengan kata kunci, tampilkan. Jika tidak, sembunyikan.
        if (textValue.toLowerCase().indexOf(filter) > -1) {
            cards[i].style.display = ""; // Tampilkan
        } else {
            cards[i].style.display = "none"; // Sembunyikan
        }
    }

    // 5. Bonus: Tampilkan pesan jika tidak ada berita yang cocok
    const noResult = document.getElementById('no-result-msg');
    const visibleCards = Array.from(cards).filter(c => c.style.display !== "none");

    if (visibleCards.length === 0) {
        if (!noResult) {
            const msg = document.createElement('p');
            msg.id = 'no-result-msg';
            msg.style.textAlign = 'center';
            msg.style.gridColumn = '1/-1';
            msg.innerText = 'Berita yang Anda cari tidak ditemukan.';
            container.appendChild(msg);
        }
    } else if (noResult) {
        noResult.remove();
    }
}

// Menutup menu saat salah satu link diklik
document.querySelectorAll(".nav-link").forEach(n => n.addEventListener("click", () => {
    navMenu.style.left = "-100%";
}));
