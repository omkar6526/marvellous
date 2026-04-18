// src/pages/Admin/AdminDashboard.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  addProduct,
  deleteProduct,
  getAdminStats,
  getAllOrders,
  getAllProducts,
  getAllUsers,
  updateOrderStatus,
  toggleProductAvailability,
} from "../../services/api";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [paymentFilter, setPaymentFilter] = useState("ALL");
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
    totalUsers: 0,
    totalProducts: 0,
    todayOrders: 0,
    todayRevenue: 0,
  });
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    description: "",
    isVeg: true,
    imageUrl: "",
    category: { id: 1 },
  });

  useEffect(() => {
    checkAdminAccess();
    loadDashboardData();
  }, []);

  const checkAdminAccess = () => {
    const role = localStorage.getItem("role");
    const token = localStorage.getItem("token");
    if (!token || role !== "ADMIN") {
      navigate("/");
    }
  };

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [statsRes, ordersRes, productsRes, usersRes] = await Promise.all([
        getAdminStats(),
        getAllOrders(),
        getAllProducts(),
        getAllUsers(),
      ]);
      setStats(statsRes.data);
      setOrders(ordersRes.data);
      setProducts(productsRes.data);
      setUsers(usersRes.data);
    } catch (error) {
      console.error("Error loading dashboard:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatusHandler = async (orderId, status) => {
    try {
      await updateOrderStatus(orderId, status);
      toast.success(`Order #${orderId} status updated to ${status}`);
      loadDashboardData();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const toggleProductStatus = async (productId) => {
    try {
      const response = await toggleProductAvailability(productId);
      if (response.data.success) {
        toast.success(response.data.message);
        loadDashboardData();
      }
    } catch (error) {
      toast.error("Failed to change product status");
    }
  };

  const deleteProductHandler = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const response = await deleteProduct(productId);
        if (response.data.action === "disabled") {
          toast.success(response.data.message);
        } else {
          toast.success("Product deleted successfully");
        }
        loadDashboardData();
      } catch (error) {
        toast.error("Failed to delete product");
      }
    }
  };

  const addProductHandler = async () => {
    if (!newProduct.name || !newProduct.price) {
      toast.error("Please fill required fields");
      return;
    }
    try {
      await addProduct({
        ...newProduct,
        price: parseFloat(newProduct.price),
      });
      toast.success("Product added successfully");
      setShowAddProduct(false);
      setNewProduct({
        name: "",
        price: "",
        description: "",
        isVeg: true,
        imageUrl: "",
        category: { id: 1 },
      });
      loadDashboardData();
    } catch (error) {
      toast.error("Failed to add product");
    }
  };

  const filteredOrders =
    paymentFilter === "ALL"
      ? orders
      : orders.filter((order) => order.paymentMethod === paymentFilter);

  const codOrders = orders.filter((o) => o.paymentMethod === "COD").length;
  const razorpayOrders = orders.filter(
    (o) => o.paymentMethod === "RAZORPAY",
  ).length;
  const cardOrders = orders.filter((o) => o.paymentMethod === "CARD").length;
  const upiOrders = orders.filter((o) => o.paymentMethod === "UPI").length;

  const codRevenue = orders
    .filter((o) => o.paymentMethod === "COD")
    .reduce((sum, o) => sum + (o.grandTotal || 0), 0);
  const razorpayRevenue = orders
    .filter((o) => o.paymentMethod === "RAZORPAY")
    .reduce((sum, o) => sum + (o.grandTotal || 0), 0);

  const getStatusColor = (status) => {
    const colors = {
      PENDING: "#f59e0b",
      CONFIRMED: "#3b82f6",
      PREPARING: "#8b5cf6",
      OUT_FOR_DELIVERY: "#06b6d4",
      DELIVERED: "#10b981",
      CANCELLED: "#ef4444",
    };
    return colors[status] || "#6b7280";
  };

  const getStatusIcon = (status) => {
    const icons = {
      PENDING: "⏰",
      CONFIRMED: "✓",
      PREPARING: "🍳",
      OUT_FOR_DELIVERY: "🚚",
      DELIVERED: "✅",
      CANCELLED: "❌",
    };
    return icons[status] || "📦";
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#0f0f23",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: "60px",
              height: "60px",
              border: "4px solid #667eea",
              borderTop: "4px solid transparent",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto 20px",
            }}
          ></div>
          <h3 style={{ color: "#667eea" }}>Loading Dashboard...</h3>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0f0f23" }}>
      {/* Admin Header */}
      <div
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          padding: "20px 30px",
          position: "sticky",
          top: 0,
          zIndex: 1000,
          boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
        }}
      >
        <div
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "15px",
          }}
        >
          <div>
            <h1
              style={{
                fontSize: "26px",
                margin: 0,
                color: "white",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <span>🍔</span> Marvel Kitchen Admin
            </h1>
            <p
              style={{
                fontSize: "13px",
                opacity: 0.9,
                marginTop: "5px",
                color: "rgba(255,255,255,0.9)",
              }}
            >
              Welcome back, {localStorage.getItem("name")}
            </p>
          </div>
          <button
            onClick={() => {
              localStorage.clear();
              window.location.href = "/login";
            }}
            style={{
              background: "rgba(255,255,255,0.15)",
              border: "1px solid rgba(255,255,255,0.3)",
              padding: "10px 24px",
              borderRadius: "30px",
              color: "white",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "500",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) =>
              (e.target.style.background = "rgba(255,255,255,0.25)")
            }
            onMouseLeave={(e) =>
              (e.target.style.background = "rgba(255,255,255,0.15)")
            }
          >
            🚪 Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "30px" }}>
        {/* Payment Method Stats Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "20px",
            marginBottom: "30px",
          }}
        >
          <div
            style={{
              background: "#1a1a3e",
              borderRadius: "20px",
              padding: "20px",
              border: "1px solid rgba(16, 185, 129, 0.2)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <div style={{ fontSize: "14px", color: "#a0a0c0" }}>
                  💵 Cash on Delivery
                </div>
                <div
                  style={{
                    fontSize: "28px",
                    fontWeight: "bold",
                    color: "#10b981",
                  }}
                >
                  {codOrders}
                </div>
                <div style={{ fontSize: "12px", color: "#a0a0c0" }}>Orders</div>
              </div>
              <div style={{ fontSize: "40px" }}>💵</div>
            </div>
            <div
              style={{ marginTop: "10px", fontSize: "12px", color: "#10b981" }}
            >
              Revenue: ₹{codRevenue}
            </div>
          </div>
          <div
            style={{
              background: "#1a1a3e",
              borderRadius: "20px",
              padding: "20px",
              border: "1px solid rgba(102, 126, 234, 0.2)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <div style={{ fontSize: "14px", color: "#a0a0c0" }}>
                  💳 Razorpay
                </div>
                <div
                  style={{
                    fontSize: "28px",
                    fontWeight: "bold",
                    color: "#667eea",
                  }}
                >
                  {razorpayOrders}
                </div>
                <div style={{ fontSize: "12px", color: "#a0a0c0" }}>Orders</div>
              </div>
              <div style={{ fontSize: "40px" }}>💳</div>
            </div>
            <div
              style={{ marginTop: "10px", fontSize: "12px", color: "#667eea" }}
            >
              Revenue: ₹{razorpayRevenue}
            </div>
          </div>
          <div
            style={{
              background: "#1a1a3e",
              borderRadius: "20px",
              padding: "20px",
              border: "1px solid rgba(245, 158, 11, 0.2)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <div style={{ fontSize: "14px", color: "#a0a0c0" }}>
                  💳 Card
                </div>
                <div
                  style={{
                    fontSize: "28px",
                    fontWeight: "bold",
                    color: "#f59e0b",
                  }}
                >
                  {cardOrders}
                </div>
                <div style={{ fontSize: "12px", color: "#a0a0c0" }}>Orders</div>
              </div>
              <div style={{ fontSize: "40px" }}>💳</div>
            </div>
          </div>
          <div
            style={{
              background: "#1a1a3e",
              borderRadius: "20px",
              padding: "20px",
              border: "1px solid rgba(6, 182, 212, 0.2)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <div style={{ fontSize: "14px", color: "#a0a0c0" }}>📱 UPI</div>
                <div
                  style={{
                    fontSize: "28px",
                    fontWeight: "bold",
                    color: "#06b6d4",
                  }}
                >
                  {upiOrders}
                </div>
                <div style={{ fontSize: "12px", color: "#a0a0c0" }}>Orders</div>
              </div>
              <div style={{ fontSize: "40px" }}>📱</div>
            </div>
          </div>
        </div>

        {/* Modern Tabs */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            marginBottom: "30px",
            flexWrap: "wrap",
            background: "#1a1a3e",
            borderRadius: "16px",
            padding: "8px",
            boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
          }}
        >
          {[
            { id: "dashboard", label: "📊 Dashboard" },
            { id: "orders", label: "📦 Orders" },
            { id: "products", label: "🍕 Products" },
            { id: "users", label: "👥 Users" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: "12px 28px",
                background:
                  activeTab === tab.id
                    ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                    : "transparent",
                color: activeTab === tab.id ? "white" : "#a0a0c0",
                border: "none",
                borderRadius: "12px",
                cursor: "pointer",
                fontWeight: activeTab === tab.id ? "600" : "500",
                fontSize: "14px",
                transition: "all 0.3s ease",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ========== DASHBOARD TAB ========== */}
        {activeTab === "dashboard" && (
          <div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "24px",
                marginBottom: "40px",
              }}
            >
              <div
                style={{
                  background: "#1a1a3e",
                  borderRadius: "20px",
                  padding: "24px",
                  border: "1px solid rgba(102, 126, 234, 0.2)",
                  transition: "transform 0.3s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "translateY(-5px)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "translateY(0)")
                }
              >
                <div style={{ fontSize: "48px" }}>📦</div>
                <div
                  style={{
                    fontSize: "32px",
                    fontWeight: "bold",
                    color: "#667eea",
                  }}
                >
                  {stats.totalOrders}
                </div>
                <div style={{ color: "#a0a0c0" }}>Total Orders</div>
              </div>
              <div
                style={{
                  background: "#1a1a3e",
                  borderRadius: "20px",
                  padding: "24px",
                  border: "1px solid rgba(245, 158, 11, 0.2)",
                  transition: "transform 0.3s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "translateY(-5px)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "translateY(0)")
                }
              >
                <div style={{ fontSize: "48px" }}>⏰</div>
                <div
                  style={{
                    fontSize: "32px",
                    fontWeight: "bold",
                    color: "#f59e0b",
                  }}
                >
                  {stats.pendingOrders}
                </div>
                <div style={{ color: "#a0a0c0" }}>Pending Orders</div>
              </div>
              <div
                style={{
                  background: "#1a1a3e",
                  borderRadius: "20px",
                  padding: "24px",
                  border: "1px solid rgba(16, 185, 129, 0.2)",
                  transition: "transform 0.3s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "translateY(-5px)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "translateY(0)")
                }
              >
                <div style={{ fontSize: "48px" }}>💰</div>
                <div
                  style={{
                    fontSize: "32px",
                    fontWeight: "bold",
                    color: "#10b981",
                  }}
                >
                  ₹{stats.totalRevenue}
                </div>
                <div style={{ color: "#a0a0c0" }}>Total Revenue</div>
              </div>
              <div
                style={{
                  background: "#1a1a3e",
                  borderRadius: "20px",
                  padding: "24px",
                  border: "1px solid rgba(139, 92, 246, 0.2)",
                  transition: "transform 0.3s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "translateY(-5px)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "translateY(0)")
                }
              >
                <div style={{ fontSize: "48px" }}>👥</div>
                <div
                  style={{
                    fontSize: "32px",
                    fontWeight: "bold",
                    color: "#8b5cf6",
                  }}
                >
                  {stats.totalUsers}
                </div>
                <div style={{ color: "#a0a0c0" }}>Total Users</div>
              </div>
              <div
                style={{
                  background: "#1a1a3e",
                  borderRadius: "20px",
                  padding: "24px",
                  border: "1px solid rgba(6, 182, 212, 0.2)",
                  transition: "transform 0.3s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "translateY(-5px)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "translateY(0)")
                }
              >
                <div style={{ fontSize: "48px" }}>🍕</div>
                <div
                  style={{
                    fontSize: "32px",
                    fontWeight: "bold",
                    color: "#06b6d4",
                  }}
                >
                  {stats.totalProducts}
                </div>
                <div style={{ color: "#a0a0c0" }}>Total Products</div>
              </div>
              <div
                style={{
                  background: "#1a1a3e",
                  borderRadius: "20px",
                  padding: "24px",
                  border: "1px solid rgba(245, 158, 11, 0.2)",
                  transition: "transform 0.3s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "translateY(-5px)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "translateY(0)")
                }
              >
                <div style={{ fontSize: "48px" }}>📅</div>
                <div
                  style={{
                    fontSize: "32px",
                    fontWeight: "bold",
                    color: "#f59e0b",
                  }}
                >
                  {stats.todayOrders}
                </div>
                <div style={{ color: "#a0a0c0" }}>Today's Orders</div>
              </div>
            </div>

            <div
              style={{
                background: "#1a1a3e",
                borderRadius: "20px",
                padding: "24px",
                border: "1px solid rgba(102, 126, 234, 0.2)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "20px",
                  flexWrap: "wrap",
                  gap: "15px",
                }}
              >
                <h3 style={{ color: "white", fontSize: "18px" }}>
                  Recent Orders
                </h3>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  {["ALL", "COD", "RAZORPAY", "CARD", "UPI"].map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setPaymentFilter(filter)}
                      style={{
                        padding: "6px 16px",
                        borderRadius: "20px",
                        background:
                          paymentFilter === filter
                            ? filter === "COD"
                              ? "#10b981"
                              : filter === "RAZORPAY"
                                ? "#667eea"
                                : filter === "CARD"
                                  ? "#f59e0b"
                                  : filter === "UPI"
                                    ? "#06b6d4"
                                    : "#667eea"
                            : "#2a2a5e",
                        color: "white",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "12px",
                      }}
                    >
                      {filter === "ALL"
                        ? "All"
                        : filter === "COD"
                          ? "💵 COD"
                          : filter === "RAZORPAY"
                            ? "💳 Razorpay"
                            : filter === "CARD"
                              ? "💳 Card"
                              : "📱 UPI"}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr
                      style={{
                        borderBottom: "1px solid rgba(255,255,255,0.1)",
                      }}
                    >
                      <th style={{ padding: "12px", color: "#a0a0c0" }}>ID</th>
                      <th style={{ padding: "12px", color: "#a0a0c0" }}>
                        Customer
                      </th>
                      <th style={{ padding: "12px", color: "#a0a0c0" }}>
                        Amount
                      </th>
                      <th style={{ padding: "12px", color: "#a0a0c0" }}>
                        Payment
                      </th>
                      <th style={{ padding: "12px", color: "#a0a0c0" }}>
                        Status
                      </th>
                      <th style={{ padding: "12px", color: "#a0a0c0" }}>
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.slice(0, 5).map((order) => (
                      <tr
                        key={order.id}
                        style={{
                          borderBottom: "1px solid rgba(255,255,255,0.05)",
                        }}
                      >
                        <td style={{ padding: "12px", color: "#fff" }}>
                          #{order.id}
                        </td>
                        <td style={{ padding: "12px", color: "#c0c0e0" }}>
                          {order.user?.name || "Guest"}
                        </td>
                        <td style={{ padding: "12px", color: "#10b981" }}>
                          ₹{order.grandTotal}
                        </td>
                        <td style={{ padding: "12px" }}>
                          <span
                            style={{
                              background:
                                order.paymentMethod === "COD"
                                  ? "rgba(16,185,129,0.2)"
                                  : "rgba(102,126,234,0.2)",
                              color:
                                order.paymentMethod === "COD"
                                  ? "#10b981"
                                  : "#667eea",
                              padding: "4px 12px",
                              borderRadius: "20px",
                              fontSize: "12px",
                            }}
                          >
                            {order.paymentMethod === "COD"
                              ? "💵 COD"
                              : "💳 Razorpay"}
                          </span>
                        </td>
                        <td style={{ padding: "12px" }}>
                          <span
                            style={{
                              background: `${getStatusColor(order.status)}20`,
                              color: getStatusColor(order.status),
                              padding: "4px 12px",
                              borderRadius: "20px",
                              fontSize: "12px",
                            }}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td style={{ padding: "12px" }}>
                          <select
                            value={order.status}
                            onChange={(e) =>
                              updateOrderStatusHandler(order.id, e.target.value)
                            }
                            style={{
                              padding: "6px 12px",
                              borderRadius: "8px",
                              background: "#2a2a5e",
                              color: "white",
                              border: "1px solid #3a3a6e",
                              cursor: "pointer",
                            }}
                          >
                            <option value="PENDING">Pending</option>
                            <option value="CONFIRMED">Confirmed</option>
                            <option value="PREPARING">Preparing</option>
                            <option value="OUT_FOR_DELIVERY">
                              Out for Delivery
                            </option>
                            <option value="DELIVERED">Delivered</option>
                            <option value="CANCELLED">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========== ORDERS TAB ========== */}
        {activeTab === "orders" && (
          <div
            style={{
              background: "#1a1a3e",
              borderRadius: "20px",
              padding: "24px",
              border: "1px solid rgba(102, 126, 234, 0.2)",
            }}
          >
            {/* Header with Stats */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "24px",
                flexWrap: "wrap",
                gap: "15px",
              }}
            >
              <div>
                <h3 style={{ color: "white", fontSize: "18px", margin: 0 }}>
                  All Orders
                </h3>
                <p
                  style={{
                    color: "#a0a0c0",
                    fontSize: "13px",
                    marginTop: "5px",
                  }}
                >
                  Total: {orders.length} orders | Revenue: ₹
                  {orders.reduce((sum, o) => sum + (o.grandTotal || 0), 0)}
                </p>
              </div>

              {/* Payment Filter Buttons */}
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                {["ALL", "COD", "RAZORPAY", "CARD", "UPI"].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setPaymentFilter(filter)}
                    style={{
                      padding: "6px 16px",
                      borderRadius: "20px",
                      background:
                        paymentFilter === filter
                          ? filter === "COD"
                            ? "#10b981"
                            : filter === "RAZORPAY"
                              ? "#667eea"
                              : filter === "CARD"
                                ? "#f59e0b"
                                : filter === "UPI"
                                  ? "#06b6d4"
                                  : "#667eea"
                          : "#2a2a5e",
                      color: "white",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "12px",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      if (paymentFilter !== filter)
                        e.target.style.background = "#3a3a6e";
                    }}
                    onMouseLeave={(e) => {
                      if (paymentFilter !== filter)
                        e.target.style.background = "#2a2a5e";
                    }}
                  >
                    {filter === "ALL"
                      ? "📋 All"
                      : filter === "COD"
                        ? "💵 COD"
                        : filter === "RAZORPAY"
                          ? "💳 Razorpay"
                          : filter === "CARD"
                            ? "💳 Card"
                            : "📱 UPI"}
                  </button>
                ))}
              </div>
            </div>

            {/* Orders Table */}
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr
                    style={{ borderBottom: "2px solid rgba(255,255,255,0.1)" }}
                  >
                    <th
                      style={{
                        padding: "12px",
                        textAlign: "left",
                        color: "#a0a0c0",
                        fontWeight: "600",
                      }}
                    >
                      Order ID
                    </th>
                    <th
                      style={{
                        padding: "12px",
                        textAlign: "left",
                        color: "#a0a0c0",
                        fontWeight: "600",
                      }}
                    >
                      Customer
                    </th>
                    <th
                      style={{
                        padding: "12px",
                        textAlign: "center",
                        color: "#a0a0c0",
                        fontWeight: "600",
                      }}
                    >
                      Items
                    </th>
                    <th
                      style={{
                        padding: "12px",
                        textAlign: "center",
                        color: "#a0a0c0",
                        fontWeight: "600",
                      }}
                    >
                      Amount
                    </th>
                    <th
                      style={{
                        padding: "12px",
                        textAlign: "center",
                        color: "#a0a0c0",
                        fontWeight: "600",
                      }}
                    >
                      Payment
                    </th>
                    <th
                      style={{
                        padding: "12px",
                        textAlign: "center",
                        color: "#a0a0c0",
                        fontWeight: "600",
                      }}
                    >
                      Status
                    </th>
                    <th
                      style={{
                        padding: "12px",
                        textAlign: "center",
                        color: "#a0a0c0",
                        fontWeight: "600",
                      }}
                    >
                      Date
                    </th>
                    <th
                      style={{
                        padding: "12px",
                        textAlign: "center",
                        color: "#a0a0c0",
                        fontWeight: "600",
                      }}
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td
                        colSpan="8"
                        style={{
                          textAlign: "center",
                          padding: "60px",
                          color: "#a0a0c0",
                        }}
                      >
                        <div style={{ fontSize: "48px", marginBottom: "16px" }}>
                          📦
                        </div>
                        <p>No orders found for selected filter</p>
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => (
                      <tr
                        key={order.id}
                        style={{
                          borderBottom: "1px solid rgba(255,255,255,0.05)",
                        }}
                      >
                        {/* Order ID */}
                        <td style={{ padding: "12px" }}>
                          <div style={{ color: "#fff", fontWeight: "600" }}>
                            #{order.id}
                          </div>
                          <div style={{ color: "#a0a0c0", fontSize: "11px" }}>
                            {order.orderId}
                          </div>
                        </td>

                        {/* Customer */}
                        <td style={{ padding: "12px" }}>
                          <div style={{ color: "white", fontWeight: "500" }}>
                            {order.user?.name || "Guest User"}
                          </div>
                          <div style={{ color: "#a0a0c0", fontSize: "11px" }}>
                            {order.user?.email || "No email"}
                          </div>
                          <div style={{ color: "#a0a0c0", fontSize: "11px" }}>
                            📞 {order.phoneNumber || "N/A"}
                          </div>
                        </td>

                        {/* Items Count */}
                        <td style={{ padding: "12px", textAlign: "center" }}>
                          <span
                            style={{
                              background: "#2a2a5e",
                              padding: "4px 10px",
                              borderRadius: "20px",
                              color: "white",
                              fontSize: "12px",
                            }}
                          >
                            {order.items?.length || 0} items
                          </span>
                        </td>

                        {/* Amount */}
                        <td style={{ padding: "12px", textAlign: "center" }}>
                          <span
                            style={{
                              color: "#10b981",
                              fontWeight: "bold",
                              fontSize: "16px",
                            }}
                          >
                            ₹{order.grandTotal}
                          </span>
                        </td>

                        {/* Payment Method */}
                        <td style={{ padding: "12px", textAlign: "center" }}>
                          <span
                            style={{
                              background:
                                order.paymentMethod === "COD"
                                  ? "rgba(16,185,129,0.2)"
                                  : order.paymentMethod === "RAZORPAY"
                                    ? "rgba(102,126,234,0.2)"
                                    : order.paymentMethod === "CARD"
                                      ? "rgba(245,158,11,0.2)"
                                      : "rgba(6,182,212,0.2)",
                              color:
                                order.paymentMethod === "COD"
                                  ? "#10b981"
                                  : order.paymentMethod === "RAZORPAY"
                                    ? "#667eea"
                                    : order.paymentMethod === "CARD"
                                      ? "#f59e0b"
                                      : "#06b6d4",
                              padding: "4px 12px",
                              borderRadius: "20px",
                              fontSize: "12px",
                              fontWeight: "500",
                            }}
                          >
                            {order.paymentMethod === "COD"
                              ? "💵 COD"
                              : order.paymentMethod === "RAZORPAY"
                                ? "💳 Razorpay"
                                : order.paymentMethod === "CARD"
                                  ? "💳 Card"
                                  : "📱 UPI"}
                          </span>
                        </td>

                        {/* Status */}
                        <td style={{ padding: "12px", textAlign: "center" }}>
                          <span
                            style={{
                              background: `${getStatusColor(order.status)}20`,
                              color: getStatusColor(order.status),
                              padding: "4px 12px",
                              borderRadius: "20px",
                              fontSize: "12px",
                              fontWeight: "500",
                            }}
                          >
                            {getStatusIcon(order.status)} {order.status}
                          </span>
                        </td>

                        {/* Date */}
                        <td style={{ padding: "12px", textAlign: "center" }}>
                          <div style={{ color: "#c0c0e0", fontSize: "12px" }}>
                            {new Date(order.orderedAt).toLocaleDateString()}
                          </div>
                          <div style={{ color: "#a0a0c0", fontSize: "10px" }}>
                            {new Date(order.orderedAt).toLocaleTimeString()}
                          </div>
                        </td>

                        {/* Action */}
                        <td style={{ padding: "12px", textAlign: "center" }}>
                          <select
                            value={order.status}
                            onChange={(e) =>
                              updateOrderStatusHandler(order.id, e.target.value)
                            }
                            style={{
                              padding: "6px 12px",
                              borderRadius: "8px",
                              background: "#2a2a5e",
                              color: "white",
                              border: "1px solid #3a3a6e",
                              cursor: "pointer",
                              fontSize: "12px",
                            }}
                          >
                            <option value="PENDING">⏰ Pending</option>
                            <option value="CONFIRMED">✓ Confirmed</option>
                            <option value="PREPARING">🍳 Preparing</option>
                            <option value="OUT_FOR_DELIVERY">
                              🚚 Out for Delivery
                            </option>
                            <option value="DELIVERED">✅ Delivered</option>
                            <option value="CANCELLED">❌ Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========== PRODUCTS TAB ========== */}
        {activeTab === "products" && (
          <div
            style={{
              background: "#1a1a3e",
              borderRadius: "20px",
              padding: "24px",
              border: "1px solid rgba(102, 126, 234, 0.2)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "24px",
                flexWrap: "wrap",
                gap: "15px",
              }}
            >
              <h3 style={{ color: "white", fontSize: "18px", margin: 0 }}>
                Products Management
              </h3>
              <button
                onClick={() => setShowAddProduct(!showAddProduct)}
                style={{
                  background:
                    "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                  color: "white",
                  border: "none",
                  padding: "10px 24px",
                  borderRadius: "30px",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "500",
                  transition: "transform 0.2s",
                }}
                onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
                onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
              >
                + Add New Product
              </button>
            </div>

            {showAddProduct && (
              <div
                style={{
                  background: "#2a2a5e",
                  padding: "24px",
                  borderRadius: "16px",
                  marginBottom: "24px",
                }}
              >
                <h4 style={{ color: "white", marginBottom: "16px" }}>
                  Add New Product
                </h4>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                    gap: "16px",
                  }}
                >
                  <input
                    type="text"
                    placeholder="Product Name"
                    value={newProduct.name}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, name: e.target.value })
                    }
                    style={{
                      padding: "12px 16px",
                      borderRadius: "10px",
                      background: "#1a1a3e",
                      border: "1px solid #3a3a6e",
                      color: "white",
                      outline: "none",
                    }}
                  />
                  <input
                    type="number"
                    placeholder="Price"
                    value={newProduct.price}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, price: e.target.value })
                    }
                    style={{
                      padding: "12px 16px",
                      borderRadius: "10px",
                      background: "#1a1a3e",
                      border: "1px solid #3a3a6e",
                      color: "white",
                      outline: "none",
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Image URL"
                    value={newProduct.imageUrl}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, imageUrl: e.target.value })
                    }
                    style={{
                      padding: "12px 16px",
                      borderRadius: "10px",
                      background: "#1a1a3e",
                      border: "1px solid #3a3a6e",
                      color: "white",
                      outline: "none",
                    }}
                  />
                  <textarea
                    placeholder="Description"
                    value={newProduct.description}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        description: e.target.value,
                      })
                    }
                    rows="2"
                    style={{
                      padding: "12px 16px",
                      borderRadius: "10px",
                      background: "#1a1a3e",
                      border: "1px solid #3a3a6e",
                      color: "white",
                      outline: "none",
                      resize: "vertical",
                    }}
                  />
                </div>
                <div
                  style={{ display: "flex", gap: "12px", marginTop: "20px" }}
                >
                  <button
                    onClick={addProductHandler}
                    style={{
                      background: "#667eea",
                      color: "white",
                      padding: "10px 24px",
                      border: "none",
                      borderRadius: "10px",
                      cursor: "pointer",
                    }}
                  >
                    Save Product
                  </button>
                  <button
                    onClick={() => setShowAddProduct(false)}
                    style={{
                      background: "#ef4444",
                      color: "white",
                      padding: "10px 24px",
                      border: "none",
                      borderRadius: "10px",
                      cursor: "pointer",
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Products Table - Better UI */}
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr
                    style={{ borderBottom: "2px solid rgba(255,255,255,0.1)" }}
                  >
                    <th
                      style={{
                        padding: "12px",
                        textAlign: "left",
                        color: "#a0a0c0",
                        fontWeight: "600",
                      }}
                    >
                      ID
                    </th>
                    <th
                      style={{
                        padding: "12px",
                        textAlign: "left",
                        color: "#a0a0c0",
                        fontWeight: "600",
                      }}
                    >
                      Product
                    </th>
                    <th
                      style={{
                        padding: "12px",
                        textAlign: "center",
                        color: "#a0a0c0",
                        fontWeight: "600",
                      }}
                    >
                      Price
                    </th>
                    <th
                      style={{
                        padding: "12px",
                        textAlign: "center",
                        color: "#a0a0c0",
                        fontWeight: "600",
                      }}
                    >
                      Status
                    </th>
                    <th
                      style={{
                        padding: "12px",
                        textAlign: "center",
                        color: "#a0a0c0",
                        fontWeight: "600",
                      }}
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr
                      key={product.id}
                      style={{
                        borderBottom: "1px solid rgba(255,255,255,0.05)",
                      }}
                    >
                      {/* ID Column */}
                      <td
                        style={{
                          padding: "12px",
                          color: "#fff",
                          fontWeight: "500",
                        }}
                      >
                        {product.id}
                      </td>

                      {/* Product Column - Name + Description */}
                      <td style={{ padding: "12px" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                          }}
                        >
                          {/* Product Image Placeholder */}
                          <div
                            style={{
                              width: "48px",
                              height: "48px",
                              background: `linear-gradient(135deg, ${product.isVeg ? "#10b981" : "#ef4444"}20, #2a2a5e)`,
                              borderRadius: "10px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "24px",
                            }}
                          >
                            {product.isVeg ? "🌱" : "🍖"}
                          </div>
                          <div>
                            <div
                              style={{
                                color: "white",
                                fontWeight: "600",
                                marginBottom: "4px",
                              }}
                            >
                              {product.name}
                            </div>
                            <div
                              style={{
                                color: "#a0a0c0",
                                fontSize: "12px",
                                maxWidth: "300px",
                              }}
                            >
                              {product.description?.length > 60
                                ? product.description.substring(0, 60) + "..."
                                : product.description || "No description"}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Price Column */}
                      <td style={{ padding: "12px", textAlign: "center" }}>
                        <span
                          style={{
                            color: "#10b981",
                            fontWeight: "bold",
                            fontSize: "16px",
                          }}
                        >
                          ₹{product.price}
                        </span>
                      </td>

                      {/* Status Column */}
                      <td style={{ padding: "12px", textAlign: "center" }}>
                        <button
                          onClick={() => toggleProductStatus(product.id)}
                          style={{
                            padding: "4px 12px",
                            borderRadius: "20px",
                            border: "none",
                            cursor: "pointer",
                            background: product.isAvailable
                              ? "#10b981"
                              : "#f59e0b",
                            color: "white",
                            fontSize: "11px",
                            fontWeight: "500",
                            transition: "all 0.2s",
                          }}
                          onMouseEnter={(e) => (e.target.style.opacity = "0.8")}
                          onMouseLeave={(e) => (e.target.style.opacity = "1")}
                        >
                          {product.isAvailable ? "✅ Active" : "⭕ Disabled"}
                        </button>
                      </td>

                      {/* Actions Column */}
                      <td style={{ padding: "12px", textAlign: "center" }}>
                        <button
                          onClick={() => deleteProductHandler(product.id)}
                          style={{
                            background: "#ef4444",
                            color: "white",
                            border: "none",
                            padding: "6px 16px",
                            borderRadius: "8px",
                            cursor: "pointer",
                            fontSize: "12px",
                            transition: "all 0.2s",
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.background = "#dc2626";
                            e.target.style.transform = "scale(1.05)";
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.background = "#ef4444";
                            e.target.style.transform = "scale(1)";
                          }}
                        >
                          {product.isAvailable ? "🗑️ Delete" : "👻 Hide"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Empty State */}
              {products.length === 0 && (
                <div
                  style={{
                    textAlign: "center",
                    padding: "60px",
                    color: "#a0a0c0",
                  }}
                >
                  <div style={{ fontSize: "64px", marginBottom: "16px" }}>
                    🍕
                  </div>
                  <p>
                    No products found. Click "Add New Product" to create one.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========== USERS TAB ========== */}
        {activeTab === "users" && (
          <div
            style={{
              background: "#1a1a3e",
              borderRadius: "20px",
              padding: "24px",
              border: "1px solid rgba(102, 126, 234, 0.2)",
            }}
          >
            {/* Header with Stats */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "24px",
                flexWrap: "wrap",
                gap: "15px",
              }}
            >
              <div>
                <h3 style={{ color: "white", fontSize: "18px", margin: 0 }}>
                  User Management
                </h3>
                <p
                  style={{
                    color: "#a0a0c0",
                    fontSize: "13px",
                    marginTop: "5px",
                  }}
                >
                  Total Users: {users.length} | Active:{" "}
                  {users.filter((u) => u.active !== false).length} | Admins:{" "}
                  {users.filter((u) => u.role === "ADMIN").length}
                </p>
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <input
                  type="text"
                  placeholder="🔍 Search users..."
                  style={{
                    padding: "8px 16px",
                    borderRadius: "20px",
                    background: "#2a2a5e",
                    border: "1px solid #3a3a6e",
                    color: "white",
                    outline: "none",
                    fontSize: "13px",
                    width: "200px",
                  }}
                />
              </div>
            </div>

            {/* Users Table */}
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr
                    style={{ borderBottom: "2px solid rgba(255,255,255,0.1)" }}
                  >
                    <th
                      style={{
                        padding: "12px",
                        textAlign: "left",
                        color: "#a0a0c0",
                        fontWeight: "600",
                      }}
                    >
                      ID
                    </th>
                    <th
                      style={{
                        padding: "12px",
                        textAlign: "left",
                        color: "#a0a0c0",
                        fontWeight: "600",
                      }}
                    >
                      User
                    </th>
                    <th
                      style={{
                        padding: "12px",
                        textAlign: "left",
                        color: "#a0a0c0",
                        fontWeight: "600",
                      }}
                    >
                      Contact
                    </th>
                    <th
                      style={{
                        padding: "12px",
                        textAlign: "center",
                        color: "#a0a0c0",
                        fontWeight: "600",
                      }}
                    >
                      Role
                    </th>
                    <th
                      style={{
                        padding: "12px",
                        textAlign: "center",
                        color: "#a0a0c0",
                        fontWeight: "600",
                      }}
                    >
                      Orders
                    </th>
                    <th
                      style={{
                        padding: "12px",
                        textAlign: "center",
                        color: "#a0a0c0",
                        fontWeight: "600",
                      }}
                    >
                      Total Spent
                    </th>
                    <th
                      style={{
                        padding: "12px",
                        textAlign: "center",
                        color: "#a0a0c0",
                        fontWeight: "600",
                      }}
                    >
                      Joined
                    </th>
                    <th
                      style={{
                        padding: "12px",
                        textAlign: "center",
                        color: "#a0a0c0",
                        fontWeight: "600",
                      }}
                    >
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr>
                      <td
                        colSpan="8"
                        style={{
                          textAlign: "center",
                          padding: "60px",
                          color: "#a0a0c0",
                        }}
                      >
                        <div style={{ fontSize: "48px", marginBottom: "16px" }}>
                          👥
                        </div>
                        <p>No users found</p>
                      </td>
                    </tr>
                  ) : (
                    users.map((user) => {
                      const userOrders = orders.filter(
                        (o) => o.user?.id === user.id,
                      );
                      const totalSpent = userOrders.reduce(
                        (sum, o) => sum + (o.grandTotal || 0),
                        0,
                      );

                      return (
                        <tr
                          key={user.id}
                          style={{
                            borderBottom: "1px solid rgba(255,255,255,0.05)",
                          }}
                        >
                          {/* ID */}
                          <td style={{ padding: "12px" }}>
                            <div style={{ color: "#fff", fontWeight: "600" }}>
                              #{user.id}
                            </div>
                          </td>

                          {/* User Info */}
                          <td style={{ padding: "12px" }}>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "12px",
                              }}
                            >
                              <div
                                style={{
                                  width: "40px",
                                  height: "40px",
                                  background:
                                    "linear-gradient(135deg, #667eea20, #764ba220)",
                                  borderRadius: "50%",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontSize: "20px",
                                }}
                              >
                                {user.role === "ADMIN" ? "👨‍💼" : "👤"}
                              </div>
                              <div>
                                <div
                                  style={{ color: "white", fontWeight: "500" }}
                                >
                                  {user.name}
                                </div>
                                <div
                                  style={{ color: "#a0a0c0", fontSize: "11px" }}
                                >
                                  {user.email}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Contact */}
                          <td style={{ padding: "12px" }}>
                            <div style={{ color: "#c0c0e0", fontSize: "13px" }}>
                              📞 {user.phone || "Not provided"}
                            </div>
                            <div
                              style={{
                                color: "#a0a0c0",
                                fontSize: "11px",
                                marginTop: "4px",
                              }}
                            >
                              📍{" "}
                              {user.address
                                ? user.address.length > 30
                                  ? user.address.substring(0, 30) + "..."
                                  : user.address
                                : "No address"}
                            </div>
                          </td>

                          {/* Role */}
                          <td style={{ padding: "12px", textAlign: "center" }}>
                            <span
                              style={{
                                background:
                                  user.role === "ADMIN"
                                    ? "rgba(102,126,234,0.2)"
                                    : "rgba(16,185,129,0.2)",
                                color:
                                  user.role === "ADMIN" ? "#667eea" : "#10b981",
                                padding: "4px 12px",
                                borderRadius: "20px",
                                fontSize: "12px",
                                fontWeight: "500",
                              }}
                            >
                              {user.role === "ADMIN" ? "👑 Admin" : "👤 User"}
                            </span>
                          </td>

                          {/* Orders Count */}
                          <td style={{ padding: "12px", textAlign: "center" }}>
                            <span
                              style={{
                                background: "#2a2a5e",
                                padding: "4px 10px",
                                borderRadius: "20px",
                                color: "white",
                                fontSize: "12px",
                              }}
                            >
                              {userOrders.length} orders
                            </span>
                          </td>

                          {/* Total Spent */}
                          <td style={{ padding: "12px", textAlign: "center" }}>
                            <span
                              style={{ color: "#10b981", fontWeight: "bold" }}
                            >
                              ₹{totalSpent}
                            </span>
                          </td>

                          {/* Joined Date */}
                          <td style={{ padding: "12px", textAlign: "center" }}>
                            <div style={{ color: "#c0c0e0", fontSize: "12px" }}>
                              {user.createdAt
                                ? new Date(user.createdAt).toLocaleDateString()
                                : "N/A"}
                            </div>
                          </td>

                          {/* Status */}
                          <td style={{ padding: "12px", textAlign: "center" }}>
                            <span
                              style={{
                                background: "#10b98120",
                                color: "#10b981",
                                padding: "4px 12px",
                                borderRadius: "20px",
                                fontSize: "11px",
                              }}
                            >
                              ✅ Active
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default AdminDashboard;
