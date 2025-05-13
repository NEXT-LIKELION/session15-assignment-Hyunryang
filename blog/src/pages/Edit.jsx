import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPostById, updatePost, deletePost } from "../lib/firebase"; // Firestore 연동

function Edit() {
    const navigate = useNavigate();
    const { id } = useParams(); // URL에서 게시글 ID 가져오기
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [dueDate, setDueDate] = useState(""); // 
    const [loading, setLoading] = useState(true);

    // Firestore에서 게시글 데이터 가져오기
    useEffect(() => {
        const fetchPost = async () => {
            const post = await getPostById(id);
            if (!post) {
                alert("해당 일정이 존재하지 않습니다.");
                navigate("/");
                return;
            }
            setTitle(post.title);
            setContent(post.content);
            setDueDate(post.dueDate?.toDate().toISOString().slice(0, 16) || ""); // ✅ 날짜 변환
            setLoading(false);
        };
        fetchPost();
    }, [id, navigate]);

    const handleUpdate = async () => {
        if (!title.trim() || !content.trim()) {
            alert("제목과 내용을 입력하세요.");
            return;
        }
        await updatePost(id, title, content, new Date(dueDate)); // ✅ 기한 전달
        alert("일정이 수정되었습니다.");
        navigate("/");
    };

    const handleDelete = async () => {
        if (window.confirm("정말 삭제하시겠습니까?")) {
            await deletePost(id);
            alert("일정이 삭제되었습니다.");
            navigate("/");
        }
    };

    return (
        <div className="form-container">
            <h1 className="form-title">일정 수정</h1>
            <form onSubmit={(e) => e.preventDefault()}>
                <div className="form-group">
                    <label>제목</label>
                    <input
                        type="text"
                        placeholder="제목 입력"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label>내용</label>
                    <textarea
                        placeholder="내용 입력"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label>기한</label>
                    <input
                        type="datetime-local"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                    />
                </div>

                <div className="form-buttons">
                    <button onClick={handleUpdate} className="btn">
                        수정하기
                    </button>
                    <button onClick={handleDelete} className="btn btn-delete">
                        삭제하기
                    </button>
                </div>
            </form>
        </div>
    );
}

export default Edit;
