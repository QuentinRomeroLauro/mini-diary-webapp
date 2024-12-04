import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { EditorToolbar } from './editor/EditorToolbar';

interface Props {
  content: string;
  onChange: (content: string) => void;
}

export const RichTextEditor: React.FC<Props> = ({ content, onChange }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Underline,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Update editor content when content prop changes
  React.useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <EditorToolbar editor={editor} />
      <EditorContent 
        editor={editor} 
        className="prose prose-invert max-w-none"
      />
    </div>
  );
};