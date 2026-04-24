const express = require("express");
const path = require("path");

const app = express();
const PORT = Number(process.env.PORT || 8000);

const NEWS_API_KEY = process.env.NEWS_API_KEY || "";
const GOOGLE_TRANSLATE_API_KEY = process.env.GOOGLE_TRANSLATE_API_KEY || "";
const CATEGORY_IMAGES = {
  weather: [
    "https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1472145246862-b24cf25c4a36?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=80",
  ],
  disease: [
    "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1523741543316-beb7fc7023d8?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1437252611977-07f74518abd7?auto=format&fit=crop&w=1600&q=80",
  ],
  price: [
    "https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1471193945509-9ad0617afabf?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1461354464878-ad92f492a5a0?auto=format&fit=crop&w=1600&q=80",
  ],
};

const DEFAULT_IMAGE = CATEGORY_IMAGES.weather[0];

const CATEGORY_KEYWORDS = {
  weather: ["weather", "rain", "rainfall", "storm", "monsoon", "temperature", "heatwave", "flood", "drought"],
  disease: ["disease", "blight", "fungus", "virus", "pest", "infestation", "rot", "rust", "leaf spot"],
  price: ["price", "mandi", "market", "rate", "procurement", "msp", "wholesale", "retail"],
};

const AGRI_KEYWORDS = [
  "agriculture",
  "farming",
  "farm",
  "crop",
  "farmer",
  "agri",
  "mandi",
  "harvest",
  "soil",
  "irrigation",
  "pesticide",
];

const SUPPORTED_LANGUAGES = new Set([
  "en",
  "hi",
  "gu",
  "ta",
  "kn",
  "te",
  "ml",
  "mr",
  "pa",
  "bn",
  "as",
  "mni-Mtei",
  "ur",
  "or",
]);

