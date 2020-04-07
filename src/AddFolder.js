import React from "react";
import { Route, Link } from "react-router-dom";
import ValidationError from "./ValidationError";

class addFolder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      folderName: {
        value: "",
        touched: false,
      },
    };
  }
  updateFolder(name) {
    this.setState({ folderName: { value: name, touched: true } });
  }

  validateFolder() {
    const folderName = this.state.folderName.value.trim();
    if (folderName.length === 0) {
      return "folder N is required";
    } else if (folderName.length < 3) {
      return "folder must be at least 3 characters long";
    }
  }

  submitSwitch() {
    if (this.validateFolder()) {
      console.log("disabled");
      return (
        <button type="submit" disabled>
          Create Folder
        </button>
      );
    } else {
      console.log("enabled");
      return <button type="submit">Create Note</button>;
    }
  }

  render() {
    const submit = this.submitSwitch();

    const folderError = this.validateFolder();
    return (
      <form
        action=""
        onSubmit={(e) => {
          e.preventDefault();
          this.props.handleAddFolder(e.target.title.value);
          this.props.history.push("/");
        }}
      >
        <input
          type="text"
          name="title"
          id="folder_input"
          onChange={(e) => {
            this.updateFolder(e.target.value);
          }}
        />
        {this.state.folderName.touched && (
          <ValidationError message={folderError} />
        )}

        {submit}
      </form>
    );
  }
}

export default addFolder;
