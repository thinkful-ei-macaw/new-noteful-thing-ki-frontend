import React from "react";
import Note from "../Note/Note";
import "./NotePageMain.css";

export default function NotePageMain(props) {
  return (
    <section className="NotePageMain">
      <Note
        id={props.note.id}
        name={props.note.note_name}
        modified={props.note.modified}
      />
      <div className="NotePageMain__content">
        {props.note.note_content.split(/\n \r|\n/).map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>
    </section>
  );
}

NotePageMain.defaultProps = {
  note: {
    content: "",
  },
};
