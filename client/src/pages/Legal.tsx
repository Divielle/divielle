import { useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "@/contexts/ThemeContext";
import Navigation from "@/components/Navigation";
import CustomCursor from "@/components/CustomCursor";

type LegalSection =
  | "terms"
  | "privacy"
  | "cookies"
  | "returns"
  | "cosmetics"
  | "accessibility";

const SECTIONS: { id: LegalSection; title: string }[] = [
  { id: "terms", title: "Terms & Conditions" },
  { id: "privacy", title: "Privacy Policy" },
  { id: "cookies", title: "Cookie Policy" },
  { id: "returns", title: "Returns & Refunds" },
  { id: "cosmetics", title: "Cosmetics Regulation" },
  { id: "accessibility", title: "Accessibility" },
];

export default function Legal() {
  const { isNight } = useTheme();
  const [activeSection, setActiveSection] = useState<LegalSection>("terms");

  const accentColor = isNight ? "#D4AF37" : "#C41E3A";
  const textColor = isNight ? "#f5f0e8" : "#0d0505";
  const mutedColor = isNight ? "rgba(245,240,232,0.5)" : "rgba(13,5,5,0.7)";
  const bgColor = isNight ? "#050505" : "#faf7f4";
  const surfaceColor = isNight ? "#0a0a0a" : "#ffffff";
  const borderColor = isNight ? "rgba(212,175,55,0.15)" : "rgba(212,175,55,0.25)";

  return (
    <div
      className="min-h-screen transition-colors duration-1000"
      style={{ backgroundColor: bgColor }}
    >
      <Navigation />

      <div className="pt-28 pb-20 px-6 md:px-10 max-w-[1200px] mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12"
        >
          <h1
            className="font-display text-4xl md:text-5xl font-light mb-4"
            style={{ color: textColor }}
          >
            Legal <span className="italic" style={{ color: accentColor }}>Information</span>
          </h1>
          <p className="font-sans text-sm" style={{ color: mutedColor }}>
            Last updated: June 2026 &mdash; DIVIELLE Luxury Cosmetics, Athens, Greece
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar Navigation */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-3"
          >
            <nav className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0">
              {SECTIONS.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className="whitespace-nowrap px-4 py-2.5 font-sans text-[11px] tracking-[0.15em] uppercase transition-all duration-300 rounded-full"
                  style={{
                    backgroundColor:
                      activeSection === section.id ? accentColor : "transparent",
                    color:
                      activeSection === section.id
                        ? (isNight ? "#050505" : "#ffffff")
                        : mutedColor,
                    border: `1px solid ${activeSection === section.id ? accentColor : borderColor}`,
                  }}
                  data-cursor-hover
                >
                  {section.title}
                </button>
              ))}
            </nav>
          </motion.aside>

          {/* Content */}
          <motion.main
            key={activeSection}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-9 p-6 md:p-10 rounded-2xl"
            style={{
              backgroundColor: surfaceColor,
              border: `1px solid ${borderColor}`,
            }}
          >
            <div
              className="prose prose-sm max-w-none font-sans text-sm leading-relaxed"
              style={{ color: mutedColor }}
            >
              {activeSection === "terms" && <TermsContent textColor={textColor} accentColor={accentColor} mutedColor={mutedColor} />}
              {activeSection === "privacy" && <PrivacyContent textColor={textColor} accentColor={accentColor} mutedColor={mutedColor} />}
              {activeSection === "cookies" && <CookieContent textColor={textColor} accentColor={accentColor} mutedColor={mutedColor} />}
              {activeSection === "returns" && <ReturnsContent textColor={textColor} accentColor={accentColor} mutedColor={mutedColor} />}
              {activeSection === "cosmetics" && <CosmeticsContent textColor={textColor} accentColor={accentColor} mutedColor={mutedColor} />}
              {activeSection === "accessibility" && <AccessibilityContent textColor={textColor} accentColor={accentColor} mutedColor={mutedColor} />}
            </div>
          </motion.main>
        </div>

        {/* Back to home */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <a
            href="/"
            className="font-sans text-[10px] tracking-[0.3em] uppercase transition-opacity duration-300 hover:opacity-100 opacity-60"
            style={{ color: accentColor }}
            data-cursor-hover
          >
            &larr; Back to Home
          </a>
        </motion.div>
      </div>
    </div>
  );
}

// --- Section Content Components ---

interface ContentProps {
  textColor: string;
  accentColor: string;
  mutedColor: string;
}

