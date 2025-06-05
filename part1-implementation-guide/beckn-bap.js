const express = require('express');
const axios = require('axios');
const crypto = require('crypto');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Beckn BAP Configuration
const BAP_CONFIG = {
  bap_id: "farmer-app.openagri.network",
  bap_uri: "https://farmer-app.openagri.network/beckn",
  gateway_url: "https://uki-gateway.becknprotocol.io",
  private_key: process.env.BECKN_PRIVATE_KEY,
  public_key: process.env.BECKN_PUBLIC_KEY
};

// Utility Functions
function generateTransactionId() {
  return `txn_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
}

function generateMessageId() {
  return `msg_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
}

function createBecknContext(action, transaction_id = null, bpp_id = null, bpp_uri = null) {
  return {
    domain: "agri-soil-testing",
    action: action,
    version: "1.2.0",
    bap_id: BAP_CONFIG.bap_id,
    bap_uri: BAP_CONFIG.bap_uri,
    ...(bpp_id && { bpp_id }),
    ...(bpp_uri && { bpp_uri }),
    transaction_id: transaction_id || generateTransactionId(),
    message_id: generateMessageId(),
    timestamp: new Date().toISOString(),
    location: {
      country: { code: "IND" },
      city: { code: "BLR" }
    }
  };
}

// Beckn API Endpoints

// 1. Search for Soil Testing Services
app.post('/api/beckn/search', async (req, res) => {
  try {
    const { location, testType, farmerDetails } = req.body;
    
    const searchPayload = {
      context: createBecknContext("search"),
      message: {
        intent: {
          item: {
            descriptor: {
              name: testType || "Soil Testing Services"
            },
            category_id: "soil-analysis"
          },
          fulfillment: {
            type: "pickup",
            start: {
              location: {
                gps: location.gps,
                address: {
                  area_code: location.pincode,
                  locality: location.district,
                  city: location.city,
                  state: location.state
                }
              }
            }
          },
          payment: {
            type: "ON-FULFILLMENT"
          }
        }
      }
    };

    console.log('Beckn Search Payload:', JSON.stringify(searchPayload, null, 2));

    // Send to Beckn Gateway
    const response = await axios.post(`${BAP_CONFIG.gateway_url}/search`, searchPayload, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${BAP_CONFIG.public_key}`
      }
    });

    res.json({
      success: true,
      transaction_id: searchPayload.context.transaction_id,
      message: "Search request sent to Beckn network",
      beckn_response: response.data
    });

  } catch (error) {
    console.error('Beckn Search Error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      message: "Failed to search soil testing services"
    });
  }
});

// 2. Handle on_search responses
app.post('/beckn/on_search', async (req, res) => {
  try {
    const { context, message } = req.body;
    
    console.log('Received on_search:', JSON.stringify(req.body, null, 2));
    
    // Store search results (in production, use database)
    global.searchResults = global.searchResults || {};
    global.searchResults[context.transaction_id] = {
      providers: message.catalog['bpp/providers'],
      timestamp: new Date().toISOString()
    };

    res.json({ message: { ack: { status: "ACK" } } });
  } catch (error) {
    console.error('on_search Error:', error);
    res.status(500).json({ message: { ack: { status: "NACK" } } });
  }
});

// 3. Get Search Results
app.get('/api/beckn/search-results/:transaction_id', (req, res) => {
  const { transaction_id } = req.params;
  const results = global.searchResults?.[transaction_id];
  
  if (results) {
    res.json({
      success: true,
      providers: results.providers,
      timestamp: results.timestamp
    });
  } else {
    res.json({
      success: false,
      message: "No results found for this transaction"
    });
  }
});

// 4. Select Service
app.post('/api/beckn/select', async (req, res) => {
  try {
    const { transaction_id, provider_id, item_id, bpp_id, bpp_uri, customer_details } = req.body;

    const selectPayload = {
      context: createBecknContext("select", transaction_id, bpp_id, bpp_uri),
      message: {
        order: {
          provider: { id: provider_id },
          items: [
            {
              id: item_id,
              quantity: { count: 1 }
            }
          ],
          fulfillment: {
            type: "pickup",
            start: {
              location: {
                gps: customer_details.location.gps,
                address: {
                  name: `${customer_details.name}'s Farm`,
                  locality: customer_details.district,
                                    city: customer_details.city || customer_details.district,
                  state: customer_details.state,
                  area_code: customer_details.pincode || "000000"
                }
              },
              contact: {
                phone: customer_details.phone,
                email: customer_details.email
              }
            }
          }
        }
      }
    };

    console.log('Beckn Select Payload:', JSON.stringify(selectPayload, null, 2));

    const response = await axios.post(`${bpp_uri}/select`, selectPayload, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${BAP_CONFIG.public_key}`
      }
    });

    res.json({
      success: true,
      transaction_id: selectPayload.context.transaction_id,
      message: "Service selection sent",
      beckn_response: response.data
    });

  } catch (error) {
    console.error('Beckn Select Error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 5. Confirm Order
app.post('/api/beckn/confirm', async (req, res) => {
  try {
    const { transaction_id, order_details, bpp_id, bpp_uri } = req.body;

    const confirmPayload = {
      context: createBecknContext("confirm", transaction_id, bpp_id, bpp_uri),
      message: {
        order: {
          id: `order_${Date.now()}`,
          provider: { id: order_details.provider_id },
          items: order_details.items,
          billing: order_details.billing,
          fulfillment: order_details.fulfillment,
          payment: {
            type: "ON-FULFILLMENT",
            params: {
              amount: order_details.total_amount,
              currency: "INR"
            }
          }
        }
      }
    };

    console.log('Beckn Confirm Payload:', JSON.stringify(confirmPayload, null, 2));

    const response = await axios.post(`${bpp_uri}/confirm`, confirmPayload, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${BAP_CONFIG.public_key}`
      }
    });

    res.json({
      success: true,
      order_id: confirmPayload.message.order.id,
      transaction_id: transaction_id,
      message: "Order confirmed successfully",
      beckn_response: response.data
    });

  } catch (error) {
    console.error('Beckn Confirm Error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Beckn BAP Server running on port ${PORT}`);
  console.log(`📡 Gateway URL: ${BAP_CONFIG.gateway_url}`);
  console.log(`🆔 BAP ID: ${BAP_CONFIG.bap_id}`);
});

module.exports = app;

