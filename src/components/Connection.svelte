<script lang="ts">
  import { onMount } from "svelte";

  export let name1: string;
  export let name2: string;
  export let color: string = "gray";

  let character1: HTMLElement | null = null;
  let character2: HTMLElement | null = null;
  onMount(() => {
    character1 = document.getElementById(name1) as HTMLElement;
    character2 = document.getElementById(name2) as HTMLElement;
    connect(character1, character2);
  });

  let cx = 0;
  let cy = 0;
  let length = 0;
  let angle = 0;

  function connect(element1: HTMLElement, element2: HTMLElement) {
    const off1 = getOffset(element1);
    const off2 = getOffset(element2);

    const x1 = off1.left + off1.width / 2;
    const y1 = off1.top + off1.height / 2;
    const x2 = off2.left + off2.width / 2;
    const y2 = off2.top + off2.height / 2;

    length = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));

    cx = (x1 + x2) / 2 - length / 2;
    cy = (y1 + y2) / 2;

    angle = Math.atan2(y1 - y2, x1 - x2) * (180 / Math.PI);
  }

  function getOffset(element: HTMLElement) {
    const map = document.querySelector(".map-wrapper") as HTMLElement;
    const rect = element.getBoundingClientRect();
    return {
      left: rect.left + window.scrollX - map.offsetLeft,
      top: rect.top + window.scrollY - map.offsetTop,
      width: rect.width || element.offsetWidth,
      height: rect.height || element.offsetHeight,
    };
  }
</script>

<div
  class="connection {name1} {name2}"
  style="
    background-color: {color};
    left: {cx}px;
    top: {cy}px;
    width: {length}px;
    -moz-transform:rotate({angle}deg);
    -webkit-transform:rotate({angle}deg);
    -o-transform:rotate({angle}deg);
    -ms-transform:rotate({angle}deg);
    transform:rotate({angle}deg);
  "
  draggable="false"
></div>

<style>
  div {
    position: absolute;
    height: 0.15rem;
    opacity: 0;
    transition: all 0.3s ease-in-out;
  }
</style>
