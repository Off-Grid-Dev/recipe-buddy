import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";

export default component$(() => {
  return (
    <>
      <h1>Recipe Buddy</h1>
      <h2>Chocolate Ice Cream Recipe</h2>
      <div>
        <ul>
          <li>
            <p>
              <span>1500</span>
              <span>g</span>
              <span>milk</span>
            </p>
          </li>
        </ul>
      </div>
    </>
  );
});

export const head: DocumentHead = {
  title: "Chocolate recipe",
  meta: [
    {
      name: "description",
      content: "Chocolate ice cream recipe",
    },
  ],
};
