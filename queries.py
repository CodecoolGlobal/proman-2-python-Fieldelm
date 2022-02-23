import data_manager



def get_card_status(status_id):
    """
    Find the first status matching the given id
    :param status_id:
    :return: str
    """
    status = data_manager.execute_select(
        """
        SELECT * FROM statuses s
        WHERE s.id = %(status_id)s
        ;
        """
        , {"status_id": status_id})

    return status


def get_boards():
    """
    Gather all boards
    :return:
    """
    # remove this code once you implement the database
    return data_manager.execute_select(
        """
        SELECT * FROM boards
        ;
        """
    )

def create_card(board_id, title):
    data_manager.execute_insert("""
    INSERT INTO cards (board_id, status_id, title, card_order)
     VALUES (%(bo_id)s, 1, %(ttl)s,(SELECT MAX(card_order)+1 FROM cards WHERE board_id = %(bo_id)s))""",
                                ({'bo_id': board_id, 'ttl': title}))


def get_statuses():
    return data_manager.execute_select("""SELECT * FROM statuses""")


def create_board(title, creator_id):
    data_manager.execute_insert("""
    INSERT INTO boards(title, creator_id) VALUES (%s,%s)
    """, (title, creator_id))


def get_cards_for_board(board_id):
    matching_cards = data_manager.execute_select(
        """
        SELECT * FROM cards
        WHERE cards.board_id = %(board_id)s
        ;
        """
        , {"board_id": board_id})

    return matching_cards


def create_card_for_board_status(card):
    data_manager.execute_insert(
        """
        INSERT INTO cards (board_id, status_id, title, card_order) 
        VALUES (%(board_id)s, %(status_id)s, %(title)s, (SELECT MAX(card_order)+1 FROM cards WHERE board_id=%(board_id)s AND status_id=%(status_id)s));
        """,
        {
            "board_id": card['boardId'],
            "status_id": card['statusId'],
            "title": card['title']
        }
    )
def edit_card_title(card, new_title):
    data_manager.execute_insert(
        """UPDATE cards SET title = %(title)s
        WHERE id = %(card_id)s;""",
        {
            "card_id" : card['cardId'],
            'title': new_title
        }
    )

# FOR USER REGISTRATION AND LOGIN:

def get_password_by_username(username):
    password = data_manager.execute_select(
    """
    SELECT password FROM users
    WHERE username = %(username)s;"""
    ,{"username": username}, False)

    return password


@data_manager.connection_handler
def add_new_user(cursor, username, hashed_password):
    query = """
    INSERT INTO users (username, password)
    VALUES (%s, %s);
    """
    cursor.execute(query, (username, hashed_password))


@data_manager.connection_handler
def get_id_by_name(cursor, name):
    query = """
    SELECT id FROM users
    WHERE username LIKE %s
    """
    cursor.execute(query,(name,))
    return cursor.fetchone()


def get_usernames():
    return data_manager.execute_select(
        """
        SELECT username FROM users
        ;
        """
    )

