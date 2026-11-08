import type { PageSetup } from '../document/DocumentTypes';
import type { HeaderFooterModel, HeaderFooterSettings } from '../headerfooter/HeaderFooterTypes';

export type BreakType = 'Continuous' | 'NextPage' | 'EvenPage' | 'OddPage';

export interface DocSection {
  id: string;
  startParaIdx: number;
  endParaIdx: number; // inclusive
  breakType?: BreakType; // How this section transitions from the previous one
  pageSetup: PageSetup;
  headers?: HeaderFooterModel[];
  footers?: HeaderFooterModel[];
  headerFooterSettings?: HeaderFooterSettings;
}
