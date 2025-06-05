const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Mock BPP Configuration
const BPP_CONFIG = {
    bpp_id: "krishi-kendra.soil-labs.network",
    bpp_uri: "http://localhost:3002/beckn",
    name: "ABC Soil Testing Lab",
    services: [
        {
            id: "soil_test_basic",
            name: "Basic NPK Soil Test",
            description: "NPK analysis with pH testing",
            price: "500",
            duration: "48 hours"
        },
        {
            id: "soil_test_premium",
            name: "Premium Soil Analysis",
            description: "Complete soil health report with recommendations",
            price: "1200",
            duration: "72 hours"
        }
    ]
};

// Mock BPP Endpoints

// Handle search requests
app.post('/beckn/search', (req, res) => {
    console.log('🔍 BPP received search request:', JSON.stringify(req.body, null, 2));
    
    // Simulate processing delay
    setTimeout(() => {
        const searchResponse = {
            context: {
                ...req.body.context,
                action: "on_search",
                bpp_id: BPP_CONFIG.bpp_id,
                bpp_uri: BPP_CONFIG.bpp_uri,
                message_id: `msg_${Date.now()}_on_search`,
                timestamp: new Date().toISOString()
            },
            message: {
                catalog: {
                    "bpp/descriptor": {
                        name: BPP_CONFIG.name,
                        short_desc: "Certified soil testing services",
                        long_desc: "Professional soil analysis with NPK testing, pH analysis, and crop recommendations"
                    },
                    "bpp/providers": [
                        {
                            id: "provider_001",
                            descriptor: {
                                name: "Krishi Kendra Soil Services",
                                short_desc: "Premium soil testing lab"
                            },
                            locations: [
                                {
                                    id: "loc_001",
                                    gps: "12.9716,77.5946",
                                    address: {
                                        locality: "Whitefield",
                                        city: "Bangalore",
                                        state: "Karnataka",
                                        area_code: "560066"
                                    }
                                }
                            ],
                            items: BPP_CONFIG.services.map(service => ({
                                id: service.id,
                                descriptor: {
                                    name: service.name,
                                    short_desc: service.description,
                                    long_desc: service.description
                                },
                                category_id: "soil-analysis",
                                price: {
                                    currency: "INR",
                                    value: service.price
                                },
                                fulfillment_id: "fulfillment_001",
                                time: {
                                    label: "Processing Time",
                                    duration: service.duration
                                }
                            })),
                            fulfillments: [
                                {
                                    id: "fulfillment_001",
                                    type: "pickup",
                                    start: {
                                        time: {
                                            range: {
                                                start: new Date(Date.now() + 24*60*60*1000).toISOString(),
                                                end: new Date(Date.now() + 7*24*60*60*1000).toISOString()
                                            }
                                        }
                                    },
                                    end: {
                                        time: {
                                            range: {
                                                start: new Date(Date.now() + 2*24*60*60*1000).toISOString(),
                                                end: new Date(Date.now() + 5*24*60*60*1000).toISOString()
                                            }
                                        }
                                    }
                                }
                            ]
                        }
                    ]
                }
            }
        };
        
        console.log('📤 BPP sending on_search response');
        
        // Send response back to BAP
        // In real implementation, this would be sent to the BAP's callback URL
        res.json(searchResponse);
        
    }, 1000); // 1 second delay to simulate processing
});

// Handle select requests
app.post('/beckn/select', (req, res) => {
    console.log('🎯 BPP received select request:', JSON.stringify(req.body, null, 2));
    
    const selectResponse = {
        context: {
            ...req.body.context,
            action: "on_select",
            message_id: `msg_${Date.now()}_on_select`,
            timestamp: new Date().toISOString()
        },
        message: {
            order: {
                provider: req.body.message.order.provider,
                items: req.body.message.order.items.map(item => ({
                    ...item,
                    price: {
                        currency: "INR",
                        value: BPP_CONFIG.services.find(s => s.id === item.id)?.price || "500"
                    }
                })),
                fulfillment: {
                    ...req.body.message.order.fulfillment,
                    id: "fulfillment_001",
                    state: {
                        descriptor: {
                            code: "SERVICEABLE"
                        }
                    }
                },
                quote: {
                    price: {
                        currency: "INR",
                        value: "500"
                    },
                    breakup: [
                        {
                            title: "Base Price",
                            price: {
                                currency: "INR",
                                value: "500"
                            }
                        }
                    ]
                }
            }
        }
    };
    
    res.json(selectResponse);
});

// Handle confirm requests
app.post('/beckn/confirm', (req, res) => {
    console.log('✅ BPP received confirm request:', JSON.stringify(req.body, null, 2));
    
    const confirmResponse = {
        context: {
            ...req.body.context,
            action: "on_confirm",
            message_id: `msg_${Date.now()}_on_confirm`,
            timestamp: new Date().toISOString()
        },
        message: {
            order: {
                ...req.body.message.order,
                id: `order_${Date.now()}`,
                state: "ACCEPTED",
                fulfillment: {
                    ...req.body.message.order.fulfillment,
                    state: {
                        descriptor: {
                            code: "PENDING"
                        }
                    },
                    agent: {
                        name: "Ravi Kumar",
                        phone: "9876543210"
                    },
                    start: {
                        ...req.body.message.order.fulfillment.start,
                        time: {
                            range: {
                                start: new Date(Date.now() + 24*60*60*1000).toISOString(),
                                end: new Date(Date.now() + 26*60*60*1000).toISOString()
                            }
                        }
                    }
                }
            }
        }
    };
    
    res.json(confirmResponse);
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        bpp_id: BPP_CONFIG.bpp_id,
        services: BPP_CONFIG.services.length,
        timestamp: new Date().toISOString()
    });
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
    console.log(`🧪 Mock BPP Server running on port ${PORT}`);
    console.log(`🆔 BPP ID: ${BPP_CONFIG.bpp_id}`);
    console.log(`📋 Services: ${BPP_CONFIG.services.length}`);
});

module.exports = app;
