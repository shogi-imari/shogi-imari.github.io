/**
 * ニュースを表示する共通関数
 */
async function loadNewsData(containerId, start, end) {
    try {
        const response = await fetch('/news/news.json');
        if (!response.ok) throw new Error('JSON読み込み失敗');
        const allNews = await response.json();
        renderNewsRange(allNews, containerId, start, end);
        return allNews;
    } catch (error) {
        console.error('ニュースエラー:', error);
    }
}

/**
 * ニュース範囲描画の実体
 */
function renderNewsRange(allNews, containerId, start, end) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const oneMonthAgo = new Date(today);
    oneMonthAgo.setMonth(today.getMonth() - 1);

    const targetNews = allNews.slice(start, end);
    container.innerHTML = '';

    targetNews.forEach(item => {
        const li = document.createElement('li');
        li.className = 'news-item';
        
        // 「.」を「/」に置換してDateオブジェクトが認識できるようにする
        const normalizedDate = item.date.replace(/\./g, '/');
        const itemDate = new Date(normalizedDate);
        itemDate.setHours(0, 0, 0, 0);

        // 判定
        const newBadge = (itemDate >= oneMonthAgo) 
                         ? '<span class="new-badge">New</span>' 
                         : '';

        li.innerHTML = `
            <span class="news-date">${item.date}</span>
            <span class="news-cat cat-${item.category}">${item.category}</span>
            <a href="${item.url}">${item.title}</a>
            ${newBadge}
        `;
        container.appendChild(li);
    });
}

/**
 * ページネーション描画関数
 */
function renderPagination(navId, totalItems, itemsPerPage, currentPage, onPageClick) {
    const nav = document.getElementById(navId);
    if (!nav) return;
    nav.innerHTML = '';
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    if (totalPages <= 1) return;

    const isMobile = window.innerWidth < 600;
    const range = isMobile ? 1 : 2;

    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - range && i <= currentPage + range)) {
            const btn = document.createElement('button');
            btn.innerText = i;
            if (i === currentPage) btn.className = 'active';
            btn.onclick = () => onPageClick(i);
            nav.appendChild(btn);
        } else if (i === currentPage - range - 1 || i === currentPage + range + 1) {
            const span = document.createElement('span');
            span.innerText = '...';
            span.style.padding = '8px';
            nav.appendChild(span);
        }
    }
}

/**
 * 共通コンポーネント読み込み関数
 */
function loadComponent(id, file) {
    fetch(file)
        .then(res => { if (res.ok) return res.text(); })
        .then(data => { if (data) document.getElementById(id).innerHTML = data; });
}