[README.md](https://github.com/user-attachments/files/30310558/README.md)
# igorYDS — Yayıncı Tanıtım Sitesi

Koyu temalı, oyuncu/yayıncı tanıtım sitesi. Kick ve TikTok profillerini,
oynadığın oyunları ve TikTok kliplerini gösterir.

## Dosyalar
- `index.html` — sayfa içeriği
- `styles.css` — tüm tasarım/stil
- `script.js` — menü ve küçük etkileşimler

## İçeriği güncellemek

- **Profil fotoğrafı**: Şu an Kick profil fotoğrafın direkt link olarak
  kullanılıyor (`index.html` içinde 2 yerde `<img src="https://files.kick.com/...">`).
  Kick'te fotoğrafını değiştirirsen, bu linki de güncellemen gerekir —
  yeni fotoğrafına sağ tık → "resim adresini kopyala" ile yeni linki alıp
  eskisinin üzerine yapıştırabilirsin.
- **Bio metni**: Hero bölümündeki `<p class="hero-desc">` içindeki metni
  kendi cümlelerinle değiştirebilirsin.
- **Yeni klip eklemek**: `klipler` bölümünde her klip şu şekilde bir blok:
  ```html
  <blockquote class="tiktok-embed" cite="TIKTOK_VIDEO_LINKI" data-video-id="VIDEO_ID"><section></section></blockquote>
  ```
  Yeni bir TikTok linkin varsa, linkin sonundaki sayı `VIDEO_ID`'dir
  (örn. `.../video/7656416042477980936` → id `7656416042477980936`).
  Aynı bloğu kopyalayıp `cite` ve `data-video-id` değerlerini yeni videonla
  değiştirerek ekleyebilirsin.
- **Yeni oyun eklemek**: `oyunlar` bölümünde `<article class="game-card">`
  bloklarından birini kopyalayıp emoji, oyun adı ve açıklamayı değiştir.

---

## GitHub üzerinden yayınlama (GitHub Pages)

### 1. Repo oluştur
1. github.com'da sağ üstteki **+** ikonuna tıkla → **New repository**.
2. Bir isim ver (örn. `igoryds-site`), **Public** seçili kalsın, **Create repository**.

### 2. Dosyaları yükle
1. Repo sayfasında **Add file → Upload files** seçeneğine tıkla.
2. `index.html`, `styles.css`, `script.js` dosyalarını sürükle-bırak yap.
3. Aşağı inip **Commit changes** butonuna bas.

### 3. GitHub Pages'i aç
1. Repo sayfasında üstteki **Settings** sekmesine git.
2. Sol menüden **Pages**'e tıkla.
3. **Source** kısmından **Deploy from a branch** seç.
4. **Branch**: `main`, klasör: `/ (root)` seç, **Save**'e bas.
5. Birkaç dakika bekle — sayfayı yenileyince üstte yeşil kutuda
   sitenin canlı adresini göreceksin:
   `https://kullaniciadin.github.io/igoryds-site/`

Dosyalarında değişiklik yapıp tekrar **Commit changes** dedikçe site
birkaç dakika içinde otomatik güncellenir.
