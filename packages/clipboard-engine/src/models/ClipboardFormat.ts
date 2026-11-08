/**
 * Standard MIME types used for Clipboard data transfer.
 */
export enum ClipboardFormat {
  PlainText = 'text/plain',
  HTML = 'text/html',
  RTF = 'text/rtf',
  PNG = 'image/png',
  SVG = 'image/svg+xml',
  
  // Custom high-fidelity OfficeX format
  OpenXML = 'application/vnd.officex.openxml'
}
