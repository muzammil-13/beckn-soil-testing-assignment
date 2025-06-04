# Beckn Soil Testing Implementation Guide

## 1. Introduction

This document explains how network participants (farmers, labs, aggregators) interact using the Beckn protocol for soil testing services.

## 2. Roles and Entities

| Entity          | Role in Network          |
|-----------------|--------------------------|
| Farmer          | BAP (Beckn Application) - Service requester |
| Soil Testing Lab| BPP (Beckn Provider) - Service provider |
| Aggregator      | Optional - Facilitates discovery and aggregation |

## 3. DOFP Journey

- **Discovery:** Farmer searches for soil testing labs near them.
- **Order:** Farmer selects a lab and places an order for soil testing.
- **Fulfillment:** Lab collects the sample and processes the test.
- **Post-fulfillment:** Lab shares test results with the farmer.

## 4. API Call Sequence

1. `search` → 2. `on_search` → 3. `select` → 4. `on_select` → 5. `init` → 6. `on_init` → 7. `confirm` → 8. `on_confirm` → 9. `track` → 10. `on_track` → 11. `status` → 12. `on_status`

## 5. Sample Payloads

### Search Request

```json
{
  "context": {
    "domain": "agri-soil-testing",
    "action": "search",
    "city": "Palakkad",
    "country": "IN"
  },
  "message": {
    "criteria": {
      "category": "soil-testing"
    }
  }
}
```
### Search Response
```json
{
  "message": {
    "catalog": {
      "bpp": [
        {
          "id": "soil-lab-001",
          "name": "Greenfield Soil Lab",
          "category": "soil-testing"
        }
      ]
    }
  }
}
```
> (Add similar for select, confirm, etc.)

## 6. Assumptions & Challenges
- Network participants must be registered Beckn nodes.
- Farmer’s location used for discovery.
- Test result delivery timeline can vary by lab.

## 7. Developer Notes
- Payloads follow Beckn open API specs.
- Use standard HTTP verbs and status codes.
- Security handled via Beckn’s protocol authentication.
