"use client";

import { useState } from "react";

type UsageType = "domestic" | "commercial";
type DomesticType = "single" | "submeters";

interface BillDetails {
  energyCharge: number;
  total: number;
}

interface SubmeterBillDetails {
  meterName: string;
  units: number;
  energyCharge: number;
  total: number;
}

interface SubmetersTotalBillDetails {
  meters: SubmeterBillDetails[];
  totalEnergyCharge: number;
  total: number;
}

// TNEB Tariff Rates (as per latest available rates)
// Domestic rates based on total consumption tier
const DOMESTIC_RATES = [
  {
    maxUnits: 100,
    slabs: [{ from: 1, to: 100, rate: 0.0 }],
  },
  {
    maxUnits: 200,
    slabs: [
      { from: 1, to: 100, rate: 0.0 },
      { from: 101, to: 200, rate: 2.35 },
    ],
  },
  {
    maxUnits: 400,
    slabs: [
      { from: 1, to: 100, rate: 0.0 },
      { from: 101, to: 200, rate: 2.35 },
      { from: 201, to: 400, rate: 4.7 },
    ],
  },
  {
    maxUnits: 500,
    slabs: [
      { from: 1, to: 100, rate: 0.0 },
      { from: 101, to: 200, rate: 2.35 },
      { from: 201, to: 400, rate: 4.7 },
      { from: 401, to: 500, rate: 6.3 },
    ],
  },
  {
    maxUnits: 600,
    slabs: [
      { from: 1, to: 100, rate: 0.0 },
      { from: 101, to: 400, rate: 4.7 },
      { from: 401, to: 500, rate: 6.3 },
      { from: 501, to: 600, rate: 8.4 },
    ],
  },
  {
    maxUnits: 800,
    slabs: [
      { from: 1, to: 100, rate: 0.0 },
      { from: 101, to: 400, rate: 4.7 },
      { from: 401, to: 500, rate: 6.3 },
      { from: 501, to: 600, rate: 8.4 },
      { from: 601, to: 800, rate: 9.45 },
    ],
  },
  {
    maxUnits: 1000,
    slabs: [
      { from: 1, to: 100, rate: 0.0 },
      { from: 101, to: 400, rate: 4.7 },
      { from: 401, to: 500, rate: 6.3 },
      { from: 501, to: 600, rate: 8.4 },
      { from: 601, to: 800, rate: 9.45 },
      { from: 801, to: 1000, rate: 10.5 },
    ],
  },
  {
    maxUnits: Infinity,
    slabs: [
      { from: 1, to: 100, rate: 0.0 },
      { from: 101, to: 400, rate: 4.7 },
      { from: 401, to: 500, rate: 6.3 },
      { from: 501, to: 600, rate: 8.4 },
      { from: 601, to: 800, rate: 9.45 },
      { from: 801, to: 1000, rate: 10.5 },
      { from: 1001, to: Infinity, rate: 11.55 },
    ],
  },
];

const COMMERCIAL_SLABS = [
  { limit: 100, rate: 5.5 }, // First 100 units
  { limit: 500, rate: 7.0 }, // 101-500 units
  { limit: Infinity, rate: 9.0 }, // Above 500 units
];



function calculateDomesticBill(units: number, freeUnits: number = 100) {
  // Find the appropriate tier based on total units
  const tier = DOMESTIC_RATES.find((t) => units <= t.maxUnits);
  if (!tier) return 0;

  let totalCharge = 0;
  for (const slab of tier.slabs) {
    const unitsInSlab = Math.min(units, slab.to) - Math.max(0, slab.from - 1);
    if (unitsInSlab > 0) {
      // Apply free units to the first slab
      if (slab.from === 1 && freeUnits > 0) {
        const chargeableUnits = Math.max(0, unitsInSlab - freeUnits);
        totalCharge += chargeableUnits * slab.rate;
      } else {
        totalCharge += unitsInSlab * slab.rate;
      }
    }
  }

  return totalCharge;
}

