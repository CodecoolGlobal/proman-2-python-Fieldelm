import {boardsManager} from "./controller/boardsManager.js";
import {domManager} from "./view/domManager.js";
import {dataHandler} from "./data/dataHandler.js";
import {boardSync} from "./controller/boardsManager.js"
import {cardSync} from "./controller/cardsManager.js";
import {modalManager} from "./controller/boardsManager.js";

async function init() {
    await boardsManager.loadBoards();
    modalManager.initNewBoardModal()
    modalManager.initModalButtons()
    window.boardsync=setInterval(boardSync,2000)
    window.cardsync=setInterval(cardSync,2000)
}

init()
