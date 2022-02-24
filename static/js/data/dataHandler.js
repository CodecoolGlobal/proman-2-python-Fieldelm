export let dataHandler = {
    getBoards: async function () {
        return await apiGet("/api/boards");
    },
    getBoard: async function (boardId) {
        // the board is retrieved and then the callback function is called with the board
    },
    getStatuses: async function () {
        // the statuses are retrieved and then the callback function is called with the statuses
        return await apiGet("/api/statuses");
    },
    updateStatus: async function (card) {
        return await apiPut("/api/update/card-status/", card)
    },
    getCardsByBoardId: async function (boardId) {
        return await apiGet(`/api/boards/${boardId}/cards/`);
    },
    getAllCards: async function () {
        return await apiGet(`/api/boards/cards/all/`);
    },

    getCard: async function (cardId) {
        // the card is retrieved and then the callback function is called with the card
    },
    createNewBoard: async function (board) {
        return await apiPost('/api/create/board/', board)
        // creates new board, saves it and calls the callback function with its data
    },
    createNewCard: async function (cardTitle, boardId, statusId) {
        // creates new card, saves it and calls the callback function with its data
        let card = {}
        card.boardId = boardId;
        card.statusId = statusId;
        card.title = cardTitle;
        apiPost('/api/cards/create', card);
    },
    renameCard: async function (card) {
        return await apiPut("/api/update/card/", card)
    }
    ,

    deleteCard: async function (cardId) {
        return await apiGet(`/api/cards/${cardId}/delete/`);
    },
    updateBoard: async function (board) {
        return await apiPut("/api/update/board/", board)
    },

    deleteBoard: async function (boardId){
        return await apiDelete(`/api/boards/${boardId}/delete/`)
    }
}


async function apiGet(url) {
    let response = await fetch(url, {
        method: "GET",
    });
    if (response.ok) {
        return await response.json();
    }
}

async function apiPost(url, payload) {
    let response = await fetch(url, {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(payload)
    }).then(res => {
        console.log("Request complete! response:", res);
    })
}

async function apiDelete(url) {
    let response = await fetch(url, {
        method: 'DELETE',
        headers: {'Content-type': 'application/json'}

    });

}

async function apiPut(url, payload) {
    let response = await fetch(url, {
        method: "PUT",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(payload)
    }).then(res => {
        console.log("Request complete! response:", res)
    });
}


async function apiPatch(url) {
}
