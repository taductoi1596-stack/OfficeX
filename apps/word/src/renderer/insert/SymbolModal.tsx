import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import * as I from 'lucide-react';
import { EditorAPI } from '../editorApi';

interface SymbolItem {
  char: string;
  name: string;
}

const SYMBOL_DATA: SymbolItem[] = [
  { char: '•', name: 'Dấu đầu dòng' },
  { char: '€', name: 'Ký hiệu Euro' },
  { char: '£', name: 'Ký hiệu Bảng Anh' },
  { char: '¥', name: 'Ký hiệu Yên Nhật' },
  { char: '©', name: 'Bản quyền (Copyright)' },
  { char: '®', name: 'Thương hiệu đã đăng ký' },
  { char: '™', name: 'Nhãn hiệu thương mại' },
  { char: '±', name: 'Cộng hoặc trừ' },
  { char: '≠', name: 'Khác (Không bằng)' },
  { char: '≤', name: 'Nhỏ hơn hoặc bằng' },
  { char: '≥', name: 'Lớn hơn hoặc bằng' },
  { char: '÷', name: 'Dấu chia' },
  { char: '×', name: 'Dấu nhân' },

  { char: '∞', name: 'Vô cực' },
  { char: 'μ', name: 'Chữ cái Hy Lạp Mu' },
  { char: 'α', name: 'Chữ cái Hy Lạp Alpha' },
  { char: 'β', name: 'Chữ cái Hy Lạp Beta' },
  { char: 'π', name: 'Số Pi' },
  { char: 'Ω', name: 'Chữ cái Hy Lạp Omega' },
  { char: '∑', name: 'Tổng (Sigma)' },
  { char: '°', name: 'Ký hiệu Độ' },
  { char: 'Δ', name: 'Chữ cái Hy Lạp Delta' },
  { char: '☺', name: 'Mặt cười' },
  { char: '♥', name: 'Hình trái tim' },
  { char: '₹', name: 'Ký hiệu Rupee Ấn Độ' },
  { char: '¿', name: 'Dấu hỏi ngược' },

  { char: '¡', name: 'Dấu chấm cảm ngược' },
  { char: '—', name: 'Gạch ngang dài' },
  { char: '…', name: 'Dấu ba chấm' },
  { char: 'À', name: 'Chữ hoa La-tinh A Với Dấu huyền' },
  { char: 'Á', name: 'Chữ hoa La-tinh A Với Dấu sắc' },
  { char: 'Â', name: 'Chữ hoa La-tinh A Với Dấu mũ' },
  { char: 'Ã', name: 'Chữ hoa La-tinh A Với Dấu ngã' },
  { char: 'Ä', name: 'Chữ hoa La-tinh A Với Dấu hai chấm' },
  { char: 'Å', name: 'Chữ hoa La-tinh A Với Vòng tròn' },
  { char: 'Æ', name: 'Chữ hoa La-tinh AE' },
  { char: 'Ç', name: 'Chữ hoa La-tinh C Với Dấu râu' },
  { char: 'È', name: 'Chữ hoa La-tinh E Với Dấu huyền' },
  { char: 'É', name: 'Chữ hoa La-tinh E Với Dấu sắc' },

  { char: 'Ê', name: 'Chữ hoa La-tinh E Với Dấu mũ' },
  { char: 'Ë', name: 'Chữ hoa La-tinh E Với Dấu hai chấm' },
  { char: 'Ì', name: 'Chữ hoa La-tinh I Với Dấu huyền' },
  { char: 'Í', name: 'Chữ hoa La-tinh I Với Dấu sắc' },
  { char: 'Î', name: 'Chữ hoa La-tinh I Với Dấu mũ' },
  { char: 'Ï', name: 'Chữ hoa La-tinh I Với Dấu hai chấm' },
  { char: 'Ñ', name: 'Chữ hoa La-tinh N Với Dấu ngã' },
  { char: 'Ò', name: 'Chữ hoa La-tinh O Với Dấu huyền' },
  { char: 'Ó', name: 'Chữ hoa La-tinh O Với Dấu sắc' },
  { char: 'Ô', name: 'Chữ hoa La-tinh O Với Dấu mũ' },
  { char: 'Õ', name: 'Chữ hoa La-tinh O Với Dấu ngã' },
  { char: 'Ö', name: 'Chữ hoa La-tinh O Với Dấu hai chấm' },
  { char: 'Ù', name: 'Chữ hoa La-tinh U Với Dấu huyền' },

  { char: 'Ú', name: 'Chữ hoa La-tinh U Với Dấu sắc' },
  { char: 'Û', name: 'Chữ hoa La-tinh U Với Dấu mũ' },
  { char: 'Ü', name: 'Chữ hoa La-tinh U Với Dấu hai chấm' },
  { char: 'ß', name: 'Chữ thường La-tinh s sắc (Eszett)' },
  { char: 'à', name: 'Chữ Thường La-tinh A Với Dấu huyền' },
  { char: 'á', name: 'Chữ Thường La-tinh A Với Dấu sắc' },
  { char: 'â', name: 'Chữ Thường La-tinh A Với Dấu mũ' },
  { char: 'ã', name: 'Chữ Thường La-tinh A Với Dấu ngã' },
  { char: 'ä', name: 'Chữ Thường La-tinh A Với Dấu hai chấm' },
  { char: 'å', name: 'Chữ Thường La-tinh A Với Vòng tròn' },
  { char: 'æ', name: 'Chữ Thường La-tinh ae' },
  { char: 'ç', name: 'Chữ Thường La-tinh C Với Dấu râu' },
  { char: 'è', name: 'Chữ Thường La-tinh E Với Dấu huyền' },

  { char: 'é', name: 'Chữ Thường La-tinh E Với Dấu sắc' },
  { char: 'ê', name: 'Chữ Thường La-tinh E Với Dấu mũ' },
  { char: 'ë', name: 'Chữ Thường La-tinh E Với Dấu hai chấm' },
  { char: 'ì', name: 'Chữ Thường La-tinh I Với Dấu huyền' },
  { char: 'í', name: 'Chữ Thường La-tinh I Với Dấu sắc' },
  { char: 'î', name: 'Chữ Thường La-tinh I Với Dấu mũ' },
  { char: 'ï', name: 'Chữ Thường La-tinh I Với Dấu hai chấm' },
  { char: 'ð', name: 'Chữ Thường La-tinh eth' },
  { char: 'ñ', name: 'Chữ Thường La-tinh N Với Dấu ngã' },
  { char: 'ò', name: 'Chữ Thường La-tinh O Với Dấu huyền' },
  { char: 'ó', name: 'Chữ Thường La-tinh O Với Dấu sắc' },
  { char: 'ô', name: 'Chữ Thường La-tinh O Với Dấu mũ' },
  { char: 'õ', name: 'Chữ Thường La-tinh O Với Dấu ngã' },

  { char: 'ö', name: 'Chữ Thường La-tinh O Với Dấu hai chấm' },
  { char: 'ù', name: 'Chữ Thường La-tinh U Với Dấu huyền' },
  { char: 'ú', name: 'Chữ Thường La-tinh U Với Dấu sắc' },
  { char: 'û', name: 'Chữ Thường La-tinh U Với Dấu mũ' },
  { char: 'ü', name: 'Chữ Thường La-tinh U Với Dấu hai chấm' },
  { char: 'ý', name: 'Chữ Thường La-tinh Y Với Dấu sắc' },
  { char: 'ÿ', name: 'Chữ Thường La-tinh Y Với Dấu hai chấm' },
  { char: 'Ğ', name: 'Chữ hoa La-tinh G Với Dấu trăng' },
  { char: 'ğ', name: 'Chữ thường La-tinh G Với Dấu trăng' },
  { char: 'İ', name: 'Chữ hoa La-tinh I Với Dấu chấm trên' },
  { char: 'ı', name: 'Chữ thường La-tinh i Không Dấu chấm' },
  { char: 'Œ', name: 'Chữ hoa La-tinh OE' },
  { char: 'œ', name: 'Chữ thường La-tinh oe' },

  { char: 'Ş', name: 'Chữ hoa La-tinh S Với Dấu râu' },
  { char: 'ş', name: 'Chữ thường La-tinh S Với Dấu râu' },
  { char: 'Ÿ', name: 'Chữ hoa La-tinh Y Với Dấu hai chấm' },
  { char: '⇄', name: 'Chuyển hướng hai chiều' },
  { char: '∀', name: 'Với mọi (Universal Quantifier)' },
  { char: '∃', name: 'Tồn tại (Existential Quantifier)' },
  { char: '∈', name: 'Thuộc về (Element of)' },
  { char: '∉', name: 'Không thuộc về' },
  { char: '⊂', name: 'Tập con' },
  { char: '⊃', name: 'Tập cha' },
  { char: '∪', name: 'Hợp (Union)' },
  { char: '∩', name: 'Giao (Intersection)' },
  { char: '∅', name: 'Tập rỗng' },
];

