import { component$, useSignal } from "@builder.io/qwik";
import { Link, routeLoader$ } from "@builder.io/qwik-city";
import type { Recipe, IngredientGroup } from "~/types";
import "./overview.css";

export const useRecipeLoader = routeLoader$(async ({ params }) => {
  // Simulate DB fetch
  const recipe: Recipe = {
    id: params.id,
    name: "Pistachio Bronte",
    category: "gelato",
    description: "Made with pure Bronte pistachio paste.",
    baseWeightGrams: 5000,
    agingTimeHours: 12,
    ingredients: [
      {
        id: "1",
        name: "Whole Milk",
        percentage: 56,
        unit: "g",
        group: "liquids",
      },
      {
        id: "2",
        name: "Cream 35%",
        percentage: 16,
        unit: "g",
        group: "liquids",
      },
      { id: "3", name: "Sucrose", percentage: 14, unit: "g", group: "sugars" },
      { id: "4", name: "Dextrose", percentage: 4, unit: "g", group: "sugars" },
      {
        id: "5",
        name: "Stabilizer",
        percentage: 0.5,
        unit: "g",
        group: "stabilizers",
      },
      {
        id: "6",
        name: "Pistachio Paste",
        percentage: 9.5,
        unit: "g",
        group: "flavorings",
      },
    ],
    steps: [
      {
        id: "s1",
        type: "weighing",
        instruction: "Weigh all ingredients accurately.",
      },
      {
        id: "s2",
        type: "pasteurization",
        instruction: "Pasteurize mix at 85°C for 5 minutes.",
        targetTemperature: 85,
      },
      {
        id: "s3",
        type: "aging",
        instruction: "Cool rapidly and age for 12 hours at 4°C.",
        targetTemperature: 4,
        durationMinutes: 720,
      },
      {
        id: "s4",
        type: "churning",
        instruction: "Churn in batch freezer until desired consistency.",
      },
    ],
  };
  return recipe;
});

export default component$(() => {
  const recipeSignal = useRecipeLoader();
  const recipe = recipeSignal.value;

  // Batch Size Adjustment
  const batchSize = useSignal(recipe.baseWeightGrams);

  const groupedIngredients = (groups: IngredientGroup[]) => {
    return groups
      .map((group) => ({
        group,
        items: recipe.ingredients.filter((i) => i.group === group),
      }))
      .filter((g) => g.items.length > 0);
  };

  const ingredientGroups = groupedIngredients([
    "liquids",
    "sugars",
    "stabilizers",
    "flavorings",
  ]);

  // Calculate adjusted weight based on batch size input
  const getAdjustedWeight = (percentage: number) => {
    return ((percentage / 100) * batchSize.value).toFixed(1);
  };

  return (
    <div class="overview-container">
      <header class="overview-header">
        <Link href="/" class="back-link">
          ← Back to Library
        </Link>
        <div class="header-content">
          <h1>{recipe.name}</h1>
          <p class="recipe-desc">{recipe.description}</p>
        </div>

        <div class="yield-control">
          <label>Total Batch Weight (g):</label>
          <input
            type="number"
            value={batchSize.value}
            onInput$={(ev, el) => (batchSize.value = Number(el.value))}
            class="yield-input"
          />
        </div>
      </header>

      <div class="overview-content">
        <section class="ingredients-section">
          <h2>Mise en Place</h2>
          <div class="ingredients-list">
            {ingredientGroups.map((groupData) => (
              <div key={groupData.group} class="ingredient-group">
                <h3 class="group-title">{groupData.group}</h3>
                <ul>
                  {groupData.items.map((ing) => (
                    <li key={ing.id} class="ingredient-item">
                      <span class="ing-name">{ing.name}</span>
                      <span class="ing-amount">
                        {getAdjustedWeight(ing.percentage)}{" "}
                        <small>{ing.unit}</small>
                      </span>
                      <span class="ing-percent">{ing.percentage}%</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section class="technique-section">
          <h2>Process Flow</h2>
          <div class="steps-preview">
            {recipe.steps.map((step, idx) => (
              <div key={step.id} class="step-card">
                <span class="step-number">{idx + 1}</span>
                <div class="step-info">
                  <p>{step.instruction}</p>
                  {step.targetTemperature && (
                    <span class="temp-badge">
                      🌡️ {step.targetTemperature}°C
                    </span>
                  )}
                  {step.durationMinutes && (
                    <span class="time-badge">
                      ⏱️ {step.durationMinutes / 60}h
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div class="aging-alert">
            <span class="icon">🕒</span>
            <div>
              <strong>Required Aging:</strong> {recipe.agingTimeHours} Hours at
              4°C
            </div>
          </div>
        </section>
      </div>

      <footer class="overview-footer">
        <Link href={`/recipe/${recipe.id}/cook`} class="start-btn">
          Initialize Batch Weighing
        </Link>
      </footer>
    </div>
  );
});
