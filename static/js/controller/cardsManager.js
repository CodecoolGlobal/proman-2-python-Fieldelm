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
            domManager.addChild(`#board${boardId}column${card['status_id']}`, content);
            domManager.addEventListener(
                `.card-remove[data-id="${card['id']}"]`,
                "click",
                deleteButtonHandler
            );
        }
    },
};

function deleteButtonHandler(clickEvent) {
    const delButton = clickEvent.target;
    const cardId = delButton.parentElement.dataset.id;
    const boardId = delButton.parentElement.parentElement.parentElement.getAttribute("data-boardid");

    dataHandler.deleteCard(cardId);
    const currentSection = document.querySelector(`#board${boardId}`)
    let cardsToDelete = currentSection.querySelectorAll(".card")
    for (const card of cardsToDelete) {
        card.remove();
    }
    setTimeout(() => {
        cardsManager.loadCards(boardId)
    }, 100);

}
