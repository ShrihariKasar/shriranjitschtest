import "../../styles/dashboard.css";
import { useState, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Underline from "@tiptap/extension-underline";

export default function Communications() {

  const [mode, setMode] = useState("long");

  const [channel, setChannel] = useState("email");
  const [recipientType, setRecipientType] = useState("all");

  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");

  const [staffType, setStaffType] = useState("teaching");
  const [attachments, setAttachments] = useState([]);

  const [announcements, setAnnouncements] = useState([]);
  const [editId, setEditId] = useState(null);

  // ✅ LOAD DATA
  useEffect(() => {
    const storedClasses = JSON.parse(localStorage.getItem("classes")) || [];
    const storedAnnouncements = JSON.parse(localStorage.getItem("announcements")) || [];

    setClasses(storedClasses);
    setAnnouncements(storedAnnouncements);
  }, []);

  const editor = useEditor({
    extensions: [StarterKit, Image, Underline],
    content: "<p>Write your message...</p>",
  });

  // FILE UPLOAD
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setAttachments((prev) => [...prev, ...files]);
  };

  const removeFile = (index) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  // ✅ SEND / UPDATE
  const handleSend = () => {
    if (!editor) return;

    const newItem = {
      id: editId || Date.now(),
      title: "Announcement",
      channel,
      recipientType,
      class: selectedClass,
      section: selectedSection,
      staffType,
      message: editor.getHTML(),
      attachments,
      date: new Date().toLocaleString(),
    };

    const existing =
      JSON.parse(localStorage.getItem("announcements")) || [];

    let updated;

    if (editId) {
      updated = existing.map((item) =>
        item.id === editId ? newItem : item
      );
    } else {
      updated = [newItem, ...existing];
    }

    localStorage.setItem("announcements", JSON.stringify(updated));
    setAnnouncements(updated);

    // RESET
    setEditId(null);
    setAttachments([]);
    editor.commands.setContent("<p>Write your message...</p>");

    alert(editId ? "Updated ✅" : "Message Sent 🚀");
  };

  // DELETE
  const handleDelete = (id) => {
    const updated = announcements.filter((a) => a.id !== id);
    setAnnouncements(updated);
    localStorage.setItem("announcements", JSON.stringify(updated));
  };

  // EDIT
  const handleEdit = (item) => {
    setEditId(item.id);
    editor.commands.setContent(item.message);
    setMode("long");
  };

  return (
    <div className="comm-container">

      <h1 className="page-title">Announcements</h1>

      {/* TOGGLE */}
      <div className="att-toggle">
        <button
          className={mode === "long" ? "active" : ""}
          onClick={() => setMode("long")}
        >
          Announcements
        </button>

        <button
          className={mode === "single" ? "active" : ""}
          onClick={() => setMode("single")}
        >
          Recent Announcements
        </button>
      </div>

      {/* ================= RECENT ================= */}
      {mode === "single" && (
        <div className="comm-card">

          {announcements.length === 0 && (
            <div className="empty-state">No announcements</div>
          )}

          {announcements.map((item) => (
            <div key={item.id} className="recent-item">

              <div className="recent-content">
                <h4>{item.title}</h4>

                <div
                  dangerouslySetInnerHTML={{ __html: item.message }}
                />

                <small>{item.date}</small>
              </div>

              <div className="recent-actions">
                <span onClick={() => handleEdit(item)}>✏️</span>
                <span onClick={() => handleDelete(item.id)}>🗑️</span>
              </div>

            </div>
          ))}

        </div>
      )}

      {/* ================= CREATE ================= */}
      {mode === "long" && (
        <>
          <div className="comm-card">
            <div className="comm-grid">

              <div>
                <label>Channel</label>
                <select value={channel} onChange={(e) => setChannel(e.target.value)}>
                  <option value="email">Email</option>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="notification">Notification</option>
                </select>
              </div>

              <div>
                <label>Recipient</label>
                <select
                  value={recipientType}
                  onChange={(e) => setRecipientType(e.target.value)}
                >
                  <option value="all">All</option>
                  <option value="parent">Parent</option>
                  <option value="staff">Staff</option>
                </select>
              </div>

              {recipientType === "parent" && (
                <>
                  <div>
                    <label>Class</label>
                    <select
                      value={selectedClass}
                      onChange={(e) => {
                        setSelectedClass(e.target.value);
                        setSelectedSection("");
                      }}
                    >
                      <option value="">Select Class</option>
                      {classes.map((c) => (
                        <option key={c.id} value={c.id}>
                          Class {c.id}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label>Section</label>
                    <select
                      value={selectedSection}
                      onChange={(e) => setSelectedSection(e.target.value)}
                    >
                      <option value="">Select Section</option>
                      {selectedClass &&
                        Object.entries(
                          classes.find((c) => c.id == selectedClass)?.sections || {}
                        )
                          .filter(([_, v]) => v)
                          .map(([sec]) => (
                            <option key={sec}>{sec}</option>
                          ))}
                    </select>
                  </div>
                </>
              )}

              {recipientType === "staff" && (
                <div>
                  <label>Staff Type</label>
                  <select
                    value={staffType}
                    onChange={(e) => setStaffType(e.target.value)}
                  >
                    <option value="teaching">Teaching</option>
                    <option value="non-teaching">Non Teaching</option>
                  </select>
                </div>
              )}
            </div>
          </div>

      {/* MESSAGE */}
      {/* MESSAGE */}
<div className="comm-card">
  <label className="comm-label">Message</label>

  {/* 🔥 TOOLBAR */}
  {editor && (
    <div className="editor-toolbar">

      <button
        className={editor.isActive("bold") ? "active" : ""}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        B
      </button>

      <button
        className={editor.isActive("italic") ? "active" : ""}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        I
      </button>

      <button
        className={editor.isActive("underline") ? "active" : ""}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        U
      </button>

      <button
        className={editor.isActive("heading", { level: 2 }) ? "active" : ""}
        onClick={() =>
          editor.chain().focus().toggleHeading({ level: 2 }).run()
        }
      >
        H2
      </button>

      <button
        className={editor.isActive("bulletList") ? "active" : ""}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        •
      </button>

      <button
        className={editor.isActive("orderedList") ? "active" : ""}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        1.
      </button>

      <button onClick={() => editor.chain().focus().undo().run()}>
        ↺
      </button>

      <button onClick={() => editor.chain().focus().redo().run()}>
        ↻
      </button>

    </div>
  )}

  {/* EDITOR */}
  <div className="comm-editor">
    <EditorContent editor={editor} />
  </div>
</div>
          {/* ATTACHMENTS */}
          <div className="comm-card">
            <label className="comm-label">Attachments (All file types)</label>

            <div className="upload-box">
              <input type="file" multiple onChange={handleFileUpload} />
              <p>Upload files</p>
            </div>

            <div className="file-list">
              {attachments.map((file, i) => (
                <div key={i} className="file-item">
                  <span>{file.name}</span>
                  <button onClick={() => removeFile(i)}>✕</button>
                </div>
              ))}
            </div>
          </div>

          {/* SEND */}
          <div className="comm-send">
            <button onClick={handleSend}>
              {editId ? "Update" : "Send Message"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}