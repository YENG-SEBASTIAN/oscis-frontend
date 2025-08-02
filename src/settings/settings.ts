export const AppSettings = {
  name: 'Oscis UK',
  description: 'Premium Store',
  logo: {
    text: 'S',
    gradientFrom: 'from-blue-600',
    gradientTo: 'to-purple-600'
  },
  get copyright() {
    return `© ${new Date().getFullYear()} ${this.name}`;
  },
  contact: {
    phone: '+44 7350 292304',
    email: 'support@shopflow.com',
    address: '34 Packhorse walk, Packhorse centre, HD1 2RT, Huddersfield'
  },
  socialLinks: {
    twitter: 'https://twitter.com/shopflow',
    facebook: 'https://facebook.com/shopflow',
    instagram: 'https://instagram.com/shopflow',
    youtube: 'https://instagram.com/shopflow'
  },
  navbarLinks: [
    { label: 'Home', href: '/' },
    { label: 'Shop', href: '/shop' },
    { label: 'Categories', href: '/categories' },
    { label: 'Deals', href: '/deals' },
    { label: 'About Us', href: '/about' },
    { label: 'Contact', href: '/contact' }
  ],
    paymentMethods: {
    visa: 'Visa',
    mastercard: 'MasterCard',
  },
};


// Address:
// 34 Packhorse walk
// Packhorse centre 
// HD1 2RT
// Huddersfield