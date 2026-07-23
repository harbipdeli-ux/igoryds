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

---

## Yılan oyunu liderlik tablosunu aktif etme (opsiyonel ama önerilir)

Sitede bir Yılan (Snake) oyunu var. Oyun Firebase kurulmadan da düzgün
çalışır, ama liderlik tablosu boş kalır ve skorlar kaydedilmez.
Herkesin birbirinin skorunu görebildiği gerçek bir liderlik tablosu için
ücretsiz bir Google Firebase veritabanı kurman gerekiyor. 5 dakika sürer,
kredi kartı istemez.

### 1. Firebase projesi oluştur
1. [console.firebase.google.com](https://console.firebase.google.com) adresine git, Google hesabınla giriş yap.
2. **"Proje ekle"** (Add project) butonuna bas.
3. Bir proje adı yaz (örn. `igoryds-oyun`), **Devam**'a bas.
4. Google Analytics sorulursa **kapatabilirsin** (gerekmiyor), **Proje oluştur**'a bas.

### 2. Realtime Database'i aç
1. Sol menüden **Build → Realtime Database**'e tıkla.
2. **"Veritabanı oluştur"** butonuna bas.
3. Herhangi bir konum seç, devam et.
4. Güvenlik kuralları sorulduğunda **"Test modunda başlat"** seç (bu, herkesin
   okuyup yazabilmesi anlamına gelir — küçük bir kişisel liderlik tablosu için
   sorun değil, ama teoride biri kötüye kullanabilir; canlıya aldıktan sonra
   sorun yaşarsan aşağıdaki "kuralları sıkılaştırma" notuna bak).

### 3. Web uygulaması bilgilerini al
1. Sol üstteki ⚙️ **Proje ayarları**'na tıkla.
2. **Genel** sekmesinde aşağı in, **"Uygulamalarınız"** kısmında **`</>`** (Web) simgesine tıkla.
3. Bir takma ad yaz (örn. `igoryds-site`), **"Uygulamayı kaydet"**'e bas.
4. Karşına çıkan `firebaseConfig = { ... }` bloğunu **tamamen kopyala**.

### 4. Bilgileri script.js'e yapıştır
`script.js` dosyasını aç, en üstlerde şunu bulacaksın:
```js
const firebaseConfig = {
  apiKey: "BURAYA_KENDI_APIKEY_DEGERINI_YAPISTIR",
  authDomain: "BURAYA_YAPISTIR",
  databaseURL: "BURAYA_YAPISTIR",
  projectId: "BURAYA_YAPISTIR",
  storageBucket: "BURAYA_YAPISTIR",
  messagingSenderId: "BURAYA_YAPISTIR",
  appId: "BURAYA_YAPISTIR"
};
```
Bu bloğun tamamını, Firebase'den kopyaladığın gerçek `firebaseConfig` bloğuyla
değiştir. Sonra dosyayı kaydet, GitHub'a tekrar yükle (üzerine yaz).

### 5. Kontrol et
Siteni aç, Yılan'ı oyna, öl, adını yaz, "Skoru Kaydet"e bas. Sayfayı
yenilediğinde skorun liderlik tablosunda görünüyorsa çalışıyor demektir.

### Kuralları sıkılaştırma (opsiyonel, ileride)
"Test modu" 30 gün sonra otomatik olarak herkese kapanır. Süresiz açık
kalması için Realtime Database sayfasında **Rules** sekmesine gidip
şunu yapıştırabilirsin:
```json
{
  "rules": {
    "leaderboard": {
      ".read": true,
      ".write": true
    }
  }
}
```
Bu, sadece `leaderboard` verisini herkese açık bırakır, projenin geri
kalanına erişimi kapatır.
