const icon = document.getElementById("appIcon");
const startButton = document.getElementById("startButton");
const appShell = document.getElementById("appShell");
const pageTrack = document.getElementById("pageTrack");
const signupForm = document.getElementById("signupForm");
const jumpLinks = document.querySelectorAll("[data-target-page]");
const pages = document.querySelectorAll(".page");

const pageStorageKey = "agrolink_active_page";

const getNavigationType = () => {
  if (typeof performance === "undefined" || typeof performance.getEntriesByType !== "function") {
    return "navigate";
  }

  const navigationEntry = performance.getEntriesByType("navigation")[0];
  return navigationEntry?.type || "navigate";
};

const shouldRestorePage = getNavigationType() === "reload";

const readStoredPage = () => {
  const storedValue = Number(localStorage.getItem(pageStorageKey));
  return Number.isInteger(storedValue) && storedValue >= 0 && storedValue < pageCount ? storedValue : 0;
};

let activePage = 0;
let touchStartX = 0;
let touchDeltaX = 0;

const pageCount = 11;

activePage = shouldRestorePage ? readStoredPage() : 0;

if (!shouldRestorePage) {
  localStorage.setItem(pageStorageKey, String(activePage));
}

const setActivePageState = () => {
  pages.forEach((page, index) => {
    page.classList.toggle("active", index === activePage);
  });
};

const goToPage = (index, options = {}) => {
  const targetPage = Math.max(0, Math.min(index, pageCount - 1));
  const jumpDistance = Math.abs(targetPage - activePage);
  const shouldJumpInstantly = Boolean(options.instant) || jumpDistance > 1;

  activePage = targetPage;
  localStorage.setItem(pageStorageKey, String(activePage));

  if (shouldJumpInstantly && pageTrack) {
    const previousTransition = pageTrack.style.transition;
    pageTrack.style.transition = "none";
    pageTrack.style.transform = `translateX(-${activePage * 100}vw)`;
    // Force reflow so the browser applies the transform without animation.
    void pageTrack.offsetHeight;
    pageTrack.style.transition = previousTransition || "transform 420ms ease";
  } else if (pageTrack) {
    pageTrack.style.transform = `translateX(-${activePage * 100}vw)`;
  }

  setActivePageState();
};

let rotation = 0;

const animateIcon = () => {
  rotation += 0.2;
  const bob = Math.sin(rotation / 8) * 4;
  icon.style.transform = `translateY(${bob}px)`;
  requestAnimationFrame(animateIcon);
};

if (icon) {
  requestAnimationFrame(animateIcon);
}

if (startButton) {
  startButton.addEventListener("click", () => {
    goToPage(1);
    startButton.classList.remove("enter");
    // Restarting the animation class makes each click feel responsive.
    requestAnimationFrame(() => {
      startButton.classList.add("enter");
    });
  });
}

if (signupForm) {
  signupForm.addEventListener("submit", (event) => {
    event.preventDefault();
    goToPage(2);
  });
}

const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    goToPage(3);
  });
}

// Language Selection Logic
const languageChips = document.querySelectorAll(".language-chip");
const languageProceedBtn = document.getElementById("languageProceedBtn");
const selectedLanguageName = document.getElementById("selectedLanguageName");
const languageSearch = document.getElementById("languageSearch");

const languageCodeMap = {
  english: "en",
  hindi: "hi",
  gujarati: "gu",
  tamil: "ta",
  kannada: "kn",
  telugu: "te",
  malayalam: "ml",
  marathi: "mr",
  punjabi: "pa",
  bengali: "bn",
  assamese: "as",
  manipuri: "mni-Mtei",
  urdu: "ur",
  khasi: "en",
  odia: "or",
};

const EN_DASHBOARD_TEXTS = {
  dashboardTier: "Free Subscriber",
  drawerMenuTitle: "Menu",
  drawerMyProfile: "My Profile",
  drawerFarmSettings: "Farm Settings",
  drawerSavedReports: "Saved Reports",
  drawerLanguage: "Language",
  dashboardSearchPlaceholder: "Search crops, prices, posts, products",
  quickActionsTitle: "Quick Actions",
  quickCropManagement: "Crop Management",
  quickMarketAdvisory: "Market Advisory",
  quickAgriDealers: "Agri Dealers",
  quickAgriProducts: "Ag Products",
  quickEquipmentRentals: "Equipment Rentals",
  quickPesticideProducts: "Pesticide Products",
  liveNotificationsTitle: "Live Notifications",
  notificationSubtitle: "Latest happenings..",
  notificationNone: "No live agriculture alerts found right now.",
  notificationNoDetails: "No details available.",
  notificationAutoRefresh: "Auto-refresh every 5-10 minutes. Next update in {minutes} min.",
  notificationRefreshing: "Refreshing agriculture feed from backend...",
  notificationUpdatedAt: "Live feed updated at {time} ({source}).",
  notificationShowingSaved: "Showing last saved feed. Will retry automatically.",
  notificationShowingOffline: "Showing offline agriculture tips. Will retry automatically.",
  notificationLoadingTitle: "Loading agriculture updates...",
  notificationLoadingDescription: "Fetching weather, crop disease, and mandi price alerts.",
  notificationConnecting: "Connecting to agriculture news sources...",
  mandiPricesTitle: "Mandi Prices",
  chartNote: "Chart updates automatically from your entered mandi prices.",
  cropNamePlaceholder: "Crop name",
  marketPlaceholder: "Market or district",
  maxPricePlaceholder: "Max price",
  avgPricePlaceholder: "Avg price",
  addPriceCardBtn: "Add Price Card",
  emptyPriceCards: "No price cards yet. Add your first crop price.",
  communityUpdatesTitle: "Community Updates",
  postTitlePlaceholder: "Post title",
  postLocationPlaceholder: "Village or area",
  postStagePlaceholder: "Stage (example: Flowering)",
  postTextPlaceholder: "What happened in your farm?",
  publishUpdateBtn: "Publish Update",
  emptyCommunityUpdates: "No community updates yet. Share the first update.",
  trendingProductsTitle: "Trending Products",
  productNamePlaceholder: "Product name",
  productTypePlaceholder: "Category",
  productPricePlaceholder: "Price",
  productImageUrlPlaceholder: "Product image URL (optional)",
  addProductBtn: "Add Product",
  emptyProducts: "No products yet. Add the first product card.",
  aboutSupportTitle: "About and Support",
  supportAboutUs: "About Us",
  supportContactUs: "Contact Us",
  supportFeedback: "Feedback",
  supportNotifications: "Notifications",
  navCropInfo: "Crop Info",
  navAdvisory: "Advisory",
  navPesticides: "Pesticides",
  navAgriForum: "Agri Forum",
  navCommunity: "Community",
  categoryWeather: "weather",
  categoryDisease: "disease",
  categoryPrice: "price",
  categoryAgriUpdate: "agri update",
};

let dashboardTextMap = { ...EN_DASHBOARD_TEXTS };

const formatDashboardText = (key, values = {}) => {
  const template = dashboardTextMap[key] || EN_DASHBOARD_TEXTS[key] || key;
  return Object.keys(values).reduce((acc, token) => {
    return acc.replaceAll(`{${token}}`, String(values[token]));
  }, template);
};

