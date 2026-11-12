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

window.addEventListener('scroll', () => {
    document.body.classList.toggle('scroll', window.scrollY > 60);
});

document.querySelectorAll('.post').forEach((post) => {
    const toggle = () => {
        const open = post.classList.toggle('is-open');
        post.setAttribute('aria-expanded', open);
    };

    post.addEventListener('click', toggle);

    post.addEventListener('keydown', (e) => {
        if (e.target === post && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            toggle();
        }
    });

    post.querySelector('.like').addEventListener('click', (e) => {
        e.stopPropagation();
        e.currentTarget.classList.toggle('is-liked');
    });
});

const panel = document.getElementById('cat-panel');
const tabs = document.querySelectorAll('.cat-tab');

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

const strip = document.querySelector('.post-strip');

strip.addEventListener('wheel', (e) => {
    if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;

    const atStart = strip.scrollLeft <= 0 && e.deltaY < 0;
    const atEnd = strip.scrollLeft + strip.clientWidth >= strip.scrollWidth - 1 && e.deltaY > 0;
    if (atStart || atEnd) return;

    e.preventDefault();
    strip.scrollLeft += e.deltaY;
}, { passive: false });

const body = document.querySelector('body')
const topBtn = document.querySelector('.top')

window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        body.classList.add('scroll')
    } else {
        body.classList.remove('scroll')
    }
})

topBtn.addEventListener('click', (e) => {
    e.preventDefault()
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    })
})