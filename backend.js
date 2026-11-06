const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator').default
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const app = express()
app.use(express.json())
app.use(cors())

const Filme = mongoose.model("Filme", mongoose.Schema({
    titulo: {type: String}, 
    sinopse: {type: String}
}))

const usuarioSchema = mongoose.Schema ({
    login: {type: String, required: true, unique: true},
    password: {type: String, required: true}
})
usuarioSchema.plugin(uniqueValidator)
const Usuario = mongoose.model("Usuario", usuarioSchema)

async function conectarMongo() {
    await mongoose.connect(`mongodb+srv://andreiamachion_db_user:mongo123@cluster0.d7majmq.mongodb.net/`)
}

// filmes = [
//     {
//         titulo: "Bridget Jones: Louca pelo Garoto",
//         sinopse: "Agora mãe solteira, Bridget Jones mergulha novamente no mundo dos encontros. Ela se vê dividida entre um homem mais jovem e o professor de ciências de seu filho."
//     },
//     {
//         titulo: "Homem-Aranha: Um Novo Dia",
//         sinopse: "Após o mundo ter esquecido seu nome, Peter Parker inicia um novo capítulo em sua vida, conciliando as aulas da faculdade, um trabalho de meio período e sua responsabilidade como o Homem-Aranha. Mas quando uma força misteriosa começa a desmantelar a cidade de dentro para fora, Peter se vê preso entre inimigos poderosos, legados antigos e aliados inesperados."
//     },
// ]

//get http://localhost:3000/oi
app.get('/oi' , (req, res) => {
    res.send('oi')
})

//get http://localhost:3000/filmes
app.get('/filmes', async (req, res) => {
    const filmes = await Filme.find()
    res.json(filmes)
})

//post http://localhost:3000/filmes
app.post('/filmes', async (req, res) => {
    const titulo = req.body.titulo
    const sinopse = req.body.sinopse
    const filme = new Filme ({titulo: titulo, sinopse: sinopse})
    await filme.save()
    const filmes = await Filme.find()
    res.json(filmes)
})

//post http://localhost:3000/signup
app.post('/signup',  async (req, res) => {
    try {
        const login = req.body.login
        const password = req.body.password
        const criptografada = await bcrypt.hash(password, 10)
        const usuario = new Usuario({
            login: login,
            password: criptografada
        })
        const respostaMongo = await usuario.save()
        console.log(respostaMongo)
        res.status(201).end()
    }
    catch (e) {
        console.log(e)
        res.status(409).end()
    }
})

//post http://localhost:3000/login
app.post('/login', async (req, res) => {
    const login = req.body.login
    const password = req.body.password
    const usuario = await Usuario.findOne({login: login})
    if (!usuario) {
        return res.status(401).json({mensagem: "usuário não encontrado"})
    }
    const senhaValida = await bcrypt.compare(password, usuario.password)
    if (!senhaValida) {
        return res.status(401).json({mensagem: "senha inválida"})
    }
    const token = jwt.sign (
        {login: login},
        "chave",
        {expiresIn: "1h"}
    )
    res.status(200).json({token: token})
})

app.listen(3000, async () => {
    try {
        await conectarMongo()
        console.log('servidor na escuta e banco conectado')
    }
    catch (e) {
        console.log ('erro: ', e)
    }
})