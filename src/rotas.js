const express = require('express');
const usuarios = require('./controladores/usuarios');
const login = require('./controladores/login')
const postagens = require('./controladores/postagens')
const verificaLogin = require('./filtros/verificaLogin')

const rotas = express();

//Cadastro de usuários
rotas.post('/usuarios', usuarios.cadastrarUsuario);

//Login
rotas.post('/login', login.login ); 

//Feed principal
rotas.get('/', postagens.todasAsPostagens);

rotas.use(verificaLogin); 

//Cadastrar postagem
rotas.get('/postagens', postagens.postagensUsuario);
rotas.post('/postagens', postagens.cadastarPostagem);
rotas.patch('/postagens/:id', postagens.atualizarPostagem);
rotas.delete('/postagens/:id', postagens.excluirPostagem);


module.exports = rotas;