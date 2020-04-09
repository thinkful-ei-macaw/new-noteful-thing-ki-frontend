import React from "react";
import Note from "../Note/Note";
import "./NotePageMain.css";
import NotefulContext from "../App/NotefulContext.js";
import { findNote } from "../notes-helpers.js";

export default class NotePageMain extends React.Component {
  static contextType = NotefulContext;

  render() {
    console.log("this.context.notes", this.context.notes);
    const note = findNote(
      this.context.notes,
      Number(this.props.match.params.noteId)
    );
    console.log("note in");
    if (note) {
      return (
        <section className="NotePageMain">
          <Note
            id={note.note_id}
            name={note.note_name}
            modified={note.modified}
          />
          <div className="NotePageMain__content">
            {note.note_content.split(/\n \r|\n/).map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </section>
      );
    } else {
      return <div />;
    }
  }
}
