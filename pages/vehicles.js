import React, { useState } from "react";
import { Card, Table, Button } from "react-bootstrap";
import { getToken } from "../lib/authenticate";
import useSWR from 'swr';

const fetcher = (url) => fetch(url, { headers: { Authorization: `JWT ${getToken()}` }}).then((res) => res.json());

export default function Vehicles() {
  const [query, setQuery] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
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
  };

  const handleBidClick = (vehicleId) => {
    // Handle bid button click
    console.log(`Bid clicked for vehicle with id: ${vehicleId}`);
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
        {/* ... existing card content ... */}
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
                  {/* Add Buy and Bid buttons with event handlers */}
                  <Button variant="success" onClick={() => handleBuyClick(vehicle.id)}>Buy</Button>
                  <Button variant="dark" onClick={() => handleBidClick(vehicle.id)}>Bid</Button>
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
