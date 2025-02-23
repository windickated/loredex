<script lang="ts">
  export let episodeObject;
  const { title, link, bio, description } = episodeObject;

  let showDescription: boolean = false;

  // SVG Icons
  let playSvgFocus: boolean = false;
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<section>
  <div
    style={showDescription
      ? "box-shadow: inset 0 0 0.5vw #010020, 0 0.5vw 0.5vw #010020; transform: scale(1.01);"
      : ""}
  >
    {#if link}
      <span
        class="story-image-container"
        role="button"
        tabindex="0"
        on:click={() => {
          window.open(`https://www.youtube.com/watch?v=${link}`, "_blank");
        }}
      >
        <img
          class="story-image"
          src="https://img.youtube.com/vi/{link}/hqdefault.jpg"
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
    {:else}
      <img
        class="blank-image"
        src="/blank.avif"
        alt="Story"
        width="720"
        height="720"
      />
    {/if}
    <article>
      {#if link}
        <a
          href="https://www.youtube.com/watch?v={link}"
          target="_blank"
          on:pointerover={() => (playSvgFocus = true)}
          on:pointerout={() => (playSvgFocus = false)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="-100 -100 200 200"
            class="play-svg stories-icon"
            fill="none"
            stroke="rgb(51, 226, 230)"
            stroke-width="15"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polygon
              points="
                -26 -36 -26 36 36 0
              "
              fill="rgb(51, 226, 230)"
              transform={playSvgFocus ? "scale(1.5)" : ""}
            />
            <circle
              r={playSvgFocus ? "0" : "90"}
              opacity={playSvgFocus ? "0" : "1"}
            />
          </svg>
          <h2>{title}</h2>
        </a>
      {:else}
        <h2>{title}</h2>
      {/if}
      <p>{bio}</p>
      {#if description}
        <button
          on:click={() => {
            showDescription = !showDescription;
          }}
          style={showDescription
            ? "color: rgb(255, 60, 64); text-shadow: 0 0 0.25rem #010020;"
            : ""}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="-100 -100 200 200"
            class="option-selector-svg"
            fill={showDescription ? "rgb(255, 60, 64)" : "rgb(51, 226, 230)"}
            stroke={showDescription ? "rgb(255, 60, 64)" : "rgb(51, 226, 230)"}
            stroke-width="20"
            stroke-linecap="round"
            stroke-linejoin="round"
            transform={showDescription ? "rotate(180)" : ""}
            style={showDescription
              ? "filter: drop-shadow(0 0 0.25rem #010020)"
              : ""}
          >
            <polygon
              class="option-selector-icon"
              points="
                -40 -90 -40 90 50 0
              "
              opacity="0.75"
              transform="rotate(90)"
            />
          </svg>
          {showDescription ? "Hide" : "Show"} Summary
          <span>(SPOILERS)</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="-100 -100 200 200"
            class="warning-svg"
            fill={showDescription ? "rgb(255, 60, 64)" : "rgb(51, 226, 230)"}
            stroke={showDescription ? "rgb(255, 60, 64)" : "rgb(51, 226, 230)"}
            stroke-width="5"
            stroke-linejoin="round"
            stroke-linecap="round"
            transform={showDescription ? "scale(1.25)" : ""}
            style={showDescription
              ? "filter: drop-shadow(0 0 0.25rem #010020)"
              : ""}
          >
            <polygon
              points="0 -80 90 75 -90 75"
              fill="none"
              stroke-width="12"
              transform={showDescription ? "scale(0)" : ""}
            />
            <g transform={showDescription ? "scale(1.5)" : ""}>
              <circle r="12" cy="-20" />
              <path
                d="
                  M -12 -20
                  L -6 25
                  L 6 25
                  L 12 -20
                  Z
                "
              />
              <circle r="6" cy="25" />
              <circle r="8" cy="50" />
            </g>
          </svg>
        </button>
      {/if}
    </article>
  </div>

  {#if showDescription}
    <article class="description">{@html description}</article>
  {/if}
</section>

<style lang="scss">
  section {
    width: 100%;
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;

    div {
      width: 100%;
      display: flex;
      flex-flow: row nowrap;
      justify-content: flex-start;
      align-items: center;
      gap: 2vw;
      background-color: rgba(51, 226, 230, 0.25);
      border-radius: 0.5vw;
      padding: 1vw;
      box-shadow:
        inset 0 0 0.5vw #010020,
        0 0 0.5vw #010020;
      transition: all 0.5s cubic-bezier(0.075, 0.82, 0.165, 1);

      .story-image-container {
        position: relative;
        height: 14vw;
        width: 28vw;
        border-radius: 0.25vw;
        box-shadow: 0 0 0.5vw rgba(51, 226, 230, 0.25);
        cursor: pointer;

        img {
          height: 14vw;
          width: 28vw;
          object-fit: cover;
          border-radius: 0.25vw;
        }

        .play-icon {
          position: absolute;
          left: 0;
          opacity: 0;
          background-color: rgba(0, 0, 0, 0.75);
          transition: all 0.3s ease-in-out;

          &:hover,
          &:active {
            opacity: 0.9;
          }
        }
      }

      .blank-image {
        border: 0.1vw solid rgba(51, 226, 230, 0.25);
        width: 20vw;
        height: 14vw;
        object-fit: cover;
      }

      article {
        height: 100%;
        max-width: 52.5vw;
        display: flex;
        flex-flow: column nowrap;
        justify-content: space-around;
        align-items: flex-start;
        gap: 1vw;

        h2 {
          color: rgb(51, 226, 230);
          margin-block: 0;
        }

        a {
          display: flex;
          flex-flow: row nowrap;
          align-items: center;
          gap: 1vw;
          text-decoration: none;
          opacity: 0.9;
          transition: all 0.3s cubic-bezier(0.075, 0.82, 0.165, 1);

          svg {
            height: 2vw;
            width: 2vw;
          }

          &:hover,
          &:active {
            opacity: 1;
            filter: drop-shadow(0 0 0.1vw rgba(51, 226, 230, 0.5));
          }
        }

        button {
          border: none;
          border-radius: 0;
          font-size: 1.25vw;
          line-height: 1.25vw;
          color: rgb(51, 226, 230);
          background-color: transparent !important;
          opacity: 0.9;
          gap: 1vw;
          padding: 0;
          display: flex;
          align-items: center;

          svg {
            height: 1.5vw;
            width: 1.5vw;
          }

          &:hover,
          &:active {
            transform: none;
            opacity: 1;
            filter: drop-shadow(0 0 0.1vw rgba(51, 226, 230, 0.5));
          }
        }
      }
    }

    .description {
      width: 98%;
      padding: 1vw;
      background-color: rgba(51, 226, 230, 0.1);
      border-bottom-left-radius: 1vw;
      border-bottom-right-radius: 1vw;
      box-shadow:
        inset 0 0 0.5vw #010020,
        0 0 0.5vw #010020;
    }
  }

  @media only screen and (max-width: 600px) {
    section {
      div {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 0.5em;
        border-radius: 0.5em;
        padding: 1em;

        .story-image-container {
          height: 45vw;
          width: 90vw;

          img {
            height: 45vw;
            width: 90vw;
          }

          .play-icon {
            display: none;
          }
        }

        .blank-image {
          height: 90vw;
          width: 90vw;
        }

        article {
          height: auto;
          max-width: 90vw;
          align-items: center;
          text-align: center;
          gap: 0.5em;

          a {
            gap: 1em;

            svg {
              height: 2em;
              width: 2em;
            }

            h2 {
              line-height: 1.5em;
            }
          }

          button {
            font-size: 1.25em;
            line-height: 1.25em;
            gap: 0.5em;

            svg {
              height: 1.5em;
              width: 1.5em;
            }
          }
        }
      }

      .description {
        padding: 1em;
        border-bottom-left-radius: 0.5em;
        border-bottom-right-radius: 0.5em;
      }
    }
  }
</style>
