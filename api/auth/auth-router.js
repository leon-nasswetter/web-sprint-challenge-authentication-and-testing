const router = require("express").Router()
const bcrypt = require("bcryptjs")
const { checkUsernameUnique, checkUserExists, checkPayload, makeToken } = require("../middleware/auth-middleware")
const User = require("./auth-model")

router.post("/register", checkPayload, checkUsernameUnique, (req, res) => {
  
  const { password } = req.body
  const hash = bcrypt.hashSync(password, 8)
  req.body.password = hash

User.add(req.body)
  .then(registered => {
    res.status(201).json(registered)
  })
  .catch(err => {
    res.status(500).json({ message: `Server error: ${err}` })
  })

})

router.post("/login", checkPayload, checkUserExists, (req, res) => {
  const { username, password } = req.body

  User.findBy({username: username})
    .first()
    .then(user => {
      if(user && bcrypt.compareSync(password, user.password)) {
        const token = makeToken(user)

        res.status(200).json({
          message: `welcome, ${user.username}`,
          token: token
        })
      }
    })
    .catch(err => {
      res.status(500).json({ message: `Server error: ${err}` })
    })
})

module.exports = router