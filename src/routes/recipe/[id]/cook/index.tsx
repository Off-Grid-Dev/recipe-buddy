import { component$, useSignal, useVisibleTask$, $ } from "@builder.io/qwik";
import { Link, routeLoader$ } from "@builder.io/qwik-city";
import type { Recipe, Ingredient } from "~/types";
import "./cook.css";

export const useRecipeLoader = routeLoader$(async ({ params }) => {
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
    steps: [],
  };
  return recipe;
});

export default component$(() => {
  const recipeSignal = useRecipeLoader();
  const recipe = recipeSignal.value;

  const currentStepIndex = useSignal(0);
  const scaleWeight = useSignal(0);
  const isTared = useSignal(false);
  const isAdjusting = useSignal(false);

  // Explicitly type currentIngredient with Ingredient type
  const currentIngredient: Ingredient =
    recipe.ingredients[currentStepIndex.value];
  const targetWeight =
    recipe.baseWeightGrams * (currentIngredient.percentage / 100);

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    const interval = setInterval(() => {
      if (!isTared.value) {
        const noise = Math.random() * 1.5 - 0.75;
        scaleWeight.value = Math.max(0, scaleWeight.value + noise);
      }
    }, 200);
    return () => clearInterval(interval);
  });

  const handleTare = $(() => {
    scaleWeight.value = 0;
    isTared.value = true;
  });

  const handleNext = $(() => {
    if (currentStepIndex.value < recipe.ingredients.length - 1) {
      currentStepIndex.value++;
      isTared.value = false;
      scaleWeight.value = 0;
      isAdjusting.value = false;
    }
  });

  const handlePrev = $(() => {
    if (currentStepIndex.value > 0) {
      currentStepIndex.value--;
      isTared.value = false;
      scaleWeight.value = 0;
      isAdjusting.value = false;
    }
  });

  const getStatus = () => {
    const diff = scaleWeight.value - targetWeight;
    const tolerance = 2.0;
    if (Math.abs(diff) <= tolerance)
      return { text: "Perfect Weight", color: "var(--color-text-success)" };
    if (diff < 0)
      return { text: "Add More", color: "var(--color-text-primary)" };
    return { text: "Remove Excess", color: "var(--color-text-error)" };
  };

  const status = getStatus();
  const progressPercent = Math.min(
    100,
    (scaleWeight.value / targetWeight) * 100,
  );
  const isComplete = Math.abs(scaleWeight.value - targetWeight) <= 2.0;

  return (
    <div class="cook-container">
      <header class="cook-header">
        <Link href={`/recipe/${recipe.id}`} class="exit-link">
          Abort Batch
        </Link>
        <div class="header-info">
          <h2>{recipe.name}</h2>
          <div class="step-indicator">
            Ingredient {currentStepIndex.value + 1}{" "}
            <span class="separator">/</span> {recipe.ingredients.length}
          </div>
        </div>
      </header>

      <main class="cook-main">
        <div class="scale-display-card">
          <div class="ingredient-header">
            <span class="group-tag">{currentIngredient.group}</span>
            <h3 class="ingredient-name">{currentIngredient.name}</h3>
          </div>

          <div class="weight-readout">
            <span class="current-weight">{scaleWeight.value.toFixed(1)}</span>
            <span class="unit">g</span>
          </div>

          <div class="target-info">
            Target: <strong>{targetWeight.toFixed(1)}g</strong>
            <span class="percent-tag">({currentIngredient.percentage}%)</span>
          </div>

          <div class="status-message" style={{ color: status.color }}>
            {status.text}
          </div>

          <div class="progress-track">
            <div
              class="progress-fill"
              style={{
                width: `${progressPercent}%`,
                backgroundColor: status.color,
              }}
            ></div>
          </div>
        </div>

        <div class="controls-area">
          <button onClick$={handleTare} class="control-btn secondary">
            Tare Scale
          </button>

          {isAdjusting.value ? (
            <button
              onClick$={() => (isAdjusting.value = false)}
              class="control-btn success"
            >
              Confirm Adjustment
            </button>
          ) : (
            isComplete && (
              <button onClick$={handleNext} class="control-btn primary">
                {currentStepIndex.value === recipe.ingredients.length - 1
                  ? "Finish Batch"
                  : "Next Ingredient"}
              </button>
            )
          )}
        </div>

        {scaleWeight.value > targetWeight + 5 && !isAdjusting.value && (
          <div class="adjustment-alert">
            <h3>⚠️ Overweight</h3>
            <p>
              Exceeds tolerance by{" "}
              {(scaleWeight.value - targetWeight).toFixed(1)}g
            </p>
            <button
              onClick$={() => (isAdjusting.value = true)}
              class="link-btn"
            >
              Recalculate Remaining Ingredients
            </button>
          </div>
        )}
      </main>

      <nav class="cook-nav">
        <button
          onClick$={handlePrev}
          disabled={currentStepIndex.value === 0}
          class="nav-btn"
        >
          Previous
        </button>
        <button
          onClick$={handleNext}
          disabled={currentStepIndex.value === recipe.ingredients.length - 1}
          class="nav-btn"
        >
          Skip
        </button>
      </nav>
    </div>
  );
});
