
const { runPipeline } = require('./pipeline/questionPipeline');
const figlet = require('figlet');

(async () => {
    await figlet("NODE OLLAMA",{font:"ANSI Shadow"} ,function (err, data) {
        console.log("\n",data);
    });
    console.log("🚀 Starting Ollama pipeline...");
    await runPipeline();
    console.log("✅ Pipeline execution complete.");
})();


// const { Ollama } = require('ollama');
// const client = new Ollama({ host: 'http://192.168.1.10:11434' });

// async function runModel() {
//     const response = await client.chat({
//         model: 'phi3',
//         messages: [{ role: 'user', content: 'Hello from remote!' }],
//     });
//     console.log(response.message.content);
// }
// runModel();