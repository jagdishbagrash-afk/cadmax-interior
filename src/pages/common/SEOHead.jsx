import Head from "next/head";

export default function SEOHead({
  title = "Luxury Architects & Interior Designers in Jaipur | CADMAX Atelier",
  keywords = "Architecture, Interior Design, Residential Architecture, Luxury Villa Design, Commercial Interiors, 3D Visualization, Jaipur, CADMAX Atelier",
  description = "Leading architecture and interior design studio in Jaipur offering residential architecture, luxury villa design, commercial interiors, and 3D visualization services.",
  canonical = "https://cadmaxatelier.com/",
  image = "https://cadmaxatelier.com/Logo.png",
  url = "https://cadmaxatelier.com/",
  type = "website",
  schema = [],
}) {
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://cadmaxatelier.com/#website",
    url: "https://cadmaxatelier.com/",
    name: "CADMAX Atelier",
    description:
      "Architecture and Interior Design Studio in Jaipur specializing in residential, commercial, and luxury design projects.",
    publisher: {
      "@id": "https://cadmaxatelier.com/#organization",
    },
    inLanguage: "en-IN",
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://cadmaxatelier.com/#organization",
    name: "CADMAX Atelier",
    url: "https://cadmaxatelier.com/",
    logo: {
      "@type": "ImageObject",
      url: image,
    },
    image,
    description:
      "CADMAX Atelier is an architecture and interior design studio in Jaipur.",
    email: "info@cadmaxatelier.com",
    telephone: "+91 8890249999",
    sameAs: [
      "https://www.instagram.com/cadmaxatelier/",
      "https://www.facebook.com/profile.php?id=61566087977578",
    ],
  };

  const webpageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: title,
    description,
    isPartOf: {
      "@id": "https://cadmaxatelier.com/#website",
    },
    about: {
      "@id": "https://cadmaxatelier.com/#organization",
    },
    inLanguage: "en-IN",
  };

  return (
    <Head>
      {/* Basic */}
      <title>{title || "Luxury Architects & Interior Designers in Jaipur | CADMAX Atelier"}</title>

      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      <link rel="canonical" href={canonical} />

      {/* Robots */}
      <meta name="robots" content="index,follow" />
      <meta name="googlebot" content="index,follow" />
      <meta name="bingbot" content="index,follow" />
      <meta name="publisher" content="CADMAX Atelier" />
      <meta name="revisit-after" content="7 days" />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content="CADMAX Atelier" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content="en_IN" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:site" content="@cadmaxatelier" />
      <meta name="twitter:creator" content="@cadmaxatelier" />

      {/* Default Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(webpageSchema),
        }}
      />

      {/* Custom Schema */}
      {schema.map((item, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(item),
          }}
        />
      ))}
    </Head>
  );
}