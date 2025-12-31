/**
 * ニュース管理オブジェクト
 */
const NewsManager = {
    // データ取得
    async fetchAll() {
        const response = await fetch('/news/news.json');
        if (!response.ok) throw new Error('JSON読み込み失敗');
        return await response.json();
    },

    // ニュース一覧の表示
    render(allNews, containerId, start, end) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const today = new Date();
        const oneMonthAgo = new Date(today.setMonth(today.getMonth() - 1));
        
        const targetNews = (start !== undefined && end !== undefined) 
                           ? allNews.slice(start, end) 
                           : allNews;

        container.innerHTML = targetNews.map(item => {
            const itemDate = new Date(item.date.replace(/\./g, '/'));
            const isNew = itemDate >= oneMonthAgo;
            const newBadge = isNew ? '<span class="new-badge">New</span>' : '';

            return `
                <li class="news-item">
                    <span class="news-date">${item.date}</span>
                    <span class="news-cat cat-${item.category}">${item.category}</span>
                    <a href="${item.url}">${item.title}</a>
                    ${newBadge}
                </li>
            `;
        }).join('');
    },

    // ページネーション表示
    renderPagination(navId, totalItems, itemsPerPage, currentPage, onPageClick) {
        const nav = document.getElementById(navId);
        if (!nav) return;
        
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        if (totalPages <= 1) { nav.innerHTML = ''; return; }

        let html = '';
        const range = window.innerWidth < 600 ? 1 : 2;

        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= currentPage - range && i <= currentPage + range)) {
                const activeClass = i === currentPage ? 'class="active"' : '';
                html += `<button ${activeClass} onclick="location.href='#'; ${onPageClick}(${i})">${i}</button>`;
            } else if (i === currentPage - range - 1 || i === currentPage + range + 1) {
                html += `<span style="padding:8px">...</span>`;
            }
        }
        nav.innerHTML = html;
    }
};