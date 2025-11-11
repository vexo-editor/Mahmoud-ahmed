// ==================== MENU TOGGLE ====================
const menuIcon = document.querySelector('#menu-icon');
const navbar = document.querySelector('.navbar');

menuIcon.addEventListener('click', () => {
  navbar.classList.toggle('active');
  menuIcon.classList.toggle('bx-x'); // لو بتستخدم أيقونة من boxicons
});

// ==================== CLOSE MENU WHEN LINK CLICKED ====================
document.querySelectorAll('.navbar a').forEach(link => {
  link.addEventListener('click', () => {
    navbar.classList.remove('active');
    menuIcon.classList.remove('bx-x');
  });
});

// ==================== CHANGE HEADER BACKGROUND ON SCROLL ====================
window.addEventListener('scroll', () => {
  const header = document.querySelector('.header');
  if (window.scrollY > 50) {
    header.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
  } else {
    header.style.backgroundColor = "rgba(0, 0, 0, 0.3)";
  }
});


  const cards = document.querySelectorAll('.testimonial-card');

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.2 }
  );

  cards.forEach(card => observer.observe(card));

(async function () {
  // الدول الغنية
  const RICH_COUNTRIES = new Set([
    "SA","AE","QA","KW","BH","OM",
    "US","GB","DE","FR","NL","SE","NO","DK","FI","CH",
    "AT","BE","IE","IT","ES","PT","AU","NZ","CA","SG","HK","KR","JP"
  ]);

  // الأسعار الأصلية بالجنيه المصري
  const PRICES_POOR_EGP  = { pro: 1300, plus: 2700, premium: 5500 };
  const PRICES_RICH_EGP  = { pro: 2600, plus: 5400, premium: 11000 };

  // العملة حسب الدولة
  const COUNTRY_TO_CCY = {
    EG:"EGP", SA:"SAR", AE:"AED", QA:"QAR", KW:"KWD", BH:"BHD", OM:"OMR",
    US:"USD", GB:"GBP", DE:"EUR", FR:"EUR", NL:"EUR", IT:"EUR", ES:"EUR",
    PT:"EUR", AT:"EUR", BE:"EUR", IE:"EUR", FI:"EUR",
    CH:"CHF", SE:"SEK", NO:"NOK", DK:"DKK",
    AU:"AUD", NZ:"NZD", CA:"CAD",
    SG:"SGD", HK:"HKD", KR:"KRW", JP:"JPY"
  };

  // دالة اكتشاف الدولة بمصدرين
  async function detectCountryISO2() {
    try {
      const res = await fetch("https://ipapi.co/json/");
      const data = await res.json();
      if (data && data.country) return data.country;
    } catch {}
    try {
      const res2 = await fetch("https://ipwho.is/");
      const data2 = await res2.json();
      if (data2 && data2.country_code) return data2.country_code;
    } catch {}
    return "US"; // fallback
  }

  // جلب سعر الصرف من API
  async function getRate(from, to) {
    if (from === to) return 1;
    const urls = [
      `https://api.exchangerate.host/convert?from=${from}&to=${to}`,
      `https://open.er-api.com/v6/latest/${from}`
    ];
    for (const url of urls) {
      try {
        const res = await fetch(url);
        const data = await res.json();
        if (data && data.result && data.result > 0) return data.result;
        if (data && data.rates && typeof data.rates[to] === "number") return data.rates[to];
      } catch {}
    }
    return 1; // fallback
  }

  // تنسيق الرقم + رمز العملة
  function fmt(amount, ccy) {
    try {
      const lang = (document.documentElement.lang || navigator.language || 'en');
      return new Intl.NumberFormat(lang, { style: 'currency', currency: ccy, maximumFractionDigits: 0 }).format(amount);
    } catch {
      return `${amount.toFixed(0)} ${ccy}`;
    }
  }

  const iso2 = await detectCountryISO2();
  const isRich = RICH_COUNTRIES.has(iso2);
  const targetCcy = COUNTRY_TO_CCY[iso2] || "USD";

  const basePrices = isRich ? PRICES_RICH_EGP : PRICES_POOR_EGP;
  const rate = await getRate("EGP", targetCcy);

  const planMap = {
    pro: basePrices.pro * rate,
    plus: basePrices.plus * rate,
    premium: basePrices.premium * rate
  };

  document.querySelectorAll(".plan-card").forEach(card => {
    const name = (card.querySelector(".plan-name")?.textContent || "").toLowerCase();
    const priceEl = card.querySelector(".plan-price");
    if (!priceEl) return;

    if (name.includes("pro")) {
      priceEl.textContent = fmt(planMap.pro, targetCcy);
    } else if (name.includes("plus")) {
      priceEl.textContent = fmt(planMap.plus, targetCcy);
    } else if (name.includes("premium")) {
      priceEl.textContent = fmt(planMap.premium, targetCcy);
    }
  });
})();
