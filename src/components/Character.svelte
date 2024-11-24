<script lang="ts">
  import setColor from "../utils/color.ts";
  import { timeSectionWidth } from "../data/mapData.ts";
  import {
    showModal,
    selectedCharacter,
    characterColor,
  } from "../stores/modal.ts";

  export let character;
  const { name, appearance, lastSeen, dead = false, state, image } = character;
  export let touchscreenDevice: boolean = false;

  let shadowLength: number = 0;
  let characterTile: HTMLElement | null;
  let characterShadow: HTMLDivElement | null;
  let deadMark: HTMLImageElement | null;
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
    allDates.map((date) => {
      date.style.textShadow = "none";
    });
    if (characterShadow) characterShadow.style.opacity = "0";
    if (dead) deadMark!.style.opacity = "0";
  }

  function showActiveConnections() {
    if (document.activeElement?.tagName === "INPUT") return;
    const allConnections: HTMLDivElement[] = Array.from(
      document.querySelectorAll(".connection")
    );
    const activeConnections = allConnections.filter((connection) =>
      connection.className.match(characterTile!.id)
    );
    const allDates: HTMLParagraphElement[] = Array.from(
      document.querySelectorAll(".date")
    );
    activeConnections.map((connection) => {
      connection.style.opacity = "0.5";
    });
    if (lastSeen) {
      const activeDates = allDates.filter((date) => {
        if (
          appearance > Number(date.classList[2]) ||
          lastSeen < Number(date.classList[1])
        )
          return null;
        return date;
      });
      activeDates.map((date) => {
        date.style.textShadow = "0 0 0.1rem rgb(51, 226, 230)";
      });
      shadowLength = activeDates.length * 10 - 10;
    } else {
      const activeDate = allDates.find(
        (date) => appearance < Number(date.classList[2])
      );
      activeDate!.style.textShadow = "0 0 0.1rem rgb(51, 226, 230)";
    }
    if (characterShadow) characterShadow.style.opacity = "0.25";
    if (dead) deadMark!.style.opacity = "0.25";
  }

  const openCharacterWindow = (event: any) => {
    if (
      (event.type === "keydown" && event.key === "Enter") ||
      event.type === "click"
    ) {
      $showModal = true;
      $selectedCharacter = character;
      $characterColor = color;
      console.log($selectedCharacter);
    }
  };
</script>

<section
  id={name}
  class="character"
  draggable="false"
  style="
    border-color: {color};
    filter: drop-shadow(0 0 0.1rem {color});
    width: {timeSectionWidth * 0.75}rem;
  "
  tabindex="0"
  role="button"
  aria-disabled="false"
  bind:this={characterTile}
  on:click={openCharacterWindow}
  on:keydown={openCharacterWindow}
  on:focus={showActiveConnections}
  on:pointerover={showActiveConnections}
  on:pointerleave={hideConnections}
  on:blur={hideConnections}
>
  <img src={image} alt={name} draggable="false" />
  <p
    style={dead ? "color: black; text-shadow: 0 0 0.1rem rgba(0,0,0,0.5);" : ""}
  >
    {name}
  </p>
  {#if lastSeen && !touchscreenDevice}
    <div
      bind:this={characterShadow}
      class="character-shadow {name}"
      style="
        width: {shadowLength}rem;
        min-height: {timeSectionWidth * 0.825}rem;
        background: linear-gradient(
          to right,
          {color},
          rgba(36, 65, 189, 0)
        );
        filter: none;
      "
    ></div>
  {/if}
  {#if dead}
    <img class="dead" src="dead.png" alt="Dead" bind:this={deadMark} />
  {/if}
</section>

<style>
  .character {
    z-index: 1;
    position: relative;
    height: auto;
    padding: 0.25rem;
    cursor: pointer;
    transition: all 0.15s ease-in-out;
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    background-color: rgba(36, 65, 189, 0.9);
    border: 0.1rem solid gray;
    border-radius: 0.75rem;
    outline: none;
  }

  .character:hover,
  .character:active,
  .character:focus {
    background-color: rgb(45, 90, 216);
    color: rgba(51, 226, 230, 0.9);
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
    border-radius: 0.5rem;
  }

  p {
    max-width: 100%;
    text-align: center;
    padding-top: 0.25rem;
  }

  .character-shadow {
    z-index: 0;
    position: absolute;
    top: 0.5rem;
    left: 100%;
    height: inherit;
    pointer-events: none;
    transition: all 0.3s ease-in-out;
    opacity: 0;
  }

  .dead {
    position: absolute;
    top: 0.5rem;
    left: 0;
    right: 0;
    margin-left: auto;
    margin-right: auto;
    height: 6.5rem;
    width: auto;
    transition: all 0.3s ease-in-out;
    opacity: 0;
  }

  @media only screen and (max-width: 600px) {
    .character-shadow {
      display: none;
    }
  }
</style>
