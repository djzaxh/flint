import Script from 'next/script';

export default function OrganizationSchema() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "GetStrong",
    "url": "https://getstrong.ai",
    "logo": "https://getstrong.ai/logo.png",
    "sameAs": [
      "https://twitter.com/getstrong",
      "https://www.instagram.com/getstrong",
      "https://www.linkedin.com/company/getstrong"
    ],
    "description": "GetStrong is your personal AI nutritionist. Built with cutting-edge technology and grounded in real human behavior, GetStrong tracks what you eat, helps you build healthier habits, and adapts to your unique lifestyle.",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "US"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer support",
      "email": "support@getstrong.ai"
    }
  };

  return (
    <Script
      id="organization-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
    />
  );
}
