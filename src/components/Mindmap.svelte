<script lang="ts">
  import characters from "../data/characters.ts";
  import Character from "./Character.svelte";
  import Connection from "./Connection.svelte";

  const mapWidth: number = 500;
  const mapHeight: number = 75;
  const timeline: number = 50;

  let mapContainer: HTMLElement | null;
  let dragMap: HTMLDivElement | null;
  let mapZoom: number = 1;
  let mapScrollX: number;
  let mapScrollY: number;
  let startX: number = 0;
  let startY: number = 0;
  let isDragging: boolean = false;
  let searchField: string;

  const handlePointerDown = (event: PointerEvent) => {
    isDragging = true;
    startX = event.clientX;
    startY = event.clientY;
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
    const { deltaY, clientX, clientY, ctrlKey, metaKey } = event;
    if (!(ctrlKey || metaKey)) return;
    event.preventDefault();
    let zoom: number;
    zoom = deltaY > 0 ? mapZoom - 0.05 : mapZoom + 0.05;
    if (zoom < 0.25) zoom = 0.25;
    if (zoom > 4) zoom = 4;
    mapZoom = zoom;
  };

  const handleZoomButton = (zoomIn: boolean) => {
    let zoom: number = mapZoom;
    if (zoomIn) zoom += 0.1;
    else zoom -= 0.1;
    if (zoom < 0.25) zoom = 0.25;
    if (zoom > 4) zoom = 4;
    mapZoom = zoom;
  };

  const handleSearch = () => {
    console.log("search character");
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
    <!-- <nav style="width: {mapWidth}rem">
      <p>10 000 years before</p>
      <p>present time</p>
    </nav> -->
    <section
      class="map"
      style="
        width: {mapWidth}rem;
        height: {mapHeight}rem;
        grid-template-columns: repeat({timeline}, {mapWidth / timeline}rem);
      "
    >
      {#each Array(timeline) as plot, index}
        <div class="plot">
          {#each characters as character}
            {#if index == character.timeline}
              <Character
                name={character.name}
                state={character.state}
                image={character.image}
              />
            {/if}
          {/each}
        </div>
      {/each}
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
    </section>
  </div>
</main>

<style>
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
  }

  .map-wrapper {
    position: relative;
    border-radius: 1rem;
    cursor: grab;
    transform-origin: 0 0;
  }

  /* nav {
    margin-inline: auto;
    display: flex;
    justify-content: space-between;
    padding-inline: 1rem;
    padding-bottom: 1rem;
  }

  p {
    font-size: 1rem;
    line-height: 2rem;
  } */

  .map {
    position: absolute;
    top: 0;
    display: grid;
    align-items: center;
    zoom: 0.5;
  }

  .plot {
    height: 100%;
    display: flex;
    flex-flow: column nowrap;
    justify-content: space-around;
    align-items: center;
    border-left: 0.05rem dashed rgba(51, 226, 230, 0.1);
    border-right: 0.05rem dashed rgba(51, 226, 230, 0.1);
  }

  .connections {
    position: absolute;
    top: 0;
    left: 0;
    pointer-events: none;
    width: 100rem;
    background-color: white;
  }

  header {
    width: 100vw;
    margin-block: 3vh 2vh;
    padding-inline: 2.5vw;
    display: flex;
    flex-direction: row nowrap;
    justify-content: space-between;
    align-items: center;
  }

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
  }

  img {
    width: 1.5vw;
    height: auto;
  }

  .zoom {
    display: flex;
    flex-direction: row nowrap;
    gap: 0.5vw;
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
  }

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

  @media only screen and (max-width: 600px) {
    main {
      width: 95vw;
      height: 80vh;
    }

    header {
      margin-top: 3vh;
      padding-inline: 5vw;
      max-height: 4vh;
    }

    h1 {
      position: fixed;
      bottom: 2vh;
      width: 90vw;
      text-align: center;
      font-size: 4vh;
      line-height: 6vh;
      opacity: 0.5;
    }

    .controllers {
      width: 100vw;
      justify-content: space-between;
    }

    img {
      width: 3vh;
    }

    .zoom {
      gap: 1em;
    }

    .search {
      padding: 0.25em 1em;
      border-radius: 1em;
      gap: 1em;
    }

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
</style>
