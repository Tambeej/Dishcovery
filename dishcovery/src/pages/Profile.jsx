import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../auth/AuthProvider";
import { getMyPreferences, upsertPreferences } from "../services/db";
import { getPrefs, savePrefs } from "../services/localStorage";

const DEFAULT_PREFS = {
  diet: "meat", // 'meat' | 'vegetarian' | 'vegan'
  intolerances: [], // ['gluten','peanut','dairy', ...]
  show_allergens: true,
};

const ALL_INTOLERANCES = [
  "gluten",
  "dairy",
  "egg",
  "peanut",
  "tree_nut",
  "soy",
  "fish",
  "shellfish",
  "sesame",
];

export default function Profile() {
  const { user, signOut } = useAuth();
  const isLoggedIn = !!user;

  const [prefs, setPrefs] = useState(DEFAULT_PREFS);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");

  // load existing prefs
  useEffect(() => {
    let alive = true;

    async function load() {
      setStatus("Loading preferences…");
      try {
        if (isLoggedIn) {
          const existing = await getMyPreferences();
          if (alive) {
            setPrefs({ ...DEFAULT_PREFS, ...(existing || {}) });
          }
        } else {
          const local = getPrefs();
          if (alive) {
            setPrefs({ ...DEFAULT_PREFS, ...(local || {}) });
          }
        }
      } catch (e) {
        console.error(e);
        if (alive) setStatus("Failed to load preferences.");
      } finally {
        if (alive) setStatus("");
      }
    }

    load();
    return () => {
      alive = false;
    };
  }, [isLoggedIn]);

  async function save() {
    setBusy(true);
    setStatus("");
    try {
      if (isLoggedIn) {
        // DB expects snake_case keys (show_allergens)
        await upsertPreferences({
          diet: prefs.diet,
          intolerances: prefs.intolerances,
          show_allergens: !!prefs.show_allergens,
        });
      } else {
        savePrefs(prefs);
      }
      setStatus("Saved ✅");
      setTimeout(() => setStatus(""), 1500);
    } catch (e) {
      console.error(e);
      setStatus("Save failed ❌");
    } finally {
      setBusy(false);
    }
  }

  const greeting = useMemo(() => {
    if (!isLoggedIn) return "Guest";
    const email = user.email || "User";
    return email.split("@")[0];
  }, [isLoggedIn, user]);

  return (
    <div style={{ maxWidth: 720, margin: "40px auto", padding: 16 }}>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1>Profile & Preferences</h1>
        <div>
          {isLoggedIn ? (
            <button onClick={signOut}>Sign out</button>
          ) : (
            <span style={{ color: "#666" }}>You are browsing as Guest</span>
          )}
        </div>
      </header>

      <section
        style={{
          border: "1px solid #eee",
          padding: 16,
          borderRadius: 8,
          marginTop: 12,
        }}
      >
        <h3 style={{ marginTop: 0 }}>Hello, {greeting} 👋</h3>

        <div style={{ marginTop: 16 }}>
          <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>
            Meal preference (diet)
          </label>
          <select
            value={prefs.diet}
            onChange={(e) => setPrefs((p) => ({ ...p, diet: e.target.value }))}
            style={{ padding: 8, minWidth: 240 }}
          >
            <option value="meat">Meat</option>
            <option value="vegetarian">Vegetarian</option>
            <option value="vegan">Vegan</option>
          </select>
        </div>

        <div style={{ marginTop: 16 }}>
          <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>
            Allergies / Intolerances
          </label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            {ALL_INTOLERANCES.map((name) => {
              const checked = prefs.intolerances.includes(name);
              return (
                <label
                  key={name}
                  style={{
                    display: "inline-flex",
                    gap: 6,
                    alignItems: "center",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) =>
                      setPrefs((p) => {
                        const next = new Set(p.intolerances);
                        if (e.target.checked) next.add(name);
                        else next.delete(name);
                        return { ...p, intolerances: Array.from(next) };
                      })
                    }
                  />
                  <span>{name}</span>
                </label>
              );
            })}
          </div>
        </div>

        <div style={{ marginTop: 16 }}>
          <label
            style={{ display: "inline-flex", gap: 8, alignItems: "center" }}
          >
            <input
              type="checkbox"
              checked={!!prefs.show_allergens}
              onChange={(e) =>
                setPrefs((p) => ({ ...p, show_allergens: e.target.checked }))
              }
            />
            <span>
              Show recipes that contain my allergens (not recommended)
            </span>
          </label>
        </div>

        <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
          <button onClick={save} disabled={busy}>
            {busy ? "Saving…" : "Save preferences"}
          </button>
          {status && <span style={{ color: "#555" }}>{status}</span>}
        </div>
      </section>

      <p style={{ marginTop: 12, color: "#666" }}>
        Guests: preferences & favorites are saved in your browser
        (localStorage). Logged-in users: stored securely in the database.
      </p>
    </div>
  );
}
