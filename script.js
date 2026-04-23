const icon = document.getElementById("appIcon");
const startButton = document.getElementById("startButton");
const appShell = document.getElementById("appShell");
const pageTrack = document.getElementById("pageTrack");
const signupForm = document.getElementById("signupForm");
const jumpLinks = document.querySelectorAll("[data-target-page]");
const pages = document.querySelectorAll(".page");

let activePage = 0;
let touchStartX = 0;
let touchDeltaX = 0;

const pageCount = 5;

const setActivePageState = () => {
  pages.forEach((page, index) => {
    page.classList.toggle("active", index === activePage);
  });
};

const goToPage = (index) => {
  activePage = Math.max(0, Math.min(index, pageCount - 1));
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

let selectedLanguage = null;

languageChips.forEach((chip) => {
  chip.addEventListener("click", () => {
    // Remove active class from previously selected chip
    languageChips.forEach((c) => c.classList.remove("selected"));
    
    // Add active class to clicked chip
    chip.classList.add("selected");
    
    // Store selected language
    selectedLanguage = chip.dataset.language;
    selectedLanguageName.textContent = chip.textContent;
    
    // Enable proceed button
    languageProceedBtn.disabled = false;
    
    // Add animation bounce
    chip.classList.add("bounce");
    setTimeout(() => chip.classList.remove("bounce"), 600);
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

// Proceed button functionality
if (languageProceedBtn) {
  languageProceedBtn.addEventListener("click", () => {
    if (selectedLanguage) {
      goToPage(4);
    }
  });
}

// Dashboard Logic
const dashboardMenuBtn = document.getElementById("dashboardMenuBtn");
const dashboardDrawer = document.getElementById("dashboardDrawer");
const dashboardDrawerClose = document.getElementById("dashboardDrawerClose");
const dashboardDrawerOverlay = document.getElementById("dashboardDrawerOverlay");
const dashboardSearch = document.getElementById("dashboardSearch");
const bottomNavItems = document.querySelectorAll(".bottom-nav-item");

const priceForm = document.getElementById("priceForm");
const postForm = document.getElementById("postForm");
const productForm = document.getElementById("productForm");
const priceChart = document.getElementById("priceChart");

const priceList = document.getElementById("priceList");
const postList = document.getElementById("postList");
const productList = document.getElementById("productList");
const productImageFileInput = document.getElementById("productImageFileInput");

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
  renderList(priceList, dashboardData.prices, createPriceCard, "No price cards yet. Add your first crop price.");
  renderList(postList, dashboardData.posts, createPostCard, "No community updates yet. Share the first update.");
  renderList(productList, dashboardData.products, createProductCard, "No products yet. Add the first product card.");
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

initDashboardData();

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

setActivePageState();
