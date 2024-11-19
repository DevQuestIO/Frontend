// src/scripts/test-keycloak.ts
const axios_ = require('axios');

interface OpenIDConfiguration {
  issuer: string;
  authorization_endpoint: string;
  token_endpoint: string;
}

async function testKeycloak(): Promise<boolean> {
  try {
    console.log('Testing Keycloak connection...');
    
    const response = await axios_.get(
      'http://localhost:8080/realms/devquest/.well-known/openid-configuration'
    );
    
    console.log('Keycloak is accessible!');
    console.log('Configuration:', {
      issuer: response.data.issuer,
      authorization_endpoint: response.data.authorization_endpoint,
      token_endpoint: response.data.token_endpoint
    });
    
    return true;
  } catch (error: any) {
    console.error('Keycloak connection failed:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
    return false;
  }
}

// Run the test
testKeycloak()
  .then(success => {
    if (success) {
      console.log('Test completed successfully');
    } else {
      console.log('Test failed');
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('Unexpected error:', error);
    process.exit(1);
  });