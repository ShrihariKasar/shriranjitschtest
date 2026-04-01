import "../../styles/dashboard.css";
import { useState, useEffect } from "react";
import DashboardTabs from "../../components/DashboardTabs";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Underline from "@tiptap/extension-underline";

export default function Rules() {
  const [content, setContent] = useState("");

  // ✅ LOAD CONTENT
  useEffect(() => {
    const saved = localStorage.getItem("rules");
    if (saved) setContent(saved);
  }, []);

  // ✅ ALWAYS INIT EDITOR (NO NULL)
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Underline,
    ],
    content: "<p>Start writing institute rules...</p>", // default
  });

  // ✅ UPDATE CONTENT AFTER LOAD
  useEffect(() => {
    if (editor && content) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  // ✅ SAVE
  const handleSave = () => {
    if (!editor) return;
    localStorage.setItem("rules", editor.getHTML());
    alert("Saved successfully");
  };

  // ✅ IMAGE UPLOAD
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file || !editor) return;

    const reader = new FileReader();
    reader.onload = () => {
      editor.commands.setImage({ src: reader.result });
    };
    reader.readAsDataURL(file);
  };

  if (!editor) return null;

  return (
    <div className="page">
      <DashboardTabs />

      <h1 className="rules-title">
        Institute Rules and Regulations
      </h1>

      <div className="rules-container">

        {/* 🔥 TOOLBAR */}
        <div className="editor-toolbar">

          <button
            className={editor.isActive("bold") ? "active" : ""}
            onClick={() => editor.commands.toggleBold()}
          >
            B
          </button>

          <button
            className={editor.isActive("italic") ? "active" : ""}
            onClick={() => editor.commands.toggleItalic()}
          >
            I
          </button>

          <button
            className={editor.isActive("underline") ? "active" : ""}
            onClick={() => editor.commands.toggleUnderline()}
          >
            U
          </button>

          <button
            onClick={() => editor.commands.toggleHeading({ level: 2 })}
          >
            H2
          </button>

          <button
            className={editor.isActive("bulletList") ? "active" : ""}
            onClick={() => editor.commands.toggleBulletList()}
          >
            •
          </button>

          <button
            className={editor.isActive("orderedList") ? "active" : ""}
            onClick={() => editor.commands.toggleOrderedList()}
          >
            1.
          </button>

          <button onClick={() => editor.commands.undo()}>↺</button>
          <button onClick={() => editor.commands.redo()}>↻</button>

          {/* IMAGE */}
          <label className="image-upload-btn">
            🔗
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleImageUpload}
            />
          </label>

        </div>

        {/* EDITOR */}
        <div className="editor-box">
          <EditorContent editor={editor} />
        </div>

      </div>

      <div className="rules-actions">
        <button className="saved-btn" onClick={handleSave}>
          Save changes
        </button>
      </div>
    </div>
  );
}