const EMOJI_MODAL_DATA: SymbolItem[] = [
  { char: '😃', name: 'Gương mặt cười tươi' },
  { char: '😀', name: 'Gương mặt mỉm cười' },
  { char: '😂', name: 'Cười ra nước mắt' },
  { char: '🤣', name: 'Cười lăn lộn' },
  { char: '😄', name: 'Mắt cười rạng rỡ' },
  { char: '😅', name: 'Mỉm cười đổ mồ hôi' },
  { char: '😆', name: 'Mắt nhắm cười to' },
  { char: '😝', name: 'Lè lưỡi nhắm mắt' },
  { char: '😉', name: 'Nháy mắt' },
  { char: '😊', name: 'Thấu hiểu nhẹ nhàng' },
  { char: '😋', name: 'Ngon miệng' },
  { char: '😎', name: 'Đeo kính ngầu' },
  { char: '😍', name: 'Mắt hình trái tim' },
  { char: '😘', name: 'Hôn gió' },
  { char: '😗', name: 'Chúm môi' },
  { char: '😙', name: 'Mỉm cười hôn' },
  { char: '😚', name: 'Nhắm mắt hôn' },
  { char: '🙂', name: 'Mỉm cười nhẹ' },
  { char: '🤗', name: 'Ôm ấm áp' },
  { char: '🤔', name: 'Suy ngẫm' },
  { char: '😐', name: 'Thản nhiên' },
  { char: '😑', name: 'Không cảm xúc' },
  { char: '😶', name: 'Không miệng' },
  { char: '🙄', name: 'Xoay mắt' },
  { char: '😏', name: 'Cười khẩy' },
  { char: '😣', name: 'Cố gắng chịu đựng' },
  { char: '😥', name: 'Nhẹ nhõm lo âu' },
  { char: '😮', name: 'Ngạc nhiên mở miệng' },
  { char: '🤐', name: 'Kéo khóa miệng' },
  { char: '😯', name: 'Tò mò ngạc nhiên' },
  { char: '😪', name: 'Buồn ngủ nghẹn ngào' },
  { char: '😫', name: 'Mệt mỏi kiệt sức' },
  { char: '😴', name: 'Đang ngủ' },
  { char: '😌', name: 'Thanh thản' },
  { char: '😛', name: 'Lè lưỡi' },
  { char: '😜', name: 'Lè lưỡi nháy mắt' },
  { char: '🙃', name: 'Mặt ngược ngộ nghĩnh' },
  { char: '👍', name: 'Thích (Like / Thumbs up)' },
  { char: '👏', name: 'Vỗ tay' },
  { char: '🙏', name: 'Cầu nguyện / Cảm ơn' },
  { char: '🔥', name: 'Lửa nhiệt huyết' },
  { char: '❤️', name: 'Trái tim đỏ' },
  { char: '🎉', name: 'Pháo hoa tiệc tùng' },
  { char: '✨', name: 'Lấp lánh' },
  { char: '⭐', name: 'Ngôi sao vàng' },
  { char: '💡', name: 'Bóng đèn ý tưởng' },
  { char: '🚀', name: 'Tên lửa bứt phá' },
  { char: '💯', name: 'Điểm 100 tuyệt đối' },
  { char: '✅', name: 'Tích xanh hoàn thành' },
  { char: '❌', name: 'Dấu X đỏ' },
];

