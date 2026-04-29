"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem("token")) {
      router.push("/");
    }
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const endpoint = isLogin ? "/api/auth/login" : "/api/auth/signup";

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Ocurrió un error");
      }

      if (isLogin) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("username", data.username);
        router.push("/");
        router.refresh();
      } else {
        setIsLogin(true);
        setUsername("");
        setPassword("");
        setSuccess("Registro exitoso. Por favor, inicia sesión.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">StockFlow</h1>
        <p className="login-subtitle">
          {isLogin ? "Ingresa a tu cuenta de inventario" : "Crea tu cuenta de inventario"}
        </p>

        {error && <div className="error-msg">{error}</div>}
        {success && <div className="success-msg">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Usuario</label>
            <input
              type="text"
              className="form-input"
              placeholder="Tu usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary login-btn" disabled={loading}>
            {loading ? "Procesando..." : isLogin ? "Iniciar Sesión" : "Registrarse"}
          </button>
        </form>

        <div className="toggle-auth">
          {isLogin ? "¿No tienes una cuenta?" : "¿Ya tienes una cuenta?"}
          <span
            className="toggle-link"
            onClick={() => {
              setIsLogin(!isLogin);
              setError("");
              setSuccess("");
            }}
          >
            {isLogin ? "Regístrate" : "Inicia sesión"}
          </span>
        </div>
      </div>
    </div>
  );
}
