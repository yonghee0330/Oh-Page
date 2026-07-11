/**
 * 오수경 작가 포트폴리오 & 주문 페이지
 * 초안 — UI 인터랙션 및 장바구니 플레이스홀더
 */

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initScrollAnimations();
    initArticles();
    initCart();
    initForms();
});

/* ---- Articles Data ---- */
const articlesData = {
    ongoing: [
        {
            id: 'hankyoreh21',
            media: '한겨레21',
            mediaUrl: 'https://h21.hani.co.kr',
            description: '드라마와 사회, 문화를 바라보는 칼럼을 연재합니다.',
            latest: {
                title: '통쾌한 응징, 씁쓸한 뒷맛',
                date: '2026.06.18',
                url: 'https://h21.hani.co.kr/arti/culture/culture_general/59494.html',
                thumbnail: 'https://flexible.img.hani.co.kr/flexible/normal/970/1436/imgdb/original/2026/0618/20260618503530.jpg'
            }
        },
        {
            id: 'cine21',
            media: '시네21',
            mediaUrl: 'https://cine21.com',
            description: '「오수경의 TVIEW」— 드라마·TV를 관찰하며 이야기하는 칼럼을 연재합니다.',
            latest: {
                title: '[오수경의 TVIEW] <내일도 출근!>',
                date: '2026.07.03',
                url: 'https://cine21.com/news/view/?mag_id=110270',
                thumbnail: 'https://image.cine21.com/resize/cine21/movie/2026/0703/10_29_53__6a47109171b7a%5BS1000,1000%5D.jpg'
            }
        }
    ],
    archive: [
        {
            id: 'a1',
            title: '세상에 이렇게 다양한 드라마가 있었나',
            media: '시사IN',
            date: '2022',
            url: 'https://www.sisain.co.kr/news/articleView.html?idxno=48026',
            featured: true
        },
        {
            id: 'a2',
            title: '드라마를 책 읽듯 보는 법',
            media: '에세이',
            date: '2021',
            url: '#'
        },
        {
            id: 'a3',
            title: '일 못하는 사람들의 이야기',
            media: '사회',
            date: '2015',
            url: '#'
        },
        {
            id: 'a4',
            title: '불편할 준비, 페미니즘을 찾아가며',
            media: '시사IN북',
            date: '2018',
            url: '#'
        }
    ]
};

/* ---- Articles ---- */
function initArticles() {
    renderOngoingColumns();
    renderArchive();

    const toggle = document.getElementById('archiveToggle');
    const list = document.getElementById('archiveList');

    toggle.addEventListener('click', () => {
        const expanded = toggle.getAttribute('aria-expanded') === 'true';
        toggle.setAttribute('aria-expanded', String(!expanded));
        list.hidden = expanded;
        toggle.querySelector('.archive-toggle-text').textContent =
            expanded ? '과거 글 전체 보기' : '접기';
    });
}

function renderOngoingColumns() {
    const container = document.getElementById('ongoingColumns');
    container.innerHTML = articlesData.ongoing.map(col => `
        <article class="column-card">
            <div class="column-media">
                <span class="column-media-name">${col.media}</span>
                <span class="column-badge">연재 중</span>
            </div>
            <p class="column-desc">${col.description}</p>
            <div class="column-latest">
                <a href="${col.latest.url}" class="column-latest-thumb"${externalAttrs(col.latest.url)}>
                    <img src="${col.latest.thumbnail || ''}" alt="${col.latest.title}" loading="lazy">
                </a>
                <div class="column-latest-info">
                    <p class="column-latest-label">최신 글</p>
                    <h4 class="column-latest-title">
                        <a href="${col.latest.url}"${externalAttrs(col.latest.url)}>${col.latest.title}</a>
                    </h4>
                    <p class="column-latest-meta">${col.latest.date}</p>
                </div>
            </div>
        </article>
    `).join('');
}

function renderArchive() {
    const featured = articlesData.archive.find(a => a.featured) || articlesData.archive[0];
    const featuredEl = document.getElementById('archiveFeatured');
    const listEl = document.getElementById('archiveList');

    if (featured) {
        featuredEl.innerHTML = `
            <div class="archive-featured">
                <p class="archive-featured-label">PICK</p>
                <h4 class="archive-featured-title">
                    <a href="${featured.url}"${externalAttrs(featured.url)}>${featured.title}</a>
                </h4>
                <p class="archive-featured-meta">${featured.media} · ${featured.date}</p>
            </div>`;
    }

    listEl.innerHTML = articlesData.archive.map(item => `
        <li>
            <a href="${item.url}"${externalAttrs(item.url)}>
                <span class="archive-list-date">${item.date}</span>
                <span class="archive-list-media">${item.media}</span>
                <span class="archive-list-title">${item.title}</span>
            </a>
        </li>
    `).join('');
}

