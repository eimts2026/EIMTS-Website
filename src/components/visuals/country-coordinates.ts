/**
 * [latitude, longitude] for every ISO 3166-1 country or territory (plus XK)
 * that has a flag in `country-flag-icons`. Capital cities where the pin reads
 * better than the geographic center, otherwise Google's public country
 * centroids (https://developers.google.com/public-data/docs/canonical/countries_csv),
 * and Wikidata (CC0) for codes missing there.
 */
export const COUNTRY_COORDINATES: Record<string, [number, number]> = {
  AD: [42.5063, 1.5218], // Andorra
  AE: [24.4539, 54.3773], // United Arab Emirates
  AF: [33.9391, 67.71], // Afghanistan
  AG: [17.1274, -61.8468], // Antigua and Barbuda
  AI: [18.2206, -63.0686], // Anguilla
  AL: [41.3275, 19.8187], // Albania
  AM: [40.1792, 44.4991], // Armenia
  AO: [-8.839, 13.2894], // Angola
  AQ: [-75.251, -0.0714], // Antarctica
  AR: [-34.6037, -58.3816], // Argentina
  AS: [-14.271, -170.1322], // American Samoa
  AT: [48.2082, 16.3738], // Austria
  AU: [-35.2809, 149.13], // Australia
  AW: [12.5211, -69.9683], // Aruba
  AX: [60.0986, 19.9444], // Åland Islands
  AZ: [40.4093, 49.8671], // Azerbaijan
  BA: [43.8563, 18.4131], // Bosnia and Herzegovina
  BB: [13.1132, -59.5988], // Barbados
  BD: [23.8103, 90.4125], // Bangladesh
  BE: [50.8503, 4.3517], // Belgium
  BF: [12.3714, -1.5197], // Burkina Faso
  BG: [42.6977, 23.3219], // Bulgaria
  BH: [26.2285, 50.586], // Bahrain
  BI: [-3.3761, 29.3599], // Burundi
  BJ: [6.4969, 2.6283], // Benin
  BL: [17.8986, -62.8492], // Saint Barthélemy
  BM: [32.3214, -64.7574], // Bermuda
  BN: [4.9031, 114.9398], // Brunei
  BO: [-16.4897, -68.1193], // Bolivia
  BQ: [12.1833, -68.2333], // Caribbean Netherlands
  BR: [-15.7975, -47.8919], // Brazil
  BS: [25.048, -77.3554], // Bahamas
  BT: [27.4728, 89.639], // Bhutan
  BV: [-54.4232, 3.4132], // Bouvet Island
  BW: [-24.6282, 25.9231], // Botswana
  BY: [53.7098, 27.9534], // Belarus
  BZ: [17.251, -88.759], // Belize
  CA: [45.4215, -75.6972], // Canada
  CC: [-12.1642, 96.871], // Cocos [Keeling] Islands
  CD: [-4.0383, 21.7587], // Congo [DRC]
  CF: [6.6111, 20.9394], // Central African Republic
  CG: [-4.2634, 15.2429], // Congo
  CH: [46.948, 7.4474], // Switzerland
  CI: [6.8276, -5.2893], // Côte d'Ivoire
  CK: [-21.2367, -159.7777], // Cook Islands
  CL: [-33.4489, -70.6693], // Chile
  CM: [3.848, 11.5021], // Cameroon
  CN: [35.8617, 104.1954], // China
  CO: [4.711, -74.0721], // Colombia
  CR: [9.9281, -84.0907], // Costa Rica
  CU: [21.5218, -77.7812], // Cuba
  CV: [14.9315, -23.5087], // Cabo Verde
  CW: [12.108, -68.935], // Curaçao
  CX: [-10.4475, 105.6904], // Christmas Island
  CY: [35.1856, 33.3823], // Cyprus
  CZ: [50.0755, 14.4378], // Czech Republic
  DE: [52.52, 13.405], // Germany
  DJ: [11.5721, 43.1456], // Djibouti
  DK: [55.6761, 12.5683], // Denmark
  DM: [15.3017, -61.3881], // Dominica
  DO: [18.4861, -69.9312], // Dominican Republic
  DZ: [36.7538, 3.0588], // Algeria
  EC: [-0.1807, -78.4678], // Ecuador
  EE: [59.437, 24.7536], // Estonia
  EG: [30.0444, 31.2357], // Egypt
  EH: [24.2155, -12.8858], // Western Sahara
  ER: [15.1794, 39.7823], // Eritrea
  ES: [40.4168, -3.7038], // Spain
  ET: [9.145, 40.4897], // Ethiopia
  FI: [60.1699, 24.9384], // Finland
  FJ: [-18.1416, 178.4419], // Fiji
  FK: [-51.7963, -59.5236], // Falkland Islands [Islas Malvinas]
  FM: [6.9248, 158.161], // Micronesia
  FO: [61.8926, -6.9118], // Faroe Islands
  FR: [48.8566, 2.3522], // France
  GA: [0.4162, 9.4673], // Gabon
  GB: [51.5074, -0.1278], // United Kingdom
  GD: [12.0561, -61.7486], // Grenada
  GE: [41.7151, 44.8271], // Georgia
  GF: [3.9339, -53.1258], // French Guiana
  GG: [49.4657, -2.5853], // Guernsey
  GH: [5.6037, -0.187], // Ghana
  GI: [36.1377, -5.3454], // Gibraltar
  GL: [71.7069, -42.6043], // Greenland
  GM: [13.4549, -16.579], // Gambia
  GN: [9.6412, -13.5784], // Guinea
  GP: [16.996, -62.0676], // Guadeloupe
  GQ: [3.7523, 8.7742], // Equatorial Guinea
  GR: [37.9838, 23.7275], // Greece
  GS: [-54.4296, -36.5879], // South Georgia and the South Sandwich Islands
  GT: [14.6349, -90.5069], // Guatemala
  GU: [13.4443, 144.7937], // Guam
  GW: [11.8637, -15.598], // Guinea-Bissau
  GY: [6.8013, -58.1551], // Guyana
  HK: [22.3193, 114.1694], // Hong Kong
  HM: [-53.0818, 73.5042], // Heard Island and McDonald Islands
  HN: [14.065, -87.1715], // Honduras
  HR: [45.815, 15.9819], // Croatia
  HT: [18.5944, -72.3074], // Haiti
  HU: [47.4979, 19.0402], // Hungary
  ID: [-6.2088, 106.8456], // Indonesia
  IE: [53.3498, -6.2603], // Ireland
  IL: [31.7683, 35.2137], // Israel
  IM: [54.2361, -4.5481], // Isle of Man
  IN: [28.6139, 77.209], // India
  IO: [-6.3432, 71.8765], // British Indian Ocean Territory
  IQ: [33.3152, 44.3661], // Iraq
  IR: [32.4279, 53.688], // Iran
  IS: [64.1466, -21.9426], // Iceland
  IT: [41.9028, 12.4964], // Italy
  JE: [49.2144, -2.1313], // Jersey
  JM: [18.0179, -76.8099], // Jamaica
  JO: [31.9454, 35.9284], // Jordan
  JP: [35.6762, 139.6503], // Japan
  KE: [-1.2921, 36.8219], // Kenya
  KG: [42.8746, 74.5698], // Kyrgyzstan
  KH: [11.5564, 104.9282], // Cambodia
  KI: [1.3382, 172.9784], // Kiribati
  KM: [-11.7172, 43.2473], // Comoros
  KN: [17.3026, -62.7177], // Saint Kitts and Nevis
  KP: [40.3399, 127.5101], // North Korea
  KR: [37.5665, 126.978], // South Korea
  KW: [29.3759, 47.9774], // Kuwait
  KY: [19.5135, -80.567], // Cayman Islands
  KZ: [51.1694, 71.4491], // Kazakhstan
  LA: [17.9757, 102.6331], // Laos
  LB: [33.8938, 35.5018], // Lebanon
  LC: [14.0101, -60.987], // Saint Lucia
  LI: [47.141, 9.5209], // Liechtenstein
  LK: [6.9271, 79.8612], // Sri Lanka
  LR: [6.2907, -10.7605], // Liberia
  LS: [-29.3142, 27.4833], // Lesotho
  LT: [54.6872, 25.2797], // Lithuania
  LU: [49.6116, 6.1319], // Luxembourg
  LV: [56.9496, 24.1052], // Latvia
  LY: [26.3351, 17.2283], // Libya
  MA: [33.9716, -6.8498], // Morocco
  MC: [43.7384, 7.4246], // Monaco
  MD: [47.0105, 28.8638], // Moldova
  ME: [42.4304, 19.2594], // Montenegro
  MF: [18.0667, -63.0847], // Saint Martin
  MG: [-18.8792, 47.5079], // Madagascar
  MH: [7.1164, 171.1858], // Marshall Islands
  MK: [41.9973, 21.428], // North Macedonia
  ML: [17.5707, -3.9962], // Mali
  MM: [21.914, 95.9562], // Myanmar [Burma]
  MN: [47.8864, 106.9057], // Mongolia
  MO: [22.1987, 113.5439], // Macau
  MP: [17.3308, 145.3847], // Northern Mariana Islands
  MQ: [14.6415, -61.0242], // Martinique
  MR: [18.0735, -15.9582], // Mauritania
  MS: [16.7425, -62.1874], // Montserrat
  MT: [35.8989, 14.5146], // Malta
  MU: [-20.1609, 57.5012], // Mauritius
  MV: [4.1755, 73.5093], // Maldives
  MW: [-13.9626, 33.7741], // Malawi
  MX: [19.4326, -99.1332], // Mexico
  MY: [3.139, 101.6869], // Malaysia
  MZ: [-25.9692, 32.5732], // Mozambique
  NA: [-22.5609, 17.0658], // Namibia
  NC: [-20.9043, 165.618], // New Caledonia
  NE: [13.5116, 2.1254], // Niger
  NF: [-29.0408, 167.9547], // Norfolk Island
  NG: [9.0765, 7.3986], // Nigeria
  NI: [12.8654, -85.2072], // Nicaragua
  NL: [52.3676, 4.9041], // Netherlands
  NO: [59.9139, 10.7522], // Norway
  NP: [27.7172, 85.324], // Nepal
  NR: [-0.5228, 166.9315], // Nauru
  NU: [-19.0544, -169.8672], // Niue
  NZ: [-41.2866, 174.7756], // New Zealand
  OM: [23.588, 58.3829], // Oman
  PA: [8.9824, -79.5199], // Panama
  PE: [-12.0464, -77.0428], // Peru
  PF: [-17.6797, -149.4068], // French Polynesia
  PG: [-9.4438, 147.1803], // Papua New Guinea
  PH: [14.5995, 120.9842], // Philippines
  PK: [33.6844, 73.0479], // Pakistan
  PL: [52.2297, 21.0122], // Poland
  PM: [46.9419, -56.2711], // Saint Pierre and Miquelon
  PN: [-24.7036, -127.4393], // Pitcairn Islands
  PR: [18.2208, -66.5901], // Puerto Rico
  PS: [31.9038, 35.2034], // Palestine
  PT: [38.7223, -9.1393], // Portugal
  PW: [7.515, 134.5825], // Palau
  PY: [-25.2637, -57.5759], // Paraguay
  QA: [25.2854, 51.531], // Qatar
  RE: [-21.1151, 55.5364], // Réunion
  RO: [44.4268, 26.1025], // Romania
  RS: [44.7866, 20.4489], // Serbia
  RU: [61.524, 105.3188], // Russia
  RW: [-1.9403, 29.8739], // Rwanda
  SA: [24.7136, 46.6753], // Saudi Arabia
  SB: [-9.4295, 160.0388], // Solomon Islands
  SC: [-4.6191, 55.4513], // Seychelles
  SD: [12.8628, 30.2176], // Sudan
  SE: [59.3293, 18.0686], // Sweden
  SG: [1.3521, 103.8198], // Singapore
  SH: [-24.1435, -10.0307], // Saint Helena
  SI: [46.0569, 14.5058], // Slovenia
  SJ: [77.5536, 23.6703], // Svalbard and Jan Mayen
  SK: [48.1486, 17.1077], // Slovakia
  SL: [8.4657, -13.2317], // Sierra Leone
  SM: [43.9424, 12.4578], // San Marino
  SN: [14.7167, -17.4677], // Senegal
  SO: [5.1521, 46.1996], // Somalia
  SR: [5.852, -55.2038], // Suriname
  SS: [4.8539, 31.5825], // South Sudan
  ST: [0.3365, 6.7273], // São Tomé and Príncipe
  SV: [13.6929, -89.2182], // El Salvador
  SX: [18.0242, -63.0433], // Sint Maarten
  SY: [34.8021, 38.9968], // Syria
  SZ: [-26.3054, 31.1367], // Eswatini
  TC: [21.694, -71.7979], // Turks and Caicos Islands
  TD: [12.1348, 15.0557], // Chad
  TF: [-49.2804, 69.3486], // French Southern Territories
  TG: [6.1256, 1.2254], // Togo
  TH: [13.7563, 100.5018], // Thailand
  TJ: [38.5598, 68.774], // Tajikistan
  TK: [-8.9674, -171.8559], // Tokelau
  TL: [-8.5569, 125.5603], // Timor-Leste
  TM: [37.9601, 58.3261], // Turkmenistan
  TN: [36.8065, 10.1815], // Tunisia
  TO: [-21.2148, -175.1982], // Tonga
  TR: [39.9334, 32.8597], // Türkiye
  TT: [10.6549, -61.5019], // Trinidad and Tobago
  TV: [-8.5199, 179.1979], // Tuvalu
  TW: [25.033, 121.5654], // Taiwan
  TZ: [-6.163, 35.7516], // Tanzania
  UA: [50.4501, 30.5234], // Ukraine
  UG: [0.3476, 32.5825], // Uganda
  UM: [19.3, 166.6333], // U.S. Outlying Islands
  US: [37.0902, -95.7129], // United States
  UY: [-34.9011, -56.1645], // Uruguay
  UZ: [41.2995, 69.2401], // Uzbekistan
  VA: [41.9029, 12.4534], // Vatican City
  VC: [13.1587, -61.2248], // Saint Vincent and the Grenadines
  VE: [6.4238, -66.5897], // Venezuela
  VG: [18.4207, -64.64], // British Virgin Islands
  VI: [18.3358, -64.8963], // U.S. Virgin Islands
  VN: [21.0285, 105.8542], // Vietnam
  VU: [-17.7333, 168.3273], // Vanuatu
  WF: [-13.7688, -177.1561], // Wallis and Futuna
  WS: [-13.8506, -171.7514], // Samoa
  XK: [42.6026, 20.903], // Kosovo
  YE: [15.5527, 48.5164], // Yemen
  YT: [-12.8275, 45.1662], // Mayotte
  ZA: [-25.7479, 28.2293], // South Africa
  ZM: [-15.3875, 28.3228], // Zambia
  ZW: [-17.8292, 31.0522], // Zimbabwe
};
