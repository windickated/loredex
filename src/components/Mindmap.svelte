<script lang="ts">
  import { onMount } from "svelte";
  import characters from "../data/characters.ts";
  import { timeline, stories } from "../data/timeline.ts";
  import Character from "./Character.svelte";
  import Connection from "./Connection.svelte";
  import { showModal } from "../stores/modal.ts";
  import {
    activeSeasonNr,
    setActiveSeason,
    setSeasonPadding,
    getSeasonName,
  } from "../stores/season.ts";
  import Modal from "./Modal.svelte";

  let mapContainer: HTMLElement | null;
  let dragMap: HTMLDivElement | null;
  let mapZoom: number = 1;
  let mapScrollX: number;
  let mapScrollY: number;
  let startX: number = 0;
  let startY: number = 0;
  let isDragging: boolean = false;
  let searchField: string;

  $: activeSeason = stories.find(
    (section) => section.season === $activeSeasonNr
  );

  onMount(() => {
    mapZoom = 0.3;
  });

  const handlePointerDown = (event: PointerEvent) => {
    isDragging = true;
    const { clientX, clientY } = event;
    startX = clientX;
    startY = clientY;
    mapScrollX = mapContainer!.scrollLeft;
    mapScrollY = mapContainer!.scrollTop;
    dragMap!.style.cursor = "grabbing";
  };

  const handlePointerMove = (event: PointerEvent) => {
    if (isDragging) {
      const { clientX, clientY } = event;
      mapContainer!.scrollTo({
        left: mapScrollX + (startX - clientX),
        top: mapScrollY + (startY - clientY),
      });
    }
  };

  const handlePointerUp = () => {
    isDragging = false;
    dragMap!.style.cursor = "grab";
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key == "-" || event.key == "=") event.preventDefault();
    else return;
    let zoom: number;
    if (event.key == "-") {
      zoom = mapZoom - 0.05;
      mapZoom = setZoom(zoom);
    } else if (event.key == "=") {
      zoom = mapZoom + 0.05;
      mapZoom = setZoom(zoom);
    }
  };

  const handleZoomWheel = (event: WheelEvent) => {
    const { deltaY, ctrlKey, metaKey } = event;
    if (!(ctrlKey || metaKey)) return;
    event.preventDefault();
    let zoom: number;
    zoom = deltaY > 0 ? mapZoom - 0.05 : mapZoom + 0.05;
    mapZoom = setZoom(zoom);
  };

  function setZoom(zoom: number): number {
    return zoom < 0.1 ? 0.1 : zoom > 1.6 ? 1.6 : zoom;
  }

  const handleSearch = () => {
    if (!searchField) {
      resetSearch();
      return;
    }
    const allCharacters: HTMLElement[] = Array.from(
      document.querySelectorAll(".character")
    );
    allCharacters.map((character) => {
      character.ariaDisabled = "true";
      if (character.id.toLowerCase().match(searchField.toLowerCase()))
        character.ariaDisabled = "false";
    });
  };

  const resetSearch = () => {
    const allCharacters: HTMLElement[] = Array.from(
      document.querySelectorAll(".character")
    );
    allCharacters.map((character) => {
      character.ariaDisabled = "false";
    });
  };

  const showTimeline = () => {
    $showModal = "timeline";
  };
</script>

<svelte:window on:keydown={handleKeyDown} />

<div class="logo">LOREDEX</div>

<header>
  <h1>
    <a href="https://degenerousdao.com/" target="_blank">
      <img src="/logo.avif" alt="DGRS" />
    </a>
    LOREDEX
  </h1>
  <section class="controllers">
    <div class="search-wrapper">
      <button on:click={showTimeline}>
        <img src="time.png" alt="Time" />
      </button>
      <div class="search">
        <img src="search.png" alt="Search" />
        <input
          bind:value={searchField}
          on:input={handleSearch}
          on:focus={handleSearch}
          on:blur={resetSearch}
          placeholder="Find a character..."
        />
      </div>
    </div>
    <div class="zoom">
      <!-- svelte-ignore a11y_no_noninteractive_element_to_interactive_role a11y_click_events_have_key_events -->
      <div class="zoom-slider">
        <img
          src="/zoom-out.png"
          alt="Zoom out"
          role="button"
          tabindex="0"
          on:click={() => {
            mapZoom = 0.1;
          }}
        />
        <input
          type="range"
          min="0.1"
          max="1.6"
          step="0.025"
          bind:value={mapZoom}
        />
        <img
          src="/zoom-in.png"
          alt="Zoom in"
          role="button"
          tabindex="0"
          on:click={() => {
            mapZoom = 1.6;
          }}
        />
      </div>
      <button
        class="zoom-info"
        on:click={() => {
          mapZoom = 0.2;
        }}
      >
        {Math.round(mapZoom * 2.5 * 100)}%
      </button>
    </div>
  </section>