interface SymbolModalProps {
  isOpen: boolean;
  type?: 'symbol' | 'emoji';
  onClose: () => void;
}

export function SymbolModal({ isOpen, type = 'symbol', onClose }: SymbolModalProps) {
  const [hoveredItem, setHoveredItem] = useState<SymbolItem | null>(null);

  if (!isOpen) return null;

  const dataList = type === 'emoji' ? EMOJI_MODAL_DATA : SYMBOL_DATA;
  const title = type === 'emoji' ? 'Emoji' : 'Ký hiệu';

  const handleSelect = (char: string) => {
    (EditorAPI.getLegacy() as any)?.insertTextAtSelection?.(char);
    onClose();
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.35)' }}
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="bg-white rounded-lg shadow-2xl w-[640px] max-w-[95vw] overflow-hidden flex flex-col"
        style={{ fontFamily: 'Segoe UI, sans-serif' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4">
          <span className="text-[17px] font-semibold text-[#0078d4]">{title}</span>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
          >
            <I.X size={18} />
          </button>
        </div>

        {/* Grid Content */}
        <div className="px-6 pb-6 overflow-y-auto max-h-[420px] custom-scrollbar">
          <div className="grid gap-1 relative" style={{ gridTemplateColumns: 'repeat(13, minmax(0, 1fr))' }}>
            {dataList.map((item, idx) => (
              <div
                key={idx}
                className="relative group flex items-center justify-center"
                onMouseEnter={() => setHoveredItem(item)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <button
                  onClick={() => handleSelect(item.char)}
                  className="w-9 h-9 flex items-center justify-center text-[18px] text-slate-800 hover:text-[#0078d4] rounded border border-transparent hover:border-[#1a1a1a] hover:shadow-sm transition-all cursor-pointer"
                >
                  {item.char}
                </button>

                {/* Tooltip on hover matching screenshot */}
                {hoveredItem === item && (
                  <div
                    className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 z-50 bg-white text-slate-800 border border-slate-300 rounded px-2.5 py-1 text-[11px] whitespace-nowrap shadow-md pointer-events-none"
                    style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}
                  >
                    {item.name}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[1px] border-4 border-transparent border-t-white" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