function SectionTitle({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <h2 className="font-display text-2xl font-light mb-6 mt-0" style={{ color }}>
      {children}
    </h2>
  );
}

function SubTitle({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <h3 className="font-display text-lg font-light mb-3 mt-8" style={{ color }}>
      {children}
    </h3>
  );
}

function TermsContent({ textColor, accentColor, mutedColor }: ContentProps) {
  return (
    <>
      <SectionTitle color={textColor}>Terms &amp; Conditions</SectionTitle>
      <p style={{ color: mutedColor }}>
        These Terms and Conditions govern your use of the DIVIELLE website and the purchase of products from DIVIELLE Luxury Cosmetics. By accessing this website, you agree to be bound by these terms in full. If you disagree with any part, you must not use this website.
      </p>

      <SubTitle color={textColor}>1. Company Information</SubTitle>
      <p style={{ color: mutedColor }}>
        DIVIELLE is a luxury cosmetics brand operated from Athens, Greece. For inquiries, contact us at info@divielle.com. All transactions are governed by the laws of the Hellenic Republic and the European Union.
      </p>

      <SubTitle color={textColor}>2. Product Information</SubTitle>
      <p style={{ color: mutedColor }}>
        We make every effort to display product colors and descriptions as accurately as possible. However, actual colors may vary depending on your device's display settings. Product descriptions are for informational purposes and do not constitute a warranty. All cosmetic products comply with EU Regulation (EC) No 1223/2009.
      </p>

      <SubTitle color={textColor}>3. Pricing &amp; Payment</SubTitle>
      <p style={{ color: mutedColor }}>
        All prices are displayed inclusive of VAT where applicable. We reserve the right to modify prices without prior notice. Payment is processed securely through our authorized payment providers. We accept major credit cards and other payment methods as displayed at checkout.
      </p>

      <SubTitle color={textColor}>4. Intellectual Property</SubTitle>
      <p style={{ color: mutedColor }}>
        All content on this website — including text, graphics, logos, images, product designs, and software — is the property of DIVIELLE and is protected by international copyright, trademark, and intellectual property laws. Unauthorized reproduction, distribution, or modification is strictly prohibited.
      </p>

      <SubTitle color={textColor}>5. Limitation of Liability</SubTitle>
      <p style={{ color: mutedColor }}>
        DIVIELLE shall not be liable for any indirect, incidental, special, or consequential damages arising from the use of our website or products, except where such limitation is prohibited by applicable EU consumer protection law. Nothing in these terms affects your statutory rights as a consumer under EU Directive 2011/83/EU.
      </p>

      <SubTitle color={textColor}>6. Governing Law</SubTitle>
      <p style={{ color: mutedColor }}>
        These terms are governed by Greek law and the applicable regulations of the European Union. Any disputes shall be subject to the exclusive jurisdiction of the courts of Athens, Greece, without prejudice to your right to bring proceedings in your country of residence under EU consumer protection rules.
      </p>

      <SubTitle color={textColor}>7. Consumer Rights (EU)</SubTitle>
      <p style={{ color: mutedColor }}>
        As an EU consumer, you benefit from mandatory consumer protection laws of your country of residence. Nothing in these Terms and Conditions deprives you of the protection afforded by provisions that cannot be derogated from by agreement under Regulation (EC) No 593/2008 (Rome I).
      </p>
    </>
  );
}

