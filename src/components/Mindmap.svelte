<script lang="ts">
  import characters from "../data/characters.ts";
  import Character from "./Character.svelte";
  import Connection from "./Connection.svelte";

  const mapWidth: number = 500;
  const mapHeight: number = 75;
  const timeline: number = 50;

  let dragMap: HTMLElement | null = null;
  let startX: number = 0;
  let startY: number = 0;
  let scrollLeft: number;
  let scrollTop: number;
  let isDragging: boolean = false;

  const handlePointerDown = (event: PointerEvent) => {
    isDragging = true;
    startX = event.clientX;
    startY = event.clientY;
  };

  const handlePointerMove = (event: PointerEvent) => {
    if (isDragging) {
      window.scrollTo({
        left: scrollLeft + (startX - event.clientX) / 10,
        top: scrollTop + (startY - event.clientY) / 10,
      });
    }
  };

  const handlePointerUp = () => {
    isDragging = false;
  };
</script>

<svelte:window bind:scrollX={scrollLeft} bind:scrollY={scrollTop} />

<main>
  <div class="map-wrapper blur" style="width: {mapWidth + 2}rem">
    <nav style="width: {mapWidth}rem">
      <p>10 000 years before</p>
      <p>present time</p>
    </nav>
    <section
      class="map"
      style="
        width: {mapWidth}rem;
        height: {mapHeight}rem;
        grid-template-columns: repeat({timeline}, {mapWidth / timeline}rem);
      "
      bind:this={dragMap}
      on:pointerdown={handlePointerDown}
      on:pointerup={handlePointerUp}
      on:pointermove={handlePointerMove}
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
    </section>
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
  </div>
</main>

<style>
  main {
    width: 100vw;
    height: 100vh;
  }

  .map-wrapper {
    margin: 2rem;
    padding: 1rem;
    background-image: radial-gradient(
      rgba(51, 226, 230, 0.2),
      rgba(51, 226, 230, 0.4)
    );
    border: 0.05rem solid rgba(51, 226, 230, 0.65);
    border-radius: 1rem;
  }

  nav {
    margin-inline: auto;
    display: flex;
    justify-content: space-between;
    padding-inline: 1rem;
    padding-bottom: 1rem;
  }

  p {
    font-size: 1rem;
    line-height: 2rem;
  }

  .map {
    position: relative;
    cursor: grab;
    background-image: url("/space.avif"),
      radial-gradient(rgba(1, 0, 32, 0.75), rgb(1, 0, 32));
    border: 0.05rem solid rgba(51, 226, 230, 0.65);
    display: grid;
    align-items: center;
  }

  .plot {
    height: 100%;
    display: flex;
    flex-flow: column nowrap;
    justify-content: space-around;
    align-items: center;
    border-left: 0.05rem dashed rgba(51, 226, 230, 0.05);
    border-right: 0.05rem dashed rgba(51, 226, 230, 0.05);
  }

  .connections {
    pointer-events: none;
  }

  @media only screen and (max-width: 600px) {
    .map-wrapper {
      margin: 0;
    }
  }
</style>
