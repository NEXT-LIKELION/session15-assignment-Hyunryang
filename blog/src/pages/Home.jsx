import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getPosts } from "../lib/firebase"; // Firestore에서 데이터 가져오기

function calculateDDay(dueDate) {
    if (!dueDate) return "";

    const today = new Date();
    today.setHours(0, 0, 0, 0); // 오늘 날짜를 자정으로 고정
    const due = new Date(dueDate.toDate()); // Firestore Timestamp -> JS Date

    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "D-Day";
    if (diffDays > 0) return `D-${diffDays}`;
    return `D+${Math.abs(diffDays)}`;
}

function Home() {
    const [posts, setPosts] = useState([]); // 게시글 목록 상태
    const [loading, setLoading] = useState(true); // 로딩 상태

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const postList = await getPosts(); // ✅ Firestore에서 데이터 가져오기
                setPosts(postList);
            } catch (error) {
                console.error("🔥 Firestore 데이터 불러오기 오류:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="container">
            <h1 className="title">To-Do List</h1>

            <div className="actions">
                <Link to="/create">
                    <button className="btn">+ 할 일 추가</button>
                </Link>
            </div>

            {loading ? (
                <div className="loading"> 불러오는 중...</div>
            ) : (
                <ul className="post-list">
                    {posts.length === 0 ? (
                        <p className="no-posts">작성된 할 일이 없습니다.</p>
                    ) : (
                        posts.map((post) => (
                            <li key={post.id} className="post-item">
                                <Link
                                    to={`/edit/${post.id}`}
                                    className="post-link"
                                >
                                    <div className="post-header">
                                        <strong>{post.title}</strong>
                                        <span className="dday">
                                            {calculateDDay(post.dueDate)}
                                        </span>
                                    </div>
                                    <p>{post.content}</p>
                                </Link>
                            </li>
                        ))
                    )}
                </ul>

                
            )}

            
        </div>
    );
}

export default Home;
