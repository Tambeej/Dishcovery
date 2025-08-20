import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../auth/AuthProvider";
import { searchRecipes, getRecipeById } from "../services/api";
import {
  listFavorites,
  toggleFavorite as dbToggleFavorite,
} from "../services/db";
import {
  toggleFav as lsToggleFav,
  getFavs as lsGetFavs,
} from "../services/localStorage";

// tiny inline UI bits so you don't depend on other components
function Spinner() {
  return <div style={{ padding: 12 }}>Loading…</div>;
}
function ErrorMsg({ text }) {
  return <div style={{ color: "crimson", marginTop: 8 }}>{text}</div>;
}

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

export default function Dev() {
  const { user } = useAuth();
  const isLoggedIn = !!user;

  const [ingredientsText, setIngredientsText] = useState("chicken, garlic");
  const [diet, setDiet] = useState("meat"); // optional with TheMealDB (heuristic)
  const [intolerances, setIntolerances] = useState([]); // not enforced by TheMealDB by default
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const [results, setResults] = useState([]); // list from searchRecipes
  const [activeId, setActiveId] = useState(null); // selected recipe id
  const [details, setDetails] = useState(null); // detail recipe
  const [favIds, setFavIds] = useState(new Set()); // to render "★"

  // Load existing favorites (guest or authed)
  useEffect(() => {
    (async () => {
      if (isLoggedIn) {
        try {
          const rows = await listFavorites();
          setFavIds(new Set(rows.map((r) => String(r.recipe_id))));
        } catch (e) {
          console.warn("Failed to load DB favorites:", e);
        }
      } else {
        const rows = lsGetFavs();
        setFavIds(new Set(rows.map((r) => String(r.recipe_id))));
      }
    })();
  }, [isLoggedIn]);

  const ingredients = useMemo(
    () =>
      ingredientsText
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    [ingredientsText]
  );

  async function runSearch(e) {
    e?.preventDefault?.();
    setErr("");
    setLoading(true);
    setDetails(null);
    setActiveId(null);
    try {
      const list = await searchRecipes({ ingredients, diet, intolerances });
      setResults(list);
      if (list.length === 0) setErr("No recipes found for those ingredients.");
    } catch (e) {
      console.error(e);
      setErr(e?.message || "Search failed");
    } finally {
      setLoading(false);
    }
  }

  async function loadDetails(id) {
    setErr("");
    setDetails(null);
    setActiveId(id);
    try {
      const d = await getRecipeById(id);
      setDetails(d);
    } catch (e) {
      console.error(e);
      setErr("Failed to load recipe details");
    }
  }

  async function toggleFav(recipe) {
    const payload = { id: recipe.id, title: recipe.title, image: recipe.image };
    try {
      if (isLoggedIn) {
        const res = await dbToggleFavorite(payload);
        setFavIds((prev) => {
          const next = new Set(prev);
          if (res.added) next.add(String(recipe.id));
          if (res.removed) next.delete(String(recipe.id));
          return next;
        });
      } else {
        const list = lsToggleFav(payload);
        setFavIds(new Set(list.map((r) => String(r.recipe_id))));
      }
    } catch (e) {
      console.error(e);
      alert("Failed to toggle favorite");
    }
  }

  function toggleInt(name, checked) {
    setIntolerances((prev) => {
      const s = new Set(prev);
      if (checked) s.add(name);
      else s.delete(name);
      return Array.from(s);
    });
  }

  return (
    <div style={{ maxWidth: 1100, margin: "20px auto", padding: 16 }}>
      <h1>Dishcovery Dev Playground</h1>
      <p style={{ color: "#666" }}>
        Logged in: <b>{isLoggedIn ? user.email : "No (Guest mode)"}</b>
      </p>

      <form
        onSubmit={runSearch}
        style={{
          display: "grid",
          gap: 12,
          alignItems: "start",
          gridTemplateColumns: "1fr auto",
        }}
      >
        <div>
          <label style={{ display: "block", marginBottom: 6, fontWeight: 600 }}>
            Ingredients (comma-separated)
          </label>
          <input
            value={ingredientsText}
            onChange={(e) => setIngredientsText(e.target.value)}
            placeholder="e.g. chicken, garlic"
            style={{ width: "100%", padding: 10, boxSizing: "border-box" }}
          />
          <div
            style={{
              display: "flex",
              gap: 12,
              marginTop: 10,
              flexWrap: "wrap",
            }}
          >
            <div>
              <label
                style={{ display: "block", marginBottom: 4, fontWeight: 600 }}
              >
                Diet (optional)
              </label>
              <select value={diet} onChange={(e) => setDiet(e.target.value)}>
                <option value="meat">Meat</option>
                <option value="vegetarian">Vegetarian</option>
                <option value="vegan">Vegan</option>
              </select>
            </div>
            <div>
              <label
                style={{ display: "block", marginBottom: 4, fontWeight: 600 }}
              >
                Intolerances (optional)
              </label>
              <div
                style={{
                  display: "flex",
                  gap: 10,
                  flexWrap: "wrap",
                  maxWidth: 600,
                }}
              >
                {ALL_INTOLERANCES.map((name) => (
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
                      checked={intolerances.includes(name)}
                      onChange={(e) => toggleInt(name, e.target.checked)}
                    />
                    <span>{name}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
          <small style={{ color: "#666" }}>
            TheMealDB only filters by one ingredient at a time. We fetch
            per-ingredient and intersect on the client.
          </small>
        </div>
        <div>
          <button type="submit" style={{ padding: "10px 16px" }}>
            {loading ? "Searching…" : "Search"}
          </button>
        </div>
      </form>

      {err && <ErrorMsg text={err} />}

      {loading && <Spinner />}

      {/* Results */}
      <div
        style={{
          marginTop: 16,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: 16,
        }}
      >
        {results.map((r) => {
          const fav = favIds.has(String(r.id));
          return (
            <div
              key={r.id}
              style={{
                border: "1px solid #eee",
                borderRadius: 8,
                overflow: "hidden",
              }}
            >
              <img
                src={r.image}
                alt={r.title}
                style={{ width: "100%", height: 150, objectFit: "cover" }}
              />
              <div style={{ padding: 10 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <h4 style={{ margin: 0, fontSize: 16, lineHeight: 1.2 }}>
                    {r.title}
                  </h4>
                  <button
                    onClick={() => toggleFav(r)}
                    title={fav ? "Remove favorite" : "Add favorite"}
                  >
                    {fav ? "★" : "☆"}
                  </button>
                </div>
                <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                  <button onClick={() => loadDetails(r.id)}>Details</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Details */}
      {activeId && (
        <div
          style={{ marginTop: 24, borderTop: "1px solid #eee", paddingTop: 16 }}
        >
          <h3>Details for #{activeId}</h3>
          {!details && <Spinner />}
          {details && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "300px 1fr",
                gap: 16,
              }}
            >
              <img
                src={details.image}
                alt={details.title}
                style={{ width: "100%", borderRadius: 8 }}
              />
              <div>
                <h2 style={{ marginTop: 0 }}>{details.title}</h2>
                <p style={{ color: "#666", marginTop: 0 }}>
                  {details.category ? `Category: ${details.category} · ` : ""}
                  {details.area ? `Area: ${details.area}` : ""}
                </p>
                <h4>Ingredients</h4>
                <ul style={{ marginTop: 8 }}>
                  {details.ingredients.map((it, idx) => (
                    <li key={idx}>
                      {it.ingredient} — {it.measure}
                    </li>
                  ))}
                </ul>
                <h4>Instructions</h4>
                <p style={{ whiteSpace: "pre-wrap" }}>
                  {details.instructions || "No instructions provided."}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
