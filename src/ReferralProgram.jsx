import React, { useState } from "react";
import {
  Share2,
  Gift,
  Truck,
  UserPlus,
  Shirt,
  CheckCircle2,
  Link2,
} from "lucide-react";

const ReferralProgram = () => {
  const referralLink = "https://blacknykee.com/referral?code=USER123"; // Normally dynamic
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="container my-5">
      <div className="card shadow p-4 rounded-4">
        <h2 className="text-center mb-3">🎁 BLACKNYKEE Referral Program</h2>
        <p className="lead text-center">
          Invite your friends and earn{" "}
          <strong>exclusive BLACKNYKEE rewards!</strong>
        </p>

        {/* Rewards Section */}
        <div className="card my-4 p-3 border-0 bg-light rounded-3">
          <h5 className="mb-3">
            <Gift size={20} className="me-2 text-primary" /> What You Get
          </h5>
          <ul className="list-unstyled">
            <li className="mb-2">
              <Shirt size={18} className="me-2 text-dark" />
              <strong>1 FREE BLACKNYKEE T-shirt</strong> for every referral
            </li>
            <li>
              <Truck size={18} className="me-2 text-success" />
              <strong>5 FREE home deliveries</strong> for each successful signup
            </li>
          </ul>
        </div>

        {/* How it Works */}
        <div className="card my-4 p-3 border-0 bg-light rounded-3">
          <h5 className="mb-3">
            <UserPlus size={20} className="me-2 text-info" /> How It Works
          </h5>
          <ol className="ps-3">
            <li className="mb-1">
              <Link2 size={16} className="me-2 text-muted" />
              Copy and share your unique referral link.
            </li>
            <li className="mb-1">
              <UserPlus size={16} className="me-2 text-muted" />
              Your friend signs up and places their first order.
            </li>
            <li>
              <CheckCircle2 size={16} className="me-2 text-muted" />
              You get rewarded automatically!
            </li>
          </ol>
        </div>

        {/* Referral Link */}
        <div className="card my-4 p-3 border-0 bg-light rounded-3">
          <h5 className="mb-3">
            <Share2 size={20} className="me-2 text-warning" /> Your Referral
            Link
          </h5>
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              value={referralLink}
              readOnly
            />
            <button className="btn btn-dark" onClick={handleCopy}>
              {copied ? "Copied!" : "Copy Link"}
            </button>
          </div>
          {copied && (
            <small className="text-success mt-2 d-block">
              ✅ Link copied to clipboard!
            </small>
          )}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-4">
          <button className="btn btn-outline-primary px-4 py-2">
            Start Referring Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReferralProgram;
