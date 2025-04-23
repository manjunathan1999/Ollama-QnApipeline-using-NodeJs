// const { fetchData } = require('../services/elasticService');
const { fetchData } = require('../services/opensearchService');
const ollamaService = require('../services/ollamaService');
const { saveQuestionsToFile } = require('../services/storageService');

async function runPipeline() {
    console.log("🔍 Fetching data from Elasticsearch...");
    const data = await fetchData();

    if (!data.length) {
        console.log("❌ No data found.");
        return;
    }

    console.log("🤖 Generating questions...");
    const questions = [];
    for (const item of data) {
        const question = await ollamaService.generateQuestion(item);
        if (question) {
            questions.push({question});
        }
    }

    console.log("💾 Saving questions...");
    saveQuestionsToFile(questions);
}

module.exports = { runPipeline };
