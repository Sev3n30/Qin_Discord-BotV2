const {carregarStats, salvarStats, carregarWeeklyStats, salvarWeeklyStats} = require("../../systems/stats.js")

module.exports = {
    name: "messageCreate",

    async execute(message, client) {

        //console.log(`${message.author.username} mandou mensagem`)

        const diceRegex = /^!\d+#?d\d+$/i

        if (diceRegex.test(message.content)){
            const comando = client.prefixCommands.get("dado")

            if(comando){
                return comando.execute(message)
            }
        }

        const prefix = "!";

        if (message.author.bot) return;

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

        weeklyStats[userId].mensagens++;
        stats[userId].mensagens++;

        salvarWeeklyStats(weeklyStats)
        salvarStats(stats)

        if (!message.content.startsWith(prefix)) return;

        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        const command = client.prefixCommands.get(commandName) || client.prefixCommands.find(cmd => cmd.aliases?.includes(commandName));
        if (!command) return;

        try {
            await command.execute(message, args);
        } catch (error) {
            console.error(error);
            message.reply("Erro ao executar o comando.");
        }
    }
};
