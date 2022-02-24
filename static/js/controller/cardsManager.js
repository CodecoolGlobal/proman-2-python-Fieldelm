import {dataHandler} from "../data/dataHandler.js";
import {htmlFactory, htmlTemplates} from "../view/htmlFactory.js";
import {domManager} from "../view/domManager.js";
import {reloadBoards} from "./boardsManager.js";
import {isEqual} from "../util.js";


let liveCards;
export let cardsManager = {
    loadCards: async function (boardId) {
        let cards = await dataHandler.getCardsByBoardId(boardId);
        liveCards = await dataHandler.getAllCards()
        cards=sortCards(cards)
        console.log('cards')
        console.log(cards)
        for (let card of cards) {
            const cardBuilder = htmlFactory(htmlTemplates.card);
            const content = cardBuilder(card);
            domManager.addChild(`#board${boardId}column${card['status_id']}`, content);
            domManager.addEventListener(
                `#card${card.id}`,
                "click", (e)=>{
                    console.log(e.currentTarget)
                    if(e.currentTarget.childNodes.length===5) {
                        updateTitle(e.currentTarget)
                        console.log(e.currentTarget.childNodes.length)
                    }
                }
            );
            domManager.addEventListener(
                `.card-remove[data-id="${card['id']}"]`,
                "click",
                deleteButtonHandler
            );
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

function sortCards(cards) {
        return cards.sort((a, b) => a['card_order'] > b['card_order'] ? 1 : -1)
}

function  updateTitle(card) {

        const oldTitleDiv = card.querySelector(".card-title")
        const oldTitle = oldTitleDiv.innerText
        console.log(oldTitleDiv)
        oldTitleDiv.innerText = ""
        let newTitleInput = document.createElement("input");
        newTitleInput.value = oldTitle;
        card.appendChild(newTitleInput);
        newTitleInput.classList.add("new-card-title")
        newTitleInput.addEventListener("keydown", ev => {
            if (ev.code === 'Enter'){

                oldTitleDiv.innerText = newTitleInput.value
                let cardObj = {"title" : newTitleInput.value, "id": card.dataset.cardid}
                dataHandler.renameCard(cardObj)
                reloadBoards()
            }
        })

}