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

  function NextCustomer() {
    const [rowData, setRowData] = useState([]);
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await API.getCounters();
          const counterNumbers = response.data.map(item => item.id);
          const rows = counterNumbers.map(number => ({ id: number, text: `Counter ${number}` }));
          setRowData(rows);
        } catch (error) {
          console.error('Error fetching data from the API 2', error);
        }
      };
  
      fetchData();
    }, []);
  
    const handleButtonClick = async (id) => {
      try {
        console.log("counter id:", id);
        const answer = await API.nextCustomer(id);
        console.log("answer", answer);
    
        // Check the response for the error message
        if (answer.msg === "An unknown error occurred.") {
          window.alert("The next ticket for your services is not served yet.");
        } else {
          window.alert("The next ticket is being called!");
        }
      } catch (error) {
        console.error('Error calling the API', error);
        // Handle any other error that occurs during the API call
        window.alert("An error occurred. Please try again later.");
      }
    };
  
    return (
      <>
        <div>
          <h1>OFFICE QUEUE MANAGEMENT SYSTEM</h1>
        </div>
        <div className="centered-container">
          <div className="horizontal-table">
            {rowData.map((row) => (
              <div key={row.id} className="table-row">
                <div className="table-cell">{row.text}</div>
                <div className="table-cell">
                  <button className='circle-button' onClick={() => handleButtonClick(row.id)}>Next</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </>
    );
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
        <Route path={'/nextcustomer'} element={<NextCustomer></NextCustomer>}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
