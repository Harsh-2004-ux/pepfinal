# SmartStore AI — Implementation Checklist

## Backend (Express + MongoDB + JWT + AI + Analytics)

- [ ] Scaffold missing folders/files (routes/controllers/models/services/middleware)
- [ ] Complete `server/models/User.js`
- [ ] Add `server/models/Product.js` and `server/models/Sale.js`
- [ ] Implement auth routes/controllers + JWT middleware
- [ ] Implement product CRUD
- [ ] Implement AI generation endpoint (real OpenAI when key exists, mock fallback otherwise)
- [ ] Implement dashboard analytics endpoints (revenue series, top products, trending insights, AI suggestions, pricing recommendations)
- [ ] Optional: inventory low-stock detection wired into dashboard
- [ ] Smoke test backend endpoints

## Frontend (React + Vite + Tailwind + Chart.js)

- [ ] Update `my-react-app` dependencies
- [ ] Add Tailwind setup (tailwind.config.js + postcss.config.js) and wire into CSS
- [ ] Implement routing + AuthContext + protected dashboard
- [ ] Implement Products pages + CRUD + Product detail
- [ ] Implement AIPanel to generate descriptions/tags/captions
- [ ] Implement Dashboard UI (RevenueChart, TopProducts, AISuggestions, Pricing recs, Trending insights)
- [ ] Add minimal “record test sale” action to populate analytics
- [ ] Smoke test full flow: signup/login → CRUD product → AI generate → dashboard analytics

## GitHub PR

- [ ] Create branch `blackboxai/<name>`
- [ ] Make at least 7 meaningful commits
- [ ] Push branch and open PR: https://github.com/Harsh-2004-ux/pepfinal
