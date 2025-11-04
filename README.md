# TNEB Bill Calculator

A modern web application to calculate Tamil Nadu Electricity Board (TNEB) bills for both domestic and commercial usage.

## Features

- 🏠 **Domestic Usage Calculator** - Calculate bills for residential properties with tiered pricing
- 🏢 **Commercial Usage Calculator** - Calculate bills for commercial establishments
- 📊 **Detailed Bill Breakdown** - View energy charges, fixed charges, and taxes separately
- 🎨 **Modern UI** - Built with Tailwind CSS and Ubuntu font for a clean, professional look
- ⚡ **Fast & Responsive** - Built with Next.js 16 for optimal performance
- 📱 **Mobile Friendly** - Responsive design that works on all devices

## Tariff Structure

### Domestic Rates
- 0-100 units: ₹0.00/unit (Free)
- 101-200 units: ₹2.50/unit
- 201-500 units: ₹3.00/unit
- Above 500 units: ₹5.00/unit
- Fixed Charge: ₹20.00
- Electricity Duty: 2%

### Commercial Rates
- 0-100 units: ₹5.50/unit
- 101-500 units: ₹7.00/unit
- Above 500 units: ₹9.00/unit
- Fixed Charge: ₹50.00
- Electricity Duty: 2%

## Getting Started

### Prerequisites

- Node.js 20.x or higher (LTS recommended)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/SaravananAnbu/tneb-bill-calc.git
cd tneb-bill-calc
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm start
```

## Technology Stack

- **Framework**: Next.js 16 (with App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 3
- **Font**: Ubuntu (Google Fonts)
- **Build Tool**: Turbopack

## Usage

1. Select either **Domestic** or **Commercial** tab
2. Enter the number of units consumed
3. Click **Calculate Bill** to see the breakdown
4. View detailed charges including:
   - Energy charge based on slab rates
   - Fixed charge
   - Subtotal
   - Electricity duty (2%)
   - Total amount payable

## Screenshots

### Domestic Bill Calculation
![Domestic Calculator](https://github.com/user-attachments/assets/077837b8-6b0f-4984-a23f-b08756293047)

### Commercial Bill Calculation
![Commercial Calculator](https://github.com/user-attachments/assets/483c6f61-9f38-4221-aa75-3d08b3782747)

## Note

The rates shown are approximate and based on general TNEB tariff structure. Actual bills may vary based on specific location, time of usage, and additional charges imposed by TNEB.

## License

This project is open source and available under the MIT License.

## Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page.
