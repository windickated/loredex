<script lang="ts">
  import getImage from "../utils/image.ts";
  import {
    showModal,
    selectedCharacter,
    characterColor,
  } from "../stores/modal.ts";
  import { timeSystem, timeNotes } from "../data/timeline.ts";

  let dialog: HTMLDialogElement;
  let showHistory: boolean = false;
  let image: string = "/blank.avif";

  $: if ($selectedCharacter) image = getImage($selectedCharacter.name);

  $: if (dialog && $showModal) {
    dialog.showModal();
  } else if (!$showModal) closeDialog();

  const closeDialog = () => {
    $showModal = null;
    $selectedCharacter = null;
    $characterColor = "";
    dialog?.close();
  };
</script>

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
<dialog
  class="blur"
  bind:this={dialog}
  on:close={closeDialog}
  on:click|self={closeDialog}
>
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <main on:click|stopPropagation>
    <button class="close-button" on:click={closeDialog}>❌</button>

    {#if $showModal === "character" && $selectedCharacter}
      <header>
        {#if $selectedCharacter.dead}
          <img class="death-icon" src="dead-red.png" alt="Dead" />
        {/if}
        <h1 style="color: {$characterColor}">{$selectedCharacter.name}</h1>
      </header>

      <section class="general-info">
        <div class="image-container">
          <img
            src={image}
            alt={$selectedCharacter.name}
            width="1024"
            height="1024"
          />
          <button
            on:click={() => {
              showHistory = !showHistory;
            }}>{showHistory ? "Hide" : "Show"} history</button
          >
        </div>

        <article>
          <div class="status">
            <span>
              <p>Status:</p>
              <strong>{@html $selectedCharacter.status}</strong>
            </span>
            <span>
              <p>Affiliation:</p>
              <strong>{$selectedCharacter.affiliation}</strong>
            </span>
          </div>
          <p>{@html $selectedCharacter.bio}</p>
        </article>
      </section>

      {#if showHistory && $selectedCharacter.history}
        <article class="history">
          <hr />
          {@html $selectedCharacter.history}
          <hr />
        </article>
      {/if}
    {:else if $showModal === "timeline"}
      <header>
        <h1>Comprehensive Timeline of the A.A. Era</h1>
      </header>

      <section class="general-info time-system">
        <p>{@html timeSystem.note}</p>
        <ol>
          {#each timeSystem.months as month}
            <li>{@html month}</li>
          {/each}
        </ol>
      </section>

      <article class="history">
        <hr />
        {@html timeNotes}
        <hr />
      </article>
    {/if}
  </main>
</dialog>

<style lang="scss">
  dialog {
    width: 90vw;
    height: 90vh;
    border: none;
    color: inherit;
    background-color: rgba(1, 0, 32, 0.75);
    border: 0.05vw solid rgba(51, 226, 230, 0.75);
    border-radius: 2vw;
    overflow-y: scroll;

    main {
      padding: 1vw;

      .close-button {
        position: absolute;
        top: 0;
        right: 0;
        margin: 1vw;
        padding: 1vw;
        font-size: 2vw;
        line-height: 2vw;
        background-color: rgba(22, 30, 95, 0.9);
        border-radius: 1vw;
      }

      .close-button:hover,
      .close-button:active {
        background-color: rgba(45, 90, 216, 0.9);
      }

      header {
        margin: 1vw;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 1vw;

        .death-icon {
          width: 2vw;
          opacity: 0.75;
        }

        h1 {
          font-size: 2.5vw;
          line-height: 2vw;
          color: rgba(51, 226, 230, 0.75);
        }
      }

      .general-info {
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-between;
        align-items: center;
        gap: 2vw;
        padding: 1vw;
        margin: 2vw 4vw;
        background-color: rgba(51, 226, 230, 0.1);
        border: 0.1vw solid rgba(51, 226, 230, 0.25);
        border-radius: 1vw;

        .image-container {
          display: flex;
          flex-flow: column nowrap;
          align-items: center;
          width: 15vw;
          border: 0.1vw solid rgba(51, 226, 230, 0.25);
          border-radius: 0.5vw;

          img {
            width: inherit;
            height: auto;
            border-top-left-radius: 0.5vw;
            border-top-right-radius: 0.5vw;
            background-color: #010020;
          }

          button {
            width: inherit;
            border: none;
            border-radius: 0;
            border-bottom-left-radius: 0.5vw;
            border-bottom-right-radius: 0.5vw;
            font-size: 1.25vw;
            color: rgba(51, 226, 230, 0.9);
            background-color: rgba(51, 226, 230, 0.25);
          }

          button:hover,
          button:active {
            transform: none;
            color: #010020;
            background-color: rgba(51, 226, 230, 0.75);
          }
        }

        article {
          min-height: 17.5vw;
          display: flex;
          flex-flow: column nowrap;
          justify-content: space-around;
          align-items: flex-start;
          gap: 1vw;
          font-size: 1vw;

          .status {
            display: flex;
            flex-flow: column nowrap;
            gap: 1vw;
            font-size: 1.5vw;
            color: rgba(51, 226, 230, 0.65);

            span {
              display: flex;
              flex-flow: row nowrap;
              align-items: center;
              gap: 1vw;

              strong {
                color: rgba(51, 226, 230, 0.75);
              }
            }
          }
        }
      }

      .time-system {
        flex-direction: column;
        justify-content: center;
        gap: 0;
        font-size: 1vw;

        p {
          text-align: center;
        }
      }

      .history {
        padding-inline: 1vw;
        color: rgba(51, 226, 230, 0.75);
        font-size: 1vw;
      }
    }
  }

  dialog::backdrop {
    background: rgba(0, 0, 0, 0.25);
    -webkit-backdrop-filter: blur(1rem);
    backdrop-filter: blur(1rem);
  }

  dialog[open] {
    animation: zoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  dialog[open]::backdrop {
    animation: fade 0.2s ease-out;
  }

  dialog::-webkit-scrollbar {
    width: 0.5vw;
  }

  dialog::-webkit-scrollbar-track {
    background-color: rgba(0, 0, 0, 0);
  }

  dialog::-webkit-scrollbar-thumb {
    background: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0),
      rgba(51, 226, 230, 0.5),
      rgba(0, 0, 0, 0)
    );
    border-radius: 0.5vw;
  }

  @media only screen and (max-width: 600px) {
    dialog {
      max-width: 95vw;
    }

    .close-button {
      margin: 1em;
      padding: 0.25em;
      font-size: 1.2em;
      line-height: 1.2em;
    }
  }

  @keyframes zoom {
    from {
      transform: scale(1.5);
    }
    to {
      transform: scale(1);
    }
  }

  @keyframes fade {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
</style>
