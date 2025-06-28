const express = require('express')
const app = express()
const bcrypt = require('bcrypt')


app.use(express.json())

const users = []

app.get('/users', async (req, res) => {
    res.json(users)
})

app.post('/users', async (req, res) => {
 try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    const user = { name: req.body.name, password: hashedPassword}
    users.push(user)
    res.status(201).send()
 } catch{
    res.status(500).send('Internal server error')
 }

})

app.post('/auth/register', async (req, res) => {
    
        const existingUser = users.find(user => user.name === req.body.name)
        if (existingUser) {
            return res.status(400).send('Account already exists')
        }   
        try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        const user = { name: req.body.name, password: hashedPassword }
        users.push(user)
        res.status(201).send('User registered successfully')
    } catch {
        res.status(500).send('Internal server error')
    }
})

app.post('/users/login', async (req, res) => {
    const user = users.find(user => user.name === req.body.name)
    if(user == null){
        return res.status(400).send('Cannot find user')
    }
    try{
       if(await bcrypt.compare(req.body.password, user.password)){
        res.send('Success')
       } else {
        res.send('wrong password')
       }
    } catch {
        res.status(500).send('Internal server error')
    }
})

app.listen(3000)