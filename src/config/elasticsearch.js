const { Client } = require('@elastic/elasticsearch');
const client = new Client({
  node: 'https://38b39a8816f14b4fbf89d45ae4d294b1.us-central1.gcp.cloud.es.io:443',
  auth: {
      apiKey: 'u09HF3eFRwmkVtr_qG8WGA'
  }
});