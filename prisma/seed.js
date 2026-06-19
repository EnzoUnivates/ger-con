"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    // Popular Usuário
    await prisma.usuario.upsert({
        where: { login: 'admin' },
        update: {},
        create: {
            nome: 'Administrador Padrão',
            login: 'admin',
            senha: 'password123',
            situacao: 'ATIVO',
        },
    });
    // Popular 10 Lançamentos
    const lancamentos = [
        { descricao: 'Salário Mensal', data_lancamento: new Date('2026-06-01'), valor: 5000.0, tipo_lancamento: 'RECEITA', situacao: 'PAGO' },
        { descricao: 'Aluguel', data_lancamento: new Date('2026-06-05'), valor: 1200.0, tipo_lancamento: 'DESPESA', situacao: 'PAGO' },
        { descricao: 'Supermercado', data_lancamento: new Date('2026-06-06'), valor: 450.50, tipo_lancamento: 'DESPESA', situacao: 'PAGO' },
        { descricao: 'Freelance Design', data_lancamento: new Date('2026-06-10'), valor: 800.0, tipo_lancamento: 'RECEITA', situacao: 'PAGO' },
        { descricao: 'Conta de Luz', data_lancamento: new Date('2026-06-12'), valor: 150.0, tipo_lancamento: 'DESPESA', situacao: 'PENDENTE' },
        { descricao: 'Conta de Internet', data_lancamento: new Date('2026-06-15'), valor: 99.90, tipo_lancamento: 'DESPESA', situacao: 'PAGO' },
        { descricao: 'Academia', data_lancamento: new Date('2026-06-16'), valor: 110.0, tipo_lancamento: 'DESPESA', situacao: 'PAGO' },
        { descricao: 'Venda de Monitor antigo', data_lancamento: new Date('2026-06-18'), valor: 350.0, tipo_lancamento: 'RECEITA', situacao: 'PAGO' },
        { descricao: 'Manutenção Carro', data_lancamento: new Date('2026-06-20'), valor: 600.0, tipo_lancamento: 'DESPESA', situacao: 'PENDENTE' },
        { descricao: 'Assinatura Streaming', data_lancamento: new Date('2026-06-21'), valor: 55.90, tipo_lancamento: 'DESPESA', situacao: 'PENDENTE' },
    ];
    for (const l of lancamentos) {
        await prisma.lancamento.create({ data: l });
    }
}
main().catch(e => console.error(e)).finally(async () => { await prisma.$disconnect(); });