</header>

<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_noninteractive_element_interactions -->
<main bind:this={mapContainer} on:wheel={handleZoomWheel}>
  <div
    class="map-wrapper blur"
    style="transform: scale({mapZoom})"
    bind:this={dragMap}
    on:pointerdown={handlePointerDown}
    on:pointerup={handlePointerUp}
    on:pointerleave={handlePointerUp}
    on:pointermove={handlePointerMove}
  >
    <section
      class="map"
      style="
        width: {timeline.length * 10}rem;
        grid-template-columns: repeat({timeline.length}, 10rem);
      "
    >
      {#each timeline as { date, note, action, emptySection, expandable }}
        <div
          class="plot date-plot {date[0]} {date[1]}"
          style="padding-bottom: {expandable !== undefined ? '7.5rem' : ''}"
        >
          <div class="date {date[0]} {date[1]}">
            {#if !emptySection}
              <p>{date[0]} A.A.</p>
              {#if note}
                <p class="note">{note}</p>
              {/if}
              {#if action}
                <p class="action">{action}</p>
              {/if}
            {:else}
              <p>...</p>
            {/if}
          </div>
          {#each characters as character}
            {#if date[0] <= character.appearance! && date[1] >= character.appearance!}
              <Character {character} />
            {/if}
          {/each}
          {#if expandable !== undefined}
            <div
              class="expandable-arrow"
              role="button"
              tabindex="0"
              data-season={expandable}
              on:click={setActiveSeason}
            >
              <p>{getSeasonName(expandable, true)}</p>
              <img
                class="arrow"
                src={$activeSeasonNr == expandable
                  ? "/arrow-active.png"
                  : "/arrow-inactive.png"}
                alt="Arrow"
              />
            </div>
          {/if}
        </div>
      {/each}
      <section class="connections">
        {#each characters as character}
          {#if character.connections}
            {#if character.connections}
              {#if character.connections.allies}
                {#each character.connections.allies as ally}
                  <Connection
                    name1={character.name}
                    name2={ally}
                    color="rgba(0, 185, 55, 0.75)"
                  />
                {/each}
              {/if}
              {#if character.connections.enemies}
                {#each character.connections.enemies as enemy}
                  <Connection
                    name1={character.name}
                    name2={enemy}
                    color="rgba(255, 60, 64, 0.75)"
                  />
                {/each}
              {/if}
              {#if character.connections.neutral}
                {#each character.connections.neutral as neutral}
                  <Connection
                    name1={character.name}
                    name2={neutral}
                    color="rgba(150, 150, 150, 0.75)"
                  />
                {/each}
              {/if}
            {/if}
          {/if}
        {/each}
      </section>
    </section>
    {#if activeSeason}
      <section
        class="mini-map"
        style="left: {setSeasonPadding(activeSeason.season)}rem"
      >
        {#each activeSeason.episodes as { title, date }, index}
          <div class="plot episode-plot {title}">
            <div class="episode-title {title}">
              {#if activeSeason.season !== 99}
                <p>Episode - {index + 1}</p>
              {/if}
              <p class="note">{title}</p>
              {#if date}
                <p>{date} A.A.</p>
              {/if}
            </div>
            {#each characters as character}
              {#if character.stories}
                {#each character.stories as stories}
                  {#if stories.season === activeSeason.season}
                    {#each stories.episodes as story}
                      {#if story === title}
                        <Character {character} />
                      {/if}
                    {/each}
                  {/if}
                {/each}
              {/if}
            {/each}
          </div>
        {/each}
      </section>
    {/if}
  </div>
</main>

<Modal />

<style lang="scss">
  .logo {
    z-index: 100;
    position: fixed;
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 10vw;
    color: transparent;
    background-image: linear-gradient(
      to right,
      rgba(51, 226, 230, 0.1),
      rgba(51, 226, 230, 0.25),
      rgb(51, 226, 230),
      rgba(51, 226, 230, 0.25),
      rgba(51, 226, 230, 0.1)
    );
    background-clip: text;
    background-size: 200% auto;
    opacity: 0;
    filter: drop-shadow(0 0 0.5vw rgba(51, 226, 230, 0.5));
    animation: logo 3s linear 0.3s forwards;
  }

  header {
    width: 100vw;
    margin-block: 3vh 2vh;
    padding-inline: 2.5vw;
    display: flex;
    flex-direction: row nowrap;
    justify-content: space-between;
    align-items: center;
    opacity: 0;
    animation: showScale 1s linear 3s forwards;
    cursor: default;

    h1 {
      font-size: 2vw;
      line-height: 1.5;
      color: rgba(51, 226, 230, 0.25);
      text-shadow: 0 0 0.1vw rgba(51, 226, 230, 0.5);
      display: flex;
      flex-direction: row nowrap;
      justify-content: center;
      align-items: center;
      gap: 1vw;

      a {
        width: 2.5vw;
        height: 2.5vw;
        opacity: 0.75;

        img {
          width: 100%;
        }

        &:hover,
        &:active {
          opacity: 0.9;
        }
      }
    }

    .controllers {
      display: flex;
      flex-flow: row nowrap;
      gap: 1vw;

      img {
        width: 1.5vw;
        height: auto;
      }

      .search-wrapper {
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-between;
        gap: 1vw;

        .search {
          display: flex;
          flex-flow: row nowrap;
          align-items: center;
          gap: 0.5vw;
          padding: 0.25vw 0.5vw;
          font-size: 1.5vw;
          background-color: rgba(56, 117, 250, 0.5);
          border: 0.1vw solid rgba(51, 226, 230, 0.5);
          border-radius: 0.5vw;
          transition: all 0.15s cubic-bezier(0.34, 1.56, 0.64, 1);

          input {
            font-size: 1vw;
            line-height: 1.5;
            padding-inline: 0.5vw;
            color: rgba(51, 226, 230, 0.9);
            background-color: rgba(1, 0, 32, 0.4);
            border: 0.1vw solid rgba(51, 226, 230, 0.5);
            border-radius: 0.25vw;
            outline: none;
            width: 10vw;
            transition: all 0.15s ease-in-out;

            &::placeholder {
              color: rgba(51, 226, 230, 0.5);
            }

            &:focus {
              width: 20vw;
            }
          }
        }
      }

      .zoom {
        display: flex;
        flex-direction: row nowrap;
        gap: 0.5vw;

        .zoom-slider {
          display: flex;
          flex-flow: row nowrap;
          justify-content: center;
          align-items: center;
          gap: 0.5vw;
          padding: 0.5vw;
          background-color: rgba(56, 117, 250, 0.5);
          border: 0.1vw solid rgba(51, 226, 230, 0.5);
          border-radius: 0.5vw;

          input {
            width: 20vw;
            cursor: pointer;
          }

          img {
            height: 1.5vw;
            width: auto;
            cursor: pointer;
            transition: all 0.15s cubic-bezier(0.34, 1.56, 0.64, 1);

            &:hover,
            &:active {
              filter: drop-shadow(0 0 0.5vw rgba(51, 226, 230, 0.5));
              transform: scale(1.1);
            }
          }
        }

        .zoom-info {
          font-size: 1vw;
          width: 4vw;
        }
      }
    }
  }

  main {
    width: 98vw;
    height: 85vh;
    margin-inline: auto;
    border: 0.1rem solid rgba(51, 226, 230, 0.5);
    border-radius: 1rem;
    overflow: auto;
    background-image: url("/bg.avif"),
      radial-gradient(black, rgba(1, 0, 32, 0.5));
    background-color: black;
    background-attachment: fixed;
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    opacity: 0;
    animation: show 0.5s ease-in 3.5s forwards;

    .map-wrapper {
      position: relative;
      border-radius: 1rem;
      cursor: grab;
      transform-origin: 0 0;

      .map,
      .mini-map {
        position: absolute;
        top: 0;
        display: grid;
        align-items: center;
        height: 100rem;
        width: 500rem;
        grid-template-columns: repeat(50, 10rem);

        .plot {
          height: 100%;
          width: 10rem;
          display: flex;
          flex-flow: column nowrap;
          justify-content: space-around;
          align-items: center;
          gap: 2rem;
          border-left: 0.05rem solid rgba(51, 226, 230, 0.1);
          border-right: 0.05rem solid rgba(51, 226, 230, 0.1);
          padding-top: 7.5rem;
          transition: all 0.15s ease-in-out;

          .date,
          .episode-title {
            width: inherit;
            font-size: 1.25rem;
            position: absolute;
            top: 0;
            text-align: center;
            white-space: nowrap;
            padding: 0.25rem;
            color: rgba(51, 226, 230, 0.5);
            -webkit-user-select: none;
            -khtml-user-select: none;
            -moz-user-select: none;
            -o-user-select: none;
            user-select: none;
          }

          .note,
          .action {
            margin-top: 1rem;
            white-space: wrap;
          }

          .expandable-arrow {
            position: absolute;
            bottom: -2.5rem;
            display: flex;
            flex-flow: column nowrap;
            justify-content: center;
            align-items: center;
            gap: 1rem;
            font-size: 1.5rem;
            color: rgba(51, 226, 230, 0.9);
            opacity: 0.5;
            transition: all 0.15s ease-in-out;

            p {
              text-align: center;
              white-space: nowrap;
            }

            .arrow {
              width: 5rem;
              height: auto;
              cursor: pointer;
            }

            &:hover,
            &:active {
              transform: scale(1.1);
              opacity: 1;
              filter: drop-shadow(0 0 0.5rem rgba(51, 226, 230, 0.5));
            }
          }
        }

        .connections {
          position: absolute;
          top: 0;
          left: 0;
          pointer-events: none;
          width: 100rem;
          background-color: white;
        }
      }

      .mini-map {
        top: 105rem;
        display: flex;
        flex-flow: row nowrap;
        justify-content: center;
        align-items: flex-start;
        height: auto;
        width: auto;
        padding: 5rem;
        border: 0.1rem solid rgba(51, 226, 230, 0.5);
        border-radius: 1rem;
        background-image: radial-gradient(
          rgba(51, 226, 230, 0),
          rgba(51, 226, 230, 0.1)
        );

        .plot {
          padding-top: 7.5rem;
          width: 20rem;
          border-left: 0.05rem solid rgba(51, 226, 230, 0.25);
          border-right: 0.05rem solid rgba(51, 226, 230, 0.25);

          .episode-title {
            padding-top: 1rem;

            .note {
              font-size: 2rem;
              margin-top: 0;
            }
          }
        }
      }
    }
  }

  @media only screen and (max-width: 600px) {
    .logo {
      display: none;
    }

    header {
      position: absolute;
      margin-block: 0;
      top: 0;
      padding: 1em;
      opacity: 1;
      animation: none;
      h1 {
        display: none;
      }

      .controllers {
        width: 100vw;
        justify-content: space-between;
        flex-wrap: wrap;
        flex-direction: column-reverse;
        gap: 1em;

        img {
          width: 3vh;
          margin-inline: 0.5em;
        }

        .search-wrapper {
          .search {
            padding: 0.25em;
            border-radius: 0.25em;
            gap: 0.25em;
            font-size: 1em;
            line-height: 1.5em;

            input {
              font-size: inherit;
              line-height: inherit;
              border-radius: 0.25em;
              padding-inline: 0.5em;
              width: 35vw;

              &:focus {
                width: 50vw;
              }
            }
          }
        }

        .zoom {
          gap: 0.5em;

          .zoom-slider {
            width: 90vw;
            padding: 1vw 2vw;
            background-color: transparent;
            border: none;
            border-radius: 0;
            padding-inline: 0;
            gap: 1em;

            input {
              width: 60vw;
              height: 1vh;
            }

            img {
              height: 3vh;
            }
          }

          .zoom-info {
            display: none;
            width: 4em;
            font-size: 0.75em;
          }
        }
      }
    }

    main {
      width: 100vw;
      height: 90vh;
      margin-top: 7em;
      border-left: none;
      border-right: none;
      border-bottom: none;
      border-radius: 0;
      opacity: 1;
      animation: none;

      // .map-wrapper {
      //   .map {
      //     .plot {
      //       .date {
      //       }
      //     }
      //   }
      // }
    }
  }

  @keyframes show {
    from {
      opacity: 0;
      filter: grayscale(100%);
    }
    to {
      opacity: 1;
      filter: grayscale(0);
    }
  }

  @keyframes showScale {
    0% {
      opacity: 0;
      transform: scale(0);
      filter: blur(1rem);
    }
    75% {
      transform: scale(1.05);
      filter: blur(0);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes logo {
    0% {
      opacity: 0;
      background-position: 100% 50%;
    }
    50% {
      opacity: 1;
    }
    99% {
      opacity: 0;
      background-position: 0 50%;
    }
    100% {
      display: none;
    }
  }
</style>
