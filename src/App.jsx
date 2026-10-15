import { useState } from "react";

// ===================== MÀU SẮC & STYLE =====================
// Gom style vào một object cho dễ sửa
const styles = {
  page: {
    maxWidth: 850,
    margin: "20px auto",
    padding: 20,
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f4f6fb",
    borderRadius: 10,
  },
  title: { textAlign: "center", color: "#2c3e87" },
  box: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  },
  input: {
    padding: 8,
    border: "1px solid #b0b7d0",
    borderRadius: 4,
    flex: 1,
  },
  btn: {
    padding: "8px 14px",
    border: "none",
    borderRadius: 4,
    color: "#fff",
    cursor: "pointer",
    marginRight: 6,
  },
  error: {
    color: "#c0392b",
    backgroundColor: "#fdecea",
    padding: 8,
    borderRadius: 4,
    marginTop: 8,
  },
  th: { backgroundColor: "#2c3e87", color: "#fff", padding: 10 },
  td: { padding: 10, borderBottom: "1px solid #e0e3ee", textAlign: "center" },
};

// Màu của từng xếp loại
const rankColors = {
  "Giỏi": "#27ae60", // xanh lá
  "Đạt": "#2980b9", // xanh dương
  "Trượt": "#e74c3c", // đỏ
};

// ===================== COMPONENT CHÁU: StudentItem =====================
// Hiển thị 1 dòng dữ liệu của 1 sinh viên
const StudentItem = ({ student, index, onDelete }) => {
  // Destructuring để lấy dữ liệu từ object student
  const { id, name, score, class: className } = student;

  // Xếp loại dựa trên điểm
  const rank = score >= 8 ? "Giỏi" : score < 5 ? "Trượt" : "Đạt";

  return (
    <tr style={{ backgroundColor: index % 2 === 0 ? "#ffffff" : "#f0f3fa" }}>
      <td style={styles.td}>{index + 1}</td>
      <td style={{ ...styles.td, textAlign: "left" }}>{name}</td>
      <td style={{ ...styles.td, fontWeight: "bold", color: rankColors[rank] }}>
        {score}
      </td>
      <td style={styles.td}>{className}</td>
      <td style={styles.td}>
        <span
          style={{
            backgroundColor: rankColors[rank],
            color: "#fff",
            padding: "3px 10px",
            borderRadius: 12,
            fontSize: 13,
          }}
        >
          {rank}
        </span>
      </td>
      <td style={styles.td}>
        <button
          style={{ ...styles.btn, backgroundColor: "#e74c3c", marginRight: 0 }}
          onClick={() => onDelete(id)}
        >
          Xóa
        </button>
      </td>
    </tr>
  );
};

// ===================== COMPONENT CON: StudentList =====================
// Nhận danh sách sinh viên qua props và render từng dòng
const StudentList = ({ students, onDelete }) => {
  if (students.length === 0) {
    return <p>Không có sinh viên nào để hiển thị.</p>;
  }

  return (
    <table style={{ borderCollapse: "collapse", width: "100%" }}>
      <thead>
        <tr>
          <th style={styles.th}>STT</th>
          <th style={styles.th}>Họ tên</th>
          <th style={styles.th}>Điểm</th>
          <th style={styles.th}>Lớp</th>
          <th style={styles.th}>Xếp loại</th>
          <th style={styles.th}>Hành động</th>
        </tr>
      </thead>
      <tbody>
        {students.map((student, index) => (
          <StudentItem
            key={student.id}
            student={student}
            index={index}
            onDelete={onDelete}
          />
        ))}
      </tbody>
    </table>
  );
};

