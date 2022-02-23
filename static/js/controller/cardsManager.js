import {dataHandler} from "../data/dataHandler.js";
import {htmlFactory, htmlTemplates} from "../view/htmlFactory.js";
import {domManager} from "../view/domManager.js";
import {reloadBoards} from "./boardsManager.js";
import {isEqual} from "../util.js";

let liveCards;
export let cardsManager = {
    loadCards: async function (boardId) {
        const cards = await dataHandler.getCardsByBoardId(boardId);
        liveCards = await dataHandler.getAllCards()
        console.log(liveCards)
        for (let card of cards) {
            const cardBuilder = htmlFactory(htmlTemplates.card);
            const content = cardBuilder(card);
            domManager.addChild(`#board${boardId}column${card['status_id']}`, content);
            // domManager.addEventListener(
            //     `.card[data-card-id="${card.id}"]`,
            //     "click",
            //     deleteButtonHandler
            // );
        }
    },
};
export const cardSync = async () => {
    let newCards = await dataHandler.getAllCards()
    console.log(isEqual(newCards, liveCards))
    console.log(newCards)
    console.log(liveCards)
    if (!isEqual(newCards, liveCards)) {
        reloadBoards()
    }
}

function deleteButtonHandler(clickEvent) {
}
