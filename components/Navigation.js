import { Container, Navbar, Nav } from "react-bootstrap";
import Link from 'next/link';
import { useRouter } from "next/router";
import { readToken, removeToken } from "../lib/authenticate";
import React, {useState, useEffect} from 'react';
import bidCreditService from '../services/bidCredits';

export default function Navigation(props) {

  const [bidCredits, setBidCredits] = useState(0);
  const router = useRouter();
  let token = readToken();


  useEffect(() => {
    async function fetchBalance(){
      const balance = await bidCreditService.fetchBidCreditBalance();
      if(balance !== null){
        setBidCredits(balance);
      }
    }
    fetchBalance();
  }, []);
  

  function logout() {
    removeToken();
    router.push("/");
  }

  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Link href="/" passHref legacyBehavior><Navbar.Brand > Bidding Site {token && <>- Welcome {token.userName}</>}</Navbar.Brand></Link>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Link href="/" passHref legacyBehavior ><Nav.Link>Home</Nav.Link></Link>
            {token && <Link href="/vehicles" passHref legacyBehavior><Nav.Link>Products</Nav.Link></Link>}
          </Nav>
          <Nav className="mx-auto">
          {token && (
            <>
            <p className="nav-link" style={{ margin: 0 }}>
              Your bid credit balance: {bidCredits}
            </p>
            <Link href="../pages/recharge" passHref>
              <Nav.Link>Recharge</Nav.Link>
              </Link> 
          </>
          )}
        </Nav>
          <Nav className="ml-auto">
            {!token && <Link href="/login" passHref legacyBehavior><Nav.Link>Login</Nav.Link></Link>}
            {token && <Nav.Link onClick={logout}>Logout</Nav.Link>}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}