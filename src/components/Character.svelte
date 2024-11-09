<script lang="ts">
  export let name: string;
  export let state: string;
  export let image: string;
</script>

<section
  style="border-color: {state === 'good'
    ? 'rgba(0, 185, 55, 0.8)'
    : state === 'evil'
      ? 'rgba(255, 60, 64, 0.8)'
      : 'gray'}"
>
  <img src={image} alt={name} />
  <p>{name}</p>
</section>

<style>
  section {
    width: 5rem;
    height: 5rem;
    cursor: pointer;
    transition: all 0.15s ease-in-out;
    border: 0.1rem solid gray;
    border-radius: 1rem;
  }

  section:hover,
  section:active {
    outline: 0.05rem solid rgba(51, 226, 230, 0.5);
    color: rgba(51, 226, 230, 0.9);
    filter: drop-shadow(0 0 0.5vw rgba(51, 226, 230, 0.5));
    transform: scale(1.05);
  }

  img {
    width: 100%;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -o-user-select: none;
    user-select: none;
    border-radius: 1rem;
  }

  p {
    max-width: 100%;
    text-align: center;
    font-size: 0.7rem;
    line-height: 1rem;
    padding-top: 0.3rem;
  }
</style>
