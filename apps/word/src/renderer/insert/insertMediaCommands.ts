import { CommandDefinition } from '../CommandDispatcher';
import { InsertMediaEngine } from './InsertMediaEngine';

function cmd(id: string, name: string, handler: (payload?: any) => void): CommandDefinition {
  return { id, name, handler };
}

export class InsertMediaCommandRegistry {
  static all(): CommandDefinition[] {
    return [

      // --- Canonical Spec IDs ---
      cmd('WORD.INSERT.VIDEO', 'Video', () => InsertMediaEngine.Video('file')),
      cmd('WORD.INSERT.AUDIO', 'Audio', () => InsertMediaEngine.Audio('file')),
      cmd('WORD.INSERT.SCREEN_RECORD', 'Screen Recording', () => InsertMediaEngine.ScreenRecording()),
      cmd('WORD.INSERT.QRCODE', 'QR Code', () => {}),
      cmd('WORD.INSERT.BARCODE', 'Barcode', () => {}),

      // MEDIA
      cmd('WORD.INSERT.MEDIA', 'Insert Media', () => InsertMediaEngine.Media('dialog')),
      cmd('WORD.INSERT.MEDIA.FILE', 'Insert Media File', () => InsertMediaEngine.Media('file')),
      cmd('WORD.INSERT.MEDIA.LINK', 'Link Media', () => InsertMediaEngine.Media('link')),
      cmd('WORD.INSERT.MEDIA.EMBED', 'Embed Media', () => InsertMediaEngine.Media('embed')),

      // VIDEO
      cmd('WORD.INSERT.VIDEO', 'Insert Video', () => InsertMediaEngine.Video('dialog')),
      cmd('WORD.INSERT.VIDEO.FILE', 'Video From File', () => InsertMediaEngine.Video('file')),
      cmd('WORD.INSERT.VIDEO.ONLINE', 'Online Video', () => InsertMediaEngine.Video('online')),
      cmd('WORD.INSERT.VIDEO.YOUTUBE', 'YouTube Video', () => InsertMediaEngine.Video('youtube')),
      cmd('WORD.INSERT.VIDEO.VIMEO', 'Vimeo Video', () => InsertMediaEngine.Video('vimeo')),
      cmd('WORD.INSERT.VIDEO.STREAM', 'Streaming Video', () => InsertMediaEngine.Video('stream')),
      cmd('WORD.INSERT.VIDEO.RECENT', 'Recent Video', () => InsertMediaEngine.Video('recent')),

      // AUDIO
      cmd('WORD.INSERT.AUDIO', 'Insert Audio', () => InsertMediaEngine.Audio('dialog')),
      cmd('WORD.INSERT.AUDIO.FILE', 'Audio File', () => InsertMediaEngine.Audio('file')),
      cmd('WORD.INSERT.AUDIO.RECORD', 'Record Audio', () => InsertMediaEngine.Audio('record')),
      cmd('WORD.INSERT.AUDIO.MICROPHONE', 'Microphone Input', () => InsertMediaEngine.Audio('microphone')),
      cmd('WORD.INSERT.AUDIO.ONLINE', 'Online Audio', () => InsertMediaEngine.Audio('online')),

      // RECORDING
      cmd('WORD.INSERT.SCREENRECORD', 'Screen Recording', () => InsertMediaEngine.ScreenRecording('screen')),
      cmd('WORD.INSERT.WEBCAM', 'Webcam Recording', () => InsertMediaEngine.ScreenRecording('webcam')),
      cmd('WORD.INSERT.CAMERA', 'Camera Capture', () => InsertMediaEngine.ScreenRecording('camera')),

      // GIF
      cmd('WORD.INSERT.GIF', 'Animated GIF', () => InsertMediaEngine.GIF('dialog')),
      cmd('WORD.INSERT.GIF.ONLINE', 'Online GIF', () => InsertMediaEngine.GIF('online')),

      // SVG
      cmd('WORD.INSERT.SVG', 'Insert SVG', () => InsertMediaEngine.SVG('dialog')),
      cmd('WORD.INSERT.SVG.FILE', 'SVG File', () => InsertMediaEngine.SVG('file')),
      cmd('WORD.INSERT.SVG.ONLINE', 'Online SVG', () => InsertMediaEngine.SVG('online')),

      // ICON
      cmd('WORD.INSERT.MEDIA.ICON', 'Insert Icon', () => InsertMediaEngine.SVG('dialog')), // Also tied to Symbol, handled generically here
      cmd('WORD.INSERT.MEDIA.ICON.SVG', 'SVG Icon', () => InsertMediaEngine.SVG('file')),

      // 3D MODEL
      cmd('WORD.INSERT.MODEL3D', 'Insert 3D Model', () => InsertMediaEngine.Model3D('dialog')),
      cmd('WORD.INSERT.MODEL3D.FILE', '3D Model File', () => InsertMediaEngine.Model3D('file')),
      cmd('WORD.INSERT.MODEL3D.ONLINE', 'Online 3D Model', () => InsertMediaEngine.Model3D('online')),
      cmd('WORD.INSERT.MODEL3D.ROTATE', 'Rotate Model', () => InsertMediaEngine.Model3D('rotate')),

      // QR CODE
      cmd('WORD.INSERT.QRCODE', 'Insert QR Code', () => InsertMediaEngine.QRCode('dialog')),
      cmd('WORD.INSERT.QRCODE.URL', 'QR URL', () => InsertMediaEngine.QRCode('url')),
      cmd('WORD.INSERT.QRCODE.TEXT', 'QR Text', () => InsertMediaEngine.QRCode('text')),
      cmd('WORD.INSERT.QRCODE.EMAIL', 'QR Email', () => InsertMediaEngine.QRCode('email')),
      cmd('WORD.INSERT.QRCODE.WIFI', 'QR WiFi', () => InsertMediaEngine.QRCode('wifi')),

      // BARCODE
      cmd('WORD.INSERT.BARCODE', 'Insert Barcode', () => InsertMediaEngine.Barcode('dialog')),
      cmd('WORD.INSERT.BARCODE.CODE128', 'Code128', () => InsertMediaEngine.Barcode('code128')),
      cmd('WORD.INSERT.BARCODE.QR', 'QR Barcode', () => InsertMediaEngine.Barcode('qr')),
      cmd('WORD.INSERT.BARCODE.EAN13', 'EAN13', () => InsertMediaEngine.Barcode('ean13')),
      cmd('WORD.INSERT.BARCODE.UPC', 'UPC', () => InsertMediaEngine.Barcode('upc')),

      // OBJECT
      cmd('WORD.INSERT.MEDIA.OBJECT', 'Insert Embedded Object', () => InsertMediaEngine.Object('dialog')),
      cmd('WORD.INSERT.MEDIA.OLE', 'OLE Object', () => InsertMediaEngine.Object('ole')),
      cmd('WORD.INSERT.MEDIA.PDF', 'Embedded PDF', () => InsertMediaEngine.Object('pdf')),
      cmd('WORD.INSERT.MEDIA.EXCEL', 'Embedded Excel', () => InsertMediaEngine.Object('excel')),
      cmd('WORD.INSERT.MEDIA.POWERPOINT', 'Embedded PowerPoint', () => InsertMediaEngine.Object('powerpoint')),
      cmd('WORD.INSERT.MEDIA.WORD', 'Embedded Word Document', () => InsertMediaEngine.Object('word')),

      // PLAYBACK
      cmd('WORD.MEDIA.PLAY', 'Play', () => InsertMediaEngine.Play()),
      cmd('WORD.MEDIA.PAUSE', 'Pause', () => InsertMediaEngine.Pause()),
      cmd('WORD.MEDIA.STOP', 'Stop', () => InsertMediaEngine.Stop()),
      cmd('WORD.MEDIA.LOOP', 'Loop Playback', () => InsertMediaEngine.PlaybackControls('loop')),
      cmd('WORD.MEDIA.MUTE', 'Mute', () => InsertMediaEngine.PlaybackControls('mute')),
      cmd('WORD.MEDIA.VOLUME', 'Volume', () => InsertMediaEngine.PlaybackControls('volume')),
      cmd('WORD.MEDIA.POSTER', 'Poster Frame', () => InsertMediaEngine.PlaybackControls('poster')),
      cmd('WORD.MEDIA.START', 'Playback Start Mode', () => InsertMediaEngine.PlaybackControls('start')),
      cmd('WORD.MEDIA.END', 'Playback End Mode', () => InsertMediaEngine.PlaybackControls('end')),

      // COMPRESS
      cmd('WORD.MEDIA.COMPRESS', 'Compress Media', () => InsertMediaEngine.Compress('compress')),
      cmd('WORD.MEDIA.OPTIMIZE', 'Optimize Media', () => InsertMediaEngine.Compress('optimize')),
      cmd('WORD.MEDIA.REPLACE', 'Replace Media', () => InsertMediaEngine.Compress('replace')),
      cmd('WORD.MEDIA.RELINK', 'Relink Media', () => InsertMediaEngine.Compress('relink')),

      // ACCESSIBILITY
      cmd('WORD.MEDIA.ALTTEXT', 'Alt Text', () => InsertMediaEngine.Accessibility('alttext')),
      cmd('WORD.MEDIA.CAPTION', 'Closed Caption', () => InsertMediaEngine.Accessibility('caption')),
      cmd('WORD.MEDIA.TRANSCRIPT', 'Transcript', () => InsertMediaEngine.Accessibility('transcript')),

      // AI
      cmd('WORD.MEDIA.AI.GENERATE', 'Generate Media', () => InsertMediaEngine.AI('generate')),
      cmd('WORD.MEDIA.AI.DESCRIBE', 'Generate Alt Text', () => InsertMediaEngine.AI('describe')),
      cmd('WORD.MEDIA.AI.TRANSCRIBE', 'Speech To Text', () => InsertMediaEngine.AI('transcribe')),
      cmd('WORD.MEDIA.AI.SUBTITLE', 'Generate Subtitle', () => InsertMediaEngine.AI('subtitle')),
      cmd('WORD.MEDIA.AI.TRANSLATE', 'Translate Subtitle', () => InsertMediaEngine.AI('translate')),
    ];
  }
}
