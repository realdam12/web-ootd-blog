const IMG = './img/';

const CATALOG = {
    daily: {
        name: 'Daily',
        desc: '데일리한 느낌',
        tag: '#데일리',
        files: ['daily1.jpg', 'daily2.jpg', 'daily3.jpg', 'daily4.jpg']
    },
    chic: {
        name: 'Chic',
        desc: '시크한 느낌',
        tag: '#시크',
        files: ['chic1.jpg', 'chic2.jpg', 'chic3.jpg', 'chic4.jpg']
    },
    casual: {
        name: 'Casual',
        desc: '캐주얼한 느낌',
        tag: '#캐주얼',
        files: ['casual1.jpg', 'casual2.jpg', 'casual3.jpg', 'casual4.jpg']
    },
    cute: {
        name: 'Cute',
        desc: '큐트한 느낌',
        tag: '#큐트',
        files: ['cute1.jpg', 'cute2.jpg', 'cute3.jpg', 'cute4.jpg']
    },
    etc: {
        name: 'Etc',
        desc: '그 밖의 아이템',
        tag: '#기타',
        files: ['etc1.jpg', 'etc2.jpg', 'etc3.png', 'etc4.jpg']
    }
};

const body = document.body;
const topBtn = document.querySelector('.top');
const mNavBtn = document.querySelector('.mob-nav-btn');
const navLinks = document.querySelectorAll('nav ul a');
const posts = document.querySelectorAll('.post');
const strip = document.querySelector('.post-strip');
const panel = document.getElementById('cat-panel');
const tabs = document.querySelectorAll('.cat-tab');

new Swiper('.hero-swiper', {
    loop: true,
    speed: 600,
    grabCursor: true,
    pagination: {
        el: '.swiper-pagination',
        clickable: true
    }
});

window.addEventListener('scroll', () => {
    body.classList.toggle('scroll', window.scrollY > 100);
});

function swapPhoto(photo, src) {
    if (photo.getAttribute('src') === src) return;

    photo.classList.add('is-swap');

    setTimeout(() => {
        photo.onload = () => photo.classList.remove('is-swap');
        photo.onerror = () => {
            photo.src = photo.dataset.origin;
            photo.classList.remove('is-swap');
        };
        photo.src = src;
    }, 150);
}

function resetPhoto(post) {
    const photo = post.querySelector('.post-photo');

    post.querySelectorAll('.post-items li').forEach((li) => li.classList.remove('is-active'));
    photo.classList.remove('is-swap');

    if (photo.getAttribute('src') !== photo.dataset.origin) {
        photo.src = photo.dataset.origin;
    }
}

function togglePost(post) {
    const open = post.classList.toggle('is-open');
    post.setAttribute('aria-expanded', open);

    if (!open) {
        resetPhoto(post);
        return;
    }

    posts.forEach((other) => {
        if (other === post) return;
        other.classList.remove('is-open');
        other.setAttribute('aria-expanded', 'false');
        resetPhoto(other);
    });

    setTimeout(() => {
        const stripLeft = strip.getBoundingClientRect().left;
        const postLeft = post.getBoundingClientRect().left;
        const left = strip.scrollLeft + (postLeft - stripLeft) - (strip.clientWidth - post.offsetWidth) / 2;
        strip.scrollTo({ left, behavior: 'smooth' });
    }, 45);
}

posts.forEach((post) => {
    const photo = post.querySelector('.post-photo');
    const items = post.querySelectorAll('.post-items li');

    post.setAttribute('aria-expanded', post.classList.contains('is-open'));
    photo.dataset.origin = photo.getAttribute('src');

    const pickItem = (item) => {
        if (!item.dataset.photo) return;

        const wasActive = item.classList.contains('is-active');

        items.forEach((li) => li.classList.remove('is-active'));
        if (!wasActive) item.classList.add('is-active');

        swapPhoto(photo, wasActive ? photo.dataset.origin : item.dataset.photo);
    };

    items.forEach((item) => {
        item.addEventListener('click', (e) => {
            e.stopPropagation();
            pickItem(item);
        });

        item.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                e.stopPropagation();
                pickItem(item);
            }
        });
    });

    post.addEventListener('click', () => togglePost(post));

    post.addEventListener('keydown', (e) => {
        if (e.target === post && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            togglePost(post);
        }
    });


    strip.addEventListener('click', (e) => {
        const btn = e.target.closest('.like');
        if (!btn) return;

        e.stopPropagation();

        const liked = btn.getAttribute('aria-pressed') === 'true';
        btn.setAttribute('aria-pressed', String(!liked));
        btn.textContent = liked ? '♡' : '♥';
    });

});

strip.addEventListener('wheel', (e) => {
    if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;

    const atStart = strip.scrollLeft <= 0 && e.deltaY < 0;
    const atEnd = strip.scrollLeft + strip.clientWidth >= strip.scrollWidth - 1 && e.deltaY > 0;
    if (atStart || atEnd) return;

    e.preventDefault();
    strip.scrollLeft += e.deltaY;
}, { passive: false });

function renderCatalog(key) {
    const c = CATALOG[key];

    panel.innerHTML = c.files.map((file, i) => {
        const title = c.name + (i + 1);
        return `
            <article class="cat-card" tabindex="0">
                <img src="${IMG}${file}" alt="${title}">
                <div class="cat-info">
                    <span class="cat-num">${String(i + 1).padStart(2, '0')}</span>
                    <h3>${title}</h3>
                    <p>${c.desc}</p>
                </div>
                <span class="cat-tag">${c.tag}</span>
            </article>`;
    }).join('');
}

function selectTab(selected) {
    tabs.forEach((tab) => {
        const on = tab === selected;
        tab.classList.toggle('active', on);
        tab.setAttribute('aria-selected', on);
        tab.querySelector('img').src = on ? tab.dataset.black : tab.dataset.white;
    });

    renderCatalog(selected.dataset.cat);
}

tabs.forEach((tab) => {
    tab.addEventListener('click', () => selectTab(tab));
});

selectTab(document.querySelector('.cat-tab.active'));

topBtn.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

mNavBtn.addEventListener('click', (e) => {
    e.preventDefault();
    body.classList.toggle('m-nav-open');
});

navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
        e.preventDefault();

        const target = document.querySelector(link.getAttribute('href'));
        const headerH = document.querySelector('header').offsetHeight;
        const top = target.getBoundingClientRect().top + window.scrollY - headerH;

        window.scrollTo({ top, behavior: 'smooth' });
        body.classList.remove('m-nav-open');
    });
});