#!/usr/bin/env python3
"""Generate Philippine government contribution tables and tax tables for 2026."""

import json
import os
from datetime import datetime

OUTPUT_DIR = os.path.join(os.path.dirname(__file__), '..', 'public', 'data')
os.makedirs(OUTPUT_DIR, exist_ok=True)

# ─── SSS Contribution Table 2026 ───
# Based on SS Law (RA 11199) schedule
SSS_TABLE = []
salary_ranges = [
    (3250, 3749.99, 135.00, 585.00),
    (3750, 4249.99, 157.50, 675.00),
    (4250, 4749.99, 180.00, 765.00),
    (4750, 5249.99, 202.50, 855.00),
    (5250, 5749.99, 225.00, 945.00),
    (5750, 6249.99, 247.50, 1035.00),
    (6250, 6749.99, 270.00, 1125.00),
    (6750, 7249.99, 292.50, 1215.00),
    (7250, 7749.99, 315.00, 1305.00),
    (7750, 8249.99, 337.50, 1395.00),
    (8250, 8749.99, 360.00, 1485.00),
    (8750, 9249.99, 382.50, 1575.00),
    (9250, 9749.99, 405.00, 1665.00),
    (9750, 10249.99, 427.50, 1755.00),
    (10250, 10749.99, 450.00, 1845.00),
    (10750, 11249.99, 472.50, 1935.00),
    (11250, 11749.99, 495.00, 2025.00),
    (11750, 12249.99, 517.50, 2115.00),
    (12250, 12749.99, 540.00, 2205.00),
    (12750, 13249.99, 562.50, 2295.00),
    (13250, 13749.99, 585.00, 2385.00),
    (13750, 14249.99, 607.50, 2475.00),
    (14250, 14749.99, 630.00, 2565.00),
    (14750, 15249.99, 652.50, 2655.00),
    (15250, 15749.99, 675.00, 2745.00),
    (15750, 16249.99, 697.50, 2835.00),
    (16250, 16749.99, 720.00, 2925.00),
    (16750, 17249.99, 742.50, 3015.00),
    (17250, 17749.99, 765.00, 3105.00),
    (17750, 18249.99, 787.50, 3195.00),
    (18250, 18749.99, 810.00, 3285.00),
    (18750, 19249.99, 832.50, 3375.00),
    (19250, 19749.99, 855.00, 3465.00),
    (19750, 20249.99, 877.50, 3555.00),
    (20250, 20749.99, 900.00, 3645.00),
    (20750, 21249.99, 922.50, 3735.00),
    (21250, 21749.99, 945.00, 3825.00),
    (21750, 22249.99, 967.50, 3915.00),
    (22250, 22749.99, 990.00, 4005.00),
    (22750, 23249.99, 1012.50, 4095.00),
    (23250, 23749.99, 1035.00, 4185.00),
    (23750, 24249.99, 1057.50, 4275.00),
    (24250, 24749.99, 1080.00, 4365.00),
    (24750, 30249.99, 1102.50, 4455.00),
    (30250, None, 1125.00, 4500.00),  # Max
]

for low, high, ee, er in salary_ranges:
    SSS_TABLE.append({
        "salaryFrom": low,
        "salaryTo": high,
        "employeeShare": ee,
        "employerShare": er,
        "totalContribution": round(ee + er, 2)
    })

# ─── PhilHealth Contribution Table 2026 ───
# 5% of basic salary, floor ₱10,000, ceiling ₱100,000
# Split 50/50 employer-employee
PHILHEALTH_TABLE = []
ph_range = 10000
while ph_range <= 100000:
    contribution = round(ph_range * 0.05, 2)
    half = round(contribution / 2, 2)
    PHILHEALTH_TABLE.append({
        "monthlyBasicSalary": ph_range,
        "totalContribution": contribution,
        "employeeShare": half,
        "employerShare": half,
    })
    if ph_range < 50000:
        ph_range += 5000
    elif ph_range < 80000:
        ph_range += 2500
    else:
        ph_range += 5000
    if ph_range > 100000:
        ph_range = 100000
        break

