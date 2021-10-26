const express = require('express')
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/DBProduct',{ useNewUrlParser: true,useUnifiedTopology: true  })
const Products = mongoose.model('Products',new mongoose.Schema({title:String}))
// Products.insertMany([
//     {title:'产品1'},
//     {title:'产品2'},
//     {title:'产品3'}
// ])

const app = express()

app.use(require('cors')())
app.use('/',express.static('public'))

app.get('/Products',async function(req,res){
    // 分页
    // const data = await Products.find().skip(1).limit(2)
    // 查询
    // const data = await Products.find().where({title:'产品1'})
    // 排序
    const data = await Products.find().sort({_id: -1})
    res.send(data)
})

// 带有参数的接口
app.get('/Products/:id',async function(req,res){
    const data = await Products.findById(req.params.id)
    res.send(data)
})

// post请求的接口
app.use(express.json())
app.post('/Products',async function(req,res){
    const data = await Products.create(req.body)
    res.send(data)
})

// put请求的接口
app.put('/Products/:id',async function(req,res){
    const product = await Products.findById(req.params.id)
    product.title = req.body.title
    await product.save()
    res.send(product)
})

// DELETE请求的接口
app.delete('/Products/:id',async function(req,res){
    const product = await Products.findById(req.params.id)
    await product.remove()
    res.send({message:'删除成功'})
})

app.listen(3000,()=>{
    console.log('listen port 3000')
})