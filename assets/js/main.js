// ============================================
// 後端 API base
// ============================================
const API_BASE = 'https://douzi-weather.zeabur.app/api/weather';

const CITY_CONFIG = {
  taipei: { label: '台北', path: 'taipei' },
  newtaipei: { label: '新北', path: 'newtaipei' },
  kaohsiung: { label: '高雄', path: 'kaohsiung' },
};

let currentCity = 'taipei';

function getApiUrl(cityKey) {
  const city = CITY_CONFIG[cityKey] || CITY_CONFIG['taipei'];
  return `${API_BASE}/${city.path}`;
}

// ============================================
// 🌞 / 🌙 背景自動切換
// ============================================
function applyDayNightBackground() {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 18) {
    document.body.classList.add('daytime');
    document.body.classList.remove('nighttime');
  } else {
    document.body.classList.add('nighttime');
    document.body.classList.remove('daytime');
  }
}

// ============================================
// 宇宙語錄
// ============================================
const quotes = [
  '你不是走慢，是地心引力特別黏你。',
  '放心，你不是沒效率，你是在宇宙省電模式。',
  '別急，星星也不是每天都亮。',
  '你不是累，你是宇宙快沒電，需要插座。',
  '今天的你沒問題，是這顆星球問題比較多。',
  '你以為你迷路？沒有，你只是自由軌道運行。',
  '連黑洞都會累，你現在這樣很正常。',
  '別覺得進度慢，宇宙膨脹也不急。',
  '今天不想動？我懂，行星也固定在原地。',
  '你不是沒動力，你只是太空船暖機比較久。',
  '別怕，你沒落後，你只是時空差。',
  '累？正常，你正在承載個人宇宙。',
  '你沒有變胖，是宇宙膨脹比你快。',
  '你沒有拖延，你是在等待最好的發射窗口。',
  '別覺得自己渺小，你比五成星星都亮。',
  '你不是搞砸，是宇宙給你加戲。',
  '你很棒，不是我誇張，是宇宙審核通過了。',
  '別慌，你的宇宙 Wi-Fi 就是不穩，重連一下。',
  '你不是沒方向，是宇宙指南針正在更新。',
  '先休息，連彗星都會停一下方向對齊。',
  '你不是故障，你是進入安全模式保護自己。',
  '你哪裡不好了？只有心太善良。',
  '別急著為難自己，宇宙沒在趕你。',
  '你不是選擇障礙，是平行宇宙太多。',
  '你不是沒天份，你只是星塵比較害羞。',
  '別覺得你不配，你是限量版宇宙產物。',
  '你沒有變慢，是時間曲率影響的。',
  '今天心情差？正常，人類情緒比黑洞還深。',
  '你不是懶，是保持能量效率。',
  '你已經夠努力了，不然星星怎麼都站你那邊？',
  '別看低自己，你比你想像的更有引力。',
  '你不是失眠，你的腦在跟宇宙同步時間。',
  '你不是奇怪，你是稀有天體。',
  '每天醒來都這麼可愛？宇宙應該升你等級。',
  '你不是沒用，你是功能太先進，地球規格不支援。',
  '別懷疑，宇宙真的有偷偷偏心你。',
  '你努力的樣子，比流星還可愛。',
  '你現在覺得混亂？星雲就是這樣誕生星星的。',
  '你不是不行，只是今天重力偏強。',
  '心累？正常，星體都有磁暴期。',
  '你不需要比別人強，你本來就很亮。',
  '你現在的步伐剛剛好，宇宙都說 OK。',
];

// ============================================
// 天氣圖示
// ============================================
function getWeatherIcon(weather) {
  if (!weather) return '☀️';
  if (weather.includes('雷')) return '⛈️';
  if (weather.includes('雨')) return '🌧️';
  if (weather.includes('多雲')) return '⛅';
  if (weather.includes('陰')) return '☁️';
  if (weather.includes('晴')) return '☀️';
  return '☀️';
}

// ============================================
// 建議邏輯
// ============================================
function getAdvice(rainProb, maxTemp) {
  const rainNumber = parseInt(rainProb, 10);
  const maxNumber = parseInt(maxTemp, 10);

  let rainIcon = '🪐';
  let rainText = '太空氣象良好';

  if (!isNaN(rainNumber) && rainNumber > 30) {
    rainIcon = '🌧️';
    rainText = '可能有宇宙降水';
  }

  let clothIcon = '👩‍🚀';
  let clothText = '艙內體感舒適';

  if (!isNaN(maxNumber) && maxNumber >= 28) {
    clothIcon = '☀️';
    clothText = '適合清爽輕裝';
  } else if (!isNaN(maxNumber) && maxNumber <= 20) {
    clothIcon = '🧥';
    clothText = '外套可以準備好';
  }

  return { rainIcon, rainText, clothIcon, clothText };
}

// ============================================
// 時段文字
// ============================================
function getTimePeriod(startTime) {
  const hour = new Date(startTime).getHours();
  if (hour >= 5 && hour < 11) return '晨光';
  if (hour >= 11 && hour < 14) return '白晝';
  if (hour >= 14 && hour < 18) return '午後';
  if (hour >= 18 && hour < 23) return '夜晚';
  return '深夜';
}

