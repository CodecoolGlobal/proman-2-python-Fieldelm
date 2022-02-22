import mimetypes

from dotenv import load_dotenv
from flask import Flask, redirect, render_template, request, session, url_for

import data_manager
import queries
from util import json_response

mimetypes.add_type('application/javascript', '.js')
app = Flask(__name__)
load_dotenv()

app.secret_key = b'_5#y2L"F4Q8z\n\xec]/'


@app.route("/",methods=['POST','GET'])
def index():
    """
    This is a one-pager which shows all the boards and cards
    """
    return render_template('index.html',
                           username = session.get('username', 0),
                           user_id = session.get('user_id', 0))


@app.route("/api/boards")
@json_response
def get_boards():
    """
    All the boards
    """
    return queries.get_boards()


@app.route("/api/boards/<int:board_id>/cards/")
@json_response
def get_cards_for_board(board_id: int):
    """
    All cards that belongs to a board
    :param board_id: id of the parent board
    """
    return queries.get_cards_for_board(board_id)


@app.route("/api/boards/create",methods=['POST','GET'])
def create_board():
    title = request.form.get('board-title')
    print(title)
    queries.create_board(title, session.get('user_id', default=0))
    return redirect('/')


@app.route('/login', methods = ['GET', 'POST'])
def login():
    if request.method == 'POST':
        user_input_username = request.form.get("username")
        user_input_password = request.form.get("password")

        if not (user_input_username and user_input_password):
            return render_template('login_problem.html')
        try:
            hashed_password = dict(queries.get_password_by_username(user_input_username)).get('password', 0)
        except:
            return render_template('login_problem.html')

        is_matching = data_manager.verify_password(user_input_password, hashed_password)
        if is_matching:
            session['username'] = request.form['username']
            session['user_id'] = queries.get_id_by_name(name = request.form['username'])['id']
            return redirect(url_for('index'))
        else:
            return render_template('login_problem.html',
                                   username = session.get('username', 0),
                                   user_id = session.get('user_id', 0))

    return render_template('login.html',
                           username = session.get('username', 0),
                           user_id = session.get('user_id', 0))


@app.route('/logout')
def logout():
    session.pop('username', None)
    session.pop('user_id', None)
    return redirect(url_for('index'))


@app.route('/registration', methods = ['GET', 'POST'])
def registration():
    alert_message = ""
    user_input_username = ""
    if request.method == 'POST':
        user_input_username = request.form.get("username")
        user_input_password = request.form.get("password")
        hashed_password = data_manager.hash_password(user_input_password)

        if not (user_input_username and user_input_password):
            alert_message = "missing"
        else:
            user_list_realdictrow = list(queries.get_usernames())
            user_list = []
            for row in user_list_realdictrow:
                user_list.append(row['username'])

            if user_input_username not in user_list:
                queries.add_new_user(user_input_username, hashed_password)
                session['username'] = request.form['username']
                user_id = queries.get_id_by_name(name = session['username'])['id']
                return redirect(url_for('index'))
            else:
                alert_message = "taken"

    return render_template('registration.html', alert_message = alert_message, username = user_input_username)


def main():
    app.run(debug = True)

    # Serving the favicon
    with app.app_context():
        app.add_url_rule('/favicon.ico', redirect_to = url_for('static', filename = 'favicon/favicon.ico'))


if __name__ == '__main__':
    main()
