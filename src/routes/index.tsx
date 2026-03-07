import { component$, useSignal } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import type { Recipe } from "~/types";
import "./index.css";

// Mock Data: Gelato Specific
const MOCK_RECIPES: Recipe[] = [
  {
    id: "pistachio",
    name: "Pistachio Bronte",
    category: "gelato",
    description: "Made with pure Bronte pistachio paste. Intense green color.",
    baseWeightGrams: 5000,
    ingredients: [],
    steps: [],
    agingTimeHours: 12,
    // imageUrl: "/images/pistachio.jpg",
  },
  {
    id: "stracciatella",
    name: "Stracciatella",
    category: "gelato",
    description: "Sweet cream base with hand-shaved dark chocolate flakes.",
    baseWeightGrams: 5000,
    ingredients: [],
    steps: [],
    agingTimeHours: 6,
    // imageUrl: "/images/stracciatella.jpg",
  },
  {
    id: "lemon-sorbet",
    name: "Lemon Sorbetto",
    category: "sorbetto",
    description: "Dairy-free, refreshing Sicilian lemon zest and juice.",
    baseWeightGrams: 4000,
    ingredients: [],
    steps: [],
    agingTimeHours: 4,
    // imageUrl: "/images/lemon.jpg",
  },
  {
    id: "dark-choc",
    name: "Dark Chocolate 70%",
    category: "gelato",
    description: "Rich cocoa base with balanced sweetness.",
    baseWeightGrams: 5000,
    ingredients: [],
    steps: [],
    agingTimeHours: 12,
    // imageUrl: "/images/chocolate.jpg",
  },
];

export default component$(() => {
  const searchQuery = useSignal("");

  // Reactive filtering
  // const filteredRecipes = useSignal<Recipe[]>(MOCK_RECIPES);

  // Update filtered list when search changes
  // In a real app, use useComputed$ or derive this in the render
  const getFilteredRecipes = () => {
    return MOCK_RECIPES.filter(
      (r) =>
        r.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        r.category.toLowerCase().includes(searchQuery.value.toLowerCase()),
    );
  };

  return (
    <div class="welcome-container">
      <header class="welcome-header">
        <div class="logo-area">
          <span class="logo-icon">❄️</span>
          <h1 class="app-title">Recipe Buddy</h1>
        </div>
        <p class="app-subtitle">Sweet Madness by Geir Tengs</p>
      </header>

      <section class="search-section">
        <div class="search-bar-wrapper">
          <span class="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search flavors (e.g., Pistachio, Sorbet)..."
            value={searchQuery.value}
            onInput$={(_ev, el) => (searchQuery.value = el.value)}
            class="search-input"
          />
        </div>
      </section>

      <main class="recipe-grid">
        {getFilteredRecipes().length > 0 ? (
          getFilteredRecipes().map((recipe) => (
            <Link
              href={`/recipe/${recipe.id}`}
              key={recipe.id}
              class="recipe-card"
            >
              <div class="card-image-placeholder">
                <span>{recipe.name.charAt(0)}</span>
              </div>
              <div class="card-content">
                <div class="card-header">
                  <h2>{recipe.name}</h2>
                  <span class={`badge badge-${recipe.category}`}>
                    {recipe.category}
                  </span>
                </div>
                <p>{recipe.description}</p>
                <div class="card-meta">
                  <span>⏱ {recipe.agingTimeHours}h Aging</span>
                  <span>⚖️ {recipe.baseWeightGrams / 1000}kg Batch</span>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div class="no-results">
            No recipes found matching "{searchQuery.value}"
          </div>
        )}
      </main>
    </div>
  );
});
