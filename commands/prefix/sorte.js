const {EmbedBuilder} = require ("discord.js")

const {carregarStats, salvarStats, carregarWeeklyStats, salvarWeeklyStats} = require("../../systems/stats.js")

const {carregarColecoes, salvarColecoes} = require("../../data/colecoes")
const usos = new Map()

let colecoes = carregarColecoes()

function sortearRaridade(){
    const numero = Math.random()*100
    if (numero < 50) return "comum"
    if (numero < 75) return "rara"
    if (numero < 90) return "epica"
    if (numero < 97) return "lendaria"
    if (numero < 99.7) return "transcendente"
    return "god"
}

function obterCor(raridade){
    switch (raridade){
        case "comum": return 0x95a5a6 
        case "rara": return 0x3498db 
        case "epica": return 0x9b59b6 
        case "lendaria": return 0xf1c40f 
        case "transcendente": return 0xe67e22  
        case "god": return 0xff0055  
    }
}

function calcularXp(raridade){
    switch(raridade){
        case "comum": return 1
        case "rara": return 3
        case "epica": return 6
        case "lendaria": return 12
        case "transcendente": return 25
        case "god": return 100
    }
}

const niveis = [
    { nivel: 1, nome: "Aprendiz do Caos", xp: 20 },
    { nivel: 2, nome: "Manipulador", xp: 40 },
    { nivel: 3, nome: "Arquiteto", xp: 80 },
    { nivel: 4, nome: "Mestre das Apostas", xp: 100 },
    { nivel: 5, nome: "Observador do Destino", xp: 120 },
    { nivel: 6, nome: "Imperador do Acaso", xp: 160 },
    { nivel: 7, nome: "Entidade da Ruína", xp: 250 },
    { nivel: 8, nome: "The Fool", xp: 500 }
]

const cartas = require("../../data/tarotCards.json")

module.exports = {
    name: "sorte",
    aliases: ["horoscopo", "futuro"],

    async execute(message){
        const userId = message.author.id
        const hoje = new Date().toISOString().split("T")[0]

        if (usos.has(userId) && usos.get(userId) == hoje){
            return message.reply("🔮 Você já consultou as cartas hoje. Volte amanhã.")
        }

        usos.set(userId, hoje)

        const raridade = sortearRaridade()
        const cartasDaRaridade = cartas.filter(c => c.raridade == raridade)
        const carta = cartasDaRaridade[Math.floor(Math.random() * cartasDaRaridade.length)] 
        
        if (!colecoes[userId]){
            colecoes[userId] = {
                cartas: [],
                xp: 0,
                nivel: 0
            }
        }
        const xpGanho = calcularXp(raridade)

        const stats = carregarStats()
        const weeklyStats = carregarWeeklyStats();

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
        if(
            carta.raridade == "lendaria" ||
            carta.raridade == "transcendente" ||
            carta.raridade == "god"
        ){
            stats[userId].cartasRaras++
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
        }if(
            carta.raridade == "lendaria" ||
            carta.raridade == "transcendente" ||
            carta.raridade == "god"
        ){
            weeklyStats[userId].cartasRaras++
        }

        salvarWeeklyStats(weeklyStats)
        salvarStats(stats)

        colecoes[userId].cartas.push(carta)
        colecoes[userId].xp += xpGanho

        let nivelAtual = colecoes[userId].nivel
        let novoNivel = nivelAtual

        for(const n of niveis){
            if (colecoes[userId].xp >= n.xp){
                novoNivel = n.nivel
            }
        }
        if(novoNivel >nivelAtual){
            colecoes[userId].nivel = novoNivel

            message.channel.send(
                `🌟 ${message.author}, você evoluiu para **${niveis[novoNivel - 1].nome}**!`
            )
        }

        salvarColecoes(colecoes)

        const embed = new EmbedBuilder()
            .setTitle(`🔮 Carta Tirada: ${carta.nome}`)
            .setDescription(`${carta.emoji} ${carta.mensagem}`)
            .setFooter({ text: `Raridade: ${raridade.toUpperCase()}` })
            .setColor(obterCor(raridade))
            .setTimestamp();

        message.reply({embeds: [embed]})
    }
}