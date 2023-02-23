import { Card, Table } from "react-bootstrap";
import { getToken } from "../lib/authenticate";

import useSWR from 'swr';
const fetcher = (url) => fetch(url, { headers: { Authorization: `JWT ${getToken()}` }}).then((res) => res.json());

export default function Vehicles() {

    const { data, error } = useSWR(`https://webapi630.herokuapp.com/api/vehicles`, fetcher);
    

    return (
      <>
        <Card bg="light">
          <Card.Body>
            <h2>Vehicles</h2>
            <p>Here are some vehicles available for bidding</p> 
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
            {data?.map(vehicle => (
              <tr key={vehicle.id} >
                <td>{vehicle.year}</td>
                <td>{vehicle.make}</td>
                <td>{vehicle.model}</td>
                <td>{vehicle.vin}</td>
                <td>{vehicle.price}</td>
                <td><img src={vehicle.image} alt = {vehicle.model}></img></td>
              </tr>
            ))}

          </tbody>
        </Table>
      </>
    )
}
