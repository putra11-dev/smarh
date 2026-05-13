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


// Menutup menu saat salah satu link diklik
document.querySelectorAll(".nav-link").forEach(n => n.addEventListener("click", () => {
    navMenu.style.left = "-100%";
}));
