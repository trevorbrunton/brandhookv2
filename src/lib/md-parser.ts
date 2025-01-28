"use client";
import { jsPDF } from "jspdf";

interface ParsedLine {
  "md-tag": string;
  text: string;
}

function parseMarkdown(input: string): ParsedLine[] {
  const lines = input.split("\n");
  const result: ParsedLine[] = [];

  for (const line of lines) {
    let mdTag = "p"; // Default to paragraph
    let text = line.trim();

    switch (true) {
      case text.startsWith("# "):
        mdTag = "h1";
        text = text.slice(2);
        break;
      case text.startsWith("## "):
        mdTag = "h2";
        text = text.slice(3);
        break;
      case text.startsWith("### "):
        mdTag = "h3";
        text = text.slice(4);
        break;
      case text.startsWith("- "):
        mdTag = "li";
        text = text.slice(2);
        break;
      case /^\d+\.\s/.test(text):
        mdTag = "ol";
        text = text.replace(/^\d+\.\s/, "");
        break;
      // starts with a dash
      case text.startsWith("-"):
        mdTag = "li";
        text = text.slice(2);
        break;

      case text.startsWith("```"):
        mdTag = "code";
        text = text.slice(3);
        break;
      case text.startsWith("*"):
        mdTag = "strong";
        text = text.replace(/\*/g, "");
        break;

      // No default case needed as we've already set a default 'p' tag
    }

    result.push({ "md-tag": mdTag, text: text.trim() });
  }

  return result;
}

export function createPdfFromMarkdown(
  input: string,
  fileName: string
): boolean {
  const parsedLines = parseMarkdown(input);
  const doc = new jsPDF();
  let yOffset = 10;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 20;

  parsedLines.forEach((line) => {
    let fontSize = 12;
    let fontStyle = "normal";

    switch (line["md-tag"]) {
      case "h1":
        fontSize = 20;
        fontStyle = "bold";
        break;
      case "h2":
        fontSize = 16;
        fontStyle = "bold";
        break;
      case "h3":
        fontSize = 14;
        fontStyle = "bold";
        break;
      case "li":
      case "ol":
        fontSize = 12;
        fontStyle = "normal";
        break;
      case "blockquote":
        fontSize = 12;
        fontStyle = "italic";
        break;
      case "code":
        fontSize = 10;
        fontStyle = "normal";
        doc.setFont("courier", fontStyle);
        break;
      case "strong":
        fontSize = 10;
        fontStyle = "bold";
        break;
      default:
        fontSize = 12;
        fontStyle = "normal";
    }

    doc.setFont("helvetica", fontStyle);
    doc.setFontSize(fontSize);

    const maxWidth = doc.internal.pageSize.width - 2 * margin;
    const textLines = doc.splitTextToSize(line.text, maxWidth);

    textLines.forEach((textLine: string) => {
      if (yOffset > pageHeight - margin) {
        doc.addPage();
        yOffset = margin;
      }

      let xOffset = margin;
      if (line["md-tag"] === "li" || line["md-tag"] === "ol") {
        xOffset += 5;
      } else if (line["md-tag"] === "blockquote") {
        xOffset += 5;
      }
      textLine = textLine.replace(/\*/g, "");

      doc.text(textLine, xOffset, yOffset);
      yOffset += fontSize * 0.5;
    });

    yOffset += fontSize * 0.25; // Add space after each block
  });

  doc.save(`${fileName}.pdf`);
  return true;
}
