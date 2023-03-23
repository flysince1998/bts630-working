// pages/recharge.js

  import React, { useState } from 'react';
  import { rechargeBidCredits } from '../services/bidCredits';



  function Recharge() {
    const [amount, setAmount] = useState('');

    const handleSubmit = async (e) => {
      e.preventDefault();
      // Call the API to recharge bid credits with the specified amount
      const updatedBalance = await rechargeBidCredits(amount);

      if (updatedBalance !== null) {
        alert('Bid credits successfully recharged');
      }else {
        alert('Failed to recharge bid credits.Please try again later.');
      }
    };

    return (
      <div>
        <h1>Recharge Bid Credits</h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor="amount">Amount:</label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="1"
            required
          />
          <button type="submit">Recharge</button>
        </form>
      </div>
    );
  }

  export default Recharge;
