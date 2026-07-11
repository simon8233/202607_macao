# 澳門·深圳 9 日行程（2026.07.12–07.19）

手機友善的靜態行程站，可部署到 **GitHub Pages**，也可加到主畫面當輕量 App 使用。

## 本機預覽

```bash
cd /Users/jonathan/workspace/trips/202607_macao
npx --yes serve .
```

瀏覽器開啟終端機顯示的 Local 網址（例如 `http://localhost:3000`）。

或直接開啟 `index.html`（部分瀏覽器對 `file://` 限制較多，建議用 `serve`）。

## 內容分頁

| 分頁 | 內容 |
|------|------|
| 每日 | 7/12–7/19 時間軸、出租車程、鎖定項、週三 A/B/C 分支 |
| 用餐 | 每日早午晚總表 + 前海飯店附近早餐 |
| 備選 | 可塞入的景點、時長、哪天有空位 |
| 注意 | 鎖定規則、過關、車程速查 |

## 部署 GitHub Pages（確認後再 push）

1. 確認本機內容 OK  
2. 若尚未連遠端：

```bash
git remote add origin https://github.com/simon8233/<REPO>.git
git branch -M main
git push -u origin main
```

3. GitHub → **Settings → Pages**  
   - Source: **Deploy from a branch**  
   - Branch: `main` / root (`/`)  
4. 數分鐘後開啟：`https://simon8233.github.io/<REPO>/`

也可用 CLI（需已 `gh auth login`）：

```bash
gh repo create 202607_macao --public --source=. --remote=origin --push
gh api -X POST repos/simon8233/202607_macao/pages -f build_type=legacy -f source[branch]=main -f source[path]=/
```

## 檔案

- `index.html` — 結構  
- `styles.css` — 樣式（支援深淺色）  
- `data.js` — 行程資料（改行程主要改這）  
- `app.js` — 渲染與分頁  
- `manifest.json` / `sw.js` — 加到主畫面與簡易離線  

## 注意

- 車程為出租車粗估，塞車請自行加時。  
- 滑雪、南謠、贏到粥時段以實際憑證為準。  
