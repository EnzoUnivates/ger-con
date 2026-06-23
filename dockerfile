FROM node:22-alpine

WORKDIR /app

# Copia arquivos de configuração de dependências
COPY package*.json ./
COPY prisma ./prisma/

# Instala todas as dependências e gera o Prisma Client
RUN npm install

# Copia o restante do código fonte
COPY . .

# Compila o TypeScript para JavaScript puro (gerando a pasta dist)
RUN npm run build

# Expõe a porta padrão que configuramos no Express
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["npm", "start"]