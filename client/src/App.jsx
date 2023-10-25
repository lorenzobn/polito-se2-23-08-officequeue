import { useState } from 'react'
import { Button, Dropdown, DropdownButton } from 'react-bootstrap';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import API from './API.jsx';
import './App.css';
import './assets/custom.css';

function App() {
  const [content, setContent] = useState('');
  const [ticketBooking, setTicketBooking] = useState({});
  

  function Main() {
    const navigate = useNavigate();

    const handleClick = () => {
      // call the server-side API getTicket to get a ticket and parse the response with the tickets infos
      API.getTicket({"serviceTypeTagName" : content.toLowerCase()}).then(ticketBooking => {
        //console.log(ticketBooking);
        setTicketBooking(ticketBooking.data);
        navigate('/ticket');
      })
      .catch(e => {
        // Properly print in the View the Error, temporarly just console.log
        console.log(e);
      });
    }


    return(
      <>
      <div>
        <h1>OFFICE QUEUE MANAGEMENT SYSTEM</h1>
      </div>
      <div className='my-5'>
        <MyDropdown></MyDropdown>
      </div>
      <div>
      <Button type='submit' variant="success" onClick={handleClick}>GET TICKET</Button> 
      </div>
      </>
    )
  }

  function ShowTicket() {
    return(
      <>
      <div>
        <h1>OFFICE QUEUE MANAGEMENT SYSTEM</h1>
      </div>
      <div className='ticket'>
        {ticketBooking ? <Ticket></Ticket> : <ErrorMessage></ErrorMessage>}
      </div>
      </>
    )
  }

  function Ticket(){
    return (
      <>
      <h3>Great!</h3>
      <h5>Your ticket number for the service {ticketBooking.ServiceTypeId} is: {ticketBooking.id} </h5>
      </>
    )
  }

  function ErrorMessage(){
    return (
      <>
      <h4>Error 404</h4>
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
                <Dropdown.Item eventKey="Mail">Mail</Dropdown.Item>
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
        <Route path={'/ticket'} element={<ShowTicket></ShowTicket>}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
