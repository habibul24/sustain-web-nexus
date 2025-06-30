import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { HelpCircle } from 'lucide-react';

const ESGCarousel = () => {
  const faqs = [
    {
      question: "Why is ESG important to businesses?",
      answer: `ESG is important to businesses primarily due to mandatory regulations from governments in various countries. The European Union (EU), United Kingdom (UK), Hong Kong, Singapore, India, and countries such as Japan, Canada, and the United States currently have voluntary disclosures, with more companies expected to introduce regulations.

These regulations primarily affect companies listed on their respective stock exchanges. However, ESG requirements at their foundation also require these companies to obtain data from their subsidiary companies and business partners, gradually affecting unlisted companies as well.

Additional reasons include:

• Enhancing the Company's Reputation and Brand Value
• Attracting and Retaining Talent
• Improved Financial Performance
• Increased Access to Capital
• Enhanced Risk Management`
    },
    {
      question: "What is the difference between ESG and Sustainability?",
      answer: `The terms ESG and sustainability are often used interchangeably, but there is a subtle yet important distinction:

Sustainability is the broader, overarching principle that requires individuals and organizations to meet the needs of the present without compromising the ability of future generations to meet their own needs—essentially, the ability to maintain business operations and existence over the long term. It considers business from financial (profit), environmental (planet), and social (people) perspectives to make a holistic determination.

ESG is a more specific, measurable framework used to evaluate a company's sustainability performance. In other words, ESG is how we measure a company's sustainability. It provides the criteria and data points that investors and stakeholders can use to assess a company's commitment to sustainable practices.

In conclusion, think of sustainability as the ultimate goal and ESG as the roadmap to achieve it.`
    },
    {
      question: "What are the most common ESG reporting frameworks?",
      answer: `ESG reporting frameworks can be general, industry-specific, or topic-specific. However, the most commonly used frameworks that you should familiarize yourself with first are:

• Greenhouse Gas (GHG) Protocol: This is not a reporting framework but a set of global standardized accounting standards for measuring and managing GHG emissions. It provides the "how-to" methodology for calculating emissions that are then reported through frameworks like GRI or TCFD. It serves as the foundation for carbon emission calculations.

• Global Reporting Initiative (GRI): A comprehensive set of standards that can be used by any organization to report on its economic, environmental, and social impacts.

• International Sustainability Standards Board (ISSB): Under the IFRS Foundation (which also houses SASB), has published its first standards: IFRS S1 (General Requirements) and IFRS S2 (Climate-related Disclosures).

• Sustainability Accounting Standards Board (SASB): Provides industry-specific standards for reporting on financially material sustainability information to investors.

• Task Force on Climate-related Financial Disclosures (TCFD): A framework specifically focused on helping companies disclose climate-related financial risks and opportunities.`
    },
    {
      question: "Which ESG framework applies to Hong Kong?",
      answer: `The Hong Kong Exchange (HKEX) has published the HKEX ESG Reporting Code, which is mandatory for listed companies. HKEX has aligned its climate-related rules with the ISSB standards (IFRS S2 – Climate-related Disclosures), so by extension, ISSB is also applicable to Hong Kong companies.`
    },
    {
      question: "Is ESG reporting mandatory in Hong Kong?",
      answer: `Yes, ESG reporting is mandatory in Hong Kong. All listed companies must report their Scope 1 and Scope 2 greenhouse gas (GHG) emissions as of January 1, 2025. From January 1, 2026, all LargeCap issuers (constituents of the Hang Seng Composite LargeCap Index) will face mandatory disclosure for all new climate requirements, including Scope 3 emissions.`
    },
    {
      question: "Which ESG certificate should I pursue?",
      answer: `The certificate you choose should depend on your proposed field of employment:

• For investment & banking professionals: Certified ESG Analyst (CESGA) by the European Federation of Financial Analysts Societies (EFFAS) or Sustainable Investing Certificate by CFA Institute

• For professionals working in companies: GreenData's How to Implement ESG course or Fundamentals of Sustainability Accounting (FSA) Credential by the IFRS Foundation

• For executive-level and risk professionals: Sustainability and Climate Risk (SCR®) Certificate by the Global Association of Risk Professionals (GARP)

• For auditors & non-finance consultants: International Standard on Sustainability Assurance (ISSA) 5000, General Requirements for Sustainability Assurance Engagements trainings, Fundamentals of Sustainability Accounting (FSA) Credential by the IFRS Foundation, and GRI Professional Certification by the Global Reporting Initiative

Choose based on your preferred career path.`
    },
    {
      question: "Do I need an ESG report?",
      answer: `All listed companies in countries where ESG reporting is mandatory need to prepare an ESG report, with some jurisdictions also requiring that the ESG report be certified by an audit company. If you are unlisted, you should prepare an ESG report to showcase how your business operates sustainably and to increase investor confidence in your operations, although it is not mandatory.`
    },
    {
      question: "How do I choose my reporting framework?",
      answer: `To choose a reporting framework:

1. First, identify and use mandatory or principle-based requirements from your jurisdiction.
2. If there are no mandatory requirements in your jurisdiction, use the framework that your biggest customer uses.
3. If you are a subsidiary, use the frameworks your parent company is using, in addition to any mandatory requirements in your jurisdiction if applicable.
4. If none of the above criteria apply, use the most commonly recognized frameworks, such as ISSB, GRI, SASB, and TCFD.`
    },
    {
      question: "What does ESG stand for?",
      answer: `ESG stands for Environmental, Social, and Governance.`
    },
    {
      question: "Where can I find ESG courses to help me get started?",
      answer: `You can find ESG courses at: https://www.edu.greendatabiz.com/`
    }
  ];

  return (
    <section className="relative py-24" style={{ background: 'linear-gradient(to bottom, #7fae2e, #1e2e13)' }}>
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full font-semibold text-sm mb-6">
            <HelpCircle className="w-4 h-4 mr-2" />
            Frequently Asked Questions
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 leading-tight">
            ESG
            <span className="text-green-200"> FAQs</span>
          </h2>
          <p className="text-xl text-green-50 max-w-3xl mx-auto leading-relaxed">
            Get answers to the most common questions about ESG reporting, frameworks, and sustainability practices.
          </p>
        </div>
        {/* FAQ Accordion */}
        <div className="rounded-2xl shadow-2xl p-0">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-b border-green-900 last:border-b-0 bg-white">
                <AccordionTrigger className="text-left text-lg font-semibold text-green-900 hover:text-green-700 transition-colors py-6 px-6">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-800 leading-relaxed pb-6 px-6">
                  <div className="whitespace-pre-line">
                    {faq.answer}
                    </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default ESGCarousel;
