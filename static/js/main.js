import {boardsManager} from "./controller/boardsManager.js";
import {domManager} from "./view/domManager.js";
import {dataHandler} from "./data/dataHandler.js";
import {modalManager} from "./controller/boardsManager.js";

async function init() {
    await boardsManager.loadBoards();
    modalManager.initNewBoardModal()
    modalManager.initModalButtons()
}

init()
