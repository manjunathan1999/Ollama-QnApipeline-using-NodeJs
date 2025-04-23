const { Client } = require('@opensearch-project/opensearch');
const { AppConfigProvider } = require('../config/config');

class OpenSearchService {
    constructor() {
        this.client = null;
        this.index = null;
        this.initialized = false;
        this.initializationPromise = null;
    }

    async initialize() {
        if (this.initialized) return;
        if (this.initializationPromise) return this.initializationPromise;

        this.initializationPromise = (async () => {
            try {
                const appConfigProvider = new AppConfigProvider();
                const configManager = appConfigProvider.getConfigManager();

                const [hostConfig, indexConfig] = await Promise.all([
                    configManager.getConfig('opensearch.host'),
                    configManager.getConfig('opensearch.index')
                ]);

                this.client = new Client({
                    node: hostConfig.value,
                    auth: { username: 'admin', password: 'Nebula=2020' },
                    ssl: { rejectUnauthorized: false }
                });

                this.index = indexConfig.value;
                this.initialized = true;
                console.log('OpenSearch client initialized');
            } catch (error) {
                console.error('OpenSearch initialization failed:', error);
                throw error;
            }
        })();

        return this.initializationPromise;
    }

    async fetchData() {
        if (!this.initialized) {
            await this.initialize();
        }

        try {
            const response = await this.client.search({
                index: this.index,
                size: 1,
                body: {
                    query: {
                        match_all: {}
                    }
                }
            });
            return response.body.hits.hits.map(hit => hit._source);
        } catch (error) {
            console.error("Error fetching data from OpenSearch:", error);
            throw error;
        }
    }
}

// Singleton instance
const openSearchService = new OpenSearchService();

// Export wrapper functions
module.exports = {
    fetchData: async () => {
        try {
            return await openSearchService.fetchData();
        } catch (error) {
            console.error("Error in fetchData:", error);
            return [];
        }
    }
};