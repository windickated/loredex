<script lang="ts">
  import setColor from "../utils/color.ts";
  import getCharacterStories from "../utils/stories.ts";
  import { showModal, selectedCharacter } from "../stores/modal.ts";

  export let character;
  const {
    name,
    picture,
    appearance,
    lastSeen,
    location,
    dead,
    state,
    stories,
  } = character;

  let characterTile: HTMLElement | null;
  let deadMarkFocus: boolean = false;
  const color = setColor(state);

  function hideConnections() {
    const characterConnections = document.getElementById(
      `connections-[${name}]`
    ) as HTMLElement;
    characterConnections.style.opacity = "0";
    Array.from(characterConnections.childNodes).map((node) => {
      if (node.nodeName !== "path") return;
      const path = node as SVGPathElement;
      path!.style.strokeDasharray = "100%";
      path!.style.strokeDashoffset = "100%";
    });

    const allDates: HTMLParagraphElement[] = Array.from(
      document.querySelectorAll(".date")
    );
    allDates.map((date) => {
      date.style.textShadow = "none";
    });

    const allPlots: HTMLDivElement[] = Array.from(
      document.querySelectorAll(".date-plot")
    );
    allPlots.map((plot) => {
      styleInactivePlot(plot);
    });

    const storyTitles: HTMLParagraphElement[] = Array.from(
      document.querySelectorAll(".episode-title")
    );
    Array.from(storyTitles).map((date) => {
      date.style.textShadow = "none";
    });

    const storyPlots: HTMLDivElement[] = Array.from(
      document.querySelectorAll(".episode-plot")
    );
    storyPlots.map((plot) => {
      styleInactivePlot(plot);
    });

    if (dead) deadMarkFocus = false;
  }

  function showActiveConnections() {
    if (document.activeElement?.id === "search") return;

    const characterConnections = document.getElementById(
      `connections-[${name}]`
    ) as HTMLElement;
    characterConnections.style.opacity = "1";
    Array.from(characterConnections.childNodes).map((node) => {
      if (node.nodeName !== "path") return;
      const path = node as SVGPathElement;
      path!.style.strokeDasharray = "125%";
      path!.style.strokeDashoffset = "0";
    });

    const allDates: HTMLParagraphElement[] = Array.from(
      document.querySelectorAll(".date")
    );
    const allPlots: HTMLDivElement[] = Array.from(
      document.querySelectorAll(".date-plot")
    );
    if (lastSeen) {
      // date titles glow
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

      // time sections glow
      const activePlots = allPlots.filter((plot) => {
        if (
          appearance > Number(plot.classList[3]) ||
          lastSeen < Number(plot.classList[2])
        )
          return null;
        return plot;
      });
      activePlots.map((plot) => {
        styleActivePlot(plot);
      });
    } else if (appearance) {
      //single date title glow
      const activeDate = allDates.find(
        (date) => appearance < Number(date.classList[2])
      );
      activeDate!.style.textShadow = "0 0 0.1rem rgb(51, 226, 230)";

      //single time section glow
      const activePlot = allPlots.find(
        (plot) => appearance < Number(plot.classList[3])
      );
      if (activePlot) styleActivePlot(activePlot);
    }
    if (dead) deadMarkFocus = true;

    if (stories) {
      const characterStories = getCharacterStories(name);

      // episode titles glow
      const storyTitles: HTMLParagraphElement[] = Array.from(
        document.querySelectorAll(".episode-title")
      );
      const activeStoryTitles = Array.from(storyTitles).filter((title) => {
        let match: boolean = false;
        characterStories!.filter((story) => {
          if (title.className.match(story)) match = true;
        });
        if (match) return title;
        return null;
      });
      activeStoryTitles.map((title) => {
        title.style.textShadow = "0 0 0.1rem rgb(51, 226, 230)";
      });

      // episode sections glow
      const storyPlots: HTMLDivElement[] = Array.from(
        document.querySelectorAll(".episode-plot")
      );
      if (storyPlots.length > 0) {
        const activeStoryPlots = storyPlots.map((plot) => {
          let match: boolean = false;
          characterStories!.filter((story) => {
            if (plot.className.match(story)) match = true;
          });
          if (match) return plot;
          return null;
        });
        activeStoryPlots.map((plot) => {
          if (plot) styleActivePlot(plot);
        });
      }
    }
  }

  const styleActivePlot = (plot: HTMLDivElement) => {
    plot.style.backgroundImage =
      "linear-gradient(to bottom, rgba(51, 226, 230, 0), rgba(51, 226, 230, 0.15), rgba(51, 226, 230, 0))";
    plot.style.borderLeft = "0.1rem dashed rgba(51, 226, 230, 0.2)";
    plot.style.borderRight = "0.1rem dashed rgba(51, 226, 230, 0.2)";
  };

  const styleInactivePlot = (plot: HTMLDivElement) => {
    plot.style.backgroundImage = "none";
    plot.style.borderLeft = "0.05rem solid rgba(51, 226, 230, 0.1)";
    plot.style.borderRight = "0.05rem solid rgba(51, 226, 230, 0.1)";
  };

  const openCharacterWindow = (event: any) => {
    if (
      (event.type === "keydown" && event.key === "Enter") ||
      event.type === "click"
    ) {
      $showModal = "character";
      $selectedCharacter = character;
    }
  };
