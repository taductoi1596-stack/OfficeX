import React from 'react';
import { RGroup, RBtn } from '../SharedComponents';
import { IconSend } from '@officex/icons';

export function MailingsRibbon() {
  return (
    <>
      <RGroup label="Create">
        <RBtn icon={IconSend} title="Envelopes" />
        <RBtn icon={IconSend} title="Labels" />
      </RGroup>
      <RGroup label="Start Mail Merge">
        <RBtn icon={IconSend} title="Start Mail Merge" />
        <RBtn icon={IconSend} title="Select Recipients" />
      </RGroup>
    </>
  );
}
