const fs = require('fs');
const { outputFile } = require('../config/config');

function saveQuestionsToFile(questions) {
    fs.readFile(outputFile, 'utf8', (err, data) => {
        if (err) {
            console.error("Failed to read file:", err);
            return;
        }
        try {
            const json = data ? JSON.parse(data) : { questions: [] };
            if (!json.questions) {
                json.questions = [];
            }
            if (Array.isArray(questions)) {
                const formattedQuestions = questions.map(q => typeof q === 'object' ? q.question : q);
                json.questions.push(...formattedQuestions);
            } else {
                console.error("Expected 'questions' to be an array.");
                return;
            }
            fs.writeFileSync(outputFile, JSON.stringify(json, null, 2), err => {
                if (err) {
                    console.error("Failed to write file:", err);
                } else {
                    console.log("✅ Data appended successfully.");
                }
            });
        } catch (parseError) {
            console.error("Error parsing JSON:", parseError);
        }
    });
}

module.exports = { saveQuestionsToFile };