# ─── Pag-IBIG Contribution Table 2026 ───
# Employee: 1% (≤₱1,500) or 2% (>₱1,500), max ₱200
# Employer: 2% (≤₱1,500) or max contribution ₱200
PAGIBIG_TABLE = []
pagibig_ranges = [
    (0, 1500, 0.01, 0.02),
    (1500.01, 5000, 0.02, 0.02),
    (5000.01, 50000, 0.02, 0.02),
]
for low, high, ee_rate, er_rate in pagibig_ranges:
    PAGIBIG_TABLE.append({
        "salaryFrom": low,
        "salaryTo": high,
        "employeeRate": ee_rate,
        "employerRate": er_rate,
        "employeeMax": 200,
        "employerMax": 200,
    })

# ─── BIR Withholding Tax Table 2026 (TRAIN Law) ───
BIR_TAX_TABLE = [
    {"monthlyFrom": 0, "monthlyTo": 20832, "taxRate": 0, "excessOver": 0, "fixedAmount": 0},
    {"monthlyFrom": 20833, "monthlyTo": 33332, "taxRate": 0.15, "excessOver": 20832, "fixedAmount": 0},
    {"monthlyFrom": 33333, "monthlyTo": 66666, "taxRate": 0.20, "excessOver": 33332, "fixedAmount": 1875},
    {"monthlyFrom": 66667, "monthlyTo": 166666, "taxRate": 0.25, "excessOver": 66666, "fixedAmount": 8541.80},
    {"monthlyFrom": 166667, "monthlyTo": 666666, "taxRate": 0.30, "excessOver": 166666, "fixedAmount": 33541.80},
    {"monthlyFrom": 666667, "monthlyTo": None, "taxRate": 0.35, "excessOver": 666666, "fixedAmount": 183541.80},
]

# ─── Transport Fare Matrix 2026 ───
TRANSPORT_FARES = {
    "lastUpdated": datetime.now().isoformat(),
    "jeepney": {
        "traditional": {
            "minimumFare": 14,
            "perKm": 2.00,
            "studentDiscount": 0.20,
            "seniorDiscount": 0.20,
        },
        "modern": {
            "minimumFare": 17,
            "perKm": 2.40,
            "studentDiscount": 0.20,
            "seniorDiscount": 0.20,
        }
    },
    "lrt1": {
        "name": "LRT-1",
        "operator": "LRMC",
        "lastUpdated": "2026-03-23",
        "stations": [
            {"id": 1, "name": "Roosevelt", "zone": 1},
            {"id": 2, "name": "Balintawak", "zone": 1},
            {"id": 3, "name": "Monumento", "zone": 1},
            {"id": 4, "name": "5th Avenue", "zone": 1},
            {"id": 5, "name": "R. Papa", "zone": 1},
            {"id": 6, "name": "Abad Santos", "zone": 1},
            {"id": 7, "name": "Blumentritt", "zone": 1},
            {"id": 8, "name": "Tayuman", "zone": 1},
            {"id": 9, "name": "Bambang", "zone": 1},
            {"id": 10, "name": "Carriedo", "zone": 2},
            {"id": 11, "name": "Central Terminal", "zone": 2},
            {"id": 12, "name": "UN Avenue", "zone": 2},
            {"id": 13, "name": "Pedro Gil", "zone": 2},
            {"id": 14, "name": "Quirino", "zone": 2},
            {"id": 15, "name": "Vito Cruz", "zone": 2},
            {"id": 16, "name": "Baclaran", "zone": 3},
        ],
        "fareMatrix": {
            "singleJourney": {
                "1Zone": {"regular": 15, "student": 12, "senior": 12},
                "2Zone": {"regular": 20, "student": 16, "senior": 16},
                "3Zone": {"regular": 25, "student": 20, "senior": 20},
            },
            "storedValue": {
                "1Zone": {"regular": 14, "student": 11, "senior": 11},
                "2Zone": {"regular": 19, "student": 15, "senior": 15},
                "3Zone": {"regular": 24, "student": 19, "senior": 19},
            }
        }
    },
    "lrt2": {
        "name": "LRT-2",
        "lastUpdated": "2026-03-23",
        "discount": "50% across the board",
        "stations": [
            {"id": 1, "name": "Recto", "zone": 1},
            {"id": 2, "name": "Legarda", "zone": 1},
            {"id": 3, "name": "Pureza", "zone": 1},
            {"id": 4, "name": "V. Mapa", "zone": 1},
            {"id": 5, "name": "J. Ruiz", "zone": 2},
            {"id": 6, "name": "Gilmore", "zone": 2},
            {"id": 7, "name": "Betty Go-Belmonte", "zone": 2},
            {"id": 8, "name": "Cubao", "zone": 2},
            {"id": 9, "name": "Anonas", "zone": 3},
            {"id": 10, "name": "Katipunan", "zone": 3},
            {"id": 11, "name": "Santolan", "zone": 3},
            {"id": 12, "name": "Marikina-Pasig", "zone": 3},
            {"id": 13, "name": "Antipolo", "zone": 4},
        ],
        "fareMatrix": {
            "regular": 15,
            "maxFare": 35,
            "studentSenior": "50% discount"
        }
    },
    "mrt3": {
        "name": "MRT-3",
        "lastUpdated": "2026-03-23",
        "discount": "50% across the board",
        "stations": [
            {"id": 1, "name": "North Avenue", "zone": 1},
            {"id": 2, "name": "Quezon Avenue", "zone": 1},
            {"id": 3, "name": "GMA-Kamuning", "zone": 1},
            {"id": 4, "name": "Cubao", "zone": 2},
            {"id": 5, "name": "Santolan-Annapolis", "zone": 2},
            {"id": 6, "name": "Ortigas", "zone": 2},
            {"id": 7, "name": "Shaw Boulevard", "zone": 3},
            {"id": 8, "name": "Boni", "zone": 3},
            {"id": 9, "name": "Guadalupe", "zone": 3},
            {"id": 10, "name": "Buendia", "zone": 4},
            {"id": 11, "name": "Ayala", "zone": 4},
            {"id": 12, "name": "Magallanes", "zone": 4},
            {"id": 13, "name": "Taft Avenue", "zone": 5},
        ],
        "fareMatrix": {
            "regular": 13,
            "maxFare": 28,
            "studentSenior": "50% discount"
        }
    },
    "bus": {
        "aircon": {"minimumFare": 15, "perKm": 1.90},
        "nonAircon": {"minimumFare": 12, "perKm": 1.50},
    },
    "taxi": {
        "flagdown": 50,
        "perKm": 15,
        "waitingPerMinute": 2.00,
    },
    "grabcash": {
        "baseFare": 50,
        "perKm": 12,
        "minFare": 100,
    }
}

