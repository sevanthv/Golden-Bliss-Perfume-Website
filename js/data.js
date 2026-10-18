// ===================================================
// GOLDEN BLISS - LUXURY PERFUME CATALOG DATABASE
// ===================================================

const perfumeProducts = [
    {
        id: "1",
        name: "Midnight Rose",
        subtitle: "Haute Parfumerie • Eau de Parfum",
        gender: "women",
        family: "floral",
        badge: "Best Seller",
        rating: 4.9,
        reviewsCount: 142,
        image: "images/perfume1.jpg",
        defaultSize: "50ml",
        sizes: [
            { size: "30ml", price: 1799 },
            { size: "50ml", price: 2499 },
            { size: "100ml", price: 3499 }
        ],
        description: "An intoxicating symphony of velvety Damask roses bathed in midnight moonlight, balanced with warm Madagascar vanilla and radiant white musk for an unforgettable evening trail.",
        notes: {
            top: ["🌹 Damask Rose", "✨ Pink Pepper", "🍊 Italian Bergamot"],
            heart: ["🌸 French Peony", "🍦 Madagascar Vanilla", "🌿 Sambac Jasmine"],
            base: ["🤍 White Musk", "🌲 Amberwood", "🪵 Cedar"]
        },
        longevity: "10-12 Hours",
        sillage: "Strong & Enveloping",
        occasion: "Evening & Special Occasions",
        isFeatured: true
    },
    {
        id: "2",
        name: "Royal Oud",
        subtitle: "Private Reserve • Extrait de Parfum",
        gender: "men",
        family: "woody",
        badge: "Signature",
        rating: 5.0,
        reviewsCount: 188,
        image: "images/perfume2.jpg",
        defaultSize: "50ml",
        sizes: [
            { size: "30ml", price: 2299 },
            { size: "50ml", price: 3299 },
            { size: "100ml", price: 4499 }
        ],
        description: "Regal Cambodian oud masterfully blended with warm golden amber, smoky incense, and creamy Mysore sandalwood. A majestic fragrance projecting power, luxury, and supreme prestige.",
        notes: {
            top: ["🌲 Cambodian Oud", "🫚 Cardamom", "🍋 Rare Bergamot"],
            heart: ["🪵 Mysore Sandalwood", "🔥 Warm Amber", "🌿 Patchouli"],
            base: ["💨 Smoky Incense", "🦌 Tonka Bean", "✨ Leather Accord"]
        },
        longevity: "14+ Hours",
        sillage: "Majestic & Heavy",
        occasion: "Formal & Luxury Events",
        isFeatured: true
    },
    {
        id: "3",
        name: "Ocean Breeze",
        subtitle: "Mediterranean Coast • Eau de Parfum",
        gender: "unisex",
        family: "fresh",
        badge: "Trending",
        rating: 4.8,
        reviewsCount: 96,
        image: "images/perfume3.jpg",
        defaultSize: "50ml",
        sizes: [
            { size: "30ml", price: 1399 },
            { size: "50ml", price: 1999 },
            { size: "100ml", price: 2899 }
        ],
        description: "Crisp salty sea air merging with sun-drenched Amalfi lemons, crushed mint leaves, and a clean mineral driftwood base. Evokes the serene luxury of a yacht cruise along the Riviera.",
        notes: {
            top: ["🌊 Sea Salt", "🍋 Amalfi Lemon", "🍃 Crisp Mint"],
            heart: ["🌿 Sea Sage", "🌸 Lotus Flower", "🍊 Neroli"],
            base: ["🪵 Driftwood", "🤍 Clean Musk", "☀️ Golden Amber"]
        },
        longevity: "8-10 Hours",
        sillage: "Moderate & Refreshing",
        occasion: "Daily Wear & Summer Days",
        isFeatured: true
    },
    {
        id: "4",
        name: "Golden Amber",
        subtitle: "L'Elixir Rare • Eau de Parfum",
        gender: "men",
        family: "oriental",
        badge: "Exclusive",
        rating: 4.9,
        reviewsCount: 115,
        image: "images/perfume4.jpg",
        defaultSize: "50ml",
        sizes: [
            { size: "30ml", price: 1999 },
            { size: "50ml", price: 2899 },
            { size: "100ml", price: 3999 }
        ],
        description: "An opulent oriental masterpiece featuring luminous golden amber crystals, caramelized vanilla, spiced saffron, and a base of dark velvet woods that wrap around you like pure silk.",
        notes: {
            top: ["✨ Golden Saffron", "🍊 Mandarin Zest", "🌿 Nutmeg"],
            heart: ["🔥 Amber Resin", "🍯 Honey Accord", "🪵 Guaiac Wood"],
            base: ["🍦 Tahitian Vanilla", "🤍 Cashmere Wood", "🦌 Musk"]
        },
        longevity: "12-14 Hours",
        sillage: "Rich & Magnetic",
        occasion: "Date Nights & Winter Galas",
        isFeatured: true
    },
    {
        id: "5",
        name: "Velvet Santal",
        subtitle: "Botanical Reserve • Eau de Parfum",
        gender: "unisex",
        family: "woody",
        badge: "New Arrival",
        rating: 4.7,
        reviewsCount: 64,
        image: "images/perfume2.jpg",
        defaultSize: "50ml",
        sizes: [
            { size: "30ml", price: 1899 },
            { size: "50ml", price: 2699 },
            { size: "100ml", price: 3699 }
        ],
        description: "Warm Australian sandalwood embraced by creamy coconut milk, iris root, and delicate violet leaves. A soothing, modern woody aroma that feels both intimate and effortlessly elegant.",
        notes: {
            top: ["🌿 Violet Leaf", "🫚 Cardamom", "🍃 Papyrus"],
            heart: ["🪵 Sandalwood", "🌸 Florentine Iris", "🥥 Coconut Milk"],
            base: ["🌲 Cedar", "🤍 Ambergris", "✨ Leather"]
        },
        longevity: "10-12 Hours",
        sillage: "Warm & Sophisticated",
        occasion: "Signature Daily & Business",
        isFeatured: false
    },
    {
        id: "6",
        name: "Celestial Jasmine",
        subtitle: "Fleurs Précieuses • Eau de Parfum",
        gender: "women",
        family: "floral",
        badge: "Limited Edition",
        rating: 4.9,
        reviewsCount: 83,
        image: "images/perfume1.jpg",
        defaultSize: "50ml",
        sizes: [
            { size: "30ml", price: 1999 },
            { size: "50ml", price: 2799 },
            { size: "100ml", price: 3899 }
        ],
        description: "Night-blooming royal jasmine plucked at dusk in Grasse, kissed by fresh pear, white tuberose, and soft cashmere. An ethereal floral bouquet that radiates grace and timeless charm.",
        notes: {
            top: ["🍐 Crisp Green Pear", "🍊 Bergamot", "🌸 White Freesia"],
            heart: ["🌿 Night Jasmine", "💮 Grasse Tuberose", "🌺 Orange Blossom"],
            base: ["🤍 Cashmere Musk", "🌲 Cedarwood", "🍦 Vanilla Glaze"]
        },
        longevity: "9-11 Hours",
        sillage: "Graceful & Radiant",
        occasion: "Spring Days & Weddings",
        isFeatured: false
    },
    {
        id: "7",
        name: "Noir Extreme",
        subtitle: "Nuit Mystique • Extrait de Parfum",
        gender: "men",
        family: "oriental",
        badge: "Intense",
        rating: 4.8,
        reviewsCount: 102,
        image: "images/perfume4.jpg",
        defaultSize: "50ml",
        sizes: [
            { size: "30ml", price: 2199 },
            { size: "50ml", price: 3199 },
            { size: "100ml", price: 4299 }
        ],
        description: "An irresistible gourmand-oriental explosion of roasted cardamom, spicy nutmeg, dark roasted coffee, and rich kulfi accord, finished with sensual tonka and dark amber.",
        notes: {
            top: ["🫚 Cardamom", "🍊 Blood Orange", "🌿 Nutmeg"],
            heart: ["☕ Dark Espresso", "🍮 Kulfi Accord", "🌹 Rose Absolute"],
            base: ["🍦 Bourbon Vanilla", "🔥 Amber", "🪵 Smoked Sandalwood"]
        },
        longevity: "12-16 Hours",
        sillage: "Bold & Hypnotic",
        occasion: "Winter Evenings & Clubbing",
        isFeatured: false
    },
    {
        id: "8",
        name: "Citrus Imperiale",
        subtitle: "Riviera Sunrise • Eau de Parfum",
        gender: "unisex",
        family: "fresh",
        badge: "Refreshing",
        rating: 4.7,
        reviewsCount: 78,
        image: "images/perfume3.jpg",
        defaultSize: "50ml",
        sizes: [
            { size: "30ml", price: 1499 },
            { size: "50ml", price: 2199 },
            { size: "100ml", price: 3099 }
        ],
        description: "Sun-drenched Calabrian bergamot infused with sparkling grapefruit, fresh green basil, vetiver, and crisp cedar. The definitive luxury fresh scent that invigorates the senses.",
        notes: {
            top: ["🍋 Calabrian Bergamot", "🍊 Ruby Grapefruit", "🍃 Sweet Basil"],
            heart: ["🌿 Vetiver Heart", "🌸 Neroli Petals", "🫚 Pink Pepper"],
            base: ["🌲 White Cedar", "🤍 Crystal Musk", "🪵 Patchouli"]
        },
        longevity: "8-10 Hours",
        sillage: "Vibrant & Uplifting",
        occasion: "Brunch, Sports & Summer",
        isFeatured: false
    }
];

function getPerfumeById(id) {
    return perfumeProducts.find(p => String(p.id) === String(id));
}

const PROMO_CODES = {
    "GOLDEN10": { discountPercent: 10, minSpend: 0, description: "10% off entire order" },
    "BLISS20": { discountPercent: 20, minSpend: 5000, description: "20% off orders above ₹5,000" },
    "WELCOME500": { flatDiscount: 500, minSpend: 2500, description: "Flat ₹500 off above ₹2,500" }
};
