const Changelog = () => {
    return(
        <>
            <p><strong>Beta 1.0v</strong> - 14.09.2021<br/>
            Możesz dodać nowe zadanie i ukończyć je lub usunąć.</p>
            <p>plany na przyszłe wersje:</p>
            <ul>
                <li>Zmiany w szacie graficznej,</li>
                <li>Wyświetlana będzie data dodania i zakończenia zadania,</li>
                <li>Będzie możliwość dodania terminu wykonania zadania</li>
                <li>Jeśli termin upłynie, zadanie zostanie przeniesione do zadań "nieudanych"</li>
                <li>Optymalizacja kodu</li>
            </ul>
        </>
    )
}

const AddTaskPanel = (props) => {
    const {add, title, description, titleValue, descriptionValue, click} = props
    return(
        <>
        <div className="addTaskPanel">
        <h1>Todo List</h1>
            <div className ="addForm">
                <input maxlength="23" onClick={click} value={titleValue} onChange={title} type="text" placeholder={"Wpisz nazwę zadania"}/>
                <textarea onClick={click} value={descriptionValue} onChange={description} maxlength="80"  name="" id="" cols="30" rows="10" placeholder={"Wpisz krótki opis zadania (opcjonalnie, max 80 znaków)"}></textarea>
                <button onClick={add} className={"addButton"}>Dodaj zadanie</button>
            </div>
        </div>
        </>
    )
}

const OptionsPanel = (props) => {
    const {click} = props;
    return(
        <div className="options">
            <span className="activeTasks" onClick={click}>Aktywne</span>
            <span className="doneTasks" onClick={click}>Wykonane</span>
        </div>
    )
}

const ActiveTaskList = (props) => {
    const {tasks, complete, del} = props;
    return(
    <> 
        <ul className="tasks">
            {tasks.map(task => {return(
                <li className="element" key={task.id}>
                    <h2>{task.title}</h2>
                    <div className="description">{task.description}</div>
                    <h4>Data dodania: {task.startDate}</h4>
                    <button onClick={() => complete(task.id)}>Wykonane</button>
                    <button onClick={() => del(task.id)}>Usuń</button>
                </li>
            )})}
        </ul>
    </>
    )
}

const CompletedTasksList = (props) => {
    const {tasks, del} = props;
    return(
        <>
            <ul className="tasks">
                {tasks.map(task =>{return(
                    <li className="element" key={task.id}>
                        <h2>{task.title}</h2>
                        <h3>{task.description}</h3>
                        <button onClick={() => del(task.id)}>Usuń</button>
                    </li>
                )})}
            </ul>
        </>
    )
}


function startDate() {
    let date = new Date();
    let day = date.getDate();
    let month = date.getMonth();
    let year = date.getFullYear();
    let hour = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();
    if(day < 10) day = `0${day}`;
    if(month < 10) month = `0${month}`;
    if(hour < 10) hour = `0${hour}`;
    if(minutes < 10) minutes = `0${minutes}`;
    if(seconds < 10) seconds = `0${seconds}`;
    return `${day}.${month}.${year}  ${hour}:${minutes}:${seconds}`;
}

class Task {
    constructor(title, description){
        this.id = Math.random();
        this.title = title;
        this.startDate = startDate();
        this.description = description;
    }
}

class App extends React.Component {

    state = {
        activeTasks: localStorage.getItem("activeTasks") ? JSON.parse(localStorage.getItem('activeTasks')) : [],
        completedTasks: localStorage.getItem("doneTasks") ? JSON.parse(localStorage.getItem("doneTasks")) : [],
        taskTitle: '',
        taskDescription: '',
        option: "active",
        focusedOption: "active"
    }

  
    handleCompleteTask = (id) => {
        const {activeTasks, completedTasks} = this.state;
        const index = activeTasks.findIndex(task => task.id === id);
        activeTasks.map(task => {
            if(task.id === id) {
                this.addToLocalDoneTasks(task);
            }
        })
        activeTasks.splice(index, 1);
        localStorage.setItem('activeTasks', JSON.stringify(activeTasks));
        this.setState({
            activeTasks: activeTasks,
            completedTasks: completedTasks
        })
    }

    handleAddTask = (e) => {
        if(this.state.taskTitle === '') {
            return alert("Wpisz nazwę zadania!");
        }
        const newTask = new Task(this.state.taskTitle, this.state.taskDescription)
        const tasks = this.state.activeTasks;
        this.addToLocalStorage(newTask);
        this.setState({
            activeTasks: tasks,
            taskTitle: '',
            taskDescription: '',
        })
    }

    setTaskTitle = (e) => {
        this.setState({
            taskTitle: e.target.value,
        })
    }

    setTaskDescription = (e) => {
        this.setState({
            taskDescription: e.target.value
        })
    }

    addToLocalStorage = (task) => {
        const tasks = this.state.activeTasks;
        tasks.push(task);
        localStorage.setItem('activeTasks', JSON.stringify(tasks));
    }

    addToLocalDoneTasks = (task) => {
        const tasks = this.state.completedTasks;
        tasks.push(task);
        localStorage.setItem('doneTasks', JSON.stringify(tasks));
    }

    removeActiveTask = (id) => {
        const tasks = this.state.activeTasks;
        tasks.forEach((task, index) => {
            if(task.id === id) {
                tasks.splice(index, 1);
                this.setState({
                    activeTasks: tasks,
                })
            }
            localStorage.setItem('activeTasks', JSON.stringify(tasks));
        })
    }

    removeDoneTask = (id) => {
        const tasks = this.state.completedTasks;
        tasks.forEach((task, index) => {
            if(task.id === id) {
                tasks.splice(index, 1);
                this.setState({
                    completedTasks: tasks,
                })
            }
            localStorage.setItem('doneTasks', JSON.stringify(tasks));
        })
    }

    switchTasks = (e) => {
        if(e.target.className === "doneTasks") {
            this.setState({
                option: "done",
            })
        } else if(e.target.className === "activeTasks") {
            this.setState({
                option: "active",
            })
        }
    }

    displayList = () => {
        if(this.state.option === "active") {
            return (
                    <ActiveTaskList 
                    del={this.removeActiveTask}
                    complete={this.handleCompleteTask}
                    tasks={this.state.activeTasks}
                    display={this.displayTasks}
                    />
            )
        } else if(this.state.option === "done") {
            return (
                    <CompletedTasksList
                    del={this.removeDoneTask}
                    tasks={this.state.completedTasks}
                    />
            )
        }
    }
    render() {
        return(
            <>
                <AddTaskPanel
                description={this.setTaskDescription}
                titleValue={this.state.taskTitle}
                descriptionValue={this.state.taskDescription}
                title={this.setTaskTitle} 
                add={this.handleAddTask}
                />
                <OptionsPanel
                click={this.switchTasks}
                />
                <div className="lists">
                    {this.displayList()}
                </div>
            </>
        )
    }
}

ReactDOM.render( <App/> , document.getElementById('root'));