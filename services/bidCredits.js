// services/bidCredits.js
import { getToken } from '../lib/authenticate';


async function fetchBidCreditBalance() {
    try {
      const token = getToken();
      const response = await fetch('http://localhost:8080/api/bidCredits/balance', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Include any necessary authentication headers, like a JWT token or session cookie
          'Authorization': `Bearer ${token}`
        },
      });
  
      if (response.ok) {
        const data = await response.json();
        return data.bidCredits;
      } else {
        throw new Error('Failed to fetch bid credit balance');
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  }

const rechargeBidCredits = async (amount) => {
    try {
      const token = getToken();
  
      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ amount }),
      };
  
      const response = await fetch('http://localhost:8080/api/bidCredits/recharge', requestOptions);
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || 'Failed to recharge bid credits.');
      }
  
      return data.updatedBalance;
    } catch (error) {
      console.error('Error recharging bid credits:', error.message);
      return null;
    }
  };
  
  export default {
    fetchBidCreditBalance,
    rechargeBidCredits
  };
  