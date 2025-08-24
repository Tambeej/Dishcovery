import "./Terms.css";

function Terms() {
  return (
    <div className="terms container py-5">
      <h1 className="mb-4">Terms & Conditions</h1>

      <p>
        Welcome to <strong>Dishcovery</strong>. By accessing or using our
        application, you agree to comply with and be bound by the following
        Terms & Conditions. Please read them carefully before using our service.
      </p>

      <h2>1. Acceptance of Terms</h2>
      <p>
        By using Dishcovery, you confirm that you are at least 13 years old (or
        the minimum age of digital consent in your country) and agree to these
        Terms & Conditions, as well as our Privacy Policy.
      </p>

      <h2>2. Purpose of the App</h2>
      <p>
        Dishcovery is a recipe discovery and meal suggestion tool. It provides
        personalized recipe recommendations based on your preferences and
        selected ingredients. While we strive for accuracy, Dishcovery does not
        guarantee that recipes will meet all dietary needs or restrictions.
        Please consult a qualified professional for health or dietary advice.
      </p>

      <h2>3. User Accounts</h2>
      <p>
        To access certain features, you may need to create an account. You agree
        to provide accurate information and keep your account secure. You are
        responsible for all activity under your account.
      </p>

      <h2>4. Favorites & Preferences</h2>
      <p>
        Dishcovery allows you to save favorites and set dietary preferences.
        These features are provided for your convenience only and may be stored
        securely in our database.
      </p>

      <h2>5. Third-Party Services</h2>
      <p>
        Our app integrates with third-party APIs (such as TheMealDB, Supabase,
        and others). We are not responsible for the accuracy, availability, or
        reliability of third-party content.
      </p>

      <h2>6. Intellectual Property</h2>
      <p>
        All content, logos, and branding associated with Dishcovery are the
        property of the app developers. You may not copy, distribute, or modify
        any part of the app without prior written consent.
      </p>

      <h2>7. Limitation of Liability</h2>
      <p>
        Dishcovery is provided “as is” without warranties of any kind. We are
        not liable for any damages or losses resulting from your use of the app,
        including but not limited to reliance on recipes, dietary outcomes, or
        third-party services.
      </p>

      <h2>8. Changes to Terms</h2>
      <p>
        We may update these Terms & Conditions from time to time. Continued use
        of the app after changes indicates your acceptance of the new terms.
      </p>

      <h2>9. Contact Us</h2>
      <p>
        If you have any questions about these Terms & Conditions, please contact
        us at: <a href="mailto:support@dishcovery.app">support@dishcovery.app</a>.
      </p>
    </div>
  );
}

export default Terms;
