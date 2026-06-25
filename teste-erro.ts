function testarLinter() {
    const usuarioLogado = "Enzo"; 
    const variavelInutil = 42; // ❌ ERRO 1: Variável declarada mas nunca usada

    // ❌ ERRO 2: Uso de '==' em vez de '===' (comparação insegura de tipo)
    if (usuarioLogado == "Enzo") {
        console.log("Usuário correto"); // ⚠️ AVISO: Uso de console.log
    }

    // ❌ ERRO 3: Atribuição de tipo incorreta (Burla o TypeScript se não tipado)
    let total: number = "texto"; 
    return total;
}