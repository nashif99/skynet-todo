//import logo from './logo.svg';
import './App.css';
//import { Header, Tab, Container } from 'semantic-ui-react';
import TodoForm from './components/todoForm';
import TodoList from './components/TodoList';

//import { useState, useEffect } from 'react';
//import { SkynetClient } from 'skynet-js';
//import { ContentRecordDAC } from '@skynetlabs/content-record-library';


// Import react components
import { useState, useEffect } from 'react';

// Import App Component & helper
//import WorkshopForm from './components/Form';
import generateWebPage from './helpers/generateWebPage';

// Import UI Components
import { Header, Tab, Container } from 'semantic-ui-react';

/************************************************/
/*        Step 4.2 Code goes here               */
/************************************************/
import { ContentRecordDAC } from '@skynetlabs/content-record-library';

/*****/

/************************************************/
/*        Step 1.2 Code goes here               */
/************************************************/
// Import the SkynetClient and a helper
import { getRelativeFilePath, getRootDirectory, SkynetClient } from "skynet-js";
import Todo from './components/Todo';

// We'll define a portal to allow for developing on localhost.
// When hosted on a skynet portal, SkynetClient doesn't need any arguments.
const portal =
  window.location.hostname === 'localhost' ? 'https://siasky.net' : undefined;

// Initiate the SkynetClient
const client = new SkynetClient(portal);

/*****/

/************************************************/
/*        Step 4.3 Code goes here               */
/************************************************/
const contentRecord = new ContentRecordDAC();

/*****/

function App() {
  // Define app state helpers

  // Step 1 Helpers


  // Step 2 Helpers
  const [name, setName] = useState('');


  // Step 3 Helpers
  const [dataKey, setDataKey] = useState('');
  const [filePath, setFilePath] = useState();
  const [userID, setUserID] = useState();
  const [mySky, setMySky] = useState();
  const [loggedIn, setLoggedIn] = useState(null);
  const [todos, setTodos] = useState([]);

  // When dataKey changes, update FilePath state.
  useEffect(() => {
    setFilePath(dataDomain + '/' + dataKey);
  }, [dataKey]);

  /************************************************/
  /*        Step 3.1 Code goes here               */
  /************************************************/

  // choose a data domain for saving files in MySky
  const dataDomain = 'localhost';

  /*****/

  // On initial run, start initialization of MySky
  useEffect(() => {
    /************************************************/
    /*        Step 3.2 Code goes here               */
    /************************************************/
    async function initMySky() {
      try {
        // load invisible iframe and define app's data domain
        // needed for permissions write
        const mySky = await client.loadMySky(dataDomain);
        console.log("my sky loaded");
        console.log(mySky)
        console.log(todos)
    
        // load necessary DACs and permissions
        await mySky.loadDacs(contentRecord);
    
        // check if user is already logged in with permissions
        const loggedIn = await mySky.checkLogin();
    
        // set react state for login status and
        // to access mySky in rest of app
        setMySky(mySky);
        setLoggedIn(loggedIn);
        if (loggedIn) {
          setUserID(await mySky.userID());
          console.log(userID)
        }
      } catch (e) {
        console.error(e);
      }
    }
    
    // call async setup function
    initMySky();

    /*****/
  }, []);

  // Handle form submission. This is where the bulk of the workshop logic is
  // handled
  
  

  const handleMySkyLogin = async () => {
    /************************************************/
    /*        Step 3.3 Code goes here               */
    /************************************************/
    // Try login again, opening pop-up. Returns true if successful
    const status = await mySky.requestLoginAccess();

    // set react state
    setLoggedIn(status);

    if (status) {
      setUserID(await mySky.userID());
      console.log(userID);
    }

    /*****/
  };

  const handleMySkyLogout = async () => {
    /************************************************/
    /*        Step 3.4 Code goes here              */
    /************************************************/
    await mySky.logout();

    //set react state
    setLoggedIn(false);
    setUserID('');
    setTodos([]);

    /*****/
  };

  const handleMySkyWrite = async (jsonData) => {
    /************************************************/
    /*        Step 3.7 Code goes here              */
    /************************************************/
    try {
      try{
        await mySky.setJSON(filePath, jsonData);
      }  catch (error) {
        console.log(`error with setJSON: ${error.message}`);
      }
      
      console.log('userID', userID);
      console.log('filePath', filePath);
      console.log(jsonData);
      
      console.log('skywrote')
    } catch (error) {
      console.log(`error with setJSON: ${error.message}`);
    }


    /*****/
    /************************************************/
    /*        Step 4.7 Code goes here              */
    /************************************************/
    try {
      await contentRecord.recordNewContent({
        skylink: jsonData.dirSkylink,
      });
    } catch (error) {
      console.log(`error with CR DAC: ${error.message}`);
    }


    /*****/
  };

  // loadData will load the users data from SkyDB
  const loadData = async (event) => {
    //event.preventDefault();
    console.log(filePath)
    console.log('Loading user data from SkyDB');

    /************************************************/
    /*        Step 4.5 Code goes here              */
    /************************************************/
    try{
      const { data } = await mySky.getJSON(filePath);
      
    console.log(data)
    // To use this elsewhere in our React app, save the data to the state.
    if (data) {
      setName(data.name);
      setTodos(data.todos)
      console.log(data.todos)
      console.log('User data loaded from SkyDB!');
    } else {
      console.error('There was a problem with getJSON');
    }
    } catch(error){
      console.log(`error couldnt load: ${error.message}`)
    }
    


    /*****/

  };

 
  const formProps = {
    mySky,
    handleMySkyLogin,
    handleMySkyLogout,
    handleMySkyWrite,
    loadData,
    name,
    dataKey,
    loggedIn,
    dataDomain,
    userID,
    setLoggedIn,
    setDataKey,
    setName,
    todos,
    setTodos
  };



  return (
    <div className='todo-app'>
      <TodoList {...formProps}/>
    </div>
    

  )
}

export default App;
