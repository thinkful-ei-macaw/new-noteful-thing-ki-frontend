import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Note from "../Note/Note";
import CircleButton from "../CircleButton/CircleButton";
import NotefulContext from "../App/NotefulContext.js";
import "./NoteListMain.css";
import { getNotesForFolder } from "../notes-helpers.js";

export default class NoteListMain extends React.Component {
  static contextType = NotefulContext;
  render() {
    let notes;
    if (this.props.match.params.folderId) {
      notes = getNotesForFolder(
        this.context.notes,
        this.props.match.params.folderId
      );
      console.log("get notes ran");
    } else {
      notes = this.context.notes;
    }
    console.log("notes in listMain is", notes);
    return (
      <section className="NoteListMain">
        <ul>
          {notes.map((note) => (
            <li key={note.id}>
              <Note id={note.id} name={note.note_name} modified="yes" />
            </li>
          ))}
        </ul>
        <div className="NoteListMain__button-container">
          <CircleButton
            tag={Link}
            to="/addNote"
            type="button"
            className="NoteListMain__add-note-button"
            onClick={console.log("clicked")}
          >
            <FontAwesomeIcon icon="plus" />
            <br />
            Note
          </CircleButton>
        </div>
      </section>
    );
  }
}

NoteListMain.defaultProps = {
  notes: [],
};
