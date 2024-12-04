import React from 'react';
import { Editor } from '@tiptap/react';
import { Bold, Italic, Underline as UnderlineIcon, AlignLeft, AlignCenter, AlignRight, List } from 'lucide-react';
import { ToolbarButton } from './ToolbarButton';
import { ToolbarDivider } from './ToolbarDivider';

interface Props {
  editor: Editor | null;
}

export const EditorToolbar: React.FC<Props> = ({ editor }) => {
  if (!editor) return null;

  return (
    <div className="flex gap-1 mb-2">
      <ToolbarButton
        icon={Bold}
        isActive={editor.isActive('bold')}
        onClick={() => editor.chain().focus().toggleBold().run()}
      />
      <ToolbarButton
        icon={Italic}
        isActive={editor.isActive('italic')}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      />
      <ToolbarButton
        icon={UnderlineIcon}
        isActive={editor.isActive('underline')}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      />
      
      <ToolbarDivider />
      
      <ToolbarButton
        icon={AlignLeft}
        isActive={editor.isActive({ textAlign: 'left' })}
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
      />
      <ToolbarButton
        icon={AlignCenter}
        isActive={editor.isActive({ textAlign: 'center' })}
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
      />
      <ToolbarButton
        icon={AlignRight}
        isActive={editor.isActive({ textAlign: 'right' })}
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
      />
      
      <ToolbarDivider />
      
      <ToolbarButton
        icon={List}
        isActive={editor.isActive('bulletList')}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      />
    </div>
  );
};