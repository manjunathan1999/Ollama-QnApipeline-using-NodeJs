const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class AppConfig {
    constructor(key, value, description, category, isEncrypted) {
        this.key = key;
        this.value = value;
        this.description = description;
        this.category = category;
        this.isEncrypted = isEncrypted;
    }
}

class AppConfigProvider {
    constructor() {
        const nebulaHome = process.env.NEBULA_HOME;
        if (!nebulaHome) {
            throw new Error("NEBULA_HOME environment variable is not defined");
        }
        this.dbPath = path.join(nebulaHome, 'NodeOllama.db');
    }

    getConfigManager() {
        return new AppConfigManager(this.dbPath);
    }
}

class AppConfigManager {
    constructor(dbPath) {
        this.dbPath = dbPath;
        this.db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
            if (err) {
                console.error(err.message);
                throw new Error("Failed to connect to the database.");
            }
            console.log("Connected to the SQLite database.");
        });
    }

    getConfig(key) {
        return new Promise((resolve, reject) => {
            this.db.get("SELECT * FROM appconfig WHERE key = ?", [key], (err, row) => {
                if (err) {
                    reject(err);
                } else if (row) {
                    resolve(new AppConfig(row.key, row.value, row.description, row.category, row.isEncrypted));
                } else {
                    reject(new Error(`No configuration found for key: ${key}`));
                }
            });
        });
    }

    getConfigByCategory(category) {
        return new Promise((resolve, reject) => {
            this.db.all("SELECT key, value, description, category, isEncrypted FROM appconfig WHERE category = ?", [category], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    const configs = rows.map(row => new AppConfig(row.key, row.value, row.description, row.category, row.isEncrypted));
                    resolve(configs);
                }
            });
        });
    }

    close() {
        this.db.close((err) => {
            if (err) {
                console.error(err.message);
            }
            console.log("Closed the database connection.");
        });
    }
}

// Export the classes
// module.exports = {
//     AppConfigProvider
// };

module.exports = {
    AppConfigProvider,
    // elasticsearchUrl: "http://192.168.1.232:9200",
    // elasticsearchIndex : "nebulastore",
    // elasticsearchQuery: "{}",

    // opensearchUrl: "https://localhost:9200",
    // opensearchIndex : "nebulastore",

    // ollamaHost: "http://192.168.1.10:11434",
    // ollamaModel: "phi3",
    outputFile: "./knowledgeconfig/knowledge_questions.json"
};