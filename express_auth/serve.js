const express = require('express')
const { User } = require('./models')
const app = express()
app.use(express.json())
const jwt = require('jsonwebtoken')
const key = 'asdqwezxc'

// 查找用户
app.get('/api/getUsers', async function (req, res) {
    const user = await User.find()
    res.send(user)
})

// 注册
app.post('/api/register', async function (req, res) {
    const user = await User.create({
        username: req.body.username,
        password: req.body.password
    })
    res.send(user)
})

// 登录
app.post('/api/login', async function (req, res) {
    // 验证用户是否存在
    const user = await User.findOne({
        username: req.body.username
    })
    if (!user) {
        return res.status(422).send('用户不存在！')
    }
    const validator = require('bcrypt').compareSync(req.body.password, user.password)
    if (!validator) {
        return res.status(422).send('密码错误！')
    }
    // 生成toekn
    const token = jwt.sign({ id: String(user.id) }, key)
    res.send({ token, user })
})

const auth = async (req, res, next) => {
    const token = String(req.headers.authorization).split(' ').pop()
    const { id } = jwt.verify(token, key)
    req.user = await User.findById(id)
    next()
}

// 授权
app.get('/api/getProfile', auth, async function (req, res) {
    // const token = String(req.headers.authorization).split(' ').pop()
    // const {id} = jwt.verify(token,key)
    // const user = await User.findById(id)
    res.send(req.user)
})

app.listen(3000, () => {
    console.log('listen port 3000')
})