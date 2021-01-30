import sys
from datetime import datetime

# ./todo html
# <ul>
# <li>water plants</li>
# <li>eat food</li>
# </ul>

def help():
    msg = '''Usage :-
$ ./todo add \"todo item\"  # Add a new todo
$ ./todo ls               # Show remaining todos
$ ./todo del NUMBER       # Delete a todo
$ ./todo done NUMBER      # Complete a todo
$ ./todo help             # Show usage
$ ./todo report           # Statistics'''
    sys.stdout.buffer.write(msg.encode('utf-8'))


def add_task(task):
    with open('./todo.txt', 'a') as todo_file:
        todo_file.write(task+'\n')
    return f'Added todo: "{task}"'


def list_task():
    try:
        with open('./todo.txt', 'r') as todo_file:
            text = todo_file.readlines()
        if len(text) < 1:
            print('No tasks to show')
        for i in range(len(text), 0, -1):
            sys.stdout.buffer.write(f'[{i}] {text[i-1]}'.encode('utf-8'))
    except:
        print('There are no pending todos!')


def delete_task(task, done=False):
    with open('./todo.txt', 'r') as todo_file:
        todos = todo_file.readlines()
    if task not in range(1, len(todos)+1):
        return f'Error: todo #{task} does not exist. Nothing deleted.'
    done_task = todos.pop(task - 1)
    with open('todo.txt', 'w') as file:
        file.writelines(todos)
    if done:
        with open('done.txt', 'a') as done_file:
            done_file.writelines(
                'x ' + datetime.utcnow().strftime("%Y-%m-%d") + ' ' + done_task)
        return f'Marked todo #{task} as done.'
    else:
        return f'Deleted todo #{task}'


try:
    task = sys.argv[1]
    if task == 'add':
        try:
            print(add_task(sys.argv[2]))
        except:
            print("Error: Missing todo string. Nothing added!")
    elif task == 'ls':
        list_task()
    elif task == 'del':
        try:
            print(delete_task(int(sys.argv[2])))
        except FileNotFoundError:
            print("Error: Missing todo string. Nothing deleted!")
        except:
            print("Error: Missing NUMBER for deleting todo.")
    elif task == 'done':
        try:
            print(delete_task(int(sys.argv[2]), done=True))
        except FileNotFoundError:
            print("Error: Missing todo string. Nothing added!")
        except:
            print("Error: Missing NUMBER for marking todo as done.")
    elif task == 'report':
        try:
            with open('todo.txt', 'r') as todo_file:
                todos = len(todo_file.readlines())
        except:
            todos = 0
        try:
            with open('done.txt', 'r') as done_file:
                dones = len(done_file.readlines())
        except:
            dones = 0
        finally:
            msg = datetime.utcnow().strftime("%Y-%m-%d") + ' Pending : ' + \
                str(todos) + ' Completed : '+str(dones)
            sys.stdout.buffer.write(msg.encode('utf-8'))

    elif task == 'html':
        try:
            with open('todo.txt', 'r') as todo_file:
                todos = todo_file.readlines()
            html = '<ul>\n'
            # for task in todos:
            #     html += f'<li>{task[:-1]}</li>\n'
            
            cnt = list(map(lambda task: "<li>" + task.strip("\n") + "</li>", todos))
            html += '\n'.join(cnt)
            html += '</ul>'
            print(html)
        except:
            help()
    else:
        help()
except:
    help()