function PrivacyContent({ textColor, accentColor, mutedColor }: ContentProps) {
  return (
    <>
      <SectionTitle color={textColor}>Privacy Policy</SectionTitle>
      <p style={{ color: mutedColor }}>
        DIVIELLE is committed to protecting your personal data in accordance with the General Data Protection Regulation (GDPR) — Regulation (EU) 2016/679 — and applicable Greek data protection legislation (Law 4624/2019). This policy explains how we collect, use, store, and protect your information.
      </p>

      <SubTitle color={textColor}>1. Data Controller</SubTitle>
      <p style={{ color: mutedColor }}>
        The data controller is DIVIELLE Luxury Cosmetics, based in Athens, Greece. For data protection inquiries, contact our Data Protection Officer at privacy@divielle.com or info@divielle.com.
      </p>

      <SubTitle color={textColor}>2. Data We Collect</SubTitle>
      <p style={{ color: mutedColor }}>
        We may collect: name, email address, shipping/billing address, phone number, payment information (processed by third-party providers), browsing behavior and preferences, device and browser information, and communication history with our team. We only collect data that is necessary for the purposes described below.
      </p>

      <SubTitle color={textColor}>3. Legal Basis for Processing</SubTitle>
      <p style={{ color: mutedColor }}>
        We process your data based on: (a) your consent (Art. 6(1)(a) GDPR), (b) performance of a contract (Art. 6(1)(b) GDPR), (c) compliance with legal obligations (Art. 6(1)(c) GDPR), and (d) our legitimate interests (Art. 6(1)(f) GDPR), such as fraud prevention and service improvement.
      </p>

      <SubTitle color={textColor}>4. How We Use Your Data</SubTitle>
      <p style={{ color: mutedColor }}>
        Your data is used to: process and fulfill orders, provide customer support, send marketing communications (with your explicit consent), improve our website and services, comply with legal obligations (tax, accounting), and ensure the safety of our products per EU cosmetics regulation.
      </p>

      <SubTitle color={textColor}>5. Data Retention</SubTitle>
      <p style={{ color: mutedColor }}>
        We retain personal data only for as long as necessary: order data for 10 years (Greek tax law), marketing consent records for the duration of consent plus 1 year, browsing data for 26 months, and customer support communications for 3 years after resolution.
      </p>

      <SubTitle color={textColor}>6. Your Rights (GDPR Articles 15-22)</SubTitle>
      <p style={{ color: mutedColor }}>
        You have the right to: access your personal data, rectify inaccurate data, erase your data ("right to be forgotten"), restrict processing, data portability, object to processing, and not be subject to automated decision-making. To exercise these rights, contact privacy@divielle.com. We will respond within 30 days.
      </p>

      <SubTitle color={textColor}>7. International Transfers</SubTitle>
      <p style={{ color: mutedColor }}>
        Your data is primarily stored within the European Economic Area (EEA). If transferred outside the EEA, we ensure adequate protection through EU Standard Contractual Clauses (SCCs) or adequacy decisions per Article 45 GDPR.
      </p>

      <SubTitle color={textColor}>8. Data Security</SubTitle>
      <p style={{ color: mutedColor }}>
        We implement appropriate technical and organizational measures to protect your data, including encryption in transit (TLS 1.3), access controls, regular security audits, and staff training on data protection.
      </p>

      <SubTitle color={textColor}>9. Supervisory Authority</SubTitle>
      <p style={{ color: mutedColor }}>
        You have the right to lodge a complaint with the Hellenic Data Protection Authority (HDPA): Kifisias 1-3, 115 23 Athens, Greece, or with the supervisory authority in your EU member state of residence.
      </p>
    </>
  );
}

function CookieContent({ textColor, accentColor, mutedColor }: ContentProps) {
  return (
    <>
      <SectionTitle color={textColor}>Cookie Policy</SectionTitle>
      <p style={{ color: mutedColor }}>
        This Cookie Policy explains how DIVIELLE uses cookies and similar technologies in compliance with the EU ePrivacy Directive (2002/58/EC as amended by 2009/136/EC) and GDPR. By continuing to use our website, you consent to our use of essential cookies. Non-essential cookies require your explicit consent.
      </p>

      <SubTitle color={textColor}>1. What Are Cookies</SubTitle>
      <p style={{ color: mutedColor }}>
        Cookies are small text files stored on your device when you visit a website. They help us recognize your device, remember preferences, and understand how you interact with our site.
      </p>

      <SubTitle color={textColor}>2. Types of Cookies We Use</SubTitle>
      <p style={{ color: mutedColor }}>
        <strong style={{ color: textColor }}>Essential Cookies:</strong> Required for website functionality (session management, security, shopping cart). These do not require consent.
      </p>
      <p style={{ color: mutedColor }}>
        <strong style={{ color: textColor }}>Analytics Cookies:</strong> Help us understand website usage patterns. We use privacy-focused analytics that do not track individual users across sites.
      </p>
      <p style={{ color: mutedColor }}>
        <strong style={{ color: textColor }}>Preference Cookies:</strong> Remember your settings such as theme preference (Classic/Nights mode), language, and currency selection.
      </p>
      <p style={{ color: mutedColor }}>
        <strong style={{ color: textColor }}>Marketing Cookies:</strong> Used only with your explicit consent to deliver relevant advertisements and measure campaign effectiveness.
      </p>

      <SubTitle color={textColor}>3. Managing Cookies</SubTitle>
      <p style={{ color: mutedColor }}>
        You can manage cookie preferences through your browser settings or our cookie consent banner. Disabling essential cookies may affect website functionality. You may withdraw consent at any time by clearing your browser cookies or adjusting your preferences.
      </p>

      <SubTitle color={textColor}>4. Third-Party Cookies</SubTitle>
      <p style={{ color: mutedColor }}>
        Some cookies are placed by third-party services we use (payment processors, analytics). These are governed by the respective third party's privacy policy. We ensure all third-party processors comply with GDPR requirements.
      </p>
    </>
  );
}

