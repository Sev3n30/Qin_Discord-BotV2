const { EmbedBuilder, AttachmentBuilder } = require("discord.js")

const formatarTempo = require("./formatarTempo")
const obterTop = require("./obterTop")

const stats = require("../weeklyStats.json")

module.exports = (client) => {
    const canalId = "1466856212657340429"

    const titulos = require("../weeklyReport/titulosAleatorios.json")

    async function enviarRanking() {
        const canal = client.channels.cache.get(canalId)

        await canal.guild.members.fetch()

        const membrosArray = [...canal.guild.members.cache.values()]

        const membroAleatorio = membrosArray[Math.floor(Math.random() * membrosArray.length)]

        if(!canal) return

        const topMensagens = obterTop(stats, "mensagens")
        const topDados = obterTop(stats, "dadosRolados")
        const topMoedas = obterTop(stats, "moedasJogadas")
        const topCall = obterTop(stats, "tempoCall")
        const topCartas = obterTop(stats, "cartasRaras")
        //desafiosGanhos

        const userMensagens = await client.users.fetch(topMensagens.userId)
        const userDados = await client.users.fetch(topDados.userId)
        const userMoedas = await client.users.fetch(topMoedas.userId)
        const userCall = await client.users.fetch(topCall.userId)
        const userCartas = await client.users.fetch(topCartas.userId)

        const tituloAleatorio = titulos[Math.floor(Math.random() * titulos.length)]

        const thumbnail = new AttachmentBuilder("img/sunshine/sunshine_chibi_perfil.png")
        const icon = new AttachmentBuilder("img/sunshine/sunshine_eyes-zoom.png")

        const embed = new EmbedBuilder()
            .setAuthor({name:"Sunshine", iconURL: "attachment://sunshine_eyes-zoom.png", url: "https://github.com/Sev3n30/portfolio"})
            .setThumbnail("attachment://sunshine_chibi_perfil.png")
            .setColor(0xf1c40f)
            .setTitle("📜 Weekly Report — Sunshine")
            .setDescription("Estatísticas, apostas, obsessões e decisões duvidosas. Uma semana comum.")

            .addFields(
                {
                    name: "Mais ativo",
                    value: `${userMensagens.username} - ${topMensagens.valor} mensagens`
                },
                {
                    name: "mestre dos Dados",
                    value: `${userDados.username} - ${topDados.valor} dados`
                },
                {
                    name: "Viciado em apostas",
                    value: `${userMoedas.username} - ${topMoedas.valor} moedas`
                },
                {
                    name: "O colecionador",
                    value: `${userCartas.username} - ${topCartas.valor} cartas`
                },
                {
                    name: "Morador das calls",
                    value: `${userCall.username} - ${formatarTempo(topCall.valor)}`
                },
                {
                    name: `${tituloAleatorio}`,
                    value: `${membroAleatorio.user.username}`
                }
            )
            .setFooter({text: "You know I can see all of this, right?"})

            .setTimestamp()

            canal.send({embeds: [embed], files:[thumbnail, icon]})
        }

    function calcularSabado(){
        const agora = new Date()
        const proximoSabado = new Date()

        const diasAteSabado = (6 - agora.getDay() + 7) % 7

        proximoSabado.setDate(
            agora.getDate() + diasAteSabado
        )

        proximoSabado.setHours(15, 0, 0, 0)

        if(proximoSabado <= agora){
            proximoSabado.setDate(
                proximoSabado.getDate() + 7
            )
        }
        return proximoSabado
    }
    

    function iniciarWeeklyReport(){
        const agora = new Date()

        const proximoSabado = calcularSabado()

        const tempoRestante = proximoSabado.getTime() - agora.getTime()
        //const tempoRestante = 5000

        console.log(`WeeklyReport agendado para ${proximoSabado}`)

        setTimeout(async() =>{
            await enviarRanking()

            iniciarWeeklyReport()
        }, tempoRestante)
    }
    iniciarWeeklyReport()
}