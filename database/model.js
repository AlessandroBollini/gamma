const { Sequelize, Model, DataTypes } = require('sequelize');
require('dotenv').config();

//Local postgresql db connection
/**const sequelize = new Sequelize('envisioningv2', 'bollini', 'password', {
    host: 'localhost',
    dialect: 'postgres'
});*/

//const sequelize=new Sequelize(process.env.DATABASE_URL);

/**const sequelize = new Sequelize('ackowsjn', 'ackowsjn', 'UUe8TDXE-rQs2TzH2ghpgTBjA9c0cvPI', {
    host: 'rogue.db.elephantsql.com',
    dialect: 'postgres'
});*/

const sequelize = new Sequelize('bollini', 'bollini', 'password', {
    host: '172.19.80.1',
    dialect: 'postgres'
});

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
