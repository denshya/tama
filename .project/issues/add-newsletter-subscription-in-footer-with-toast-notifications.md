---
id: 39
status: done
~github: pinely-international/tama#93
---

**Description:**
- Currently, the footer only contains contact details and social media links. To improve user engagement, we should add a newsletter subscription form in the footer with toast notifications for success/error messages.

---

**Requirements:**
- Add a simple newsletter input field (for email) and a Subscribe button in the footer section.
- On form submission:
- Show a toast success notification (e.g., “✅ You have successfully subscribed!”).
- Show a toast error notification if the input is invalid or subscription fails (e.g., “❌ Please enter a valid email.”).
- Store the subscriber’s email in the backend/database (if integrated).
- Ensure proper validation (email format check).

---

**UI/UX Suggestions:**
- Place the newsletter box in the footer above the contact/social icons.
- Use a minimal design with good contrast (e.g., white input box + green/blue button).
- Toast should appear at the bottom-right or top-right for visibility.
