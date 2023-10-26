import { useState, useEffect } from 'react'
import { Button, Dropdown, DropdownButton, Table } from 'react-bootstrap';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
import API from './API';

function App() {
  const [content, setContent] = useState('');
  const [services, setServices] = useState([]);
  const [ticketBooking, setTicketBooking] = useState({});

  useEffect(() => {
    API.getServices().then((services) => setServices(services));
  }, []);
  
  function Main() {
    const navigate = useNavigate();

    const handleClick = () => {
      // call the server-side API getTicket to get a ticket and parse the response with the tickets infos
      // let ticketBooking = getTicket(content)
      let ticketBooking = { number: 10, serviceType: content};
      setTicketBooking(ticketBooking);
      navigate('/ticket');
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
      <div className='my-5'>
        {ticketBooking ? <Ticket></Ticket> : <ErrorMessage></ErrorMessage>}
      </div>
      </>
    )
  }

  function Ticket(){
    const navigate = useNavigate();
    return (
      <>
      <h3>Great!</h3>
      <h5>Your ticket number for the service {ticketBooking.serviceType} is: {ticketBooking.number} </h5>
      <div className='my-5'>
        <Button variant='primary' onClick={() => navigate('/status')}>SHOW QUEUE STATUS</Button> 
      </div>
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
                {services.map((e) => <Dropdown.Item eventKey={e.tagName}>e.tagName</Dropdown.Item>)}
            </DropdownButton>
        </Dropdown>
    );
  }

  function Status() {
    const navigate = useNavigate();

    return (
      <>
        <Table className='table-striped' style={{ tableLayout: 'fixed', }}>
          <thead>
            <tr>
              <th>DESK</th>
              <th>SERVICE</th>
              <th>CURRENT CUSTOMER</th>
              <th>NEXT CUSTOMER</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>d1</td>
              <td>A</td>
              <td>9</td>
              <td>10</td>
            </tr>
            <tr>
              <td>d2</td>
              <td>B</td>
              <td>12</td>
              <td>13</td>
            </tr>
            <tr>
              <td>d3</td>
              <td>C</td>
              <td>14</td>
              <td>15</td>
            </tr>
          </tbody>
        </Table> 
        <div>
        <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" className="btn btn-lg btn-primary fixed-right-bottom" viewBox="0 0 16 16" onClick={() => navigate('/')}>
          <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
        </svg>
        </div>
        <Button onClick={() => navigate('/')}>CALL NEXT CUSTOMER</Button>
      </>
    )
  } 
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path={'/'} element={<Main></Main>}></Route>
        <Route path={'/ticket'} element={<ShowTicket></ShowTicket>}></Route>
        <Route path={'/status'} element={<Status></Status>}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
