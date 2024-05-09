//module imports
const Express=require('express');
const mongoose = require("mongoose");
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const path = require('path')
const passport=require('passport')
const dotenv =require('dotenv');
var cors = require('cors')
const {innitialize}=require('./WhatsappApi/index')
dotenv.config();
innitialize();

const GoogleAuthenticationRoutes =require("./AuthenticateRouter/GoogleAuthentication")
const otherRoutes =require("./usualRoutes/idex")
const AdminDashboardRoutes =require("./usualRoutes/AdminRoutes")
const GoogleDrive=require('./GoogleDriveApiAndRequests/index')



// App starts here
 const app=Express();
 const DB =process.env.MONGO_DB_CONNECTION_LINK;

const PORT=process.env.PORT||3000
app.use(logger('dev'));
app.set('views','views');
app.set('view engine','ejs');
app.use('/public', Express.static(path.join(__dirname, 'public')))
app.use(Express.json({limit: '200mb'}));
app.use(cookieParser());
app.use(Express.urlencoded({limit: '200mb', extended: true,}));
app.use(cors({origin:['https://plumbernoboarders.github.io','197.157.145.191','192.30.252.153','192.30.252.154','localhost:3001'],credentials: true}))
app.use(session({
  secret: 'keyboardcat',
  resave: false, // don't save session if unmodified
  saveUninitialized: false, // don't create session until something stored
  cookie: { maxAge: 1000 * 60 * 60 * 24 }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(GoogleAuthenticationRoutes)
app.use(otherRoutes)
app.use(GoogleDrive)
app.use('/admin',AdminDashboardRoutes)

mongoose
.connect(DB, { useNewUrlParser: true, useUnifiedTopology: true }).then((results) => {  app.listen(PORT,()=>{console.log('listenning on port '+PORT)}); console.log("connected to the database");})
.catch((err) => {console.warn(err);});
