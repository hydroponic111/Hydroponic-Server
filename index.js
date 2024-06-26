const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const moment = require('moment-timezone');



const app = express();
const port = process.env.PORT || 8080;

// Define MongoDB Atlas connection URI
const mongoUri = process.env.MONGO_URI;

let client;

// Middleware to parse JSON data
app.use(bodyParser.json());

async function connectToMongo() {
    const client = new MongoClient(mongoUri); // Create a new MongoDB client
    await client.connect(); // Connect to MongoDB
    return client; // Return the connected client
}

// Route to handle retrieving the latest sensor data
app.get('/getsensordata', async (req, res) => {
let client; // Declare client variable
  try {
    client = await connectToMongo(); // Establish connection to MongoDB

    // Access the database and collection for sensor data
    const database = client.db('Hydroponics');
    const collection = database.collection('SensorData');

    // Retrieve the latest sensor data document
    const latestSensorData = await collection.find({})
      .sort({ Timestamp: -1 })
      .limit(1)
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
  let client; // Declare client variable
  try {
    // Connect to MongoDB Atlas
   client = await connectToMongo(); // Establish connection to MongoDB
    

    // Access the database and collection
    const database = client.db('Hydroponics');
    const collection = database.collection('SensorData');

    // Add Timestamp field to the sensor data with Pakistan Time Zone
    const sensorDataWithTimestamp = {
      ...sensorData,
     Timestamp: moment().tz('Asia/Karachi').add(5, 'hours').toDate(), // Use Asia/Karachi for Pakistan Time Zone

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

// Route to get the latest Fan Timer value
app.get('/getfantimer', async (req, res) => {
  let client;
  try {
    // Connect to MongoDB Atlas
   client = await connectToMongo(); // Establish connection to MongoDB
    

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

// Route to update humidity setpoint
app.post('/updatehumiditysetpoint', async (req, res) => {
  const { HumiditySetpoint } = req.body;

  try {
    // Connect to MongoDB Atlas
   client = await connectToMongo(); // Establish connection to MongoDB
    

    // Access the database and collection for sensor settings
    const database = client.db('Hydroponics');
    const collection = database.collection('Humidity');

    // Insert document with updated Humidity Setpoint
    const result = await collection.insertOne({
      HumiditySetpoint,
     Timestamp: moment().tz('Asia/Karachi').add(5, 'hours').toDate(), // Use Asia/Karachi for Pakistan Time Zone

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

// Route to update temperature setpoint
app.post('/updatetemperaturesetpoint', async (req, res) => {
  const { TemperatureSetpoint } = req.body;

  try {
    // Connect to MongoDB Atlas
   client = await connectToMongo(); // Establish connection to MongoDB
    

    // Access the database and collection for sensor settings
    const database = client.db('Hydroponics');
    const collection = database.collection('Temperature');

    // Insert document with updated Temperature Setpoint
    const result = await collection.insertOne({
      TemperatureSetpoint,
     Timestamp: moment().tz('Asia/Karachi').add(5, 'hours').toDate(), // Use Asia/Karachi for Pakistan Time Zone

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

// Route to get the latest Temperature Setpoint value
app.get('/gettemperaturesetpoint', async (req, res) => {
  let client;
  try {
    // Connect to MongoDB Atlas
   client = await connectToMongo(); // Establish connection to MongoDB
    

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

// Route to update fan timer
app.post('/updatelighttimer', async (req, res) => {
    const { LightDuration } = req.body;
  
    let client;
  
    try {
      // Connect to MongoDB Atlas
     client = await connectToMongo(); // Establish connection to MongoDB
      
  
      // Access the database and collection for the first light timer collection
      const database1 = client.db('Hydroponics');
      const collection1 = database1.collection('Manual Light');
  
      // Access the database and collection for the second light timer collection
      const database2 = client.db('Hydroponics');
      const collection2 = database2.collection('User Light Records');
  
      // Insert document with updated Light Duration into the first collection
      const result1 = await collection1.insertOne({
        LightDuration,
        Timestamp: moment().tz('Asia/Karachi').add(5, 'hours').toDate(),
      });
  
      // Insert document with updated Light Duration into the second collection
      const result2 = await collection2.insertOne({
        LightDuration,
        Timestamp: moment().tz('Asia/Karachi').add(5, 'hours').toDate(),
      });
  
      console.log(`Light Duration updated in MongoDB. Document inserted in Collection 1: ${result1.insertedId}, Collection 2: ${result2.insertedId}`);
      res.status(200).json({
        status: 'OK',
        insertedIdCollection1: result1.insertedId,
        insertedIdCollection2: result2.insertedId,
      });
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

// Route to get the latest manual light timer setting
app.get('/getmanuallighttimer', async (req, res) => {
  let client;
  try {
    // Connect to MongoDB Atlas
   client = await connectToMongo(); // Establish connection to MongoDB
    

    // Access the database and collection for manual light timer settings
    const database = client.db('Hydroponics');
    const collection = database.collection('Manual Light');

    // Retrieve the latest manual light timer setting document
    const manualLightTimer = await collection.findOne({}, { sort: { Timestamp: -1 } });

    if (manualLightTimer) {
      console.log('Manual Light Timer setting retrieved from MongoDB:', manualLightTimer);
      res.status(200).json({
        status: 'OK',
        data: {
          manualLightTimer: manualLightTimer.LightDuration
        }
      });
      // Delete all records from the collection
      // await collection.deleteMany({});
      // No need to delete the record after retrieval as it's not specified in the question.
    } else {
      console.log('No Manual Light Timer setting found in the database.');
      res.status(404).json({ status: 'Not Found', message: 'No Manual Light Timer setting found' });
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
  let client;
  try {
    // Connect to MongoDB Atlas
   client = await connectToMongo(); // Establish connection to MongoDB
    

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
// Route to handle retrieving sensor settings and deleting the record
app.get('/sensorsettings', async (req, res) => {
  let client;
  try {
    // Connect to MongoDB Atlas
   client = await connectToMongo(); // Establish connection to MongoDB
    

    // Access the database and collection for sensor settings
    const database = client.db('Hydroponics');
    const collection = database.collection('SensorSettings');

    // Retrieve the latest sensor settings document
    const sensorSettings = await collection.findOne({}, { sort: { Timestamp: -1 } });

    if (sensorSettings) {
      console.log('Sensor settings retrieved from MongoDB:', sensorSettings);

      // Delete all records from the collection
      // await collection.deleteMany({});

      res.status(200).json({
        status: 'OK',
        data: {
          FanTimer: sensorSettings.FanTimer,
          TemperatureSetpoint: sensorSettings.TemperatureSetpoint,
          HumiditySetpoint: sensorSettings.HumiditySetpoint
        }
      });
    } else {
      console.log('No sensor settings found in the database.');
      res.status(404).json({ status: 'Not Found', message: 'No sensor settings found' });
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

// Route to handle updating sensor settings
// app.post('/updatesensorsettings', async (req, res) => {
// const { FanTimer, TemperatureSetpoint, HumiditySetpoint } = req.body;

// try {
//   // Connect to MongoDB Atlas
//  client = await connectToMongo(); // Establish connection to MongoDB
//   

//   // Access the database and collection for sensor settings
//   const database = client.db('Hydroponics');
//   const collection = database.collection('SensorSettings');

//   // Insert document with updated sensor settings
//   const result = await collection.insertOne({
//     FanTimer,
//     TemperatureSetpoint,
//     HumiditySetpoint,
//     Timestamp: moment().tz('Asia/Karachi').add(5, 'hours').toDate(), // Use Asia/Karachi for Pakistan Time Zone
//   });

//   console.log(`Sensor settings updated in MongoDB. Document inserted: ${result.insertedId}`);
//   res.status(200).json({ status: 'OK', insertedId: result.insertedId });
// } catch (error) {
//   console.error(error);
//   res.status(500).json({ status: 'Internal Server Error', error: error.message });
// } finally {
//   // Close the MongoDB connection
//   if (client) {
//     await client.close();
//   }
// }
// });
app.post('/updatenewsensorsettings', async (req, res) => {
  const {
    "Temperature Low": Temperaturelo,
    "Temperature High": Temperatureup,
    "Humidity Low": Humiditylo,
    "Humidity High": Humidityup,
    "pH low": pHlo,
    "pH high": pHup,
    "EC low": EClo,
    "EC high": ECup,
    "Light Duration": LightDuration,
  } = req.body;

  let client;

  try {
    // Connect to MongoDB Atlas
   client = await connectToMongo(); // Establish connection to MongoDB
    

    // Access the database and collection for the first sensor settings collection
    const database1 = client.db('Hydroponics');
    const collection1 = database1.collection('newSensorSettings');

    // Access the database and collection for the second sensor settings collection
    const database2 = client.db('Hydroponics');
    const collection2 = database2.collection('newUserRecords');

    // Insert document with updated sensor settings into the first collection
    const result1 = await collection1.insertOne({
      TemperatureLo: Temperaturelo,
      TemperatureUp: Temperatureup,
      HumidityLo: Humiditylo,
      HumidityUp: Humidityup,
      EC_Lo: EClo,
      EC_Up: ECup,
      LightDuration: LightDuration,
      pH_Lo: pHlo,
      pH_Up: pHup,
      Timestamp: moment().tz('Asia/Karachi').add(5, 'hours').toDate(),
    });

    // Insert document with updated sensor settings into the second collection
    const result2 = await collection2.insertOne({
      TemperatureLo: Temperaturelo,
      TemperatureUp: Temperatureup,
      HumidityLo: Humiditylo,
      HumidityUp: Humidityup,
      EC_Lo: EClo,
      EC_Up: ECup,
      LightDuration: LightDuration,
      pH_Lo: pHlo,
      pH_Up: pHup,
      Timestamp: moment().tz('Asia/Karachi').add(5, 'hours').toDate(),
    });

    console.log(`Sensor settings updated in MongoDB. Document inserted in Collection 1: ${result1.insertedId}, Collection 2: ${result2.insertedId}`);
    res.status(200).json({
      status: 'OK',
      insertedIdCollection1: result1.insertedId,
      insertedIdCollection2: result2.insertedId,
    });
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
app.post('/updatesensorsettings', async (req, res) => {
  const { FanTimer, TemperatureSetpoint, HumiditySetpoint } = req.body;

  let client;

  try {
    // Connect to MongoDB Atlas
   client = await connectToMongo(); // Establish connection to MongoDB
    

    // Access the database and collection for the first sensor settings collection
    const database1 = client.db('Hydroponics');
    const collection1 = database1.collection('SensorSettings');

    // Access the database and collection for the second sensor settings collection
    const database2 = client.db('Hydroponics');
    const collection2 = database2.collection('UserRecords');

    // Insert document with updated sensor settings into the first collection
    const result1 = await collection1.insertOne({
      FanTimer,
      TemperatureSetpoint,
      HumiditySetpoint,
      Timestamp: moment().tz('Asia/Karachi').add(5, 'hours').toDate(),
    });

    // Insert document with updated sensor settings into the second collection
    const result2 = await collection2.insertOne({
      FanTimer,
      TemperatureSetpoint,
      HumiditySetpoint,
      Timestamp: moment().tz('Asia/Karachi').add(5, 'hours').toDate(),
    });

    console.log(`Sensor settings updated in MongoDB. Document inserted in Collection 1: ${result1.insertedId}, Collection 2: ${result2.insertedId}`);
    res.status(200).json({
      status: 'OK',
      insertedIdCollection1: result1.insertedId,
      insertedIdCollection2: result2.insertedId,
    });
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
// Route to get the latest sensor settings
app.get('/getnewsensorsettings', async (req, res) => {
  let client;
  try {
    // Connect to MongoDB Atlas
   client = await connectToMongo(); // Establish connection to MongoDB
    

    // Access the database and collection for sensor settings
    const database = client.db('Hydroponics');
    const collection = database.collection('newSensorSettings');

    // Retrieve the latest sensor settings document
    const sensorSettings = await collection.findOne({}, { sort: { Timestamp: -1 } });

    if (sensorSettings) {
      console.log('Sensor settings retrieved from MongoDB:', sensorSettings);
      res.status(200).json({
        status: 'OK',
        data: sensorSettings
      });

      // No need to delete the record after retrieval as it's not specified in the question.
      // await collection.deleteMany({});
    } else {
      console.log('No sensor settings found in the database.');
      res.status(404).json({ status: 'Not Found', message: 'No sensor settings found' });
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
