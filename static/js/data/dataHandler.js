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
    getStatus: async function (statusId) {
        // the status is retrieved and then the callback function is called with the status
    },
    getCardsByBoardId: async function (boardId) {
        return await apiGet(`/api/boards/${boardId}/cards/`);
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
        apiPost_2('/api/cards/create', card);
    },
};

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

async function apiPost_2(url, payload) {
  let response = await fetch(url,{
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
      'Content-Type': 'application/json'
    }});
  if(response.status === 200){
    let data = response.json();
    console.log(data);
  }
}

async function apiDelete(url) {
}

async function apiPut(url) {
}

async function apiPatch(url) {
}
