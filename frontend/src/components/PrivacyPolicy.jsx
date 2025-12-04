import { Helmet } from 'react-helmet-async';

export default function PrivacyPolicy() {
  return (
    <>
      <Helmet>
        <title>Privacy Policy - ViralClipCatch | Video Downloader Privacy</title>
        <meta name="description" content="Learn how ViralClipCatch protects your privacy when downloading videos from YouTube, TikTok, Instagram, Facebook. No personal data stored." />
        <meta name="keywords" content="privacy policy, video downloader privacy, data protection, online privacy, youtube downloader privacy" />
        <link rel="canonical" href="https://viralclipcatch.com/privacy-policy" />
      </Helmet>
      
      <div className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
        
        <p className="mb-4"><strong>Last Updated:</strong> November 23, 2025</p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">1. Introduction</h2>
        <p className="mb-4">
          ViralClipCatch ("we", "our", "us") respects your privacy and is committed to protecting your personal information. 
          This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our video downloading service.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">2. Information We Collect</h2>
        
        <h3 className="text-xl font-semibold mt-6 mb-3">2.1 Information You Provide</h3>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li><strong>URLs</strong>: Video links you submit for downloading</li>
          <li><strong>Preferences</strong>: Settings such as theme (dark/light mode)</li>
        </ul>
        
        <h3 className="text-xl font-semibold mt-6 mb-3">2.2 Automatically Collected Information</h3>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li><strong>Device Information</strong>: Browser type, operating system, device identifiers</li>
          <li><strong>Usage Data</strong>: Pages visited, features used, time spent on the service</li>
          <li><strong>IP Address</strong>: For analytics and security purposes</li>
          <li><strong>Technical Data</strong>: Browser settings, plug-in types and versions</li>
        </ul>
        
        <h3 className="text-xl font-semibold mt-6 mb-3">2.3 Analytics Information</h3>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li><strong>Download Statistics</strong>: Number of downloads, platforms used</li>
          <li><strong>Performance Data</strong>: Page load times, error rates</li>
          <li><strong>User Engagement</strong>: Feature usage patterns</li>
        </ul>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">3. How We Use Your Information</h2>
        <p className="mb-4">We use the collected information for:</p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>Providing and maintaining our service</li>
          <li>Improving and personalizing user experience</li>
          <li>Analyzing usage patterns and trends</li>
          <li>Detecting and preventing fraudulent or unauthorized activities</li>
          <li>Communicating with you about service updates</li>
          <li>Complying with legal obligations</li>
        </ul>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">4. Information Sharing and Disclosure</h2>
        <p className="mb-4">
          We do not sell, trade, or rent your personal information to third parties. We may share information in the following circumstances:
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li><strong>With Your Consent</strong>: When you explicitly authorize sharing</li>
          <li><strong>For Legal Compliance</strong>: When required by law or legal process</li>
          <li><strong>To Protect Rights</strong>: To protect our rights, property, or safety, or that of others</li>
          <li><strong>Business Transfers</strong>: In connection with a merger, acquisition, or sale of assets</li>
        </ul>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">5. Data Storage and Security</h2>
        
        <h3 className="text-xl font-semibold mt-6 mb-3">5.1 Data Storage</h3>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>All data is stored locally on your device</li>
          <li>No personal information is stored on our servers</li>
          <li>Analytics data is stored temporarily for service improvement</li>
        </ul>
        
        <h3 className="text-xl font-semibold mt-6 mb-3">5.2 Security Measures</h3>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>We implement appropriate technical and organizational security measures</li>
          <li>Data is transmitted using secure HTTPS encryption</li>
          <li>Regular security assessments and updates</li>
        </ul>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">6. Third-Party Services</h2>
        <p className="mb-4">
          Our service may contain links to third-party websites or use third-party services:
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li><strong>yt-dlp</strong>: Open-source video downloading library</li>
          <li><strong>Video Platforms</strong>: YouTube, TikTok, Instagram, etc. (you interact directly with these platforms)</li>
          <li><strong>Hosting Services</strong>: Vercel, Render, or similar hosting providers</li>
        </ul>
        <p className="mb-4">
          These third parties have their own privacy policies and we are not responsible for their content or practices.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">7. Your Rights and Choices</h2>
        
        <h3 className="text-xl font-semibold mt-6 mb-3">7.1 Browser Controls</h3>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li><strong>Cookies</strong>: You can control cookies through your browser settings</li>
          <li><strong>Do Not Track</strong>: We honor Do Not Track signals when supported by your browser</li>
        </ul>
        
        <h3 className="text-xl font-semibold mt-6 mb-3">7.2 Data Management</h3>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>Clear your browser cache and cookies to remove local data</li>
          <li>Use private/incognito browsing mode for temporary sessions</li>
        </ul>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">8. Children's Privacy</h2>
        <p className="mb-4">
          Our service is not intended for children under 13 years of age. We do not knowingly collect personal information 
          from children under 13. If we become aware that we have collected such information, we will take steps to delete it.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">9. International Data Transfers</h2>
        <p className="mb-4">
          If you access our service from outside your country of residence, your information may be transferred to and 
          processed in countries other than your own. By using our service, you consent to such transfers.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">10. Changes to This Privacy Policy</h2>
        <p className="mb-4">
          We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new 
          Privacy Policy on this page and updating the "Last Updated" date.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">11. Contact Us</h2>
        <p className="mb-4">
          If you have any questions about this Privacy Policy, please contact us at:
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>Email: <a href="mailto:privacy@viralclipcatch.com" className="text-primary hover:underline">privacy@viralclipcatch.com</a></li>
          <li>Website: <a href="https://viralclipcatch.com" className="text-primary hover:underline">https://viralclipcatch.com</a></li>
        </ul>
      </div>
    </>
  );
}