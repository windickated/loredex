<script lang="ts">
  import getImage from "../utils/image.ts";
  import { getColor } from "../utils/color.ts";
  import characters from "../data/characters.ts";
  import { type Character } from "../lib/types";
  import {
    showModal,
    selectedCharacter,
    characterColor,
  } from "../stores/modal.ts";
  import { timeSystem, timeNotes } from "../data/timeline.ts";

  let activeTab: "connections" | "stories" = "connections";
  const activeTabStyling =
    "color: #010020; text-shadow: 0 0 0.1vw #010020; background-color: rgba(51, 226, 230, 0.75)";

  let previousCharacters: Character[] = [];

  let dialog: HTMLDialogElement;
  let showHistory: boolean = false;

  $: if (dialog && $showModal) {
    dialog.showModal();
  } else if (!$showModal) closeDialog();

  const closeDialog = () => {
    $showModal = null;
    $selectedCharacter = null;
    if (previousCharacters.length > 0) previousCharacters = [];
    $characterColor = "";
    dialog?.close();
  };

  const handleSelectCharacter = (name: string) => {
    previousCharacters.push($selectedCharacter!);
    characters.map((character) => {
      if (name === character.name) $selectedCharacter = character;
    });
  };

  function handleBackArrow() {
    if (previousCharacters.length === 0) {
      closeDialog();
      return;
    } else {
      $selectedCharacter = previousCharacters.pop()!;
    }
  }
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
    {#if $selectedCharacter}
      <button class="back-arrow" on:click={handleBackArrow}>
        <img src="/back-arrow.png" alt="Back" />
      </button>
    {/if}
    <button class="close-button" on:click={closeDialog}>❌</button>

    {#if $showModal === "character" && $selectedCharacter}
      {#key $selectedCharacter}
        <section class="character-window">
          <header>
            {#if $selectedCharacter.dead}
              <img class="death-icon" src="dead-red.png" alt="Dead" />
            {/if}
            <h1 style="color: {$characterColor}">{$selectedCharacter.name}</h1>
          </header>

          <section class="general-info">
            <div class="image-container">
              <img
                class="scalable"
                src={$selectedCharacter.picture}
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

            <article
              style={$selectedCharacter.potentialNFT
                ? "align-items: center; text-align: center;"
                : ""}
            >
              <div
                class="status"
                style={$selectedCharacter.potentialNFT
                  ? "align-items: center"
                  : ""}
              >
                <span>
                  <p>Affiliation:</p>
                  <strong>{$selectedCharacter.affiliation}</strong>
                </span>
                <span>
                  <p>Status:</p>
                  <strong>{@html $selectedCharacter.status}</strong>
                </span>
              </div>
              <p>{@html $selectedCharacter.bio}</p>
            </article>

            {#if $selectedCharacter.potentialNFT}
              <div class="image-container">
                <img
                  class="scalable"
                  src="https://api.degenerousdao.com/nft/image/{$selectedCharacter.potentialNFT}"
                  alt="Potential #{$selectedCharacter.potentialNFT}"
                  width="1024"
                  height="1024"
                />
                <div>
                  <a
                    href="https://opensea.io/assets/ethereum/0xfa511d5c4cce10321e6e86793cc083213c36278e/{$selectedCharacter.potentialNFT}"
                    target="_blank"
                  >
                    <img src="/opensea.png" alt="OpenSea" draggable="false" />
                  </a>
                  <a
                    href="https://magiceden.io/collections/ethereum/0xfa511d5c4cce10321e6e86793cc083213c36278e?search=%22%23{$selectedCharacter.potentialNFT}%22"
                    target="_blank"
                    draggable="false"
                  >
                    <img src="/magic-eden.png" alt="Magic Eden" />
                  </a>
                </div>
              </div>
            {/if}
          </section>

          {#if $selectedCharacter.conexusGames}
            <div class="play-button">
              <p>PLAY NOW</p>
              <div>
                {#each $selectedCharacter.conexusGames as game}
                  <button
                    on:click={() =>
                      window.open(
                        "https://conexus.degenerousdao.com/",
                        "_blank"
                      )}>{game}</button
                  >
                {/each}
              </div>
              <img src="/conexus.avif" alt="CoNexus" />
            </div>
          {/if}

          {#if showHistory && $selectedCharacter.history}
            <article class="history">
              <hr />
              {@html $selectedCharacter.history}
              <hr />
            </article>
          {/if}

          {#if $selectedCharacter.transformations}
            <section class="transformation">
              {#each $selectedCharacter.transformations as { name, picture }, index}
                <div>
                  <img
                    class="scalable"
                    src={picture}
                    alt={name}
                    width="1024"
                    height="1024"
                  />
                  <p>{name}</p>
                </div>
                {#if index !== $selectedCharacter.transformations.length - 1}
                  <span>→</span>
                {/if}
              {/each}
            </section>
          {/if}

          {#if $selectedCharacter.connections || $selectedCharacter.stories}
            <section class="tabs-wrapper">
              <div class="tabs-container">
                <button
                  class="tab"
                  style={activeTab === "connections" ? activeTabStyling : ""}
                  on:click={() => {
                    activeTab = "connections";
                  }}
                >
                  Connections
                  <img
                    class="connections-icon"
                    src="/connection.png"
                    alt="Connection"
                    style="opacity: {activeTab === 'connections' ? '1' : '0.1'}"
                  />
                </button>
                <button
                  class="tab"
                  style={activeTab === "stories" ? activeTabStyling : ""}
                  on:click={() => {
                    activeTab = "stories";
                  }}
                >
                  Appearances
                  <img
                    class="stories-icon"
                    src="/play.png"
                    alt="Stories"
                    style="opacity: {activeTab === 'stories' ? '1' : '0.1'}"
                  />
                </button>
              </div>

              <section class="tab-section">
                {#if $selectedCharacter.connections}
                  <div
                    class="connected-characters"
                    style="display: {activeTab === 'connections'
                      ? 'flex'
                      : 'none'}"
                  >
                    {#each $selectedCharacter.connections as connection}
                      <div on:click={() => handleSelectCharacter(connection)}>
                        <img
                          src={getImage(connection)}
                          alt={connection}
                          width="1024"
                          height="1024"
                          style="border-color: {getColor(connection)}"
                        />
                        <p style="color: {getColor(connection)}">
                          {connection}
                        </p>
                      </div>
                    {/each}
                  </div>
                {/if}
                <!-- {#if $selectedCharacter.stories} -->
                <div
                  class="stories"
                  style="display: {activeTab === 'stories' ? 'flex' : 'none'}"
                >
                  <div>
                    <span
                      class="story-image-container"
                      on:click={() => {
                        window.open(
                          "https://www.youtube.com/watch?v=vMlxgr27mig",
                          "_blank"
                        );
                      }}
                    >
                      <img
                        class="story-image"
                        src="https://img.youtube.com/vi/vMlxgr27mig/maxresdefault.jpg"
                        alt="Story"
                        width="1280"
                        height="720"
                      />
                      <img
                        class="play-icon"
                        src="/youtube.png"
                        alt="YouTube"
                        width="1280"
                        height="720"
                      />
                    </span>
                    <article>
                      <h2>The Theft of All Time</h2>
                      <p>
                        The Theft of All Time beckons the reader to witness a
                        theft that defies comprehension—a crime that transcends
                        the linear chains of past, present, and future. The
                        stars themselves may tremble at the implications, as
                        ancient forces stir and long-forgotten truths claw their
                        way into the light.
                      </p>
                    </article>
                  </div>
                  <div>
                    <span class="story-image-container">
                      <img
                        class="story-image"
                        src="https://img.youtube.com/vi/vMlxgr27mig/maxresdefault.jpg"
                        alt="Story"
                        width="1280"
                        height="720"
                      />
                      <img
                        class="play-icon"
                        src="/youtube.png"
                        alt="YouTube"
                        width="1280"
                        height="720"
                      />
                    </span>
                    <article>
                      <h2>The Theft of All Time</h2>
                      <p>
                        The Theft of All Time beckons the reader to witness a
                        theft that defies comprehension—a crime that transcends
                        the linear chains of past, present, and future. The
                        stars themselves may tremble at the implications, as
                        ancient forces stir and long-forgotten truths claw their
                        way into the light.
                      </p>
                    </article>
                  </div>
                  <div>
                    <span class="story-image-container">
                      <img
                        class="story-image"
                        src="https://img.youtube.com/vi/vMlxgr27mig/maxresdefault.jpg"
                        alt="Story"
                        width="1280"
                        height="720"
                      />
                      <img
                        class="play-icon"
                        src="/youtube.png"
                        alt="YouTube"
                        width="1280"
                        height="720"
                      />
                    </span>
                    <article>
                      <h2>The Theft of All Time</h2>
                      <p>
                        The Theft of All Time beckons the reader to witness a
                        theft that defies comprehension—a crime that transcends
                        the linear chains of past, present, and future. The
                        stars themselves may tremble at the implications, as
                        ancient forces stir and long-forgotten truths claw their
                        way into the light.
                      </p>
                    </article>
                  </div>
                </div>
                <!-- {/if} -->
              </section>
            </section>
          {/if}
        </section>
      {/key}
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
    cursor: default;

    .character-window {
      display: flex;
      flex-flow: column nowrap;
      justify-content: center;
      align-items: center;
      gap: 2vw;
      animation: fade 1s ease-in-out forwards;
    }

    main {
      padding: 1vw;

      img {
        cursor: pointer;
        transition: all 0.3s ease-in-out;
      }

      .scalable {
        cursor: zoom-in;

        &:active {
          transform: scale(2) !important;
          border-radius: 50% !important;
        }
      }

      .close-button,
      .back-arrow {
        z-index: 10;
        position: absolute;
        top: 0;
        right: 0;
        margin: 1vw;
        padding: 1vw;
        font-size: 2vw;
        line-height: 2vw;
        background-color: rgba(22, 30, 95, 0.9);
        border-radius: 1vw;

        &:hover,
        &:active {
          background-color: rgba(45, 90, 216, 0.9);
        }
      }

      .back-arrow {
        padding: 0.5vw;
        right: auto;
        left: 0;

        img {
          width: 3vw;
          height: auto;
          opacity: 0.75;
        }
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
          transform: none !important;
          cursor: default;
        }

        h1 {
          font-size: 2.5vw;
          line-height: 2vw;
          color: rgba(51, 226, 230, 0.75);
        }
      }

      .general-info {
        width: 95%;
        padding: 1vw;
        background-color: rgba(51, 226, 230, 0.1);
        border: 0.1vw solid rgba(51, 226, 230, 0.25);
        border-radius: 1vw;
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
        justify-content: space-between;
        gap: 2vw;

        .image-container {
          display: flex;
          flex-flow: column nowrap;
          align-items: center;
          width: 15vw;
          border: 0.1vw solid rgba(51, 226, 230, 0.25);
          border-radius: 0.5vw;

          img {
            z-index: 1;
            width: inherit;
            height: 15vw;
            object-fit: cover;
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

            &:hover,
            &:active {
              transform: none;
              color: #010020;
              background-color: rgba(51, 226, 230, 0.75);
            }
          }

          div {
            width: inherit;
            display: flex;
            flex-flow: row nowrap;
            height: 3vw;

            a {
              width: 7.5vw;
              height: auto;
              display: flex;
              flex-flow: row nowrap;
              justify-content: center;
              align-items: center;
              background-color: rgba(1, 0, 32, 0.5);
              border: 0.1vw solid rgba(51, 226, 230, 0.25);

              img {
                z-index: 0;
                width: auto;
                height: 2vw;
                background-color: transparent;
                opacity: 0.9;
                filter: drop-shadow(0 0 0.5vw rgba(1, 0, 32, 0.5));
              }

              &:hover,
              &:active {
                background-color: rgba(51, 226, 230, 0.25);
              }
            }
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
          color: rgba(51, 226, 230, 0.75);

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

      .play-button {
        width: 95%;
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-around;
        align-items: center;
        padding: 0.5vw 2vw;
        gap: 2vw;
        font-size: 2vw;
        color: #010020;
        background-color: rgba(51, 226, 230, 0.5);
        border: 0.1vw solid rgba(36, 65, 189, 0.75);
        border-radius: 1vw;

        p {
          text-align: right;
          text-shadow: 0 0 0.1vw #010020;
          width: 12.5vw;
          white-space: nowrap;
        }

        div {
          display: flex;
          flex-flow: row wrap;
          justify-content: center;
          padding: 1vw;
          gap: 1vw;
          background-color: rgba(1, 0, 32, 0.75);
          border: 0.1vw solid rgba(36, 65, 189, 0.75);

          button {
            font-size: 1.25vw;
            line-height: 1.25vw;
            padding: 1vw 2vw;
            color: #dedede;
            background-color: rgba(36, 65, 189, 0.75);
            border: 0.1vw solid rgba(51, 226, 230, 0.25);
            border-radius: 1vw;

            &:hover,
            &:active {
              color: rgba(51, 226, 230, 0.9);
              text-shadow: 0 0 0.1vw rgba(51, 226, 230, 0.5);
              background-color: rgba(45, 90, 216, 0.9);
            }
          }
        }

        img {
          width: 12.5vw;
          height: auto;
          cursor: default;
        }

        &:hover,
        &:active {
          transform: none;
        }
      }

      .time-system {
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 0;
        font-size: 1vw;
        margin: 2vw auto;

        p {
          text-align: center;
        }
      }

      .transformation {
        display: flex;
        flex-flow: row nowrap;
        justify-content: center;
        align-items: center;
        gap: 1vw;
        font-size: 1vw;

        div {
          display: flex;
          flex-flow: column nowrap;
          justify-content: center;
          align-items: center;

          img {
            width: 15vw;
            height: inherit;
            border: 0.1vw solid rgba(51, 226, 230, 0.5);
            border-radius: 7.5vw;
            margin-bottom: 0.5vw;

            &:hover {
              cursor: pointer;
              transform: scale(1.5);
              filter: drop-shadow(0 0 1rem rgba(51, 226, 230, 0.25));
            }
          }
        }

        span {
          font-size: 2vw;
        }
      }

      .history {
        padding-inline: 1vw;
        color: #dedede;
        font-size: 1vw;
      }

      .tabs-wrapper {
        width: 95%;

        .tabs-container {
          padding: 0;
          display: flex;
          flex-flow: row nowrap;
          justify-content: space-between;
          align-items: center;
          font-size: 1.25vw;
          line-height: 1.25vw;

          .tab {
            position: relative;
            margin: 0;
            padding: 1vw 4vw;
            background-color: rgba(51, 226, 230, 0.25);
            color: rgba(51, 226, 230, 0.9);
            border: none;
            border-bottom-left-radius: 0;
            border-bottom-right-radius: 0;
            transform: none !important;

            img {
              position: absolute;
              height: 2.5vw;
              width: auto;
            }

            .connections-icon {
              left: 102.5%;
            }

            .stories-icon {
              right: 102.5%;
            }
          }
        }

        .tab-section {
          padding: 1vw;
          background-color: rgba(51, 226, 230, 0.1);
          border: 0.1vw solid rgba(51, 226, 230, 0.25);
          border-radius: 1vw;
          border-top-left-radius: 0;
          border-top-right-radius: 0;
          font-size: 1vw;

          .connected-characters {
            display: flex;
            flex-flow: row wrap;
            align-items: center;
            justify-content: space-around;
            gap: 1vw;

            div {
              display: flex;
              flex-flow: column nowrap;
              align-items: center;
              width: 15vw;

              img {
                width: 15vw;
                height: inherit;
                border: 0.1vw solid rgba(51, 226, 230, 0.5);
                border-radius: 7.5vw;
                margin-bottom: 0.5vw;

                &:hover {
                  transform: scale(1.5);
                  filter: drop-shadow(0 0 1rem rgba(51, 226, 230, 0.25));
                }
              }
            }
          }

          .stories {
            display: flex;
            flex-flow: column nowrap;
            align-items: center;
            justify-content: center;
            gap: 1vw;

            div {
              width: 100%;
              display: flex;
              flex-flow: row nowrap;
              justify-content: space-between;
              align-items: center;
              gap: 2vw;
              background-color: rgba(51, 226, 230, 0.25);
              border-radius: 0.5vw;
              padding: 1vw;

              .story-image-container {
                position: relative;
                height: 15vw;
                width: 27.5vw;

                img {
                  height: 15vw;
                  width: 27.5vw;
                  object-fit: cover;
                }

                .story-image {
                  border: 0.1vw solid rgba(51, 226, 230, 0.25);
                }

                .play-icon {
                  position: absolute;
                  left: 0;
                  opacity: 0;
                  background-color: rgba(0, 0, 0, 0.75);

                  &:hover,
                  &:active {
                    opacity: 0.9;
                  }
                }
              }

              article {
                display: none;
                height: 15vw;
                max-width: 52.5vw;
                display: flex;
                flex-flow: column nowrap;
                justify-content: space-around;
                align-items: flex-start;
              }
            }
          }
        }
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
