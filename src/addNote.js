import React from "react";
import NotefulContext from "./App/NotefulContext";
import ValidationError from "./ValidationError";
import { withRouter } from "react-router";
class addNote extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: {
        value: "",
        touched: false,
      },
      content: {
        value: "",
        touched: false,
      },
    };
  }

  updateName(name) {
    this.setState({ name: { value: name, touched: true } });
  }

  updateContent(content) {
    this.setState({ content: { value: content, touched: true } });
  }

  validateName() {
    const name = this.state.name.value.trim();
    if (name.length === 0) {
      return "Name is required";
    } else if (name.length < 3) {
      return "Name must be at least 3 characters long";
    }
  }

  validateContent() {
    const content = this.state.content.value.trim();
    if (content.length === 0) {
      return "content is a required field";
    }
  }

  submitSwitch() {
    if (this.validateName() || this.validateContent()) {
      console.log("disabled");
      return (
        <button type="submit" disabled>
          Create Note
        </button>
      );
    } else {
      console.log("enabled");
      return <button type="submit">Create Note</button>;
    }
  }
  render() {
    const nameError = this.validateName();
    const contentError = this.validateContent();
    const submit = this.submitSwitch();
    return (
      <NotefulContext.Consumer>
        {(value) => {
          return (
            <form
              action=""
              onSubmit={(e) => {
                e.preventDefault();
                value.handleAddNote(
                  e.target.title.value,
                  e.target.folders.value,
                  e.target.content.value
                );
                this.props.history.push("/");
              }}
            >
              <label for="title">Name of Note</label>
              <input
                defaultValue="your name here"
                onChange={(e) => this.updateName(e.target.value)}
                type="text"
                name="title"
              />
              {this.state.name.touched && (
                <ValidationError message={nameError} />
              )}
              <label for="content">Content of Note</label>
              <input
                defaultValue="your content here"
                type="text"
                name="content"
                id=""
                onChange={(e) => this.updateContent(e.target.value)}
              />
              {this.state.content.touched && (
                <ValidationError message={contentError} />
              )}
              {submit}
              <select name="folders" id="" class="folders">
                {value.folders.map((folder) => {
                  return (
                    <option name={folder.folder_name} value={folder.id}>
                      {folder.folder_name}
                    </option>
                  );
                })}
              </select>
            </form>
          );
        }}
      </NotefulContext.Consumer>
    );
  }
}

export default withRouter(addNote);
