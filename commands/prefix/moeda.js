const { EmbedBuilder } = require("discord.js")
const { carregarStats, salvarStats, carregarWeeklyStats, salvarWeeklyStats} = require("../../systems/stats")

module.exports = {
    name: "moeda", 

    async execute(message){
        const resultado = Math.random() < 0.5? "Cara 🪙" : "Coroa 🪙"

        const embed = new EmbedBuilder()
            .setTitle(" Jogando a moeda... ")
            .setDescription(`Resultado: **${resultado}**`)
            .setThumbnail("https://cdn.pixabay.com/animation/2025/06/03/03/30/03-30-33-674_512.gif")
            .setColor(0xffd700)
            .setTimestamp()

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

        weeklyStats[userId].moedasJogadas++;
        stats[userId].moedasJogadas++;

        salvarWeeklyStats(weeklyStats)
        salvarStats(stats)

        message.reply({embeds: [embed]})
    }
}