// ============================================
// 畫面渲染
// ============================================
function renderWeather(data) {
  const forecasts = data.forecasts || [];
  if (!forecasts.length) return;

  const current = forecasts[0];
  const others = forecasts.slice(1);

  const max = parseInt(current.maxTemp, 10);
  const min = parseInt(current.minTemp, 10);

  let avgTemp = '--';
  if (!isNaN(max) && !isNaN(min)) {
    avgTemp = Math.round((max + min) / 2);
  } else if (!isNaNaN(max)) {
    avgTemp = max;
  } else if (!isNaN(min)) {
    avgTemp = min;
  }

  const advice = getAdvice(current.rain, current.maxTemp);
  const period = getTimePeriod(current.startTime);

  // 更新城市泡泡
  document.getElementById('locationPill').textContent = CITY_CONFIG[currentCity].label;

  // 主卡片
  document.getElementById('heroCard').innerHTML = `
      <div class="hero-card">
        <div class="hero-period">${period}</div>

        <div class="hero-temp-container">
          <div class="hero-icon">${getWeatherIcon(current.weather)}</div>
          <div class="hero-temp">${avgTemp}°</div>
        </div>

        <div class="hero-desc">${current.weather}</div>

        <div class="advice-grid">
          <div class="advice-item">
            <div class="advice-icon">${advice.rainIcon}</div>
            <div class="advice-text">${advice.rainText}</div>
            <div class="advice-sub">降雨率 ${current.rain}</div>
          </div>
          <div class="advice-item">
            <div class="advice-icon">${advice.clothIcon}</div>
            <div class="advice-text">${advice.clothText}</div>
            <div class="advice-sub">最高溫 ${current.maxTemp}</div>
          </div>
        </div>
      </div>
    `;

  // 下方預報
  const container = document.getElementById('futureForecasts');
  container.innerHTML = '';

  const todayDate = new Date().getDate();

  others.forEach((f) => {
    let p = getTimePeriod(f.startTime);
    const d = new Date(f.startTime);
    if (d.getDate() !== todayDate) p = '明天' + p;

    container.innerHTML += `
        <div class="mini-card">
          <div class="mini-time">${p}</div>
          <div class="mini-icon">${getWeatherIcon(f.weather)}</div>
          <div class="mini-temp">${f.minTemp}° - ${f.maxTemp}</div>
          <div class="mini-rain">💧 ${f.rain}</div>
        </div>
      `;
  });

  // 宇宙語錄
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
  container.innerHTML += `
      <div class="mini-card quote-card">
        <div class="mini-time">🌠 宇宙語錄</div>
        <div class="quote-text">${randomQuote}</div>
      </div>
    `;

  // ============================================
  // ⏰ 更新時間（加入：21:46）
  // ============================================
  const now = new Date();
  const m = now.getMonth() + 1;
  const d = now.getDate();
  const wdEN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  let hh = now.getHours().toString().padStart(2, '0');
  let mm = now.getMinutes().toString().padStart(2, '0');

  document.getElementById('updateTime').textContent = `${m}/${d} ${wdEN[now.getDay()]} ${hh}:${mm}`;
}

// ============================================
// 取得天氣
// ============================================
async function fetchWeather(cityKey = currentCity, options = { showLoading: false }) {
  try {
    currentCity = cityKey;

    if (options.showLoading) {
      document.getElementById('loading').style.display = 'flex';
      document.getElementById('mainContent').style.display = 'none';
    } else {
      document.getElementById('updateTime').textContent = '更新中...';
    }

    const apiUrl = getApiUrl(cityKey);

    const delay = new Promise((r) => setTimeout(r, options.showLoading ? 1200 : 400));
    const fetcher = fetch(apiUrl).then((res) => res.json());

    const [, json] = await Promise.all([delay, fetcher]);

    if (json.success) {
      renderWeather(json.data);

      document.getElementById('loading').style.display = 'none';
      document.getElementById('mainContent').style.display = 'block';
    } else {
      throw new Error('API Error');
    }
  } catch (e) {
    console.error(e);
    alert('宇宙訊號被太陽風打斷了！');
  }
}

// ============================================
// 城市 Tab 切換
// ============================================
function setupCityTabs() {
  const tabs = document.querySelectorAll('.city-tab');

  tabs.forEach((btn) => {
    btn.addEventListener('click', () => {
      const city = btn.dataset.city;
      if (city === currentCity) return;

      tabs.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      fetchWeather(city, { showLoading: false });
    });
  });
}

// ============================================
// 初始化
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  // 先套用日夜背景
  applyDayNightBackground();

  // 監聽 Loading 結束後再套一次（避免 Loading 覆蓋掉）
  const observer = new MutationObserver(() => {
    if (document.getElementById('mainContent').style.display === 'block') {
      applyDayNightBackground();
      observer.disconnect();
    }
  });
  observer.observe(document.getElementById('mainContent'), { attributes: true });

  setupCityTabs();
  fetchWeather('taipei', { showLoading: true });
});
