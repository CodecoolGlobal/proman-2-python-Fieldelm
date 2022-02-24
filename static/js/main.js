import {boardsManager} from "./controller/boardsManager.js";
import {domManager} from "./view/domManager.js";
import {dataHandler} from "./data/dataHandler.js";
import {boardSync} from "./controller/boardsManager.js"
import {cardSync} from "./controller/cardsManager.js";
import {modalManager} from "./controller/boardsManager.js";
//refresh rate in seconds
let refreshRate=1
async function init() {
    await boardsManager.loadBoards();
    boardsManager.initRefreshButton()
    modalManager.initNewBoardModal()
    modalManager.initModalButtons()
    window.boardsync=setInterval(boardSync,refreshRate*1000)
    window.cardsync=setInterval(cardSync,refreshRate*1000)
}

init()
