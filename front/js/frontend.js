const protocolo = 'http://'
const baseURL = 'localhost:3000'

async function obterFilmes() {
    const filmesEndpoint = '/filmes'
    //console.log ('teste')
    //monta a URL
    const URLcompleta = `${protocolo}${baseURL}${filmesEndpoint}`
    //requisição
    const filmes = (await axios.get(URLcompleta)).data
    //console.log(filmes)
    let tabela = document.querySelector('.filmes')
    let corpoTabela = tabela.getElementsByTagName('tbody')[0]
    for (let filme of filmes) {
        let linha = corpoTabela.insertRow(0)
        let celulaTitulo = linha.insertCell(0)
        let celulaSinopse = linha.insertCell(1)
        celulaTitulo.innerHTML = filme.titulo
        celulaSinopse.innerHTML = filme.sinopse
    }
}

async function cadastrarFilme() {
    const filmesEndpoint = '/filmes'
    const URLcompleta = `${protocolo}${baseURL}${filmesEndpoint}`
    let tituloInput = document.querySelector('#tituloInput')
    let sinopseInput = document.querySelector('#sinopseInput')
    let titulo = tituloInput.value
    let sinopse = sinopseInput.value
    if (titulo && sinopse) {
        //limpa os inputs
        tituloInput.value = ""
        sinopseInput.value = ""
        //envia os dados
        const filmes = (await axios.post(URLcompleta, {titulo, sinopse})).data
        //limpar a tabela
        let tabela = document.querySelector('.filmes')
        let corpoTabela = tabela.getElementsByTagName('tbody')[0]
        corpoTabela.innerHTML = ""
        for (let filme of filmes) {
            let linha = corpoTabela.insertRow(0)
            let celulaTitulo = linha.insertCell(0)
            let celulaSinopse = linha.insertCell(1)
            celulaTitulo.innerHTML = filme.titulo
            celulaSinopse.innerHTML = filme.sinopse
        }
        exibirAlerta('.alert-cadastro-filme', "Filme cadastrado com sucesso", ['show', 'alert-success'], ['d-none', 'alert-danger'])
    }
    else {
        exibirAlerta('.alert-cadastro-filme', "Preencha todos os campos", ['show', 'alert-danger'], ['d-none', 'alert-success'], 2000)
    }
}
async function cadastrarUsuario () {
    let usuarioCadastroInput = document.querySelector('#usuarioCadastroInput')
    let passwordCadastroInput = document.querySelector('#passwordCadastroInput')
    let usuarioCadastro = usuarioCadastroInput.value
    let passwordCadastro = passwordCadastroInput.value
    if (usuarioCadastro && passwordCadastro) {
        try {
            const cadastroEndpoint = '/signup'
            const URLcompleta = `${protocolo}${baseURL}${cadastroEndpoint}`
            await axios.post (URLcompleta, {login: usuarioCadastro, password: passwordCadastro})
            usuarioCadastroInput.value = ""
            passwordCadastroInput.value = ""
            exibirAlerta ('.alert-modal-cadastro', "Usuário cadastrado com sucesso", ['show', 'alert-success'], ['d-none', 'alert-danger'], 2000)
            esconderModal ('#modalCadastro', 2000)
        }
        catch (e) {
            exibirAlerta ('.alert-modal-cadastro', "Usuário já cadastrado", ['show', 'alert-danger'], ['d-none', 'alert-success'], 2000)
            esconderModal ('#modalCadastro', 2000)
        }
    }
    else {
        exibirAlerta('.alert-modal-cadastro', "Preencha todos os campos", ['show', 'alert-danger'], ['d-none', 'alert-success'], 2000)
    }
}

async function fazerLogin() {
    let usuarioLoginInput = document.querySelector('#usuarioLoginInput')
    let passwordLoginInput = document.querySelector('#passwordLoginInput')
    let usuarioLogin = usuarioLoginInput.value
    let passwordLogin = passwordLoginInput.value
    if (usuarioLogin && passwordLogin) {
        try {
            const loginEndpoint = '/login'
            const URLcompleta = `${protocolo}${baseURL}${loginEndpoint}`
            usuarioLoginInput.value = ""
            passwordLoginInput.value = ""
            const resposta = await axios.post (URLcompleta, {login: usuarioLogin, password: passwordLogin})
            localStorage.setItem('token', resposta.data.token)
            exibirAlerta ('.alert-modal-login', "Login realizado com sucesso!", ['show', 'alert-success'], ['d-none', 'alert-danger'], 2000)
            esconderModal ('#modalLogin', 2000)
            prepararPagina()
        }
        catch (e) {
            exibirAlerta('.alert-modal-login', "Problemas no login", ['show', 'alert-danger'], ['d-none', 'alert-success'], 2000)
        }
    }
    else {
        exibirAlerta('.alert-modal-login', "Preencha todos os campos", ['show', 'alert-danger'], ['d-none', 'alert-success'], 2000)
    }
}

function exibirAlerta (seletor, innerHTML, classesToAdd, classesToRemove, timeout) {
    let alert = document.querySelector(seletor)
    alert.innerHTML = innerHTML
    alert.classList.add(...classesToAdd)
    alert.classList.remove(...classesToRemove)
    setTimeout(() => {
            alert.classList.add('d-none')
            alert.classList.remove('show')
    }, timeout)
}

function esconderModal (seletor, timeout) {
    setTimeout(() => {
        let modal = bootstrap.Modal.getInstance(document.querySelector(seletor))
        modal.hide()
    }, timeout)
}

function prepararPagina () {
    const token = localStorage.getItem('token')
    const loginLink = document.querySelector('#loginLink')
    const cadastrarFilmeButton = document.querySelector('#cadastrarFilmeButton')
    if (token) {
        loginLink.innerHTML = "Logout"
        cadastrarFilmeButton.disabled = false
    }
    else {
        loginLink.innerHTML = "Login"
        cadastrarFilmeButton.disabled = true
    }
}