// const connect = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "1234",
//     port: "3307",
//     database: "dbyoutube"
// })
import  config  from '../config/config.js';
import { Sequelize } from 'sequelize'


// const sequelize = new Sequelize(config.database, config.user, config.pass, {
//   host: "node-mysql",
//   port : config.port,
//   dialect: config.dialect
// });

const sequelize = new Sequelize("dbyoutube","root","1234", {
  host: "youtube-sql",
  port : 3306,
  dialect: "mysql"
})

console.log(sequelize)
// try {
//     sequelize.authenticate()
//     console.log("connected")
// } catch (error) {
//     console.log(error)
// }


export default sequelize