const applyDashboardLanguageToDOM = () => {
  document.querySelectorAll("[data-i18n]").forEach((node) => {
    const key = node.getAttribute("data-i18n");
    if (key) {
      node.textContent = formatDashboardText(key);
    }
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((node) => {
    const key = node.getAttribute("data-i18n-placeholder");
    if (key) {
      node.setAttribute("placeholder", formatDashboardText(key));
    }
  });
};

const loadDashboardLanguagePack = async () => {
  const langCode = getSelectedLanguageCode();
  if (langCode === "en") {
    dashboardTextMap = { ...EN_DASHBOARD_TEXTS };
    applyDashboardLanguageToDOM();
    return;
  }

  try {
    const response = await fetch(`/api/dashboard-texts?lang=${encodeURIComponent(langCode)}&t=${Date.now()}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("dashboard language fetch failed");
    }

    const payload = await response.json();
    if (!payload || typeof payload.texts !== "object") {
      throw new Error("invalid dashboard language payload");
    }

    dashboardTextMap = { ...EN_DASHBOARD_TEXTS, ...payload.texts };
  } catch {
    dashboardTextMap = { ...EN_DASHBOARD_TEXTS };
  }

  applyDashboardLanguageToDOM();
};

const languageStorageKey = "agrolink_selected_language";
let selectedLanguage = localStorage.getItem(languageStorageKey) || null;

const getSelectedLanguageCode = () => languageCodeMap[selectedLanguage] || "en";

const updateSelectedLanguageUI = () => {
  if (!selectedLanguageName) {
    return;
  }

  const matchedChip = Array.from(languageChips).find((chip) => chip.dataset.language === selectedLanguage);
  if (matchedChip) {
    selectedLanguageName.textContent = matchedChip.textContent;
    if (languageProceedBtn) {
      languageProceedBtn.disabled = false;
    }

    languageChips.forEach((chip) => {
      chip.classList.toggle("selected", chip === matchedChip);
    });
  } else {
    selectedLanguageName.textContent = "None";
  }
};

languageChips.forEach((chip) => {
  chip.addEventListener("click", () => {
    // Remove active class from previously selected chip
    languageChips.forEach((c) => c.classList.remove("selected"));
    
    // Add active class to clicked chip
    chip.classList.add("selected");
    
    // Store selected language
    selectedLanguage = chip.dataset.language;
    localStorage.setItem(languageStorageKey, selectedLanguage);
    selectedLanguageName.textContent = chip.textContent;
    
    // Enable proceed button
    languageProceedBtn.disabled = false;
    
    // Add animation bounce
    chip.classList.add("bounce");
    setTimeout(() => chip.classList.remove("bounce"), 600);

    if (activePage === 4) {
      loadDashboardLanguagePack();
      renderDashboardData();
      refreshLiveNotifications();
    }
  });
});

// Language Search Functionality
if (languageSearch) {
  languageSearch.addEventListener("input", (e) => {
    const searchTerm = e.target.value.toLowerCase();
    
    languageChips.forEach((chip) => {
      const languageName = chip.textContent.toLowerCase();
      const languageData = chip.dataset.language.toLowerCase();
      
      if (languageName.includes(searchTerm) || languageData.includes(searchTerm)) {
        chip.style.display = "block";
        chip.classList.add("fadeInChip");
      } else {
        chip.style.display = "none";
        chip.classList.remove("fadeInChip");
      }
    });
  });
}

updateSelectedLanguageUI();

if (selectedLanguage) {
  loadDashboardLanguagePack();
}

// Proceed button functionality
if (languageProceedBtn) {
  languageProceedBtn.addEventListener("click", async () => {
    if (!selectedLanguage) {
      return;
    }

    languageProceedBtn.disabled = true;
    goToPage(4);
    await bootstrapDashboard();
    languageProceedBtn.disabled = false;
  });
}

// Dashboard Logic
const dashboardMenuBtn = document.getElementById("dashboardMenuBtn");
const dashboardDrawer = document.getElementById("dashboardDrawer");
const dashboardDrawerClose = document.getElementById("dashboardDrawerClose");
const dashboardDrawerOverlay = document.getElementById("dashboardDrawerOverlay");
const dashboardSearch = document.getElementById("dashboardSearch");
const bottomNavItems = document.querySelectorAll(".bottom-nav-item");
const notificationList = document.getElementById("notificationList");
const notificationUpdateMeta = document.getElementById("notificationUpdateMeta");

const priceForm = document.getElementById("priceForm");
const postForm = document.getElementById("postForm");
const productForm = document.getElementById("productForm");
const priceChart = document.getElementById("priceChart");

const priceList = document.getElementById("priceList");
const postList = document.getElementById("postList");
const productList = document.getElementById("productList");
const productImageFileInput = document.getElementById("productImageFileInput");
const cropManagementTile = document.getElementById("cropManagementTile");
const marketAdvisoryTile = document.getElementById("marketAdvisoryTile");
const agriDealersTile = document.getElementById("agriDealersTile");
const agProductsTile = document.getElementById("agProductsTile");
const equipmentRentalsTile = document.getElementById("equipmentRentalsTile");
const cropManagementBackBtn = document.getElementById("cropManagementBackBtn");
const goToCropSelectionBtn = document.getElementById("goToCropSelectionBtn");
const cropSelectBackBtn = document.getElementById("cropSelectBackBtn");
const cropSelectionList = document.getElementById("cropSelectionList");
const cropSearchInput = document.getElementById("cropSearchInput");
const addedCropsList = document.getElementById("addedCropsList");
const addedCropCount = document.getElementById("addedCropCount");
const cropModal = document.getElementById("cropModal");
const cropModalBackdrop = document.getElementById("cropModalBackdrop");
const cropModalClose = document.getElementById("cropModalClose");
const cropModalForm = document.getElementById("cropModalForm");
const selectedCropName = document.getElementById("selectedCropName");
const cultivationTypeInput = document.getElementById("cultivationTypeInput");
const cultivationYearInput = document.getElementById("cultivationYearInput");
const cultivationAreaInput = document.getElementById("cultivationAreaInput");
const marketAdvisoryBackBtn = document.getElementById("marketAdvisoryBackBtn");
const marketStateSelect = document.getElementById("marketStateSelect");
const marketCropSelect = document.getElementById("marketCropSelect");
const marketDateText = document.getElementById("marketDateText");
const districtPriceList = document.getElementById("districtPriceList");
const locationPriceValue = document.getElementById("locationPriceValue");
const locationPriceMeta = document.getElementById("locationPriceMeta");
const marketTrendChart = document.getElementById("marketTrendChart");
const bestSellTimeText = document.getElementById("bestSellTimeText");
const nearbyMandisList = document.getElementById("nearbyMandisList");
const agriDealersBackBtn = document.getElementById("agriDealersBackBtn");
const agriDealersRefreshBtn = document.getElementById("agriDealersRefreshBtn");
const nearestDealerSummary = document.getElementById("nearestDealerSummary");
const nearestDealerDetail = document.getElementById("nearestDealerDetail");
const dealerMapFrame = document.getElementById("dealerMapFrame");
const dealerOpenMapBtn = document.getElementById("dealerOpenMapBtn");
const dealersList = document.getElementById("dealersList");
const dealerSearchInput = document.getElementById("dealerSearchInput");
const agProductsBackBtn = document.getElementById("agProductsBackBtn");
const agProductsRefreshBtn = document.getElementById("agProductsRefreshBtn");
const agProductsCategoryTabs = document.getElementById("agProductsCategoryTabs");
const agProductsSearch = document.getElementById("agProductsSearch");
const agProductsCount = document.getElementById("agProductsCount");
const agProductsList = document.getElementById("agProductsList");
const equipmentRentalsBackBtn = document.getElementById("equipmentRentalsBackBtn");
const equipmentRentalsRefreshBtn = document.getElementById("equipmentRentalsRefreshBtn");
const rentalsLocationText = document.getElementById("rentalsLocationText");
const rentalsChangeLocationBtn = document.getElementById("rentalsChangeLocationBtn");
const rentalsToggleWrap = document.getElementById("rentalsToggleWrap");
const rentalsMetaText = document.getElementById("rentalsMetaText");
const rentalsList = document.getElementById("rentalsList");

let dashboardBootstrapped = false;

const bootstrapDashboard = async () => {
  if (dashboardBootstrapped) {
    return;
  }

  dashboardBootstrapped = true;
  await loadDashboardLanguagePack();
  initDashboardData();
  initLiveNotifications();
};

const toggleDrawer = (isOpen) => {
  if (!dashboardDrawer || !dashboardDrawerOverlay) {
    return;
  }

  dashboardDrawer.classList.toggle("open", isOpen);
  dashboardDrawerOverlay.classList.toggle("visible", isOpen);
};

if (dashboardMenuBtn) {
  dashboardMenuBtn.addEventListener("click", () => toggleDrawer(true));
}

if (dashboardDrawerClose) {
  dashboardDrawerClose.addEventListener("click", () => toggleDrawer(false));
}

if (dashboardDrawerOverlay) {
  dashboardDrawerOverlay.addEventListener("click", () => toggleDrawer(false));
}

const clearEmptyNote = (container) => {
  const emptyNode = container.querySelector(".empty-note");
  if (emptyNode) {
    emptyNode.remove();
  }
};

const storageKeys = {
  prices: "agrolink_dashboard_prices",
  posts: "agrolink_dashboard_posts",
  products: "agrolink_dashboard_products",
  notifications: "agrolink_live_notifications",
  crops: "agrolink_added_crops",
  agProductQuantities: "agrolink_ag_product_quantities",
};

const dashboardData = {
  prices: [],
  posts: [],
  products: [],
  crops: [],
};

const cropCatalog = [
  "Brinjal",
  "Chillies",
  "Citrus",
  "Cotton",
  "Groundnut",
  "Mango",
  "Okra",
  "Paddy",
  "Pomegranate",
  "Banana",
  "Tomato",
  "Onion",
  "Potato",
  "Maize",
  "Wheat",
  "Sugarcane",
  "Turmeric",
  "Ginger",
  "Soybean",
  "Sunflower",
  "Sesame",
  "Millet",
  "Ragi",
  "Green Gram",
  "Black Gram",
  "Cabbage",
  "Cauliflower",
  "Carrot",
  "Papaya",
  "Guava",
];

let activeSelectedCrop = "";
let userCoordinates = null;

const INDIA_STATES_28 = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];

const STATE_CENTROIDS = {
  "Andhra Pradesh": { lat: 15.91, lon: 79.74 },
  "Arunachal Pradesh": { lat: 28.21, lon: 94.73 },
  Assam: { lat: 26.2, lon: 92.93 },
  Bihar: { lat: 25.1, lon: 85.31 },
  Chhattisgarh: { lat: 21.28, lon: 81.86 },
  Goa: { lat: 15.49, lon: 73.83 },
  Gujarat: { lat: 22.26, lon: 71.19 },
  Haryana: { lat: 29.06, lon: 76.09 },
  "Himachal Pradesh": { lat: 31.1, lon: 77.17 },
  Jharkhand: { lat: 23.61, lon: 85.28 },
  Karnataka: { lat: 15.32, lon: 75.71 },
  Kerala: { lat: 10.85, lon: 76.27 },
  "Madhya Pradesh": { lat: 22.97, lon: 78.65 },
  Maharashtra: { lat: 19.75, lon: 75.71 },
  Manipur: { lat: 24.66, lon: 93.91 },
  Meghalaya: { lat: 25.47, lon: 91.37 },
  Mizoram: { lat: 23.16, lon: 92.94 },
  Nagaland: { lat: 26.16, lon: 94.56 },
  Odisha: { lat: 20.95, lon: 85.09 },
  Punjab: { lat: 31.15, lon: 75.34 },
  Rajasthan: { lat: 27.02, lon: 74.22 },
  Sikkim: { lat: 27.53, lon: 88.51 },
  "Tamil Nadu": { lat: 11.13, lon: 78.66 },
  Telangana: { lat: 17.12, lon: 79.21 },
  Tripura: { lat: 23.94, lon: 91.99 },
  "Uttar Pradesh": { lat: 26.85, lon: 80.95 },
  Uttarakhand: { lat: 30.07, lon: 79.01 },
  "West Bengal": { lat: 22.99, lon: 87.85 },
};

const MARKET_CROPS_30 = cropCatalog.slice(0, 30);
const DISTRICT_TAGS = ["Central", "North", "South", "East", "West", "Rural"];
const DISTRICT_OFFSETS = [
  { lat: 0, lon: 0 },
  { lat: 0.35, lon: -0.28 },
  { lat: -0.3, lon: 0.32 },
  { lat: 0.22, lon: 0.26 },
  { lat: -0.24, lon: -0.3 },
  { lat: 0.42, lon: 0.08 },
];
const SELL_ADVICE_POOL = [
  "Best selling window: early morning auction session over next 2-3 days.",
  "Best selling window: prices likely to peak in next 5 days for grade-A lots.",
  "Best selling window: hold for 1-2 days if storage quality is stable.",
  "Best selling window: afternoon lots are currently drawing stronger bids.",
];

const seedFrom = (text) => {
  return String(text)
    .split("")
    .reduce((acc, char, idx) => acc + char.charCodeAt(0) * (idx + 3), 37);
};

const seededBetween = (seed, min, max) => {
  const range = max - min + 1;
  return min + (Math.abs(seed) % range);
};

const buildTrendPoints = (baseAvg, seed) => {
  const values = [];
  let current = Math.max(baseAvg - seededBetween(seed, 120, 260), 600);

  for (let i = 0; i < 7; i += 1) {
    const drift = seededBetween(seed + i * 17, -45, 95);
    current = Math.max(500, current + drift);
    values.push(Math.round(current));
  }

  return values;
};

const buildCropBasePrice = (cropName, stateName) => {
  const seed = seedFrom(`${cropName}-${stateName}`);
  return seededBetween(seed, 1600, 12800);
};

const buildMarketPayload = (stateName, cropName) => {
  const center = STATE_CENTROIDS[stateName] || { lat: 21.0, lon: 78.0 };
  const basePrice = buildCropBasePrice(cropName, stateName);
  const seed = seedFrom(`${stateName}:${cropName}`);

  const districts = DISTRICT_TAGS.map((tag, index) => {
    const districtSeed = seed + (index + 1) * 101;
    const avg = basePrice + seededBetween(districtSeed, -380, 520);
    const min = Math.max(500, avg - seededBetween(districtSeed + 7, 80, 220));
    const max = avg + seededBetween(districtSeed + 13, 110, 320);
    const arrivals = seededBetween(districtSeed + 19, 60, 320);
    const offset = DISTRICT_OFFSETS[index];

    return {
      district: `${stateName.split(" ")[0]} ${tag}`,
      arrivals,
      min,
      avg,
      max,
      lat: center.lat + offset.lat,
      lon: center.lon + offset.lon,
      trend: buildTrendPoints(avg, districtSeed),
    };
  });

  const mandis = districts.slice(0, 4).map((item, idx) => `${item.district} ${idx + 1} Mandi`);

  return {
    sellAdvice: SELL_ADVICE_POOL[seededBetween(seed, 0, SELL_ADVICE_POOL.length - 1)],
    districts,
    mandis,
  };
};

const MARKET_DATA = INDIA_STATES_28.reduce((acc, stateName) => {
  acc[stateName] = MARKET_CROPS_30.reduce((cropAcc, cropName) => {
    cropAcc[cropName] = buildMarketPayload(stateName, cropName);
    return cropAcc;
  }, {});
  return acc;
}, {});

const AGRO_DEALERS_MASTER = [
  {
    name: "GreenLeaf Fertilizers & Seeds",
    type: "Fertilizer, Seeds",
    phone: "+91 98765 43210",
    district: "Khammam",
    lat: 17.2473,
    lon: 80.1514,
    rating: 4.7,
    reviews: 186,
    reviewQuote: "Good stock and quick farmer support.",
    openNow: true,
  },
  {
    name: "Sri Lakshmi Agro Needs",
    type: "Pesticides, Micronutrients",
    phone: "+91 98490 11223",
    district: "Warangal",
    lat: 17.9689,
    lon: 79.5941,
    rating: 4.5,
    reviews: 142,
    reviewQuote: "Genuine products and fair pricing.",
    openNow: true,
  },
  {
    name: "FarmCare Retail Hub",
    type: "Farm Inputs, Tools",
    phone: "+91 90101 22334",
    district: "Nizamabad",
    lat: 18.6725,
    lon: 78.0941,
    rating: 4.4,
    reviews: 96,
    reviewQuote: "Helpful staff for spray schedules.",
    openNow: true,
  },
  {
    name: "Rythu Agro Mart",
    type: "Fertilizer, Bio Inputs",
    phone: "+91 96767 88990",
    district: "Karimnagar",
    lat: 18.4386,
    lon: 79.1288,
    rating: 4.3,
    reviews: 118,
    reviewQuote: "Strong range of organic options.",
    openNow: false,
  },
  {
    name: "AgriTrust Crop Clinic",
    type: "Crop Advisory, Pesticides",
    phone: "+91 93939 55566",
    district: "Guntur",
    lat: 16.3067,
    lon: 80.4365,
    rating: 4.8,
    reviews: 224,
    reviewQuote: "Best diagnosis and timely medicine.",
    openNow: true,
  },
  {
    name: "Kisan Connect Point",
    type: "Seeds, Implements",
    phone: "+91 97000 66778",
    district: "Davanagere",
    lat: 14.4644,
    lon: 75.9218,
    rating: 4.2,
    reviews: 83,
    reviewQuote: "Budget-friendly with decent service.",
    openNow: true,
  },
];

let dealersViewData = [];
let activeDealerForMap = null;
let activeAgProductsCategory = "all";
let agProductQtyMap = {};
let rentalsFilterMode = "nearby";
let manualRentalLocationIndex = 0;

const MANUAL_RENTAL_LOCATIONS = [
  { name: "Bengaluru", lat: 12.9716, lon: 77.5946 },
  { name: "Hyderabad", lat: 17.385, lon: 78.4867 },
  { name: "Nashik", lat: 19.9975, lon: 73.7898 },
];

const EQUIPMENT_RENTALS_CATALOG = [
  { name: "John Deere Tractor 45HP", type: "Tractor", mode: "hour", price: 500, lat: 12.998, lon: 77.605, place: "Yelahanka, Bengaluru", available: true },
  { name: "Sonalika Tractor 60HP", type: "Tractor", mode: "day", price: 3800, lat: 12.89, lon: 77.58, place: "Kanakapura Road, Bengaluru", available: true },
  { name: "Combine Harvester CX", type: "Harvester", mode: "day", price: 7200, lat: 13.04, lon: 77.53, place: "Hesaraghatta, Bengaluru", available: false },
  { name: "Rice Harvester Pro", type: "Harvester", mode: "hour", price: 900, lat: 17.42, lon: 78.43, place: "Shamshabad, Hyderabad", available: true },
  { name: "Rotavator Heavy Duty", type: "Tool", mode: "hour", price: 250, lat: 17.33, lon: 78.52, place: "Medchal, Hyderabad", available: true },
  { name: "Seed Drill Automatic", type: "Tool", mode: "day", price: 1600, lat: 20.02, lon: 73.78, place: "Sinnar, Nashik", available: true },
  { name: "Mini Tractor 30HP", type: "Tractor", mode: "hour", price: 360, lat: 20.06, lon: 73.82, place: "Panchavati, Nashik", available: false },
  { name: "Boom Sprayer 600L", type: "Tool", mode: "day", price: 1400, lat: 16.5, lon: 80.64, place: "Vijayawada", available: true },
  { name: "Forage Harvester", type: "Harvester", mode: "day", price: 6900, lat: 18.53, lon: 73.85, place: "Hinjewadi, Pune", available: true },
];

const AG_PRODUCTS_CATALOG = [
  { name: "Hybrid Tomato Seeds", price: 120, unit: "packet", family: "seeds", tags: ["hybrid"], seller: "SeedKart Agro", imageUrl: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=1200&q=80" },
  { name: "Organic Paddy Seeds", price: 95, unit: "kg", family: "seeds", tags: ["organic"], seller: "Rythu Seeds Center", imageUrl: "https://images.unsplash.com/photo-1536640712-4d4c36ff0e4e?auto=format&fit=crop&w=1200&q=80" },
  { name: "Groundnut Seed Premium", price: 140, unit: "kg", family: "seeds", tags: ["hybrid"], seller: "FarmCare Inputs", imageUrl: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=1200&q=80" },
  { name: "Bio Compost Granules", price: 280, unit: "bag", family: "fertilizers", tags: ["organic"], seller: "GreenGold Organics", imageUrl: "https://images.unsplash.com/photo-1622383563227-04401ab4e5ea?auto=format&fit=crop&w=1200&q=80" },
  { name: "NPK 20-20-20", price: 950, unit: "bag", family: "fertilizers", tags: ["hybrid"], seller: "AgriBoost Depot", imageUrl: "https://images.unsplash.com/photo-1616844382736-123cdcf9d2d6?auto=format&fit=crop&w=1200&q=80" },
  { name: "Neem Coated Urea", price: 320, unit: "bag", family: "fertilizers", tags: ["organic"], seller: "SoilCare Store", imageUrl: "https://images.unsplash.com/photo-1595854341625-f33ee10dbf94?auto=format&fit=crop&w=1200&q=80" },
  { name: "Power Weeder", price: 18500, unit: "unit", family: "tools", tags: ["hybrid"], seller: "FieldTech Tools", imageUrl: "https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=1200&q=80" },
  { name: "Sprayer Pump 16L", price: 1650, unit: "unit", family: "tools", tags: ["hybrid"], seller: "Kisan Tool House", imageUrl: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=1200&q=80" },
  { name: "Manual Seed Drill", price: 4200, unit: "unit", family: "tools", tags: ["organic"], seller: "AgriEdge Mechanics", imageUrl: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=1200&q=80" },
  { name: "Vermicompost Plus", price: 260, unit: "bag", family: "fertilizers", tags: ["organic"], seller: "EcoGrow Input Mart", imageUrl: "https://images.unsplash.com/photo-1593696954577-ab3d39317b97?auto=format&fit=crop&w=1200&q=80" },
  { name: "Hybrid Chilli Seeds", price: 210, unit: "packet", family: "seeds", tags: ["hybrid"], seller: "ChilliPro Seeds", imageUrl: "https://images.unsplash.com/photo-1526346698789-22fd84314424?auto=format&fit=crop&w=1200&q=80" },
  { name: "Organic Vegetable Mix", price: 175, unit: "packet", family: "seeds", tags: ["organic"], seller: "Village Seed Bank", imageUrl: "https://images.unsplash.com/photo-1518977822534-7049a61ee0c2?auto=format&fit=crop&w=1200&q=80" },
];

const loadStoredArray = (key) => {
  try {
    const parsed = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const FALLBACK_NOTIFICATIONS = [
  {
    title: "Weather alert: Check rainfall forecast before irrigation",
    description: "Plan irrigation timing around district weather warnings to avoid water stress or runoff losses.",
    category: "weather",
    imageUrl: "https://images.unsplash.com/photo-1492496913980-501348b61469?auto=format&fit=crop&w=1200&q=80",
    publishedAt: new Date().toISOString(),
    sourceUrl: "",
  },
  {
    title: "Crop disease watch: Monitor leaf spots and early pest symptoms",
    description: "Inspect plants in morning and evening for signs of infection and begin treatment early.",
    category: "disease",
    imageUrl: "https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?auto=format&fit=crop&w=1200&q=80",
    publishedAt: new Date().toISOString(),
    sourceUrl: "",
  },
  {
    title: "Mandi price update: Compare nearby markets before sale",
    description: "Track regional rate changes before dispatching produce for better margin decisions.",
    category: "price",
    imageUrl: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=1200&q=80",
    publishedAt: new Date().toISOString(),
    sourceUrl: "",
  },
  {
    title: "Field operations alert: Prepare for strong winds tomorrow",
    description: "Secure shade nets and loose irrigation lines; avoid spraying during high wind periods.",
    category: "weather",
    imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    publishedAt: new Date().toISOString(),
    sourceUrl: "",
  },
];

const CATEGORY_IMAGE_FALLBACKS = {
  weather: [
    "https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1472145246862-b24cf25c4a36?auto=format&fit=crop&w=1200&q=80",
  ],
  disease: [
    "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1523741543316-beb7fc7023d8?auto=format&fit=crop&w=1200&q=80",
  ],
  price: [
    "https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1471193945509-9ad0617afabf?auto=format&fit=crop&w=1200&q=80",
  ],
  default: [
    "https://images.unsplash.com/photo-1492496913980-501348b61469?auto=format&fit=crop&w=1200&q=80",
  ],
};

let notificationRefreshTimer = null;

const getRandomRefreshDelay = () => {
  const minMinutes = 5;
  const maxMinutes = 10;
  const minutes = Math.floor(Math.random() * (maxMinutes - minMinutes + 1)) + minMinutes;
  return { minutes, milliseconds: minutes * 60 * 1000 };
};

const setNotificationMeta = (message) => {
  if (notificationUpdateMeta) {
    notificationUpdateMeta.textContent = message;
  }
};

const formatNotificationTime = (isoTime) => {
  const parsedTime = new Date(isoTime);
  if (Number.isNaN(parsedTime.getTime())) {
    return "Just now";
  }

  const minutesDiff = Math.floor((Date.now() - parsedTime.getTime()) / 60000);
  if (minutesDiff < 1) {
    return "Just now";
  }
  if (minutesDiff < 60) {
    return `${minutesDiff} min ago`;
  }

  const hoursDiff = Math.floor(minutesDiff / 60);
  if (hoursDiff < 24) {
    return `${hoursDiff} hr ago`;
  }

  return parsedTime.toLocaleDateString();
};

const formatCategoryLabel = (category) => {
  const value = String(category || "").toLowerCase();
  if (value === "weather") {
    return formatDashboardText("categoryWeather");
  }
  if (value === "disease") {
    return formatDashboardText("categoryDisease");
  }
  if (value === "price") {
    return formatDashboardText("categoryPrice");
  }
  return formatDashboardText("categoryAgriUpdate");
};

const getCategoryImageFallback = (category, indexSeed) => {
  const key = String(category || "").toLowerCase();
  const pool = CATEGORY_IMAGE_FALLBACKS[key] || CATEGORY_IMAGE_FALLBACKS.default;
  if (!Array.isArray(pool) || pool.length === 0) {
    return CATEGORY_IMAGE_FALLBACKS.default[0];
  }

  return pool[indexSeed % pool.length];
};

const renderNotifications = (items) => {
  if (!notificationList) {
    return;
  }

  notificationList.innerHTML = "";

  if (!items.length) {
    const emptyItem = document.createElement("li");
    emptyItem.className = "notification-empty";
    emptyItem.textContent = formatDashboardText("notificationNone");
    notificationList.appendChild(emptyItem);
    return;
  }

  const toneClasses = ["notification-tone-1", "notification-tone-2", "notification-tone-3", "notification-tone-4"];

  items.slice(0, 6).forEach((item, index) => {
    const li = document.createElement("li");
    li.className = `notification-feed-card ${toneClasses[index % toneClasses.length]}`;

    const image = document.createElement("img");
    image.className = "notification-image";
    const preferredImage = String(item.imageUrl || "").trim();
    image.src = preferredImage || getCategoryImageFallback(item.category, index);
    image.alt = String(item.title || "Agriculture notification image");
    image.loading = "lazy";
    image.referrerPolicy = "no-referrer";
    image.addEventListener(
      "error",
      () => {
        image.src = getCategoryImageFallback(item.category, index + 1);
      },
      { once: true }
    );

    const contentWrap = document.createElement("div");
    contentWrap.className = "notification-content";

    const title = document.createElement("h3");
    title.className = "notification-title";
    title.textContent = String(item.title || "Agriculture update").trim();

    const description = document.createElement("p");
    description.className = "notification-description";
    description.textContent = String(item.description || formatDashboardText("notificationNoDetails")).trim();

    const meta = document.createElement("div");
    meta.className = "notification-meta-row";

    const category = document.createElement("span");
    category.className = "notification-category";
    category.textContent = formatCategoryLabel(item.category);

    const time = document.createElement("span");
    time.className = "notification-time";
    time.textContent = formatNotificationTime(item.publishedAt);

    meta.append(category, time);
    contentWrap.append(title, description, meta);

    const cleanLink = String(item.sourceUrl || "").trim();
    if (cleanLink) {
      const anchor = document.createElement("a");
      anchor.href = cleanLink;
      anchor.target = "_blank";
      anchor.rel = "noopener noreferrer";
      anchor.className = "notification-link-wrap";
      anchor.append(image, contentWrap);
      li.appendChild(anchor);
    } else {
      li.append(image, contentWrap);
    }

    notificationList.appendChild(li);
  });
};

const readCachedNotifications = () => {
  try {
    const parsed = JSON.parse(localStorage.getItem(storageKeys.notifications) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeCachedNotifications = (items) => {
  localStorage.setItem(storageKeys.notifications, JSON.stringify(items));
};

const fetchNotificationsFromBackend = async () => {
  const langCode = getSelectedLanguageCode();
  const requestUrl = `/api/notifications?lang=${encodeURIComponent(langCode)}&t=${Date.now()}`;
  const response = await fetch(requestUrl, { cache: "no-store" });

  if (!response.ok) {
    throw new Error("Backend notification request failed");
  }

  const payload = await response.json();
  if (!payload || !Array.isArray(payload.items)) {
    throw new Error("Backend notification payload invalid");
  }

  return payload;
};

const scheduleNextNotificationRefresh = () => {
  if (notificationRefreshTimer) {
    clearTimeout(notificationRefreshTimer);
  }

  const nextRefresh = getRandomRefreshDelay();
  setNotificationMeta(formatDashboardText("notificationAutoRefresh", { minutes: nextRefresh.minutes }));

  notificationRefreshTimer = setTimeout(() => {
    refreshLiveNotifications();
  }, nextRefresh.milliseconds);
};

const refreshLiveNotifications = async () => {
  if (!notificationList) {
    return;
  }

  setNotificationMeta(formatDashboardText("notificationRefreshing"));

  try {
    const payload = await fetchNotificationsFromBackend();
    const items = payload.items.slice(0, 6);

    if (!items.length) {
      throw new Error("No feed items");
    }

    writeCachedNotifications(items);
    renderNotifications(items);
    const sourceLabel = payload.source || "backend";
    setNotificationMeta(
      formatDashboardText("notificationUpdatedAt", {
        time: new Date().toLocaleTimeString(),
        source: sourceLabel,
      })
    );
  } catch {
    const cachedItems = readCachedNotifications();
    if (cachedItems.length) {
      renderNotifications(cachedItems);
      setNotificationMeta(formatDashboardText("notificationShowingSaved"));
    } else {
      renderNotifications(FALLBACK_NOTIFICATIONS);
      setNotificationMeta(formatDashboardText("notificationShowingOffline"));
    }
  }

  scheduleNextNotificationRefresh();
};

const initLiveNotifications = () => {
  if (!notificationList) {
    return;
  }

  renderNotifications([
    {
      title: formatDashboardText("notificationLoadingTitle"),
      description: formatDashboardText("notificationLoadingDescription"),
      category: "agri update",
      imageUrl: FALLBACK_NOTIFICATIONS[0].imageUrl,
      publishedAt: new Date().toISOString(),
      sourceUrl: "",
    },
  ]);
  setNotificationMeta(formatDashboardText("notificationConnecting"));

  refreshLiveNotifications();
};

const saveDashboardData = () => {
  localStorage.setItem(storageKeys.prices, JSON.stringify(dashboardData.prices));
  localStorage.setItem(storageKeys.posts, JSON.stringify(dashboardData.posts));
  localStorage.setItem(storageKeys.products, JSON.stringify(dashboardData.products));
  localStorage.setItem(storageKeys.crops, JSON.stringify(dashboardData.crops));
};

const createRow = (labelKey, value) => {
  const row = document.createElement("p");
  row.className = "entry-meta";

  const labelSpan = document.createElement("span");
  labelSpan.textContent = `${formatDashboardText(labelKey)}: `;

  const valueSpan = document.createElement("strong");
  valueSpan.textContent = value;

  row.append(labelSpan, valueSpan);
  return row;
};

const renderPriceChart = () => {
  if (!priceChart) {
    return;
  }

  const rect = priceChart.getBoundingClientRect();
  if (rect.width > 0) {
    priceChart.width = Math.floor(rect.width);
  }

  const context = priceChart.getContext("2d");
  if (!context) {
    return;
  }

  const width = priceChart.width;
  const height = priceChart.height;

  context.clearRect(0, 0, width, height);
  context.fillStyle = "#fbfff8";
  context.fillRect(0, 0, width, height);

  const data = dashboardData.prices.slice(-8);
  if (!data.length) {
    context.fillStyle = "#46614f";
    context.font = "13px Outfit";
    context.fillText("Add mandi prices to generate chart", 16, height / 2);
    return;
  }

  const padLeft = 34;
  const padBottom = 30;
  const padTop = 12;
  const plotWidth = width - padLeft - 12;
  const plotHeight = height - padBottom - padTop;

  const maxValue = Math.max(...data.map((item) => Number(item.maxPrice) || 0), 1);
  const groupWidth = plotWidth / data.length;
  const barWidth = Math.max(12, groupWidth * 0.5);

  context.strokeStyle = "#9fc0a6";
  context.lineWidth = 1;
  context.beginPath();
  context.moveTo(padLeft, padTop);
  context.lineTo(padLeft, height - padBottom);
  context.lineTo(width - 8, height - padBottom);
  context.stroke();

  data.forEach((item, index) => {
    const avg = Number(item.avgPrice) || 0;
    const max = Number(item.maxPrice) || 0;
    const x = padLeft + index * groupWidth + (groupWidth - barWidth) / 2;

    const avgHeight = (avg / maxValue) * plotHeight;
    const maxHeight = (max / maxValue) * plotHeight;
    const yAvg = height - padBottom - avgHeight;
    const yMax = height - padBottom - maxHeight;

    context.fillStyle = "#43a968";
    context.fillRect(x, yAvg, barWidth, avgHeight);

    context.strokeStyle = "#f2a900";
    context.lineWidth = 2;
    context.beginPath();
    context.moveTo(x - 2, yMax);
    context.lineTo(x + barWidth + 2, yMax);
    context.stroke();

    context.fillStyle = "#2f4738";
    context.font = "10px Outfit";
    const cropLabel = String(item.cropName || "").slice(0, 5);
    context.fillText(cropLabel, x, height - 11);
  });

  context.fillStyle = "#3e5648";
  context.font = "10px Outfit";
  context.fillText(`Max scale: Rs ${maxValue}`, padLeft, 10);
};

const createPriceCard = (item) => {
  const card = document.createElement("article");
  card.className = "entry-card";
  card.setAttribute("data-search", `${item.cropName} ${item.marketName} ${item.maxPrice} ${item.avgPrice}`.toLowerCase());

  const title = document.createElement("h3");
  title.textContent = item.cropName;

  const marketRow = createRow("priceMarketLabel", item.marketName);
  const maxRow = createRow("priceMaxLabel", `Rs ${item.maxPrice}`);
  const avgRow = createRow("priceAvgLabel", `Rs ${item.avgPrice}`);

  card.append(title, marketRow, maxRow, avgRow);
  return card;
};

const createPostCard = (item) => {
  const card = document.createElement("article");
  card.className = "entry-card";
  card.setAttribute("data-search", `${item.titleValue} ${item.locationValue} ${item.stageValue} ${item.textValue}`.toLowerCase());

  const title = document.createElement("h3");
  title.textContent = item.titleValue;

  const locationRow = createRow("postAreaLabel", item.locationValue);
  const stageRow = createRow("postStageLabel", item.stageValue);

  const body = document.createElement("p");
  body.className = "entry-text";
  body.textContent = item.textValue;

  card.append(title, locationRow, stageRow, body);
  return card;
};

const createProductCard = (item) => {
  const card = document.createElement("article");
  card.className = "entry-card product-card";
  card.setAttribute("data-search", `${item.nameValue} ${item.typeValue} ${item.priceValue}`.toLowerCase());

  if (item.imageValue) {
    const image = document.createElement("img");
    image.src = item.imageValue;
    image.alt = `${item.nameValue} product image`;
    image.className = "product-image";
    card.appendChild(image);
  }

  const title = document.createElement("h3");
  title.textContent = item.nameValue;

  const typeRow = createRow("productCategoryLabel", item.typeValue);
  const priceRow = createRow("productPriceLabel", `Rs ${item.priceValue}`);

  card.append(title, typeRow, priceRow);
  return card;
};

const renderList = (container, items, createCard, emptyText) => {
  if (!container) {
    return;
  }

  container.innerHTML = "";
  if (!items.length) {
    const empty = document.createElement("p");
    empty.className = "empty-note";
    empty.textContent = emptyText;
    container.appendChild(empty);
    return;
  }

  items
    .slice()
    .reverse()
    .forEach((item) => {
      container.appendChild(createCard(item));
    });
};

const renderDashboardData = () => {
  renderList(priceList, dashboardData.prices, createPriceCard, formatDashboardText("emptyPriceCards"));
  renderList(postList, dashboardData.posts, createPostCard, formatDashboardText("emptyCommunityUpdates"));
  renderList(productList, dashboardData.products, createProductCard, formatDashboardText("emptyProducts"));
  renderPriceChart();
  renderAddedCropCards();
};

const seedDashboardData = () => {
  let shouldSave = false;

  if (!dashboardData.prices.length) {
    dashboardData.prices = [
      { cropName: "Tomato", marketName: "Bengaluru Mandi", maxPrice: "3400", avgPrice: "2950" },
      { cropName: "Onion", marketName: "Pune Mandi", maxPrice: "2600", avgPrice: "2200" },
      { cropName: "Wheat", marketName: "Indore Mandi", maxPrice: "2400", avgPrice: "2150" },
      { cropName: "Chilli", marketName: "Hyderabad Mandi", maxPrice: "9200", avgPrice: "8600" },
    ];
    shouldSave = true;
  }

  if (!dashboardData.posts.length) {
    dashboardData.posts = [
      { titleValue: "Irrigation done", locationValue: "Nanjangud", stageValue: "Flowering", textValue: "Sprinkler irrigation completed and crop looks healthy." },
      { titleValue: "Pest scouting update", locationValue: "Akola", stageValue: "Vegetative", textValue: "Spotted early leaf spot symptoms; started neem-based spray." },
      { titleValue: "Harvest schedule", locationValue: "Coimbatore", stageValue: "Maturing", textValue: "Wheat harvest will begin next week after weather clears." },
      { titleValue: "Market pickup", locationValue: "Nashik", stageValue: "Post-harvest", textValue: "Fresh produce collected and transported to the nearby mandi." },
    ];
    shouldSave = true;
  }

  if (!dashboardData.products.length) {
    dashboardData.products = [
      { nameValue: "Hybrid Tomato Seeds", typeValue: "Seeds", priceValue: "120", imageValue: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=1200&q=80" },
      { nameValue: "Bio Compost Granules", typeValue: "Fertilizers", priceValue: "280", imageValue: "https://images.unsplash.com/photo-1622383563227-04401ab4e5ea?auto=format&fit=crop&w=1200&q=80" },
      { nameValue: "Power Weeder", typeValue: "Tools", priceValue: "18500", imageValue: "https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=1200&q=80" },
      { nameValue: "Neem Coated Urea", typeValue: "Fertilizers", priceValue: "320", imageValue: "https://images.unsplash.com/photo-1595854341625-f33ee10dbf94?auto=format&fit=crop&w=1200&q=80" },
    ];
    shouldSave = true;
  }

  if (!dashboardData.crops.length) {
    dashboardData.crops = [
      { cropName: "Brinjal", cultivationType: "Organic", year: "2025", area: "1.2" },
      { cropName: "Banana", cultivationType: "Inorganic", year: "2024", area: "0.8" },
      { cropName: "Maize", cultivationType: "Organic", year: "2025", area: "2.5" },
      { cropName: "Turmeric", cultivationType: "Inorganic", year: "2024", area: "1.0" },
    ];
    shouldSave = true;
  }

  if (shouldSave) {
    saveDashboardData();
  }
};

const initDashboardData = () => {
  dashboardData.prices = loadStoredArray(storageKeys.prices);
  dashboardData.posts = loadStoredArray(storageKeys.posts);
  dashboardData.products = loadStoredArray(storageKeys.products);
  dashboardData.crops = loadStoredArray(storageKeys.crops);
  seedDashboardData();
  renderDashboardData();
};

const renderAddedCropCards = () => {
  if (!addedCropsList || !addedCropCount) {
    return;
  }

  addedCropCount.textContent = `${dashboardData.crops.length} of ${cropCatalog.length}`;
  addedCropsList.innerHTML = "";

  if (!dashboardData.crops.length) {
    const emptyNote = document.createElement("p");
    emptyNote.className = "empty-note";
    emptyNote.textContent = formatDashboardText("cropAddedEmpty");
    addedCropsList.appendChild(emptyNote);
    return;
  }

  dashboardData.crops
    .slice()
    .reverse()
    .forEach((item) => {
      const card = document.createElement("article");
      card.className = "added-crop-card";

      const title = document.createElement("h4");
      title.textContent = item.cropName;

      const meta = document.createElement("p");
      meta.className = "entry-meta";
      meta.innerHTML = `<span>${formatDashboardText("cropTypeLabel")}</span> <strong>${item.cultivationType}</strong> • <span>${formatDashboardText("cropYearLabel")}</span> <strong>${item.year}</strong> • <span>${formatDashboardText("cropAreaLabel")}</span> <strong>${item.area}</strong>`;

      card.append(title, meta);
      addedCropsList.appendChild(card);
    });
};

const getCropEmoji = (name) => {
  const map = {
    Paddy: "🌾",
    Wheat: "🌾",
    Cotton: "☁️",
    Chillies: "🌶️",
    Potato: "🥔",
    Onion: "🧅",
    Mango: "🥭",
    Banana: "🍌",
    Citrus: "🍊",
    Pomegranate: "🍎",
    Tomato: "🍅",
    Carrot: "🥕",
    Cabbage: "🥬",
  };
  return map[name] || "🌱";
};

const renderCropSelection = (query = "") => {
  if (!cropSelectionList) {
    return;
  }

  const normalizedQuery = query.trim().toLowerCase();
  const filtered = cropCatalog.filter((crop) => crop.toLowerCase().includes(normalizedQuery));

  cropSelectionList.innerHTML = "";

  filtered.forEach((crop) => {
    const row = document.createElement("button");
    row.type = "button";
    row.className = "crop-select-item";
    row.setAttribute("role", "listitem");

    const icon = document.createElement("span");
    icon.className = "crop-select-icon";
    icon.textContent = getCropEmoji(crop);

    const label = document.createElement("span");
    label.className = "crop-select-name";
    label.textContent = crop;

    row.append(icon, label);
    row.addEventListener("click", () => {
      activeSelectedCrop = crop;
      openCropModal(crop);
    });

    cropSelectionList.appendChild(row);
  });
};

const fillYearOptions = () => {
  if (!cultivationYearInput) {
    return;
  }

  const now = new Date().getFullYear();
  cultivationYearInput.innerHTML = "";

  for (let year = now + 1; year >= now - 10; year -= 1) {
    const option = document.createElement("option");
    option.value = String(year);
    option.textContent = String(year);
    cultivationYearInput.appendChild(option);
  }
};

const setCropModalVisible = (visible) => {
  if (!cropModal) {
    return;
  }

  cropModal.classList.toggle("open", visible);
  cropModal.setAttribute("aria-hidden", visible ? "false" : "true");
};

const openCropModal = (cropName) => {
  if (!selectedCropName || !cropModalForm || !cultivationTypeInput || !cultivationAreaInput) {
    return;
  }

  selectedCropName.textContent = cropName;
  cultivationTypeInput.value = "";
  cultivationAreaInput.value = "";
  fillYearOptions();
  setCropModalVisible(true);
};

const closeCropModal = () => {
  setCropModalVisible(false);
};

const formatDateValue = (date) => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const populateMarketStates = () => {
  if (!marketStateSelect) {
    return;
  }

  marketStateSelect.innerHTML = "";
  INDIA_STATES_28.forEach((stateName, index) => {
    const option = document.createElement("option");
    option.value = stateName;
    option.textContent = stateName;
    if (index === 0) {
      option.selected = true;
    }
    marketStateSelect.appendChild(option);
  });
};

const populateMarketCrops = (stateName) => {
  if (!marketCropSelect) {
    return;
  }

  const cropNames = MARKET_CROPS_30;

  marketCropSelect.innerHTML = "";
  cropNames.forEach((cropName, index) => {
    const option = document.createElement("option");
    option.value = cropName;
    option.textContent = cropName;
    if (index === 0) {
      option.selected = true;
    }
    marketCropSelect.appendChild(option);
  });
};

const distanceKm = (aLat, aLon, bLat, bLon) => {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const earthRadius = 6371;
  const dLat = toRad(bLat - aLat);
  const dLon = toRad(bLon - aLon);
  const r1 = toRad(aLat);
  const r2 = toRad(bLat);

  const sinLat = Math.sin(dLat / 2);
  const sinLon = Math.sin(dLon / 2);
  const h = sinLat * sinLat + Math.cos(r1) * Math.cos(r2) * sinLon * sinLon;
  return 2 * earthRadius * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
};

const drawMarketTrendGraph = (trend) => {
  if (!marketTrendChart) {
    return;
  }

  const ctx = marketTrendChart.getContext("2d");
  if (!ctx) {
    return;
  }

  const rect = marketTrendChart.getBoundingClientRect();
  if (rect.width > 0) {
    marketTrendChart.width = Math.floor(rect.width);
  }

  const width = marketTrendChart.width;
  const height = marketTrendChart.height;
  ctx.clearRect(0, 0, width, height);
  const bgGradient = ctx.createLinearGradient(0, 0, 0, height);
  bgGradient.addColorStop(0, "#f8fffc");
  bgGradient.addColorStop(1, "#eef8f2");
  ctx.fillStyle = bgGradient;
  ctx.fillRect(0, 0, width, height);

  if (!Array.isArray(trend) || !trend.length) {
    ctx.fillStyle = "#355243";
    ctx.font = "13px Outfit";
    ctx.fillText("Select state and crop to view trend", 18, height / 2);
    return;
  }

  const minValue = Math.min(...trend);
  const maxValue = Math.max(...trend);
  const span = Math.max(maxValue - minValue, 1);
  const pad = { l: 36, r: 14, t: 14, b: 24 };
  const plotW = width - pad.l - pad.r;
  const plotH = height - pad.t - pad.b;

  ctx.strokeStyle = "rgba(37, 111, 76, 0.12)";
  ctx.lineWidth = 1;
  for (let i = 0; i < 4; i += 1) {
    const y = pad.t + (plotH / 3) * i;
    ctx.beginPath();
    ctx.moveTo(pad.l, y);
    ctx.lineTo(width - pad.r, y);
    ctx.stroke();
  }

  ctx.strokeStyle = "#c9dacc";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(pad.l, pad.t);
  ctx.lineTo(pad.l, height - pad.b);
  ctx.lineTo(width - pad.r, height - pad.b);
  ctx.stroke();

  const points = trend.map((value, index) => {
    return {
      x: pad.l + (index / Math.max(trend.length - 1, 1)) * plotW,
      y: pad.t + ((maxValue - value) / span) * plotH,
      value,
    };
  });

  const areaGradient = ctx.createLinearGradient(0, pad.t, 0, height - pad.b);
  areaGradient.addColorStop(0, "rgba(31, 167, 102, 0.34)");
  areaGradient.addColorStop(1, "rgba(31, 167, 102, 0.03)");

  ctx.beginPath();
  ctx.moveTo(points[0].x, height - pad.b);
  points.forEach((point) => {
    ctx.lineTo(point.x, point.y);
  });
  ctx.lineTo(points[points.length - 1].x, height - pad.b);
  ctx.closePath();
  ctx.fillStyle = areaGradient;
  ctx.fill();

  ctx.strokeStyle = "#1c9a63";
  ctx.lineWidth = 3;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  ctx.shadowColor = "rgba(19, 127, 79, 0.3)";
  ctx.shadowBlur = 6;

  ctx.beginPath();
  points.forEach((point, index) => {
    if (index === 0) {
      ctx.moveTo(point.x, point.y);
      return;
    }

    const prev = points[index - 1];
    const cpX = (prev.x + point.x) / 2;
    ctx.quadraticCurveTo(prev.x, prev.y, cpX, (prev.y + point.y) / 2);

    if (index === points.length - 1) {
      ctx.quadraticCurveTo(point.x, point.y, point.x, point.y);
    }
  });
  ctx.stroke();
  ctx.shadowBlur = 0;

  points.forEach((point) => {
    ctx.fillStyle = "#f19a1a";
    ctx.beginPath();
    ctx.arc(point.x, point.y, 3.6, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "#fffdf4";
    ctx.lineWidth = 1.5;
    ctx.stroke();
  });

  ctx.fillStyle = "#2b4739";
  ctx.font = "10px Outfit";
  ctx.fillText(`Min Rs ${minValue}`, pad.l, 10);
  ctx.fillText(`Max Rs ${maxValue}`, width - 92, 10);
};

const renderMarketAdvisory = () => {
  if (!marketStateSelect || !marketCropSelect || !marketDateText || !districtPriceList) {
    return;
  }

  const stateName = marketStateSelect.value;
  const cropName = marketCropSelect.value;
  marketDateText.textContent = formatDateValue(new Date());

  const cropPayload = MARKET_DATA[stateName]?.[cropName];
  if (!cropPayload) {
    districtPriceList.innerHTML = '<p class="empty-note">Select state and crop.</p>';
    drawMarketTrendGraph([]);
    return;
  }

  const districts = cropPayload.districts || [];
  districtPriceList.innerHTML = "";

  districts.forEach((item) => {
    const card = document.createElement("article");
    card.className = "district-card";

    const titleRow = document.createElement("div");
    titleRow.className = "district-card-head";

    const title = document.createElement("h4");
    title.textContent = `${item.district} - ${cropName}`;

    const arrivals = document.createElement("p");
    arrivals.textContent = `Arrivals: ${item.arrivals} Q`;

    titleRow.append(title, arrivals);

    const prices = document.createElement("div");
    prices.className = "district-prices-row";
    prices.innerHTML = `
      <p><span>Max Price</span><strong>Rs ${item.max}</strong></p>
      <p><span>Avg Price</span><strong>Rs ${item.avg}</strong></p>
      <p><span>Min Price</span><strong>Rs ${item.min}</strong></p>
    `;

    card.append(titleRow, prices);
    districtPriceList.appendChild(card);
  });

  const mergedTrend = [];
  districts.forEach((d) => {
    d.trend.forEach((val, idx) => {
      if (!mergedTrend[idx]) {
        mergedTrend[idx] = [];
      }
      mergedTrend[idx].push(val);
    });
  });
  const avgTrend = mergedTrend.map((bucket) => Math.round(bucket.reduce((sum, val) => sum + val, 0) / Math.max(bucket.length, 1)));
  drawMarketTrendGraph(avgTrend);

  if (bestSellTimeText) {
    bestSellTimeText.textContent = cropPayload.sellAdvice;
  }

  if (nearbyMandisList) {
    nearbyMandisList.innerHTML = "";
    cropPayload.mandis.forEach((mandi, index) => {
      const node = document.createElement("p");
      node.className = "mandi-pill";
      node.textContent = `${index + 1}. ${mandi}`;
      nearbyMandisList.appendChild(node);
    });
  }

  if (locationPriceValue && locationPriceMeta) {
    let basedDistrict = districts[0];

    if (userCoordinates) {
      basedDistrict = districts
        .slice()
        .sort((a, b) => {
          const aDist = distanceKm(userCoordinates.lat, userCoordinates.lon, a.lat, a.lon);
          const bDist = distanceKm(userCoordinates.lat, userCoordinates.lon, b.lat, b.lon);
          return aDist - bDist;
        })[0];
    }

    locationPriceValue.textContent = `${cropName} @ ${basedDistrict.district}: Rs ${basedDistrict.avg}`;
    locationPriceMeta.textContent = `State: ${stateName} | Min: Rs ${basedDistrict.min} | Max: Rs ${basedDistrict.max}`;
  }
};

const initMarketAdvisory = () => {
  if (!marketStateSelect || !marketCropSelect) {
    return;
  }

  populateMarketStates();
  populateMarketCrops(marketStateSelect.value);
  renderMarketAdvisory();

  marketStateSelect.addEventListener("change", () => {
    populateMarketCrops(marketStateSelect.value);
    renderMarketAdvisory();
  });

  marketCropSelect.addEventListener("change", () => {
    renderMarketAdvisory();
  });

  if (typeof navigator !== "undefined" && navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        userCoordinates = {
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        };
        renderMarketAdvisory();
      },
      () => {
        userCoordinates = null;
      },
      { enableHighAccuracy: false, timeout: 5000 }
    );
  }
};

const formatStars = (ratingValue) => {
  const rounded = Math.round(Number(ratingValue) || 0);
  return "★".repeat(Math.max(0, rounded)).padEnd(5, "☆");
};

const updateDealerMap = (dealer) => {
  if (!dealerMapFrame || !dealer) {
    return;
  }

  const mapQuery = `${dealer.lat},${dealer.lon}`;
  dealerMapFrame.src = `https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&z=13&output=embed`;
  activeDealerForMap = dealer;
};

const renderDealerList = (searchQuery = "") => {
  if (!dealersList) {
    return;
  }

  const query = searchQuery.trim().toLowerCase();
  const visibleDealers = dealersViewData.filter((dealer) => {
    const searchable = `${dealer.name} ${dealer.type} ${dealer.district}`.toLowerCase();
    return searchable.includes(query);
  });

  dealersList.innerHTML = "";

  if (!visibleDealers.length) {
    const emptyNode = document.createElement("p");
    emptyNode.className = "empty-note";
    emptyNode.textContent = formatDashboardText("noDealersFoundText");
    dealersList.appendChild(emptyNode);
    return;
  }

  visibleDealers.forEach((dealer, index) => {
    const card = document.createElement("article");
    card.className = "dealer-card";
    card.style.setProperty("--dealer-delay", `${index * 55}ms`);

    const distanceLabel = Number.isFinite(dealer.distanceKm)
      ? `${dealer.distanceKm.toFixed(1)} ${formatDashboardText("distanceAwayLabel")}`
      : formatDashboardText("distanceUnavailableText");

    card.innerHTML = `
      <div class="dealer-card-head">
        <div>
          <h4>${dealer.name}</h4>
          <p class="dealer-type">${dealer.type}</p>
        </div>
        <span class="dealer-distance">${distanceLabel}</span>
      </div>

      <div class="dealer-meta-row">
        <span>📍 ${dealer.district}</span>
        <span>📞 ${dealer.phone}</span>
      </div>

      <div class="dealer-rating-row">
        <span class="dealer-stars">${formatStars(dealer.rating)}</span>
        <strong>${dealer.rating.toFixed(1)}</strong>
        <span>(${dealer.reviews} ${formatDashboardText("reviewsText")})</span>
      </div>

      <p class="dealer-review">"${dealer.reviewQuote}"</p>

      <div class="dealer-actions">
        <a href="tel:${dealer.phone.replace(/\s+/g, "")}" class="dealer-action-btn">${formatDashboardText("callLabel")}</a>
        <button type="button" class="dealer-action-btn dealer-map-btn">${formatDashboardText("directionsLabel")}</button>
        <span class="dealer-open-state ${dealer.openNow ? "open" : "closed"}">${dealer.openNow ? formatDashboardText("openNowLabel") : formatDashboardText("closedLabel")}</span>
      </div>
    `;

    const mapButton = card.querySelector(".dealer-map-btn");
    mapButton.addEventListener("click", () => {
      updateDealerMap(dealer);
      const mapQuery = `${dealer.lat},${dealer.lon}`;
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`, "_blank", "noopener,noreferrer");
    });

    card.addEventListener("click", (event) => {
      if (event.target.closest(".dealer-actions")) {
        return;
      }
      updateDealerMap(dealer);
    });

    dealersList.appendChild(card);
  });
};

