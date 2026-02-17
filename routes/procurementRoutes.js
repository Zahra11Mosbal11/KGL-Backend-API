const express = require('express');
const router = express.Router();
const Purchase = require('../models/Purchase');
const { requireManager } = require('../middleware/auth');

/**
 * @swagger
 * /procurement:
 *   post:
 *     summary: register a new purchase
 *     tags: [Procurement]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - produceName
 *               - produceType
 *               - date
 *               - time
 *               - tonnage
 *               - cost
 *               - dealerName
 *               - branch
 *               - contact
 *               - sellingPrice
 *             properties:
 *               produceName:
 *                 type: string
 *                 example: "Beans"
 *               produceType:
 *                 type: string
 *                 example: "Legume"
 *               tonnage:
 *                 type: number
 *                 example: 1000
 *     responses:
 *       201:
 *         description: registered successfully
 *       400:
 *         description: bad request
 *       401:
 *         description: unauthorized
 */
router.post('/', requireManager, async (req, res) => {
  try {
    // check required fields
    const { produceName, produceType, tonnage, cost, dealerName, contact } = req.body;
    
    // check the characters type
    if (!/^[A-Za-z\s]+$/.test(produceType)) {
      return res.status(400).json({ error: 'most be only characters' });
    }
    
    // check the numbers type
    if (tonnage < 100) {
      return res.status(400).json({ error: 'the tonnage most be 100 at least' });
    }
    
    if (cost < 10000) {
      return res.status(400).json({ error: ' the cost most be 10,000 UGX at least' });
    }
    
    // check the contact number
    if (!/^[0-9]{10}$/.test(contact)) {
      return res.status(400).json({ error: 'the contact number most be 10 digits' });
    }
    
    // create and save the purchase
    const purchase = new Purchase({
      ...req.body,
      recordedBy: req.session.user.id
    });
    
    await purchase.save();
    
    res.status(201).json({
      success: true,
      message: 'Purchase registered successfully',
      purchase
    });
    
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /procurement:
 *   get:
 *     summary: get all purchases
 *     tags: [Procurement]
 *     responses:
 *       200:
 *         description: a list of purchases
 *       401:
 *         description: unauthorized
 */
router.get('/', requireManager, async (req, res) => {
  try {
    const purchases = await Purchase.find()
      .populate('recordedBy', 'fullName')
      .sort({ date: -1 });
    
    res.json({ purchases });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;