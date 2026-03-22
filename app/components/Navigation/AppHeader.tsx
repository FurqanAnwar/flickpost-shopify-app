"use client";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import styles from "./AppHeader.module.css";
type Tab = "orders" | "book-shipment" | "consignments";

interface AppHeaderProps {
  activeTab: Tab;
}

function AppHeader({ activeTab }: AppHeaderProps) {
  const params = useSearchParams();
  const shop = params.get("shop") || "";
  const host = params.get("host") || "";
  const query = `?shop=${shop}&host=${host}`;

  const tabs: { id: Tab; label: string; href: string }[] = [
    { id: "orders", label: "Orders", href: `/${query}` },
    { id: "book-shipment", label: "Book Shipment", href: `/book-shipment${query}` },
    { id: "consignments", label: "Consignments", href: `/consignments${query}` },
  ];

  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <svg className={styles.logo} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="32" height="32" rx="8" fill="#1a1a2e" />
          <path d="M8 10h16M8 16h10M8 22h13" stroke="#6c63ff" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="24" cy="22" r="4" fill="#6c63ff" />
          <path d="M22 22l1.5 1.5L26 20" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className={styles.brandName}>Flickpost</span>
      </div>

      <nav className={styles.nav}>
        {tabs.map((tab) => (
          <Link
            key={tab.id}
            href={tab.href}
            className={`${styles.tab} ${activeTab === tab.id ? styles.active : ""}`}
          >
            {tab.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}

export default AppHeader;