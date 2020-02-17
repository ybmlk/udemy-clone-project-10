import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class CreateCourse extends Component {
  constructor({ context }) {
    super();
    this.context = context;
    // 'data' is a helper class with useful methods
    this.data = this.context.data;
    // The currently authenticated user's info is stored in 'authenticatedUser'
    this.authUser = this.context.authenticatedUser;
  }

  state = {
    course: {
      title: '',
      description: '',
      estimatedTime: '',
      materialsNeeded: '',
    },
    user: {
      firstName: '',
      lastName: '',
    },
    errors: [],
  };

  componentDidMount() {
    this.setState(() => ({
      user: this.authUser,
    }));
  }

  /* Is called when there is a change in input data.
  stores the input data in the corresponding course property */
  change = e => {
    const name = e.target.name;
    const value = e.target.value;
    let course = this.state.course;
    course[name] = value;
    this.setState(() => ({ course }));
  };

  // Is called when the form is submited
  submit = e => {
    e.preventDefault();
    const course = this.state.course;
    const username = this.authUser.emailAddress;
    const password = this.authUser.password;

    this.data
      /* Passes the course's data, the currently authenticated user's
      username and password as an argument to create a new course */
      .createCourse(course, username, password)
      .then(async res => {
        // If the course is created...
        if (res.status === 201) {
          const course = await res.json();
          // Gets the newly created course's Id
          const { courseId } = course;
          // ... and redirects to read mode
          this.props.history.push(`/courses/${courseId}`);
        } else {
          const data = await res.json();
          // Error message for invalid inputs is stored in 'errors'
          this.setState(() => ({
            errors: data.errors,
          }));
        }
      })
      .catch(err => {
        console.log(err);
        this.props.history.push('/error');
      });
  };

  render() {
    return (
      <div>
        <div className='bounds course--detail'>
          <h1>Create Course</h1>
          <div>
            {/* displays errors due to invalid input */}
            <ErrorsDisplay errors={this.state.errors} />
            <form onSubmit={this.submit}>
              <Body {...this.state.course} {...this.state.user} change={this.change} />
              <SideBar {...this.state.course} change={this.change} />
              <Bottom  />
            </form>
          </div>
        </div>
      </div>
    );
  }
}

const Body = ({ title, description, firstName, lastName, change }) => (
  <div className='grid-66'>
    <div className='course--header'>
      <h4 className='course--label'>Course</h4>
      <div>
        <input
          id='title'
          name='title'
          type='text'
          className='input-title course--title--input'
          placeholder='Course title...'
          value={title}
          onChange={change}
        />
      </div>
      <p>By {`${firstName} ${lastName}`}</p>
    </div>
    <div className='course--description'>
      <div>
        <textarea
          id='description'
          name='description'
          className=''
          placeholder='Course description...'
          value={description}
          onChange={change}
        ></textarea>
      </div>
    </div>
  </div>
);

const SideBar = ({ estimatedTime, materialsNeeded, change }) => (
  <div className='grid-25 grid-right'>
    <div className='course--stats'>
      <ul className='course--stats--list'>
        <li className='course--stats--list--item'>
          <h4>Estimated Time</h4>
          <div>
            <input
              id='estimatedTime'
              name='estimatedTime'
              type='text'
              className='course--time--input'
              placeholder='Hours'
              value={estimatedTime === null ? '' : estimatedTime}
              onChange={change}
            />
          </div>
        </li>
        <li className='course--stats--list--item'>
          <h4>Materials Needed</h4>
          <div>
            <textarea
              id='materialsNeeded'
              name='materialsNeeded'
              className=''
              placeholder='List materials...'
              value={materialsNeeded === null ? '' : materialsNeeded}
              onChange={change}
            ></textarea>
          </div>
        </li>
      </ul>
    </div>
  </div>
);

const Bottom = () => (
  <div className='grid-100 pad-bottom'>
    <button className='button' type='submit'>
      Create Course
    </button>
    <Link className='button button-secondary' to='/'>
      Cancel
    </Link>
  </div>
);

const ErrorsDisplay = ({ errors }) => {
  if (errors.length) {
    return (
      <div>
        <h2 className='validation--errors--label'>Invalid Input</h2>
        <div className='validation-errors'>
          <ul>
            {errors.map((error, i) => (
              <li key={i}>{error}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
  return null;
};

export default CreateCourse;
