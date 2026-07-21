import { useMemo, useState } from "react";
import { Other, Plural, One, useNeokapi } from "@neokapi/i18n-react/runtime";
import { PRODUCTS } from "./data";
import { setLocale, storedLocale, type Locale } from "./i18n";
import { LanguagePicker } from "./LanguagePicker";

type Tab = "home" | "products" | "cart" | "checkout" | "account";

export function App() {
  const [tab, setTab] = useState<Tab>("home");
  const [cart, setCart] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const [locale, setLocaleState] = useState<Locale>(() => storedLocale());

  // Subscribe the tree to the neokapi-i18n translation store so every string
  // re-renders when the active catalog changes. The stored locale is applied
  // in main.tsx before the first render (no flash of English).
  useNeokapi();

  const changeLocale = (next: Locale) => {
    setLocaleState(next);
    void setLocale(next);
  };

  const add = (id: string) => setCart((c) => [...c, id]);
  const removeAt = (index: number) => setCart((c) => c.filter((_, i) => i !== index));

  const results = useMemo(
    () => PRODUCTS.filter((p) => p.name.toLowerCase().includes(query.toLowerCase())),
    [query],
  );

  return (
    <div className="app">
      <header className="topbar">
        <a className="brand" onClick={() => setTab("home")}>
          BowMart
        </a>
        <nav>
          <button className={nav(tab, "home")} onClick={() => setTab("home")}>
            Home
          </button>
          <button className={nav(tab, "products")} onClick={() => setTab("products")}>
            Products
          </button>
          <button className={nav(tab, "cart")} onClick={() => setTab("cart")}>
            Cart{cart.length > 0 && <span className="badge">{cart.length}</span>}
          </button>
          <button className={nav(tab, "checkout")} onClick={() => setTab("checkout")}>
            Checkout
          </button>
          <button className={nav(tab, "account")} onClick={() => setTab("account")}>
            Account
          </button>
        </nav>
        <LanguagePicker locale={locale} onChange={changeLocale} />
      </header>

      <main>
        {tab === "home" && <Home onShop={() => setTab("products")} />}
        {tab === "products" && (
          <Products query={query} setQuery={setQuery} results={results} onAdd={add} />
        )}
        {tab === "cart" && (
          <Cart
            cart={cart}
            onRemoveAt={removeAt}
            onShop={() => setTab("products")}
            onPay={() => setTab("checkout")}
          />
        )}
        {tab === "checkout" && <Checkout />}
        {tab === "account" && <Account />}
      </main>

      <footer className="foot">
        <p>BowMart is a storefront and order platform for small retailers.</p>
      </footer>
    </div>
  );
}

function nav(tab: Tab, target: Tab) {
  return tab === target ? "navlink active" : "navlink";
}

function Home({ onShop }: { onShop: () => void }) {
  return (
    <section className="hero">
      <h1>Everything for your store, in one place</h1>
      <p className="lede">
        BowMart brings your catalog, orders, and customers together so you can spend less time
        switching tools and more time selling.
      </p>
      <button className="cta" onClick={onShop}>
        Browse products
      </button>
      <p className="about">
        BowMart is a storefront and order platform for small retailers. Connect your products, take
        payments, and ship orders from a single dashboard. Your AI assistant drafts product
        descriptions and answers customer questions while you stay in control of every word.
      </p>
    </section>
  );
}

function Products({
  query,
  setQuery,
  results,
  onAdd,
}: {
  query: string;
  setQuery: (v: string) => void;
  results: typeof PRODUCTS;
  onAdd: (id: string) => void;
}) {
  return (
    <section>
      <h2>Products</h2>
      <input
        className="search"
        placeholder="Search products"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {results.length === 0 ? (
        <p className="empty">No products match your search yet.</p>
      ) : (
        <div className="grid">
          {results.map((p) => (
            <article key={p.id} className="card">
              <div className="thumb" aria-hidden />
              <h3>{p.name}</h3>
              <p className="blurb">{p.blurb}</p>
              <div className="cardfoot">
                <span className="price">{p.price} each</span>
                <button className="add" onClick={() => onAdd(p.id)}>
                  Add to cart
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

function Cart({
  cart,
  onRemoveAt,
  onShop,
  onPay,
}: {
  cart: string[];
  onRemoveAt: (index: number) => void;
  onShop: () => void;
  onPay: () => void;
}) {
  const items = cart.map((id) => PRODUCTS.find((p) => p.id === id)!).filter(Boolean);
  if (items.length === 0) {
    return (
      <section>
        <h2>Your cart</h2>
        <p className="empty">Your cart is empty. Browse products to get started.</p>
        <button className="cta" onClick={onShop}>
          Continue shopping
        </button>
      </section>
    );
  }
  return (
    <section>
      <h2>Your cart</h2>
      <p className="count">
        <Plural count={items.length}>
          <One># item in your cart</One>
          <Other># items in your cart</Other>
        </Plural>
      </p>
      <ul className="lines">
        {items.map((p, i) => (
          <li key={`${p.id}-${i}`}>
            <span>{p.name}</span>
            <span className="price">{p.price}</span>
            <button className="link" onClick={() => onRemoveAt(i)}>
              Remove
            </button>
          </li>
        ))}
      </ul>
      <div className="cartactions">
        <button className="link" onClick={onShop}>
          Continue shopping
        </button>
        <button className="cta" onClick={onPay}>
          Checkout
        </button>
      </div>
    </section>
  );
}

function Checkout() {
  const [placed, setPlaced] = useState(false);
  const [provider, setProvider] = useState("card");
  if (placed) {
    return (
      <section>
        <h2>Checkout</h2>
        <p className="confirm">Your order is confirmed. A receipt is on its way to your inbox.</p>
      </section>
    );
  }
  return (
    <section>
      <h2>Checkout</h2>
      <h3>Shipping address</h3>
      <input className="field" placeholder="Shipping address" />
      <h3>Payment method</h3>
      <select className="field" value={provider} onChange={(e) => setProvider(e.target.value)}>
        <option value="card">Pay with card</option>
        <option value="paypal">Pay with PayPal</option>
        <option value="applepay">Pay with Apple Pay</option>
      </select>
      <button className="cta" onClick={() => setPlaced(true)}>
        Place order
      </button>
    </section>
  );
}

function Account() {
  return (
    <section>
      <h2>Account</h2>
      <p className="welcome">Welcome back to BowMart</p>
      <h3>Your orders</h3>
      <p className="empty">You have not placed any orders yet.</p>
      <h3>Saved addresses</h3>
      <p className="empty">You have not saved any addresses yet.</p>
      <button className="link">Sign out</button>
    </section>
  );
}
