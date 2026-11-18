import React from 'react';
import { Composition } from 'remotion';
import { FullF, FULLF_LEN } from './videoF/FullF';
import { ThumbVF_A, ThumbVF_B, ThumbVF_C } from './videoF/ThumbsF';
export const Root: React.FC = () => (<>
  <Composition id="VF-Full" component={FullF} defaultProps={{ audio: false }} durationInFrames={FULLF_LEN} fps={30} width={1920} height={1080} />
  <Composition id="VF-ThumbA" component={ThumbVF_A} durationInFrames={1} fps={30} width={1280} height={720} />
  <Composition id="VF-ThumbB" component={ThumbVF_B} durationInFrames={1} fps={30} width={1280} height={720} />
  <Composition id="VF-ThumbC" component={ThumbVF_C} durationInFrames={1} fps={30} width={1280} height={720} />
</>);
