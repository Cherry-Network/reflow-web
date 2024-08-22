const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const projectRoutes = require('./routes/projectRoutes');
const deviceRoutes = require('./routes/deviceRoutes');

const app = express();
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost/reflow-db', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Use routes
app.use(projectRoutes);
app.use(deviceRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
