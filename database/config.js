const mongoose = require('mongoose');

const URL = process.env.MONGODB_CNN;


const dbConection = async() =>{

    try {

        // await mongoose.connect( URL, {
        //     // useCreateIndex: true, 
        //     // useFindAndModify: false, 
        //     // useNewUrlParser: true, 
        //     // useUnifiedTopology: true 
        // });

        await mongoose.connect(URL);

        
        console.log('Base de datos online');
        
    } catch (error) {

        console.log(error)
        throw new Error('Error al iniciar la base de datos');

    }

}



module.exports = {
    dbConection,
}