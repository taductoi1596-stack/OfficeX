import React from 'react';
import { RGroup, RBtn } from '../SharedComponents';
import { IconFormatPainter, IconBot, IconFileText } from '@officex/icons';

export function DeveloperRibbon() {
  return (
    <>
      <RGroup label="Code">
        <RBtn icon={IconFormatPainter} title="Visual Basic" />
        <RBtn icon={IconBot} title="Macros" />
      </RGroup>
      <RGroup label="Add-ins">
        <RBtn icon={IconFileText} title="Add-ins" />
      </RGroup>
    </>
  );
}
