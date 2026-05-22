# SmartStore AI — Build TODO

## Backend (Node.js/Express/MongoDB)
- [ ] Create `server/` scaffold with required folders/files:
  - server.js, .env.example
  - config/db.js
  - models/User.js, Product.js, Sale.js
  - routes/auth.routes.js, product.routes.js, ai.routes.js, dashboard.routes.js
  - controllers/auth.controller.js, product.controller.js, ai.controller.js, dashboard.controller.js
  - middleware/auth.middleware.js, error.middleware.js
  - services/openai.service.js, analytics.service.js
- [ ] Add backend dependencies + `server/package.json`
- [ ] Implement auth (signup/login) with JWT + bcrypt
- [ ] Implement product CRUD
- [ ] Implement AI generation endpoints (description, SEO tags, marketing captions)
- [ ] Implement analytics endpoints (revenue analytics, top products, trending insights, AI suggestions, pricing recommendations)
- [ ] Add inventory low-stock detection (optional) and wire into dashboard

## Frontend (React/Vite/Tailwind/Chart.js)
- [ ] Update `my-react-app/` dependencies: react-router, axios, tailwind, chart.js, react-chartjs-2
- [ ] Create required frontend folders/files:
  - src/pages/*
  - src/components/*
  - src/context/AuthContext.jsx
  - src/hooks/useProducts.js, useDashboard.js
  - src/api/auth.api.js, products.api.js, ai.api.js
- [ ] Implement routing + protected dashboard
- [ ] Implement Products CRUD UI + AI panel to generate content
- [ ] Implement Dashboard UI: RevenueChart, TopProducts, AISuggestions, etc.

## End-to-end
- [ ] Configure API base URL + CORS
- [ ] Run frontend and backend locally
- [ ] Smoke test: signup/login → add product → AI generate → dashboard analytics

