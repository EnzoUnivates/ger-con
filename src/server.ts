import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import PDFDocument from 'pdfkit';
import nodemailer from 'nodemailer';

//const erroFalha =  
const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());
app.use(express.static('./'));


app.get('/api/lancamentos', async (req, res) => {
  try {
    const { dataInicio, dataFim, situacao } = req.query;
    const where: any = {};

    if (dataInicio || dataFim) {
      where.data_lancamento = {};

      if (dataInicio) {
        where.data_lancamento.gte = new Date(dataInicio as string);
      }

      if (dataFim) {
        where.data_lancamento.lte = new Date(dataFim as string);
      }
    }

    if (situacao) {
      where.situacao = situacao as string;
    }

    const dados = await prisma.lancamento.findMany({ where });

    res.json(dados);

  } catch (error: any) {
    console.error("Erro GET:", error);

    res.status(500).json({
      erro: error.message
    });
  }
});


app.post('/api/lancamentos', async (req, res) => {
  try {
    const {
      descricao,
      data_lancamento,
      valor,
      tipo_lancamento,
      situacao
    } = req.body;

    console.log("BODY RECEBIDO:", req.body);

    if (!descricao || !valor || !tipo_lancamento || !data_lancamento) {
      return res.status(400).json({
        erro: "Campos obrigatórios faltando"
      });
    }

    const dataConvertida = new Date(data_lancamento);

    if (isNaN(dataConvertida.getTime())) {
      return res.status(400).json({
        erro: "Data inválida"
      });
    }

    const novo = await prisma.lancamento.create({
      data: {
        descricao,
        data_lancamento: dataConvertida,
        valor: Number(valor),
        tipo_lancamento,
        situacao: situacao || "PENDENTE"
      }
    });

    res.status(201).json(novo);

  } catch (error: any) {
    console.error("Erro POST:", error);

    res.status(500).json({
      erro: error.message
    });
  }
});


app.delete('/api/lancamentos/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.lancamento.delete({
      where: {
        id: Number(id)
      }
    });

    res.status(204).send();

  } catch (error: any) {
    console.error("Erro DELETE:", error);

    res.status(500).json({
      erro: error.message
    });
  }
});


app.get('/api/lancamentos/pdf', async (req, res) => {
  try {
    const lancamentos = await prisma.lancamento.findMany();

    const doc = new PDFDocument();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=lancamentos.pdf'
    );

    doc.pipe(res);

    doc
      .fontSize(20)
      .text('Relatório de Lançamentos', {
        align: 'center'
      })
      .moveDown();

    lancamentos.forEach(l => {
      doc.fontSize(12).text(
        `${l.data_lancamento.toISOString().split('T')[0]} - ${l.descricao}: R$ ${l.valor.toFixed(2)} (${l.tipo_lancamento}) [${l.situacao}]`
      );
    });

    doc.end();

  } catch (error: any) {
    console.error("Erro PDF:", error);

    res.status(500).json({
      erro: error.message
    });
  }
});


app.post('/api/lancamentos/email', async (req, res) => {
  try {
    const { emailDestino } = req.body;

    if (!emailDestino) {
      return res.status(400).json({
        erro: "Email não informado"
      });
    }

    const lancamentos = await prisma.lancamento.findMany();

    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: 'test.user@ethereal.email',
        pass: 'test-password'
      }
    });

    const htmlContent = lancamentos
      .map(l => `<li>${l.descricao} - R$ ${l.valor}</li>`)
      .join('');

    await transporter.sendMail({
      from: '"Sistema Financeiro" <noreply@finance.com>',
      to: emailDestino,
      subject: 'Resumo Financeiro',
      html: `
        <h3>Lista de lançamentos:</h3>
        <ul>${htmlContent}</ul>
      `
    });

    res.json({
      message: "E-mail enviado"
    });

  } catch (error: any) {
    console.error("Erro EMAIL:", error);

    res.status(500).json({
      erro: error.message
    });
  }
});

app.post('/api/usuarios', async (req, res) => {
  try {
    const { login, senha, nome, situacao } = req.body;

    if (!login || !senha) {
      return res.status(400).json({
        mensagem: "Login e senha obrigatórios"
      });
    }

    // verifica se usuário já existe
    const existente = await prisma.usuario.findUnique({
      where: { login }
    });

    if (existente) {
      return res.status(400).json({
        mensagem: "Usuário já existe"
      });
    }

    const usuario = await prisma.usuario.create({
      data: {
        login,
        senha,
        nome: nome || login,
        situacao: situacao || "ATIVO"
      }
    });

    res.status(201).json({
      mensagem: "Usuário criado com sucesso",
      usuario
    });

  } catch (error: any) {
    console.error("Erro cadastro:", error);

    res.status(500).json({
      mensagem: error.message
    });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { login, senha } = req.body;

    if (!login || !senha) {
      return res.status(400).json({
        mensagem: "Login e senha obrigatórios"
      });
    }

    const usuario = await prisma.usuario.findUnique({
      where: { login }
    });

    if (!usuario) {
      return res.status(401).json({
        mensagem: "Usuário não encontrado"
      });
    }

    if (usuario.senha !== senha) {
      return res.status(401).json({
        mensagem: "Senha incorreta"
      });
    }

    if (usuario.situacao !== "ATIVO") {
      return res.status(403).json({
        mensagem: "Usuário inativo"
      });
    }

    res.json({
      mensagem: "Login realizado com sucesso",
      usuario: {
        id: usuario.id,
        login: usuario.login,
        nome: usuario.nome
      }
    });

  } catch (error: any) {
    console.error("Erro login:", error);

    res.status(500).json({
      mensagem: error.message
    });
  }
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});