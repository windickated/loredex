<script lang="ts">
  import { onMount } from "svelte";
  import characters from "../data/characters.ts";
  import timeline from "../data/timeline.ts";
  import Character from "./Character.svelte";
  import Connection from "./Connection.svelte";
  import Modal from "./Modal.svelte";
  import {
    mapWidth,
    mapHeight,
    timeSections,
    timeSectionWidth,
  } from "../data/mapData.ts";

  let width: number;
  let mapContainer: HTMLElement | null;
  let dragMap: HTMLDivElement | null;
  let mapZoom: number = 1;
  let mapScrollX: number;
  let mapScrollY: number;
  let startX: number = 0;
  let startY: number = 0;
  let isDragging: boolean = false;
  let searchField: string;
  let touchscreenDevice: boolean = false;

  onMount(() => {
    if ("ontouchstart" in document.documentElement) {
      touchscreenDevice = true;
    }
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

  const handleZoomWheel = (event: WheelEvent) => {
    const { deltaY, ctrlKey, metaKey } = event;
    if (!(ctrlKey || metaKey)) return;
    event.preventDefault();
    let zoom: number;
    zoom = deltaY > 0 ? mapZoom - 0.05 : mapZoom + 0.05;
    mapZoom = setZoom(zoom);
  };

  const handleZoomButton = (zoomIn: boolean) => {
    let zoom: number = mapZoom;
    if (zoomIn) zoom += 0.1;
    else zoom -= 0.1;
    mapZoom = setZoom(zoom);
  };

  function setZoom(zoom: number): number {
    return zoom < 0.1 ? 0.1 : zoom > 2 ? 2 : zoom;
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
</script>

<header>
  <h1>LOREDEX</h1>
  <section class="controllers">
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
    <div class="zoom">
      <button on:click={() => handleZoomButton(true)}>
        <img src="zoom-in.png" alt="Zoom in" />
      </button>
      <button on:click={() => handleZoomButton(false)}>
        <img src="zoom-out.png" alt="Zoom in" />
      </button>
      <button
        class="zoom-info"
        on:click={() => {
          mapZoom = 1;
        }}
      >
        {Math.round(mapZoom * 100)}%
      </button>
    </div>
  </section>
</header>

<svelte:window bind:innerWidth={width} />

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
        width: {width > 600 ? mapWidth : mapHeight}rem;
        height: {width > 600 ? mapHeight : mapWidth}rem;
        grid-template-{width > 600
        ? 'columns'
        : 'rows'}: repeat({timeSections}, {timeSectionWidth}rem);
      "
    >
      {#each timeline as { date, note, action }}
        <div class="plot">
          <div class="date {date[0]} {date[1]}">
            <p>{date[0]} A.A.</p>
            {#if note}
              <p class="note">{note}</p>
            {/if}
            {#if action}
              <p class="action">{action}</p>
            {/if}
          </div>
          {#each characters as character}
            {#if date[0] <= character.appearance && date[1] >= character.appearance}
              <Character {character} {touchscreenDevice} />
            {/if}
          {/each}
        </div>
      {/each}
      {#if !touchscreenDevice}
        <section class="connections">
          {#each characters as character}
            {#if character.connections}
              {#each character.connections as connection}
                <Connection
                  name1={character.name}
                  name2={connection}
                  state={character.state}
                />
              {/each}
            {/if}
          {/each}
        </section>
      {/if}
    </section>
  </div>
</main>

<Modal />

<style lang="scss">
  header {
    width: 100vw;
    margin-block: 3vh 2vh;
    padding-inline: 2.5vw;
    display: flex;
    flex-direction: row nowrap;
    justify-content: space-between;
    align-items: center;
    opacity: 0;
    animation: showScale 0.75s linear 0.75s forwards;

    h1 {
      font-size: 2vw;
      line-height: 1.5;
      color: rgba(51, 226, 230, 0.25);
      text-shadow: 0 0 0.1vw rgba(51, 226, 230, 0.5);
    }

    .controllers {
      display: flex;
      flex-direction: row nowrap;
      gap: 1vw;

      img {
        width: 1.5vw;
        height: auto;
      }

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
        }

        input::placeholder {
          color: rgba(51, 226, 230, 0.5);
        }

        input:focus {
          width: 20vw;
        }
      }

      .zoom {
        display: flex;
        flex-direction: row nowrap;
        gap: 0.5vw;

        .zoom-info {
          font-size: 1vw;
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
    animation: show 0.5s ease-in 1s forwards;

    .map-wrapper {
      position: relative;
      border-radius: 1rem;
      cursor: grab;
      transform-origin: 0 0;

      .map {
        position: absolute;
        top: 0;
        display: grid;
        align-items: center;

        .plot {
          height: 100%;
          width: auto;
          display: flex;
          flex-flow: column nowrap;
          justify-content: space-around;
          align-items: center;
          border-left: 0.05rem dashed rgba(51, 226, 230, 0.1);
          border-right: 0.05rem dashed rgba(51, 226, 230, 0.1);

          .date {
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

          .note {
            margin-top: 1rem;
          }

          .action {
            margin-top: 1rem;
            white-space: wrap;
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
    }
  }

  @media only screen and (max-width: 600px) {
    header {
      margin-top: 3vh;
      padding-inline: 2.5vw;
      max-height: 4vh;
      opacity: 1;
      animation: none;

      h1 {
        display: none;
      }

      .controllers {
        width: 100vw;
        justify-content: space-between;

        img {
          width: 3vh;
          margin-inline: 0.5em;
        }

        .search {
          padding: 0.25em 0.5em;
          border-radius: 1em;
          gap: 0;

          input {
            font-size: 2em;
            line-height: 2em;
            padding-inline: 0.5em;
            border-radius: 0.5em;
            width: 30vw;
          }

          input:focus {
            width: 40vw;
          }
        }

        .zoom {
          gap: 0.5em;

          .zoom-info {
            font-size: 0.75em;
          }
        }
      }
    }

    main {
      width: 95vw;
      height: 80vh;
      opacity: 1;
      animation: none;

      .map-wrapper {
        .map {
          .plot {
            height: auto;
            width: 100%;
            flex-direction: row;
            border-top: 0.05rem dashed rgba(51, 226, 230, 0.1);
            border-bottom: 0.05rem dashed rgba(51, 226, 230, 0.1);

            .date {
              top: auto;
              left: 0;
              writing-mode: vertical-lr;
              transform: rotate(180deg);
            }
          }
        }
      }
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
</style>
