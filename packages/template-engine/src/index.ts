// @officex/template-engine — Public API
export type {
  Template,
  TemplateType,
  TemplateCategory,
  TemplateVariable,
  TemplateResource,
  TemplateMetadata,
  TemplateRenderContext,
  TemplatePackage,
} from './models/Template';

export { VariableEngine } from './VariableEngine';
export type { ResolvedVariables } from './VariableEngine';

export { GalleryManager } from './GalleryManager';
export type { GalleryQuery } from './GalleryManager';

export { TemplateManager } from './TemplateManager';
export type { TemplateRenderResult, TemplateValidationResult } from './TemplateManager';
