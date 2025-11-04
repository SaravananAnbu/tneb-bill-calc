"use client";

import { useState } from "react";

type UsageType = "domestic" | "commercial";

interface BillDetails {
  energyCharge: number;
  fixedCharge: number;
  subtotal: number;
  tax: number;
  total: number;
}

// TNEB Tariff Rates (as per latest available rates)
const DOMESTIC_SLABS = [
  { limit: 100, rate: 0 }, // First 100 units free
  { limit: 200, rate: 2.5 }, // 101-200 units
  { limit: 500, rate: 3.0 }, // 201-500 units
  { limit: Infinity, rate: 5.0 }, // Above 500 units
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

function calculateBill(units: number, type: UsageType) {
  if (units <= 0 || isNaN(units)) {
    return null;
  }

  const slabs = type === "domestic" ? DOMESTIC_SLABS : COMMERCIAL_SLABS;
  let remainingUnits = units;
  let totalCharge = 0;
  let previousLimit = 0;

  for (const slab of slabs) {
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

  const fixedCharge = FIXED_CHARGES[type];
  const subtotal = totalCharge + fixedCharge;
  const tax = subtotal * 0.02; // 2% electricity duty
  const total = subtotal + tax;

  return {
    energyCharge: totalCharge,
    fixedCharge,
    subtotal,
    tax,
    total,
  };
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<UsageType>("domestic");
  const [units, setUnits] = useState<string>("");
  const [billDetails, setBillDetails] = useState<BillDetails | null>(null);

  const handleCalculate = () => {
    const unitsNumber = parseFloat(units);
    const result = calculateBill(unitsNumber, activeTab);
    setBillDetails(result);
  };

  const handleReset = () => {
    setUnits("");
    setBillDetails(null);
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
          {/* Tabs */}
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
          </div>

          {/* Content */}
          <div className="p-8">
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
                {activeTab === "domestic" ? "Domestic" : "Commercial"} Tariff
                Rates
              </h3>
              <div className="text-sm text-blue-800 space-y-1">
                {activeTab === "domestic" ? (
                  <>
                    <p>• 0-100 units: ₹0.00/unit (Free)</p>
                    <p>• 101-200 units: ₹2.50/unit</p>
                    <p>• 201-500 units: ₹3.00/unit</p>
                    <p>• Above 500 units: ₹5.00/unit</p>
                    <p>• Fixed Charge: ₹20.00</p>
                  </>
                ) : (
                  <>
                    <p>• 0-100 units: ₹5.50/unit</p>
                    <p>• 101-500 units: ₹7.00/unit</p>
                    <p>• Above 500 units: ₹9.00/unit</p>
                    <p>• Fixed Charge: ₹50.00</p>
                  </>
                )}
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
