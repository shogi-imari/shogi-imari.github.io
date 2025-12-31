/**
 * 案内情報（Information）表示マネージャー
 */
const InfoManager = {
    /**
     * 指定したパスのJSONを読み込み、指定したIDの要素に描画する
     */
    async loadAndRender(jsonPath, containerId) {
        try {
            const response = await fetch(jsonPath);
            if (!response.ok) throw new Error('JSONの読み込みに失敗しました');
            const data = await response.json();
            
            const dataArray = Array.isArray(data) ? data : [data];
            this.render(dataArray, containerId);
        } catch (error) {
            console.error("info-manager error:", error);
        }
    },

    /**
     * 案内テーブルのHTML生成
     */
    render(dataArray, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = dataArray.map(item => {
            let html = '<section class="info-block">';

            // 1. タイトル判定（nullなら表示しない）
            if (item.title) {
                html += `<h3>${item.title}</h3>`;
            }

            // 2. 案内 (info) の描画
            if (item.info) {
                html += `<table class="info-table"><tbody>`;
                html += `<tr><th>日時</th><td>${item.info.date}</td></tr>`;
                html += `<tr><th>場所</th><td>${item.info.location}`;
                
                if (item.info.mapUrl) {
                    html += `<br><details class="map-accordion"><summary>地図を表示</summary>
                             <div class="map-frame"><iframe src="${item.info.mapUrl}" width="100%" height="450" style="border:0;" loading="lazy"></iframe></div></details>`;
                }
                html += `</td></tr>`;

                // 自由項目 (detail) のループ
                if (item.info.detail) {
                    Object.entries(item.info.detail).forEach(([key, value]) => {
                        html += `<tr><th>${key}</th><td>${value}</td></tr>`;
                    });
                }
                html += `</tbody></table>`;
            }

            html += '</section>';
            return html;
        }).join('');
    }
};