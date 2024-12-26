<script lang="ts">
  export let episodeObject;
  const { title, link, bio, description } = episodeObject;

  let showDescription: boolean = false;
</script>

<section>
  <div>
    {#if link}
      <!-- svelte-ignore a11y_click_events_have_key_events -->
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
        <a href="https://www.youtube.com/watch?v={link}" target="_blank">
          <img src="/play.png" alt="Stories" />
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
        >
          <img
            src="/drop-down.png"
            alt="Description"
            style={showDescription ? "transform: rotate(180deg);" : ""}
          />
          {showDescription ? "Hide" : "Show"} Summary
          <span
            style={showDescription
              ? "color: rgb(255, 60, 64); text-shadow: 0 0 0.25rem #010020;"
              : ""}>(SPOILERS)</span
          >
          <img
            src={showDescription ? "/warning.png" : "/warning-neon.png"}
            alt="Warning!"
            style={showDescription
              ? "filter: drop-shadow(0 0 0.25rem #010020)"
              : ""}
          />
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

      .story-image-container {
        position: relative;
        height: 15vw;
        width: 27.5vw;
        cursor: pointer;

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
        height: 15vw;
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

          img {
            height: 2vw;
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

          img {
            width: 1.5vw;
            transition: all 0.3s ease-in-out;
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
          height: 50vw;
          width: 90vw;

          img {
            height: 50vw;
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

            img {
              height: 2em;
            }

            h2 {
              line-height: 1.5em;
            }
          }

          button {
            font-size: 1.25em;
            line-height: 1.25em;
            gap: 0.5em;

            img {
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
