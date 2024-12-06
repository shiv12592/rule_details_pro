const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
const Schema = mongoose.Schema;

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/ruleApp')
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => console.error('Error connecting to MongoDB:', error));

// Mongoose Schema with conditionData
const ruleDetailsSchema = new mongoose.Schema({
    ruleName: { type: String, required: true },
    ruleNo: { type: String, required: true },
    category: { type: String, required: true },
    carId: { type: String, required: true },
    owner: { type: String, required: true },
    conditionData: { type: Schema.Types.Mixed }, // Flexible JSON data
});

const RuleDetails = mongoose.model('RuleDetails', ruleDetailsSchema);

// GET request to fetch all rule details
app.get('/ruleDetails', async (req, res) => {
    try {
        const ruleDetails = await RuleDetails.find();
        res.json(ruleDetails);
    } catch (error) {
        console.error('Error fetching rule details:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// POST request to create a new rule
app.post('/ruleDetails', async (req, res) => {
    try {
        const newRule = new RuleDetails(req.body);
        const savedRule = await newRule.save();
        res.json(savedRule);
    } catch (error) {
        console.error('Error saving rule:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// PUT request to update a rule
app.put('/ruleDetails/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const updatedRule = await RuleDetails.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedRule) {
            return res.status(404).json({ message: 'Rule not found' });
        }
        res.json(updatedRule);
    } catch (error) {
        console.error('Error updating rule:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Start the server
app.listen(5000, () => {
    console.log('Server is running on port 5000');
});
