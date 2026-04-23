const icon = document.getElementById("appIcon");
const startButton = document.getElementById("startButton");
const appShell = document.getElementById("appShell");
const pageTrack = document.getElementById("pageTrack");
const signupForm = document.getElementById("signupForm");
const jumpLinks = document.querySelectorAll("[data-target-page]");
const pages = document.querySelectorAll(".page");

const pageStorageKey = "agrolink_active_page";

const readStoredPage = () => {
  const storedValue = Number(localStorage.getItem(pageStorageKey));
  return Number.isInteger(storedValue) && storedValue >= 0 && storedValue < pageCount ? storedValue : 0;
};

let activePage = 0;
let touchStartX = 0;
let touchDeltaX = 0;

const pageCount = 5;

activePage = readStoredPage();

const setActivePageState = () => {
  pages.forEach((page, index) => {
    page.classList.toggle("active", index === activePage);
  });
};

const goToPage = (index) => {
  activePage = Math.max(0, Math.min(index, pageCount - 1));
  localStorage.setItem(pageStorageKey, String(activePage));
  pageTrack.style.transform = `translateX(-${activePage * 100}vw)`;
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
};

const dashboardData = {
  prices: [],
  posts: [],
  products: [],
};

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
};

const createRow = (label, value) => {
  const row = document.createElement("p");
  row.className = "entry-meta";

  const labelSpan = document.createElement("span");
  labelSpan.textContent = `${label}: `;

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

  const marketRow = createRow("Market", item.marketName);
  const maxRow = createRow("Max Price", `Rs ${item.maxPrice}`);
  const avgRow = createRow("Avg Price", `Rs ${item.avgPrice}`);

  card.append(title, marketRow, maxRow, avgRow);
  return card;
};

const createPostCard = (item) => {
  const card = document.createElement("article");
  card.className = "entry-card";
  card.setAttribute("data-search", `${item.titleValue} ${item.locationValue} ${item.stageValue} ${item.textValue}`.toLowerCase());

  const title = document.createElement("h3");
  title.textContent = item.titleValue;

  const locationRow = createRow("Area", item.locationValue);
  const stageRow = createRow("Stage", item.stageValue);

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

  const typeRow = createRow("Category", item.typeValue);
  const priceRow = createRow("Price", `Rs ${item.priceValue}`);

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
};

const initDashboardData = () => {
  dashboardData.prices = loadStoredArray(storageKeys.prices);
  dashboardData.posts = loadStoredArray(storageKeys.posts);
  dashboardData.products = loadStoredArray(storageKeys.products);
  renderDashboardData();
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

bottomNavItems.forEach((item) => {
  item.addEventListener("click", () => {
    bottomNavItems.forEach((btn) => btn.classList.remove("active"));
    item.classList.add("active");
  });
});

window.addEventListener("resize", () => {
  renderPriceChart();
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
    if (activePage === 4) {
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

if (activePage === 4) {
  bootstrapDashboard();
}
