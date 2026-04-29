"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

export default function AppLayout({ children }) {
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUsername = localStorage.getItem("username") || "Usuario";
    setUsername(storedUsername);

    const isAuth = !!token;
    setIsAuthenticated(isAuth);
    setIsAuthChecked(true);

    if (!isAuth && pathname !== "/login") {
      router.push("/login");
    } else if (isAuth && pathname === "/login") {
      router.push("/");
    }
  }, [pathname, router]);

  // Interceptar peticiones fetch globales para añadir el token
  useEffect(() => {
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const [resource, config] = args;
      const token = localStorage.getItem("token");

      if (token && typeof resource === 'string' && resource.startsWith('/api/')) {
        const newConfig = { ...config || {} };
        newConfig.headers = {
          ...newConfig.headers,
          'Authorization': `Bearer ${token}`
        };
        return originalFetch(resource, newConfig);
      }
      return originalFetch(...args);
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, []);

  if (!isAuthChecked) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '100vw',
        fontFamily: 'system-ui, sans-serif',
        background: '#f9fafb',
        color: '#4b5563'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            border: '4px solid #e5e7eb',
            borderTop: '4px solid #2563eb',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }} />
          <style dangerouslySetInnerHTML={{
            __html: `
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          ` }} />
          <h3>Cargando...</h3>
        </div>
      </div>
    );
  }

  if (pathname === "/login") {
    return <>{children}</>;
  }

  if (!isAuthenticated) {
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    router.push("/login");
  };

  return (
    <div className="app-container">
      <aside className="sidebar">
        <Link href="/" className="logo">
          StockFlow
        </Link>
        <nav className="nav-links">
          <Link href="/" className={`nav-link ${pathname === "/" ? "active" : ""}`}>
            Dashboard
          </Link>
          <Link href="/products" className={`nav-link ${pathname.startsWith("/products") ? "active" : ""}`}>
            Productos
          </Link>
          <Link href="/branches" className={`nav-link ${pathname.startsWith("/branches") ? "active" : ""}`}>
            Sucursales
          </Link>
          <Link href="/stocks" className={`nav-link ${pathname.startsWith("/stocks") ? "active" : ""}`}>
            Inventario
          </Link>
          <Link href="/movements" className={`nav-link ${pathname.startsWith("/movements") ? "active" : ""}`}>
            Movimientos
          </Link>
          <Link href="/reports" className={`nav-link ${pathname.startsWith("/reports") ? "active" : ""}`}>
            Reportes
          </Link>
        </nav>

        <div style={{
          marginTop: "auto",
          padding: "1rem 0.5rem",
          borderTop: "1px solid var(--border)",
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem"
        }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            color: "var(--gray-text)",
            fontSize: "0.875rem",
            fontWeight: "500"
          }}>
            <span style={{ fontSize: "1.25rem" }}>👤</span>
            <span>{username}</span>
          </div>
          <button
            onClick={handleLogout}
            className="btn btn-danger"
            style={{
              width: "100%",
              padding: "0.5rem",
              fontSize: "0.875rem"
            }}
          >
            Cerrar Sesión
          </button>
        </div>
      </aside>
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}