# ─── LTO Registration Fees 2026 ───
LTO_FEES = {
    "lastUpdated": datetime.now().isoformat(),
    "mvuc": {
        "motorcycle": [
            {"weight": "Below 200cc", "fee": 240},
            {"weight": "201-400cc", "fee": 300},
            {"weight": "401-600cc", "fee": 400},
            {"weight": "601cc and above", "fee": 600},
        ],
        "privateCar": [
            {"weight": "Up to 1,600 kg", "fee": 1600},
            {"weight": "1,601-2,300 kg", "fee": 3600},
            {"weight": "2,301-3,500 kg", "fee": 4800},
            {"weight": "3,501-5,000 kg", "fee": 6000},
            {"weight": "5,001-6,500 kg", "fee": 7200},
            {"weight": "6,501-8,000 kg", "fee": 8400},
            {"weight": "8,001-10,000 kg", "fee": 9600},
            {"weight": "10,001-12,500 kg", "fee": 10800},
            {"weight": "12,501-15,000 kg", "fee": 12000},
            {"weight": "15,001-20,000 kg", "fee": 15000},
        ],
        "publicUtility": [
            {"weight": "Up to 1,600 kg", "fee": 1800},
            {"weight": "1,601-2,300 kg", "fee": 3600},
            {"weight": "2,301-3,500 kg", "fee": 4800},
            {"weight": "3,501-5,000 kg", "fee": 6000},
            {"weight": "5,001-8,000 kg", "fee": 8400},
            {"weight": "8,001-12,500 kg", "fee": 10800},
        ]
    },
    "otherFees": {
        "registrationFee": 400,
        "plateNumber": 450,
        "stencilFee": 50,
        "emissionTest": {"smoke": 450, "gasoline": 450},
        "ctplInsurance": {"motorcycle": 500, "privateCar": 850, "publicUtility": 1200},
        "inspectionFee": 90,
        "penaltyPerDay": 50,
        "maxPenalty": 2000,
    },
    "renewal": {
        "registrationFee": 400,
        "mvucMultiplier": 1.0,
    }
}

