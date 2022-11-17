const express = require('express');
var ObjectId = require('mongodb').ObjectID;
const router = express.Router();

router.get('/login', async function (req, res, next) {
  const { login, senha, tipo } = req.query
  const rs = await global.db.collection(tipo).find({ login, senha }).toArray()

  if (rs.length > 0) {
    res.status(200).send(rs[0]._id)
  } else {
    res.sendStatus(400)
  }
});


router.get('/academia', async function (req, res, next) {
  const rs = await global.db.collection("academia").find({}, { "cep": 0, "numero": 0 }).toArray()

  var arr = []
  for (item of rs) {
    arr.push({
      value: item._id.toString(),
      label: item.nome
    })
  }

  if (arr.length > 0) {
    res.status(200).send(arr)
  } else {
    res.sendStatus(400)
  }
});

router.get('/user', async function (req, res, next) {
  const { sid } = req.query
  var rs = await global.db.collection("aluno").find({ _id: new ObjectId(sid) }).toArray()

  if (rs.length === 0) {
    rs = await global.db.collection("personal").find({ _id: new ObjectId(sid) }).toArray()
  }

  if (rs.length > 0) {
    res.status(200).send(rs[0])
  } else {
    res.sendStatus(400)
  }
});


router.post('/cadastro/personal', async function (req, res, next) {
  try {
    var { login, codigo, senha } = req.body;

    var rs_email = await global.db.collection("personal").find({ login }).toArray()
    if (rs_email.length > 0) {
      res.status(400).send("Email já cadastrado!")
      return
    }

    var rs_codigo = await global.db.collection("personal").find({ codigo }).toArray()
    if (rs_codigo.length === 0) {
      res.status(400).send("Código inválido")
      return
    }

    if (rs_codigo[0].ativo) {
      res.status(400).send("Usuário já ativado!")
      return
    }

    await global
      .db
      .collection("personal")
      .update(
        { codigo },
        {
          $set: {
            "ativo": true,
            "login": login,
            "senha": senha
          }
        }
      )


    var rs = await global.db.collection("personal").find({ login, senha }).toArray()

    res.status(200).send(rs[0]._id)
  } catch (error) {
    console.log(error);
    res.sendStatus(400)
  }

});


router.post('/cadastro/aluno', async function (req, res, next) {
  try {
    var rs_email = await global.db.collection("aluno").find({ login: req.body.login }).toArray()
    if (rs_email.length > 0) {
      res.status(400).send("Email já cadastrado!")
      return
    }

    await global
      .db
      .collection("aluno")
      .insertOne(
        { ...req.body }
      )

    var { login, senha } = req.body
    var rs = await global.db.collection("aluno").find({ login, senha }).toArray()

    res.status(200).send(rs[0]._id)
  } catch (error) {
    console.log(error);
    res.sendStatus(400)
  }

});

module.exports = router;