function externalAttrs(url) {
    return url.startsWith('http') ? ' target="_blank" rel="noopener"' : '';
}

/* ---- Navigation ---- */
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const navLinks = navMenu.querySelectorAll('a');

    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    });

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('open');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('open');
        });
    });

    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY + 100;
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            if (scrollY >= top && scrollY < top + height) {
                navLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
                });
            }
        });
    });
}

/* ---- Scroll Animations ---- */
function initScrollAnimations() {
    const elements = document.querySelectorAll('.fade-in-scroll');
    const observer = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        },
        { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    elements.forEach(el => observer.observe(el));
}

/* ---- Cart ---- */
const cart = {
    items: [],
    storageKey: 'ohsookyeong_cart'
};

function initCart() {
    loadCart();

    const cartToggle = document.getElementById('cartToggle');
    const cartClose = document.getElementById('cartClose');
    const cartOverlay = document.getElementById('cartOverlay');
    const cartSidebar = document.getElementById('cartSidebar');

    cartToggle.addEventListener('click', (e) => {
        e.preventDefault();
        openCart();
    });

    cartClose.addEventListener('click', closeCart);
    cartOverlay.addEventListener('click', closeCart);

    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', () => {
            addToCart({
                id: btn.dataset.id,
                title: btn.dataset.title,
                price: parseInt(btn.dataset.price, 10)
            });
        });
    });

    document.getElementById('cartCheckout').addEventListener('click', () => {
        showToast('결제 기능은 준비 중입니다.');
    });
}

function loadCart() {
    try {
        const saved = localStorage.getItem(cart.storageKey);
        if (saved) {
            cart.items = JSON.parse(saved);
            renderCart();
        }
    } catch {
        cart.items = [];
    }
}

function saveCart() {
    localStorage.setItem(cart.storageKey, JSON.stringify(cart.items));
}

function addToCart(item) {
    const existing = cart.items.find(i => i.id === item.id);
    if (existing) {
        showToast(`"${item.title}"은(는) 이미 장바구니에 있습니다.`);
        return;
    }
    cart.items.push(item);
    saveCart();
    renderCart();
    showToast(`"${item.title}"을(를) 장바구니에 담았습니다.`);
    openCart();
}

function removeFromCart(id) {
    cart.items = cart.items.filter(i => i.id !== id);
    saveCart();
    renderCart();
}

function renderCart() {
    const cartItems = document.getElementById('cartItems');
    const cartCount = document.getElementById('cartCount');
    const cartTotal = document.getElementById('cartTotal');
    const cartCheckout = document.getElementById('cartCheckout');

    const count = cart.items.length;
    cartCount.textContent = count;
    cartCount.classList.toggle('hidden', count === 0);

    if (count === 0) {
        cartItems.innerHTML = `
            <div class="cart-empty">
                <i class="fas fa-shopping-bag"></i>
                <p>장바구니가 비어 있습니다.</p>
            </div>`;
        cartTotal.textContent = '0원';
        cartCheckout.disabled = true;
        return;
    }

    const total = cart.items.reduce((sum, item) => sum + item.price, 0);
    cartTotal.textContent = formatPrice(total);
    cartCheckout.disabled = false;

    cartItems.innerHTML = cart.items.map(item => `
        <div class="cart-item">
            <div class="cart-item-info">
                <div class="cart-item-title">${item.title}</div>
                <div class="cart-item-price">${formatPrice(item.price)}</div>
                <button class="cart-item-remove" data-id="${item.id}">삭제</button>
            </div>
        </div>
    `).join('');

    cartItems.querySelectorAll('.cart-item-remove').forEach(btn => {
        btn.addEventListener('click', () => removeFromCart(btn.dataset.id));
    });
}

function openCart() {
    document.getElementById('cartOverlay').classList.add('open');
    document.getElementById('cartSidebar').classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeCart() {
    document.getElementById('cartOverlay').classList.remove('open');
    document.getElementById('cartSidebar').classList.remove('open');
    document.body.style.overflow = '';
}

function formatPrice(price) {
    return price.toLocaleString('ko-KR') + '원';
}

/* ---- Forms (placeholder) ---- */
function initForms() {
    ['meetingForm', 'lectureForm', 'newsletterForm'].forEach(id => {
        document.getElementById(id).addEventListener('submit', (e) => {
            e.preventDefault();
            showToast('문의가 접수되었습니다. (기능 준비 중 — 실제 전송은 추후 연결 예정)');
            e.target.reset();
        });
    });
}

/* ---- Toast ---- */
function showToast(message) {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('hiding');
        setTimeout(() => toast.remove(), 400);
    }, 3000);
}
