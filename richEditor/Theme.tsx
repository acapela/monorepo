import { createGlobalStyle, css } from "styled-components";
import { ACTIVE_COLOR } from "~ui/colors";

/*!
 * Quill Editor v1.3.0
 * https://quilljs.com/
 * Copyright (c) 2014, Jason Chen
 * Copyright (c) 2013, salesforce.com
 */
export const QuillTheme = createGlobalStyle`
.ql-container {
  box-sizing: border-box;
  height: 100%;
  margin: 0px;
  position: relative;

  &.ql-disabled {
    .ql-tooltip {
      visibility: hidden;
    }

    .ql-editor ul[data-checked] > li::before {
      pointer-events: none;
    }
  }
}

.ql-clipboard {
  left: -100000px;
  height: 1px;
  overflow-y: hidden;
  position: absolute;
  top: 50%;

  p {
    margin: 0;
    padding: 0;
  }
}

.ql-editor {
  box-sizing: border-box;
  line-height: 1.42;
  height: 100%;
  outline: none;
  overflow-y: auto;
  padding: 12px 15px;
  tab-size: 4;
  -moz-tab-size: 4;
  text-align: left;
  white-space: pre-wrap;
  word-wrap: break-word;

  > * {
    cursor: text;
  }

  p, ol, ul, pre, blockquote, h1, h2, h3, h4, h5, h6 {
    margin: 0;
    padding: 0;
    counter-reset: list-1 list-2 list-3 list-4 list-5 list-6 list-7 list-8 list-9;
  }

  ol, ul {
    padding-left: 1.5em;
  }

  ol > li {
    list-style-type: none;
  }

  ul {
    > li {
      list-style-type: none;

      &::before {
        content: '\\2022';
      }
    }

    &[data-checked=true], &[data-checked=false] {
      pointer-events: none;
    }

    &[data-checked=true] > li *, &[data-checked=false] > li * {
      pointer-events: all;
    }

    &[data-checked=true] > li::before, &[data-checked=false] > li::before {
      color: #777;
      cursor: pointer;
      pointer-events: all;
    }

    &[data-checked=true] > li::before {
      content: '\\2611';
    }

    &[data-checked=false] > li::before {
      content: '\\2610';
    }
  }

  li {
    &::before {
      display: inline-block;
      white-space: nowrap;
      width: 1.2em;
    }

    &:not(.ql-direction-rtl)::before {
      margin-left: -1.5em;
      margin-right: 0.3em;
      text-align: right;
    }

    &.ql-direction-rtl::before {
      margin-left: 0.3em;
      margin-right: -1.5em;
    }
  }

  ol li:not(.ql-direction-rtl), ul li:not(.ql-direction-rtl) {
    padding-left: 1.5em;
  }

  ol li.ql-direction-rtl, ul li.ql-direction-rtl {
    padding-right: 1.5em;
  }

  ol li {
    counter-reset: list-1 list-2 list-3 list-4 list-5 list-6 list-7 list-8 list-9;
    counter-increment: list-0;

    &:before {
      content: counter(list-0, decimal) ". ";
    }

    &.ql-indent-1 {
      counter-increment: list-1;

      &:before {
        content: counter(list-1, lower-alpha) ". ";
      }

      counter-reset: list-2 list-3 list-4 list-5 list-6 list-7 list-8 list-9;
    }

    &.ql-indent-2 {
      counter-increment: list-2;

      &:before {
        content: counter(list-2, lower-roman) ". ";
      }

      counter-reset: list-3 list-4 list-5 list-6 list-7 list-8 list-9;
    }

    &.ql-indent-3 {
      counter-increment: list-3;

      &:before {
        content: counter(list-3, decimal) ". ";
      }

      counter-reset: list-4 list-5 list-6 list-7 list-8 list-9;
    }

    &.ql-indent-4 {
      counter-increment: list-4;

      &:before {
        content: counter(list-4, lower-alpha) ". ";
      }

      counter-reset: list-5 list-6 list-7 list-8 list-9;
    }

    &.ql-indent-5 {
      counter-increment: list-5;

      &:before {
        content: counter(list-5, lower-roman) ". ";
      }

      counter-reset: list-6 list-7 list-8 list-9;
    }

    &.ql-indent-6 {
      counter-increment: list-6;

      &:before {
        content: counter(list-6, decimal) ". ";
      }

      counter-reset: list-7 list-8 list-9;
    }

    &.ql-indent-7 {
      counter-increment: list-7;

      &:before {
        content: counter(list-7, lower-alpha) ". ";
      }

      counter-reset: list-8 list-9;
    }

    &.ql-indent-8 {
      counter-increment: list-8;

      &:before {
        content: counter(list-8, lower-roman) ". ";
      }

      counter-reset: list-9;
    }

    &.ql-indent-9 {
      counter-increment: list-9;

      &:before {
        content: counter(list-9, decimal) ". ";
      }
    }
  }

  .ql-indent-1:not(.ql-direction-rtl) {
    padding-left: 3em;
  }

  li.ql-indent-1:not(.ql-direction-rtl) {
    padding-left: 4.5em;
  }

  .ql-indent-1.ql-direction-rtl.ql-align-right {
    padding-right: 3em;
  }

  li.ql-indent-1.ql-direction-rtl.ql-align-right {
    padding-right: 4.5em;
  }

  .ql-indent-2:not(.ql-direction-rtl) {
    padding-left: 6em;
  }

  li.ql-indent-2:not(.ql-direction-rtl) {
    padding-left: 7.5em;
  }

  .ql-indent-2.ql-direction-rtl.ql-align-right {
    padding-right: 6em;
  }

  li.ql-indent-2.ql-direction-rtl.ql-align-right {
    padding-right: 7.5em;
  }

  .ql-indent-3:not(.ql-direction-rtl) {
    padding-left: 9em;
  }

  li.ql-indent-3:not(.ql-direction-rtl) {
    padding-left: 10.5em;
  }

  .ql-indent-3.ql-direction-rtl.ql-align-right {
    padding-right: 9em;
  }

  li.ql-indent-3.ql-direction-rtl.ql-align-right {
    padding-right: 10.5em;
  }

  .ql-indent-4:not(.ql-direction-rtl) {
    padding-left: 12em;
  }

  li.ql-indent-4:not(.ql-direction-rtl) {
    padding-left: 13.5em;
  }

  .ql-indent-4.ql-direction-rtl.ql-align-right {
    padding-right: 12em;
  }

  li.ql-indent-4.ql-direction-rtl.ql-align-right {
    padding-right: 13.5em;
  }

  .ql-indent-5:not(.ql-direction-rtl) {
    padding-left: 15em;
  }

  li.ql-indent-5:not(.ql-direction-rtl) {
    padding-left: 16.5em;
  }

  .ql-indent-5.ql-direction-rtl.ql-align-right {
    padding-right: 15em;
  }

  li.ql-indent-5.ql-direction-rtl.ql-align-right {
    padding-right: 16.5em;
  }

  .ql-indent-6:not(.ql-direction-rtl) {
    padding-left: 18em;
  }

  li.ql-indent-6:not(.ql-direction-rtl) {
    padding-left: 19.5em;
  }

  .ql-indent-6.ql-direction-rtl.ql-align-right {
    padding-right: 18em;
  }

  li.ql-indent-6.ql-direction-rtl.ql-align-right {
    padding-right: 19.5em;
  }

  .ql-indent-7:not(.ql-direction-rtl) {
    padding-left: 21em;
  }

  li.ql-indent-7:not(.ql-direction-rtl) {
    padding-left: 22.5em;
  }

  .ql-indent-7.ql-direction-rtl.ql-align-right {
    padding-right: 21em;
  }

  li.ql-indent-7.ql-direction-rtl.ql-align-right {
    padding-right: 22.5em;
  }

  .ql-indent-8:not(.ql-direction-rtl) {
    padding-left: 24em;
  }

  li.ql-indent-8:not(.ql-direction-rtl) {
    padding-left: 25.5em;
  }

  .ql-indent-8.ql-direction-rtl.ql-align-right {
    padding-right: 24em;
  }

  li.ql-indent-8.ql-direction-rtl.ql-align-right {
    padding-right: 25.5em;
  }

  .ql-indent-9:not(.ql-direction-rtl) {
    padding-left: 27em;
  }

  li.ql-indent-9:not(.ql-direction-rtl) {
    padding-left: 28.5em;
  }

  .ql-indent-9.ql-direction-rtl.ql-align-right {
    padding-right: 27em;
  }

  li.ql-indent-9.ql-direction-rtl.ql-align-right {
    padding-right: 28.5em;
  }

  .ql-video {
    display: block;
    max-width: 100%;

    &.ql-align-center {
      margin: 0 auto;
    }

    &.ql-align-right {
      margin: 0 0 0 auto;
    }
  }

  .ql-bg-black {
    background-color: #000;
  }

  .ql-bg-red {
    background-color: #e60000;
  }

  .ql-bg-orange {
    background-color: #f90;
  }

  .ql-bg-yellow {
    background-color: #ff0;
  }

  .ql-bg-green {
    background-color: #008a00;
  }

  .ql-bg-blue {
    background-color: #06c;
  }

  .ql-bg-purple {
    background-color: #93f;
  }

  .ql-color-white {
    color: #fff;
  }

  .ql-color-red {
    color: #e60000;
  }

  .ql-color-orange {
    color: #f90;
  }

  .ql-color-yellow {
    color: #ff0;
  }

  .ql-color-green {
    color: #008a00;
  }

  .ql-color-blue {
    color: #06c;
  }

  .ql-color-purple {
    color: #93f;
  }

  .ql-font-serif {
    font-family: Georgia, Times New Roman, serif;
  }

  .ql-font-monospace {
    font-family: Monaco, Courier New, monospace;
  }

  .ql-size-small {
    font-size: 0.75em;
  }

  .ql-size-large {
    font-size: 1.5em;
  }

  .ql-size-huge {
    font-size: 2.5em;
  }

  .ql-direction-rtl {
    direction: rtl;
    text-align: inherit;
  }

  .ql-align-center {
    text-align: center;
  }

  .ql-align-justify {
    text-align: justify;
  }

  .ql-align-right {
    text-align: right;
  }

  .ql-embed-selected {
    border: 1px solid #777;
    user-select: none;
  }

  &.ql-blank::before {
    color: rgba(0, 0, 0, 0.6);
    content: attr(data-placeholder);
    font-style: italic;
    pointer-events: none;
    position: absolute;
  }
}

.ql-snow {
  &.ql-toolbar:after, .ql-toolbar:after {
    clear: both;
    content: '';
    display: table;
  }

  &.ql-toolbar button, .ql-toolbar button {
    background: none;
    border: none;
    cursor: pointer;
    display: inline-block;
    float: left;
    height: 24px;
    padding: 3px 5px;
    width: 28px;
  }

  &.ql-toolbar button svg, .ql-toolbar button svg {
    float: left;
    height: 100%;
  }

  &.ql-toolbar button:active:hover, .ql-toolbar button:active:hover {
    outline: none;
  }

  &.ql-toolbar input.ql-image[type=file], .ql-toolbar input.ql-image[type=file] {
    display: none;
  }

  &.ql-toolbar button:hover, .ql-toolbar button:hover, &.ql-toolbar button:focus, .ql-toolbar button:focus, &.ql-toolbar button.ql-active, .ql-toolbar button.ql-active, &.ql-toolbar .ql-picker-label:hover, .ql-toolbar .ql-picker-label:hover, &.ql-toolbar .ql-picker-label.ql-active, .ql-toolbar .ql-picker-label.ql-active, &.ql-toolbar .ql-picker-item:hover, .ql-toolbar .ql-picker-item:hover, &.ql-toolbar .ql-picker-item.ql-selected, .ql-toolbar .ql-picker-item.ql-selected {
    color: #06c;
  }

  &.ql-toolbar button:hover .ql-fill, .ql-toolbar button:hover .ql-fill, &.ql-toolbar button:focus .ql-fill, .ql-toolbar button:focus .ql-fill, &.ql-toolbar button.ql-active .ql-fill, .ql-toolbar button.ql-active .ql-fill, &.ql-toolbar .ql-picker-label:hover .ql-fill, .ql-toolbar .ql-picker-label:hover .ql-fill, &.ql-toolbar .ql-picker-label.ql-active .ql-fill, .ql-toolbar .ql-picker-label.ql-active .ql-fill, &.ql-toolbar .ql-picker-item:hover .ql-fill, .ql-toolbar .ql-picker-item:hover .ql-fill, &.ql-toolbar .ql-picker-item.ql-selected .ql-fill, .ql-toolbar .ql-picker-item.ql-selected .ql-fill, &.ql-toolbar button:hover .ql-stroke.ql-fill, .ql-toolbar button:hover .ql-stroke.ql-fill, &.ql-toolbar button:focus .ql-stroke.ql-fill, .ql-toolbar button:focus .ql-stroke.ql-fill, &.ql-toolbar button.ql-active .ql-stroke.ql-fill, .ql-toolbar button.ql-active .ql-stroke.ql-fill, &.ql-toolbar .ql-picker-label:hover .ql-stroke.ql-fill, .ql-toolbar .ql-picker-label:hover .ql-stroke.ql-fill, &.ql-toolbar .ql-picker-label.ql-active .ql-stroke.ql-fill, .ql-toolbar .ql-picker-label.ql-active .ql-stroke.ql-fill, &.ql-toolbar .ql-picker-item:hover .ql-stroke.ql-fill, .ql-toolbar .ql-picker-item:hover .ql-stroke.ql-fill, &.ql-toolbar .ql-picker-item.ql-selected .ql-stroke.ql-fill, .ql-toolbar .ql-picker-item.ql-selected .ql-stroke.ql-fill {
    fill: #06c;
  }

  &.ql-toolbar button:hover .ql-stroke, .ql-toolbar button:hover .ql-stroke, &.ql-toolbar button:focus .ql-stroke, .ql-toolbar button:focus .ql-stroke, &.ql-toolbar button.ql-active .ql-stroke, .ql-toolbar button.ql-active .ql-stroke, &.ql-toolbar .ql-picker-label:hover .ql-stroke, .ql-toolbar .ql-picker-label:hover .ql-stroke, &.ql-toolbar .ql-picker-label.ql-active .ql-stroke, .ql-toolbar .ql-picker-label.ql-active .ql-stroke, &.ql-toolbar .ql-picker-item:hover .ql-stroke, .ql-toolbar .ql-picker-item:hover .ql-stroke, &.ql-toolbar .ql-picker-item.ql-selected .ql-stroke, .ql-toolbar .ql-picker-item.ql-selected .ql-stroke, &.ql-toolbar button:hover .ql-stroke-miter, .ql-toolbar button:hover .ql-stroke-miter, &.ql-toolbar button:focus .ql-stroke-miter, .ql-toolbar button:focus .ql-stroke-miter, &.ql-toolbar button.ql-active .ql-stroke-miter, .ql-toolbar button.ql-active .ql-stroke-miter, &.ql-toolbar .ql-picker-label:hover .ql-stroke-miter, .ql-toolbar .ql-picker-label:hover .ql-stroke-miter, &.ql-toolbar .ql-picker-label.ql-active .ql-stroke-miter, .ql-toolbar .ql-picker-label.ql-active .ql-stroke-miter, &.ql-toolbar .ql-picker-item:hover .ql-stroke-miter, .ql-toolbar .ql-picker-item:hover .ql-stroke-miter, &.ql-toolbar .ql-picker-item.ql-selected .ql-stroke-miter, .ql-toolbar .ql-picker-item.ql-selected .ql-stroke-miter {
    stroke: #06c;
  }

  box-sizing: border-box;

  * {
    box-sizing: border-box;
  }

  .ql-hidden {
    display: none;
  }

  .ql-out-bottom, .ql-out-top {
    visibility: hidden;
  }

  .ql-tooltip {
    position: absolute;
    transform: translateY(10px);

    a {
      cursor: pointer;
      text-decoration: none;
    }

    &.ql-flip {
      transform: translateY(-10px);
    }
  }

  .ql-formats {
    display: inline-block;
    vertical-align: middle;

    &:after {
      clear: both;
      content: '';
      display: table;
    }
  }

  .ql-stroke {
    fill: none;
    stroke: #444;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-width: 2;
  }

  .ql-stroke-miter {
    fill: none;
    stroke: #444;
    stroke-miterlimit: 10;
    stroke-width: 2;
  }

  .ql-fill, .ql-stroke.ql-fill {
    fill: #444;
  }

  .ql-empty {
    fill: none;
  }

  .ql-even {
    fill-rule: evenodd;
  }

  .ql-thin, .ql-stroke.ql-thin {
    stroke-width: 1;
  }

  .ql-transparent {
    opacity: 0.4;
  }

  .ql-direction {
    svg:last-child {
      display: none;
    }

    &.ql-active svg {
      &:last-child {
        display: inline;
      }

      &:first-child {
        display: none;
      }
    }
  }

  .ql-editor {
    h1 {
      font-size: 2em;
    }

    h2 {
      font-size: 1.5em;
    }

    h3 {
      font-size: 1.17em;
    }

    h4 {
      font-size: 1em;
    }

    h5 {
      font-size: 0.83em;
    }

    h6 {
      font-size: 0.67em;
    }

    a {
      text-decoration: underline;
    }

    blockquote {
      border-left: 4px solid #ccc;
      margin-bottom: 5px;
      margin-top: 5px;
      padding-left: 16px;
    }

    code {
      background-color: #f0f0f0;
      border-radius: 3px;
    }

    pre {
      background-color: #f0f0f0;
      border-radius: 3px;
      white-space: pre-wrap;
      margin-bottom: 5px;
      margin-top: 5px;
      padding: 5px 10px;
    }

    code {
      font-size: 85%;
      padding-bottom: 2px;
      padding-top: 2px;

      &:before, &:after {
        content: "\\A0";
        letter-spacing: -2px;
      }
    }

    pre.ql-syntax {
      background-color: #23241f;
      color: #f8f8f2;
      overflow: visible;
    }

    img {
      max-width: 100%;
    }
  }

  .ql-picker {
    color: #444;
    display: inline-block;
    float: left;
    font-size: 14px;
    font-weight: 500;
    height: 24px;
    position: relative;
    vertical-align: middle;
  }

  .ql-picker-label {
    cursor: pointer;
    display: inline-block;
    height: 100%;
    padding-left: 8px;
    padding-right: 2px;
    position: relative;
    width: 100%;

    &::before {
      display: inline-block;
      line-height: 22px;
    }
  }

  .ql-picker-options {
    background-color: #fff;
    display: none;
    min-width: 100%;
    padding: 4px 8px;
    position: absolute;
    white-space: nowrap;

    .ql-picker-item {
      cursor: pointer;
      display: block;
      padding-bottom: 5px;
      padding-top: 5px;
    }
  }

  .ql-picker.ql-expanded {
    .ql-picker-label {
      color: #ccc;
      z-index: 2;

      .ql-fill {
        fill: #ccc;
      }

      .ql-stroke {
        stroke: #ccc;
      }
    }

    .ql-picker-options {
      display: block;
      margin-top: -1px;
      top: 100%;
      z-index: 1;
    }
  }

  .ql-color-picker, .ql-icon-picker {
    width: 28px;
  }

  .ql-color-picker .ql-picker-label, .ql-icon-picker .ql-picker-label {
    padding: 2px 4px;
  }

  .ql-color-picker .ql-picker-label svg {
    right: 4px;
  }

  .ql-icon-picker {
    .ql-picker-label svg {
      right: 4px;
    }

    .ql-picker-options {
      padding: 4px 0px;
    }

    .ql-picker-item {
      height: 24px;
      width: 24px;
      padding: 2px 4px;
    }
  }

  .ql-color-picker {
    .ql-picker-options {
      padding: 3px 5px;
      width: 152px;
    }

    .ql-picker-item {
      border: 1px solid transparent;
      float: left;
      height: 16px;
      margin: 2px;
      padding: 0px;
      width: 16px;
    }
  }

  .ql-picker {
    &:not(.ql-color-picker):not(.ql-icon-picker) svg {
      position: absolute;
      margin-top: -9px;
      right: 0;
      top: 50%;
      width: 18px;
    }

    &.ql-header .ql-picker-label[data-label]:not([data-label=''])::before, &.ql-font .ql-picker-label[data-label]:not([data-label=''])::before, &.ql-size .ql-picker-label[data-label]:not([data-label=''])::before, &.ql-header .ql-picker-item[data-label]:not([data-label=''])::before, &.ql-font .ql-picker-item[data-label]:not([data-label=''])::before, &.ql-size .ql-picker-item[data-label]:not([data-label=''])::before {
      content: attr(data-label);
    }

    &.ql-header {
      width: 98px;

      .ql-picker-label::before, .ql-picker-item::before {
        content: 'Normal';
      }

      .ql-picker-label[data-value="1"]::before, .ql-picker-item[data-value="1"]::before {
        content: 'Heading 1';
      }

      .ql-picker-label[data-value="2"]::before, .ql-picker-item[data-value="2"]::before {
        content: 'Heading 2';
      }

      .ql-picker-label[data-value="3"]::before, .ql-picker-item[data-value="3"]::before {
        content: 'Heading 3';
      }

      .ql-picker-label[data-value="4"]::before, .ql-picker-item[data-value="4"]::before {
        content: 'Heading 4';
      }

      .ql-picker-label[data-value="5"]::before, .ql-picker-item[data-value="5"]::before {
        content: 'Heading 5';
      }

      .ql-picker-label[data-value="6"]::before {
        content: 'Heading 6';
      }

      .ql-picker-item {
        &[data-value="6"]::before {
          content: 'Heading 6';
        }

        &[data-value="1"]::before {
          font-size: 2em;
        }

        &[data-value="2"]::before {
          font-size: 1.5em;
        }

        &[data-value="3"]::before {
          font-size: 1.17em;
        }

        &[data-value="4"]::before {
          font-size: 1em;
        }

        &[data-value="5"]::before {
          font-size: 0.83em;
        }

        &[data-value="6"]::before {
          font-size: 0.67em;
        }
      }
    }

    &.ql-font {
      width: 108px;

      .ql-picker-label::before, .ql-picker-item::before {
        content: 'Sans Serif';
      }

      .ql-picker-label[data-value=serif]::before, .ql-picker-item[data-value=serif]::before {
        content: 'Serif';
      }

      .ql-picker-label[data-value=monospace]::before {
        content: 'Monospace';
      }

      .ql-picker-item {
        &[data-value=monospace]::before {
          content: 'Monospace';
        }

        &[data-value=serif]::before {
          font-family: Georgia, Times New Roman, serif;
        }

        &[data-value=monospace]::before {
          font-family: Monaco, Courier New, monospace;
        }
      }
    }

    &.ql-size {
      width: 98px;

      .ql-picker-label::before, .ql-picker-item::before {
        content: 'Normal';
      }

      .ql-picker-label[data-value=small]::before, .ql-picker-item[data-value=small]::before {
        content: 'Small';
      }

      .ql-picker-label[data-value=large]::before, .ql-picker-item[data-value=large]::before {
        content: 'Large';
      }

      .ql-picker-label[data-value=huge]::before {
        content: 'Huge';
      }

      .ql-picker-item {
        &[data-value=huge]::before {
          content: 'Huge';
        }

        &[data-value=small]::before {
          font-size: 10px;
        }

        &[data-value=large]::before {
          font-size: 18px;
        }

        &[data-value=huge]::before {
          font-size: 32px;
        }
      }
    }
  }

  .ql-color-picker {
    &.ql-background .ql-picker-item {
      background-color: #fff;
    }

    &.ql-color .ql-picker-item {
      background-color: #000;
    }
  }
}

@media (pointer: coarse) {
  .ql-snow {
    &.ql-toolbar button:hover:not(.ql-active), .ql-toolbar button:hover:not(.ql-active) {
      color: #444;
    }

    &.ql-toolbar button:hover:not(.ql-active) .ql-fill, .ql-toolbar button:hover:not(.ql-active) .ql-fill, &.ql-toolbar button:hover:not(.ql-active) .ql-stroke.ql-fill, .ql-toolbar button:hover:not(.ql-active) .ql-stroke.ql-fill {
      fill: #444;
    }

    &.ql-toolbar button:hover:not(.ql-active) .ql-stroke, .ql-toolbar button:hover:not(.ql-active) .ql-stroke, &.ql-toolbar button:hover:not(.ql-active) .ql-stroke-miter, .ql-toolbar button:hover:not(.ql-active) .ql-stroke-miter {
      stroke: #444;
    }
  }
}

.ql-toolbar.ql-snow {  
  box-sizing: border-box;
  padding: 8px;

  .ql-formats {
    margin-right: 15px;
  }

  .ql-picker-label {
    border: 1px solid transparent;
  }

  .ql-picker-options {
    border: 1px solid transparent;
    box-shadow: rgba(0, 0, 0, 0.2) 0 2px 8px;
  }

  .ql-picker.ql-expanded {
    .ql-picker-label, .ql-picker-options {
      border-color: #ccc;
    }
  }

  .ql-color-picker .ql-picker-item {
    &.ql-selected, &:hover {
      border-color: #000;
    }
  }

  + .ql-container.ql-snow {
    border-top: 0px;
  }
}

.ql-snow {
  .ql-tooltip {
    background-color: #fff;
    border: 1px solid #ccc;
    box-shadow: 0px 0px 5px #ddd;
    color: #444;
    padding: 5px 12px;
    white-space: nowrap;

    &::before {
      content: "Visit URL:";
      line-height: 26px;
      margin-right: 8px;
    }

    input[type=text] {
      display: none;
      border: 1px solid #ccc;
      font-size: 13px;
      height: 26px;
      margin: 0px;
      padding: 3px 5px;
      width: 170px;
    }

    a {
      &.ql-preview {
        display: inline-block;
        max-width: 200px;
        overflow-x: hidden;
        text-overflow: ellipsis;
        vertical-align: top;
      }

      &.ql-action::after {
        border-right: 1px solid #ccc;
        content: 'Edit';
        margin-left: 16px;
        padding-right: 8px;
      }

      &.ql-remove::before {
        content: 'Remove';
        margin-left: 8px;
      }

      line-height: 26px;
    }

    &.ql-editing {
      a {
        &.ql-preview, &.ql-remove {
          display: none;
        }
      }

      input[type=text] {
        display: inline-block;
      }

      a.ql-action::after {
        border-right: 0px;
        content: 'Save';
        padding-right: 0px;
      }
    }

    &[data-mode=link]::before {
      content: "Enter link:";
    }

    &[data-mode=formula]::before {
      content: "Enter formula:";
    }

    &[data-mode=video]::before {
      content: "Enter video:";
    }
  }

  a {
    color: ${ACTIVE_COLOR};
  }
}


/* Custom */
body .quill {
  .ql-editor {
    &.ql-blank {
      &::before {
        /* Empty editor placeholder styles */
        font-style: normal;
        color: rgb(120, 134, 147);
      }
    }
    ${() => richEditorContentCss};
  }
}

`;

export const richEditorContentCss = css`
  line-height: 1.25;

  ol {
    list-style-type: decimal;
  }

  ul {
    list-style-type: disc;
  }

  ul,
  ol {
    padding-left: 0;
    list-style-position: inside;
  }

  li {
    ::marker {
      margin-right: 0.25rem;
    }
    ul,
    ol {
      padding-left: 1rem;
    }
  }

  em {
    font-style: italic;
  }

  code,
  pre {
    font-family: monospace;
  }

  a {
    text-decoration: underline;
    color: ${ACTIVE_COLOR};
  }

  blockquote {
    border-left: 2px solid #888;
    padding: 0.5rem 0 0.5rem 0.5rem;
  }

  strong {
    font-weight: bold;
  }
`;
