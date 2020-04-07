import React from 'react'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './Note.css'
import NotefulContext from '../App/NotefulContext'

class Note extends React.Component {
  static contextType = NotefulContext;
  render() {
    return (
      <div className='Note' >
        <h2 className='Note__title'>
          <Link to={`/note/${this.props.id}`}>
            {this.props.name}
          </Link>
        </h2>
        <Link to='/'>
          <button onClick={() => this.context.handleDelete(this.props.id)} className='Note__delete' type='button'>
            <FontAwesomeIcon icon='trash-alt' />
            {' '}
        remove
      </button>
        </Link>
        <div className='Note__dates'>
          <div className='Note__dates-modified'>
            Modified
          {' '}
            <span className='Date'>
              {format(this.props.modified, 'Do MMM YYYY')}
            </span>
          </div>
        </div>
      </div >
    )
  }
}
export default Note;