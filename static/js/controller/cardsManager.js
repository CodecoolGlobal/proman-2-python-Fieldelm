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
                // `button.board-add[data-boardId="${board['id']}"]`
                // `div.card-remove[data-id="${card['id']}"]`,
                `.card-remove[data-id="${card['id']}"]`,
                "click",
                deleteButtonHandler
            );
        }
    },
};

function deleteButtonHandler(clickEvent) {
    console.log("delete message")
    const delButton = clickEvent.target;
    const cardId = delButton.parentElement.dataset.id;
    const boardId = delButton.parentElement.parentElement.parentElement.getAttribute("data-boardid");
    console.log("boardId: " + boardId)

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
