const BUILD_TAG = "dc-2964";
/* eslint-disable import/first */
import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import axios from 'axios';
import './App.css';
import Layout from './components/Layout';
import QuestionBank from './pages/QuestionBank';
import QuestionDetail from './pages/QuestionDetail';
import NotFound from './pages/NotFound';

const App = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [bookmarks, setBookmarks] = useState([]);

  // Mounting: gọi API, cleanup hủy request
  useEffect(() => {
    const controller = new AbortController();
    axios
      .get('/data/questions.json', { signal: controller.signal })
      .then((res) => {
        setQuestions(res.data);
        setLoading(false);
      })
      .catch((err) => {
        if (axios.isCancel(err)) return;
        setError(true);
        setLoading(false);
      });
    return () => controller.abort();
  }, []);

  const toggleBookmark = (id) => {
    setBookmarks((prev) =>
      prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]
    );
  };

  // Các trang cần dữ liệu câu hỏi: hiện trạng thái chờ / lỗi
  const withData = (element) => {
    if (loading) return <p>Đang tải câu hỏi...</p>;
    if (error) return <p className="error">Không tải được câu hỏi</p>;
    return element;
  };

  return (
    <div className="app" data-build={BUILD_TAG}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<h2>Trang chủ</h2>} />
          <Route path="play" element={<h2>Màn hình chơi</h2>} />
          <Route path="result" element={<h2>Kết quả</h2>} />
          <Route path="history" element={<h2>Lịch sử các lượt chơi</h2>} />
          <Route
            path="questions"
            element={withData(
              <QuestionBank
                questions={questions}
                bookmarks={bookmarks}
                toggleBookmark={toggleBookmark}
              />
            )}
          />
          <Route
            path="questions/:id"
            element={withData(
              <QuestionDetail
                questions={questions}
                bookmarks={bookmarks}
                toggleBookmark={toggleBookmark}
              />
            )}
          />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