</script>

<section
  id={name}
  class="character"
  draggable="false"
  style="
    border-color: {color};
    {state !== 'neutral' ? `filter: drop-shadow(0 0 0.5rem ${color});` : ''}
    background-color: {location ? 'rgb(22, 30, 95)' : 'rgba(36, 65, 189, 0.9)'};
  "
  tabindex="0"
  role="button"
  aria-disabled="false"
  bind:this={characterTile}
  on:click={openCharacterWindow}
  on:keydown={openCharacterWindow}
  on:focus={showActiveConnections}
  on:pointerover={showActiveConnections}
  on:pointerout={hideConnections}
  on:blur={hideConnections}
>
  <img src={picture} alt={name} draggable="false" width="1024" height="1024" />
  <p style={dead ? "color: black; text-shadow: 0 0 0.1rem black;" : ""}>
    {name}
  </p>
  {#if dead}
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      class="death-svg dead"
      fill="rgb(45, 90, 216)"
      style="opacity: {deadMarkFocus ? '1' : '0'}"
    >
      <mask id="death-svg-mask">
        <rect width="512" height="512" fill="white" />
        <path
          d="M246.53 21.03c-62.334.34-123.514 15.678-165 39.44l-6.155 2.06c19.528 58.267 48.163 98.687 80.938 132.376l-1.72 67.47 64.5 30.437c-19 58.985-34.515 128.892-50.405 197.656h191.125c-10.308-47.13-20.516-94.494-32.157-138.72 23.774 28.113 46.51 61.63 67.063 104.313l16.842-8.094c-22.568-46.87-47.938-83.34-74.312-113.626l31.125-24.28-47.47-104.377 48.22-33.75c-18.963-35.457-37.446-71.306-72.28-92.656-32.51 19.993-52 56.712-72.22 92.5l-29.22 34.69c-28.89-25.67-54.975-53.34-76.093-90.532C192.195 60.42 315.858 47.172 419.656 72.56 373.43 35.602 309.392 20.69 246.53 21.032z"
          fill="black"
        />
      </mask>
      <rect width="512" height="512" mask="url(#death-svg-mask)" />
      <path
        fill={color}
        opacity="0.5"
        d="M246.53 21.03c-62.334.34-123.514 15.678-165 39.44l-6.155 2.06c19.528 58.267 48.163 98.687 80.938 132.376l-1.72 67.47 64.5 30.437c-19 58.985-34.515 128.892-50.405 197.656h191.125c-10.308-47.13-20.516-94.494-32.157-138.72 23.774 28.113 46.51 61.63 67.063 104.313l16.842-8.094c-22.568-46.87-47.938-83.34-74.312-113.626l31.125-24.28-47.47-104.377 48.22-33.75c-18.963-35.457-37.446-71.306-72.28-92.656-32.51 19.993-52 56.712-72.22 92.5l-29.22 34.69c-28.89-25.67-54.975-53.34-76.093-90.532C192.195 60.42 315.858 47.172 419.656 72.56 373.43 35.602 309.392 20.69 246.53 21.032z"
      />
    </svg>
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
    transition: all 0.3s ease-in-out;
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    border: 0.1rem solid gray;
    border-radius: 0.75rem;
    outline: none;
    font-size: 0.9rem;
    line-height: 1.5rem;
  }

  .character:hover,
  .character:active,
  .character:focus {
    background-color: rgb(45, 90, 216) !important;
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
    pointer-events: none;
  }

  img {
    width: 100%;
    height: auto;
    border-radius: 0.5rem;
    background-color: #010020;
  }

  p {
    max-width: 100%;
    text-align: center;
    padding-top: 0.25rem;
  }

  .dead {
    position: absolute;
    top: 0.1rem;
    left: 0.1rem;
    border-radius: 0.6rem;
    width: 7.1rem;
    height: 7.1rem;
    transition: all 0.3s ease-in-out;
    opacity: 0;
    pointer-events: none;
  }
</style>
