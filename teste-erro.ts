function testarLinter() {
    const usuarioLogado = "Enzo"; 
    const variavelInutil = 42; // Variável declarada mas nunca usada

    //  Uso de '==' em vez de '===' (comparação insegura de tipo)
    if (usuarioLogado == "Enzo") {
        console.log("Usuário correto"); // Uso de console.log
    }

}