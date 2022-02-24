import {dataHandler} from "../data/dataHandler.js"

const dom = {
    isEmpty: function (el) {
        return el.children.length === 0;
    },
    hasClass: function (el, cls) {
        return el.classList.contains(cls);
    },
};

const ui = {
    mixedCardsContainer: null,
    slots: null,
    cards: null,
};

const game = {
    dragged: null,
};

export function initDragAndDrop() {
    initElements();
    initDragEvents();
}

function initElements() {
    // debugger
    ui.cards = document.querySelectorAll(".card");
    ui.slots = document.querySelectorAll(".board-column");
    ui.cards.forEach(function (card) {
        card.setAttribute("draggable", 'true')
    });
}

function initDragEvents() {
    ui.cards.forEach(function (card) {
        initDraggable(card);
    });

    // initReturnzone()

    ui.slots.forEach(function (slot) {
        initDropzone(slot);
    });
}

function initDraggable(draggable) {
    draggable.setAttribute("draggable", 'true');
    draggable.addEventListener("dragstart", handleDragStart);
    draggable.addEventListener("dragend", handleDragEnd);
}

function initReturnzone() {
    const mixedCards = ui.mixedCardsContainer;
    mixedCards.addEventListener("dragenter", handleDragEnter);
    mixedCards.addEventListener("dragover", handleDragOver);
    mixedCards.addEventListener("dragleave", handleDragLeave);
    mixedCards.addEventListener("drop", handleDrop);
}

function initDropzone(dropzone) {
    dropzone.addEventListener("dragenter", handleDragEnter);
    dropzone.addEventListener("dragover", handleDragOver);
    dropzone.addEventListener("dragleave", handleDragLeave);
    dropzone.addEventListener("drop", handleDrop);
}

function handleDragStart(e) {
    game.dragged = e.currentTarget;
    game.dragged.firstChild.classList.add("dragging")
    console.log("Drag start of", game.dragged);
}

function handleDragEnd() {
    console.log("Drag end of", game.dragged);
    game.dragged.classList.remove("dragging")
    game.dragged = null;
}

function handleDragOver(e) {
    e.preventDefault();
}

function handleDragEnter(e) {
    console.log("Drag enter of", e.currentTarget);
    e.currentTarget.classList.add("drag-over")
}

function handleDragLeave(e) {
    console.log("Drag leave of", e.currentTarget);
    e.currentTarget.classList.remove("drag-over")
}

function handleDrop(e) {
    e.preventDefault();
    e.currentTarget.classList.remove("drag-over")
    const dropzone = e.currentTarget;
    console.log("Drop of", dropzone);
    if (dom.hasClass(dropzone, "board-column")) {
        if (game.dragged.parentElement.parentElement.dataset.statusid!==e.currentTarget.dataset.statusid){
        if (game.dragged.parentElement.dataset.boardid === e.currentTarget.parentElement.dataset.boardid) {
            dropzone.children[1].appendChild(game.dragged);
        let obj = {
            "card_id": game.dragged.dataset.id,
            "status_id": e.currentTarget.dataset.statusid,
            "board_id":game.dragged.parentElement.dataset.boardid
        }
        dataHandler.updateStatus(obj)}
    }
        }
}