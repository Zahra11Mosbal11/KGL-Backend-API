const express = require('express');
const router = express.Router();
const CashSale = require('../models/Sale');
const CreditSale = require('../models/CreditSale');
const { requireAuth, requireSalesAgent } = require('../middleware/auth');

/**
 * @swagger
 * /sales/cash:
 *   post:
 *     summary: register a new cash sale
 *     tags: [Sales]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - produceName
 *               - tonnage
 *               - amountPaid
 *               - buyerName
 *               - salesAgentName
 *             properties:
 *               produceName:
 *                 type: string
 *               tonnage:
 *                 type: number
 *               amountPaid:
 *                 type: number
 */
router.post('/cash', requireAuth, async (req, res) => {
  try {
    // check required fields
    const { produceName, buyerName, salesAgentName, tonnage, amountPaid } = req.body;
    
    if (!produceName || produceName.length < 2) {
      return res.status(400).json({ error: 'name of produce is required and should be at least 2 characters' });
    }
    
    if (!buyerName || buyerName.length < 2) {
      return res.status(400).json({ error: 'name of buyer is required and should be at least 2 characters' });
    }
    
    if (!salesAgentName || salesAgentName.length < 2) {
      return res.status(400).json({ error: 'name of sales agent is required and should be at least 2 characters' });
    }
    
    if (amountPaid < 10000) {
      return res.status(400).json({ error: 'amount paid should be at least 10,000 shillings' });
    }
    
    // get current time and date
    const now = new Date();
    const timeString = now.toTimeString().split(' ')[0];
    
    const sale = new CashSale({
      ...req.body,
      date: now,
      time: timeString,
      branch: req.session.user.branch,
      recordedBy: req.session.user.id
    });
    
    await sale.save();
    
    res.status(201).json({
      success: true,
      message: 'cash sale registered successfully',
      sale
    });
    
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /sales/credit:
 *   post:
 *     summary: register a new credit sale
 *     tags: [Sales]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - buyerName
 *               - nationalId
 *               - location
 *               - contact
 *               - amountDue
 *               - salesAgentName
 *               - dueDate
 *               - produceName
 *               - produceType
 *               - tonnage
 *             properties:
 *               nationalId:
 *                 type: string
 *                 example: "CM12345678ABCD9E"
 */
router.post('/credit', requireAuth, async (req, res) => {
  try {
    // check required fields
    const { nationalId, contact, amountDue, tonnage } = req.body;
    
    // validate NIN format
    const ninRegex = /^[A-Z]{2}\d{7}[A-Z]{4}\d[A-Z]$/;
    if (!ninRegex.test(nationalId)) {
      return res.status(400).json({ error: 'national ID number is not valid' });
    }
    
    if (!/^[0-9]{10}$/.test(contact)) {
      return res.status(400).json({ error: 'contact number must be 10 digits' });
    }
    
    if (amountDue < 10000) {
      return res.status(400).json({ error: 'amount due should be at least 10,000 shillings' });
    }
    
    const creditSale = new CreditSale({
      ...req.body,
      branch: req.session.user.branch,
      recordedBy: req.session.user.id
    });
    
    await creditSale.save();
    
    res.status(201).json({
      success: true,
      message: 'credit sale registered successfully',
      creditSale
    });
    
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;