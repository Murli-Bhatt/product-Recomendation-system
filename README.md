# product-Recomendation-system

An AI-powered Product Recommendation Engine built with **Vite**, **React**, **Tailwind CSS v4**, and the official **Groq SDK** utilizing `llama-3.3-70b-versatile`.

## 🚀 Features

- **Natural Language Product Search**: Type queries like *"phones under $500"* or *"laptops for gaming"*, and Groq AI will analyze your prompt against the catalog and return exact matches.
- **Strict Anti-Hallucination Guardrails**: System prompts strictly constrain model responses to catalog IDs, with double-check validation on the client.
- **Custom Preference AI Recommender**: Fine-tune recommendations by category, maximum budget, target use case, and detailed requirements.
- **AI Reasoning Insights**: Displays an explanation badge detailing why specific products were recommended for your request.
- **Responsive Catalog Grid**: Modular `ProductCard` and `ProductGrid` with skeleton loading states, empty state handling, and quick category filters.
- **Graceful Error Handling**: Smart fallbacks for offline mode, missing API keys, or API rate limits.

## 🛠️ Tech Stack

- **Framework**: Vite + React 19
- **Styling**: Tailwind CSS v4 + Lucide React Icons
- **AI Engine**: Groq SDK (`llama-3.3-70b-versatile`)
- **Package Manager**: npm

## 📦 Getting Started

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/Murli-Bhatt/product-Recomendation-system.git
cd product-Recomendation-system
npm install
```

### 2. Environment Configuration
Create a `.env` file in the root directory:
```env
VITE_GROQ_API_KEY=your_groq_api_key_here
```
*(Get your free Groq API key at [console.groq.com](https://console.groq.com/))*

### 3. Run Development Server
```bash
npm run dev
```
Open `http://localhost:5173/` in your browser.

### 4. Build for Production
```bash
npm run build
```

## 📄 License
MIT License
