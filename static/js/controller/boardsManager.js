import {dataHandler} from "../data/dataHandler.js";
import {htmlFactory, htmlTemplates} from "../view/htmlFactory.js";
import {domManager} from "../view/domManager.js";
import {cardsManager} from "./cardsManager.js";

export let boardsManager = {
    loadBoards: async function () {
        const boards = await dataHandler.getBoards();
        const statuses = await dataHandler.getStatuses();
        for (let board of boards) {
            const boardBuilder = htmlFactory(htmlTemplates.board);
            const content = boardBuilder(board, statuses);
            domManager.addChild(".board-container", content);
            cardsManager.loadCards(board['id']);
            domManager.addEventListener(`span.board-title[data-boardId="${board['id']}"]`, 'click',renameBoard)
            domManager.addEventListener(
                `button.board-toggle[data-boardId="${board['id']}"]`,
                "click",
                showHideButtonHandler
            );
        }
    },
};
const reloadBoards = () => {
    let root = document.querySelector(".board-container")
    root.innerHTML = ""
    boardsManager.loadBoards()
}
export let modalManager = {
    initNewBoardModal: function () {
        let h1=document.querySelector('h1')
        let modal = document.createElement("div")
        h1.after(modal)
        modal.classList.add('new-board')
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
            textbox.value=""
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
    let state = clickEvent.target.dataset.state
    let target = clickEvent.target
    console.log(state)
    if (state === "closed") {
        target.parentElement.parentElement.children[1].classList.toggle("hidden")
        target.dataset.state = "open"
        target.textContent="Close"
      // ADD "ADD NEW CARD" BUTTON TO BOARD:
        //addNewCardButtonToBoard (board, boardId)
    } else if (state === "open") {
        target.parentElement.parentElement.children[1].classList.toggle("hidden")
        target.dataset.state = "closed"
        target.textContent="Open"
    }
}

function addNewCardButtonToBoard (board, boardId) {
    const divForAddCard = document.createElement("div")
    divForAddCard.classList = "add-new-card"
    const addCardButton = document.createElement("button");
    addCardButton.textContent = "Add new card";
    addCardButton.classList = "add-new-card-button"
    addCardButton.setAttribute("data-board-id", `${boardId}`)
    const inputField = document.createElement("input");
    inputField.type = "text";

    board.appendChild(divForAddCard);
    divForAddCard.appendChild(inputField);
    divForAddCard.appendChild(addCardButton);

    // ADD EVENTLISTENER TO "NEW CARD" BUTTON:
    addCardButton.addEventListener('click', (e) => {
        const statusId = 1;
        const title = addCardButton.previousElementSibling.value;
        console.log(title)
        dataHandler.createNewCard(title, boardId, statusId);
        let cardsToDelete = board.querySelectorAll(".card")
        for (const card of cardsToDelete) {
            card.remove();
        }
        setTimeout(() => {cardsManager.loadCards(boardId)}, 100);
        addCardButton.previousElementSibling.value = "";
    })
}

const renameBoard = (e) => {
    let input = document.createElement('input')
    input.value = e.target.textContent
    let button = document.createElement('button')
    button.textContent = "Save"
    e.target.parentElement.prepend(button)
    e.target.parentElement.prepend(input)
    e.target.classList.add('hidden')
    console.log(e.target.dataset.boardid)
    button.addEventListener('click', ()=> {
        let board = {'title' : input.value, 'board_id': e.target.dataset.boardid}
        dataHandler.updateBoard(board).then(reloadBoards)})

}
