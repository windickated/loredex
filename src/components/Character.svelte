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
  let deadMark: HTMLImageElement | null;
  const color = setColor(state);

  function hideConnections() {
    const allConnections: HTMLDivElement[] = Array.from(
      document.querySelectorAll(".connection")
    );
    allConnections.map((connection) => {
      connection.style.opacity = "0";
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
    activeConnections.map((connection) => {
      connection.style.opacity = "1";
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
    if (dead) deadMark!.style.opacity = "0.9";

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
    filter: drop-shadow(0 0 0.1rem {color});
    background-color: {location
    ? 'rgba(51, 226, 230, 0.25)'
    : 'rgba(36, 65, 189, 0.9)'};
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
  <img src={picture} alt={name} draggable="false" width="1024" height="1024" />
  <p
    style={dead ? "color: black; text-shadow: 0 0 0.1rem rgba(0,0,0,0.5);" : ""}
  >
    {name}
  </p>
  {#if dead}
    <img class="dead" src="dead.png" alt="Dead" bind:this={deadMark} />
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
    border: 0.1rem solid gray;
    border-radius: 0.75rem;
    outline: none;
    font-size: 0.9rem;
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
    top: 0.5rem;
    left: 0;
    right: 0;
    margin-left: auto;
    margin-right: auto;
    height: 6.5rem;
    width: auto;
    transition: all 0.3s ease-in-out;
    background-color: rgba(0, 0, 0, 0);
    filter: drop-shadow(0 0 0.1rem rgba(51, 226, 230, 0.9));
    opacity: 0;
  }
</style>
