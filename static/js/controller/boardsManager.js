import {dataHandler} from "../data/dataHandler.js";
import {htmlFactory, htmlTemplates} from "../view/htmlFactory.js";
import {domManager} from "../view/domManager.js";
import {cardsManager} from "./cardsManager.js";

export let boardsManager = {
    loadBoards: async function () {
        const boards = await dataHandler.getBoards();
        for (let board of boards) {
            const boardBuilder = htmlFactory(htmlTemplates.board);
            const content = boardBuilder(board);
            domManager.addChild("#root", content);
            domManager.addEventListener(
                `.toggle-board-button[data-board-id="${board.id}"]`,
                "click",
                showHideButtonHandler
            );
        }
    },
};

function showHideButtonHandler(clickEvent) {
    const boardId = clickEvent.target.dataset.boardId;
    let state = clickEvent.target.dataset.state
    const board = document.querySelector(`[data-board-id="${boardId}"]`)
    let title = board.firstChild.textContent
    console.log(state)
    if (state === "closed") {
        clickEvent.target.dataset.state = "open"
        clickEvent.target.textContent='Hide Cards'
        board.innerHTML = ""
        board.textContent = title
        cardsManager.loadCards(boardId);
    }
    else if (state==="open"){
        clickEvent.target.dataset.state = "closed"
        clickEvent.target.textContent='Show Cards'
        board.innerHTML = ""
        board.textContent = title
    }

}
