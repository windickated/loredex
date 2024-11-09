<script lang="ts">
  import Character from "./Character.svelte";
  import characters from "../data/characters.ts";

  const mapWidth: number = 300;
  const mapHeight: number = 50;

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
      // window.scrollTo({
      //   left:
      //     scrollLeft +
      //     (scrollLeft > scrollLeft + (startX - event.clientX) ? -15 : 15),
      //   top:
      //     scrollTop +
      //     (scrollTop > scrollTop + (startY - event.clientY) ? -15 : 15),
      // });
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
      style="width: {mapWidth}rem; height: {mapHeight}rem"
      bind:this={dragMap}
      on:pointerdown={handlePointerDown}
      on:pointerup={handlePointerUp}
      on:pointermove={handlePointerMove}
    >
      {#each Array(50) as plot, index}
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
  </div>
</main>

<style>
  main {
    width: 100vw;
    height: 100vh;
    padding-block: 2rem;
  }

  .map-wrapper {
    margin-inline: auto;
    padding: 1rem;
    background-color: rgba(1, 0, 32, 0.25);
    border: 0.05rem solid rgba(51, 226, 230, 0.15);
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
    cursor: grab;
    background-image: radial-gradient(
      rgba(51, 226, 230, 0.01),
      rgba(51, 226, 230, 0.05)
    );
    border: 0.05rem solid rgba(51, 226, 230, 0.15);
    display: grid;
    grid-template-columns: repeat(50, 6rem);
    align-items: center;
  }

  .plot {
    height: 100%;
    display: flex;
    flex-flow: column nowrap;
    justify-content: space-around;
    align-items: center;
  }
</style>
