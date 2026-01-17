"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { TextStyle } from "@tiptap/extension-text-style"
import { Color } from "@tiptap/extension-color"
import { useEffect } from "react"
import "./RichTextEditor.css"

const RichTextEditor = ({ content, onChange, isDarkMode }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      TextStyle,
      Color,
    ],
    content: content || "",
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: isDarkMode ? "tiptap-editor" : "tiptap-editor-light",
      },
    },
  })

  // Update editor content when prop changes (for edit mode)
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content || "")
    }
  }, [content, editor])

  if (!editor) {
    return null
  }

  const setColor = (color) => {
    editor.chain().focus().setColor(color).run()
  }

  return (
    <div className={isDarkMode ? "rich-text-container" : "rich-text-container-light"}>
      <div className={isDarkMode ? "toolbar" : "toolbar-light"}>
        {/* Text Formatting */}
        <div className="toolbar-group">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={editor.isActive("bold") ? "is-active" : ""}
            title="Bold"
          >
            <strong>B</strong>
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={editor.isActive("italic") ? "is-active" : ""}
            title="Italic"
          >
            <em>I</em>
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={editor.isActive("strike") ? "is-active" : ""}
            title="Strikethrough"
          >
            <s>S</s>
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleCode().run()}
            className={editor.isActive("code") ? "is-active" : ""}
            title="Code"
          >
            {"</>"}
          </button>
        </div>

        {/* Headings */}
        <div className="toolbar-group">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={editor.isActive("heading", { level: 1 }) ? "is-active" : ""}
            title="Heading 1"
          >
            H1
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={editor.isActive("heading", { level: 2 }) ? "is-active" : ""}
            title="Heading 2"
          >
            H2
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={editor.isActive("heading", { level: 3 }) ? "is-active" : ""}
            title="Heading 3"
          >
            H3
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setParagraph().run()}
            className={editor.isActive("paragraph") ? "is-active" : ""}
            title="Paragraph"
          >
            P
          </button>
        </div>

        {/* Lists */}
        <div className="toolbar-group">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={editor.isActive("bulletList") ? "is-active" : ""}
            title="Bullet List"
          >
            • List
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={editor.isActive("orderedList") ? "is-active" : ""}
            title="Numbered List"
          >
            1. List
          </button>
        </div>

        {/* Text Colors */}
        <div className="toolbar-group">
          <span className="toolbar-label">Color:</span>
          <button
            type="button"
            onClick={() => setColor("#000000")}
            className="color-btn"
            style={{ backgroundColor: "#000000" }}
            title="Black"
          />
          <button
            type="button"
            onClick={() => setColor("#ef4444")}
            className="color-btn"
            style={{ backgroundColor: "#ef4444" }}
            title="Red"
          />
          <button
            type="button"
            onClick={() => setColor("#ec4899")}
            className="color-btn"
            style={{ backgroundColor: "#ec4899" }}
            title="Pink"
          />
          <button
            type="button"
            onClick={() => setColor("#8b5cf6")}
            className="color-btn"
            style={{ backgroundColor: "#8b5cf6" }}
            title="Purple"
          />
          <button
            type="button"
            onClick={() => setColor("#3b82f6")}
            className="color-btn"
            style={{ backgroundColor: "#3b82f6" }}
            title="Blue"
          />
          <button
            type="button"
            onClick={() => setColor("#10b981")}
            className="color-btn"
            style={{ backgroundColor: "#10b981" }}
            title="Green"
          />
          <button
            type="button"
            onClick={() => setColor("#f59e0b")}
            className="color-btn"
            style={{ backgroundColor: "#f59e0b" }}
            title="Orange"
          />
        </div>

        {/* Utilities */}
        <div className="toolbar-group">
          <button
            type="button"
            onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
            title="Clear Formatting"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            title="Undo"
          >
            ↶
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            title="Redo"
          >
            ↷
          </button>
        </div>
      </div>

      <EditorContent editor={editor} />
    </div>
  )
}

export default RichTextEditor
