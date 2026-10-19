// ============================================================================
// BRANCH DIRECTORY — shared by the contact list and map
// To add/edit map pins: Add an object with id, name, address, phone, Google Maps URL,
// and GPS coordinates [latitude, longitude].
// ============================================================================
export type Branch = {
  id: string;
  region: "local" | "international";
  name: string;
  city: string;
  address: string;
  phone: string;
  phoneHref: string;
  mapsUrl: string;
  position: [number, number];
  approximate?: boolean;
};

export const branches: Branch[] = [
  {
    id: "head-office",
    region: "local",
    name: "Head office",
    city: "Dehiwala–Mount Lavinia",
    address: "198 Galle Road, Dehiwala–Mount Lavinia 10370, Colombo",
    phone: "+94 11 433 5444",
    phoneHref: "tel:+94114335444",
    mapsUrl: "https://share.google/jSW5rtcxaXVn9qE5k",
    position: [6.8425904, 79.866525],
  },
  {
    id: "kurunegala",
    region: "local",
    name: "Kurunegala branch",
    city: "Kurunegala",
    address: "No. 72/1, 2nd Floor, Colombo Road, Kurunegala",
    phone: "+94 77 189 1890",
    phoneHref: "tel:+94771891890",
    mapsUrl: "https://share.google/DZbPHs5QIjT5bJpsa",
    position: [7.4870464, 80.364908],
  },
  {
    id: "batticaloa",
    region: "local",
    name: "Batticaloa branch",
    city: "Batticaloa",
    address: "186 1/1, Fathima Building, Trinco Road, Batticaloa",
    phone: "+94 65 222 8448",
    phoneHref: "tel:+94652228448",
    mapsUrl: "https://share.google/W6UfxPkag34xZ8KzM",
    position: [7.7356027, 81.6941956],
  },
  {
    id: "kandy",
    region: "local",
    name: "Kandy branch",
    city: "Kiribathkumbura",
    address: "420/1 Kehelwala Rd, Kiribathkumbura 20442",
    phone: "+94 11 433 5444",
    phoneHref: "tel:+94114335444",
    mapsUrl: "https://maps.google.com/?q=420/1+Kehelwala+Rd,+Kiribathkumbura+20442",
    position: [7.2718, 80.5794],
  },
  {
    id: "nepal",
    region: "international",
    name: "Nepal branch",
    city: "Kathmandu, Nepal",
    address: "Old Baneshwor-10, Kathmandu, Nepal",
    phone: "+94 77 387 6467",
    phoneHref: "tel:+94773876467",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Old+Baneshwor+Kathmandu+Nepal",
    // Area location only; the published address does not identify a building.
    position: [27.7025, 85.3414],
    approximate: true,
  },
  {
    id: "uae",
    region: "international",
    name: "UAE branch",
    city: "Ajman, United Arab Emirates",
    address: "Sheikh Khalifa Street, Ajman, United Arab Emirates",
    phone: "+94 77 387 6467",
    phoneHref: "tel:+94773876467",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Sheikh+Khalifa+Street+Ajman+United+Arab+Emirates",
    // Street-area location only, not a verified office entrance.
    position: [25.3912, 55.4719],
    approximate: true,
  },
];

