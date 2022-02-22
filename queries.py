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
    # return [{"title": "board1", "id": 1}, {"title": "board2", "id": 2}]

    return data_manager.execute_select(
        """
        SELECT * FROM boards
        ;
        """
    )


def get_cards_for_board(board_id):
    matching_cards = data_manager.execute_select(
        """
        SELECT * FROM cards
        WHERE cards.board_id = %(board_id)s
        ;
        """
        , {"board_id": board_id})

    return matching_cards


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
    """
    Gather all boards
    :return:
    """
    # remove this code once you implement the database
    # return [{"title": "board1", "id": 1}, {"title": "board2", "id": 2}]

    return data_manager.execute_select(
        """
        SELECT username FROM users
        ;
        """
    )