const refreshDealerDistanceData = () => {
  dealersViewData = AGRO_DEALERS_MASTER.map((dealer) => {
    if (!userCoordinates) {
      return { ...dealer, distanceKm: Number.POSITIVE_INFINITY };
    }

    const computedDistance = distanceKm(userCoordinates.lat, userCoordinates.lon, dealer.lat, dealer.lon);
    return { ...dealer, distanceKm: computedDistance };
  }).sort((a, b) => a.distanceKm - b.distanceKm);
};

const updateNearestDealerHero = () => {
  if (!nearestDealerSummary || !nearestDealerDetail || !dealersViewData.length) {
    return;
  }

  const nearestDealer = dealersViewData[0];
  if (!Number.isFinite(nearestDealer.distanceKm)) {
    nearestDealerSummary.textContent = `Nearest fertilizer shop - ${nearestDealer.name}`;
    nearestDealerDetail.textContent = `${nearestDealer.district} | Turn on location for exact distance.`;
    return;
  }

  nearestDealerSummary.textContent = `Nearest fertilizer shop - ${nearestDealer.distanceKm.toFixed(1)} km away`;
  nearestDealerDetail.textContent = `${nearestDealer.name} in ${nearestDealer.district} | Rating ${nearestDealer.rating.toFixed(1)} (${nearestDealer.reviews} ${formatDashboardText("reviewsText")})`;
};

