"use client";

import { useState, useEffect } from "react";
import Button from "@/components/Button";
import Table from "@/components/Table";

export default function ReportsPage() {
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchReport = async () => {
    setLoading(true);
    try {
      let url = "/api/movements/report";
      const params = new URLSearchParams();
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);
      if (params.toString()) url += `?${params.toString()}`;

      const res = await fetch(url);
      const data = await res.json();
      setReportData(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching report data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchReport();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", width: "100%" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1 className="page-title">Reporte de Movimientos</h1>
      </div>

      <form onSubmit={handleFilterSubmit} style={{
        display: "flex",
        gap: "1rem",
        alignItems: "flex-end",
        marginBottom: "2rem",
        background: "var(--gray-light)",
        padding: "1.5rem",
        borderRadius: "0.5rem",
        border: "1px solid var(--border)"
      }}>
        <div className="form-group" style={{ marginBottom: 0, flex: 1 }}>
          <label style={{ display: "block", marginBottom: "0.25rem", fontSize: "0.875rem" }}>Fecha Inicial</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            style={{ width: "100%" }}
          />
        </div>
        <div className="form-group" style={{ marginBottom: 0, flex: 1 }}>
          <label style={{ display: "block", marginBottom: "0.25rem", fontSize: "0.875rem" }}>Fecha Final</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            style={{ width: "100%" }}
          />
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? "Filtrando..." : "Filtrar"}
        </Button>
      </form>

      {loading ? (
        <p>Cargando reporte...</p>
      ) : reportData.length === 0 ? (
        <p style={{ textAlign: "center", padding: "2rem", color: "var(--gray-text)" }}>
          No se encontraron movimientos para este rango de fechas.
        </p>
      ) : (
        <Table
          headers={["Sucursal", "Tipo", "Cantidad de Movimientos", "Cantidad Total"]}
          data={reportData}
          renderRow={(row) => {
            const typeLabel = row.type === "in" ? "Entrada" :
                              row.type === "out" ? "Salida" :
                              row.type === "adjustment" ? "Ajuste" : "Transferencia";
            return (
              <>
                <td style={{ fontWeight: "600" }}>{row.branchName}</td>
                <td>
                  <span className={`badge badge-${row.type}`}>
                    {typeLabel}
                  </span>
                </td>
                <td>{row.count}</td>
                <td style={{
                  fontWeight: "600",
                  color: row.quantity < 0 ? "var(--danger)" : "inherit"
                }}>
                  {row.quantity}
                </td>
              </>

            );
          }}
        />
      )}
    </div>
  );
}
