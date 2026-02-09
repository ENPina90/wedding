import { useState, type FormEvent } from "react";
import PageHeader from "../components/PageHeader";

export default function RSVP() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    attending: "",
    guests: "1",
    dietaryRestrictions: "",
    songRequest: "",
    message: "",
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // In production, this would send to an API
    console.log("RSVP submitted:", formData);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-6 text-center py-16">
        <span className="text-5xl block mb-4">💌</span>
        <h2 className="font-display text-plum text-3xl tracking-[2.24px] italic mb-4">
          Thank You!
        </h2>
        <p className="font-body text-plum/75 text-lg">
          Your RSVP has been received. We can't wait to celebrate with you!
        </p>
        <button
          onClick={() => {
            setSubmitted(false);
            setFormData({
              name: "",
              email: "",
              attending: "",
              guests: "1",
              dietaryRestrictions: "",
              songRequest: "",
              message: "",
            });
          }}
          className="mt-8 text-coral hover:text-coral-hover underline underline-offset-4 font-body"
        >
          Submit another RSVP
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 pb-16">
      <PageHeader
        title="RSVP"
        subtitle="Please respond by October 1, 2026"
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name */}
        <div>
          <label className="block font-nav text-plum text-sm tracking-[1.2px] uppercase mb-2">
            Full Name *
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            className="w-full border border-pink rounded-lg px-4 py-3 font-body text-burgundy bg-white focus:outline-none focus:ring-2 focus:ring-plum/30 focus:border-plum transition-colors"
            placeholder="Your full name"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block font-nav text-plum text-sm tracking-[1.2px] uppercase mb-2">
            Email *
          </label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="w-full border border-pink rounded-lg px-4 py-3 font-body text-burgundy bg-white focus:outline-none focus:ring-2 focus:ring-plum/30 focus:border-plum transition-colors"
            placeholder="your@email.com"
          />
        </div>

        {/* Attending */}
        <div>
          <label className="block font-nav text-plum text-sm tracking-[1.2px] uppercase mb-2">
            Will you be attending? *
          </label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="attending"
                value="yes"
                required
                checked={formData.attending === "yes"}
                onChange={(e) =>
                  setFormData({ ...formData, attending: e.target.value })
                }
                className="accent-plum w-4 h-4"
              />
              <span className="font-body text-burgundy">
                Joyfully Accepts
              </span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="attending"
                value="no"
                checked={formData.attending === "no"}
                onChange={(e) =>
                  setFormData({ ...formData, attending: e.target.value })
                }
                className="accent-plum w-4 h-4"
              />
              <span className="font-body text-burgundy">
                Regretfully Declines
              </span>
            </label>
          </div>
        </div>

        {/* Number of Guests */}
        {formData.attending === "yes" && (
          <>
            <div>
              <label className="block font-nav text-plum text-sm tracking-[1.2px] uppercase mb-2">
                Number of Guests
              </label>
              <select
                value={formData.guests}
                onChange={(e) =>
                  setFormData({ ...formData, guests: e.target.value })
                }
                className="w-full border border-pink rounded-lg px-4 py-3 font-body text-burgundy bg-white focus:outline-none focus:ring-2 focus:ring-plum/30 focus:border-plum transition-colors"
              >
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
              </select>
            </div>

            {/* Dietary Restrictions */}
            <div>
              <label className="block font-nav text-plum text-sm tracking-[1.2px] uppercase mb-2">
                Dietary Restrictions
              </label>
              <input
                type="text"
                value={formData.dietaryRestrictions}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    dietaryRestrictions: e.target.value,
                  })
                }
                className="w-full border border-pink rounded-lg px-4 py-3 font-body text-burgundy bg-white focus:outline-none focus:ring-2 focus:ring-plum/30 focus:border-plum transition-colors"
                placeholder="Vegetarian, vegan, gluten-free, allergies, etc."
              />
            </div>

            {/* Song Request */}
            <div>
              <label className="block font-nav text-plum text-sm tracking-[1.2px] uppercase mb-2">
                Song Request
              </label>
              <input
                type="text"
                value={formData.songRequest}
                onChange={(e) =>
                  setFormData({ ...formData, songRequest: e.target.value })
                }
                className="w-full border border-pink rounded-lg px-4 py-3 font-body text-burgundy bg-white focus:outline-none focus:ring-2 focus:ring-plum/30 focus:border-plum transition-colors"
                placeholder="What song will get you on the dance floor?"
              />
            </div>
          </>
        )}

        {/* Message */}
        <div>
          <label className="block font-nav text-plum text-sm tracking-[1.2px] uppercase mb-2">
            Message for the Couple
          </label>
          <textarea
            value={formData.message}
            onChange={(e) =>
              setFormData({ ...formData, message: e.target.value })
            }
            rows={4}
            className="w-full border border-pink rounded-lg px-4 py-3 font-body text-burgundy bg-white focus:outline-none focus:ring-2 focus:ring-plum/30 focus:border-plum transition-colors resize-none"
            placeholder="Share your well wishes..."
          />
        </div>

        {/* Submit Button */}
        <div className="text-center pt-4">
          <button
            type="submit"
            className="bg-coral hover:bg-coral-hover active:bg-coral-active text-white font-body font-bold text-base tracking-[1.92px] px-10 py-4 rounded-lg transition-colors"
          >
            SEND RSVP
          </button>
        </div>
      </form>
    </div>
  );
}
