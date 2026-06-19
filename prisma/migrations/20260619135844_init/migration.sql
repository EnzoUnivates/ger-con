-- CreateTable
CREATE TABLE "Usuario" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "login" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "situacao" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Lancamento" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "descricao" TEXT NOT NULL,
    "data_lancamento" DATETIME NOT NULL,
    "valor" REAL NOT NULL,
    "tipo_lancamento" TEXT NOT NULL,
    "situacao" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_login_key" ON "Usuario"("login");
