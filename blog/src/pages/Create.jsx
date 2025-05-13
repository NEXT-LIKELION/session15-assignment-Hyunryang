import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addPost } from "../lib/firebase";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function Create() {
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [dueDate, setDueDate] = useState(new Date()); // 기한 state

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim() || !content.trim()) {
            alert("제목과 내용을 입력하세요.");
            return;
        }

        await addPost(title, content, dueDate); // 기한도 함께 저장
        navigate("/");
    };

    return (
        <div className="form-container">
            <h1 className="form-title">새 일정 추가</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>할 일 제목</label>
                    <input
                        type="text"
                        placeholder="제목을 입력하세요."
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label>할 일 내용</label>
                    <textarea
                        placeholder="내용을 입력하세요."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label>기한</label>
                    <DatePicker
                        selected={dueDate}
                        onChange={(date) => setDueDate(date)}
                        showTimeSelect
                        dateFormat="yyyy. MM. dd. a hh:mm"
                        locale="ko"
                    />
                </div>

                <div className="form-actions">
                    <button type="submit" className="btn-primary">
                        + 추가하기
                    </button>
                </div>
            </form>
        </div>
    );
}

export default Create;
