# Beckn Protocol – Open Agri Network: Soil Testing Use Case Implementation Guide

## 1. Use Case Overview

This document describes how developers can integrate with a Unified Krishi Interface (UKI) open network powered by the Beckn Protocol for the **Soil Testing** use case.
Soil testing helps farmers understand their soil health and make better crop decisions by sending samples to labs and receiving test results digitally.

---

## 2. Roles & Network Participants

| Entity                       | Role on Beckn Network            | Description                                                         |
| ---------------------------- | -------------------------------- | ------------------------------------------------------------------- |
| Farmer                       | BAP (Beckn Application Platform) | Initiates soil test requests and views results.                     |
| Soil Testing Lab             | BPP (Beckn Provider Platform)    | Receives test requests, processes soil samples, and shares results. |
| Aggregator / Extension Agent | Optional Facilitator             | Connects farmers with labs, helps with network discovery.           |

---

## 3. DOFP Journey (Discovery → Order → Fulfillment → Post-fulfillment)

### Step 1: Discovery

- Farmer searches for soil testing labs available in their district/state.

### Step 2: Order

- Farmer selects a lab, places a soil test order with sample details.

### Step 3: Fulfillment

- Lab receives the order, confirms sample pickup or drop-off.

### Step 4: Post-fulfillment

- Lab sends soil test results back to farmer via the platform.

---

## 4. API Call Sequence & Sample Payloads

### API Flow Sequence

| Action    | Description                            |
| --------- | -------------------------------------- |
| search    | Farmer searches for soil testing labs. |
| on_search | Labs respond with availability.        |
| select    | Farmer selects a lab and test package. |
| on_select | Lab acknowledges selection.            |
| init      | Order initiation with details.         |
| confirm   | Lab confirms order acceptance.         |
| update    | Updates on sample pickup/status.       |
| status    | Soil test result delivery.             |
| cancel    | Order cancellation (if any).           |

---

### Sample JSON Payloads

#### 1. search Request (Farmer searches for labs)

```json
{
  "context": {
    "domain": "agri-soil-testing",
    "action": "search",
    "timestamp": "2025-06-05T10:00:00Z",
    "bap_id": "farmer-app.example.com",
    "bpp_id": "soil-lab-registry.example.com"
  },
  "message": {
    "intent": {
      "item": {
        "descriptor": {
          "name": "soil testing"
        }
      },
      "fulfillment": {
        "start": {
          "location": {
            "gps": "12.9716,77.5946",  
            "address": {
              "city": "Bengaluru",
              "state": "Karnataka"
            }
          }
        }
      }
    }
  }
}
```

#### 2. on_search Response (Labs responding)

```json
{
  "context": {
    "transaction_id": "123456789",
    "action": "on_search",
    "bpp_id": "soil-lab-registry.example.com"
  },
  "message": {
    "catalog": {
      "bpp": {
        "descriptor": {
          "name": "ABC Soil Testing Lab"
        },
        "items": [
          {
            "id": "soil_test_001",
            "descriptor": {
              "name": "Basic Soil Nutrient Test"
            },
            "price": {
              "currency": "INR",
              "value": "500"
            }
          }
        ]
      }
    }
  }
}
```
#### 3. select Request (Farmer selects test package)

```json
{
  "context": {
    "transaction_id": "123456789",
    "action": "select",
    "bap_id": "farmer-app.example.com",
    "bpp_id": "abc-soil-lab.example.com"
  },
  "message": {
    "order": {
      "items": [
        {
          "id": "soil_test_001",
          "quantity": {
            "count": 1
          }
        }
      ],
      "fulfillment": {
        "type": "pickup",
        "end": {
          "location": {
            "gps": "12.9716,77.5946",
            "address": {
              "city": "Bengaluru",
              "state": "Karnataka"
            }
          }
        }
      }
    }
  }
}
```
#### 4. on_select Response (Lab confirms selection)

```json
{
  "context": {
    "transaction_id": "123456789",
    "action": "on_select",
    "bpp_id": "abc-soil-lab.example.com"
  },
  "message": {
    "order": {
      "state": "Accepted"
    }
  }
}
```
---

## 5. Challenges & Assumptions

* Farmers may have limited internet access; app should be lightweight.
* Soil test results must be easy to understand with visual cues.
* Geo-location accuracy is important for lab discovery.
* Data privacy of farmers' information must be ensured.

---

## 6. Developer Notes

* All payloads follow Beckn JSON specifications.
* Use Beckn protocol libraries if available.
* Reuse existing APIs and extend with soil test specific fields.
* Network participants must authenticate using Beckn's security protocols.
* Extendable for other agri-services like fertilizer recommendations.

---

## Appendix: High-Level Flow Diagram

(Refer to `/docs/soil-testing-flow.png`)
