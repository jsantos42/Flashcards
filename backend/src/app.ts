import express, {NextFunction, Request, Response} from "express";
import createHttpError, {HttpError} from "http-errors";
import path from "path";
import morgan from "morgan";
import router from "./routes/api";
import dotenv from "dotenv";
import {env} from "process";

// Load environment variables from a .env file into process.env
dotenv.config();

const port = env.PORT || '3000';
const app = express();


//==============================================================================
// MIDDLEWARE SETUP
// From https://expressjs.com/en/4x/api.html#router.use:
// The order in which you define middleware with router.use() is very important;
// they are invoked sequentially, thus the order defines middleware precedence
// (e.g.: a logger should be the first one, so that every request gets logged)
//==============================================================================

// Log HTTP requests (with colored output)
app.use(morgan('dev'));

// Set the directory from which to serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Allow the server to read JSON from the request body, by leveraging the
// express.json() middleware to parse incoming requests with JSON payloads
app.use(express.json());

// Allow the server to handle urlencoded data sent from a client-side form
app.use(express.urlencoded({extended: false}));

// Mount the router module on the app
app.use('/', router);

// Catch 404 errors and forward them to error handlers; this is a catch-all
// middleware that is only reached if none of the earlier middleware sends a
// response or calls next() with an error
app.use(function (req: Request, res: Response, next: NextFunction) {
    next(createHttpError(404));
});

// Handle errors. Note that the signature of this method is different from the
// other middleware methods: it takes 4 arguments (instead of 3). The presence
// of this initial `err` parameter is how Express differentiates error-handling
// middleware (from regular one). This is not invoked on every request, but only
// when an error is passed to the next() function by any preceding middleware or
// if an error is thrown during request processing. Here it also sets a local
// variable `message` that can be used in the views to display the error message
app.use(function (err: HttpError, req: Request, res: Response, next: NextFunction) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.send(err.message);
})


//==============================================================================
// START THE SERVER
//==============================================================================
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

export default app;
