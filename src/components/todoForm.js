import React, {useState, useEffect, useRef} from 'react'

function TodoForm(props) {
    const [input, setInput]= useState(props.edit? props.edit.value :'');

    const focus = useRef(null);

    /*useEffect(()=>
        focus.current.focus()
    )*/

    const handleChange =  e => {
        setInput(e.target.value)
    };

    const handleSubmisson = e => {
        console.log("handle submission")
        e.preventDefault();
        props.onSubmit({
            id: Math.floor(Math.random()*100000),
            text:input
        });

        setInput('');

    };

    



    return (
        <form className='todo-form' onSubmit={handleSubmisson}>
            {props.edit ?(
            <>
                <input
                type='text'
                placeholder='Update todo'
                value={input}
                name='text'
                className='todo-input edit'
                onChange={handleChange}
                ref ={focus}
                />
            <button className='todo-button edit'>Update To-Do</button>
            </>

            ) 
            : 
            (
            <>
            <input
                type='text'
                placeholder='Add a todo'
                value={input}
                name='text'
                className='todo-input'
                onChange={handleChange}
                ref ={focus}
            />
            <button className='todo-button'>Add To-Do</button>

            </>

            )
            }
        </form>
    )
}

export default TodoForm
