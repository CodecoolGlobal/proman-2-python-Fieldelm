import {dataHandler} from "../data/dataHandler.js";
import {htmlFactory, htmlTemplates} from "../view/htmlFactory.js";
import {domManager} from "../view/domManager.js";
import {cardsManager} from "./cardsManager.js";
import{isEqual} from "../util.js";

let liveBoards;
export let boardsManager = {
    loadBoards: async function () {
        const boards = await dataHandler.getBoards();
        liveBoards=boards
        const statuses = await dataHandler.getStatuses();
        for (let board of boards) {
            const boardBuilder = htmlFactory(htmlTemplates.board);
            const content = boardBuilder(board, statuses);
            domManager.addChild(".board-container", content);
            cardsManager.loadCards(board['id']);
            domManager.addEventListener(`span.board-title[data-boardId="${board['id']}"]`, 'click', renameBoard)
            domManager.addEventListener(
                `button.board-toggle[data-boardId="${board['id']}"]`,
                "click",
                showHideButtonHandler
            );
            domManager.addEventListener(
                `button.board-add[data-boardId="${board['id']}"]`,
                "click",
                createCardHandler
             );
            domManager.addEventListener(
                `button.board-remove[data-boardId="${board['id']}"]`,
                "click",
                deleteBoard
            )
        }
    },
    manualRefresh: function (){
        reloadBoards()
    },
    initRefreshButton:function (){
        let container = document.querySelector(".board-container")
        let button=document.createElement('button')
        button.textContent="Refresh"
        button.classList.add("refresh")
        button.addEventListener('click',this.manualRefresh)
        container.before(button)
    }
};


export const boardSync = async () => {
    let boards = await dataHandler.getBoards()
    if (!isEqual(boards,liveBoards)) {
        reloadBoards()
    }
}

export const reloadBoards = () => {
    let root = document.querySelector(".board-container")
    root.innerHTML = ""
    boardsManager.loadBoards().then(console.log('reloaded boards'))
}
export let modalManager = {
    initNewBoardModal: function () {
        let h1 = document.querySelector('h1')
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
            textbox.value = ""
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
    } else if (state === "open") {
        target.parentElement.parentElement.children[1].classList.toggle("hidden")
        target.dataset.state = "closed"
        target.textContent="Open"
    }
}


function createCardHandler(clickEvent) {
    const myButton = clickEvent.target;
    const boardId = myButton.dataset.boardid;
    const myHeader = myButton.parentElement;
    const inputField = document.createElement("input");
    inputField.type = "text";
    const saveCardButton = document.createElement("button");
    saveCardButton.textContent = "Save Card";
    saveCardButton.classList = "add-new-card-button";
    saveCardButton.setAttribute("data-board-id", `${boardId}`);

    // IF "ADD CARD" IS NOT OPEN:
    if (myButton.parentElement.children.length <= 3) {
        myHeader.appendChild(inputField);
        myHeader.appendChild(saveCardButton);

        // ADD EVENTLISTENER TO "SAVE CARD" BUTTON:
        saveCardButton.addEventListener('click', (e) => {
            const statusId = 1;
            const title = inputField.value;
            dataHandler.createNewCard(title, boardId, statusId);
            let cardsToDelete = myButton.parentElement.parentElement.querySelectorAll(".card")
            for (const card of cardsToDelete) {
                card.remove();
            }
            setTimeout(() => {
                cardsManager.loadCards(boardId)
            }, 100);
            inputField.remove();
            saveCardButton.remove();
        })
    } else {
        //myHeader.querySelector(".add-new-card-button").remove();
        myHeader.querySelector("input").remove();
    }
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
    button.addEventListener('click', () => {
        let board = {'title': input.value, 'board_id': e.target.dataset.boardid}
        dataHandler.updateBoard(board).then(reloadBoards)
    })
}

function deleteBoard(e){
    console.log(e.currentTarget)
    let boardId = e.currentTarget.dataset.boardid
    dataHandler.deleteBoard(boardId)
}
