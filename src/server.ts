import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import PDFDocument from 'pdfkit';
import nodemailer from 'nodemailer';

// const erroPropositado = 123;
const app = express();
const prisma = new PrismaClient();
app.use(cors());
app.use(express.json());
app.use(express.static('./'));

// CRUD: Listagem com Filtros (Data inicial/final e Situação/Status)
app.get('/api/lancamentos', async (req, res) => {
  const { dataInicio, dataFim, situacao } = req.query;
  const where: any = {};

  if (dataInicio || dataFim) {
    where.data_lancamento = {};
    if (dataInicio) where.data_lancamento.gte = new Date(dataInicio as string);
    if (dataFim) where.data_lancamento.lte = new Date(dataFim as string);
  }
  if (situacao) {
    where.situacao = situacao as string;
  }

  const dados = await prisma.lancamento.findMany({ where });
  res.json(dados);
});

// CRUD: Adicionar
app.post('/api/lancamentos', async (req, res) => {
  const { descricao, data_lancamento, valor, tipo_lancamento, situacao } = req.body;
  const novo = await prisma.lancamento.create({
    data: { descricao, data_lancamento: new Date(data_lancamento), valor: Number(valor), tipo_lancamento, situacao }
  });
  res.status(201).json(novo);
});

// CRUD: Remover
app.delete('/api/lancamentos/:id', async (req, res) => {
  const { id } = req.params;
  await prisma.lancamento.delete({ where: { id: Number(id) } });
  res.status(204).send();
});

// Exportar para PDF
app.get('/api/lancamentos/pdf', async (req, res) => {
  const lancamentos = await prisma.lancamento.findMany();
  const doc = new PDFDocument();
  
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=lancamentos.pdf');
  doc.pipe(res);

  doc.fontSize(20).text('Relatório de Lançamentos', { align: 'center' }).moveDown();
  lancamentos.forEach(l => {
    doc.fontSize(12).text(`${l.data_lancamento.toISOString().split('T')[0]} - ${l.descricao}: R$ ${l.valor.toFixed(2)} (${l.tipo_lancamento}) [${l.situacao}]`);
  });

  doc.end();
});

// Enviar E-mail com informações
app.post('/api/lancamentos/email', async (req, res) => {
  const { emailDestino } = req.body;
  const lancamentos = await prisma.lancamento.findMany();

  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email', // Usando serviço fake para testes rápidos
    port: 587,
    auth: { user: 'test.user@ethereal.email', pass: 'test-password' }
  });

  const htmlContent = lancamentos.map(l => `<li>${l.descricao} - R$ ${l.valor}</li>`).join('');

  await transporter.sendMail({
    from: '"Sistema Financeiro" <noreply@finance.com>',
    to: emailDestino,
    subject: 'Resumo de Lançamentos Finanças',
    html: `<h3>Lista de Lançamentos:</h3><ul>${htmlContent}</ul>`
  });

  res.json({ message: 'E-mail enviado com sucesso!' });
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));