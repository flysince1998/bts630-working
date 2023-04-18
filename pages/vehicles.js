import React, { useState } from "react";
import { Card, Table, Button } from "react-bootstrap";
import { getToken } from "../lib/authenticate";
import useSWR from 'swr';

const fetcher = (url) => fetch(url, { headers: { Authorization: `JWT ${getToken()}` }}).then((res) => res.json());

export default function Vehicles() {
  const [query, setQuery] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [buyClicked, setBuyClicked] = useState(false); // state to track buy button click
  const [bidClicked, setBidClicked] = useState(false);
  const { data, error } = useSWR(`https://webapi630.herokuapp.com/api/vehicles`, fetcher);

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

  const handleBuyClick = (vehicleId) => {
    // Handle buy button click
    console.log(`Buy clicked for vehicle with id: ${vehicleId}`);
    setBuyClicked(true);
  };

  const handleBidClick = (vehicleId) => {
    // Handle bid button click
    console.log(`Bid clicked for vehicle with id: ${vehicleId}`);
    setBidClicked(true);
  };

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
            {filteredData?.map(vehicle => (
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
                onClick={handleBuyClick}
                onMouseEnter={() => setBuyClicked(false)}
                className={buyClicked ? "btn btn-success" : "btn-outline-success"}
              >
                Buy
              </Button>
              <Button
                variant="outline-dark"
                onClick={handleBidClick}
                onMouseEnter={() => setBidClicked(false)}
                className={bidClicked ? "btn btn-dark" : "btn-outline-dark"}
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
    </>
  );
}
