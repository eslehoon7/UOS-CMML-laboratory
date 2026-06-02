/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

/**
 * Parses a string and converts:
 * 1. Text wrapped in asterisks (e.g., *text*) into an italic span.
 * 2. Text wrapped in double quotes (e.g., "text") into a styled span with a different font and color.
 */
export function parseFormattedText(
  text: string | undefined | null,
  options: { italicClass?: string; quoteClass?: string } = {}
): React.ReactNode {
  if (!text) return "";

  const italicClass = options.italicClass || "italic font-normal";
  // Premium theme accent with a classy serif typeface and gold coloring inside the text body
  const quoteClass = options.quoteClass || "font-serif font-black italic text-brand-gold relative px-1 tracking-normal hover:opacity-90 transition-opacity";

  // Step 1: Split by markdown italic asterisks: *some italic*
  const italicParts = text.split(/(\*[^*]+\*)/g);
  const result: React.ReactNode[] = [];

  italicParts.forEach((part, iIndex) => {
    if (part.startsWith('*') && part.endsWith('*')) {
      const italicContent = part.slice(1, -1);
      // Step 2: Split this italic content by double quotes: "some text"
      const quoteParts = italicContent.split(/("[^"]+")/g);
      
      quoteParts.forEach((qp, qIndex) => {
        const key = `it-${iIndex}-${qIndex}`;
        if (qp.startsWith('"') && qp.endsWith('"')) {
          result.push(
            <span key={key} className={`${italicClass} ${quoteClass}`}>
              {qp}
            </span>
          );
        } else {
          result.push(
            <span key={key} className={italicClass}>
              {qp}
            </span>
          );
        }
      });
    } else {
      // Step 2: Split this plain content by double quotes: "some text"
      const quoteParts = part.split(/("[^"]+")/g);
      quoteParts.forEach((qp, qIndex) => {
        const key = `pl-${iIndex}-${qIndex}`;
        if (qp.startsWith('"') && qp.endsWith('"')) {
          result.push(
            <span key={key} className={quoteClass}>
              {qp}
            </span>
          );
        } else {
          result.push(qp);
        }
      });
    }
  });

  return <>{result}</>;
}

/**
 * Backward compatibility helper that also parses italics & double quotes
 */
export function parseItalicText(
  text: string | undefined | null,
  italicClass?: string
): React.ReactNode {
  return parseFormattedText(text, { italicClass });
}
