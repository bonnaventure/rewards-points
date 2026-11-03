import { useState, useCallback, useMemo } from "react";
import "./index.css";

type Timeframe = "monthly" | "yearly";

interface CategoryConfig {
  id: string;
  label: string;
  defaultValue: number;
  multiplier: number;
  icon: string;
}

const CATEGORIES: CategoryConfig[] = [
  { id: "grocery", label: "Grocery Spending", defaultValue: 125, multiplier: 30, icon: "🛒" },
  { id: "drugstore", label: "Drugstore Spending", defaultValue: 60, multiplier: 40, icon: "💊" },
  { id: "other", label: "Everything Else", defaultValue: 200, multiplier: 10, icon: "🛍️" },
];

function sanitizeInput(value: string): string {
  // Allow only digits and one decimal point with up to 2 decimal places
  let cleaned = value.replace(/[^0-9.]/g, "");
  // Ensure only one decimal point
  const parts = cleaned.split(".");
  if (parts.length > 2) {
    cleaned = parts[0] + "." + parts.slice(1).join("");
  }
  // Limit to 2 decimal places
  if (parts.length === 2 && parts[1].length > 2) {
    cleaned = parts[0] + "." + parts[1].slice(0, 2);
  }
  return cleaned;
}

function formatNumber(num: number): string {
  return num.toLocaleString("en-US");
}

function App() {
  const [timeframe, setTimeframe] = useState<Timeframe>("monthly");
  const [values, setValues] = useState<Record<string, number>>({
    grocery: 125,
    drugstore: 60,
    other: 200,
  });
  const [rawInputs, setRawInputs] = useState<Record<string, string>>({
    grocery: "125",
    drugstore: "60",
    other: "200",
  });

  const handleInputChange = useCallback((id: string, rawValue: string) => {
    const sanitized = sanitizeInput(rawValue);
    setRawInputs((prev) => ({ ...prev, [id]: sanitized }));

    let numValue = parseFloat(sanitized);
    if (isNaN(numValue) || numValue < 0) {
      numValue = 0;
    }
    setValues((prev) => ({ ...prev, [id]: numValue }));
  }, []);

  const handleBlur = useCallback((id: string) => {
    setRawInputs((prev) => {
      const val = parseFloat(prev[id]);
      if (isNaN(val) || val < 0) {
        return { ...prev, [id]: "0" };
      }
      return { ...prev, [id]: prev[id] || "0" };
    });
  }, []);

  const multiplier = timeframe === "yearly" ? 12 : 1;

  const breakdown = useMemo(() => {
    return CATEGORIES.map((cat) => {
      const spending = values[cat.id] * multiplier;
      const points = spending * cat.multiplier;
      return {
        ...cat,
        spending,
        points: Math.round(points),
      };
    });
  }, [values, multiplier]);

  const totalPoints = useMemo(() => {
    return breakdown.reduce((sum, item) => sum + item.points, 0);
  }, [breakdown]);

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Rewards Points Calculator</h1>
        <p className="subtitle">Calculate your credit card reward points based on spending</p>
      </header>

      <main className="app-main">
        {/* Timeframe Toggle */}
        <section className="toggle-section">
          <fieldset className="toggle-fieldset">
            <legend className="toggle-legend">Earnings Period</legend>
            <div className="toggle-group" role="radiogroup" aria-label="Select earnings timeframe">
              <label className={`toggle-option ${timeframe === "monthly" ? "active" : ""}`}>
                <input
                  type="radio"
                  name="timeframe"
                  value="monthly"
                  checked={timeframe === "monthly"}
                  onChange={() => setTimeframe("monthly")}
                />
                <span className="toggle-label">Monthly Earnings</span>
              </label>
              <label className={`toggle-option ${timeframe === "yearly" ? "active" : ""}`}>
                <input
                  type="radio"
                  name="timeframe"
                  value="yearly"
                  checked={timeframe === "yearly"}
                  onChange={() => setTimeframe("yearly")}
                />
                <span className="toggle-label">Yearly Earnings</span>
              </label>
            </div>
          </fieldset>
        </section>

        {/* Input Fields */}
        <section className="inputs-section">
          <div className="inputs-grid">
            {CATEGORIES.map((cat) => (
              <div className="input-card" key={cat.id}>
                <label htmlFor={`input-${cat.id}`} className="input-label">
                  <span className="input-icon">{cat.icon}</span>
                  {cat.label}
                </label>
                <div className="input-wrapper">
                  <span className="input-prefix">$</span>
                  <input
                    id={`input-${cat.id}`}
                    type="text"
                    inputMode="decimal"
                    className="input-field"
                    value={rawInputs[cat.id]}
                    onChange={(e) => handleInputChange(cat.id, e.target.value)}
                    onBlur={() => handleBlur(cat.id)}
                    aria-label={`${cat.label} in dollars`}
                  />
                </div>
                <span className="input-hint">
                  $1 = {formatNumber(cat.multiplier)} pts
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Results */}
        <section className="results-section" aria-live="polite" aria-atomic="true">
          <div className="results-card">
            <h2 className="results-title">
              {timeframe === "yearly" ? "Estimated Yearly" : "Monthly"} Reward Points
            </h2>
            <div className="total-points">
              <span className="total-number">{formatNumber(totalPoints)}</span>
              <span className="total-label">pts</span>
            </div>

            <div className="breakdown-list">
              {breakdown.map((item) => (
                <div className="breakdown-item" key={item.id}>
                  <div className="breakdown-category">
                    <span className="breakdown-icon">{item.icon}</span>
                    <span className="breakdown-name">{item.label}</span>
                  </div>
                  <div className="breakdown-details">
                    <span className="breakdown-spending">
                      ${formatNumber(item.spending)} × {item.multiplier}
                    </span>
                    <span className="breakdown-points">{formatNumber(item.points)} pts</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="app-footer">
        <p>Points are calculated based on standard reward multipliers. Actual points may vary.</p>
      </footer>
    </div>
  );
}

export default App;
