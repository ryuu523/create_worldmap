const grass1 = "./mapTile/maptile_sogen_01.png";
const grass2 = "./mapTile/maptile_sogen_02.png";
const see1 = "./mapTile/maptile_umi_01.png";
const see2 = "./mapTile/maptile_umi_02.png";
const snow = "./mapTile/maptile_setsugen.png";
const sand = "./mapTile/maptile_sabaku.png";
const lava = "./mapTile/maptile_yogan.png";

const map = document.getElementById("map")
const palet = document.querySelector(".palet")
let field = Array.from({ length: 28 }, () => Array.from({ length: 48 }, () => 0))


const types = [grass1, grass2, see1, see2, snow, sand, lava]
let selectedNum = 0
let drawing = false
for (const [i, type] of types.entries()) {
    const circle = document.createElement("div")
    circle.style.backgroundImage = `url(${type})`
    circle.classList.add("circle")
    circle.addEventListener("click", () => {
        selectedNum = i
        const circles = palet.querySelectorAll(".circle")
        for (const c of circles) {
            c.style.border = "5px solid black"
        }
        circles[selectedNum].style.border = "5px solid yellow"
    })
    palet.appendChild(circle)
    const circles = palet.querySelectorAll(".circle")
    circles[selectedNum].style.border = "5px solid yellow"
}
let selected = types[0]
for (const [y, element] of field.entries()) {
    const flex = document.createElement("div")
    flex.classList.add("row")
    for (const [x, ele] of element.entries()) {
        const cell = document.createElement("div")
        cell.classList.add("cell")
        cell.style.backgroundImage = `url(${types[0]})`
        cell.addEventListener("mousemove", () => {
            if (!drawing) return
            cell.style.backgroundImage = `url(${types[selectedNum]})`
            field[y][x] = selectedNum

        })

        flex.appendChild(cell)
    }
    map.appendChild(flex)
}
window.addEventListener("mousedown", () => {
    drawing = true
})
window.addEventListener("mouseup", () => {
    drawing = false
})

const save = () => {
    const jsonData = JSON.stringify(field, null, 2); // 整形して可読性を良くする

    // Blobオブジェクトを作成（MIMEタイプはapplication/json）
    const blob = new Blob([jsonData], { type: "application/json" });

    // ダウンロード用のリンクを作成
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob); // BlobデータのURLを作成
    link.download = "mapData.json"; // ファイル名を指定

    // リンクをクリックしてダウンロードを実行
    link.click();

    // 使用が終わった後にURLオブジェクトを解放
    URL.revokeObjectURL(link.href);
}
function load() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json'; // JSONファイルのみ選択できるようにする

    // ファイル選択後の処理
    input.addEventListener('change', (event) => {
        const file = event.target.files[0];

        if (file) {
            const reader = new FileReader();

            // ファイルの読み込み完了後の処理
            reader.onload = function (e) {
                try {
                    const data = JSON.parse(e.target.result); // JSONをパースして配列を取得
                    console.log('Loaded data:', data);
                    field = data
                    for (const [y, element] of data.entries()) {
                        const rows = map.querySelectorAll(".row")
                        for (const [x, ele] of element.entries()) {
                            const cells = rows[y].querySelectorAll(".cell")
                            cells[x].style.backgroundImage = `url(${types[ele]})`
                        }
                    }
                    // 必要に応じて、取得した配列を使用した処理をここに追加
                } catch (error) {
                    alert('JSONファイルの読み込みに失敗しました。エラー: ' + error.message);
                }
            };

            // ファイルの読み込み
            reader.readAsText(file);
        }
    });

    // ファイル選択ダイアログを表示
    input.click();
}