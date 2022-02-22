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
const reloadBoards = () => {
    let root = document.querySelector("#root")
    root.innerHTML = ""
    boardsManager.loadBoards()
}
export let modalManager = {
    initNewBoardModal: function () {
        let modal = document.createElement("div")
        document.body.appendChild(modal)
        modal.innerHTML = `<button type="button" class="open-modal" data-open="new-board">Create New Board</button>
    <div class="modal" id="new-board">
        <div class="modal-dialog">
            <section class="modal-content">
                    <label for="board-title">Board Name:</label>
                    <input name="board-title" id="board-title" type="text">
                    <button id="save-new-board">Save</button>
            </section>
        </div>`
        let textbox = document.querySelector('#board-title')
        domManager.addEventListener('#save-new-board', 'click', () => {
            let board = {"title": textbox.value}
            document.querySelector(".modal.is-visible").classList.remove("is-visible");
            dataHandler.createNewBoard(board).then(reloadBoards)

        })
    },
    initModalButtons: function () {
        const openEls = document.querySelectorAll("[data-open]");
        for (const el of openEls) {
            el.addEventListener("click", function () {
                const modalId = this.dataset.open;
                document.getElementById(modalId).classList.add("is-visible");
            });
        }
        document.addEventListener("click", e => {
            if (e.target == document.querySelector(".modal.is-visible")) {
                document.querySelector(".modal.is-visible").classList.remove("is-visible");
            }
        })
    }

}

function showHideButtonHandler(clickEvent) {
    const boardId = clickEvent.target.dataset.boardId;
    let state = clickEvent.target.dataset.state
    const board = document.querySelector(`[data-board-id="${boardId}"]`)
    let title = board.firstChild.textContent
    console.log(state)
    if (state === "closed") {
        clickEvent.target.dataset.state = "open"
        clickEvent.target.textContent = 'Hide Cards'
        board.innerHTML = ""
        board.textContent = title
        cardsManager.loadCards(boardId);
    } else if (state === "open") {
        clickEvent.target.dataset.state = "closed"
        clickEvent.target.textContent = 'Show Cards'
        board.innerHTML = ""
        board.textContent = title
    }

}
