const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');

const app = express();
const port = 3000; // Set your desired port

// Define MongoDB Atlas connection URI
const mongoUri = 'mongodb+srv://Abdullah:abdullah123@mernapp.i1s0mmx.mongodb.net/';

let client; // Declare the client variable at a broader scope

// Middleware to parse JSON data
app.use(bodyParser.json());


  
// Route to handle retrieving the latest sensor data
app.get('/getsensordata', async (req, res) => {
  try {
    // Connect to MongoDB Atlas
    client = new MongoClient(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();

    // Access the database and collection for sensor data
    const database = client.db('Hydroponics');
    const collection = database.collection('SensorData');

    // Retrieve the latest sensor data document
    const latestSensorData = await collection.find({})
      .sort({ Timestamp: -1 }) // Sort by Timestamp in descending order
      .limit(1) // Limit the result to 1 document
      .toArray();

    if (latestSensorData.length > 0) {
      console.log('Latest sensor data retrieved from MongoDB:', latestSensorData[0]);
      res.status(200).json({ status: 'OK', data: latestSensorData[0] });
    } else {
      console.log('No sensor data found in the database.');
      res.status(404).json({ status: 'Not Found', message: 'No sensor data found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'Internal Server Error', error: error.message });
  } finally {
    // Close the MongoDB connection
    if (client) {
      await client.close();
    }
  }
});


// Route to handle incoming sensor data
app.post('/sensordata', async (req, res) => {
    const sensorData = req.body;
  
    try {
      // Connect to MongoDB Atlas
      client = new MongoClient(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
      await client.connect();
  
      // Access the database and collection
      const database = client.db('Hydroponics');
      const collection = database.collection('SensorData');
  
      // Add Timestamp field to the sensor data
      const sensorDataWithTimestamp = {
        ...sensorData,
        Timestamp: new Date()
      };
  
      // Insert a single sensor data document into the collection
      const result = await collection.insertOne(sensorDataWithTimestamp);
  
      console.log(`Sensor data saved to MongoDB. Document inserted: ${result.insertedId}`);
      res.status(200).json({ status: 'OK', insertedId: result.insertedId });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: 'Internal Server Error', error: error.message });
    } finally {
      // Close the MongoDB connection
      if (client) {
        await client.close();
      }
    }
});

//update Humidity set point
app.post('/updatehumiditysetpoint', async (req, res) => {
    const { HumiditySetpoint } = req.body;
  
    try {
      // Connect to MongoDB Atlas
      client = new MongoClient(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
      await client.connect();
  
      // Access the database and collection for sensor settings
      const database = client.db('Hydroponics');
      const collection = database.collection('Humidity');
  
      // Insert document with updated Humidity Setpoint
      const result = await collection.insertOne({
        HumiditySetpoint,
        Timestamp: new Date()
      });
  
      console.log(`Humidity Setpoint updated in MongoDB. Document inserted: ${result.insertedId}`);
      res.status(200).json({ status: 'OK', insertedId: result.insertedId });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: 'Internal Server Error', error: error.message });
    } finally {
      // Close the MongoDB connection
      if (client) {
        await client.close();
      }
    }
  });
  
//update Temperature set point
app.post('/updatetemperaturesetpoint', async (req, res) => {
    const { TemperatureSetpoint } = req.body;
  
    try {
      // Connect to MongoDB Atlas
      client = new MongoClient(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
      await client.connect();
  
      // Access the database and collection for sensor settings
      const database = client.db('Hydroponics');
      const collection = database.collection('Temperature');
  
      // Insert document with updated Temperature Setpoint
      const result = await collection.insertOne({
        TemperatureSetpoint,
        Timestamp: new Date()
      });
  
      console.log(`Temperature Setpoint updated in MongoDB. Document inserted: ${result.insertedId}`);
      res.status(200).json({ status: 'OK', insertedId: result.insertedId });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: 'Internal Server Error', error: error.message });
    } finally {
      // Close the MongoDB connection
      if (client) {
        await client.close();
      }
    }
  });
 
 //update Fan set point 
 app.post('/updatefantimer', async (req, res) => {
    const { FanTimer } = req.body;
  
    try {
      // Connect to MongoDB Atlas
      client = new MongoClient(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
      await client.connect();
  
      // Access the database and collection for sensor settings
      const database = client.db('Hydroponics');
      const collection = database.collection('Fan');
  
      // Insert document with updated Fan Timer
      const result = await collection.insertOne({
        FanTimer,
        Timestamp: new Date()
      });
  
      console.log(`Fan Timer updated in MongoDB. Document inserted: ${result.insertedId}`);
      res.status(200).json({ status: 'OK', insertedId: result.insertedId });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: 'Internal Server Error', error: error.message });
    } finally {
      // Close the MongoDB connection
      if (client) {
        await client.close();
      }
    }
  });