const initAgriDealers = () => {
  if (!dealersList) {
    return;
  }

  const redraw = () => {
    refreshDealerDistanceData();
    updateNearestDealerHero();
    renderDealerList(dealerSearchInput ? dealerSearchInput.value : "");
    if (!activeDealerForMap && dealersViewData[0]) {
      updateDealerMap(dealersViewData[0]);
    }
  };

  redraw();

  if (dealerSearchInput) {
    dealerSearchInput.addEventListener("input", (event) => {
      renderDealerList(event.target.value);
    });
  }

  if (dealerOpenMapBtn) {
    dealerOpenMapBtn.addEventListener("click", () => {
      const selectedDealer = activeDealerForMap || dealersViewData[0];
      if (!selectedDealer) {
        return;
      }

      const mapQuery = `${selectedDealer.lat},${selectedDealer.lon}`;
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`, "_blank", "noopener,noreferrer");
    });
  }

  const readUserLocation = () => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        userCoordinates = {
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        };
        redraw();
      },
      () => {
        redraw();
      },
      { enableHighAccuracy: false, timeout: 6000 }
    );
  };

  if (agriDealersRefreshBtn) {
    agriDealersRefreshBtn.addEventListener("click", () => {
      readUserLocation();
    });
  }

  readUserLocation();
};

const formatCurrency = (value) => {
  return `₹${Number(value).toLocaleString("en-IN")}`;
};

const loadAgProductQtyMap = () => {
  try {
    const parsed = JSON.parse(localStorage.getItem(storageKeys.agProductQuantities) || "{}");
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
};

const saveAgProductQtyMap = () => {
  localStorage.setItem(storageKeys.agProductQuantities, JSON.stringify(agProductQtyMap));
};

const getFilteredAgProducts = () => {
  const searchQuery = (agProductsSearch ? agProductsSearch.value : "").trim().toLowerCase();

  return AG_PRODUCTS_CATALOG.filter((item) => {
    const categoryMatch =
      activeAgProductsCategory === "all" ||
      item.family === activeAgProductsCategory ||
      item.tags.includes(activeAgProductsCategory);

    if (!categoryMatch) {
      return false;
    }

    if (!searchQuery) {
      return true;
    }

    const searchable = `${item.name} ${item.family} ${item.tags.join(" ")} ${item.seller}`.toLowerCase();
    return searchable.includes(searchQuery);
  });
};

const renderAgProducts = () => {
  if (!agProductsList || !agProductsCount) {
    return;
  }

  const items = getFilteredAgProducts();
  agProductsList.innerHTML = "";
  agProductsCount.textContent = `${items.length} ${formatDashboardText("productsCountSuffix")}`;

  if (!items.length) {
    const emptyNote = document.createElement("p");
    emptyNote.className = "empty-note";
    emptyNote.textContent = formatDashboardText("noProductsFoundText");
    agProductsList.appendChild(emptyNote);
    return;
  }

  items.forEach((item, index) => {
    const card = document.createElement("article");
    card.className = "ag-product-card";
    card.style.setProperty("--ag-delay", `${index * 40}ms`);

    const categoryBadge = item.tags.length ? item.tags[0] : item.family;
    const imageUrl = String(item.imageUrl || "").trim();
    const initialQty = Math.max(1, Math.min(99, Number(agProductQtyMap[item.name]) || 1));

    card.innerHTML = `
      <img class="ag-product-image" src="${imageUrl}" alt="${item.name}" loading="lazy" referrerpolicy="no-referrer" />
      <div class="ag-product-card-head">
        <h3>${item.name}</h3>
        <span class="ag-product-badge">${categoryBadge}</span>
      </div>
      <p class="ag-product-seller">Seller: ${item.seller}</p>
      <p class="ag-product-price">${formatCurrency(item.price)} <span>/ ${item.unit}</span></p>
      <div class="ag-product-qty-row">
        <p class="ag-product-qty-label">${formatDashboardText("productQuantityLabel")}</p>
        <div class="ag-product-qty-control">
          <button type="button" class="qty-btn qty-minus">−</button>
          <input type="number" class="qty-input" min="1" max="99" value="${initialQty}" aria-label="Quantity for ${item.name}" />
          <button type="button" class="qty-btn qty-plus">+</button>
        </div>
      </div>
      <p class="ag-product-total">Total: <strong>${formatCurrency(item.price * initialQty)}</strong></p>
      <div class="ag-product-actions">
        <button type="button" class="ag-product-btn ag-buy-btn">${formatDashboardText("buyNowLabel")}</button>
        <button type="button" class="ag-product-btn ag-order-btn">${formatDashboardText("orderLabel")}</button>
      </div>
    `;

    const buyBtn = card.querySelector(".ag-buy-btn");
    const orderBtn = card.querySelector(".ag-order-btn");
    const imageNode = card.querySelector(".ag-product-image");
    const qtyMinus = card.querySelector(".qty-minus");
    const qtyPlus = card.querySelector(".qty-plus");
    const qtyInput = card.querySelector(".qty-input");
    const totalValue = card.querySelector(".ag-product-total strong");

    if (imageNode) {
      imageNode.addEventListener(
        "error",
        () => {
          imageNode.src = "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1200&q=80";
        },
        { once: true }
      );
    }

    const updateTotal = () => {
      const qty = Math.max(1, Math.min(99, Number(qtyInput.value) || 1));
      qtyInput.value = String(qty);
      agProductQtyMap[item.name] = qty;
      saveAgProductQtyMap();
      totalValue.textContent = formatCurrency(item.price * qty);
    };

    qtyMinus.addEventListener("click", () => {
      qtyInput.value = String(Math.max(1, Number(qtyInput.value) - 1 || 1));
      updateTotal();
    });

    qtyPlus.addEventListener("click", () => {
      qtyInput.value = String(Math.min(99, Number(qtyInput.value) + 1 || 2));
      updateTotal();
    });

    qtyInput.addEventListener("input", updateTotal);

    buyBtn.addEventListener("click", () => {
      buyBtn.textContent = formatDashboardText("addedLabel");
      buyBtn.disabled = true;
    });

    orderBtn.addEventListener("click", () => {
      orderBtn.textContent = formatDashboardText("orderedLabel") || formatDashboardText("addedLabel");
      orderBtn.disabled = true;
    });

    agProductsList.appendChild(card);
  });
};

const initAgProducts = () => {
  if (!agProductsList) {
    return;
  }

  agProductQtyMap = loadAgProductQtyMap();

  if (agProductsCategoryTabs) {
    const chips = agProductsCategoryTabs.querySelectorAll(".ag-category-chip");
    chips.forEach((chip) => {
      chip.addEventListener("click", () => {
        activeAgProductsCategory = chip.dataset.category || "all";
        chips.forEach((node) => node.classList.toggle("active", node === chip));
        renderAgProducts();
      });
    });
  }

  if (agProductsSearch) {
    agProductsSearch.addEventListener("input", () => {
      renderAgProducts();
    });
  }

  if (agProductsRefreshBtn) {
    agProductsRefreshBtn.addEventListener("click", () => {
      renderAgProducts();
    });
  }

  renderAgProducts();
};

const getRentalOrigin = () => {
  if (userCoordinates) {
    return { lat: userCoordinates.lat, lon: userCoordinates.lon, name: "Your Location" };
  }

  return MANUAL_RENTAL_LOCATIONS[manualRentalLocationIndex];
};

const getDistanceText = (item, origin) => {
  if (!origin) {
    return "Distance unavailable";
  }

  const dKm = distanceKm(origin.lat, origin.lon, item.lat, item.lon);
  return `${dKm.toFixed(1)} km away`;
};

const getFilteredRentals = () => {
  const origin = getRentalOrigin();
  const withDistance = EQUIPMENT_RENTALS_CATALOG.map((item) => {
    const distanceValue = origin ? distanceKm(origin.lat, origin.lon, item.lat, item.lon) : Number.POSITIVE_INFINITY;
    return { ...item, distanceKm: distanceValue };
  }).sort((a, b) => a.distanceKm - b.distanceKm);

  if (rentalsFilterMode === "all") {
    return withDistance;
  }

  const nearbyOnly = withDistance.filter((item) => item.distanceKm <= 80);
  return nearbyOnly;
};

const renderEquipmentRentals = () => {
  if (!rentalsList || !rentalsMetaText || !rentalsLocationText) {
    return;
  }

  const origin = getRentalOrigin();
  const rentals = getFilteredRentals();
  const locationName = origin.name;
  rentalsLocationText.textContent = `📍 ${locationName}`;

  rentalsList.innerHTML = "";

  if (!rentals.length) {
    rentalsMetaText.textContent = formatDashboardText("rentalsUnavailable");
    const empty = document.createElement("p");
    empty.className = "empty-note";
    empty.textContent = formatDashboardText("rentalsNoneNearby");
    rentalsList.appendChild(empty);
    return;
  }

  rentalsMetaText.textContent = rentalsFilterMode === "nearby" ? formatDashboardText("rentalsShowingNearby") : formatDashboardText("rentalsShowingAll");

  rentals.forEach((item, index) => {
    const card = document.createElement("article");
    card.className = "rental-card";
    card.style.setProperty("--rental-delay", `${index * 45}ms`);

    const priceLabel = item.mode === "hour" ? `/hour` : `/day`;
    const availabilityClass = item.available ? "available" : "unavailable";
    const availabilityText = item.available ? "Available" : "Not available";

    card.innerHTML = `
      <div class="rental-card-head">
        <h3>${item.name}</h3>
        <span class="rental-type-chip">${item.type}</span>
      </div>
      <p class="rental-location">${item.place} • ${getDistanceText(item, origin)}</p>
      <p class="rental-price">${formatCurrency(item.price)} <span>${priceLabel}</span></p>
      <div class="rental-actions">
        <span class="rental-availability ${availabilityClass}">${availabilityText}</span>
        <button type="button" class="rental-book-btn" ${item.available ? "" : "disabled"}>${formatDashboardText("bookNowLabel")}</button>
      </div>
    `;

    const bookBtn = card.querySelector(".rental-book-btn");
    if (item.available) {
      bookBtn.addEventListener("click", () => {
        bookBtn.textContent = "Booked ✓";
        bookBtn.disabled = true;
      });
    }

    rentalsList.appendChild(card);
  });
};

const initEquipmentRentals = () => {
  if (!rentalsList) {
    return;
  }

  if (rentalsToggleWrap) {
    const buttons = rentalsToggleWrap.querySelectorAll(".rentals-toggle-btn");
    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        rentalsFilterMode = button.dataset.filter || "nearby";
        buttons.forEach((node) => node.classList.toggle("active", node === button));
        renderEquipmentRentals();
      });
    });
  }

  if (rentalsChangeLocationBtn) {
    rentalsChangeLocationBtn.addEventListener("click", () => {
      manualRentalLocationIndex = (manualRentalLocationIndex + 1) % MANUAL_RENTAL_LOCATIONS.length;
      userCoordinates = null;
      renderEquipmentRentals();
    });
  }

  if (equipmentRentalsRefreshBtn && typeof navigator !== "undefined" && navigator.geolocation) {
    equipmentRentalsRefreshBtn.addEventListener("click", () => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          userCoordinates = {
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          };
          renderEquipmentRentals();
        },
        () => {
          renderEquipmentRentals();
        },
        { enableHighAccuracy: false, timeout: 6000 }
      );
    });
  }

  renderEquipmentRentals();
};

const addProductEntry = (item) => {
  dashboardData.products.push(item);
  saveDashboardData();
  renderDashboardData();
  productForm.reset();
};

if (priceForm && priceList) {
  priceForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const cropName = document.getElementById("cropNameInput").value.trim();
    const marketName = document.getElementById("marketInput").value.trim();
    const maxPrice = document.getElementById("maxPriceInput").value.trim();
    const avgPrice = document.getElementById("avgPriceInput").value.trim();

    if (!cropName || !marketName || !maxPrice || !avgPrice) {
      return;
    }

    dashboardData.prices.push({ cropName, marketName, maxPrice, avgPrice });
    saveDashboardData();
    renderDashboardData();
    priceForm.reset();
  });
}

if (postForm && postList) {
  postForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const titleValue = document.getElementById("postTitleInput").value.trim();
    const locationValue = document.getElementById("postLocationInput").value.trim();
    const stageValue = document.getElementById("postStageInput").value.trim();
    const textValue = document.getElementById("postTextInput").value.trim();

    if (!titleValue || !locationValue || !stageValue || !textValue) {
      return;
    }

    dashboardData.posts.push({ titleValue, locationValue, stageValue, textValue });
    saveDashboardData();
    renderDashboardData();
    postForm.reset();
  });
}

if (productForm && productList) {
  productForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const nameValue = document.getElementById("productNameInput").value.trim();
    const typeValue = document.getElementById("productTypeInput").value.trim();
    const priceValue = document.getElementById("productPriceInput").value.trim();
    const imageUrlValue = document.getElementById("productImageInput").value.trim();
    const imageFile = productImageFileInput && productImageFileInput.files ? productImageFileInput.files[0] : null;

    if (!nameValue || !typeValue || !priceValue) {
      return;
    }

    if (imageFile) {
      const reader = new FileReader();
      reader.onload = () => {
        addProductEntry({
          nameValue,
          typeValue,
          priceValue,
          imageValue: String(reader.result || ""),
        });
      };
      reader.readAsDataURL(imageFile);
      return;
    }

    addProductEntry({ nameValue, typeValue, priceValue, imageValue: imageUrlValue });
  });
}

if (dashboardSearch) {
  dashboardSearch.addEventListener("input", (event) => {
    const query = event.target.value.trim().toLowerCase();
    const searchableCards = document.querySelectorAll(".entry-card[data-search]");

    searchableCards.forEach((card) => {
      const text = card.getAttribute("data-search") || "";
      const isMatch = text.includes(query);
      card.classList.toggle("hidden", !isMatch);
    });
  });
}

if (cropManagementTile) {
  cropManagementTile.addEventListener("click", () => {
    goToPage(5);
  });
}

if (marketAdvisoryTile) {
  marketAdvisoryTile.addEventListener("click", () => {
    goToPage(7);
    renderMarketAdvisory();
  });
}

if (agriDealersTile) {
  agriDealersTile.addEventListener("click", () => {
    goToPage(8);
    refreshDealerDistanceData();
    updateNearestDealerHero();
    renderDealerList(dealerSearchInput ? dealerSearchInput.value : "");
  });
}

if (agProductsTile) {
  agProductsTile.addEventListener("click", () => {
    goToPage(9);
    renderAgProducts();
  });
}

if (equipmentRentalsTile) {
  equipmentRentalsTile.addEventListener("click", () => {
    goToPage(10);
    renderEquipmentRentals();
  });
}

if (cropManagementBackBtn) {
  cropManagementBackBtn.addEventListener("click", () => {
    goToPage(4);
  });
}

if (marketAdvisoryBackBtn) {
  marketAdvisoryBackBtn.addEventListener("click", () => {
    goToPage(4);
  });
}

if (agriDealersBackBtn) {
  agriDealersBackBtn.addEventListener("click", () => {
    goToPage(4);
  });
}

if (agProductsBackBtn) {
  agProductsBackBtn.addEventListener("click", () => {
    goToPage(4);
  });
}

if (equipmentRentalsBackBtn) {
  equipmentRentalsBackBtn.addEventListener("click", () => {
    goToPage(4);
  });
}

if (goToCropSelectionBtn) {
  goToCropSelectionBtn.addEventListener("click", () => {
    goToPage(6);
    renderCropSelection(cropSearchInput ? cropSearchInput.value : "");
  });
}

if (cropSelectBackBtn) {
  cropSelectBackBtn.addEventListener("click", () => {
    goToPage(5);
  });
}

if (cropSearchInput) {
  cropSearchInput.addEventListener("input", (event) => {
    renderCropSelection(event.target.value);
  });
}

if (cropModalClose) {
  cropModalClose.addEventListener("click", closeCropModal);
}

if (cropModalBackdrop) {
  cropModalBackdrop.addEventListener("click", closeCropModal);
}

if (cropModalForm) {
  cropModalForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!activeSelectedCrop || !cultivationTypeInput || !cultivationYearInput || !cultivationAreaInput) {
      return;
    }

    const cultivationType = cultivationTypeInput.value.trim();
    const year = cultivationYearInput.value.trim();
    const area = cultivationAreaInput.value.trim();

    if (!cultivationType || !year || !area) {
      return;
    }

    dashboardData.crops.push({
      cropName: activeSelectedCrop,
      cultivationType,
      year,
      area,
    });

    saveDashboardData();
    renderAddedCropCards();
    closeCropModal();
    goToPage(5);
  });
}

bottomNavItems.forEach((item) => {
  item.addEventListener("click", () => {
    bottomNavItems.forEach((btn) => btn.classList.remove("active"));
    item.classList.add("active");
  });
});

window.addEventListener("resize", () => {
  renderPriceChart();
  renderMarketAdvisory();
});

jumpLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    const pageTarget = Number(event.currentTarget.dataset.targetPage);
    goToPage(pageTarget);
  });
});

if (appShell) {
  appShell.addEventListener("touchstart", (event) => {
    touchStartX = event.changedTouches[0].screenX;
    touchDeltaX = 0;
  });

  appShell.addEventListener("touchmove", (event) => {
    touchDeltaX = event.changedTouches[0].screenX - touchStartX;
  });

  appShell.addEventListener("touchend", () => {
    if (activePage >= 4) {
      return;
    }

    if (touchDeltaX <= -45) {
      goToPage(activePage + 1);
    } else if (touchDeltaX >= 45) {
      goToPage(activePage - 1);
    }
  });
}

goToPage(activePage);

renderCropSelection();
fillYearOptions();
initMarketAdvisory();
initAgriDealers();
initAgProducts();
initEquipmentRentals();

if (activePage >= 4) {
  bootstrapDashboard();
}
