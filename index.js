const express = require('express')
const cors = require('cors')
const app = express()
app.use(express.json())
app.use(cors())

filmes = [
    {
        titulo: "Bridget Jones: Louca pelo Garoto",
        sinopse: "Agora mãe solteira, Bridget Jones mergulha novamente no mundo dos encontros. Ela se vê dividida entre um homem mais jovem e o professor de ciências de seu filho."
    },
    {
        titulo: "Homem-Aranha: Um Novo Dia",
        sinopse: "Após o mundo ter esquecido seu nome, Peter Parker inicia um novo capítulo em sua vida, conciliando as aulas da faculdade, um trabalho de meio período e sua responsabilidade como o Homem-Aranha. Mas quando uma força misteriosa começa a desmantelar a cidade de dentro para fora, Peter se vê preso entre inimigos poderosos, legados antigos e aliados inesperados."
    },
]

//get http://localhost:3000/oi
app.get('/oi' , (req, res) => {
    res.send('oi')
})

//get http://localhost:3000/filmes
app.get('/filmes', (req, res) => {
    res.json(filmes)
})

//post http://localhost:3000/filmes
app.post('/filmes', (req, res) => {
    const titulo = req.body.titulo
    const sinopse = req.body.sinopse
    const filme = {titulo: titulo, sinopse: sinopse}
    filmes.push(filme)
    res.json(filmes)
})

app.listen(3000, () => console.log('servidor na escuta'))