const jwt = require('jsonwebtoken');
const segredo = require('../segredo');
const conexao = require('../conexao');

const todasAsPostagens = async (req, res) => {
    
    try {
        const postagens = await conexao.query('select * from postagens');

        return res.status(200).json(postagens.rows)

    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const postagensUsuario = async (req, res) => {
    const {usuario} = req;

    try {
        const postagens = await conexao.query('select * from postagens where usuario_id = $1', [usuario.id]);

        return res.status(200).json(postagens.rows)

    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const cadastarPostagem = async (req, res) => {
    const { texto } = req.body;
    const { usuario } = req;

    if (!texto) {
        return res.status(404).json('O campo texto é obrigatório');
    }

    try {

        const queryPostagem = 'insert into postagens (usuario_id, texto) values ($1, $2)';

        const postagem = await conexao.query(queryPostagem, [usuario.id, texto])

        if (postagem.rowCount === 0) {
            return res.status(400).json('Não foi possível cadastrar a postagem');
        }

        return res.status(200).json('Postagem cadastrada com sucesso.');
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const atualizarPostagem = async (req, res) => {
    const { texto } = req.body;
    const { usuario } = req;
    const { id: idPostagem } = req.params;

    if (!texto) {
        return res.status(404).json('O campo texto é obrigatório');
    }

    try {
        const queryPostagemExistente = 'select * from postagens where id = $1 and usuario_id = $2';
        const postagemExistente = await conexao.query(queryPostagemExistente, [idPostagem, usuario.id]);

        if (postagemExistente.rowCount == 0) {
            return res.status(404).json('A postagem não foi encontrada!');
        }

        const queryPostagem = 'update postagens set texto = $1 where id = $2 and usuario_id = $3';

        const postagem = await conexao.query(queryPostagem, [texto, idPostagem, usuario.id])

        if (postagem.rowCount === 0) {
            return res.status(400).json('Não foi possível atualizar a postagem');
        }

        return res.status(200).json('Postagem atualizada com sucesso.');
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const excluirPostagem = async (req, res) => {
    const { usuario } = req;
    const { id } = req.params;

    try {
        const queryPostagemExistente = 'select * from postagens where id = $1 and usuario_id = $2';
        const postagemExistente = await conexao.query(queryPostagemExistente, [id, usuario.id]);

        if (postagemExistente.rowCount == 0) {
            return res.status(404).json('A postagem não foi encontrada!');
        }

        const { rowCount } = await conexao.query('delete from postagens where id = $1', [id]);

        if (rowCount == 0) {
            return res.status(404).json('Não foi possível excluir a postagem.');
        }

        return res.status(200).json('Postagem excluída com sucesso.');

    } catch (error) {
        return res.status(400).json(error.message);
    }
}
module.exports = {
    cadastarPostagem,
    atualizarPostagem,
    excluirPostagem,
    todasAsPostagens,
    postagensUsuario
}