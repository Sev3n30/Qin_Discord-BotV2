const {carregarStats, salvarStats, carregarWeeklyStats, salvarWeeklyStats} = require("../../systems/stats.js")

module.exports = {
    name: "dado",

    async execute(message){
        
        const input = message.content.slice(1).toLowerCase()
        const separar = input.includes("#")
        const limpo = input.replace("#", "")

        if(!limpo.includes("d")){
            return message.reply("Formato Invalido, use !ndx ou !n#dx")
        }

        const [quantidade, lados] = limpo.split("d").map(Number)

        if (!quantidade || !lados) return message.reply("Valores Invalidos")

        let resultados = []

        for (let i = 0; i < quantidade; i++){
            resultados.push(Math.floor(Math.random()* lados)+ 1)
        }

        const stats = carregarStats();
        const weeklyStats = carregarWeeklyStats();
        const userId = message.author.id;

        if(!stats[userId]){
            stats[userId] = {
                mensagens: 0,
                dadosRolados: 0,
                moedasJogadas: 0,
                tempoCall: 0,
                cartasRaras: 0,
                desafiosGanhos: 0
            }
        }
        if(!weeklyStats[userId]){
            weeklyStats[userId] = {
                mensagens: 0,
                dadosRolados: 0,
                moedasJogadas: 0,
                tempoCall: 0,
                cartasRaras: 0,
                desafiosGanhos: 0
            }
        }

        weeklyStats[userId].dadosRolados++;
        stats[userId].dadosRolados++;

        salvarWeeklyStats(weeklyStats)
        salvarStats(stats)

        if (separar){
            return message.reply(`Resultados: \n ${resultados.join("\n")}`)
        } else {
            const soma = resultados.reduce((a, b) => a+b, 0)
            return message.reply(`Resultado total: **${soma}**`)
        }
    }
}