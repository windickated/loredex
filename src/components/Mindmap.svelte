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
  let preventZoomChanges: boolean = false;
  let searchInput: HTMLInputElement | null;

  $: activeSeason = stories.find(
    (section) => section.season === $activeSeasonNr
  );

  onMount(() => {
    mapZoom = 0.2;
    // if (window.innerWidth < 600) {
    //   preventZoomChanges = false;
    //   return;
    // }
    // setTimeout(() => {
    //   preventZoomChanges = false;
    // }, 7000);
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
  const handleSearchFocus = () => {
    if (!searchInput) return;
    if (!mobileSearch) {
      searchInput.focus();
      mobileSearch = false;
    }
    if (mobileSearch) {
      searchInput.blur();
      mobileSearch = true;
    }
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

  // SVG Icons
  let searchSvgFocus: boolean = false;
</script>

<svelte:window on:keydown={handleKeyDown} />

<!-- <div class="logo" style={preventZoomChanges ? "" : "display: none;"}>
  LOREDEX
</div> -->

<!-- svelte-ignore a11y_no_noninteractive_element_to_interactive_role a11y_click_events_have_key_events -->
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
      ? "filter: grayscale(100%); opacity: 0.25; cursor: wait;"
      : "filter: none; opacity: 1;"}
  >
    <div class="search-wrapper">
      <button on:click={showTimeline} aria-label="Timeline">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="-100 -100 200 200"
          class="calendar-svg"
          fill="none"
          stroke="#dedede"
          stroke-width="12"
          stroke-linejoin="round"
          stroke-linecap="round"
        >
          <path
            d="
              M -25 70
              L -80 70
              L -80 0
              M -80 -25
              L -80 -60
              L 80 -60
              L 80 -20
              M -80 -35
              L 80 -35
              M -45 -35
              L -45 -75
              M 45 -35
              L 45 -75
              M 0 -60
              L 0 -75
              M -55 0
              L -35 0
              M -55 17.5
              L -35 17.5
              M -55 35
              L -35 35
              M 35 35
              L 35 10
              M 35 35
              L 52.5 42.5
            "
          />
          <circle r="45" cx="35" cy="35" />
        </svg>
      </button>
      <div class="search">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="-100 -100 200 200"
          class="search-svg filter-image"
          stroke="#dedede"
          stroke-linecap="round"
          fill="none"
          on:click={handleSearchFocus}
          role="button"
          tabindex="0"
          style="transform: {searchSvgFocus
            ? 'scale(1.05) rotate(90deg)'
            : 'none'}"
        >
          <circle cx="-20" cy="-20" r="70" stroke-width="15" />
          <line x1="34" y1="34" x2="85" y2="80" stroke-width="25" />
        </svg>
        <input
          style="opacity: {preventZoomChanges ? '0' : '1'};"
          bind:value={searchField}
          on:input={handleSearch}
          on:focus={() => {
            handleSearch();
            searchSvgFocus = true;
          }}
          on:blur={() => {
            resetSearch();
            searchSvgFocus = false;
          }}
          bind:this={searchInput}
          placeholder="Find a character..."
        />
      </div>
    </div>
    <div class="zoom">
      <div class="zoom-slider">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="-100 -100 200 200"
          class="search-svg filter-image"
          stroke="#dedede"
          stroke-width="15"
          stroke-linecap="round"
          fill="none"
          on:click={() => {
            if (preventZoomChanges) return;
            let zoom = mapZoom - 0.05;
            mapZoom = setZoom(zoom);
          }}
          role="button"
          tabindex="0"
          aria-label="Zoom out"
        >
          <circle cx="-20" cy="-20" r="70" />
          <line x1="34" y1="34" x2="85" y2="80" stroke-width="25" />
          <line x1="-55" y1="-20" x2="15" y2="-20" />
        </svg>
        <input
          type="range"
          min="0.1"
          max="1.6"
          step="0.025"
          autocomplete="off"
          style="opacity: {preventZoomChanges ? '0' : '1'};"
          bind:value={mapZoom}
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="-100 -100 200 200"
          class="search-svg filter-image"
          stroke="#dedede"
          stroke-width="15"
          stroke-linecap="round"
          fill="none"
          on:click={() => {
            if (preventZoomChanges) return;
            let zoom = mapZoom + 0.05;
            mapZoom = setZoom(zoom);
          }}
          role="button"
          tabindex="0"
          aria-label="Zoom in"
        >
          <circle cx="-20" cy="-20" r="70" />
          <line x1="34" y1="34" x2="85" y2="80" stroke-width="25" />
          <line x1="-55" y1="-20" x2="15" y2="-20" />
          <line x1="-20" y1="-55" x2="-20" y2="15" />
        </svg>
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
        {preventZoomChanges ? 'cursor: wait;' : ''}
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
                    color="rgb(0, 185, 55)"
                    appearance={character.appearance}
                  />
                {/each}
              {/if}
              {#if character.connections.enemies}
                {#each character.connections.enemies as enemy}
                  <Connection
                    name1={character.name}
                    name2={enemy}
                    color="rgb(255, 60, 64)"
                    appearance={character.appearance}
                  />
                {/each}
              {/if}
              {#if character.connections.neutral}
                {#each character.connections.neutral as neutral}
                  <Connection
                    name1={character.name}
                    name2={neutral}
                    color="rgb(150, 150, 150)"
                    appearance={character.appearance}
                  />
                {/each}
              {/if}
              {#if character.connections.locations}
                {#each character.connections.locations as location}
                  <Connection
                    name1={character.name}
                    name2={location}
                    color="rgb(150, 150, 150)"
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
  // .logo {
  //   z-index: 100;
  //   position: fixed;
  //   width: 100vw;
  //   height: 100vh;
  //   display: flex;
  //   justify-content: center;
  //   align-items: center;
  //   font-size: 10vw;
  //   color: transparent;
  //   background-image: linear-gradient(
  //     to right,
  //     rgba(51, 226, 230, 0.1),
  //     rgba(51, 226, 230, 0.25),
  //     rgb(51, 226, 230),
  //     rgba(51, 226, 230, 0.25),
  //     rgba(51, 226, 230, 0.1)
  //   );
  //   background-clip: text;
  //   background-size: 200% auto;
  //   opacity: 0;
  //   filter: drop-shadow(0 0 0.5vw rgba(51, 226, 230, 0.5));
  //   animation: logo 5s linear forwards;
  //   cursor: wait;
  // }

  header {
    width: 100vw;
    margin-block: 3vh 2vh;
    padding-inline: 2.5vw;
    display: flex;
    flex-direction: row nowrap;
    justify-content: space-between;
    align-items: center;
    // opacity: 0;
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

      button {
        padding: 0.5vw;
        border-radius: 0.5vw;

        svg {
          width: 1.75vw;
          height: 1.75vw;
        }
      }

      svg {
        width: 1.5vw;
        height: 1.5vw;
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
    box-shadow: 0 0 0.5vw rgba(51, 226, 230, 0.25);
    border: 0.05rem solid rgba(51, 226, 230, 0.25);
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
        box-shadow: inset 0 0 0.5vw rgba(51, 226, 230, 0.25);
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

        button {
          padding: 0.35em;
          border-radius: 0.5em;
          background-color: #010020;

          svg {
            width: 1.75em;
            height: 1.75em;
          }
        }

        svg {
          width: 1.5em;
          height: 1.5em;
          margin-inline: 0.5em;
        }

        .search-wrapper {
          position: fixed;
          top: 1em;
          right: 1em;
          justify-content: flex-start;
          flex-direction: row-reverse;

          .search {
            padding: 0.5em;
            border-radius: 0.5em;
            gap: 0.25em;
            font-size: 1em;
            line-height: 2em;
            background-color: transparent;
            border: none;

            input {
              font-size: inherit;
              line-height: inherit;
              border-radius: 0.5em;
              padding: 0.25em 0;
              width: 0;
              background-color: #010020;

              &:focus {
                width: 50vw;
                padding-inline: 1em;
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
              transform: rotate(90deg) !important;
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
