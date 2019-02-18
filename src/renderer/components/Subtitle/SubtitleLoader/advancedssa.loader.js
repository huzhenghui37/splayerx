import flow from 'lodash/flow';
import pick from 'lodash/pick';
import isEqual from 'lodash/isEqual';
import { compile } from 'ass-compiler';

import { localLanguageLoader, localNameLoader, loadLocalFile, localIdLoader } from './utils';

const baseTags = {
  // fn: '',
  // fs: '',
  // c1: '',
  // a1: '',
  // c2: '',
  // a2: '',
  // c3: '',
  // a3: '',
  // c4: '',
  // a4: '',
  b: 0,
  i: 0,
  u: 0,
  s: 0,
  // fscx: 100,
  // fscy: 100,
  // fsp: 0,
  // frz: 0,
  // xbord: 2,
  // ybord: 2,
  // xshad: 2,
  // yshad: 2,
  // q: 0,
  alignment: 2,
  pos: null,
};
const normalizer = (parsedSubtitle) => {
  const finalSubtitles = [];
  const { dialogues } = parsedSubtitle;
  dialogues.forEach((dialogue) => {
    const {
      start, end, alignment, slices, pos,
    } = dialogue;
    const baseDiagolue = {
      start, end,
    };
    Object.values(slices).forEach((slice) => {
      const { tag: sliceTag, fragments } = slice;
      const processedFragments = fragments.map((fragment) => {
        const { tag: fragmentTag, text } = fragment;
        const finalTags = {
          ...baseTags,
          alignment,
          pos,
          ...pick(Object.assign({}, sliceTag, fragmentTag), ['b', 'i', 'u', 's']),
        };
        return { text: text.replace(/[\\/][Nn]/g, '<br>'), tags: finalTags };
      });
      const finalDialogue = {
        ...baseDiagolue,
        fragments: processedFragments,
      };
      finalSubtitles.push(finalDialogue);
    });
  });
  return finalSubtitles;
};

export default {
  longName: 'ASS (Advanced SSA) subtitle',
  name: 'ass',
  supportedFormats: ['ass'],
  id: localIdLoader,
  infoLoaders: {
    language: {
      func: localLanguageLoader,
      params: ['src', 'format'],
    },
    name: localNameLoader,
  },
  loader: loadLocalFile,
  parser: flow(compile, normalizer),
};