const DASHBOARD_TEXTS = {
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
  cropNameBrinjal: "Brinjal",
  cropNameChillies: "Chillies",
  cropNameCitrus: "Citrus",
  cropNameCotton: "Cotton",
  cropNameGroundnut: "Groundnut",
  cropNameMango: "Mango",
  cropNameOkra: "Okra",
  cropNamePaddy: "Paddy",
  cropNamePomegranate: "Pomegranate",
  cropNameBanana: "Banana",
  cropNameTomato: "Tomato",
  cropNameCarrot: "Carrot",
  cropNameCabbage: "Cabbage",
  cropNamePotato: "Potato",
  cropNameOnion: "Onion",
  cropNameMaize: "Maize",
  cropNameWheat: "Wheat",
  cropNameSugarcane: "Sugarcane",
  cropNameTurmeric: "Turmeric",
  cropNameGinger: "Ginger",
  cropNameSoybean: "Soybean",
  cropNameSunflower: "Sunflower",
  cropNameSesame: "Sesame",
  cropNameMillet: "Millet",
  cropNameRagi: "Ragi",
  cropNameGreenGram: "Green Gram",
  cropNameBlackGram: "Black Gram",
  cropNamePapaya: "Papaya",
  cropNameGuava: "Guava",
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
  cropManagementTitle: "Crop Management",
  profileTitle: "My Profile",
  profileSubtitle: "View or edit your personal details",
  profileNameLabel: "Name",
  profileEmailLabel: "Email",
  profilePasswordLabel: "Password",
  profilePhotoLabel: "Profile Photo",
  profileSaveBtn: "Save Profile",
  profileHelpText: "Use this when you want to update your account info",
  settingsTitle: "Farm Settings",
  settingsSubtitle: "Configure your farm-related preferences",
  settingsCropTypeLabel: "Preferred crop type",
  settingsLandSizeLabel: "Land size (acres)",
  settingsIrrigationLabel: "Irrigation settings",
  settingsSaveBtn: "Save Settings",
  settingsHelpText: "Use this to customize how your farm data works in the app",
  reportsTitle: "Saved Reports",
  reportsSubtitle: "View reports you previously saved",
  reportsCardHeading: "Crop yield report",
  reportsDownloadBtn: "Download",
  reportsHelpText: "Use this to check past data or download reports",
  aboutSupportTitle: "About and Support",
  supportAboutUs: "About Us",
  supportContactUs: "Contact Us",
  supportFeedback: "Feedback",
  supportNotifications: "Notifications",
  pesticideKicker: "For leaf spot disease",
  pesticideTitle: "Recommended pesticide",
  pesticideCropLabel: "Select Crop",
  pesticideDiseaseLabel: "Select Disease",
  pesticideSearchBtn: "Next",
  pesticideInstructionsHeading: "Usage Instructions",
  pesticideSafetyHeading: "Safety Tips",
  pesticideListTitle: "Pesticide List",
  pesticideListIntro: "Click a pesticide to buy, book, or add to your farm.",
  pesticideSearchPlaceholder: "Search pesticide",
  pesticideAddHeading: "Add Custom Pesticide",
  pesticideNamePlaceholder: "Pesticide name",
  pesticideTypePlaceholder: "Type (e.g. Fungicide)",
  pesticideManufacturerPlaceholder: "Manufacturer",
  pesticidePricePlaceholder: "Price",
  pesticideAddBtn: "Add Pesticide",
  pesticideBuyButton: "Buy",
  pesticideBookButton: "Book",
  pesticideSaveButton: "Save",
  pesticideBookedLabel: "Booked ✓",
  pesticideManufacturerLabel: "Manufacturer",
  pesticideEmptyList: "No pesticides found. Add a new item.",
  pesticideDefaultInstruction: "Choose a crop and disease to reveal safe pesticide guidance.",
  pesticideDefaultSafety: "Use protective gloves, masks, and avoid contact with skin or eyes when handling pesticides.",
  pesticideDefaultDetail: "Follow label instructions and safety precautions.",
  navCropInfo: "Crop Info",
  navAdvisory: "Advisory",
  navPesticides: "Pesticides",
  navAgriForum: "Agri Forum",
  navCommunity: "Community",
  pageHeroHeading: "AgriTwin",
  pageHeroSubtext: "\"Your Soil's Digital Intelligence\"",
  pageHeroStartButton: "Get Started",
  signupJoinPlatform: "Join Our Platform",
  signupEmailLabel: "Email or Phone Number",
  signupPasswordLabel: "Password",
  signupIdentityPlaceholder: "Enter your email or phone number",
  signupPasswordPlaceholder: "Create a password",
  signupBtn: "Sign Up",
  signupHint: "Use your email or phone number to create your account.",
  signupAuthText: "Already have an account?",
  signupLoginLink: "Login",
  loginTitle: "Login",
  loginIdentityLabel: "Email or Phone Number",
  loginPasswordLabel: "Password",
  loginIdentityPlaceholder: "Enter your email or phone number",
  loginPasswordPlaceholder: "Enter your password",
  loginBtn: "Launch",
  loginHelper: "Login with the same details you used in sign up.",
  loginNoAccountText: "Don't have an account?",
  loginSignUpLink: "Sign Up",
  languageKicker: "AgriTwin",
  languageHeading: "Select Your Language",
  languageSubtitle: "Choose your preferred language to continue",
  languageSearchPlaceholder: "Search language",
  languageSelectedLabel: "Selected language:",
  languageSubmitBtn: "Submit & Proceed",
  cropManagementTitle: "Crop Management",
  cropAddCropBtn: "Add Crop",
  cropAddedCropsHeading: "My Added Crops",
  cropAddedEmpty: "No crops added yet. Tap Add Crop to continue.",
  cropModalTitle: "Add Crop",
  cropModalCropLabel: "Crop:",
  cropModalTypeLabel: "Cultivation Type",
  cropModalYearLabel: "Year",
  cropModalAreaLabel: "Cultivation Area",
  cropModalYearPlaceholder: "Select year",
  cropModalAreaPlaceholder: "Enter area",
  cropModalAddBtn: "ADD CROP",
  cropSelectHeading: "Select Your Crops",
  cropSearchPlaceholder: "Search for crops",
  cropTypeLabel: "Type",
  cropYearLabel: "Year",
  cropAreaLabel: "Area",
  marketTitle: "Market Advisory",
  marketStateLabel: "State",
  marketCropLabel: "Select Crop",
  marketDateMeta: "{date}",
  marketCurrentPricesHeading: "Current crop prices (based on location)",
  marketPriceTrendHeading: "Price trends (graph)",
  marketBestTimeHeading: "Best time to sell",
  marketNearbyHeading: "Nearby markets (mandis)",
  marketDistrictHeading: "District Price Details",
  marketSelectPrompt: "Select state and crop.",
  marketPriceMetaText: "Location-aware district price will appear here.",
  marketBestSellTimeDefault: "Select state and crop to get suggestion.",
  dealerTitle: "Agri Dealers",
  dealerRefreshBtn: "Refresh nearby dealers",
  dealerNearestKicker: "Nearest Shop",
  dealerMapTitle: "Directions (Map)",
  dealerMapLinkBtn: "Open Full Map",
  dealerSearchPlaceholder: "Search shop, location, products",
  productsTitle: "Buy/Sell Agri Products",
  productsRefreshBtn: "Refresh products",
  productsSearchPlaceholder: "Search products, category, seller",
  productsCountSuffix: "products",
  equipmentTitle: "Find Equipments",
  equipmentRefreshBtn: "Refresh nearby rentals",
  rentalsLocationLabel: "📍 {location}",
  rentalsChangeLocation: "Change Location",
  rentalsNearbyFilter: "Near By",
  rentalsAllFilter: "All",
  rentalsMetaLoading: "Loading equipment availability...",
  rentalsShowingNearby: "Showing only nearby rentals",
  rentalsShowingAll: "Showing all rental places",
  rentalsNoneNearby: "No nearby tractors/harvesters/tools right now. Try ALL or change location.",
  rentalsUnavailable: "Equipments not available near your location",
  addPriceChartEmpty: "Add mandi prices to generate chart",
  priceMarketLabel: "Market",
  priceMaxLabel: "Max Price",
  priceAvgLabel: "Avg Price",
  postAreaLabel: "Area",
  postStageLabel: "Stage",
  productCategoryLabel: "Category",
  productPriceLabel: "Price",
  productQuantityLabel: "Quantity",
  buyNowLabel: "Buy Now",
  orderLabel: "Order",
  callLabel: "Call",
  directionsLabel: "Directions",
  openNowLabel: "Open Now",
  closedLabel: "Closed",
  distanceUnavailableText: "Distance unavailable",
  noDealersFoundText: "No dealers matched your search.",
  noProductsFoundText: "No products found for this filter.",
  bookedLabel: "Booked ✓",
  addedLabel: "Added ✓",
  rentedLabel: "Booked ✓",
  bookNowLabel: "Book now",
  availableLabel: "Available",
  unavailableLabel: "Not available",
  distanceAwayLabel: "km away",
  reviewsText: "reviews",
  orderedLabel: "Ordered ✓",
  categoryWeather: "weather",
  categoryDisease: "disease",
  categoryPrice: "price",
  categoryAgriUpdate: "agri update",
};

