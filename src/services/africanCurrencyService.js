// Exchange rates relative to NGN (Nigerian Naira)
const AFRICAN_CURRENCIES = {
  // West Africa
  NGN: {
    code: 'NGN',
    symbol: '₦',
    name: 'Nigerian Naira',
    rate: 1
  },
  GHS: {
    code: 'GHS',
    symbol: 'GH₵',
    name: 'Ghanaian Cedi',
    rate: 0.019 // 1 NGN = 0.019 GHS
  },
  XOF: {
    code: 'XOF',
    symbol: 'CFA',
    name: 'West African CFA',
    rate: 9.84
  }, // For Benin, Burkina Faso, Côte d'Ivoire, Guinea-Bissau, Mali, Niger, Senegal, Togo
  GMD: {
    code: 'GMD',
    symbol: 'D',
    name: 'Gambian Dalasi',
    rate: 8.92
  },
  GNF: {
    code: 'GNF',
    symbol: 'FG',
    name: 'Guinean Franc',
    rate: 147.83
  },
  LRD: {
    code: 'LRD',
    symbol: 'L$',
    name: 'Liberian Dollar',
    rate: 3.12
  },
  SLL: {
    code: 'SLL',
    symbol: 'Le',
    name: 'Sierra Leonean Leone',
    rate: 178.52
  },
  
  // East Africa
  KES: {
    code: 'KES',
    symbol: 'KSh',
    name: 'Kenyan Shilling',
    rate: 0.22 // 1 NGN = 0.22 KES
  },
  TZS: {
    code: 'TZS',
    symbol: 'TSh',
    name: 'Tanzanian Shilling',
    rate: 38.5
  },
  UGX: {
    code: 'UGX',
    symbol: 'USh',
    name: 'Ugandan Shilling',
    rate: 58.4
  },
  RWF: {
    code: 'RWF',
    symbol: 'RF',
    name: 'Rwandan Franc',
    rate: 18.7
  },
  BIF: {
    code: 'BIF',
    symbol: 'FBu',
    name: 'Burundian Franc',
    rate: 47.25
  },
  ETB: {
    code: 'ETB',
    symbol: 'Br',
    name: 'Ethiopian Birr',
    rate: 0.85
  },
  SOS: {
    code: 'SOS',
    symbol: 'Sh',
    name: 'Somali Shilling',
    rate: 92.14
  },
  DJF: {
    code: 'DJF',
    symbol: 'Fdj',
    name: 'Djiboutian Franc',
    rate: 28.95
  },
  ERN: {
    code: 'ERN',
    symbol: 'Nfk',
    name: 'Eritrean Nakfa',
    rate: 2.45
  },
  SSP: {
    code: 'SSP',
    symbol: '£',
    name: 'South Sudanese Pound',
    rate: 12.76
  },
  
  // North Africa
  EGP: {
    code: 'EGP',
    symbol: 'E£',
    name: 'Egyptian Pound',
    rate: 0.047 // 1 NGN = 0.047 EGP
  },
  SDG: {
    code: 'SDG',
    symbol: 'ج.س.',
    name: 'Sudanese Pound',
    rate: 9.72
  },
  LYD: {
    code: 'LYD',
    symbol: 'LD',
    name: 'Libyan Dinar',
    rate: 0.0078
  },
  TND: {
    code: 'TND',
    symbol: 'DT',
    name: 'Tunisian Dinar',
    rate: 0.051
  },
  DZD: {
    code: 'DZD',
    symbol: 'DA',
    name: 'Algerian Dinar',
    rate: 2.19
  },
  MAD: {
    code: 'MAD',
    symbol: 'DH',
    name: 'Moroccan Dirham',
    rate: 0.165
  },
  
  // Southern Africa
  ZAR: {
    code: 'ZAR',
    symbol: 'R',
    name: 'South African Rand',
    rate: 0.037 // 1 NGN = 0.037 ZAR
  },
  ZMW: {
    code: 'ZMW',
    symbol: 'K',
    name: 'Zambian Kwacha',
    rate: 0.031
  },
  BWP: {
    code: 'BWP',
    symbol: 'P',
    name: 'Botswana Pula',
    rate: 0.022
  },
  NAD: {
    code: 'NAD',
    symbol: 'N$',
    name: 'Namibian Dollar',
    rate: 0.037
  },
  LSL: {
    code: 'LSL',
    symbol: 'L',
    name: 'Lesotho Loti',
    rate: 0.037
  },
  SZL: {
    code: 'SZL',
    symbol: 'E',
    name: 'Swazi Lilangeni',
    rate: 0.037
  },
  MZN: {
    code: 'MZN',
    symbol: 'MT',
    name: 'Mozambican Metical',
    rate: 1.03
  },
  MGA: {
    code: 'MGA',
    symbol: 'Ar',
    name: 'Malagasy Ariary',
    rate: 73.41
  },
  ZWL: {
    code: 'ZWL',
    symbol: 'Z$',
    name: 'Zimbabwean Dollar',
    rate: 52.37
  },
  
  // Central Africa
  XAF: {
    code: 'XAF',
    symbol: 'FCFA',
    name: 'Central African CFA',
    rate: 9.84
  }, // For Cameroon, Central African Republic, Chad, Republic of the Congo, Equatorial Guinea, Gabon
  CDF: {
    code: 'CDF',
    symbol: 'FC',
    name: 'Congolese Franc',
    rate: 41.23
  },
  AOA: {
    code: 'AOA',
    symbol: 'Kz',
    name: 'Angolan Kwanza',
    rate: 13.45
  },
  
  // Island Nations
  MUR: {
    code: 'MUR',
    symbol: '₨',
    name: 'Mauritian Rupee',
    rate: 0.73
  },
  SCR: {
    code: 'SCR',
    symbol: '₨',
    name: 'Seychellois Rupee',
    rate: 0.21
  },
  KMF: {
    code: 'KMF',
    symbol: 'CF',
    name: 'Comorian Franc',
    rate: 7.45
  },
  CVE: {
    code: 'CVE',
    symbol: '$',
    name: 'Cape Verdean Escudo',
    rate: 1.67
  },
  STN: {
    code: 'STN',
    symbol: 'Db',
    name: 'São Tomé and Príncipe Dobra',
    rate: 3.56
  }
}

