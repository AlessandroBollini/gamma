const { Sequelize, Model, DataTypes } = require('sequelize');
require('dotenv').config();
//const sequelize = new Sequelize('postgresql://bollini:IKx9ECyNttst67_q7pb2rg@oval-possum-5085.7tc.cockroachlabs.cloud:26257/defaultdb?sslmode=verify-full');

//Local postgresql db connection
/**const sequelize = new Sequelize('envisioningv2', 'bollini', 'password', {
    host: 'localhost',
    dialect: 'postgres'
});*/

const sequelize=new Sequelize(process.env.DATABASE_URL);

sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

class Users extends Model { }
Users.init({
    wallet: {
        type: DataTypes.STRING,
        unique: true
    },
    email: {
        type: DataTypes.STRING
    },
    level: {
        type: DataTypes.STRING
    }
}, {
    timestamps: false,
    sequelize
});

(async () => {
    await sequelize.sync({ alter: false });
})();

module.exports.Users = Users;