// Route to get the latest Fan Timer value
app.get('/getfantimer', async (req, res) => {
    let client; // Declare the client variable within the route scope
    try {
      // Connect to MongoDB Atlas
      client = new MongoClient(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
      await client.connect();
  
      // Access the database and collection for sensor settings
      const database = client.db('Hydroponics');
      const collection = database.collection('Fan');
  
      // Retrieve the latest Fan Timer setting document
      const fanTimerSetting = await collection.findOne({}, { sort: { Timestamp: -1 } });
  
      if (fanTimerSetting) {
        console.log('Fan Timer setting retrieved from MongoDB:', fanTimerSetting);
        res.status(200).json({
          status: 'OK',
          data: {
            FanTimer: fanTimerSetting.FanTimer
          }
        });
  
        // Delete the record after successfully retrieving it
        await collection.deleteOne({ _id: fanTimerSetting._id });
        console.log('Fan Timer setting deleted from the database.');
      } else {
        console.log('No Fan Timer setting found in the database.');
        res.status(404).json({ status: 'Not Found', message: 'No Fan Timer setting found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: 'Internal Server Error', error: error.message });
    } finally {
      // Close the MongoDB connection
      if (client) {
        await client.close();
      }
    }
  });
  
  // Route to get the latest Temperature Setpoint value
  app.get('/gettemperaturesetpoint', async (req, res) => {
    let client; // Declare the client variable within the route scope
    try {
      // Connect to MongoDB Atlas
      client = new MongoClient(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
      await client.connect();
  
      // Access the database and collection for sensor settings
      const database = client.db('Hydroponics');
      const collection = database.collection('Temperature');
  
      // Retrieve the latest Temperature Setpoint setting document
      const temperatureSetpointSetting = await collection.findOne({}, { sort: { Timestamp: -1 } });
  
      if (temperatureSetpointSetting) {
        console.log('Temperature Setpoint setting retrieved from MongoDB:', temperatureSetpointSetting);
        res.status(200).json({
          status: 'OK',
          data: {
            TemperatureSetpoint: temperatureSetpointSetting.TemperatureSetpoint
          }
        });
  
        // Delete the record after successfully retrieving it
        await collection.deleteOne({ _id: temperatureSetpointSetting._id });
        console.log('Temperature Setpoint setting deleted from the database.');
      } else {
        console.log('No Temperature Setpoint setting found in the database.');
        res.status(404).json({ status: 'Not Found', message: 'No Temperature Setpoint setting found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: 'Internal Server Error', error: error.message });
    } finally {
      // Close the MongoDB connection
      if (client) {
        await client.close();
      }
    }
  });
  
  // Route to get the latest Humidity Setpoint value
  app.get('/gethumiditysetpoint', async (req, res) => {
    let client; // Declare the client variable within the route scope
    try {
      // Connect to MongoDB Atlas
      client = new MongoClient(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
      await client.connect();
  
      // Access the database and collection for sensor settings
      const database = client.db('Hydroponics');
      const collection = database.collection('Humidity');
  
      // Retrieve the latest Humidity Setpoint setting document
      const humiditySetpointSetting = await collection.findOne({}, { sort: { Timestamp: -1 } });
  
      if (humiditySetpointSetting) {
        console.log('Humidity Setpoint setting retrieved from MongoDB:', humiditySetpointSetting);
        res.status(200).json({
          status: 'OK',
          data: {
            HumiditySetpoint: humiditySetpointSetting.HumiditySetpoint
          }
        });
  
        // Delete the record after successfully retrieving it
        await collection.deleteOne({ _id: humiditySetpointSetting._id });
        console.log('Humidity Setpoint setting deleted from the database.');
      } else {
        console.log('No Humidity Setpoint setting found in the database.');
        res.status(404).json({ status: 'Not Found', message: 'No Humidity Setpoint setting found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: 'Internal Server Error', error: error.message });
    } finally {
      // Close the MongoDB connection
      if (client) {
        await client.close();
      }
    }
  });

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
