# Local Rewards Points Calculator

A simple, professional, single-page web application that calculates credit card reward points based on spending categories.

## Features

- **Three spending categories**: Grocery (30 pts/$), Drugstore (40 pts/$), Everything Else (10 pts/$)
- **Monthly/Yearly toggle**: Switch between monthly and projected yearly earnings
- **Real-time calculation**: Points update instantly as you type
- **Responsive design**: Works on desktop, tablet, and mobile
- **Accessible**: WCAG AA compliant with ARIA live regions for screen readers

## How to Run

Simply open the built `dist/index.html` file in any modern browser:

- **Chrome**: Double-click `dist/index.html` or drag it into a Chrome window
- **Firefox**: Double-click `dist/index.html` or drag it into a Firefox window
- **Safari**: Double-click `dist/index.html` or drag it into a Safari window

No server or internet connection required!

## Building from Source

```bash
npm install
npm run build
```

The output will be in the `dist/` directory.

## Default Values & Example Calculation

With default inputs (Grocery: $125, Drugstore: $60, Everything Else: $200):

### Monthly Mode
| Category | Spending | Multiplier | Points |
|----------|----------|------------|--------|
| Grocery | $125 | × 30 | 3,750 |
| Drugstore | $60 | × 40 | 2,400 |
| Everything Else | $200 | × 10 | 2,000 |
| **Total** | | | **8,150 pts** |

### Yearly Mode
| Category | Spending (×12) | Multiplier | Points |
|----------|----------------|------------|--------|
| Grocery | $1,500 | × 30 | 45,000 |
| Drugstore | $720 | × 40 | 28,800 |
| Everything Else | $2,400 | × 10 | 24,000 |
| **Total** | | | **97,800 pts** |

## Technical Details

- Built with React + TypeScript + Vite
- Styled with vanilla CSS (no CSS frameworks)
- No external API calls — runs entirely in the browser
- Input validation: strips non-numeric characters, clamps negatives to 0