function ReturnsContent({ textColor, accentColor, mutedColor }: ContentProps) {
  return (
    <>
      <SectionTitle color={textColor}>Returns &amp; Refunds Policy</SectionTitle>
      <p style={{ color: mutedColor }}>
        In accordance with EU Directive 2011/83/EU on Consumer Rights, you have the right to withdraw from a distance purchase within 14 days without giving any reason. This policy outlines the conditions and process for returns and refunds.
      </p>

      <SubTitle color={textColor}>1. Right of Withdrawal (14-Day Cooling-Off Period)</SubTitle>
      <p style={{ color: mutedColor }}>
        You have 14 calendar days from the date you receive your order to notify us of your decision to withdraw. To exercise this right, contact us at info@divielle.com with your order number and a clear statement of withdrawal. You may also use the model withdrawal form provided by the EU.
      </p>

      <SubTitle color={textColor}>2. Exceptions for Cosmetic Products</SubTitle>
      <p style={{ color: mutedColor }}>
        Per Article 16(e) of Directive 2011/83/EU, the right of withdrawal does not apply to sealed goods which are not suitable for return due to health protection or hygiene reasons, once unsealed after delivery. This includes opened cosmetic products (lipsticks, lip glosses, palettes) where the seal has been broken.
      </p>

      <SubTitle color={textColor}>3. Condition of Returns</SubTitle>
      <p style={{ color: mutedColor }}>
        Products must be returned in their original, unopened, and sealed packaging. Items must be unused and in the same condition as received. Products returned without original packaging or with broken seals cannot be accepted for hygiene reasons.
      </p>

      <SubTitle color={textColor}>4. Refund Process</SubTitle>
      <p style={{ color: mutedColor }}>
        Upon receiving and inspecting your return, we will process your refund within 14 days using the same payment method as the original transaction. Shipping costs for the original delivery will be refunded (standard shipping rate). Return shipping costs are borne by the customer unless the product is defective.
      </p>

      <SubTitle color={textColor}>5. Defective Products</SubTitle>
      <p style={{ color: mutedColor }}>
        Under EU consumer law, you are entitled to a legal guarantee of conformity for 2 years from delivery. If a product is defective or does not conform to the contract, you are entitled to free repair, replacement, price reduction, or full refund. Contact info@divielle.com with photos of the defect.
      </p>

      <SubTitle color={textColor}>6. Adverse Reactions</SubTitle>
      <p style={{ color: mutedColor }}>
        If you experience an adverse reaction to any DIVIELLE product, please discontinue use immediately and contact us. We will process a full refund and report the incident to the relevant authorities as required by EU Regulation (EC) No 1223/2009 Article 23.
      </p>
    </>
  );
}

