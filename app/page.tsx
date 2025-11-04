"use client";

import { useState } from "react";

type UsageType = "domestic" | "commercial";
type DomesticType = "single" | "submeters";

interface BillDetails {
  energyCharge: number;
  fixedCharge: number;
  subtotal: number;
  tax: number;
  total: number;
}

interface SubmeterBillDetails extends BillDetails {
  meterName: string;
  units: number;
}

interface SubmetersTotalBillDetails {
  meters: SubmeterBillDetails[];
  totalEnergyCharge: number;
  totalFixedCharge: number;
  subtotal: number;
  tax: number;
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

const FIXED_CHARGES = {
  domestic: 20,
  commercial: 50,
};

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

  const fixedCharge = FIXED_CHARGES[type];
  const subtotal = energyCharge + fixedCharge;
  const tax = subtotal * 0.02; // 2% electricity duty
  const total = subtotal + tax;

  return {
    energyCharge,
    fixedCharge,
    subtotal,
    tax,
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

  for (const units of submeterUnits) {
    if (units < 0 || isNaN(units)) {
      return null;
    }
  }

  const totalMeters = 1 + submeterUnits.length; // Main + submeters
  const freeUnitsPerMeter = 100 / totalMeters; // Divide 100 free units equally

  const meters: SubmeterBillDetails[] = [];

  // Calculate main meter bill
  const mainEnergyCharge = calculateDomesticBill(mainUnits, freeUnitsPerMeter);
  const mainFixedCharge = FIXED_CHARGES.domestic;
  const mainSubtotal = mainEnergyCharge + mainFixedCharge;
  const mainTax = mainSubtotal * 0.02;
  const mainTotal = mainSubtotal + mainTax;

  meters.push({
    meterName: "Main Meter",
    units: mainUnits,
    energyCharge: mainEnergyCharge,
    fixedCharge: mainFixedCharge,
    subtotal: mainSubtotal,
    tax: mainTax,
    total: mainTotal,
  });

  // Calculate each submeter bill
  submeterUnits.forEach((units, index) => {
    const energyCharge = calculateDomesticBill(units, freeUnitsPerMeter);
    const fixedCharge = FIXED_CHARGES.domestic;
    const subtotal = energyCharge + fixedCharge;
    const tax = subtotal * 0.02;
    const total = subtotal + tax;

    meters.push({
      meterName: `Submeter ${index + 1}`,
      units: units,
      energyCharge,
      fixedCharge,
      subtotal,
      tax,
      total,
    });
  });

  // Calculate totals
  const totalEnergyCharge = meters.reduce((sum, m) => sum + m.energyCharge, 0);
  const totalFixedCharge = meters.reduce((sum, m) => sum + m.fixedCharge, 0);
  const totalSubtotal = meters.reduce((sum, m) => sum + m.subtotal, 0);
  const totalTax = meters.reduce((sum, m) => sum + m.tax, 0);
  const total = meters.reduce((sum, m) => sum + m.total, 0);

  return {
    meters,
    totalEnergyCharge,
    totalFixedCharge,
    subtotal: totalSubtotal,
    tax: totalTax,
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            TNEB Bill Calculator
          </h1>
          <p className="text-gray-600">
            Calculate your Tamil Nadu Electricity Board bill
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Main Tabs - Commented Commercial for now */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => {
                setActiveTab("domestic");
                handleReset();
              }}
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
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                activeTab === "commercial"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-50 text-gray-700 hover:bg-gray-100"
              }`}
            >
              Commercial
            </button>
            */}
          </div>

          {/* Domestic Sub-tabs */}
          {activeTab === "domestic" && (
            <div className="flex border-b border-gray-200 bg-gray-50">
              <button
                onClick={() => {
                  setDomesticType("single");
                  handleReset();
                }}
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
                className={`flex-1 py-3 px-4 text-center text-sm font-medium transition-colors ${
                  domesticType === "submeters"
                    ? "bg-white text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                With Submeters
              </button>
            </div>
          )}

          {/* Content */}
          <div className="p-8">
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
                    value={units}
                    onChange={(e) => setUnits(e.target.value)}
                    placeholder="e.g., 250"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    min="0"
                    step="1"
                  />
                </div>

                {/* Tariff Information */}
                <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">
                    Domestic Tariff Rates
                  </h3>
                  <div className="text-sm text-blue-800 space-y-1">
                    <p>• 0-100 units: ₹0.00/unit (Free with subsidy)</p>
                    <p>• 101-200 units: ₹2.35/unit</p>
                    <p>• 201-400 units: ₹4.70/unit</p>
                    <p>• 401-500 units: ₹6.30/unit</p>
                    <p>• 501-600 units: ₹8.40/unit</p>
                    <p>• 601-800 units: ₹9.45/unit</p>
                    <p>• 801-1000 units: ₹10.50/unit</p>
                    <p>• Above 1000 units: ₹11.55/unit</p>
                    <p>• Fixed Charge: ₹20.00</p>
                    <p className="mt-2">• Electricity Duty: 2%</p>
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
                      <div className="flex justify-between text-gray-700">
                        <span>Fixed Charge</span>
                        <span className="font-medium">
                          ₹{billDetails.fixedCharge.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between text-gray-700">
                        <span>Subtotal</span>
                        <span className="font-medium">
                          ₹{billDetails.subtotal.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between text-gray-700">
                        <span>Electricity Duty (2%)</span>
                        <span className="font-medium">
                          ₹{billDetails.tax.toFixed(2)}
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
                    <p>• Fixed Charge: ₹20.00 per meter</p>
                    <p className="mt-2">• Electricity Duty: 2%</p>
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
                          <div className="flex justify-between text-gray-700">
                            <span>Fixed Charge</span>
                            <span className="font-medium">
                              ₹{meter.fixedCharge.toFixed(2)}
                            </span>
                          </div>
                          <div className="flex justify-between text-gray-700">
                            <span>Subtotal</span>
                            <span className="font-medium">
                              ₹{meter.subtotal.toFixed(2)}
                            </span>
                          </div>
                          <div className="flex justify-between text-gray-700">
                            <span>Electricity Duty (2%)</span>
                            <span className="font-medium">
                              ₹{meter.tax.toFixed(2)}
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
                        <div className="flex justify-between text-blue-800">
                          <span>Total Fixed Charge</span>
                          <span className="font-medium">
                            ₹{submetersBillDetails.totalFixedCharge.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between text-blue-800">
                          <span>Subtotal</span>
                          <span className="font-medium">
                            ₹{submetersBillDetails.subtotal.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between text-blue-800">
                          <span>Total Electricity Duty (2%)</span>
                          <span className="font-medium">
                            ₹{submetersBillDetails.tax.toFixed(2)}
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
                    <p>• Fixed Charge: ₹50.00</p>
                    <p className="mt-2">• Electricity Duty: 2%</p>
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
                      <div className="flex justify-between text-gray-700">
                        <span>Fixed Charge</span>
                        <span className="font-medium">
                          ₹{billDetails.fixedCharge.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between text-gray-700">
                        <span>Subtotal</span>
                        <span className="font-medium">
                          ₹{billDetails.subtotal.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between text-gray-700">
                        <span>Electricity Duty (2%)</span>
                        <span className="font-medium">
                          ₹{billDetails.tax.toFixed(2)}
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
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-600 text-sm">
          <p>
            Note: Rates are approximate and based on general TNEB tariff
            structure.
          </p>
          <p className="mt-1">
            Actual bills may vary based on specific location and additional
            charges.
          </p>
        </div>
      </div>
    </div>
  );
}
