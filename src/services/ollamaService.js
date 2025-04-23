const { Ollama } = require('ollama');
const { AppConfigProvider } = require('../config/config');

class OllamaService {
    constructor() {
        this.client = null;
        this.ollamaHost = null;
        this.ollamaModel = null;
        this.initialized = false;
    }

    async initialize() {
        if (this.initialized) return;

        try {
            const appConfigProvider = new AppConfigProvider();
            const configManager = appConfigProvider.getConfigManager();

            const [hostConfig, modelConfig] = await Promise.all([
                configManager.getConfig('ollama.host'),
                configManager.getConfig('ollama.model')
            ]);

            this.ollamaHost = hostConfig.value;
            this.ollamaModel = modelConfig.value;
            this.client = new Ollama({ host: this.ollamaHost });
            this.initialized = true;
            console.log('Ollama service initialized');
        } catch (error) {
            console.error('Initialization failed:', error);
            throw error;
        }
    }

    async generateQuestion(data) {
        if (!this.initialized) {
            await this.initialize();
        }

        try {
            const response = await this.client.chat({
                model: this.ollamaModel,
                messages: [
                    { 
                        role: "system", 
                        content: "You are an AI that generates questions based on input data. " +
                                "The question should be relevant and in the form of a short question."
                    },
                    { 
                        role: "user", 
                        content: `Generate a question for this data: ${JSON.stringify(data)}` 
                    }
                ]
            });
            return response.message?.content || null;
        } catch (error) {
            console.error("Ollama API Error:", error);
            throw error;
        }
    }
}

// Export singleton instance without top-level await
module.exports = new OllamaService();