const BASE_PRICES = {
  '3': 700000,
  '5': 1200000,
  '10': 2000000,
  '15': 2400000,
  '20': 3500000
}

class AfricanCurrencyService {
  constructor() {
    this.userCurrency = 'NGN'
    this.userLocation = null
  }

  async detectUserLocation() {
    try {
      const response = await fetch('https://ipapi.co/json/')
      const data = await response.json()
      this.userLocation = {
        country: data.country,
        country_name: data.country_name,
        currency: data.currency
      }
      
      // Set currency if it's an African currency we support
      if (AFRICAN_CURRENCIES[data.currency]) {
        this.userCurrency = data.currency
      }
      
      return this.userLocation
    } catch (error) {
      console.error('Location detection failed:', error)
      return null
    }
  }

  calculatePrice(kWh) {
    let basePrice;
    const numericKWh = Number(kWh) || 0; // Convert to number, default to 0 if NaN

    // Handle custom kWh
    if (!BASE_PRICES[numericKWh]) {
      if (numericKWh <= 0) {
        basePrice = 0;
      } else if (numericKWh <= 3) {
        basePrice = (numericKWh / 3) * BASE_PRICES['3'];
      } else if (numericKWh <= 5) {
        basePrice = (numericKWh / 5) * BASE_PRICES['5'];
      } else if (numericKWh <= 10) {
        basePrice = (numericKWh / 10) * BASE_PRICES['10'];
      } else if (numericKWh <= 15) {
        basePrice = (numericKWh / 15) * BASE_PRICES['15'];
      } else if (numericKWh <= 20) {
        basePrice = (numericKWh / 20) * BASE_PRICES['20'];
      } else {
        // For systems larger than 20kWh
        const pricePerKWh = BASE_PRICES['20'] / 20;
        basePrice = numericKWh * pricePerKWh;
      }
      basePrice = Math.round(basePrice); // Round to nearest whole number
    } else {
      basePrice = BASE_PRICES[numericKWh];
    }

    // Convert to user's currency
    const convertedPrice = this.convertPrice(basePrice);
    
    return {
      basePrice,
      convertedPrice: convertedPrice.price,
      currency: convertedPrice.currency,
      formattedPrice: convertedPrice.formatted
    };
  }

  convertPrice(ngnAmount) {
    const currency = AFRICAN_CURRENCIES[this.userCurrency];
    const convertedAmount = ngnAmount * currency.rate;

    return {
      price: convertedAmount,
      currency: currency.code,
      formatted: `${currency.symbol}${Math.round(convertedAmount).toLocaleString()}`
    };
  }

  getAvailableCurrencies() {
    return AFRICAN_CURRENCIES
  }

  setCurrency(currencyCode) {
    if (AFRICAN_CURRENCIES[currencyCode]) {
      this.userCurrency = currencyCode
      return true
    }
    return false
  }

  getCountryName(currencyCode) {
    return AFRICAN_CURRENCIES[currencyCode]?.name.split(' ')[0] || 'Nigeria'
  }

  getExchangeRate(currencyCode) {
    return AFRICAN_CURRENCIES[currencyCode]?.rate.toFixed(3) || 1
  }

  getSymbol(currencyCode) {
    return AFRICAN_CURRENCIES[currencyCode]?.symbol || '₦'
  }
}

export const africanCurrencyService = new AfricanCurrencyService() 