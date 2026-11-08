import React from 'react';
import { 
  Square, Circle, MessageSquare, Star, Triangle, Cylinder, Box,
  Minus, ArrowDownRight, ArrowRight, ArrowLeft, ArrowUp, ArrowDown,
  MoveHorizontal, MoveVertical, CornerDownRight, CornerRightDown,
  Plus, X, Divide, Equal, Sun, Moon, Cloud, Hexagon, Octagon, Pentagon,
  MessageCircle, Flag, Diamond, Heart, Zap, Shield, Home, Camera,
  AlertTriangle, CheckSquare, Bookmark, Music, Gift, Globe,
  Lock, Key, Cpu, Database, Wifi, Phone, Mail
} from 'lucide-react';
import { CommandDispatcher } from '../CommandDispatcher';

const ShapeSection = ({ title, items }: { title: string, items: { icon: React.ReactNode, type: string, label?: string }[] }) => (
  <div className="mb-3">
    <div className="text-[11px] font-semibold text-slate-700 mb-1 px-1">{title}</div>
    <div className="flex flex-wrap gap-0.5">
      {items.map((item, i) => (
        <button 
          key={i} 
          title={item.label || item.type}
          className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-100 border border-transparent hover:border-slate-400 transition-colors"
          onClick={() => {
            CommandDispatcher.dispatch('EXCEL.INSERT.SHAPE', { type: item.type });
          }}
        >
          {item.icon}
        </button>
      ))}
    </div>
  </div>
);