function calculateCommercialBill(units: number) {
  let remainingUnits = units;
  let totalCharge = 0;
  let previousLimit = 0;

  for (const slab of COMMERCIAL_SLABS) {
    const unitsInThisSlab = Math.min(
      remainingUnits,
      slab.limit - previousLimit
    );

    if (unitsInThisSlab > 0) {
      totalCharge += unitsInThisSlab * slab.rate;
      remainingUnits -= unitsInThisSlab;
    }

    if (remainingUnits <= 0) break;
    previousLimit = slab.limit;
  }

  return totalCharge;
}

function calculateBill(units: number, type: UsageType) {
  if (units <= 0 || isNaN(units)) {
    return null;
  }

  const energyCharge =
    type === "domestic"
      ? calculateDomesticBill(units)
      : calculateCommercialBill(units);

  const total = energyCharge;

  return {
    energyCharge,
    total,
  };
}

function calculateSubmetersBill(
  mainUnits: number,
  submeterUnits: number[]
): SubmetersTotalBillDetails | null {
  if (mainUnits < 0 || isNaN(mainUnits)) {
    return null;
  }

  if (submeterUnits.some((units) => units < 0 || isNaN(units))) {
    return null;
  }

  const totalMeters = 1 + submeterUnits.length; // Main + submeters
  const freeUnitsPerMeter = 100 / totalMeters; // Divide 100 free units equally

  const meters: SubmeterBillDetails[] = [];

  // Calculate main meter bill
  const mainEnergyCharge = calculateDomesticBill(mainUnits, freeUnitsPerMeter);
  const mainTotal = mainEnergyCharge;

  meters.push({
    meterName: "Main Meter",
    units: mainUnits,
    energyCharge: mainEnergyCharge,
    total: mainTotal,
  });

  // Calculate each submeter bill
  submeterUnits.forEach((units, index) => {
    const energyCharge = calculateDomesticBill(units, freeUnitsPerMeter);
    const total = energyCharge;

    meters.push({
      meterName: `Submeter ${index + 1}`,
      units: units,
      energyCharge,
      total,
    });
  });

  // Calculate totals
  const totalEnergyCharge = meters.reduce((sum, m) => sum + m.energyCharge, 0);
  const total = meters.reduce((sum, m) => sum + m.total, 0);

  return {
    meters,
    totalEnergyCharge,
    total,
  };
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<UsageType>("domestic");
  const [domesticType, setDomesticType] = useState<DomesticType>("single");
  const [units, setUnits] = useState<string>("");
  const [billDetails, setBillDetails] = useState<BillDetails | null>(null);
  
  // Submeter states
  const [numSubmeters, setNumSubmeters] = useState<number>(1);
  const [mainMeterUnits, setMainMeterUnits] = useState<string>("");
  const [submeterUnits, setSubmeterUnits] = useState<string[]>([""]); 
  const [submetersBillDetails, setSubmetersBillDetails] = useState<SubmetersTotalBillDetails | null>(null);

  // JSON-LD structured data for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "TNEB Bill Calculator",
    description: "Calculate your Tamil Nadu Electricity Board (TNEB) bill for domestic and commercial usage",
    url: "https://tneb-calc.netlify.app",
    applicationCategory: "UtilityApplication",
    operatingSystem: "Web",
    browserRequirements: "Requires JavaScript. Requires HTML5.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "INR",
    },
    provider: {
      "@type": "Organization",
      name: "TNEB Bill Calculator",
      url: "https://tneb-calc.netlify.app",
    },
    audience: {
      "@type": "Audience",
      geographicArea: {
        "@type": "State",
        name: "Tamil Nadu",
        containedInPlace: {
          "@type": "Country",
          name: "India",
        },
      },
    },
    inLanguage: "en-IN",
    potentialAction: {
      "@type": "UseAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://tneb-calc.netlify.app",
        actionPlatform: [
          "http://schema.org/DesktopWebPlatform",
          "http://schema.org/MobileWebPlatform",
        ],
      },
    },
  };

  // FAQ structured data
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How to calculate TNEB bill?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "To calculate your TNEB bill, enter your electricity units consumed in the calculator. The bill is calculated based on slab rates where 0-100 units are free for domestic users, and higher slabs have progressive rates.",
        },
      },
      {
        "@type": "Question",
        name: "What are the current TNEB tariff rates?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Current TNEB domestic tariff rates are: 0-100 units free, 101-200 units at ₹2.35/unit, 201-400 units at ₹4.70/unit, 401-500 units at ₹6.30/unit, 501-600 units at ₹8.40/unit, 601-800 units at ₹9.45/unit, 801-1000 units at ₹10.50/unit, and above 1000 units at ₹11.55/unit.",
        },
      },
      {
        "@type": "Question",
        name: "How does submeter billing work in TNEB?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "In submeter billing, the 100 free units are divided equally among all meters (main meter + submeters). Each meter is then billed separately based on its consumption using the TNEB slab rates.",
        },
      },
      {
        "@type": "Question",
        name: "Is this TNEB calculator accurate?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "This calculator provides estimates based on current TNEB tariff rates. Actual bills may vary based on location-specific charges, meter reading variations, and additional fees.",
        },
      },
    ],
  };

  // Breadcrumb structured data
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://tneb-calc.netlify.app",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "TNEB Bill Calculator",
        item: "https://tneb-calc.netlify.app",
      },
    ],
  };

  const handleCalculate = () => {
    const unitsNumber = parseFloat(units);
    const result = calculateBill(unitsNumber, activeTab);
    setBillDetails(result);
  };

  const handleCalculateSubmeters = () => {
    const mainUnitsNum = parseFloat(mainMeterUnits);
    const submeterUnitsNum = submeterUnits.map(u => parseFloat(u));
    const result = calculateSubmetersBill(mainUnitsNum, submeterUnitsNum);
    setSubmetersBillDetails(result);
  };

  const handleReset = () => {
    setUnits("");
    setBillDetails(null);
    setMainMeterUnits("");
    setSubmeterUnits([""]);
    setSubmetersBillDetails(null);
    setNumSubmeters(1);
  };

  const handleNumSubmetersChange = (num: number) => {
    setNumSubmeters(num);
    setSubmeterUnits(new Array(num).fill(""));
  };

  const handleSubmeterUnitsChange = (index: number, value: string) => {
    const newSubmeterUnits = [...submeterUnits];
    newSubmeterUnits[index] = value;
    setSubmeterUnits(newSubmeterUnits);
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            TNEB Bill Calculator
          </h1>
          <p className="text-gray-600">
            Calculate your Tamil Nadu Electricity Board bill
          </p>
          </header>

          <main className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Main Tabs - Commented Commercial for now */}
          <nav className="flex border-b border-gray-200" role="tablist" aria-label="Calculator Type">
            <button
              onClick={() => {
                setActiveTab("domestic");
                handleReset();
              }}
              role="tab"
              aria-selected={activeTab === "domestic"}
              aria-controls="domestic-panel"
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                activeTab === "domestic"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-50 text-gray-700 hover:bg-gray-100"
              }`}
            >
              Domestic
            </button>
            {/* Commercial tab commented out as per requirements
            <button
              onClick={() => {
                setActiveTab("commercial");
                handleReset();
              }}
              role="tab"
              aria-selected={activeTab === "commercial"}
              aria-controls="commercial-panel"
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                activeTab === "commercial"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-50 text-gray-700 hover:bg-gray-100"
              }`}
            >
              Commercial
            </button>
            */}
          </nav>

          {/* Domestic Sub-tabs */}
          {activeTab === "domestic" && (
            <nav className="flex border-b border-gray-200 bg-gray-50" role="tablist" aria-label="Meter Type">
              <button
                onClick={() => {
                  setDomesticType("single");
                  handleReset();
                }}
                role="tab"
                aria-selected={domesticType === "single"}
                aria-controls="single-meter-panel"
                className={`flex-1 py-3 px-4 text-center text-sm font-medium transition-colors ${
                  domesticType === "single"
                    ? "bg-white text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Single Main Meter
              </button>
              <button
                onClick={() => {
                  setDomesticType("submeters");
                  handleReset();
                }}
                role="tab"
                aria-selected={domesticType === "submeters"}
                aria-controls="submeters-panel"
                className={`flex-1 py-3 px-4 text-center text-sm font-medium transition-colors ${
                  domesticType === "submeters"
                    ? "bg-white text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                With Submeters
              </button>
            </nav>
          )}

          {/* Content */}
          <section className="p-8" id={activeTab === "domestic" ? (domesticType === "single" ? "single-meter-panel" : "submeters-panel") : "commercial-panel"} role="tabpanel">
            {activeTab === "domestic" && domesticType === "single" && (
              <>
                <div className="mb-6">
                  <label
                    htmlFor="units"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Enter Units Consumed
                  </label>
                  <input
                    type="number"
                    id="units"
                    name="units"
                    value={units}
                    onChange={(e) => setUnits(e.target.value)}
                    placeholder="e.g., 250"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    min="0"
                    step="1"
                    aria-describedby="units-help"
                  />
                  <p id="units-help" className="sr-only">Enter the number of electricity units consumed</p>
                </div>

                {/* Tariff Information */}
                <aside className="mb-6 p-4 bg-blue-50 rounded-lg" role="complementary" aria-label="Tariff Rates">
                  <h2 className="font-semibold text-blue-900 mb-2">
                    Domestic Tariff Rates
                  </h2>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• 0-100 units: ₹0.00/unit (Free with subsidy)</li>
                    <li>• 101-200 units: ₹2.35/unit</li>
                    <li>• 201-400 units: ₹4.70/unit</li>
                    <li>• 401-500 units: ₹6.30/unit</li>
                    <li>• 501-600 units: ₹8.40/unit</li>
                    <li>• 601-800 units: ₹9.45/unit</li>
                    <li>• 801-1000 units: ₹10.50/unit</li>
                    <li>• Above 1000 units: ₹11.55/unit</li>
                  </ul>
                </aside>

                {/* Buttons */}
                <div className="flex gap-4">
                  <button
                    onClick={handleCalculate}
                    disabled={!units || parseFloat(units) <= 0}
                    className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
                  >
                    Calculate Bill
                  </button>
                  <button
                    onClick={handleReset}
                    className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-300 transition"
                  >
                    Reset
                  </button>
                </div>

                {/* Bill Details */}
                {billDetails && (
                  <article className="mt-8 border-t border-gray-200 pt-6" aria-label="Bill Calculation Results">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Bill Breakdown
                    </h3>
                    <dl className="space-y-3">
                      <div className="flex justify-between text-gray-700">
                        <dt>Energy Charge ({units} units)</dt>
                        <dd className="font-medium">
                          ₹{billDetails.energyCharge.toFixed(2)}
                        </dd>
                      </div>
                      <div className="flex justify-between text-xl font-bold text-gray-900 pt-3 border-t border-gray-300">
                        <dt>Total Amount</dt>
                        <dd className="text-blue-600">
                          ₹{billDetails.total.toFixed(2)}
                        </dd>
                      </div>
                    </dl>
                  </article>
                )}
              </>
            )}

            {activeTab === "domestic" && domesticType === "submeters" && (
              <>
                <div className="mb-6">
                  <label
                    htmlFor="numSubmeters"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Number of Submeters
                  </label>
                  <select
                    id="numSubmeters"
                    value={numSubmeters}
                    onChange={(e) => handleNumSubmetersChange(parseInt(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  >
                    {[1, 2, 3, 4, 5].map((num) => (
                      <option key={num} value={num}>
                        {num} Submeter{num > 1 ? 's' : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-6">
                  <label
                    htmlFor="mainMeterUnits"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Main Meter Units
                  </label>
                  <input
                    type="number"
                    id="mainMeterUnits"
                    value={mainMeterUnits}
                    onChange={(e) => setMainMeterUnits(e.target.value)}
                    placeholder="e.g., 120"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    min="0"
                    step="1"
                  />
                </div>

                {submeterUnits.map((units, index) => (
                  <div key={index} className="mb-6">
                    <label
                      htmlFor={`submeter-${index}`}
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Submeter {index + 1} Units
                    </label>
                    <input
                      type="number"
                      id={`submeter-${index}`}
                      value={units}
                      onChange={(e) => handleSubmeterUnitsChange(index, e.target.value)}
                      placeholder="e.g., 80"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                      min="0"
                      step="1"
                    />
                  </div>
                ))}

                {/* Info Box */}
                <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">
                    How Submeters Work
                  </h3>
                  <div className="text-sm text-blue-800 space-y-1">
                    <p>• The 100 free units are divided equally among all meters (main + submeters)</p>
                    <p>• With {numSubmeters} submeter{numSubmeters > 1 ? 's' : ''}, each meter gets {(100 / (numSubmeters + 1)).toFixed(2)} free units</p>
                    <p>• Each meter is billed separately based on its consumption</p>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-4">
                  <button
                    onClick={handleCalculateSubmeters}
                    disabled={
                      !mainMeterUnits ||
                      parseFloat(mainMeterUnits) < 0 ||
                      submeterUnits.some((u) => !u || parseFloat(u) < 0)
                    }
                    className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
                  >
                    Calculate Bill
                  </button>
                  <button
                    onClick={handleReset}
                    className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-300 transition"
                  >
                    Reset
                  </button>
                </div>

                {/* Submeters Bill Details */}
                {submetersBillDetails && (
                  <div className="mt-8 border-t border-gray-200 pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Bill Breakdown by Meter
                    </h3>
                    
                    {submetersBillDetails.meters.map((meter, index) => (
                      <div key={index} className="mb-6 p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-semibold text-gray-800 mb-3">
                          {meter.meterName} ({meter.units} units)
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between text-gray-700">
                            <span>Energy Charge</span>
                            <span className="font-medium">
                              ₹{meter.energyCharge.toFixed(2)}
                            </span>
                          </div>
                          <div className="flex justify-between font-bold text-gray-900 pt-2 border-t border-gray-300">
                            <span>Total</span>
                            <span className="text-blue-600">
                              ₹{meter.total.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}

                    <div className="mt-6 p-4 bg-blue-100 rounded-lg">
                      <h4 className="font-semibold text-blue-900 mb-3">
                        Combined Total
                      </h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-blue-800">
                          <span>Total Energy Charge</span>
                          <span className="font-medium">
                            ₹{submetersBillDetails.totalEnergyCharge.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between text-xl font-bold text-blue-900 pt-3 border-t border-blue-300">
                          <span>Grand Total</span>
                          <span className="text-blue-600">
                            ₹{submetersBillDetails.total.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {activeTab === "commercial" && (
              <>
                <div className="mb-6">
                  <label
                    htmlFor="units-commercial"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Enter Units Consumed
                  </label>
                  <input
                    type="number"
                    id="units-commercial"
                    value={units}
                    onChange={(e) => setUnits(e.target.value)}
                    placeholder="e.g., 450"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    min="0"
                    step="1"
                  />
                </div>

                {/* Tariff Information */}
                <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">
                    Commercial Tariff Rates
                  </h3>
                  <div className="text-sm text-blue-800 space-y-1">
                    <p>• 0-100 units: ₹5.50/unit</p>
                    <p>• 101-500 units: ₹7.00/unit</p>
                    <p>• Above 500 units: ₹9.00/unit</p>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-4">
                  <button
                    onClick={handleCalculate}
                    disabled={!units || parseFloat(units) <= 0}
                    className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
                  >
                    Calculate Bill
                  </button>
                  <button
                    onClick={handleReset}
                    className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-300 transition"
                  >
                    Reset
                  </button>
                </div>

                {/* Bill Details */}
                {billDetails && (
                  <div className="mt-8 border-t border-gray-200 pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Bill Breakdown
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between text-gray-700">
                        <span>Energy Charge ({units} units)</span>
                        <span className="font-medium">
                          ₹{billDetails.energyCharge.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between text-xl font-bold text-gray-900 pt-3 border-t border-gray-300">
                        <span>Total Amount</span>
                        <span className="text-blue-600">
                          ₹{billDetails.total.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </section>
          </main>

          {/* Footer */}
          <footer className="text-center mt-8 text-gray-600 text-sm">
          <p>
            Note: Rates are approximate and based on general TNEB tariff
            structure.
          </p>
          <p className="mt-1">
            Actual bills may vary based on specific location and additional
            charges.
          </p>
          <nav className="mt-4 flex justify-center gap-4" aria-label="Footer Navigation">
            <a href="/terms" className="text-blue-600 hover:text-blue-800 underline">
              Terms of Service
            </a>
            <span aria-hidden="true">•</span>
            <a href="/privacy" className="text-blue-600 hover:text-blue-800 underline">
              Privacy Policy
            </a>
          </nav>
          </footer>
        </div>
      </div>
    </>
  );
}
