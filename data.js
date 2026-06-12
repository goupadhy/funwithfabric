const fabricSamples = [
  {
    id: 1,
    name: "Classic Cotton Muslin",
    type: "Cotton",
    color: "Natural",
    colorHex: "#f5f0e8",
    weight: "Medium",
    uses: ["Quilting", "Lining", "Prototyping"],
    description:
      "A versatile, plain-woven cotton fabric. Ideal for toile mockups, quilting projects, and everyday sewing.",
    tags: ["beginner-friendly", "washable", "affordable"],
  },
  {
    id: 2,
    name: "Linen Herringbone",
    type: "Linen",
    color: "Oatmeal",
    colorHex: "#c8b89a",
    weight: "Medium-Heavy",
    uses: ["Apparel", "Home Decor", "Bags"],
    description:
      "A beautiful herringbone-weave linen with excellent drape and durability. Breathable and stylish.",
    tags: ["natural", "sustainable", "durable"],
  },
  {
    id: 3,
    name: "Silk Charmeuse",
    type: "Silk",
    color: "Ivory",
    colorHex: "#fffff0",
    weight: "Light",
    uses: ["Lingerie", "Blouses", "Scarves"],
    description:
      "Luxurious silk charmeuse with a satin-like sheen on one side and a matte finish on the other.",
    tags: ["luxury", "delicate", "smooth"],
  },
  {
    id: 4,
    name: "Wool Melton",
    type: "Wool",
    color: "Charcoal",
    colorHex: "#3d3d3d",
    weight: "Heavy",
    uses: ["Coats", "Jackets", "Outerwear"],
    description:
      "A dense, tightly woven wool fabric ideal for structured outerwear. Excellent insulation.",
    tags: ["warm", "structured", "winter"],
  },
  {
    id: 5,
    name: "Cotton Lawn",
    type: "Cotton",
    color: "White",
    colorHex: "#ffffff",
    weight: "Light",
    uses: ["Blouses", "Dresses", "Children's wear"],
    description:
      "A very fine, lightweight and sheer cotton fabric with a crisp finish. Great for delicate garments.",
    tags: ["beginner-friendly", "breathable", "summer"],
  },
  {
    id: 6,
    name: "Denim 12oz",
    type: "Cotton",
    color: "Indigo",
    colorHex: "#3f5f8a",
    weight: "Heavy",
    uses: ["Jeans", "Jackets", "Bags"],
    description:
      "Classic 12oz denim with a traditional twill weave. Sturdy and versatile for workwear and fashion.",
    tags: ["durable", "casual", "classic"],
  },
  {
    id: 7,
    name: "Jersey Knit",
    type: "Knit",
    color: "Navy",
    colorHex: "#1a2a4a",
    weight: "Medium",
    uses: ["T-shirts", "Dresses", "Activewear"],
    description:
      "A smooth, stretchy jersey knit fabric perfect for comfortable everyday garments with great recovery.",
    tags: ["stretchy", "comfortable", "easy-care"],
  },
  {
    id: 8,
    name: "Velvet Crushed",
    type: "Velvet",
    color: "Burgundy",
    colorHex: "#800020",
    weight: "Medium-Heavy",
    uses: ["Evening wear", "Pillows", "Drapery"],
    description:
      "Opulent crushed velvet with a rich texture and deep color. Adds luxury to any project.",
    tags: ["luxury", "formal", "rich"],
  },
  {
    id: 9,
    name: "Organic Cotton Poplin",
    type: "Cotton",
    color: "Sage Green",
    colorHex: "#8fad88",
    weight: "Light-Medium",
    uses: ["Shirts", "Quilting", "Children's wear"],
    description:
      "GOTS-certified organic cotton poplin with a crisp hand feel. Eco-friendly and skin-friendly.",
    tags: ["organic", "sustainable", "beginner-friendly"],
  },
  {
    id: 10,
    name: "Fleece Anti-Pill",
    type: "Synthetic",
    color: "Teal",
    colorHex: "#008080",
    weight: "Medium",
    uses: ["Blankets", "Jackets", "Hats"],
    description:
      "Soft anti-pill fleece that stays smooth after washing. Perfect for cozy cold-weather projects.",
    tags: ["warm", "easy-care", "beginner-friendly"],
  },
  {
    id: 11,
    name: "Lace Cotton Eyelet",
    type: "Cotton",
    color: "White",
    colorHex: "#faf9f6",
    weight: "Light",
    uses: ["Dresses", "Blouses", "Trim"],
    description:
      "Delicate cotton eyelet fabric with embroidered cutwork pattern. Vintage-inspired and feminine.",
    tags: ["decorative", "summer", "romantic"],
  },
  {
    id: 12,
    name: "Canvas Duck",
    type: "Cotton",
    color: "Khaki",
    colorHex: "#c3b091",
    weight: "Heavy",
    uses: ["Bags", "Upholstery", "Aprons"],
    description:
      "Heavy-duty plain-woven canvas duck cloth. Highly durable and suitable for hard-wearing projects.",
    tags: ["durable", "sturdy", "workwear"],
  },
];

const resources = [
  {
    id: 1,
    title: "Fabric.com Learning Center",
    category: "Education",
    description:
      "In-depth articles and guides covering fabric types, care instructions, sewing techniques, and project inspiration.",
    url: "https://www.fabric.com",
    icon: "📚",
  },
  {
    id: 2,
    title: "Sewing Pattern Reviews",
    category: "Patterns",
    description:
      "Community-driven reviews of sewing patterns from major brands. Find tried-and-true patterns with honest ratings.",
    url: "#",
    icon: "✂️",
  },
  {
    id: 3,
    title: "Textile Fiber Guide",
    category: "Reference",
    description:
      "Comprehensive reference guide to natural and synthetic textile fibers, their properties, care, and best uses.",
    url: "#",
    icon: "🧵",
  },
  {
    id: 4,
    title: "Sustainable Fabrics Directory",
    category: "Sustainability",
    description:
      "Directory of eco-friendly, organic, and sustainably sourced fabrics and suppliers committed to ethical production.",
    url: "#",
    icon: "🌿",
  },
  {
    id: 5,
    title: "Color Theory for Sewists",
    category: "Design",
    description:
      "Learn how to combine colors effectively in your fabric projects — from quilts to garments to home decor.",
    url: "#",
    icon: "🎨",
  },
  {
    id: 6,
    title: "Fabric Care Symbol Decoder",
    category: "Reference",
    description:
      "Quick-reference guide to laundry and care symbols found on fabric labels. Never ruin a garment again!",
    url: "#",
    icon: "🏷️",
  },
  {
    id: 7,
    title: "Sewing Community Forum",
    category: "Community",
    description:
      "Join thousands of sewists in discussions about fabric, patterns, tips, and project showcases.",
    url: "#",
    icon: "💬",
  },
  {
    id: 8,
    title: "Fabric Yardage Calculator",
    category: "Tools",
    description:
      "Online tool to estimate fabric yardage needed for garments and quilts based on measurements and pattern pieces.",
    url: "#",
    icon: "📐",
  },
];