// ===================== COMPONENT CHA: App =====================
// Quản lý state chính: danh sách sinh viên, bộ lọc, form, thông báo lỗi
const App = () => {
  // Dữ liệu mẫu ban đầu (3 sinh viên)
  const [students, setStudents] = useState([
    { id: 1, name: "Nguyễn Văn An", score: 8, class: "CNTT1" },
    { id: 2, name: "Trần Thị Bình", score: 6, class: "CNTT2" },
    { id: 3, name: "Lê Văn Cường", score: 4, class: "CNTT1" },
  ]);

  // State cho bộ lọc: "all" | "good" | "fail"
  const [filter, setFilter] = useState("all");

  // State cho form nhập liệu
  const [name, setName] = useState("");
  const [score, setScore] = useState("");
  const [className, setClassName] = useState("");

  // State cho thông báo lỗi
  const [error, setError] = useState("");

  // ---------- Thêm sinh viên ----------
  const handleAdd = () => {
    // Bỏ khoảng trắng thừa
    const trimmedName = name.trim();
    const trimmedClass = className.trim();
    const numScore = Number(score);

    // Ràng buộc dữ liệu
    if (trimmedName === "" || score === "" || trimmedClass === "") {
      setError("Vui lòng nhập đầy đủ Họ tên, Điểm số và Lớp!");
      return;
    }
    if (isNaN(numScore) || numScore < 0 || numScore > 10) {
      setError("Điểm số không hợp lệ! Điểm phải từ 0 đến 10.");
      return;
    }

    const newStudent = {
      id: Date.now(), // dùng thời gian hiện tại làm id
      name: trimmedName,
      score: numScore,
      class: trimmedClass,
    };

    // Dùng spread để giữ lại dữ liệu cũ
    setStudents([...students, newStudent]);

    // Reset form và xóa lỗi
    setName("");
    setScore("");
    setClassName("");
    setError("");
  };

  // ---------- Xóa sinh viên ----------
  const handleDelete = (id) => {
    setStudents(students.filter((student) => student.id !== id));
  };

  // ---------- Lọc danh sách để hiển thị ----------
  const filteredStudents = students.filter((student) => {
    if (filter === "good") return student.score >= 8;
    if (filter === "fail") return student.score < 5;
    return true; // "all"
  });

  // ---------- Thống kê toàn lớp ----------
  const total = students.length;
  const totalScore = students.reduce((sum, student) => sum + student.score, 0);
  const average = total === 0 ? 0 : (totalScore / total).toFixed(2);

  // Nút lọc đang chọn thì đậm màu hơn
  const filterBtnStyle = (name, color) => ({
    ...styles.btn,
    backgroundColor: color,
    opacity: filter === name ? 1 : 0.55,
    outline: filter === name ? "2px solid #333" : "none",
  });

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Quản lý Điểm Sinh viên</h1>

      {/* ----- Form thêm sinh viên ----- */}
      <div style={styles.box}>
        <h3 style={{ marginTop: 0, color: "#2c3e87" }}>Thêm sinh viên mới</h3>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            style={styles.input}
            type="text"
            placeholder="Họ tên"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            style={styles.input}
            type="number"
            min = "0"
            max= "10"
            step ="1"
            placeholder="Điểm số"
            value={score}
            onChange={(e) => setScore(e.target.value)}
          />
          <input
            style={styles.input}
            type="text"
            placeholder="Lớp"
            value={className}
            onChange={(e) => setClassName(e.target.value)}
          />
          <button
            style={{ ...styles.btn, backgroundColor: "#27ae60", marginRight: 0 }}
            onClick={handleAdd}
          >
            Thêm
          </button>
        </div>

        {/* Hiển thị lỗi nếu có */}
        {error && <div style={styles.error}>{error}</div>}
      </div>

      {/* ----- Bộ lọc + Thống kê ----- */}
      <div style={styles.box}>
        <button style={filterBtnStyle("all", "#7f8c8d")} onClick={() => setFilter("all")}>
          Tất cả
        </button>
        <button style={filterBtnStyle("good", "#27ae60")} onClick={() => setFilter("good")}>
          Loại Giỏi (≥ 8)
        </button>
        <button style={filterBtnStyle("fail", "#e74c3c")} onClick={() => setFilter("fail")}>
          Trượt môn (&lt; 5)
        </button>

        <p style={{ marginBottom: 0 }}>
          {`Tổng số sinh viên: `}
          <b style={{ color: "#2980b9" }}>{total}</b>
          {` | Điểm trung bình toàn lớp: `}
          <b style={{ color: "#e67e22" }}>{average}</b>
          {` | Đang hiển thị: ${filteredStudents.length}`}
        </p>
      </div>

      {/* ----- Danh sách ----- */}
      <div style={styles.box}>
        <StudentList students={filteredStudents} onDelete={handleDelete} />
      </div>
    </div>
  );
};

export default App;
