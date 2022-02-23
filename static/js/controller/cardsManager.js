import {dataHandler} from "../data/dataHandler.js";
import {htmlFactory, htmlTemplates} from "../view/htmlFactory.js";
import {domManager} from "../view/domManager.js";

export let cardsManager = {
    loadCards: async function (boardId) {
        const cards = await dataHandler.getCardsByBoardId(boardId);
        console.log(cards)
        for (let card of cards) {
            const cardBuilder = htmlFactory(htmlTemplates.card);
            const content = cardBuilder(card);


            domManager.addEventListener(
                `.card[data-card-id="${card.id}"]`,
                "click",
                deleteButtonHandler
            );
            domManager.addEventListener(
                `.card[data-card-id="${card.id}"]`,
                "click", (e)=> {
                    updateTitle(e.currentTarget)
                }
            );
            domManager.addChild(`#board${boardId}column${card['status_id']}`, content);
            // domManager.addEventListener(
            //     `.card[data-card-id="${card.id}"]`,
            //     "click",
            //     deleteButtonHandler
            // );
        }
    },
};

function deleteButtonHandler(clickEvent) {

}
function  updateTitle(card){
    const inputField = document.createElement("input");
    inputField.type = "text";
    card.appendChild(inputField);
    const newTitle = inputField.value
    console.log(newTitle)
