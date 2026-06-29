const {carregarStats, salvarStats, carregarWeeklyStats, salvarWeeklyStats} = require("../../systems/stats.js")

module.exports = {
    name: "voiceStateUpdate",

    async execute(oldState, newState, client){
        const member = newState.member

        if(member.user.bot) return

        const userId = member.id
        const weeklyStats = carregarWeeklyStats()
        const stats = carregarStats()

        if(!stats[userId]){
            stats[userId] = {
                mensagens: 0,
                dadosRolados: 0,
                moedasJogadas: 0,
                tempoCall: 0,
                cartasRaras: 0,
                desafiosGanhos: 0,
                callStart: null
            }
        }
        if(!weeklyStats[userId]){
            weeklyStats[userId] = {
                mensagens: 0,
                dadosRolados: 0,
                moedasJogadas: 0,
                tempoCall: 0,
                cartasRaras: 0,
                desafiosGanhos: 0,
                callStart: null
            }
        }

        if(!oldState.channel && newState.channel){

            console.log(`${member.user.username} entrou na call`)

            stats[userId].callStart = Date.now()
            weeklyStats[userId].callStart = Date.now()

            salvarStats(stats)
            salvarWeeklyStats(weeklyStats)

            return
        }
        if(oldState.channel && !newState.channel){

            console.log(`${member.user.username} saiu da call`)

            const inicioStats = stats[userId].callStart
            const inicioWeekly = weeklyStats[userId].callStart

            if(inicioStats && inicioWeekly){
                const tempoNaCallStats = Date.now() - inicioStats
                const tempoNaCallWeekly = Date.now() - inicioWeekly

                stats[userId].tempoCall += tempoNaCallStats
                weeklyStats[userId].tempoCall += tempoNaCallWeekly

                stats[userId].callStart = null
                weeklyStats[userId].callStart = null

                salvarStats(stats)
                salvarWeeklyStats(weeklyStats)

                console.log(`Tempo adicionado: ${tempoNaCallWeekly}ms`)
            }
        }
    }
}