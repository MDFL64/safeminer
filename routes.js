/*   Routes!   */

app.get('/', (req, res) => {
  res.status(200).send({
    hello : "world"
  });
});

app.get('/api/users', (req, res) => {
  const db = req.db;

  db.collection("users")
    .find()
    .toArray()
    .then(result => {
      res.status(200).send({
        result
      })
    })
    .catch(err => {
      res.status(500).send({
        err
      })
    })

});

app.post('/api/users', (req, res) => {
  const name = req.body.name;
  const surname = req.body.surname;

  db.collection("users")
    .insertOne({ Name: name, Surname: surname })
    .then(result => {
      res.status(200).send({
        success: true,
        result
      });
    });
});