const express = require('express');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const swaggerSpec = require('./docs/swagger');
const app = express();

app.use(express.json());

mongoose.connect("mongodb+srv://Krishnapriya:krishna123@cluster0.dbdfr76.mongodb.net/project?retryWrites=true&w=majority&appName=Cluster0")
.then(()=>
{
    console.log("Connected to database");
})
.catch((err)=>
{
    console.log(err);
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Start server
app.listen(5000,()=>
{
    console.log("Connected to port 5000");
});
