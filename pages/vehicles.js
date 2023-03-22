import { Card, Table } from "react-bootstrap";
import { getToken } from "../lib/authenticate";
import useSWR from 'swr';
import { useState } from "react";

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

  const filteredData = data?.filter(vehicle => {
    if (query && !(vehicle.make.toLowerCase().includes(query.toLowerCase()) || vehicle.model.toLowerCase().includes(query.toLowerCase()))) {
      return false;
    }
    if (typeof minPrice !== 'undefined' && parseInt(vehicle.price) < parseInt(minPrice)) {
      return false;
    }
    if (typeof maxPrice !== 'undefined' && parseInt(vehicle.price) > parseInt(maxPrice)) {
      return false;
    }
    
    return true;
  });
  

  return (
    <>
      <Card bg="light">
  <Card.Body style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridGap: '10px' }}>
    <div>
      <input type="text" value={query} onChange={handleQueryChange} placeholder="Search Vehicles by year, make, model, or vin" />
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
      <Table striped bordered>
        <thead>
          <tr>
            <th>Year</th>
            <th>Make</th>
            <th>Model</th>
            <th>Vin</th>
            <th>Price</th>
            <th>Image</th>
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
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}
