import { Card, Table } from "react-bootstrap";
import { getToken } from "../lib/authenticate";
import useSWR from 'swr';
import { useState } from "react";

const fetcher = (url) => fetch(url, { headers: { Authorization: `JWT ${getToken()}` }}).then((res) => res.json());

export default function Vehicles() {
  const [query, setQuery] = useState('');
  const [minPrice, setMinPrice] = useState('0');
  const [maxPrice, setMaxPrice] = useState('1000000');
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
    const searchFields = ['year', 'make', 'model', 'vin'];
    for (let field of searchFields) {
      if (vehicle[field] && typeof vehicle[field] === 'string' && vehicle[field].toLowerCase().includes(query.toLowerCase())) {
        return true;
      }
    }
    if (minPrice && parseInt(vehicle.price) < parseInt(minPrice)) {
      return false;
    }
    if (maxPrice && parseInt(vehicle.price) > parseInt(maxPrice)) {
      return false;
    }
    return true;
  });
  

  return (
    <>
      <Card bg="light">
        <Card.Body>
          <h2>Vehicles</h2>
          <p>Here are some vehicles available for bidding</p>
          <input type="text" value={query} onChange={handleQueryChange} placeholder="Search Vehicles by year, make , model or vin" />
          <input type="number" value={minPrice} onChange={handleMinPriceChange} placeholder="Minimum Price" />
          <input type="number" value={maxPrice} onChange={handleMaxPriceChange} placeholder="Maximum Price" />
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
