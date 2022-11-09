const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/login', async function (req, res, next) {

  const { login, senha } = req.body
  const rs = await global.db.collection(req.body.tipo).find({ login, senha }).toArray()

  if (rs.length > 0) {
    res.send("sucesso")
  } else {
    res.send("não encontrado")
  }

});

router.post('/cadastro', async function (req, res, next) {

  const rs = await global
    .db
    .collection(req.body.tipo)
    .insertOne({
      ...req.body
    })

    res.send("inserido")

});

module.exports = router;
