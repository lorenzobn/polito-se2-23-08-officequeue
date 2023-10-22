import { useState } from 'react'
import { Button, Dropdown, DropdownButton } from 'react-bootstrap';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';

function App() {
  const [content, setContent] = useState('');

  function Main() {
    return(
      <>
      <div>
        <h1>OFFICE QUEUE MANAGEMENT SYSTEM</h1>
      </div>
      <div className='my-5'>
        <MyDropdown></MyDropdown>
      </div>
      <div>
      <Button type='submit' variant="success">GET TICKET</Button> 
      </div>
      </>
    )
  }

  function MyDropdown() {
    const handleSelect = (eventkey) => {
        setContent(eventkey)
    };

    return (
        <Dropdown onSelect={handleSelect}>
            <DropdownButton title={content? content : "Select Service"} variant="primary"> 
                <Dropdown.Item eventKey="Service A">Service A</Dropdown.Item>
                <Dropdown.Item eventKey="Service B">Service B</Dropdown.Item>
                <Dropdown.Item eventKey="Service C">Service C</Dropdown.Item>
                <Dropdown.Item eventKey="Service D">Service D</Dropdown.Item>
                <Dropdown.Item eventKey="Service E">Service E</Dropdown.Item>
                <Dropdown.Item eventKey="Service F">Service F</Dropdown.Item>
            </DropdownButton>
        </Dropdown>
    );
}

  return (
    <BrowserRouter>
      <Routes>
        <Route path={'/'} element={<Main></Main>}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
