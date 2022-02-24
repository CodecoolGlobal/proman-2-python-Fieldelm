import {dataHandler} from "../data/dataHandler.js";
import {htmlFactory, htmlTemplates} from "../view/htmlFactory.js";
import {domManager} from "../view/domManager.js";
import {reloadBoards} from "./boardsManager.js";

export let cardsManager = {
    loadCards: async function (boardId) {
        const cards = await dataHandler.getCardsByBoardId(boardId);

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
function  updateTitle(card) {

        const oldTitleDiv = card.querySelector(".card-title")
        const oldTitle = oldTitleDiv.innerText
        console.log(oldTitleDiv)
        oldTitleDiv.innerText = ""
        let newTitleInput = document.createElement("input");
        newTitleInput.value = oldTitle;
        card.appendChild(newTitleInput);
        newTitleInput.addEventListener("keydown", ev => {
            if (ev.code === 'Enter'){

                oldTitleDiv.innerText = newTitleInput.value
                let cardObj = {"title" : newTitleInput.value, "id": card.dataset.cardid}
                dataHandler.renameCard(cardObj)
                reloadBoards()
            }
        })

}