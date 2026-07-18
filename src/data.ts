// Catalog data. Product names and descriptions are natural English — the same
// strings the localization pipeline will translate alongside the UI chrome.
export interface Product {
  id: string;
  name: string;
  blurb: string;
  price: string;
}

export const PRODUCTS: Product[] = [
  { id: "tote", name: "Canvas market tote", blurb: "Roomy cotton tote for the weekly shop.", price: "$18" },
  { id: "mug", name: "Stoneware mug", blurb: "Hand-glazed mug that keeps coffee warm.", price: "$14" },
  { id: "notebook", name: "Dot-grid notebook", blurb: "A hundred pages for lists, plans, and sketches.", price: "$9" },
  { id: "bottle", name: "Insulated water bottle", blurb: "Stays cold all day, fits most cup holders.", price: "$22" },
  { id: "candle", name: "Soy candle", blurb: "Cedar and citrus, forty hours of burn time.", price: "$16" },
  { id: "socks", name: "Merino socks", blurb: "Warm, breathable, and cushioned for long days.", price: "$12" },
];