const cache = new Map();
const CACHE_TTL_MS = 5 * 60 * 1000;
let fallbackRotation = 0;
const dashboardTextCache = new Map();
const DASHBOARD_TEXT_CACHE_TTL_MS = 24 * 60 * 60 * 1000;

const FALLBACK_NOTIFICATION_POOL = {
  weather: [
    {
      title: "Rain watch update: Delay irrigation in rain-prone blocks",
      description: "Rainfall probability is increasing in several regions. Avoid overwatering and inspect drainage paths.",
    },
    {
      title: "Heat stress advisory: Midday field operations should be reduced",
      description: "High daytime temperatures may stress tender crops. Prefer irrigation in early morning or late evening.",
    },
    {
      title: "Wind alert: Secure nursery sheets and drip lines",
      description: "Strong winds may damage young plants and loose irrigation lines. Reinforce exposed field sections.",
    },
  ],
  disease: [
    {
      title: "Fungal disease alert: Check lower leaves for fresh spots",
      description: "Moist conditions can trigger fungal growth. Remove infected foliage early and avoid overhead irrigation.",
    },
    {
      title: "Pest scouting update: Inspect undersides of leaves today",
      description: "Early pest signs often appear below leaf surfaces. Monitor for clusters and act before spread.",
    },
    {
      title: "Crop health reminder: Watch yellowing and sudden wilting",
      description: "Unexpected yellow patches can indicate disease pressure. Mark affected zones for targeted treatment.",
    },
  ],
  price: [
    {
      title: "Mandi trend: Compare district and nearby market prices",
      description: "Rate differences are widening between nearby markets. Verify transport cost before final sale decision.",
    },
    {
      title: "Price movement advisory: Hold dispatch until evening update",
      description: "Daily rates are fluctuating quickly. Check fresh updates before dispatching perishable produce.",
    },
    {
      title: "Procurement alert: Local buying demand improving",
      description: "Buyer activity in some clusters is rising. Re-evaluate lot timing and grading for better returns.",
    },
  ],
};

app.use(express.json());
app.use((req, res, next) => {
  if (req.path === "/" || req.path.endsWith(".html") || req.path.startsWith("/api/notifications")) {
    res.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    res.set("Pragma", "no-cache");
    res.set("Expires", "0");
  }
  next();
});
app.use(express.static(path.join(__dirname)));

const trimText = (value = "", maxLength = 160) => {
  const cleaned = String(value).replace(/\s+/g, " ").trim();
  if (cleaned.length <= maxLength) {
    return cleaned;
  }
  return `${cleaned.slice(0, maxLength - 3)}...`;
};

