import React from 'react';
import { RGroup, RBtn } from '../SharedComponents';
import { IconBot, IconSearch, IconUser } from '@officex/icons';

export function HelpRibbon() {
  return (
    <>
      <RGroup label="Help">
        <RBtn icon={IconBot} title="Help" />
        <RBtn icon={IconSearch} title="Training" />
        <RBtn icon={IconUser} title="Feedback" />
        <RBtn icon={IconBot} title="Support" />
      </RGroup>
      <RGroup label="About">
        <RBtn icon={IconBot} title="About" />
      </RGroup>
    </>
  );
}
