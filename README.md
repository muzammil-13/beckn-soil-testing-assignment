# Beckn Soil Testing Assignment

Welcome to the Beckn Open Agri Network Engineering Intern assignment repo.

## Folder Structure 📂

```bash
beckn-soil-testing-assignment/
├── part1-implementation-guide/
│   ├── README.md               # Guide document with roles, flow, APIs
│   ├── assets/
│   │   └── flow-diagram.png   # Optional high-level flow diagram
│   └── sample-payloads/
│       ├── search.json
│       ├── on_search.json
│       ├── select.json
│       └── confirm.json
└── part2-frontend/
    ├── index.html              # Homepage with CTA buttons
    ├── pages/
    │   ├── signup.html         # Dedicated signup page
    │   └── thankyou.html       # Thank you page
    ├── css/
    │   └── style.css          # Styles for all pages
    └── js/
        ├── main.js            # Homepage functionality
        ├── signup-handler.js  # Signup page functionality (dummy submission)
        └── form-handler.js    # [DEPRECATED] - Modal form handler
```

## Parts Overview

- **[Part 1 - Implementation Guide](./part1-implementation-guide/README.md)** Detailed guide on Beckn protocol usage for soil testing, including roles, DOFP flow, API calls, sample payloads, and assumptions.
- **[Part 2 - Frontend UI](./part2-frontend/)** Complete website with homepage, dedicated signup page, and thank you page. Features dummy form submission for demo purposes.

## 🔗 UI Wireframes (Part 2)

The frontend wireframes for the agri-service platform were created using Figma and are being actively iterated.

🔗 [View Wireframes on Figma](https://www.figma.com/design/UElcAilF7ok8iPn2gfhH6G/Open-Agri-Network-Wireframes---stitch?node-id=0-1&t=iVdtRGoCMchDRmTU-1)

---

---

## Technical Implementation

### Frontend Architecture

- **Homepage (`index.html`)**: Landing page with role-based CTA buttons
- **Signup Flow**: Dedicated signup page with form validation and dummy submission
- **Thank You Page**: Confirmation page with personalized user data
- **Responsive Design**: Mobile-first approach with modern CSS

### Key Features

- ✅ **Role Pre-selection**: URL parameters for farmer/buyer roles
- ✅ **Form Validation**: Client-side validation with error messaging
- ✅ **Dummy Submission**: Mock API calls for demo purposes
- ✅ **Data Persistence**: localStorage for form data recovery
- ✅ **Loading States**: Professional UX with loading indicators
- ✅ **Console Logging**: Detailed form data logging for demo

---

## How to Run Frontend Locally

```bash
# Option 1: Simple file opening
open part2-frontend/index.html

# Option 2: Using Live Server (recommended)
# Install Live Server extension in VS Code
# Right-click on index.html → "Open with Live Server"

# Option 3: Using Python HTTP Server
cd part2-frontend
python -m http.server 8000
# Visit: http://localhost:8000
```

---

## User Flow

1. **Homepage** (`index.html`) → Click "Join as Farmer/Buyer"
2. **Signup Page** (`pages/signup.html`) → Fill form and submit
3. **Thank You Page** (`pages/thankyou.html`) → Confirmation with user data

---

## Demo Features

### Form Submission (Dummy Mode)

- **Mock API Call**: Simulates 1.5-2.5 second processing
- **Success Rate**: 90% success, 10% error for demo
- **Console Logging**: All form data logged to browser console
- **No External Dependencies**: Works completely offline

### Form Validation

- **Name**: Minimum 2 characters
- **Phone**: 10-digit Indian mobile number
- **Role**: Farmer or Buyer selection required
- **Location**: District and State validation

---

## File Structure Analysis

### ✅ **Current Implementation:**

```
part2-frontend/
├── index.html                    # ✅ Homepage
├── pages/
│   ├── signup.html              # ✅ Signup form
│   └── thankyou.html            # ✅ Confirmation
├── css/
│   └── style.css               # ✅ Responsive styles
└── js/
    ├── main.js                 # ✅ Homepage logic
    ├── signup-handler.js       # ✅ Form handling (dummy)
    └── form-handler.js         # ❌ Deprecated (modal version)
```

### 🔧 **Recommended Cleanup:**

- **Remove**: `js/form-handler.js` (no longer needed)
- **Keep**: Current `pages/` folder structure
- **Update**: All relative paths to match folder structure

---

## Submission Instructions

- Please email the GitHub repo link along with any other requested files to kathirvel@becknprotocol.io and cc dhiraj@becknprotocol.io.

### Submission Status

- ✅ **Part 1**: Beckn Implementation Guide completed
- ✅ **Part 2**: Frontend MVP with dummy form submission completed
- ✅ **Demo Ready**: Full user flow functional with mock data

---

## Development Notes

### For Production Deployment:

1. Replace dummy form submission with real API endpoints
2. Add proper email service integration (FormSubmit, Netlify Forms, etc.)
3. Implement backend validation and data storage
4. Add analytics tracking (Google Analytics, etc.)
5. Optimize assets and add CDN integration

### Beckn Protocol Integration:

- Frontend ready for Beckn BAP integration
- Form data structure matches Beckn participant requirements
- Role-based flow supports farmer and buyer personas
- Extensible for additional Beckn services (soil testing, lab discovery, etc.)

---

Thank you! 🌾
