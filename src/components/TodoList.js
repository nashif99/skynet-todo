import React, {useState} from 'react'
import { Button, Header, Input } from 'semantic-ui-react';
import Todo from './Todo';
import TodoForm from './todoForm'

const TodoList = (props) => {
    //const [todos, setTodos] = useState([]);
    const [input, setInput] =useState('');
    let todos = props.todos

    const Login =e  =>{
        props.handleMySkyLogin();
        props.loadData(e);

    }

    const addTodo = todo => {
        if(!todo.text){
            return;
        }

        const newTodos = [todo, ...todos];
        props.setTodos(newTodos);
        console.log('todo added');
        console.log(props.todos)
        const jsonData = {
            name:props.name,
            skylinkUrl: props.fileSkylink,
            dirSkylink: props.webPageSkylink,
            dirSkylinkUrl: props.webPageSkylinkUrl,
            color: props.userColor,
            todos: newTodos
          };
        props.handleMySkyWrite(jsonData)
    }

    const removeTodo = id =>{
        const removeArr =[...todos].filter(todo => todo.id !== id);

        props.setTodos(removeArr);
    }

    const updateTodo = (todoId, newVal) => {
        if(!newVal.text){
            return;
        }

        props.setTodos(prev =>prev.map(item =>(item.id === todoId ? newVal : item)))
    }


    const completeTodo = id => {
        let updatedTodos = todos.map(todo=> {
            if(todo.id === id){
                todo.isComplete = !todo.isComplete
            }
            return todo
        })

        props.setTodos(updatedTodos)
    }

    return (
        <div>
            <h1>Todo list</h1>
            {props.loggedIn  === false && (<Button onClick={Login}>
                login
            </Button>)}
            {props.loggedIn  === true && (
            <>
            <Header as ="h1">Welcome User:</Header>
            <Input
                  placeholder="You must Login with MySky..."
                  value={props.userID}
                  icon="user circle"
                  iconPosition="left"
                  onChange={(e)=>setInput(e.target.value)}
            />
            <Button onClick={props.handleMySkyLogout}>
                logout
            </Button>
            <Header as='h1' >File Path</Header>
            <Input 
                type = 'text'
                placeholder = 'Please enter a filepath'
                value ={props.dataKey} 
                onChange={(e) => {
                    e.preventDefault(); 
                    props.setDataKey(e.target.value)}} 
            />
            

            <div>
            
            <Button onClick={(e) => {props.loadData()}}>
                load
            </Button>
            </div>
            
            </>)}
            
            
            <TodoForm {...props} onSubmit={addTodo}/>
            <Todo todos={todos} completeTodo={completeTodo} removeTodo={removeTodo} updateTodo={updateTodo}/>
        </div>
    )
}

export default TodoList
