import React from 'react';
import { Link } from 'wasp/client/router';

export default function TermsOfService() {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-6">Terms of Service</h1>
      <p className="text-sm mb-4">Last updated: August 3, 2024</p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">Welcome to letmecook!</h2>
      <p className="mb-4">
        By using letmecook, you agree to these terms. If you don't agree, please don't use our service.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">Your Account</h2>
      <ul className="list-disc list-inside mb-4">
        <li>Keep your password safe. You're responsible for everything that happens under your account.</li>
        <li>No bots or automated accounts. Only real people can use letmecook.</li>
        <li>Follow our rules. Don't use letmecook for anything illegal or harmful.</li>
      </ul>
      <h2 className="text-2xl font-semibold mt-6 mb-2">Cancelling Your Account</h2>
      <ul className="list-disc list-inside mb-4">
        <li>You can cancel your account anytime. Please reach out in the <a href="https://discord.gg/U7ttVJS2us" className="link link-hover" target="_blank">Discord</a> to do so.</li>
        <li>Once canceled, your data will be inaccessible immediately and permanently deleted within 60 days.</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6 mb-2">Privacy and Security</h2>
      <ul className="list-disc list-inside mb-4">
        <li>We take your privacy seriously. Check our <Link to="/privacy-policy" className="link">Privacy Policy</Link> for details.</li>
        <li>We use encryption and other security measures to protect your data.</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6 mb-2">Liability</h2>
      <p className="mb-4">
        We provide letmecook "as is" and "as available". We are not responsible for any damages or losses related to your use of letmecook.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">Modifications to the Service</h2>
      <p className="mb-4">
        We may change or discontinue our services at any time. We will notify you of any significant changes.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">Contact Us</h2>
      <p className="mb-4">
        If you have any questions about these terms, please contact us in the <a href="https://discord.gg/U7ttVJS2us" className="underline" target="_blank">Discord</a>.
      </p>
    </div>
  );
};
