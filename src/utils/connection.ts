import characters from "../data/characters.ts";
import setColor from "./color";

const renderConnections = () => {
  characters.map((character) => {
    if (!character.appearance) return;

    const renderConnectionsGroup = () => {
      const connectionsContainer = document.querySelector(
        ".connections-container"
      );
      let characterConnections: string = "";

      function connectCharacters(connectedCharacter: string, type: string = "") {
        if (!character.appearance) return;
        const color = setColor(type);
        connect(character.name, connectedCharacter, color);
      }

      const connect = (
        name1: string,
        name2: string,
        color: string
      ) => {
        const tile1 = document.getElementById(name1) as HTMLElement;
        const tile2 = document.getElementById(name2) as HTMLElement;

        const off1 = getOffset(tile1);
        const off2 = getOffset(tile2);

        const x1 = off1.left + off1.width / 2;
        const y1 = off1.top + off1.height / 2;
        const x2 = off2.left + off2.width / 2;
        const y2 = off2.top + off2.height / 2;

        const angle = Math.atan2(y1 - y2, x1 - x2) * (180 / Math.PI);

        let cx = (x1 + x2) / 2;
        let cy = (y1 + y2) / 2;
        setDeviation();

        characterConnections += `
          <path
            stroke="${color}"
            d="
              M ${x1} ${y1}
              Q ${cx} ${cy} ${x2} ${y2}
            "
            style="stroke-dasharray: 100%; stroke-dashoffset: 100%; transition: all 1.8s ease-in-out;"
          />
        `;

        function setDeviation() {
          const side = Math.random() > 0.5 ? "positive" : "negative";
          if (side == "positive") {
            cx += angle * 2;
            cy += angle * 2;
          } else if (side == "negative") {
            cx -= angle * 2;
            cy -= angle * 2;
          }
        }
      }

      const getOffset = (element: HTMLElement) => {
        const map = document.querySelector(".map-wrapper") as HTMLElement;
        const rect = element.getBoundingClientRect();
        return {
          left: rect.left + window.scrollX - map.offsetLeft,
          top: rect.top + window.scrollY - map.offsetTop,
          width: rect.width || element.offsetWidth,
          height: rect.height || element.offsetHeight,
        };
      }

      if (character.connections) {
        if (character.connections.allies) {
          character.connections.allies.map((connectedCharacter) =>
            connectCharacters(connectedCharacter, 'good'));
        }
        if (character.connections.enemies) {
          character.connections.enemies.map((connectedCharacter) =>
            connectCharacters(connectedCharacter, 'evil'));
        }
        if (character.connections.neutral) {
          character.connections.neutral.map((connectedCharacter) =>
            connectCharacters(connectedCharacter))
        }
        if (character.connections.locations) {
          character.connections.locations.map((connectedCharacter) =>
            connectCharacters(connectedCharacter))
        }
      }

      connectionsContainer!.innerHTML += `
        <g id="connections-[${character.name}]" style="opacity: 0; transition: opacity 0.6s ease-in-out;">
          ${characterConnections}
        </g>
      `
    }

    renderConnectionsGroup();
  });
}

export default renderConnections;