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

    let header = ` <div class="board-header"><span class="board-title">${board.title}</span>
                <button class="board-add" data-boardId="${board.id}">Add Card</button>
                <button class="board-toggle" data-boardId="${board.id}" data-state="open">Close</button>
            </div>`
    let section = `<section class="board" id="board${board.id}">${header}<div class="board-columns">`
    for (let column of columns) {
        section = section + `
                <div class="board-column">
                    <div class="board-column-title">${column.title}</div>
                    <div class="board-column-content" data-boardId="${board.id}" data-statusId id="board${board.id}column${column.id}">
                        </div>
                    </div>`
    }
    return section + `</div></section>`
}

function cardBuilder(card) {

    return `<div class="card" data-id="${card.id}">
            <div class="card-remove" data-id="${card.id}"><i class="fas fa-trash-alt"></i></div>
            <div class="card-title">${card.title}</div>
            </div>`
    // return `<div class="card" data-card-id="${card.id}">${card.title}</div>`;
}

