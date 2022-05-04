import fs from "fs";
import path from "path";

import { extractNotificationPayloadData } from "./driveCapture";

describe("Google drive capture", () => {
  it("extracts an invitation", () => {
    const scriptInvitation = fs.readFileSync(path.resolve(__dirname + "/testFixtures/scriptInvitation"), "utf8");

    const result = extractNotificationPayloadData(
      scriptInvitation,
      "Omar Duarte (mediante Google Apps Script) <drive-shares-dm-noreply@google.com>"
    );
    expect(result).toStrictEqual([
      {
        from: "Omar Duarte",
        name: "Script thing",
        source: "script",
        type: "invitation",
        url: "https://script.google.com/d/1c8O3WzY4IkCJ03Yk8YaM4Sp392eCKUSV7cdA7vSOSZgjU12-b0nbmKGd/edit?usp=sharing_eil_m&ts=626197ad",
      },
    ]);
  });

  it("extracts a Drive Presentation comment", () => {
    const presentationComment = fs.readFileSync(path.resolve(__dirname + "/testFixtures/presentationComment"), "utf8");

    const result = extractNotificationPayloadData(
      presentationComment,
      "Ada Hall (Presentaciones de Google) <comments-noreply@docs.google.com>"
    );

    expect(result).toStrictEqual([
      {
        from: "Ada Hall",
        comment: "@omar@acape.la you know what's up",
        name: "This is a long message file",
        source: "presentation",
        type: "comment",
        url: "https://docs.google.com/presentation/d/1rZAxE7VZrXcEDsNsEqFaE9MYlf9v40hMts8qHg3EvOQ/edit?disco=AAAAYcy1d1M&usp=comment_email_discussion&ts=62617193&usp_dm=false",
      },
    ]);
  });

  it("extracts comments from google draw", () => {
    const drawComment = fs.readFileSync(path.resolve(__dirname + "/testFixtures/drawComment"), "utf8");

    const result = extractNotificationPayloadData(
      drawComment,
      "Ada Hall (Dibujos de Google) <comments-noreply@docs.google.com>"
    );

    expect(result).toStrictEqual([
      {
        from: "Ada Hall",
        comment: "This is a drawing right? meh",
        name: "To Ada draw",
        source: "drawings",
        type: "comment",
        url: "https://docs.google.com/drawings/d/1eTEsFvbWuUfA5V-kxgTpCs8l_kMWfiCOHlYGaX63eWg/edit?disco=AAAAYihwDSg&usp=comment_email_discussion&ts=62666de8&usp_dm=false",
      },
    ]);
  });

  it("extract comments from sites that have source as subdomain", () => {
    const jamboardInvitation = fs.readFileSync(path.resolve(__dirname + "/testFixtures/jamboardInvitation"), "utf8");

    const result = extractNotificationPayloadData(
      jamboardInvitation,
      "Ada Hall (mediante Google Jamboard) <drive-shares-dm-noreply@google.com>"
    );
    expect(result).toStrictEqual([
      {
        from: "Ada Hall",
        name: "Unbenanntes Jam",
        source: "jamboard",
        type: "invitation",
        url: "https://jamboard.google.com/d/11gGawxmxOLDV_44GFtttL6kFVGdN-OWxvLDWP4ArGcU/viewer?ts=62666a22",
      },
    ]);
  });

  it("extract suggestions from google docs", () => {
    const docsSuggestion = fs.readFileSync(path.resolve(__dirname + "/testFixtures/docsSuggestion"), "utf8");

    const result = extractNotificationPayloadData(
      docsSuggestion,
      "Ramon Figueroa Gutierrez (mediante Google Docs) <comments-noreply@docs.google.com>"
    );
    expect(result).toStrictEqual([
      {
        from: "Ada Hall",
        comment: "Agregar: “A lot new more suggestions just waiting for things to cool down”",
        name: "My shared document with Ada (delete)",
        source: "document",
        type: "suggestion",
        url: "https://docs.google.com/document/d/1_LZ0cOPNwH0XHUeN21JE8iMpuDvzBS0H1vVS29XIqbs/edit?disco=AAAAYhpme9Y&usp=suggestion_email_discussion&ts=62666767&usp_dm=false",
      },
    ]);
  });

  it("extracts comments and suggestions from the same author", () => {
    const docsSameAuthorCommentAndSuggestion = fs.readFileSync(
      path.resolve(__dirname + "/testFixtures/docsSameAuthorCommentAndSuggestion"),
      "utf8"
    );

    const result = extractNotificationPayloadData(
      docsSameAuthorCommentAndSuggestion,
      "Ada Hall (Documentos de Google) <comments-noreply@docs.google.com>"
    );

    expect(result).toStrictEqual([
      {
        from: "Ada Hall",
        comment: "This is a regular comment",
        name: "My shared document with Ada (delete)",
        url: "https://docs.google.com/document/d/1_LZ0cOPNwH0XHUeN21JE8iMpuDvzBS0H1vVS29XIqbs/edit?disco=AAAAYhpme9M&usp=comment_email_discussion&ts=62666307&usp_dm=false",
        type: "comment",
        source: "document",
      },
      {
        from: "Ada Hall",
        comment: "Agregar: “blah blah blja balh”",
        name: "My shared document with Ada (delete)",
        url: "https://docs.google.com/document/d/1_LZ0cOPNwH0XHUeN21JE8iMpuDvzBS0H1vVS29XIqbs/edit?disco=AAAAYhpme9Q&usp=suggestion_email_discussion&ts=62666307&usp_dm=false",
        type: "suggestion",
        source: "document",
      },
    ]);
  });

  it("extracts docs comments and suggestions from the multiple authors", () => {
    const docsMultipleAuthorsCommentsAndSuggestions = fs.readFileSync(
      path.resolve(__dirname + "/testFixtures/docsMultipleAuthorsCommentsAndSuggestions"),
      "utf8"
    );

    const result = extractNotificationPayloadData(
      docsMultipleAuthorsCommentsAndSuggestions,
      "Documentos de Google <comments-noreply@docs.google.com>"
    );

    expect(result).toStrictEqual([
      {
        from: "Omar Duarte",
        comment: "A new comment from me as well!",
        name: "My shared document with Ada (delete)",
        url: "https://docs.google.com/document/d/1_LZ0cOPNwH0XHUeN21JE8iMpuDvzBS0H1vVS29XIqbs/edit?disco=AAAAYhpme9M&usp=comment_email_discussion&ts=62669370&usp_dm=false",
        type: "comment",
        source: "document",
      },
      {
        from: "Ada Hall",
        comment: "Here's a comment to my stuff",
        name: "My shared document with Ada (delete)",
        url: "https://docs.google.com/document/d/1_LZ0cOPNwH0XHUeN21JE8iMpuDvzBS0H1vVS29XIqbs/edit?disco=AAAAYq51rBA&usp=comment_email_discussion&ts=62669370&usp_dm=false",
        type: "comment",
        source: "document",
      },
      {
        from: "Ada Hall",
        comment: "Agregar: “Here’s a new suggestion!”",
        name: "My shared document with Ada (delete)",
        url: "https://docs.google.com/document/d/1_LZ0cOPNwH0XHUeN21JE8iMpuDvzBS0H1vVS29XIqbs/edit?disco=AAAAYq51rBI&usp=suggestion_email_discussion&ts=62669370&usp_dm=false",
        type: "suggestion",
        source: "document",
      },
      {
        from: "Omar Duarte",
        comment: "Agregar: “adfasdf”",
        name: "My shared document with Ada (delete)",
        url: "https://docs.google.com/document/d/1_LZ0cOPNwH0XHUeN21JE8iMpuDvzBS0H1vVS29XIqbs/edit?disco=AAAAYq51rBQ&usp=suggestion_email_discussion&ts=62669370&usp_dm=false",
        type: "suggestion",
        source: "document",
      },
      {
        from: "Omar Duarte",
        comment: "Agregar: “Omar’s sugggestion!”",
        name: "My shared document with Ada (delete)",
        url: "https://docs.google.com/document/d/1_LZ0cOPNwH0XHUeN21JE8iMpuDvzBS0H1vVS29XIqbs/edit?disco=AAAAYq51rBU&usp=suggestion_email_discussion&ts=62669370&usp_dm=false",
        type: "suggestion",
        source: "document",
      },
    ]);
  });

  it("extracts presentation comments from multiple authors", () => {
    const presentationMultipleAuthorComments = fs.readFileSync(
      path.resolve(__dirname + "/testFixtures/presentationMultipleAuthorComments"),
      "utf8"
    );
    const result = extractNotificationPayloadData(
      presentationMultipleAuthorComments,
      "Presentaciones de Google <comments-noreply@docs.google.com>"
    );

    expect(result).toStrictEqual([
      {
        from: "Ada Hall",
        comment: "@omar@acape.la this is a different fone",
        name: "This is a long message file",
        url: "https://docs.google.com/presentation/d/1rZAxE7VZrXcEDsNsEqFaE9MYlf9v40hMts8qHg3EvOQ/edit?disco=AAAAYfV80eE&usp=comment_email_discussion&ts=6266fbae&usp_dm=false",
        source: "presentation",
        type: "comment",
      },
      {
        from: "Ada Hall",
        comment: "@omar@acape.la last but not least",
        name: "This is a long message file",
        url: "https://docs.google.com/presentation/d/1rZAxE7VZrXcEDsNsEqFaE9MYlf9v40hMts8qHg3EvOQ/edit?disco=AAAAYfV80eI&usp=comment_email_discussion&ts=6266fbae&usp_dm=false",
        source: "presentation",
        type: "comment",
      },
      {
        from: "Omar Duarte",
        comment: "@omar@acape.la this is a different comment",
        name: "This is a long message file",
        url: "https://docs.google.com/presentation/d/1rZAxE7VZrXcEDsNsEqFaE9MYlf9v40hMts8qHg3EvOQ/edit?disco=AAAAYfV80eM&usp=comment_email_discussion&ts=6266fbae&usp_dm=false",
        source: "presentation",
        type: "comment",
      },
      {
        from: "Ada Hall",
        comment: "@omar@acape.la anothe rone",
        name: "This is a long message file",
        url: "https://docs.google.com/presentation/d/1rZAxE7VZrXcEDsNsEqFaE9MYlf9v40hMts8qHg3EvOQ/edit?disco=AAAAYrQPa-o&usp=comment_email_discussion&ts=6266fbae&usp_dm=false",
        source: "presentation",
        type: "comment",
      },
    ]);
  });

  it("extracts presentations owned by author", () => {
    const presentationOwnedByAuthorComment = fs.readFileSync(
      path.resolve(__dirname + "/testFixtures/presentationOwnedByAuthorComment"),
      "utf8"
    );

    const result = extractNotificationPayloadData(
      presentationOwnedByAuthorComment,
      "Ada Hall (Presentaciones de Google) <comments-noreply@docs.google.com>"
    );

    expect(result).toStrictEqual([
      {
        from: "Ada Hall",
        comment: "This is just a regular comment",
        url: "https://docs.google.com/presentation/d/1KbZPQKiS-itxgE4ttsjaVUGxvkF4HHc69YBX5k63xw4/edit?disco=AAAAYcoJHF8&usp=comment_email_discussion&ts=62666c74&usp_dm=false",
        name: "To Ada",
        source: "presentation",
        type: "comment",
      },
    ]);
  });

  it("extracts google drive folder invitation", () => {
    const folderInvitation = fs.readFileSync(path.resolve(__dirname + "/testFixtures/folderInvitation"), "utf8");
    const result = extractNotificationPayloadData(
      folderInvitation,
      "Omar Duarte (mediante Google Drive) <drive-shares-dm-noreply@google.com>"
    );

    expect(result).toStrictEqual([
      {
        from: "Omar Duarte",
        url: "https://drive.google.com/drive/folders/0B7sIBQ4ZLO0KQ1FKYVhUTm4wdms?usp=sharing_eil_m&resourcekey=0-6nC5n6F-1KPBYit_HIK6Fw&ts=62618e52",
        name: "delete",
        source: "folders",
        type: "invitation",
      },
    ]);
  });

  describe("bugs", () => {
    it("bug.spreadsheetComment", () => {
      const bugSpreadsheetComment = fs.readFileSync(
        path.resolve(__dirname + "/testFixtures/bug.spreadsheetComment"),
        "utf8"
      );
      const result = extractNotificationPayloadData(
        bugSpreadsheetComment,
        "Jannick Stein (Google Sheets) <comments-noreply@docs.google.com>"
      );

      expect(result).toStrictEqual([
        {
          from: "Jannick Stein",
          url: "https://docs.google.com/spreadsheets/d/1VxaBnko48oGR9PwxWXMIsS4KI5zKM9zp_vPfi8qKffA/edit?disco=AAAAY_lxEl4&usp=comment_email_discussion&ts=6272409a&usp_dm=false",
          name: "Strategic List",
          source: "spreadsheets",
          type: "comment",
          comment:
            "Idea: One of the partners at Connect Ventures (Graham) is board member at Typeform; maybe this could be a way to intro? @heiki@acape.la",
        },
      ]);
    });

    it("bug.spreadsheetMultipleComments", () => {
      const bugSpreadsheetComment = fs.readFileSync(
        path.resolve(__dirname + "/testFixtures/bug.spreadsheetMultipleComments"),
        "utf8"
      );
      const result = extractNotificationPayloadData(
        bugSpreadsheetComment,
        "Jannick Stein (Google Sheets) <comments-noreply@docs.google.com>"
      );

      expect(result).toStrictEqual([
        {
          from: "Jannick Stein",
          url: "https://docs.google.com/spreadsheets/d/1VxaBnko48oGR9PwxWXMIsS4KI5zKM9zp_vPfi8qKffA/edit?disco=AAAAY_lxEl4&usp=comment_email_discussion&ts=62724706&usp_dm=false",
          name: "Strategic List",
          source: "spreadsheets",
          type: "comment",
          comment: "@roland@acape.la any insights?",
        },
        {
          comment:
            "Common connections to founder/CEO:@heiki@acape.la: Skander Garroum (founder airy), Susanne Knoll (freelance?)@roland@acape.la: Jan Oberhauser (n8n founder)anyone relevant here?",
          from: "Jannick Stein",
          name: "Strategic List",
          source: "spreadsheets",
          type: "comment",
          url: "https://docs.google.com/spreadsheets/d/1VxaBnko48oGR9PwxWXMIsS4KI5zKM9zp_vPfi8qKffA/edit?disco=AAAAY_lxEmQ&usp=comment_email_discussion&ts=62724706&usp_dm=false",
        },
        {
          comment: "Marked as resolved",
          from: "Jannick Stein",
          name: "Strategic List",
          source: "spreadsheets",
          type: "comment",
          url: "https://docs.google.com/spreadsheets/d/1VxaBnko48oGR9PwxWXMIsS4KI5zKM9zp_vPfi8qKffA/edit?disco=AAAAY-ej47Y&usp=comment_email_discussion&ts=62724706&usp_dm=false",
        },
      ]);
    });
  });
});
