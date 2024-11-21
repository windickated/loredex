<script lang="ts">
  import setColor from "../utils/color.ts";

  export let name: string;
  export let state: string;
  export let image: string;
  export let timeline: number[];

  const shadowLength = (timeline[1] - timeline[0]) * 10 + 7.5;
  let characterShadow: HTMLDivElement | null;

  let character: HTMLElement | null;
  const color = setColor(state);

  function hideConnections() {
    const allConnections: HTMLDivElement[] = Array.from(
      document.querySelectorAll(".connection")
    );
    const allDates: HTMLParagraphElement[] = Array.from(
      document.querySelectorAll(".date")
    );
    allConnections.map((connection) => {
      connection.style.opacity = "0.05";
    });
    characterShadow!.style.opacity = "0";
    allDates.map((date) => {
      date.style.textShadow = "none";
    });
  }

  function showActiveConnections() {
    if (document.activeElement?.tagName === "INPUT") return;
    const allConnections: HTMLDivElement[] = Array.from(
      document.querySelectorAll(".connection")
    );
    const activeConnections = allConnections.filter((connection) =>
      connection.className.match(character!.id)
    );
    const allDates: HTMLParagraphElement[] = Array.from(
      document.querySelectorAll(".date")
    );
    activeConnections.map((connection) => {
      connection.style.opacity = "0.5";
    });
    characterShadow!.style.opacity = "0.25";
    if (timeline[1]) {
      const activeDates = allDates.filter((date) => {
        if (
          Number(date.classList[1]) < timeline[0] ||
          Number(date.classList[1]) > timeline[1]
        )
          return null;
        return date;
      });
      activeDates.map((date) => {
        date.style.textShadow = "0 0 0.1rem rgb(51, 226, 230)";
      });
    } else {
      const activeDate = allDates.find(
        (date) => Number(date.classList[1]) == timeline[0]
      );
      activeDate!.style.textShadow = "0 0 0.1rem rgb(51, 226, 230)";
    }
  }
</script>

<section
  id={name}
  class="character"
  draggable="false"
  style="border-color: {color}"
  tabindex="0"
  role="button"
  aria-disabled="false"
  bind:this={character}
  on:focus={showActiveConnections}
  on:pointerover={showActiveConnections}
  on:pointerleave={hideConnections}
  on:blur={hideConnections}
>
  <img src={image} alt={name} draggable="false" style="border-color: {color}" />
  <p>{name}</p>
  {#if timeline[1]}
    <div
      bind:this={characterShadow}
      class="character-shadow {name}"
      style="
        width: {shadowLength}rem;
        background: linear-gradient(
          to right,
          {color},
          rgba(36, 65, 189, 0)
        );
        filter: none;
      "
    ></div>
  {/if}
</section>

<style>
  .character {
    z-index: 1;
    position: relative;
    width: 7.5rem;
    height: auto;
    padding: 0.25rem;
    cursor: pointer;
    transition: all 0.15s ease-in-out;
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    background-color: rgba(36, 65, 189, 0.75);
    border: 0.05rem solid gray;
    border-radius: 0.75rem;
    outline: none;
  }

  .character:hover,
  .character:active,
  .character:focus {
    background-color: rgba(45, 90, 216, 0.9);
    color: rgba(51, 226, 230, 0.9);
    filter: drop-shadow(0 0 0.5vw rgba(51, 226, 230, 0.5));
    transform: scale(1.05);
  }

  img,
  p {
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -o-user-select: none;
    user-select: none;
  }

  img {
    width: 100%;
    border: 0.05rem solid gray;
    border-radius: 0.5rem;
  }

  p {
    max-width: 100%;
    text-align: center;
    font-size: 1rem;
    line-height: 1.5rem;
    padding-top: 0.25rem;
  }

  .character-shadow {
    z-index: -1;
    position: absolute;
    top: 0;
    left: 0;
    min-width: 7.5rem;
    min-height: 7.5rem;
    border-radius: 0.75rem;
    height: inherit;
    pointer-events: none;
    transition: all 0.3s ease-in-out;
    opacity: 0;
  }
</style>
