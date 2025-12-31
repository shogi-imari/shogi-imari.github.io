/**
 * 共通コンポーネント読み込み
 */
function loadComponent(id, file) {
    return fetch(file)
        .then(res => { if (res.ok) return res.text(); })
        .then(data => { 
            const el = document.getElementById(id);
            if (data && el) el.innerHTML = data; 
        })
        .catch(err => console.error(err));
}

// 全ページ共通の初期化処理
document.addEventListener('DOMContentLoaded', () => {
    loadComponent('common-header', '/header.html');
    loadComponent('common-footer', '/footer.html');
});