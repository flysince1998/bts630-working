import React, { useState,useEffect } from "react";
import { Card, Table, Button, Modal, Form } from "react-bootstrap";
import { getToken } from "../lib/authenticate";
import useSWR from 'swr';

const fetcher = (url) => fetch(url, { headers: { Authorization: `JWT ${getToken()}` }}).then((res) => res.json());

export default function Vehicles() {
  const [query, setQuery] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [buyClicked, setBuyClicked] = useState([]);
  const [bidClicked, setBidClicked] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [bidAmount, setBidAmount] = useState("");
  const [selectedRowIndex, setSelectedRowIndex] = useState(null); 
  const { data, error } = useSWR(`https://webapi630.herokuapp.com/api/vehicles`, fetcher);

  useEffect(() => {
    if (data) {
      setBuyClicked(new Array(data.length).fill(false));
      setBidClicked(new Array(data.length).fill(false));
    }
  }, [data]);

  const filteredData = data?.filter(vehicle => {
    if (query && !(vehicle.make.toLowerCase().includes(query.toLowerCase()) || vehicle.model.toLowerCase().includes(query.toLowerCase()))) {
      return false;
    }
    if (typeof minPrice !== 'undefined' && parseFloat(vehicle.price.replace('$','')) < parseFloat(minPrice)) {
      return false;
    }
    if (typeof maxPrice !== 'undefined' && parseFloat(vehicle.price.replace('$','')) > parseFloat(maxPrice)) {
      return false;
    }
    
    return true;
  });

  const handleQueryChange = (event) => {
    setQuery(event.target.value);
  };

  const handleMinPriceChange = (event) => {
    const minPrice = event.target.value;
    if (!isNaN(minPrice)) {
      setMinPrice(minPrice);
    }
  };

  const handleMaxPriceChange = (event) => {
    const maxPrice = event.target.value;
    if (!isNaN(maxPrice)) {
      setMaxPrice(maxPrice);
    }
  };

  const handleBuyClick = (index) => {
    setBuyClicked(prevState => {
      const newState = [...prevState];
      newState[index] = !newState[index]; // Toggle the boolean value
      return newState;
    });
  };

  const handleBidClick = (index, event) => {
    event.stopPropagation();
    setShowModal(true);
    setSelectedVehicle(filteredData[index]); // Update with filteredData instead of data
    setSelectedRowIndex(index);
  
    setBidClicked(prevState => {
      const newState = [...prevState];
      newState[index] = !newState[index]; // Toggle the boolean value
      return newState;
    });
  };
  
  

    const handleModalClose = () => {
      setShowModal(false);
      setSelectedVehicle(null);
      setBidAmount("");
      setSelectedRowIndex(null); // Reset the selected row index
    
      setBuyClicked(new Array(filteredData?.length).fill(false)); // Reset buyClicked state array
      setBidClicked(new Array(filteredData?.length).fill(false)); // Reset bidClicked state array
    };    



    const handleBidSubmit = () => {
      // Get the selected vehicle and bid amount
      const vehicle = filteredData[selectedRowIndex];
      const amount = parseFloat(bidAmount);
      
      // Check if bid amount is valid
      if (isNaN(amount) || amount <= parseFloat(vehicle.price.replace('$',''))) {
        alert("Invalid bid amount");
        return;
      }
    handleModalClose();
  };



  return (
    <>
      <Card bg="light">
        <Card.Body style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridGap: '10px' }}>
          <div>
            <input type="text" value={query} onChange={handleQueryChange} placeholder="Search Vehicles by make or model" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridGap: '10px' }}>
            <div>
              <input type="number" value={minPrice} onChange={handleMinPriceChange} placeholder="Minimum Price" />
            </div>
            <div>
              <input type="number" value={maxPrice} onChange={handleMaxPriceChange} placeholder="Maximum Price" />
            </div>
          </div>
        </Card.Body>
      </Card>

      <br />

      {filteredData?.length > 0 ? (
        <Table striped bordered>
          <thead>
            <tr>
              <th>Year</th>
              <th>Make</th>
              <th>Model</th>
              <th>Vin</th>
              <th>Price</th>
              <th>Image</th>
              <th>Actions</th> {/* Add a new table column for Actions */}
            </tr>
          </thead>
          <tbody>
            {filteredData?.map((vehicle,index) => (
              <tr key={vehicle.id}>
                <td>{vehicle.year}</td>
                <td>{vehicle.make}</td>
                <td>{vehicle.model}</td>
                <td>{vehicle.vin}</td>
                <td>{vehicle.price}</td>
                <td><img src={vehicle.image} alt={vehicle.model} /></td>
                <td>
                 {/* Add Buy and Bid buttons */}
                 <Button
                variant="outline-success"
                onClick={() => handleBuyClick(index)}
                onMouseEnter={() => setBuyClicked(prevState => {
                  const newState = [...prevState];
                  newState[index] = false;
                  return newState;
                })}
                className={buyClicked[index] ? "btn btn-success" : "btn-outline-success"}
              >
                Buy
              </Button>
              <Button
                variant="outline-dark"
                onClick={() => handleBidClick(index)}
                onMouseEnter={() => setBidClicked(prevState => {
                  const newState = [...prevState];
                  newState[index] = false;
                  return newState;
                })}
                className={bidClicked[index] ? "btn btn-dark" : "btn-outline-dark"}
              >
                Bid
              </Button>
             </td>
              </tr>
            ))}
          </tbody>
        </Table>

       
        
      ) : (
        <div>No results found</div>
      )}
           <Modal show={showModal} onHide={handleModalClose}>
         <Modal.Header closeButton>
           <Modal.Title>Place Bid</Modal.Title>
         </Modal.Header>
         <Modal.Body>
           <Form>
             <Form.Group controlId="bidAmount">
               <Form.Label>Bid Amount</Form.Label>
               <Form.Control
                 type="number"
                 value={bidAmount}
                 onChange={(e) => setBidAmount(e.target.value)}
               />
             </Form.Group>
           </Form>
         </Modal.Body>
         <Modal.Footer>
           <Button variant="secondary" onClick={handleModalClose}>
             Close
           </Button>
           <Button variant="primary" onClick={handleBidSubmit}>
             Submit Bid
           </Button>
         </Modal.Footer>
       </Modal>
    </>
  );
}
