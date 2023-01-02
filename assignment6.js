const express = require("express");
const app = express();
app.use(express.json());
const fs = require("fs");

// mapping file system paths to the app's virtual paths
app.use("/js", express.static("./public/js"));
app.use("/css", express.static("./public/css"));
app.use("/img", express.static("./public/img"));


app.get("/", function (req, res) {
    let doc = fs.readFileSync("./app/html/index.html", "utf8");
    // just send the text stream
    res.send(doc);
});


app.get("/reviews", function (req, res) {
    connectToMySQL(res);
});
async function connectToMySQL(res) {
    const mysql = require('mysql2/promise');
    const connection = await mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "assignment6",
        multipleStatements: true
    });
    connection.connect();
    const leftJoinTables = 'SELECT A_user.user_name, A_user_review.rate, A_user_review.date_of_post, \
    A_user_review.title_of_post, A_user_review.text_of_post \
    FROM A_user \
    LEFT JOIN A_user_review \
    ON A_user.ID = A_user_review.user_id\
    ORDER BY A_user_review.ID';
    const [rows, fields] = await connection.execute(leftJoinTables);

    await connection.end();
    res.send(rows);
}

async function init() {

    const mysql = require("mysql2/promise");
    const connection = await mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        multipleStatements: true
    });
    const createDBAndTables = `CREATE DATABASE IF NOT EXISTS assignment6;
        use assignment6;
        CREATE TABLE IF NOT EXISTS A_user (
            ID INT NOT NULL AUTO_INCREMENT,
            user_name varchar(30),
            first_name varchar(30),
            last_name varchar(30),
            email varchar(30),
            password varchar(30),
            PRIMARY KEY (ID));
        CREATE TABLE IF NOT EXISTS A_user_review (
            ID INT NOT NULL AUTO_INCREMENT,
            user_id INT NOT NULL,
            rate varchar(50),
            date_of_post varchar(50),
            title_of_post varchar(50),
            text_of_post TEXT,
            PRIMARY KEY (ID),
            FOREIGN KEY (user_id) REFERENCES A_user(ID));`;
    await connection.query(createDBAndTables);

    // await allows for us to wait for this line to execute ... synchronously
    // also ... destructuring. There's that term again!
    const [rows, fields] = await connection.query("SELECT * FROM A_user");
    if (rows.length == 0) {
        let userRecords = "insert into A_user (user_name, first_name, last_name, email, password) values ?";
        let recordValues = [
            ["Lisa", "Lijuan", "Zhu", "lisazhuv@gmail.com", "abc123"],
            ["Sean", "Chuan", "Cui", "sean@gmail.com", "abc123"],
            ["Yoyo", "Tan", "C", "sean@gmail.com", "abc123"],
            ["Sam", "Chuan", "Cui", "sean@gmail.com", "abc123"],
            ["R.L.M", "Chuan", "Cui", "sean@gmail.com", "abc123"],
            ["Jimmy", "Chuan", "Cui", "sean@gmail.com", "abc123"],
            ["Ian", "Chuan", "Cui", "sean@gmail.com", "abc123"]
        ];
        await connection.query(userRecords, [recordValues]);
    }

    const [rows_posts, fields_posts] = await connection.query("SELECT * FROM A_user_review");
    if (rows_posts.length == 0) {
        let userRecords = "insert into A_user_review (user_id, rate, date_of_post, title_of_post, text_of_post) values ?";
        let recordValues = [
            [1, "&starf;&starf;&starf;&starf;&starf;","2 days ago","Highly recommend","Quality of this product is excellent. Delivery time was as stated and also the tracking was great. Good seller." ],
            [2, "&starf;&starf;&starf;&starf;&starf;","5 days ago","Great product","I love the quality and the sound of this instruments. The art in the instruments is also pretty." ],
            [3, "&starf;&starf;&starf;&starf;&starf;","10 days ago","Very nice first erhu","It's well made and has a great tone and full bodied sounds." ],
            [4, "&starf;&starf;&starf;&star;&star;","20 days ago","A beginner instrument","I would not advice it for more experienced players looking for the highest quality." ],
            [5, "&starf;&starf;&starf;&starf;&star;","2 days ago","Price Matches Quality","I would have gave it 5 stars but the stock bridges that it came with aren't as great and I recommend buying a separate."],
            [6, "&starf;&starf;&starf;&starf;&star;","15 days ago","It's beautiful","For the price, this is a great starter! You get everything you need, including extra strings!" ],
            [7, "&starf;&starf;&starf;&starf;&star;","2 months ago","Highly recommend","It's beautiful, there things that I don't know what to do with or how to use them." ],
            [1, "&starf;&starf;&starf;&starf;&starf;","3 days ago","Excellent musical instrument","It sounds so pure, I love it. I already have recommended this musical instrument to my students and friends ." ],
            [2, "&starf;&starf;&starf;&starf;&star;","8 days ago","Needs something","The instructions for playing does not match up with the flute I received." ],
            [3, "&starf;&starf;&starf;&starf;&star;","23 days ago","Good","Beatiful liuqin, robust, real pyton skin, roatan rod bow, and nice sound." ]

        ];
        await connection.query(userRecords, [recordValues]);
    }

    connection.end();
    console.log("Listening on port " + port + "!");
}

// RUN SERVER
let port = 8000;
app.listen(port, init);
