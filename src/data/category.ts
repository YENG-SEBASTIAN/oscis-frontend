import { CategoryInterface } from "@/types/types";

export const categories: CategoryInterface[] = [
  {
    id: "cat1",
    name: "Sneakers",
    slug: "sneakers",
    count: "180+ styles",
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=200&fit=crop",
    description: "Explore our wide collection of casual and lifestyle sneakers for all ages.",
    products: [
      {
        id: "s1",
        name: "AirZoom Flex",
        price: 120,
        originalPrice: 199.99,
        image: "https://images.unsplash.com/photo-1618354691328-d234e648d26d?w=300&h=300&fit=crop",
        description: "Breathable and responsive for all-day comfort.",
        rating: 4.8,
        reviews: 324,
        badge: "Best Seller",
        category: "Sneakers"
      },
      {
        id: "s2",
        name: "Street Run Pro",
        price: 95,
        originalPrice: 129.99,
        image: "https://images.unsplash.com/photo-1606813909279-275e446b6d81?w=300&h=300&fit=crop",
        description: "Urban-style sneakers perfect for daily wear.",
        rating: 4.5,
        reviews: 187,
        badge: "Popular",
        category: "Sneakers"
      },
      {
        id: "s3",
        name: "Comet Runner",
        price: 105,
        originalPrice: 145.99,
        image: "https://images.unsplash.com/photo-1600185366005-9b257b2a2635?w=300&h=300&fit=crop",
        description: "Lightweight design with a futuristic look.",
        rating: 4.6,
        reviews: 231,
        badge: "New",
        category: "Sneakers"
      }
    ]
  },
  {
    id: "cat2",
    name: "Formal Shoes",
    slug: "formal-shoes",
    count: "95+ styles",
    image: "https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=300&h=200&fit=crop",
    description: "Step up your office game with sleek, handcrafted leather shoes.",
    products: [
      {
        id: "f1",
        name: "Oxford Prime",
        price: 150,
        originalPrice: 219.99,
        image: "https://images.unsplash.com/photo-1582735688308-8c13c23074f9?w=300&h=300&fit=crop",
        description: "Timeless Oxford shoes made of premium leather.",
        rating: 4.7,
        reviews: 278,
        badge: "Best Seller",
        category: "Formal Shoes"
      },
      {
        id: "f2",
        name: "Executive Loafer",
        price: 130,
        originalPrice: 179.99,
        image: "https://images.unsplash.com/photo-1621263756642-0fdbda156a4a?w=300&h=300&fit=crop",
        description: "Slip-on style with a polished finish.",
        rating: 4.4,
        reviews: 156,
        badge: null,
        category: "Formal Shoes"
      },
      {
        id: "f3",
        name: "Derby Classic",
        price: 140,
        originalPrice: 199.99,
        image: "https://images.unsplash.com/photo-1632933834792-0b29bb35ea6f?w=300&h=300&fit=crop",
        description: "Smart and durable Derby shoes for formal events.",
        rating: 4.6,
        reviews: 203,
        badge: "Editor's Choice",
        category: "Formal Shoes"
      }
    ]
  },
  {
    id: "cat3",
    name: "Boots",
    slug: "boots",
    count: "120+ styles",
    image: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=300&h=200&fit=crop",
    description: "Rugged and stylish boots perfect for any terrain or outfit.",
    products: [
      {
        id: "b1",
        name: "Trail Blazer",
        price: 165,
        originalPrice: 229.99,
        image: "https://images.unsplash.com/photo-1555529771-35a36d9c51bf?w=300&h=300&fit=crop",
        description: "Heavy-duty boots for mountain and trail adventures.",
        rating: 4.9,
        reviews: 342,
        badge: "Best Seller",
        category: "Boots"
      },
      {
        id: "b2",
        name: "Urban Explorer",
        price: 150,
        originalPrice: 209.99,
        image: "https://images.unsplash.com/photo-1581459431819-80a6f06d6f70?w=300&h=300&fit=crop",
        description: "Stylish boots for urban and casual wear.",
        rating: 4.5,
        reviews: 198,
        badge: null,
        category: "Boots"
      },
      {
        id: "b3",
        name: "Rustic Leather",
        price: 175,
        originalPrice: 239.99,
        image: "https://images.unsplash.com/photo-1600185365329-d99809be0c69?w=300&h=300&fit=crop",
        description: "Crafted for comfort and long-lasting performance.",
        rating: 4.7,
        reviews: 267,
        badge: "Premium",
        category: "Boots"
      }
    ]
  },
  {
    id: "cat4",
    name: "Sports",
    slug: "sports",
    count: "160+ styles",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=200&fit=crop",
    description: "High-performance sports shoes for your active lifestyle.",
    products: [
      {
        id: "sp1",
        name: "Track Star",
        price: 110,
        originalPrice: 159.99,
        image: "https://images.unsplash.com/photo-1549057446-9f5c6ac91d50?w=300&h=300&fit=crop",
        description: "Designed for sprinting and track excellence.",
        rating: 4.6,
        reviews: 213,
        badge: "Top Rated",
        category: "Sports"
      },
      {
        id: "sp2",
        name: "Court Pro X",
        price: 125,
        originalPrice: 169.99,
        image: "https://images.unsplash.com/photo-1603297631942-05026b1e1e55?w=300&h=300&fit=crop",
        description: "Built for agility and quick movements on court.",
        rating: 4.8,
        reviews: 301,
        badge: "Best Seller",
        category: "Sports"
      },
      {
        id: "sp3",
        name: "Field Grip Max",
        price: 135,
        originalPrice: 179.99,
        image: "https://images.unsplash.com/photo-1584568691221-0495f86c37c4?w=300&h=300&fit=crop",
        description: "Strong grip and support for field sports.",
        rating: 4.4,
        reviews: 178,
        badge: null,
        category: "Sports"
      }
    ]
  },
  {
    id: "cat5",
    name: "Sandals",
    slug: "sandals",
    count: "85+ styles",
    image: "https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=300&h=200&fit=crop",
    description: "Breathe easy with breezy, stylish sandals for warm days.",
    products: [
      {
        id: "sa1",
        name: "Beach Lite",
        price: 40,
        originalPrice: 59.99,
        image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=300&h=300&fit=crop",
        description: "Perfect flip-flops for casual beach outings.",
        rating: 4.2,
        reviews: 145,
        badge: "Budget Pick",
        category: "Sandals"
      },
      {
        id: "sa2",
        name: "Comfort Glide",
        price: 55,
        originalPrice: 79.99,
        image: "https://images.unsplash.com/photo-1598961677256-82d5d1f4ed4a?w=300&h=300&fit=crop",
        description: "Memory-foam footbed for all-day comfort.",
        rating: 4.7,
        reviews: 289,
        badge: "Customer Favorite",
        category: "Sandals"
      },
      {
        id: "sa3",
        name: "Wander Strap",
        price: 60,
        originalPrice: 89.99,
        image: "https://images.unsplash.com/photo-1573497620052-3230d6e33241?w=300&h=300&fit=crop",
        description: "Adjustable straps with rugged sole grip.",
        rating: 4.5,
        reviews: 203,
        badge: "New",
        category: "Sandals"
      }
    ]
  },
  {
    id: "cat6",
    name: "Heels",
    slug: "heels",
    count: "110+ styles",
    image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=300&h=200&fit=crop",
    description: "Elegant and chic heels designed for every occasion.",
    products: [
      {
        id: "h1",
        name: "Stiletto Charm",
        price: 95,
        originalPrice: 139.99,
        image: "https://images.unsplash.com/photo-1589987600059-6f1b58ae8d92?w=300&h=300&fit=crop",
        description: "Sophisticated design with a bold heel.",
        rating: 4.6,
        reviews: 234,
        badge: "Trending",
        category: "Heels"
      },
      {
        id: "h2",
        name: "Velvet Touch",
        price: 85,
        originalPrice: 129.99,
        image: "https://images.unsplash.com/photo-1589987600159-8189380a6f92?w=300&h=300&fit=crop",
        description: "Soft velvet finish perfect for evening wear.",
        rating: 4.8,
        reviews: 312,
        badge: "Best Seller",
        category: "Heels"
      },
      {
        id: "h3",
        name: "Platform Shine",
        price: 105,
        originalPrice: 149.99,
        image: "https://images.unsplash.com/photo-1589987600659-76345745a6f2?w=300&h=300&fit=crop",
        description: "Shiny finish with a comfortable platform base.",
        rating: 4.4,
        reviews: 187,
        badge: null,
        category: "Heels"
      }
    ]
  }
];