# ─── Shopee/Lazada Seller Fees 2026 ───
MARKETPLACE_FEES = {
    "lastUpdated": datetime.now().isoformat(),
    "shopee": {
        "name": "Shopee Philippines",
        "fees": {
            "commission": {
                "marketplace": {"min": 0.01, "max": 0.06, "description": "1%-6% of selling price"},
                "mall": {"min": 0.01, "max": 0.08, "description": "1%-8% of selling price"},
            },
            "serviceFee": {
                "marketplace": 0.056,
                "mall": 0.0448,
                "description": "5.6% marketplace, 4.48% Mall"
            },
            "transactionFee": 0.0224,
            "paymentFee": 0.02,
            "shippingFee": {
                "seller": "5.6% of shipping fee (marketplace)",
                "mall": "4.48% of shipping fee",
            },
            "failedDelivery": 35,
            "returnShipping": "Seller pays return shipping",
            "techFee": {
                "marketplace": 0.02,
                "mall": 0.03,
                "description": "2%-3% tech fee"
            }
        },
        "exampleCalculation": {
            "price": 500,
            "commission": "₱25 (5%)",
            "serviceFee": "₱28 (5.6%)",
            "transactionFee": "₱11.20 (2.24%)",
            "totalFees": "₱64.20",
            "netReceive": "₱435.80"
        }
    },
    "lazada": {
        "name": "Lazada Philippines",
        "fees": {
            "commission": {
                "marketplace": {"min": 0.01, "max": 0.065, "description": "1%-6.5%"},
                "mall": {"min": 0.01, "max": 0.08, "description": "1%-8%"},
            },
            "paymentFee": 0.0224,
            "serviceFee": 0.056,
            "fulfillmentFee": "Varies by weight/distance",
            "returnShipping": "Lazada covers for mall items",
        },
        "exampleCalculation": {
            "price": 500,
            "commission": "₱22.50 (4.5%)",
            "paymentFee": "₱11.20 (2.24%)",
            "serviceFee": "₱28 (5.6%)",
            "totalFees": "₱61.70",
            "netReceive": "₱438.30"
        }
    },
    "tiktokshop": {
        "name": "TikTok Shop Philippines",
        "fees": {
            "commission": {"min": 0.01, "max": 0.05, "description": "1%-5%"},
            "paymentFee": 0.02,
            "serviceFee": 0.05,
        }
    }
}

# ─── Write all files ───
def write_json(filename, data):
    path = os.path.join(OUTPUT_DIR, filename)
    with open(path, 'w') as f:
        json.dump(data, f, indent=2)
    print(f"✅ Written: {filename} ({os.path.getsize(path)} bytes)")

write_json("sss-contributions.json", {
    "lastUpdated": datetime.now().isoformat(),
    "year": 2026,
    "description": "SSS Contribution Table 2026 (RA 11199)",
    "table": SSS_TABLE
})

write_json("philhealth-contributions.json", {
    "lastUpdated": datetime.now().isoformat(),
    "year": 2026,
    "rate": "5% of monthly basic salary",
    "floor": 10000,
    "ceiling": 100000,
    "split": "50/50 employer-employee",
    "table": PHILHEALTH_TABLE
})

write_json("pagibig-contributions.json", {
    "lastUpdated": datetime.now().isoformat(),
    "year": 2026,
    "description": "Pag-IBIG (HDMF) Contribution Table 2026",
    "table": PAGIBIG_TABLE
})

write_json("bir-tax-table.json", {
    "lastUpdated": datetime.now().isoformat(),
    "year": 2026,
    "description": "BIR Withholding Tax Table 2026 (TRAIN Law)",
    "table": BIR_TAX_TABLE
})

write_json("transport-fares.json", TRANSPORT_FARES)
write_json("lto-fees.json", LTO_FEES)
write_json("marketplace-fees.json", MARKETPLACE_FEES)

print(f"\n🎉 All contribution/tax/transport/marketplace data generated!")
print(f"📁 Output: {OUTPUT_DIR}")
