// routes/bidCredits.js


const express = require('express');
const { getUserModel } = require('../user-service'); // Import the getUserModel function from user-service.js
const router = express.Router();
const passport = require('passport');

// Middleware for checking user authentication
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: 'Unauthorized' });
};

// Route to get the user's bid credit balance
router.get('/balance', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const User = getUserModel(); // Get the User model using getUserModel function
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ bidCredits: user.bidCredits });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

router.post('/recharge', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    console.log(req.body)
    const { amount } = req.body;
    const User = getUserModel(); // Get the User model using getUserModel function
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const newBalance = user.bidCredits + amount;
    console.log(newBalance)
    user.bidCredits = newBalance;
    await user.save();
    res.json({ message: 'Bid credits recharged successfully', newBalance });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});


module.exports = router;
