import React from 'react';
import { EditorAPI } from '../editorApi';

const EMOJI_LIST = [
  '😀','😁','😂','🤣','😃','😄','😅','😆','😉','😊','😋','😎','😍','😘','🥰','😗','😙','😚','☺️','🙂',
  '🤗','🤩','🤔','🤨','😐','😑','😶','🙄','😏','😣','😥','😮','🤐','😯','😪','😫','🥱','😴','😌','😛',
  '😜','😝','🤤','😒','😓','😔','😕','🙃','🤑','😲','☹️','🙁','😖','😞','😟','😤','😢','😭','😦','😧',
  '😨','😩','🤯','😬','😰','😱','🥵','🥶','😳','🤪','😵','😡','😠','🤬','😷','🤒','🤕','🤢','🤮','🤧',
  '😇','🥳','🥺','🤠','🤡','🤥','🤫','🤭','🧐','🤓','😈','👿','👹','👺','💀','👻','👽','👾','🤖','💩',
  '😺','😸','😹','😻','😼','😽','🙀','😿','😾',
  '👍','👎','✌️','🤞','🤟','🤘','🤙','👈','👉','👆','🖕','👇','☝️','👋','🤚','🖐️','✋','🖖','👌','🤏',
  '🤲','👐','🙌','👏','🤝','🙏','✍️','💅','🤳','💪','🦾','🦿','🦵','🦶','👂','🦻','👃','🧠','🦷','🦴',
  '👀','👁️','👅','👄','💋','🩸'
];

export const IconGallery: React.FC = () => {
  const insertIcon = (icon: string) => {
    EditorAPI.getLegacy()?.insertTextAtSelection?.(icon);
  };

  return (
    <div className="w-64 p-2 bg-white flex flex-wrap gap-1 shadow-sm max-h-64 overflow-y-auto">
      {EMOJI_LIST.map((emoji, idx) => (
        <button
          key={idx}
          className="w-8 h-8 text-xl flex items-center justify-center rounded hover:bg-slate-100 transition-colors cursor-pointer border border-transparent hover:border-slate-300"
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
            insertIcon(emoji);
          }}
          title="Insert Emoji"
        >
          {emoji}
        </button>
      ))}
    </div>
  );
};
