<script lang="ts">
  export let name: string;
  export let state: string;
  export let image: string;
</script>

<section id={name} class="character" draggable="false">
  <img
    src={image}
    alt={name}
    draggable="false"
    style="border-color: {state === 'good'
      ? 'rgb(0, 185, 55)'
      : state === 'evil'
        ? 'rgb(255, 60, 64)'
        : 'gray'}"
  />
  <p>{name}</p>
</section>

<style>
  .character {
    z-index: 1;
    width: 7.5rem;
    height: 7.5rem;
    cursor: pointer;
    transition: all 0.15s ease-in-out;
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
  }

  .character:hover,
  .character:active {
    color: rgba(51, 226, 230, 0.9);
    filter: drop-shadow(0 0 0.5vw rgba(51, 226, 230, 0.5));
    transform: scale(1.05);
  }

  img {
    width: 100%;
    border: 0.2rem solid gray;
    border-radius: 1rem;
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
    padding-top: 0.5rem;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -o-user-select: none;
    user-select: none;
  }
</style>
