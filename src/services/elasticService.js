const { Client } = require('@elastic/elasticsearch');
const { elasticsearchUrl, elasticsearchIndex, elasticsearchQuery } = require('../config');

const esClient = new Client({ node: elasticsearchUrl });
const esIndex = elasticsearchIndex;
const esQuery = JSON.parse(elasticsearchQuery);

async function fetchData() {
    try {
        const { body } = await esClient.search({
            index : esIndex,
            body: esQuery
        });
        return body.hits.hits.map(hit => hit._source);
    } catch (error) {
        console.error("Error fetching data from Elasticsearch:", error);
        return [];
    }
}

module.exports = { fetchData };
