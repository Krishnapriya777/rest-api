const mongoose = require("mongoose");
const users = require("./models/user");
mongoose.connect("mongodb+srv://Krishnapriya:krishna123@cluster0.dbdfr76.mongodb.net/project?retryWrites=true&w=majority&appName=Cluster0")
    .then(async () => {
        console.log('connected to database')
        const result = await users.updateMany
            (
                { isverified: { $exists: false } },
                { $set: { isverified: false } }
            );

        console.log(`${result.modifiedCount} documents updated`);
        mongoose.disconnect();
    })
    .catch(err => console.error(err));



