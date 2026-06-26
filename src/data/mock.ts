import { Product } from '@/types';

// Categories for Sidebar and Navbar
export const CATEGORY_NAMES = [
  "Semiconductors", 
  "Passive Components", 
  "Connectors", 
  "Power Supplies", 
  "Test & Measurement", 
  "Tools & Production",
  "Automation & Control", 
  "Cables & Accessories"
];

// Popular Products for the Homepage
export const POPULAR_PRODUCTS: Product[] = [
  {
    id: "p1",
    brand: "Arduino",
    title: "Arduino Uno R3",
    price: 850.00,
    stock: 50,
    stockText: "In Stock",
    imageUrl: "https://images.unsplash.com/photo-1608564697071-ddf911d81370?w=300&q=80",
    mfrPartNo: "A000066",
    sktPartNo: "SKT-ARD-UNO",
    rating: 4.8,
    reviews: 124,
    features: ["ATmega328P MCU", "14 Digital I/O Pins", "6 Analog Inputs"],
    description: "The Arduino Uno R3 is a microcontroller board based on the ATmega328P.",
    specifications: {
      "Microcontroller": "ATmega328P",
      "Operating Voltage": "5V",
      "Digital I/O Pins": "14",
      "Flash Memory": "32 KB"
    }
  },
  {
    id: "p2",
    brand: "Espressif Systems",
    title: "ESP32 DevKitC",
    price: 320.00,
    stock: 120,
    stockText: "In Stock",
    imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=300&q=80",
    mfrPartNo: "ESP32-DEVKITC",
    sktPartNo: "SKT-ESP32-KIT",
    rating: 4.7,
    reviews: 89,
    features: ["Dual-core Wi-Fi/BT", "Low power", "Rich peripherals"],
    description: "Small-sized ESP32-based development board.",
    specifications: {
      "Core": "Xtensa Dual-Core 32-bit",
      "Connectivity": "Wi-Fi + Bluetooth",
      "Flash": "4MB"
    }
  },
  {
    id: "p3",
    brand: "Yageo",
    title: "1KΩ 1/4W Resistor",
    price: 0.25,
    stock: 10000,
    stockText: "In Stock (10K+)",
    imageUrl: "https://images.unsplash.com/photo-1563770660941-20978e870e26?w=300&q=80",
    mfrPartNo: "RC0603FR-071KL",
    sktPartNo: "SKT-RES-1K",
    rating: 5.0,
    reviews: 45,
    features: ["1% Tolerance", "0603 Package"],
    description: "High quality surface mount resistor.",
    specifications: {
      "Resistance": "1K Ohm",
      "Power Rating": "0.1W",
      "Tolerance": "1%"
    }
  },
  {
    id: "p4",
    brand: "KEMET",
    title: "10µF 25V Capacitor",
    price: 2.50,
    stock: 5000,
    stockText: "In Stock (5K+)",
    imageUrl: "https://images.unsplash.com/photo-1555664424-778a1e5e1b48?w=300&q=80",
    mfrPartNo: "C0603C106K3PAC",
    sktPartNo: "SKT-CAP-10UF",
    rating: 4.9,
    reviews: 62,
    features: ["X5R Dielectric", "Low ESR"],
    description: "Multilayer ceramic capacitor.",
    specifications: {
      "Capacitance": "10uF",
      "Voltage": "25V",
      "Dielectric": "X5R"
    }
  }
];