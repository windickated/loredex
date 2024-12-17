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
  let preventZoomChanges: boolean = true;
  let searchInput: HTMLInputElement | null;

  $: activeSeason = stories.find(
    (section) => section.season === $activeSeasonNr
  );

  onMount(() => {
    mapZoom = 0.2;
    if (window.innerWidth < 600) {
      preventZoomChanges = false;
      return;
    }
    setTimeout(() => {
      preventZoomChanges = false;
    }, 7000);
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
    if (preventZoomChanges) return;
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

  let mobileSearch = false;
  const handleMobileSearch = () => {
    if (!searchInput) return;
    if (!mobileSearch) searchInput.focus();
    if (mobileSearch) searchInput.blur();
    mobileSearch = !mobileSearch;
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
  <section
    class="controllers"
    style={preventZoomChanges
      ? "filter: grayscale(100%); opacity: 0.25;"
      : "filter: none; opacity: 1;"}
  >
    <div class="search-wrapper">
      <button on:click={showTimeline}>
        <img
          src="time.png"
          alt="Time"
          style="opacity: {preventZoomChanges ? '0' : '1'};"
        />
      </button>
      <div class="search">
        <!-- svelte-ignore a11y_no_noninteractive_element_to_interactive_role a11y_click_events_have_key_events -->
        <img
          src="search.png"
          alt="Search"
          style="opacity: {preventZoomChanges ? '0' : '1'};"
          role="button"
          tabindex="0"
          on:click={handleMobileSearch}
        />
        <input
          style="opacity: {preventZoomChanges ? '0' : '1'};"
          bind:value={searchField}
          on:input={handleSearch}
          on:focus={handleSearch}
          on:blur={resetSearch}
          bind:this={searchInput}
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
          style="opacity: {preventZoomChanges ? '0' : '1'};"
          on:click={() => {
            if (preventZoomChanges) return;
            let zoom = mapZoom - 0.05;
            mapZoom = setZoom(zoom);
          }}
        />
        <input
          type="range"
          min="0.1"
          max="1.6"
          step="0.025"
          style="opacity: {preventZoomChanges ? '0' : '1'};"
          bind:value={mapZoom}
        />
        <img
          src="/zoom-in.png"
          alt="Zoom in"
          role="button"
          tabindex="0"
          style="opacity: {preventZoomChanges ? '0' : '1'};"
          on:click={() => {
            if (preventZoomChanges) return;
            let zoom = mapZoom + 0.05;
            mapZoom = setZoom(zoom);
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
          style="
            padding-bottom: {expandable != undefined ? '15rem;' : '0;'}
            padding-top: {action ? '15rem;' : '1rem;'}
          "
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
                    appearance={character.appearance}
                  />
                {/each}
              {/if}
              {#if character.connections.enemies}
                {#each character.connections.enemies as enemy}
                  <Connection
                    name1={character.name}
                    name2={enemy}
                    color="rgba(255, 60, 64, 0.75)"
                    appearance={character.appearance}
                  />
                {/each}
              {/if}
              {#if character.connections.neutral}
                {#each character.connections.neutral as neutral}
                  <Connection
                    name1={character.name}
                    name2={neutral}
                    color="rgba(150, 150, 150, 0.75)"
                    appearance={character.appearance}
                  />
                {/each}
              {/if}
              {#if character.connections.locations}
                {#each character.connections.locations as location}
                  <Connection
                    name1={character.name}
                    name2={location}
                    color="rgba(45, 90, 216, 0.75)"
                    appearance={character.appearance}
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
        style="
          left: {setSeasonPadding(activeSeason.season)}rem;
          background-image: {activeSeason.season == 99
          ? 'radial-gradient(rgba(45, 90, 216, 0), rgba(45, 90, 216, 0.1));'
          : 'radial-gradient(rgba(51, 226, 230, 0), rgba(51, 226, 230, 0.1));'}
          border-color: {activeSeason.season == 99
          ? 'rgba(45, 90, 216, 0.75);'
          : 'rgba(51, 226, 230, 0.5);'}
        "
      >
        {#each activeSeason.episodes as { title, date, link }, index}
          <div class="plot episode-plot {title}">
            <div class="episode-title {title}">
              {#if activeSeason.season !== 99}
                <p>Episode - {index + 1}</p>
              {/if}
              <p class="note">
                <a
                  href="https://www.youtube.com/watch?v={link}"
                  target="_blank"
                >
                  {title}
                </a>
              </p>
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

<!-- svelte-ignore css_unused_selector -->
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
    animation: logo 5s linear forwards;
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
    animation: show 1s linear 6s forwards;
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
      transition: all 0.5s ease-in-out;

      img {
        width: 1.5vw;
        height: auto;
        transition: all 0.3s cubic-bezier(0.075, 0.82, 0.165, 1);
        cursor: pointer;
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
          padding: 0.25vw;
          padding-left: 0.5vw;
          font-size: 1.5vw;
          background-color: rgba(56, 117, 250, 0.5);
          border: 0.1vw solid rgba(51, 226, 230, 0.5);
          border-radius: 0.5vw;
          transition: all 0.3s cubic-bezier(0.075, 0.82, 0.165, 1);

          input {
            font-size: 1vw;
            line-height: 2vw;
            padding-inline: 0.5vw;
            color: rgba(51, 226, 230, 0.9);
            background-color: rgba(1, 0, 32, 0.4);
            border: 0.1vw solid rgba(51, 226, 230, 0.5);
            border-radius: 0.25vw;
            outline: none;
            width: 10vw;
            transition: all 0.3s cubic-bezier(0.075, 0.82, 0.165, 1);

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
            transition: all 0.3s cubic-bezier(0.075, 0.82, 0.165, 1);
          }

          img {
            height: 1.5vw;
            width: auto;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.075, 0.82, 0.165, 1);

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
    animation: show 1s ease-in 5s forwards;

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
        height: 150rem;
        width: 500rem;
        grid-template-columns: repeat(50, 10rem);
        padding: 2.5rem;

        .plot {
          height: 100%;
          width: 10rem;
          display: flex;
          flex-flow: column nowrap;
          justify-content: space-around;
          align-items: center;
          gap: 2rem;
          padding-block: 2.5rem;
          border-left: 0.05rem solid rgba(51, 226, 230, 0.1);
          border-right: 0.05rem solid rgba(51, 226, 230, 0.1);
          transition: all 0.3s ease-in-out;

          .date,
          .episode-title {
            position: absolute;
            top: 1rem;
            width: inherit;
            font-size: 1.25rem;
            text-align: center;
            white-space: nowrap;
            padding: 0.25rem 0.5rem;
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

            a {
              color: inherit;
              text-decoration: none;

              &:hover,
              &:active {
                color: rgba(51, 226, 230, 0.9);
                text-decoration: underline;
              }
            }
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
            transition: all 0.3s ease-in-out;

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
        top: 155rem;
        display: flex;
        flex-flow: row nowrap;
        justify-content: center;
        align-items: flex-start;
        height: auto;
        width: auto;
        padding: 2.5rem 5rem;
        border: 0.1rem solid rgba(51, 226, 230, 0.5);
        border-radius: 1rem;

        .plot {
          padding-top: 0;
          width: 20rem;
          border-left: 0.05rem solid rgba(51, 226, 230, 0.25);
          border-right: 0.05rem solid rgba(51, 226, 230, 0.25);

          .episode-title {
            position: static;

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
      z-index: 1000;
      position: absolute;
      margin-block: 0;
      top: 0;
      padding: 1em;
      animation: show 1s linear 2s forwards;

      h1 {
        display: none;
      }

      .controllers {
        width: 100vw;
        justify-content: space-between;
        flex-flow: row nowrap;
        gap: 0;

        &:hover,
        &:active {
          opacity: 1;
        }

        img {
          width: 3vh;
          margin-inline: 0.5em;
        }

        .search-wrapper {
          position: fixed;
          top: 1em;
          right: 1em;
          justify-content: flex-start;
          flex-direction: row-reverse;

          button {
            background-color: #010020;
            padding: 1em;
          }

          .search {
            padding: 0.25em;
            border-radius: 0.25em;
            gap: 0.25em;
            font-size: 1em;
            line-height: 1.5em;
            background-color: transparent;
            border: none;

            input {
              font-size: inherit;
              line-height: inherit;
              border-radius: 0.25em;
              padding: 0.25em 0;
              width: 0;
              background-color: #010020;

              &:focus {
                width: 50vw;
                padding: 0.25em 0.5em;
              }
            }
          }
        }

        .zoom {
          gap: 0;

          .zoom-slider {
            position: fixed;
            transform: rotate(-90deg);
            right: -40vw;
            top: 50vh;
            width: 90vw;
            padding: 1vw 2vw;
            background-color: transparent;
            border: none;
            border-radius: 0;
            padding-inline: 0;
            gap: 1em;
            opacity: 0.5;

            input {
              width: 60vw;
              height: 1vh;
            }

            img {
              height: 3vh;
              transform: rotate(90deg);
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
      height: 100vh;
      border: none;
      border-radius: 0;
      animation: show 1s ease-in 1s forwards;

      .map-wrapper {
        .map {
          padding-top: 20rem;

          .plot {
            .date {
              top: 10rem;
            }

            .expandable-arrow {
              bottom: -17.5rem;
            }
          }
        }

        .mini-map {
          top: 170rem;
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

  @keyframes logo {
    0% {
      opacity: 0;
      background-position: 0 50%;
    }
    25% {
      opacity: 1;
    }
    50% {
      opacity: 0.1;
      background-position: 100% 50%;
    }
    75% {
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
