module.exports = (client) => {
    const canalId = "1519693757069393940" 
    // const canalId = "1466856212657340429" -- teste

    const frases = require("../../data/frases.json")

    async function enviarMensagem() {
        const canal = client.channels.cache.get(canalId)

        if(!canal) return;

        const frase =
            frases[Math.floor(Math.random() * frases.length)]

        canal.send(
            `"${frase.frase}
            - ${frase.autor}`
        )
    }

    function proximaMensagem(){
        const minimo = 12 * 60 * 60 * 1000;
        const maximo = 36 * 60 * 60 * 1000;

        const tempoAleatorio =
            Math.floor(
                Math.random() * (maximo - minimo)
            ) + minimo

        console.log(`proxima mensagem em ${tempoAleatorio / 1000/ 60/ 60} horas`)

        setTimeout(async () => {
            await enviarMensagem();
            proximaMensagem();

        }, tempoAleatorio)
    }
    //enviarMensagem();
    //proximaMensagem();
}