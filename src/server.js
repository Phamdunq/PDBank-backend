const express = require('express');
const connection = require('./config/database');
const cors = require('cors')
const apiRouter = require('./routes/api');


const app = express(); // app express
const port = process.env.PORT || 8888;
const hostname = process.env.HOST_NAME;

//config cors
app.use(cors())

// Config req.body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Khai báo route
app.use('/v1/api/', apiRouter);

// Middleware xử lý lỗi toàn cục
// app.use((err, req, res, next) => {
//     console.error("Error middleware:", err);
//     res.status(500).json({
//         EC: -1,
//         message: "Something went wrong!",
//     });
// });

app.get("/", (req, res, next) => {
    res.send("Home server");
});

// Khởi động server
(async () => {
    try {
        // Using mongoose
        await connection();

        app.listen(port, hostname, () => {
            console.log(`Backend zero app listening on port ${port} hostname ${hostname}`);
        });
    } catch (error) {
        console.log(">>> Error connect to DB: ", error);
    }
})();