export const ShapesMenu = () => {
  const iconProps = { size: 18, strokeWidth: 1.5, className: "text-slate-700" };

  return (
    <div className="w-[320px] max-h-[480px] overflow-y-auto p-2 bg-white cursor-default">
      {/* ── Đường & Connector ─────────────────────────── */}
      <ShapeSection 
        title="Đường & Kết nối" 
        items={[
          { icon: <Minus {...iconProps} />, type: 'line', label: 'Đường thẳng' },
          { icon: <ArrowRight {...iconProps} />, type: 'arrow', label: 'Mũi tên phải' },
          { icon: <ArrowLeft {...iconProps} />, type: 'arrow-left', label: 'Mũi tên trái' },
          { icon: <ArrowUp {...iconProps} />, type: 'arrow-up', label: 'Mũi tên lên' },
          { icon: <ArrowDown {...iconProps} />, type: 'arrow-down', label: 'Mũi tên xuống' },
          { icon: <MoveHorizontal {...iconProps} />, type: 'arrow-both', label: 'Mũi tên 2 chiều ngang' },
          { icon: <MoveVertical {...iconProps} />, type: 'arrow-both-v', label: 'Mũi tên 2 chiều dọc' },
          { icon: <CornerDownRight {...iconProps} />, type: 'arrow-bend', label: 'Đường cong' },
          { icon: <ArrowDownRight {...iconProps} />, type: 'arrow-diagonal', label: 'Mũi tên chéo' },
        ]} 
      />

      {/* ── Hình chữ nhật ─────────────────────────────── */}
      <ShapeSection 
        title="Hình Chữ nhật" 
        items={[
          { icon: <Square {...iconProps} />, type: 'rect', label: 'Hình chữ nhật' },
          { icon: <Square {...iconProps} style={{ borderRadius: 3 }} />, type: 'rect-rounded', label: 'Hình chữ nhật bo góc' },
          { icon: <Square {...iconProps} style={{ transform: 'skewX(-8deg)' }} />, type: 'parallelogram', label: 'Hình bình hành' },
        ]} 
      />

      {/* ── Hình cơ bản ───────────────────────────────── */}
      <ShapeSection 
        title="Hình Cơ bản" 
        items={[
          { icon: <Circle {...iconProps} />, type: 'circle', label: 'Hình tròn/Elip' },
          { icon: <Triangle {...iconProps} />, type: 'triangle', label: 'Hình tam giác' },
          { icon: <Diamond {...iconProps} />, type: 'diamond', label: 'Hình thoi' },
          { icon: <Pentagon {...iconProps} />, type: 'pentagon', label: 'Ngũ giác' },
          { icon: <Hexagon {...iconProps} />, type: 'hexagon', label: 'Lục giác' },
          { icon: <Octagon {...iconProps} />, type: 'octagon', label: 'Bát giác' },
          { icon: <Cylinder {...iconProps} />, type: 'cylinder', label: 'Hình trụ' },
          { icon: <Box {...iconProps} />, type: 'rect', label: 'Hình hộp' },
          { icon: <Plus {...iconProps} />, type: 'cross', label: 'Hình chữ thập' },
          { icon: <X {...iconProps} />, type: 'xshape', label: 'Hình dấu X' },
        ]} 
      />

      {/* ── Mũi tên khối ──────────────────────────────── */}
      <ShapeSection 
        title="Mũi tên Khối" 
        items={[
          { icon: <ArrowRight {...iconProps} style={{ strokeWidth: 3 }} />, type: 'block-arrow-right', label: 'Mũi tên khối phải' },
          { icon: <ArrowLeft {...iconProps} style={{ strokeWidth: 3 }} />, type: 'block-arrow-left', label: 'Mũi tên khối trái' },
          { icon: <ArrowUp {...iconProps} style={{ strokeWidth: 3 }} />, type: 'block-arrow-up', label: 'Mũi tên khối lên' },
          { icon: <ArrowDown {...iconProps} style={{ strokeWidth: 3 }} />, type: 'block-arrow-down', label: 'Mũi tên khối xuống' },
          { icon: <MoveHorizontal {...iconProps} style={{ strokeWidth: 3 }} />, type: 'block-arrow-both', label: 'Mũi tên khối 2 chiều' },
        ]} 
      />

      {/* ── Hình phương trình / Toán học ─────────────── */}
      <ShapeSection 
        title="Hình Phương trình" 
        items={[
          { icon: <Plus {...iconProps} />, type: 'cross', label: 'Dấu cộng' },
          { icon: <Minus {...iconProps} />, type: 'line', label: 'Dấu trừ' },
          { icon: <X {...iconProps} />, type: 'xshape', label: 'Dấu nhân' },
          { icon: <Divide {...iconProps} />, type: 'diamond', label: 'Dấu chia' },
          { icon: <Equal {...iconProps} />, type: 'line', label: 'Dấu bằng' },
        ]} 
      />

      {/* ── Sao & Biểu ngữ ────────────────────────────── */}
      <ShapeSection 
        title="Sao & Biểu ngữ" 
        items={[
          { icon: <Star {...iconProps} />, type: 'star', label: 'Ngôi sao' },
          { icon: <Zap {...iconProps} />, type: 'lightning', label: 'Sét/Năng lượng' },
          { icon: <Shield {...iconProps} />, type: 'shield', label: 'Khiên bảo vệ' },
          { icon: <Heart {...iconProps} />, type: 'heart', label: 'Trái tim' },
          { icon: <Flag {...iconProps} />, type: 'flag', label: 'Lá cờ' },
          { icon: <Bookmark {...iconProps} />, type: 'bookmark', label: 'Dấu trang' },
        ]} 
      />

      {/* ── Lưu đồ ────────────────────────────────────── */}
      <ShapeSection 
        title="Lưu đồ (Flowchart)" 
        items={[
          { icon: <Square {...iconProps} />, type: 'rect', label: 'Quy trình (Process)' },
          { icon: <Diamond {...iconProps} />, type: 'diamond', label: 'Quyết định (Decision)' },
          { icon: <Circle {...iconProps} />, type: 'circle', label: 'Điểm đầu/cuối (Terminal)' },
          { icon: <Cylinder {...iconProps} />, type: 'cylinder', label: 'Dữ liệu (Database)' },
          { icon: <Triangle {...iconProps} style={{ transform: 'rotate(90deg)' }} />, type: 'triangle', label: 'Tài liệu (Document)' },
          { icon: <Hexagon {...iconProps} />, type: 'hexagon', label: 'Chuẩn bị (Preparation)' },
          { icon: <Pentagon {...iconProps} />, type: 'pentagon', label: 'Phương án' },
        ]} 
      />

      {/* ── Khung chú thích ───────────────────────────── */}
      <ShapeSection 
        title="Khung chú thích" 
        items={[
          { icon: <MessageSquare {...iconProps} />, type: 'message-square', label: 'Hộp thoại vuông' },
          { icon: <MessageCircle {...iconProps} />, type: 'message-circle', label: 'Hộp thoại tròn' },
          { icon: <AlertTriangle {...iconProps} />, type: 'triangle', label: 'Cảnh báo' },
          { icon: <CheckSquare {...iconProps} />, type: 'rect', label: 'Xác nhận' },
        ]} 
      />

      {/* ── Tự nhiên & Môi trường ─────────────────────── */}
      <ShapeSection 
        title="Tự nhiên & Môi trường" 
        items={[
          { icon: <Sun {...iconProps} />, type: 'sun', label: 'Mặt trời' },
          { icon: <Moon {...iconProps} />, type: 'moon', label: 'Mặt trăng' },
          { icon: <Cloud {...iconProps} />, type: 'cloud', label: 'Đám mây' },
          { icon: <Globe {...iconProps} />, type: 'circle', label: 'Địa cầu' },
        ]} 
      />

      {/* ── Biểu tượng công nghệ ──────────────────────── */}
      <ShapeSection 
        title="Công nghệ & Hệ thống" 
        items={[
          { icon: <Cpu {...iconProps} />, type: 'rect', label: 'CPU/Chip' },
          { icon: <Database {...iconProps} />, type: 'cylinder', label: 'Cơ sở dữ liệu' },
          { icon: <Wifi {...iconProps} />, type: 'arc', label: 'Wifi/Kết nối' },
          { icon: <Lock {...iconProps} />, type: 'rect', label: 'Bảo mật' },
          { icon: <Key {...iconProps} />, type: 'rect', label: 'Khóa/API' },
          { icon: <Phone {...iconProps} />, type: 'rect-rounded', label: 'Điện thoại' },
          { icon: <Mail {...iconProps} />, type: 'rect', label: 'Email' },
          { icon: <Camera {...iconProps} />, type: 'rect', label: 'Camera' },
          { icon: <Home {...iconProps} />, type: 'pentagon', label: 'Nhà/Trang chủ' },
          { icon: <Music {...iconProps} />, type: 'star', label: 'Âm nhạc' },
          { icon: <Gift {...iconProps} />, type: 'rect', label: 'Quà tặng' },
        ]} 
      />
    </div>
  );
};
