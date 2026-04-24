 ##🌾 Project Title
Smart AgriTech Assistant

##📌 Problem Statement
Farmers face difficulty in predicting crop diseases, weather risks, and market prices, leading to financial loss and reduced productivity.

## 📖 Description
Agriculture is highly dependent on environmental conditions such as weather, soil quality, and pest attacks. Many farmers, especially in rural areas, lack access to real-time insights and expert guidance. This results in poor decision-making, crop damage, and low income.

There is a need for an intelligent system that can assist farmers in making better decisions using modern technology.

## 💡 Proposed Solution
We propose a Smart AgriTech Assistant that uses AI to:
- Detect crop diseases using image recognition  
- Provide real-time weather updates  
- Suggest suitable crops based on soil data  
- Predict market prices for better selling decisions  

This system will be accessible via a simple web/mobile interface, making it easy for farmers to use.

## 🛠️ Tech Stack (Optional)
- Frontend: HTML, CSS, JavaScript  
- Backend: Node.js  
- Database: MongoDB  
- AI Tools: Machine Learning APIs  



## Live Notification Feed Setup

This project now includes a backend-powered real-time agriculture notification feed with:
- Full-width feed cards (image, title, short description, time)
- Auto-refresh every 5 to 10 minutes
- Agriculture-focused filtering (weather, crop disease, mandi/price)
- Language-aware response support via backend translation

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy [.env.example](.env.example) values into your own environment:

- `NEWS_API_KEY`: key from NewsAPI
- `GOOGLE_TRANSLATE_API_KEY`: key for Google Translate API (for selected-language output)
- `PORT`: optional, defaults to `8000`

### 3. Run the app

```bash
npm run dev
```

Open: `http://localhost:8000`

### 4. API endpoint

Backend notification endpoint:

`GET /api/notifications?lang=hi`

Supported language codes include:
`en`, `hi`, `gu`, `ta`, `kn`, `te`, `ml`, `mr`, `pa`, `bn`, `as`, `mni-Mtei`, `ur`, `or`

