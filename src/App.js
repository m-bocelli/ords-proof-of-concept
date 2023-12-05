import React from 'react';
import kendoka from './kendoka.svg';
import './App.css';
import { DropDownList } from '@progress/kendo-react-dropdowns';
import { Button } from '@progress/kendo-react-buttons';
import { Grid, GridColumn } from "@progress/kendo-react-grid";
import { Form, FormElement, Field, FieldWrapper } from '@progress/kendo-react-form';
import { Input } from '@progress/kendo-react-inputs';

function App() {
  const [currCourse, setCurrCourse] = React.useState(null);
  const [sections, setSections] = React.useState(null);
  const [gridData, setGridData] = React.useState(null);
  const [courses, setCourses] = React.useState(null);
  const [currStudent, setCurrStudent] = React.useState(null);
  const [students, setStudents] = React.useState(null);

  React.useEffect(() => {
    fetch('http://localhost:8080/ords/ud_mbocelli/proof/courses')
    .then((res) => res.json())
    .then((data) => setGridData(data.items))
    .catch((err) => console.error("Couldn't fetch", err));
  }, []);

  React.useEffect(() => {
    fetch('http://localhost:8080/ords/ud_mbocelli/proof/courses')
    .then((res) => res.json())
    .then((data) => setCourses(data.items))
    .catch((err) => console.error("Couldn't fetch", err));
  }, [courses]);

  React.useEffect(() => {
    fetch('http://localhost:8080/ords/ud_mbocelli/proof/students')
    .then((res) => res.json())
    .then((data) => setStudents(data.items))
    .catch((err) => console.error("Couldn't fetch", err));
  }, [students]);

  React.useEffect(() => {
    if (currCourse) {
      fetch(`http://localhost:8080/ords/ud_mbocelli/proof/sections?course_no=${currCourse.course_no}`)
      .then((res) => res.json())
      .then((data) => setSections(data.items))
    }
  }, [currCourse]);

  const createStudent = (data) => {
    fetch('http://localhost:8080/ords/ud_mbocelli/proof/students', 
    { method: 'POST', 
      headers: { "Content-Type": "application/json"},
      body: JSON.stringify(data)});
  }

  const updateStudent = (data) => {
    fetch('http://localhost:8080/ords/ud_mbocelli/proof/students', 
    { method: 'PUT', 
      headers: { "Content-Type": "application/json"},
      body: JSON.stringify(data)});
  }

  const deleteStudent = (data) => {
    fetch(`http://localhost:8080/ords/ud_mbocelli/proof/students?student_id=${data.student_id}`, 
    { method: 'DELETE',
      headers: {"AAccess-Control-Allow-Origin": "*"}});
  }

  const handleCourseSelect = (e) => {
    setCurrCourse(e.target.value);
  }

  const handleStudentSelect = (e) => {
    setCurrStudent(e.target.value);
  }

  const requiredValidator = (value) => {
    return value ? "" : "Required field.";
  }

  const handleGrid = React.useCallback(async (table) => {
    const res = await fetch(`http://localhost:8080/ords/ud_mbocelli/proof/${table}`);
    const data = await res.json();
    setGridData(data.items);
  }, []);
  
  return (
    <div className="App">
      <header className="App-header">
        <img src={kendoka} className="App-logo" alt="kendoka" />
        <form onSubmit={(e) => e.preventDefault()}> 
        {courses &&
          <div className='dropdown-container'>
            <h1>{ currCourse ? currCourse.description: "Select a course"}</h1>
            <DropDownList 
              data={courses} 
              textField='description'
              dataItemKey='course_no'
              onChange={handleCourseSelect}
              value={currCourse}
              style={{
                minWidth: "250px",
                maxWidth: "300px",
                marginBottom: '2rem'
              }}
            />
            {sections &&
              <div className='grid-container'>
                <Grid data={sections} style={{width: '35vw'}}>
                  <GridColumn field='section_no'></GridColumn>
                  <GridColumn field='location'></GridColumn>
                  <GridColumn field='capacity'></GridColumn>
                </Grid> 
              </div>
            }         
          </div>
        }        
        </form>
      </header>
      <main className='app-center'>
        { gridData &&
          <>
            <h1>View a Table</h1>
            <div className='button-group'>
              <Button onClick={()=>handleGrid('courses')} themeColor={'secondary'}>Courses</Button>
              <Button onClick={()=>handleGrid('sections')} themeColor={'secondary'}>Sections</Button>
              <Button onClick={()=>handleGrid('instructors')} themeColor={'secondary'}>Instructors</Button>
              <Button onClick={()=>handleGrid('students')} themeColor={'secondary'}>Students</Button>
            </div>
            <div className='grid-container'>
              <Grid data={gridData} className='main-grid'>
                {
                  Object.keys(gridData[0]).map((field, i) => (<GridColumn key={i} field={field} className='grid-column'/>))
                }
              </Grid>
            </div>
          </>
        }
      </main>
      <footer className='app-footer'>
          <div><h1>CRUD a Student</h1></div>
          <div style={{display: 'flex', gap: '2rem'}}>
            <div style={{display: 'flex', justifyContent: 'center'}}>
              <Form 
              onSubmit={createStudent}
              render={(formRenderProps)=> (
                <FormElement className="create-student" style={{color: 'salmon'}}>
                  <h2>Create Student</h2>
                  <FieldWrapper>
                    <Field
                      label='First Name'
                      name='first_name'
                      component={Input}
                    />
                    <Field
                      label='Last Name'
                      name='last_name'
                      component={Input}
                      validator={requiredValidator}
                    />
                    <Field
                      label='Zip'
                      name='zip'
                      component={Input}
                      validator={requiredValidator}
                    />
                    <Field
                      label='Phone Number'
                      name='phone'
                      component={Input}
                    />
                  </FieldWrapper>
                  <Button type='submit' themeColor={'primary'}>Create</Button>
                </FormElement>
              )}>
              </Form>
            </div>
            <div style={{display: 'flex', justifyContent: 'center'}}>
              <Form 
                  render={(formRenderProps)=> (
                    <FormElement className="create-student" style={{color: 'salmon'}}>
                      <h2>Read Student</h2>
                      {students &&
                        <DropDownList 
                          data={students} 
                          textField='student_id'
                          dataItemKey='student_id'
                          onChange={handleStudentSelect}
                          value={currStudent}
                          style={{
                            maxHeight: "2rem",
                            minWidth: "250px",
                            maxWidth: "300px",
                          }}
                          />
                      }
                      {currStudent &&
                        <div>
                          <h3>Name: {currStudent.salutation + ' ' + currStudent.first_name + ' ' + currStudent.last_name}</h3>
                          <h3>Address: {currStudent.street_address + ', ' + currStudent.zip}</h3>
                          <h3>Phone: {currStudent.phone}</h3>
                          <h3>Registration Date: {currStudent.registration_date}</h3>
                        </div>
                      }
                    </FormElement>
                  )}>
              </Form>
            </div>
            <div style={{display: 'flex', justifyContent: 'center'}}>
              <Form 
                onSubmit={updateStudent}
                render={(formRenderProps)=> (
                  <FormElement className="create-student" style={{color: 'salmon'}}>
                    <h2>Update Student</h2>
                    <FieldWrapper>
                      <Field
                        label='Student ID'
                        name='student_id'
                        component={Input}
                        validator={requiredValidator}
                      />
                      <Field
                        label='New Street Address'
                        name='street_address'
                        component={Input}
                        validator={requiredValidator}
                      />
                      <Field
                        label='New Zip'
                        name='zip'
                        component={Input}
                        validator={requiredValidator}
                      />
                    </FieldWrapper>
                    <Button type='submit' themeColor={'primary'}>Update</Button>
                  </FormElement>
                )}>
                </Form>
              </div>
              <div style={{display: 'flex', justifyContent: 'center'}}>
              <Form 
                onSubmit={deleteStudent}
                render={(formRenderProps)=> (
                  <FormElement className="create-student" style={{color: 'salmon'}}>
                    <h2>Delete Student</h2>
                    <FieldWrapper>
                      <Field
                        label='Student ID'
                        name='student_id'
                        component={Input}
                        validator={requiredValidator}
                      />
                    </FieldWrapper>
                    <Button type='submit' themeColor={'primary'}>Delete</Button>
                  </FormElement>
                )}>
                </Form>
              </div>
          </div>
      </footer>
    </div>
  );
}

export default App;