const hashText = (value = "") => {
  let hash = 0;
  const text = String(value);
  for (let i = 0; i < text.length; i += 1) {
    hash = (hash * 31 + text.charCodeAt(i)) >>> 0;
  }
  return hash;
};

const getCategoryImage = (category, seedText = "") => {
  const key = Object.prototype.hasOwnProperty.call(CATEGORY_IMAGES, category) ? category : "weather";
  const pool = CATEGORY_IMAGES[key];
  if (!Array.isArray(pool) || pool.length === 0) {
    return DEFAULT_IMAGE;
  }

  const index = hashText(seedText) % pool.length;
  return pool[index];
};

const isValidImageUrl = (value) => /^https?:\/\//i.test(String(value || "").trim());

const inferCategory = (text) => {
  const lowerText = text.toLowerCase();
  if (CATEGORY_KEYWORDS.weather.some((word) => lowerText.includes(word))) {
    return "weather";
  }
  if (CATEGORY_KEYWORDS.disease.some((word) => lowerText.includes(word))) {
    return "disease";
  }
  if (CATEGORY_KEYWORDS.price.some((word) => lowerText.includes(word))) {
    return "price";
  }
  return null;
};

const isAgricultureRelevant = (text) => {
  const lowerText = text.toLowerCase();
  return AGRI_KEYWORDS.some((word) => lowerText.includes(word));
};

const normalizeArticle = (article, index) => {
  const title = trimText(article.title || "Untitled update", 130);
  const description = trimText(article.description || article.content || "No details available yet.", 190);
  const searchText = `${title} ${description}`;
  const category = inferCategory(searchText);

  if (!category || !isAgricultureRelevant(searchText)) {
    return null;
  }

  const sourceImage = String(article.urlToImage || article.thumbnail || "").trim();
  const imageUrl = isValidImageUrl(sourceImage)
    ? sourceImage
    : getCategoryImage(category, `${title}-${index}`);

  return {
    id: `${Date.now()}-${index}`,
    title,
    description,
    category,
    imageUrl,
    sourceUrl: article.url || "",
    publishedAt: article.publishedAt || new Date().toISOString(),
  };
};

const fetchNewsApiArticles = async () => {
  if (!NEWS_API_KEY) {
    throw new Error("NEWS_API_KEY missing");
  }

  const query = encodeURIComponent("agriculture farming india crop mandi weather disease price");
  const url = `https://newsapi.org/v2/everything?q=${query}&language=en&sortBy=publishedAt&pageSize=40&apiKey=${NEWS_API_KEY}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`NewsAPI failed with status ${response.status}`);
  }

  const payload = await response.json();
  if (!payload || !Array.isArray(payload.articles)) {
    throw new Error("Invalid NewsAPI response");
  }

  return payload.articles;
};

const fetchRssFallbackArticles = async () => {
  const feedUrl =
    "https://news.google.com/rss/search?q=agriculture%20farming%20india%20crop%20price%20weather&hl=en-IN&gl=IN&ceid=IN:en";
  const proxyUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feedUrl)}&count=30`;

  const response = await fetch(proxyUrl);
  if (!response.ok) {
    throw new Error("RSS fallback unavailable");
  }

  const payload = await response.json();
  if (!payload || !Array.isArray(payload.items)) {
    throw new Error("Invalid RSS fallback payload");
  }

  return payload.items.map((item) => ({
    title: item.title,
    description: item.description,
    url: item.link,
    urlToImage: item.thumbnail,
    publishedAt: item.pubDate,
  }));
};

