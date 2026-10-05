import React from 'react';
import type { RubyToken } from '../types';

interface FuriganaTextProps {
  text: string;
  rubyTokens?: RubyToken[];
  showFurigana?: boolean;
  className?: string;
  onClickWord?: (token: RubyToken) => void;
}

export const FuriganaText: React.FC<FuriganaTextProps> = ({
  text,
  rubyTokens,
  showFurigana = true,
  className = '',
  onClickWord,
}) => {
  if (!rubyTokens || rubyTokens.length === 0) {
    return <span className={className}>{text}</span>;
  }

  // Parse text into regular segments and ruby tokens
  let remaining = text;
  const elements: React.ReactNode[] = [];
  let keyIndex = 0;

  while (remaining.length > 0) {
    // Find first matching token in remaining
    let earliestToken: RubyToken | null = null;
    let earliestIndex = -1;

    for (const token of rubyTokens) {
      const idx = remaining.indexOf(token.kanji);
      if (idx !== -1 && (earliestIndex === -1 || idx < earliestIndex)) {
        earliestIndex = idx;
        earliestToken = token;
      }
    }

    if (earliestToken && earliestIndex !== -1) {
      if (earliestIndex > 0) {
        // Text before token
        elements.push(
          <span key={`text-${keyIndex++}`}>{remaining.slice(0, earliestIndex)}</span>
        );
      }

      const tok = earliestToken;
      if (showFurigana) {
        elements.push(
          <ruby
            key={`ruby-${keyIndex++}`}
            onClick={(e) => {
              if (onClickWord) {
                e.stopPropagation();
                onClickWord(tok);
              }
            }}
            className={`cursor-pointer hover:text-indigo-600 transition-colors ${onClickWord ? 'group' : ''}`}
            title={`${tok.kanji}: ${tok.furigana} (${tok.romaji || ''}) ${tok.meaning ? '- ' + tok.meaning : ''}`}
          >
            {tok.kanji}
            <rt className="text-indigo-500 font-semibold group-hover:text-indigo-700">{tok.furigana}</rt>
          </ruby>
        );
      } else {
        elements.push(
          <span
            key={`noruby-${keyIndex++}`}
            onClick={(e) => {
              if (onClickWord) {
                e.stopPropagation();
                onClickWord(tok);
              }
            }}
            className={`cursor-pointer hover:underline hover:text-indigo-600 ${className}`}
            title={`클릭하여 발음 보기: ${tok.furigana}`}
          >
            {tok.kanji}
          </span>
        );
      }

      remaining = remaining.slice(earliestIndex + tok.kanji.length);
    } else {
      // No more tokens found
      elements.push(<span key={`text-${keyIndex++}`}>{remaining}</span>);
      break;
    }
  }

  return <span className={`inline-flex flex-wrap items-end ${className}`}>{elements}</span>;
};
