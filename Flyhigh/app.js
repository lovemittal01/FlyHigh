const express = require("express");
const db = require("./db");
const app = express();
const util = require("util");

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.get("/", async function (req, res) {
  res.send({ message: "ok" });
});

app.post("/login", async function (req, res) {
  const { email, password } = req.body;
  const result = await db.query(
    `select * from user where email = '${email}' and password = '${password}'`
  );

  if (!result) res.send({ message: "Invalid user!" });
  const role = result[0].role == 0 ? "user" : "admin";
  res.send({ message: " LoggedIn Successfully", role });
});

app.post("/register", async function (req, res) {
  const { email, name, password, age } = req.body;
  const result = await db.query(
    `Insert into user(email, name, age, password, role)
        values('${email}','${name}','${age}','${password}','0')`
  );
  if (!result) res.send({ message: "Try again after sometime." });
  res.send({ message: "User Created Successfully!" });
});

app.post("/add-flight", async function (req, res) {
  const {
    name,
    from,
    to,
    departure_time,
    arrival_time,
    travel_class,
    price,
    gst,
  } = req.body;

  let result;
  try {
    result = await db.query(
      `Insert into flight(name,departure_city,arrival_city,departure_time,arrival_time,class,price,gst)
            values ('${name}','${from}','${to}','${departure_time}','${arrival_time}','${travel_class}','${price}','${gst}')`
    );
  } catch (error) {
    res.send({ message: "Try again after sometime!" });
  }
  res.send({ message: "Flight added successfully!" });
});

app.get("/get-flight", async function (req, res) {
  const result = await db.query(`select * from flight`);
  if (!result) res.send({ message: "No flights found!" });
  let flights = [];
  for (let i = 0; i < result.length; i++) {
    flights.push({
      id: result[i].id,
      flight_name: result[i].name,
      departure_city: result[i].departure_city,
      arrival_city: result[i].arrival_city,
      departure_time: result[i].departure_time,
      arrival_time: result[i].arrival_time,
      class: result[i].class,
      price: result[i].price,
      gst: result[i].gst,
    });
  }
  res.send({ flights });
});

app.get("/get-flight-user/:id", async function (req, res) {
  const { id } = req.params;
  const result =
    await db.query(`select t.name, t.age, t.pnr, t.class from ticket as t
    inner join flight as f on f.id = t.flight_id
    where t.flight_id = ${parseInt(id)}`);

  if (!result) res.send({ message: "No users found!" });
  let users = [];

  for (let i = 0; i < result.length; i++) {
    users.push({
      name: result[0].name,
      age: result[0].age,
      pnr: result[0].pnr,
      class: result[0].class,
    });
  }
  res.send({ users });
});

app.listen(3001);
