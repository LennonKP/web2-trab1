import express from 'express';
import session from 'express-session';
import flash from 'connect-flash';
import { simpleLogger } from './middlewares';
import router from './routes';

const app = express();
const port = 3000;

app.set('views', 'src/views');
app.set('view engine', 'ejs');
app.set('json spaces', 2);
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static('public'))

app.use(
  session({
    secret: 'session-secret',
    resave: false,
    saveUninitialized: false,
  })
);
app.use(flash());

app.use(simpleLogger)
app.use(router)

app.listen(port, () => console.log(`Server is running at http://localhost:${port}`));
