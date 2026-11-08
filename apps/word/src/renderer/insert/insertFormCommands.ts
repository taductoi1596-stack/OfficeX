import { CommandDefinition } from '../CommandDispatcher';
import { InsertFormEngine } from './InsertFormEngine';

function cmd(id: string, name: string, handler: (payload?: any) => void): CommandDefinition {
  return { id, name, handler };
}

export class InsertFormCommandRegistry {
  static all(): CommandDefinition[] {
    return [
      // FORM
      cmd('WORD.INSERT.FORM', 'Insert Form', () => InsertFormEngine.Form('dialog')),
      cmd('WORD.INSERT.FORM.NEW', 'New Form', () => InsertFormEngine.Form('new')),
      cmd('WORD.INSERT.FORM.TEMPLATE', 'Form Template', () => InsertFormEngine.Form('template')),
      cmd('WORD.INSERT.FORM.FILLABLE', 'Fillable Form', () => InsertFormEngine.Form('fillable')),
      cmd('WORD.INSERT.FORM.PROTECTED', 'Protected Form', () => InsertFormEngine.Form('protected')),

      // CONTENT CONTROL
      cmd('WORD.INSERT.CONTENTCONTROL', 'Insert Content Control', () => InsertFormEngine.ContentControl('dialog')),
      cmd('WORD.INSERT.CONTENTCONTROL.RICHTEXT', 'Rich Text Content Control', () => InsertFormEngine.ContentControl('richtext')),
      cmd('WORD.INSERT.CONTENTCONTROL.PLAINTEXT', 'Plain Text Content Control', () => InsertFormEngine.ContentControl('plaintext')),
      cmd('WORD.INSERT.CONTENTCONTROL.PICTURE', 'Picture Content Control', () => InsertFormEngine.ContentControl('picture')),
      cmd('WORD.INSERT.CONTENTCONTROL.CHECKBOX', 'Checkbox Content Control', () => InsertFormEngine.ContentControl('checkbox')),
      cmd('WORD.INSERT.CONTENTCONTROL.COMBOBOX', 'Combo Box Content Control', () => InsertFormEngine.ContentControl('combobox')),
      cmd('WORD.INSERT.CONTENTCONTROL.DROPDOWN', 'Drop Down Content Control', () => InsertFormEngine.ContentControl('dropdown')),
      cmd('WORD.INSERT.CONTENTCONTROL.DATE', 'Date Picker', () => InsertFormEngine.ContentControl('date')),
      cmd('WORD.INSERT.CONTENTCONTROL.REPEATING', 'Repeating Section', () => InsertFormEngine.ContentControl('repeating')),
      cmd('WORD.INSERT.CONTENTCONTROL.GROUP', 'Group Control', () => InsertFormEngine.ContentControl('group')),

      // LEGACY FORMS
      cmd('WORD.INSERT.LEGACY', 'Legacy Forms', () => InsertFormEngine.Legacy('dialog')),
      cmd('WORD.INSERT.LEGACY.TEXTBOX', 'Legacy Text Field', () => InsertFormEngine.Legacy('textbox')),
      cmd('WORD.INSERT.LEGACY.CHECKBOX', 'Legacy Checkbox', () => InsertFormEngine.Legacy('checkbox')),
      cmd('WORD.INSERT.LEGACY.DROPDOWN', 'Legacy Drop Down', () => InsertFormEngine.Legacy('dropdown')),

      // INPUT CONTROLS
      cmd('WORD.INSERT.INPUT.TEXT', 'Text Input', () => InsertFormEngine.Input('text')),
      cmd('WORD.INSERT.INPUT.NUMBER', 'Number Input', () => InsertFormEngine.Input('number')),
      cmd('WORD.INSERT.INPUT.EMAIL', 'Email Input', () => InsertFormEngine.Input('email')),
      cmd('WORD.INSERT.INPUT.URL', 'URL Input', () => InsertFormEngine.Input('url')),
      cmd('WORD.INSERT.INPUT.PASSWORD', 'Password Input', () => InsertFormEngine.Input('password')),
      cmd('WORD.INSERT.INPUT.PHONE', 'Phone Number', () => InsertFormEngine.Input('phone')),
      cmd('WORD.INSERT.INPUT.MULTILINE', 'Multi-line Text', () => InsertFormEngine.Input('multiline')),

      // SELECTION
      cmd('WORD.INSERT.SELECT.CHECKBOX', 'Checkbox', () => InsertFormEngine.Select('checkbox')),
      cmd('WORD.INSERT.SELECT.RADIO', 'Radio Button', () => InsertFormEngine.Select('radio')),
      cmd('WORD.INSERT.SELECT.LISTBOX', 'List Box', () => InsertFormEngine.Select('listbox')),
      cmd('WORD.INSERT.SELECT.COMBOBOX', 'Combo Box', () => InsertFormEngine.Select('combobox')),
      cmd('WORD.INSERT.SELECT.DROPDOWN', 'Drop Down List', () => InsertFormEngine.Select('dropdown')),

      // DATE & TIME
      cmd('WORD.INSERT.FORM.DATE', 'Date Picker', () => InsertFormEngine.DateTime('date')),
      cmd('WORD.INSERT.FORM.TIME', 'Time Picker', () => InsertFormEngine.DateTime('time')),
      cmd('WORD.INSERT.FORM.DATETIME', 'Date Time Picker', () => InsertFormEngine.DateTime('datetime')),

      // SIGNATURE
      cmd('WORD.INSERT.FORM.SIGNATURE', 'Signature Field', () => InsertFormEngine.Signature('signature')),
      cmd('WORD.INSERT.FORM.DIGITALSIGNATURE', 'Digital Signature', () => InsertFormEngine.Signature('digital')),
      cmd('WORD.INSERT.FORM.INITIAL', 'Initial Field', () => InsertFormEngine.Signature('initial')),

      // VALIDATION
      cmd('WORD.INSERT.FORM.VALIDATION', 'Validation Rule', () => InsertFormEngine.Validation('dialog')),
      cmd('WORD.INSERT.FORM.REQUIRED', 'Required Field', () => InsertFormEngine.Validation('required')),
      cmd('WORD.INSERT.FORM.MIN', 'Minimum Value', () => InsertFormEngine.Validation('min')),
      cmd('WORD.INSERT.FORM.MAX', 'Maximum Value', () => InsertFormEngine.Validation('max')),
      cmd('WORD.INSERT.FORM.REGEX', 'Regex Validation', () => InsertFormEngine.Validation('regex')),
      cmd('WORD.INSERT.FORM.LENGTH', 'Length Validation', () => InsertFormEngine.Validation('length')),

      // DATA BINDING
      cmd('WORD.INSERT.FORM.XMLMAP', 'XML Mapping', () => InsertFormEngine.DataBinding('xmlmap')),
      cmd('WORD.INSERT.FORM.DATABASE', 'Database Binding', () => InsertFormEngine.DataBinding('database')),
      cmd('WORD.INSERT.FORM.JSON', 'JSON Binding', () => InsertFormEngine.DataBinding('json')),
      cmd('WORD.INSERT.FORM.API', 'REST API Binding', () => InsertFormEngine.DataBinding('api')),

      // PROTECTION
      cmd('WORD.INSERT.FORM.PROTECT', 'Protect Form', () => InsertFormEngine.Protection('protect')),
      cmd('WORD.INSERT.FORM.UNPROTECT', 'Unprotect Form', () => InsertFormEngine.Protection('unprotect')),
      cmd('WORD.INSERT.FORM.LOCK', 'Lock Control', () => InsertFormEngine.Protection('lock')),
      cmd('WORD.INSERT.FORM.UNLOCK', 'Unlock Control', () => InsertFormEngine.Protection('unlock')),

      // TEMPLATE
      cmd('WORD.INSERT.FORM.SAVE', 'Save Form Template', () => InsertFormEngine.Template('save')),
      cmd('WORD.INSERT.FORM.LOAD', 'Load Form Template', () => InsertFormEngine.Template('load')),
      cmd('WORD.INSERT.FORM.DELETE', 'Delete Template', () => InsertFormEngine.Template('delete')),

      // AI
      cmd('WORD.INSERT.FORM.AI.GENERATE', 'Generate Form', () => InsertFormEngine.AI('generate')),
      cmd('WORD.INSERT.FORM.AI.SURVEY', 'Generate Survey', () => InsertFormEngine.AI('survey')),
      cmd('WORD.INSERT.FORM.AI.APPLICATION', 'Generate Application Form', () => InsertFormEngine.AI('application')),
      cmd('WORD.INSERT.FORM.AI.REGISTRATION', 'Generate Registration Form', () => InsertFormEngine.AI('registration')),
      cmd('WORD.INSERT.FORM.AI.VALIDATE', 'Generate Validation Rules', () => InsertFormEngine.AI('validate')),
    ];
  }
}
