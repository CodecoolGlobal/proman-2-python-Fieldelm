export const htmlTemplates = {
    board: 1,
    card: 2
}

export const builderFunctions = {
    [htmlTemplates.board]: boardBuilder,
    [htmlTemplates.card]: cardBuilder
};

export function htmlFactory(template) {
    if (builderFunctions.hasOwnProperty(template)) {
        return builderFunctions[template];
    }

    console.error("Undefined template: " + template);

    return () => {
        return "";
    };
}

function boardBuilder(board, columns) {

    let header = ` <div class="board-header"><span class="board-title" data-boardId="${board.id}">${board.title}</span>
                <button class="board-add" data-boardId="${board.id}">Add Card</button>
                <button class="board-toggle" data-boardId="${board.id}" data-state="open">Close</button>
                <button class="board-remove" data-boardId="${board.id}"><i data-boardid="${board.id}" class="fas fa-trash-alt"></i></button>
            </div>`
    let section = `<section class="board" id="board${board.id}">${header}<div class="board-columns" data-boardid="${board.id}">`
    for (let column of columns) {
        section = section + `
                <div class="board-column" data-statusid="${column.id}">
                    <div class="board-column-title">${column.title}</div>
                    <div class="board-column-content" data-boardId="${board.id}"  id="board${board.id}column${column.id}">
                        </div>
                    </div>`
    }
    return section + `</div></section>`
}

function cardBuilder(card) {

    return `<div class="card" id="card${card.id}" data-cardid="${card.id}" data-id="${card.id}" data-order="${card.card_order}">
            <div class="card-remove" data-id="${card.id}"><i class="fas fa-trash-alt"></i></div>
            <div class="card-title">${card.title}</div>
            </div>`
    // return `<div class="card" data-card-id="${card.id}">${card.title}</div>`;
}