const translateTexts = async (texts, targetLanguage) => {
  if (!texts.length || targetLanguage === "en" || !GOOGLE_TRANSLATE_API_KEY) {
    if (!texts.length || targetLanguage === "en") {
      return texts;
    }

    try {
      const translated = await Promise.all(
        texts.map(async (text) => {
          const endpoint = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${encodeURIComponent(
            targetLanguage
          )}&dt=t&q=${encodeURIComponent(text)}`;

          const response = await fetch(endpoint, { cache: "no-store" });
          if (!response.ok) {
            throw new Error("public translator request failed");
          }

          const payload = await response.json();
          if (!Array.isArray(payload) || !Array.isArray(payload[0])) {
            throw new Error("public translator response invalid");
          }

          const translatedText = payload[0].map((item) => (Array.isArray(item) ? item[0] : "")).join("").trim();
          return translatedText || text;
        })
      );

      return translated;
    } catch {
      return texts;
    }
  }

  const endpoint = `https://translation.googleapis.com/language/translate/v2?key=${GOOGLE_TRANSLATE_API_KEY}`;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      q: texts,
      target: targetLanguage,
      format: "text",
      source: "en",
    }),
  });

  if (!response.ok) {
    throw new Error("Google Translate request failed");
  }

  const payload = await response.json();
  const translations = payload && payload.data && Array.isArray(payload.data.translations)
    ? payload.data.translations.map((item) => item.translatedText || "")
    : [];

  if (!translations.length) {
    throw new Error("Google Translate response missing translations");
  }

  return texts.map((original, index) => translations[index] || original);
};

const translateNotifications = async (items, targetLanguage) => {
  if (!items.length || targetLanguage === "en") {
    return items;
  }

  const titleTexts = items.map((item) => item.title);
  const descTexts = items.map((item) => item.description);
  const categoryTexts = items.map((item) => item.category);

  try {
    const [translatedTitles, translatedDescriptions, translatedCategories] = await Promise.all([
      translateTexts(titleTexts, targetLanguage),
      translateTexts(descTexts, targetLanguage),
      translateTexts(categoryTexts, targetLanguage),
    ]);

    return items.map((item, index) => ({
      ...item,
      title: translatedTitles[index] || item.title,
      description: translatedDescriptions[index] || item.description,
      category: translatedCategories[index] || item.category,
    }));
  } catch {
    return items;
  }
};

const readCache = (language) => {
  const cached = cache.get(language);
  if (!cached) {
    return null;
  }

  if (cached.source === "fallback") {
    return null;
  }

  if (Date.now() - cached.cachedAt > CACHE_TTL_MS) {
    cache.delete(language);
    return null;
  }

  return cached;
};

const writeCache = (language, payload) => {
  cache.set(language, { ...payload, cachedAt: Date.now() });
};

const buildFallbackItems = () => {
  fallbackRotation += 1;
  const categories = ["weather", "disease", "price"];

  return categories.map((category, index) => {
    const pool = FALLBACK_NOTIFICATION_POOL[category];
    const item = pool[(fallbackRotation + index) % pool.length];

    return {
      id: `${Date.now()}-fallback-${category}-${index}`,
      title: item.title,
      description: item.description,
      category,
      imageUrl: getCategoryImage(category, `${item.title}-${fallbackRotation}`),
      sourceUrl: "",
      publishedAt: new Date(Date.now() - index * 11 * 60000).toISOString(),
    };
  });
};

app.get("/api/notifications", async (req, res) => {
  const rawLang = String(req.query.lang || "en").trim();
  const language = SUPPORTED_LANGUAGES.has(rawLang) ? rawLang : "en";

  const cached = readCache(language);
  if (cached) {
    return res.json({ ...cached, cached: true });
  }

  let source = "newsapi";
  let rawArticles = [];

  try {
    rawArticles = await fetchNewsApiArticles();
  } catch {
    try {
      source = "rss-fallback";
      rawArticles = await fetchRssFallbackArticles();
    } catch {
      source = "fallback";
      rawArticles = [];
    }
  }

  let items = rawArticles
    .map((article, index) => normalizeArticle(article, index))
    .filter(Boolean)
    .slice(0, 8);

  if (!items.length) {
    items = buildFallbackItems();
    source = "fallback";
  }

  const translatedItems = await translateNotifications(items, language);

  const payload = {
    items: translatedItems,
    source,
    language,
    updatedAt: new Date().toISOString(),
    refreshWindowMinutes: { min: 5, max: 10 },
  };

  writeCache(language, payload);
  return res.json({ ...payload, cached: false });
});

app.get("/api/dashboard-texts", async (req, res) => {
  const rawLang = String(req.query.lang || "en").trim();
  const language = SUPPORTED_LANGUAGES.has(rawLang) ? rawLang : "en";

  if (language === "en") {
    return res.json({ language, texts: DASHBOARD_TEXTS, cached: false });
  }

  const cached = dashboardTextCache.get(language);
  if (cached && Date.now() - cached.cachedAt <= DASHBOARD_TEXT_CACHE_TTL_MS) {
    return res.json({ language, texts: cached.texts, cached: true });
  }

  const keys = Object.keys(DASHBOARD_TEXTS);
  const values = keys.map((key) => DASHBOARD_TEXTS[key]);
  const translatedValues = await translateTexts(values, language);

  const texts = keys.reduce((acc, key, index) => {
    acc[key] = translatedValues[index] || DASHBOARD_TEXTS[key];
    return acc;
  }, {});

  dashboardTextCache.set(language, { texts, cachedAt: Date.now() });
  return res.json({ language, texts, cached: false });
});

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "agrolink-notification-api" });
});

app.get("*", (_req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Agrolink running on http://localhost:${PORT}`);
});
