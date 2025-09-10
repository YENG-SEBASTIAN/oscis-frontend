import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['images.unsplash.com', "localhost", "127.0.0.1", "oscis.pythonanywhere.com"],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;






// import type { NextConfig } from "next";
// import autoCert from "anchor-pki/auto-cert/integrations/next";


// const nextConfig: NextConfig = {
//   images: {
//     domains: ['images.unsplash.com', "localhost", "127.0.0.1", "oscis.pythonanywhere.com"],
//   },
//   eslint: {
//     ignoreDuringBuilds: true,
//   },
// };


// const withAutoCert = autoCert({
//   enabledEnv: "development",
// });

// export default withAutoCert(nextConfig);

