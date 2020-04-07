import React from "react";
import { NavLink, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CircleButton from "../CircleButton/CircleButton";
import { countNotesForFolder } from "../notes-helpers";
import "./NoteListNav.css";
import NotefulContext from "../App/NotefulContext";

export default function NoteListNav() {
  return (
    <NotefulContext.Consumer>
      {function renderProp(value) {
        return (
          <div className="NoteListNav">
            <ul className="NoteListNav__list">
              {value.folders.map((folder) => (
                <li key={folder.id}>
                  <NavLink
                    className="NoteListNav__folder-link"
                    to={`/folder/${folder.id}`}
                  >
                    <span className="NoteListNav__num-notes">
                      {countNotesForFolder(value.notes, folder.id)}
                    </span>
                    {folder.folder_name}
                  </NavLink>
                </li>
              ))}
            </ul>
            <div className="NoteListNav__button-wrapper">
              <CircleButton
                tag={Link}
                to="/addFolder"
                type="button"
                className="NoteListNav__add-folder-button"
              >
                <FontAwesomeIcon icon="plus" />
                <br />
                Folder
              </CircleButton>
            </div>
          </div>
        );
      }}
    </NotefulContext.Consumer>
  );
}

NoteListNav.defaultProps = {
  folders: [],
};
