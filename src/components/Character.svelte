<script lang="ts">
  import setColor from "../utils/color.ts";

  export let name: string;
  export let state: string;
  export let image: string;

  let character: HTMLElement | null;
  const color = setColor(state);

  function hideConnections() {
    const allConnections: HTMLDivElement[] = Array.from(
      document.querySelectorAll(".connection")
    );
    allConnections.map((connection) => {
      connection.style.opacity = "0.05";
    });
  }

  function showActiveConnections() {
    const allConnections: HTMLDivElement[] = Array.from(
      document.querySelectorAll(".connection")
    );
    const activeConnections = allConnections.filter((connection) =>
      connection.className.match(character!.id)
    );
    activeConnections.map((connection) => {
      connection.style.opacity = "0.5";
    });
  }
</script>

<section
  id={name}
  class="character"
  draggable="false"
  style="border-color: {color}"
  tabindex="0"
  role="button"
  bind:this={character}
  on:focus={showActiveConnections}
  on:blur={hideConnections}
>
  <img src={image} alt={name} draggable="false" style="border-color: {color}" />
  <p>{name}</p>
</section>

<style>
  .character {
    z-index: 1;
    width: 7.5rem;
    height: auto;
    padding: 0.25rem;
    cursor: pointer;
    transition: all 0.15s ease-in-out;
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    background-color: rgba(36, 65, 189, 0.75);
    border: 0.05rem solid gray;
    border-radius: 0.75rem;
    outline: none;
  }

  .character:hover,
  .character:active,
  .character:focus {
    color: rgba(51, 226, 230, 0.9);
    filter: drop-shadow(0 0 0.5vw rgba(51, 226, 230, 0.5));
    transform: scale(1.05);
  }

  img {
    width: 100%;
    border: 0.05rem solid gray;
    border-radius: 0.5rem;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -o-user-select: none;
    user-select: none;
  }

  p {
    max-width: 100%;
    text-align: center;
    font-size: 1rem;
    line-height: 1.5rem;
    padding-top: 0.25rem;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -o-user-select: none;
    user-select: none;
  }
</style>