function CosmeticsContent({ textColor, accentColor, mutedColor }: ContentProps) {
  return (
    <>
      <SectionTitle color={textColor}>EU Cosmetics Regulation Compliance</SectionTitle>
      <p style={{ color: mutedColor }}>
        DIVIELLE operates in full compliance with Regulation (EC) No 1223/2009 of the European Parliament and of the Council on cosmetic products. This regulation ensures the safety of cosmetic products placed on the EU market.
      </p>

      <SubTitle color={textColor}>1. Responsible Person</SubTitle>
      <p style={{ color: mutedColor }}>
        In accordance with Article 4 of the Cosmetics Regulation, DIVIELLE designates a Responsible Person within the EU who ensures compliance with all obligations set out in the regulation. The Responsible Person is based in Athens, Greece.
      </p>

      <SubTitle color={textColor}>2. Product Safety Assessment</SubTitle>
      <p style={{ color: mutedColor }}>
        All DIVIELLE products undergo a safety assessment by a qualified assessor before being placed on the market, as required by Article 10 and Annex I of the regulation. The Cosmetic Product Safety Report (CPSR) is maintained for each product.
      </p>

      <SubTitle color={textColor}>3. Product Information File (PIF)</SubTitle>
      <p style={{ color: mutedColor }}>
        We maintain a Product Information File for each cosmetic product as required by Article 11, including: product description, safety report, manufacturing method, proof of claimed effects, and animal testing data (we are cruelty-free and comply with the EU animal testing ban).
      </p>

      <SubTitle color={textColor}>4. CPNP Notification</SubTitle>
      <p style={{ color: mutedColor }}>
        All DIVIELLE products are notified to the Cosmetic Products Notification Portal (CPNP) before being placed on the EU market, as required by Article 13. This includes product category, frame formulation, and original labeling.
      </p>

      <SubTitle color={textColor}>5. Labeling Requirements</SubTitle>
      <p style={{ color: mutedColor }}>
        Our product labels comply with Article 19 and include: name/address of the Responsible Person, nominal content, date of minimum durability or Period After Opening (PAO) symbol, particular precautions for use, batch number, product function, and full INCI ingredients list.
      </p>

      <SubTitle color={textColor}>6. Prohibited &amp; Restricted Substances</SubTitle>
      <p style={{ color: mutedColor }}>
        DIVIELLE formulations strictly adhere to Annexes II-VI of the Cosmetics Regulation regarding prohibited substances, restricted substances, permitted colorants, preservatives, and UV filters. We regularly review formulations against regulation updates.
      </p>

      <SubTitle color={textColor}>7. Good Manufacturing Practice (GMP)</SubTitle>
      <p style={{ color: mutedColor }}>
        Our products are manufactured in accordance with ISO 22716:2007 (Good Manufacturing Practice for Cosmetics), as required by Article 8 of the regulation. This ensures consistent quality and safety in production.
      </p>

      <SubTitle color={textColor}>8. Serious Undesirable Effects (SUE)</SubTitle>
      <p style={{ color: mutedColor }}>
        In compliance with Article 23, we report any serious undesirable effects to the competent authority of the Member State where the effect occurred. If you experience any adverse reaction, please contact us immediately at info@divielle.com.
      </p>

      <SubTitle color={textColor}>9. Claims Regulation</SubTitle>
      <p style={{ color: mutedColor }}>
        All product claims comply with Regulation (EU) No 655/2013 and the common criteria for cosmetic claims: legal compliance, truthfulness, evidential support, honesty, fairness, and informed decision-making.
      </p>

      <SubTitle color={textColor}>10. Animal Testing</SubTitle>
      <p style={{ color: mutedColor }}>
        DIVIELLE is fully cruelty-free. We do not test on animals, and we do not sell in markets that require animal testing. This is in full compliance with the EU ban on animal testing for cosmetics (effective since March 2013 for finished products and ingredients).
      </p>
    </>
  );
}

function AccessibilityContent({ textColor, accentColor, mutedColor }: ContentProps) {
  return (
    <>
      <SectionTitle color={textColor}>Accessibility Statement</SectionTitle>
      <p style={{ color: mutedColor }}>
        DIVIELLE is committed to ensuring digital accessibility for people with disabilities, in compliance with the European Accessibility Act (Directive (EU) 2019/882) and Web Content Accessibility Guidelines (WCAG) 2.1 Level AA.
      </p>

      <SubTitle color={textColor}>1. Our Commitment</SubTitle>
      <p style={{ color: mutedColor }}>
        We strive to provide a website that is accessible to the widest possible audience, regardless of technology or ability. We are actively working to increase the accessibility and usability of our website.
      </p>

      <SubTitle color={textColor}>2. Measures Taken</SubTitle>
      <p style={{ color: mutedColor }}>
        We have implemented the following measures: semantic HTML structure, keyboard navigation support, sufficient color contrast ratios, alternative text for images, resizable text without loss of functionality, and clear focus indicators for interactive elements.
      </p>

      <SubTitle color={textColor}>3. Known Limitations</SubTitle>
      <p style={{ color: mutedColor }}>
        Some content may not yet be fully accessible: 3D interactive elements may not be accessible to screen readers (alternative text descriptions are provided), some animations may affect users with motion sensitivities (we respect prefers-reduced-motion settings), and the custom cursor may not function with all assistive technologies.
      </p>

      <SubTitle color={textColor}>4. Feedback</SubTitle>
      <p style={{ color: mutedColor }}>
        We welcome your feedback on the accessibility of the DIVIELLE website. If you encounter any accessibility barriers, please contact us at info@divielle.com. We aim to respond to accessibility feedback within 5 business days.
      </p>

      <SubTitle color={textColor}>5. Enforcement</SubTitle>
      <p style={{ color: mutedColor }}>
        If you are not satisfied with our response to your accessibility concern, you have the right to file a complaint with the national enforcement body in your EU member state responsible for monitoring compliance with the European Accessibility Act.
      </p>
    </>
  );
}
