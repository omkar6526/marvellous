// src/pages/Admin/AdminDashboard.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import {
  addProduct,
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
  const [deliveryBoys, setDeliveryBoys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
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
      const token = localStorage.getItem("token");
      const [statsRes, ordersRes, productsRes, usersRes, deliveryBoysRes] = await Promise.all([
        getAdminStats(),
        getAllOrders(),
        getAllProducts(),
        getAllUsers(),
        axios.get("http://localhost:8080/api/admin/delivery-boys", {
          headers: { Authorization: `Bearer ${token}` }
        }).catch(() => ({ data: [] }))
      ]);
      setStats(statsRes.data);
      setOrders(ordersRes.data);
      setProducts(productsRes.data);
      setUsers(usersRes.data);
      setDeliveryBoys(deliveryBoysRes.data || []);
    } catch (error) {
      console.error("Error loading dashboard:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  // Image Upload Function
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      toast.error("Please select an image");
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast((t) => (
        <span>
          ⚠️ Large image ({Math.round(file.size / 1024 / 1024)}MB). 
          Upload may take a moment.
        </span>
      ), { duration: 3000 });
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post("http://localhost:8080/api/upload/image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
        timeout: 120000,
      });

      if (response.data.success) {
        setNewProduct({ ...newProduct, imageUrl: response.data.imageUrl });
        toast.success("Image uploaded successfully!");
      } else {
        toast.error(response.data.message || "Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error.response?.data?.error || "Failed to upload image");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
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

  // ✅ Assign Delivery Boy to Order
  const assignDeliveryBoy = async (orderId, deliveryBoyId) => {
    if (!deliveryBoyId) return;
    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:8080/api/admin/orders/${orderId}/assign-delivery?deliveryBoyId=${deliveryBoyId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(`Delivery boy assigned to order #${orderId}`);
      loadDashboardData();
    } catch (error) {
      console.error("Assignment error:", error);
      toast.error(error.response?.data?.error || "Failed to assign delivery boy");
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

  const addProductHandler = async () => {
    if (!newProduct.name || !newProduct.price) {
      toast.error("Please fill required fields");
      return;
    }
    if (!newProduct.imageUrl) {
      toast.error("Please upload an image");
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

  const getImageUrl = (imageUrl, productName, isVeg) => {
    if (!imageUrl) return null;
    if (imageUrl.startsWith("/uploads/")) {
      return `http://localhost:8080${imageUrl}`;
    }
    if (imageUrl.startsWith("http") || imageUrl.startsWith("/images")) {
      return imageUrl;
    }
    return null;
  };

  const filteredOrders =
    paymentFilter === "ALL"
      ? orders
      : orders.filter((order) => order.paymentMethod === paymentFilter);

  const codOrders = orders.filter((o) => o.paymentMethod === "COD").length;
  const razorpayOrders = orders.filter((o) => o.paymentMethod === "RAZORPAY").length;
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
            <h1 style={{ fontSize: "26px", margin: 0, color: "white", display: "flex", alignItems: "center", gap: "10px" }}>
              <span>🍔</span> Marvel Kitchen Admin
            </h1>
            <p style={{ fontSize: "13px", opacity: 0.9, marginTop: "5px", color: "rgba(255,255,255,0.9)" }}>
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
          >
            🚪 Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "30px" }}>
        {/* Payment Stats Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px", marginBottom: "30px" }}>
          <div style={{ background: "#1a1a3e", borderRadius: "20px", padding: "20px", border: "1px solid rgba(16, 185, 129, 0.2)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: "14px", color: "#a0a0c0" }}>💵 Cash on Delivery</div>
                <div style={{ fontSize: "28px", fontWeight: "bold", color: "#10b981" }}>{codOrders}</div>
                <div style={{ fontSize: "12px", color: "#a0a0c0" }}>Orders</div>
              </div>
              <div style={{ fontSize: "40px" }}>💵</div>
            </div>
            <div style={{ marginTop: "10px", fontSize: "12px", color: "#10b981" }}>Revenue: ₹{codRevenue}</div>
          </div>
          <div style={{ background: "#1a1a3e", borderRadius: "20px", padding: "20px", border: "1px solid rgba(102, 126, 234, 0.2)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: "14px", color: "#a0a0c0" }}>💳 Razorpay</div>
                <div style={{ fontSize: "28px", fontWeight: "bold", color: "#667eea" }}>{razorpayOrders}</div>
                <div style={{ fontSize: "12px", color: "#a0a0c0" }}>Orders</div>
              </div>
              <div style={{ fontSize: "40px" }}>💳</div>
            </div>
            <div style={{ marginTop: "10px", fontSize: "12px", color: "#667eea" }}>Revenue: ₹{razorpayRevenue}</div>
          </div>
          <div style={{ background: "#1a1a3e", borderRadius: "20px", padding: "20px", border: "1px solid rgba(245, 158, 11, 0.2)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: "14px", color: "#a0a0c0" }}>💳 Card</div>
                <div style={{ fontSize: "28px", fontWeight: "bold", color: "#f59e0b" }}>{cardOrders}</div>
                <div style={{ fontSize: "12px", color: "#a0a0c0" }}>Orders</div>
              </div>
              <div style={{ fontSize: "40px" }}>💳</div>
            </div>
          </div>
          <div style={{ background: "#1a1a3e", borderRadius: "20px", padding: "20px", border: "1px solid rgba(6, 182, 212, 0.2)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: "14px", color: "#a0a0c0" }}>📱 UPI</div>
                <div style={{ fontSize: "28px", fontWeight: "bold", color: "#06b6d4" }}>{upiOrders}</div>
                <div style={{ fontSize: "12px", color: "#a0a0c0" }}>Orders</div>
              </div>
              <div style={{ fontSize: "40px" }}>📱</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "12px", marginBottom: "30px", flexWrap: "wrap", background: "#1a1a3e", borderRadius: "16px", padding: "8px" }}>
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
                background: activeTab === tab.id ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" : "transparent",
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

        {/* DASHBOARD TAB */}
        {activeTab === "dashboard" && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px", marginBottom: "40px" }}>
              <div style={{ background: "#1a1a3e", borderRadius: "20px", padding: "24px", border: "1px solid rgba(102, 126, 234, 0.2)" }}>
                <div style={{ fontSize: "48px" }}>📦</div>
                <div style={{ fontSize: "32px", fontWeight: "bold", color: "#667eea" }}>{stats.totalOrders}</div>
                <div style={{ color: "#a0a0c0" }}>Total Orders</div>
              </div>
              <div style={{ background: "#1a1a3e", borderRadius: "20px", padding: "24px", border: "1px solid rgba(245, 158, 11, 0.2)" }}>
                <div style={{ fontSize: "48px" }}>⏰</div>
                <div style={{ fontSize: "32px", fontWeight: "bold", color: "#f59e0b" }}>{stats.pendingOrders}</div>
                <div style={{ color: "#a0a0c0" }}>Pending Orders</div>
              </div>
              <div style={{ background: "#1a1a3e", borderRadius: "20px", padding: "24px", border: "1px solid rgba(16, 185, 129, 0.2)" }}>
                <div style={{ fontSize: "48px" }}>💰</div>
                <div style={{ fontSize: "32px", fontWeight: "bold", color: "#10b981" }}>₹{stats.totalRevenue}</div>
                <div style={{ color: "#a0a0c0" }}>Total Revenue</div>
              </div>
              <div style={{ background: "#1a1a3e", borderRadius: "20px", padding: "24px", border: "1px solid rgba(139, 92, 246, 0.2)" }}>
                <div style={{ fontSize: "48px" }}>👥</div>
                <div style={{ fontSize: "32px", fontWeight: "bold", color: "#8b5cf6" }}>{stats.totalUsers}</div>
                <div style={{ color: "#a0a0c0" }}>Total Users</div>
              </div>
              <div style={{ background: "#1a1a3e", borderRadius: "20px", padding: "24px", border: "1px solid rgba(6, 182, 212, 0.2)" }}>
                <div style={{ fontSize: "48px" }}>🍕</div>
                <div style={{ fontSize: "32px", fontWeight: "bold", color: "#06b6d4" }}>{stats.totalProducts}</div>
                <div style={{ color: "#a0a0c0" }}>Total Products</div>
              </div>
              <div style={{ background: "#1a1a3e", borderRadius: "20px", padding: "24px", border: "1px solid rgba(245, 158, 11, 0.2)" }}>
                <div style={{ fontSize: "48px" }}>📅</div>
                <div style={{ fontSize: "32px", fontWeight: "bold", color: "#f59e0b" }}>{stats.todayOrders}</div>
                <div style={{ color: "#a0a0c0" }}>Today's Orders</div>
              </div>
            </div>
          </div>
        )}

        {/* ORDERS TAB - WITH DELIVERY BOY ASSIGNMENT */}
        {activeTab === "orders" && (
          <div style={{ background: "#1a1a3e", borderRadius: "20px", padding: "24px", border: "1px solid rgba(102, 126, 234, 0.2)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", flexWrap: "wrap", gap: "15px" }}>
              <div>
                <h3 style={{ color: "white", fontSize: "18px", margin: 0 }}>All Orders</h3>
                <p style={{ color: "#a0a0c0", fontSize: "13px", marginTop: "5px" }}>Total: {orders.length} orders</p>
              </div>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                {["ALL", "COD", "RAZORPAY", "CARD", "UPI"].map((filter) => (
                  <button key={filter} onClick={() => setPaymentFilter(filter)} style={{ padding: "6px 16px", borderRadius: "20px", background: paymentFilter === filter ? "#667eea" : "#2a2a5e", color: "white", border: "none", cursor: "pointer" }}>
                    {filter === "ALL" ? "All" : filter}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid rgba(255,255,255,0.1)" }}>
                    <th style={{ padding: "12px", textAlign: "left", color: "#a0a0c0" }}>Order ID</th>
                    <th style={{ padding: "12px", textAlign: "left", color: "#a0a0c0" }}>Customer</th>
                    <th style={{ padding: "12px", textAlign: "center", color: "#a0a0c0" }}>Amount</th>
                    <th style={{ padding: "12px", textAlign: "center", color: "#a0a0c0" }}>Payment</th>
                    <th style={{ padding: "12px", textAlign: "center", color: "#a0a0c0" }}>Status</th>
                    <th style={{ padding: "12px", textAlign: "center", color: "#a0a0c0" }}>Assign Delivery</th>
                    <th style={{ padding: "12px", textAlign: "center", color: "#a0a0c0" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr key={order.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                      <td style={{ padding: "12px", color: "#fff" }}>#{order.id}</td>
                      <td style={{ padding: "12px", color: "#c0c0e0" }}>{order.user?.name || "Guest"}</td>
                      <td style={{ padding: "12px", textAlign: "center", color: "#10b981" }}>₹{order.grandTotal}</td>
                      <td style={{ padding: "12px", textAlign: "center" }}>
                        <span style={{ background: order.paymentMethod === "COD" ? "rgba(16,185,129,0.2)" : "rgba(102,126,234,0.2)", color: order.paymentMethod === "COD" ? "#10b981" : "#667eea", padding: "4px 12px", borderRadius: "20px", fontSize: "12px" }}>
                          {order.paymentMethod === "COD" ? "💵 COD" : "💳 Razorpay"}
                        </span>
                      </td>
                      <td style={{ padding: "12px", textAlign: "center" }}>
                        <span style={{ background: `${getStatusColor(order.status)}20`, color: getStatusColor(order.status), padding: "4px 12px", borderRadius: "20px", fontSize: "12px" }}>
                          {order.status}
                        </span>
                      </td>
                      {/* Delivery Boy Assignment Column */}
                      <td style={{ padding: "12px", textAlign: "center" }}>
                        {order.status !== "DELIVERED" && order.status !== "CANCELLED" ? (
                          <select
                            value={order.deliveryBoyId || ""}
                            onChange={(e) => assignDeliveryBoy(order.id, e.target.value)}
                            style={{
                              padding: "6px 12px",
                              borderRadius: "8px",
                              background: "#2a2a5e",
                              color: "white",
                              border: "1px solid #3a3a6e",
                              cursor: "pointer",
                              fontSize: "12px",
                              minWidth: "140px"
                            }}
                          >
                            <option value="">Select Delivery Boy</option>
                            {deliveryBoys.filter(b => b.isAvailable).map((boy) => (
                              <option key={boy.id} value={boy.id}>
                                🛵 {boy.name} - {boy.vehicleType} (⭐{boy.rating})
                              </option>
                            ))}
                          </select>
                        ) : (
                          <span style={{ color: "#a0a0c0", fontSize: "11px" }}>
                            {order.deliveryBoyId ? "✅ Assigned" : "—"}
                          </span>
                        )}
                      </td>
                      {/* Status Update Column */}
                      <td style={{ padding: "12px", textAlign: "center" }}>
                        <select 
                          value={order.status} 
                          onChange={(e) => updateOrderStatusHandler(order.id, e.target.value)} 
                          style={{ padding: "6px 12px", borderRadius: "8px", background: "#2a2a5e", color: "white", border: "1px solid #3a3a6e", cursor: "pointer" }}
                          disabled={order.status === "DELIVERED" || order.status === "CANCELLED"}
                        >
                          <option value="PENDING">Pending</option>
                          <option value="CONFIRMED">Confirmed</option>
                          <option value="PREPARING">Preparing</option>
                          <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
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
        )}

        {/* PRODUCTS TAB */}
        {activeTab === "products" && (
          <div style={{ background: "#1a1a3e", borderRadius: "20px", padding: "24px", border: "1px solid rgba(102, 126, 234, 0.2)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", flexWrap: "wrap", gap: "15px" }}>
              <h3 style={{ color: "white", fontSize: "18px", margin: 0 }}>Products Management</h3>
              <button
                onClick={() => setShowAddProduct(!showAddProduct)}
                style={{ background: "linear-gradient(135deg, #10b981 0%, #059669 100%)", color: "white", border: "none", padding: "10px 24px", borderRadius: "30px", cursor: "pointer", fontSize: "14px", fontWeight: "500" }}
              >
                + Add New Product
              </button>
            </div>

            {showAddProduct && (
              <div style={{ background: "#2a2a5e", padding: "24px", borderRadius: "16px", marginBottom: "24px" }}>
                <h4 style={{ color: "white", marginBottom: "16px" }}>Add New Product</h4>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "16px" }}>
                  <input type="text" placeholder="Product Name" value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} style={{ padding: "12px 16px", borderRadius: "10px", background: "#1a1a3e", border: "1px solid #3a3a6e", color: "white", outline: "none" }} />
                  <input type="number" placeholder="Price" value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} style={{ padding: "12px 16px", borderRadius: "10px", background: "#1a1a3e", border: "1px solid #3a3a6e", color: "white", outline: "none" }} />
                  
                  <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                    <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" style={{ display: "none" }} />
                    <button onClick={() => fileInputRef.current?.click()} disabled={uploading} style={{ background: "#667eea", color: "white", border: "none", padding: "12px 16px", borderRadius: "10px", cursor: "pointer", fontSize: "14px" }}>
                      {uploading ? "⏳ Uploading..." : "📁 Choose Image"}
                    </button>
                    {newProduct.imageUrl && (
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <img src={`http://localhost:8080${newProduct.imageUrl}`} alt="Preview" style={{ width: "40px", height: "40px", borderRadius: "8px", objectFit: "cover" }} />
                        <span style={{ color: "#10b981", fontSize: "12px" }}>✓ Uploaded</span>
                      </div>
                    )}
                  </div>
                  
                  <textarea placeholder="Description" value={newProduct.description} onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} rows="2" style={{ padding: "12px 16px", borderRadius: "10px", background: "#1a1a3e", border: "1px solid #3a3a6e", color: "white", outline: "none", resize: "vertical" }} />
                </div>
                
                <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
                  <button onClick={addProductHandler} style={{ background: "#667eea", color: "white", padding: "10px 24px", border: "none", borderRadius: "10px", cursor: "pointer" }}>Save Product</button>
                  <button onClick={() => setShowAddProduct(false)} style={{ background: "#ef4444", color: "white", padding: "10px 24px", border: "none", borderRadius: "10px", cursor: "pointer" }}>Cancel</button>
                </div>
              </div>
            )}

            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid rgba(255,255,255,0.1)" }}>
                    <th style={{ padding: "12px", textAlign: "left", color: "#a0a0c0" }}>ID</th>
                    <th style={{ padding: "12px", textAlign: "left", color: "#a0a0c0" }}>Product</th>
                    <th style={{ padding: "12px", textAlign: "center", color: "#a0a0c0" }}>Price</th>
                    <th style={{ padding: "12px", textAlign: "center", color: "#a0a0c0" }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => {
                    const imageUrl = getImageUrl(product.imageUrl, product.name, product.isVeg);
                    return (
                      <tr key={product.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                        <td style={{ padding: "12px", color: "#fff", fontWeight: "500" }}>{product.id}</td>
                        <td style={{ padding: "12px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                            <div style={{ width: "48px", height: "48px", borderRadius: "10px", overflow: "hidden", background: "#2a2a5e", display: "flex", alignItems: "center", justifyContent: "center" }}>
                              {imageUrl ? (
                                <img 
                                  src={imageUrl} 
                                  alt={product.name} 
                                  style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                                  onError={(e) => {
                                    e.target.style.display = "none";
                                    const parent = e.target.parentElement;
                                    if (parent) {
                                      parent.style.display = "flex";
                                      parent.style.alignItems = "center";
                                      parent.style.justifyContent = "center";
                                      parent.style.background = `linear-gradient(135deg, ${product.isVeg ? "#10b981" : "#ef4444"}20, #2a2a5e)`;
                                      parent.style.fontSize = "24px";
                                      parent.innerHTML = product.isVeg ? "🌱" : "🍖";
                                    }
                                  }}
                                />
                              ) : (
                                <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px" }}>
                                  {product.isVeg ? "🌱" : "🍖"}
                                </div>
                              )}
                            </div>
                            <div>
                              <div style={{ color: "white", fontWeight: "600", marginBottom: "4px" }}>{product.name}</div>
                              <div style={{ color: "#a0a0c0", fontSize: "12px", maxWidth: "300px" }}>{product.description?.length > 60 ? product.description.substring(0, 60) + "..." : product.description || "No description"}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: "12px", textAlign: "center" }}><span style={{ color: "#10b981", fontWeight: "bold", fontSize: "16px" }}>₹{product.price}</span></td>
                        <td style={{ padding: "12px", textAlign: "center" }}>
                          <button
                            onClick={() => toggleProductStatus(product.id)}
                            style={{
                              padding: "6px 16px",
                              borderRadius: "20px",
                              border: "none",
                              cursor: "pointer",
                              background: product.isAvailable ? "#10b981" : "#f59e0b",
                              color: "white",
                              fontSize: "12px",
                              fontWeight: "500",
                              transition: "all 0.2s ease",
                            }}
                            onMouseEnter={(e) => e.target.style.opacity = "0.8"}
                            onMouseLeave={(e) => e.target.style.opacity = "1"}
                          >
                            {product.isAvailable ? "✅ Active" : "⭕ Disabled"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {products.length === 0 && <div style={{ textAlign: "center", padding: "60px", color: "#a0a0c0" }}><div style={{ fontSize: "64px", marginBottom: "16px" }}>🍕</div><p>No products found. Click "Add New Product" to create one.</p></div>}
            </div>
          </div>
        )}

        {/* USERS TAB */}
        {activeTab === "users" && (
          <div style={{ background: "#1a1a3e", borderRadius: "20px", padding: "24px", border: "1px solid rgba(102, 126, 234, 0.2)" }}>
            <h3 style={{ color: "white", fontSize: "18px", marginBottom: "24px" }}>User Management</h3>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid rgba(255,255,255,0.1)" }}>
                    <th style={{ padding: "12px", textAlign: "left", color: "#a0a0c0" }}>ID</th>
                    <th style={{ padding: "12px", textAlign: "left", color: "#a0a0c0" }}>Name</th>
                    <th style={{ padding: "12px", textAlign: "left", color: "#a0a0c0" }}>Email</th>
                    <th style={{ padding: "12px", textAlign: "center", color: "#a0a0c0" }}>Role</th>
                    <th style={{ padding: "12px", textAlign: "center", color: "#a0a0c0" }}>Phone</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                      <td style={{ padding: "12px", color: "#fff" }}>{user.id}</td>
                      <td style={{ padding: "12px", color: "#c0c0e0" }}>{user.name}</td>
                      <td style={{ padding: "12px", color: "#c0c0e0" }}>{user.email}</td>
                      <td style={{ padding: "12px", textAlign: "center" }}>
                        <span style={{ background: user.role === "ADMIN" ? "rgba(102,126,234,0.2)" : "rgba(16,185,129,0.2)", color: user.role === "ADMIN" ? "#667eea" : "#10b981", padding: "4px 12px", borderRadius: "20px", fontSize: "12px" }}>
                          {user.role === "ADMIN" ? "👑 Admin" : "👤 User"}
                        </span>
                      </td>
                      <td style={{ padding: "12px", textAlign: "center", color: "#c0c0e0" }}>{user.phone || "N/A"}</td>
                    </tr>
                  ))}
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