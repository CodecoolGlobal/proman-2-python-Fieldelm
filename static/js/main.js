import {boardsManager} from "./controller/boardsManager.js";
import {domManager} from "./view/domManager.js";

function close() {
    this.parentElement.parentElement.parentElement.classList.remove("is-visible")
}

const initModalButtons = () => {
    const openEls = document.querySelectorAll("[data-open]");
    for (const el of openEls) {
        el.addEventListener("click", function () {
            const modalId = this.dataset.open;
            document.getElementById(modalId).classList.add("is-visible");
        });
    }

const isVisible = "is-visible";

document.addEventListener("click", e => {
  if (e.target == document.querySelector(".modal.is-visible")) {
    document.querySelector(".modal.is-visible").classList.remove(isVisible);
  }
});
    domManager.addEventListener(
        `[data-close]`,
        "click",
        close)
}


async function init() {
    await boardsManager.loadBoards();
    initModalButtons()
}

init();
