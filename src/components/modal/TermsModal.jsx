import { useState } from "react";
import useTermsModal from "../../stores/useTermsModal";

export default function TermsModal({ onAccept }) {
  const { isOpen, closeModal } = useTermsModal();
  const [isChecked, setIsChecked] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl h-[80vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-8 md:px-8 pb-0">
          <h2 className="text-2xl font-bold text-blue-600">Terms and Conditions</h2>
          <p className="text-sm font-semibold text-gray-800 mt-1">Your Agreement</p>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6 md:px-8 text-sm text-gray-700 leading-relaxed space-y-4">
          <p className="text-xs text-gray-500">Last Revised: December 16, 2025</p>
          <p className="mt-2">
            Welcome to www.lorem-ipsum.info. This site is provided as a service to our visitors and may be used for informational purposes only. Because the Terms and Conditions contain legal obligations, please read them carefully.
          </p>

          <p className="font-bold text-gray-800 mt-4">1. YOUR AGREEMENT</p>
          <p>
            By using this Site, you agree to be bound by, and to comply with, these Terms and Conditions. If you do not agree to these Terms and Conditions, please do not use this site.
          </p>
          <p>
            PLEASE NOTE: We reserve the right, at our sole discretion, to change, modify or otherwise alter these Terms and Conditions at any time. Unless otherwise indicated, amendments will become effective immediately. Please review these Terms and Conditions periodically. Your continued use of the Site following the posting of changes and/or modifications will constitute your acceptance of the revised Terms and Conditions and the reasonableness of these standards for notice of changes. For your information, this page was last updated as of the date at the top of these terms and conditions.
          </p>

          <p className="font-bold text-gray-800 mt-4">2. PRIVACY</p>
          <p>
            Please review our Privacy Policy, which also governs your visit to this Site, to understand our practices.
          </p>

          <p className="font-bold text-gray-800 mt-4">3. LINKED SITES</p>
          <p>
            This Site may contain links to other independent third-party web sites (“Linked Sites”). These Linked Sites are provided solely as a convenience to our visitors. Such Linked Sites are not under our control, and we are not responsible for and does not responsible for compliance with all local laws.
          </p>

          <p className="font-bold text-gray-800 mt-4">12. GENERAL</p>
          <p>
            A. If any provision of these Terms and Conditions is held to be invalid or unenforceable, the provision shall be removed (or interpreted, if possible, in a manner as to be enforceable), and the remaining provisions shall be enforced. Headings are for reference purposes only and in no way define, limit, construe or describe the scope or extent of such section. Our failure to act with respect to a breach by you or others does not waive our right to act with respect to subsequent or similar breaches. These Terms and Conditions set forth the entire understanding and agreement between us with respect to the subject matter contained herein and supersede any other agreement, proposals and communications, written or oral, between our representatives and you with respect to the subject matter hereof, including any terms and conditions on any of customer’s documents or purchase orders.
          </p>
          <p>
            B. No Joint Venture, No Derogation of Rights. You agree that no joint venture, partnership, employment, or agency relationship exists between you and us as a result of these Terms and Conditions or your use of the Site. Our performance of these Terms and Conditions is subject to existing laws and legal process, and nothing contained herein is in derogation of our right to comply with governmental, court and law enforcement requests or requirements relating to your use of the Site or information provided to or gathered by us with respect to such use.
          </p>
          <p className="mt-4">
            By continuing to use this website, you agree to be bound by these
            terms and conditions. If you do not agree, please discontinue use of
            the site immediately. These terms constitute the entire agreement between you and us regarding your use of the website.
          </p>
        </div>

        {/* Footer dengan Checkbox & Buttons */}
        <div className="p-6 md:p-8 border-t border-gray-200 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="agree"
              checked={isChecked}
              onChange={(e) => setIsChecked(e.target.checked)}
              className="mr-2 h-4 w-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="agree" className="text-sm text-black">
              I confirm that I have read and accept the terms and conditions and privacy policy.
            </label>
          </div>

          <div className="flex gap-3 justify-end">
            <button
              onClick={closeModal}
              className="px-4 py-2 rounded-lg text-blue-600 border border-transparent hover:border-blue-600 transition"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (isChecked) {
                  onAccept?.();
                  closeModal();
                }
              }}
              disabled={!isChecked}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}