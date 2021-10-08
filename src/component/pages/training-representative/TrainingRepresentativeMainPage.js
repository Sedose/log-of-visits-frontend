import React, { useEffect, useState } from 'react';
import {
  Alert,
  Button,
  Form,
  FormGroup,
  Jumbotron,
  Label,
} from 'reactstrap';
import { toast } from 'react-toastify';
import ReactToPdf from 'react-to-pdf';
import styled from 'styled-components';
import moment from 'moment';
import backendApi from '../../../api/backend-api';
import { SelectInput } from '../../../styles/styles';
import { isInteger } from '../../../util';

const ref = React.createRef();

const options = {
  orientation: 'portrait',
  unit: 'in',
  format: 'letter',
};

const Table = styled.table`
  border: 1px solid black;
`;

const Th = styled.th`
  border: 1px solid black;
`;

const Td = styled.th`
  border: 1px solid black;
`;

const Report = styled.th`
  
`;

export default ({ getAccessToken }) => {
  const [studentGroups, setStudentGroups] = useState();
  const [studentGroupId, setStudentGroupId] = useState();
  const [courseId, setCourseId] = useState();
  const [courses, setCourses] = useState();
  const [report, setReport] = useState();

  useEffect(() => {
    setStudentGroupsFromBackend();
    setCoursesFromBackend();
  }, []);

  async function setStudentGroupsFromBackend() {
    const accessToken = await getAccessToken();
    const groups = await backendApi.fetchStudentGroups(accessToken);
    setStudentGroups(groups);
  }

  async function setCoursesFromBackend() {
    const accessToken = await getAccessToken();
    const coursesFromBackend = await backendApi.fetchCourses(accessToken);
    setCourses(coursesFromBackend);
  }

  const handleGetReport = async () => {
    if (isFormInvalid()) {
      toast.error('Вибрано недійсні параметри');
    } else {
      const reportByStudentGroupAndCourse = await backendApi.fetchReport({
        studentGroupId,
        courseId,
      })(await getAccessToken());
      setReport(reportByStudentGroupAndCourse);
    }
  };

  const isFormInvalid = () => {
    const studentGroupIdAsNumber = parseInt(studentGroupId, 10);
    const courseIdAsNumber = parseInt(courseId, 10);
    return (
      !(
        isInteger(studentGroupIdAsNumber) && isInteger(courseIdAsNumber)
        && studentGroupId > 0 && courseId > 0
      )
    ); 
  };

  const selectedStudentGroupName = studentGroups?.find(({ id }) => id == studentGroupId)?.name;
  const selectedCourseName = courses?.find(({ id }) => id == courseId)?.name;

  return (
    <div>
      <Jumbotron>
        Головна сторінка представника учбової частини
      </Jumbotron>
      Please, select group
      <Form>
        {studentGroups
              && (
              <FormGroup>
                <Label for="studentGroup">Виберіть групу студентів</Label>
                <SelectInput
                  name="studentGroup"
                  onChange={
                              (event) => setStudentGroupId(event.target.value)
                          }
                >
                  <option value={-1}>Виберіть потрібну опцію</option>
                  {studentGroups?.map(
                    ({ id, name }) => <option key={id} value={id}>{name}</option>, 
                  )} 
                </SelectInput>
                <Label for="course">Виберіть курс</Label>
                <SelectInput
                  name="course"
                  onChange={
                          (event) => setCourseId(event.target.value)
                      }
                >
                  <option value={-1}>Виберіть потрібну опцію</option>
                  {courses?.map(
                    ({ id, name }) => <option key={id} value={id}>{name}</option>,
                  )}
                </SelectInput>
              </FormGroup>
              )}
        <Button onClick={handleGetReport}>Завантажити звіт</Button>
      </Form>
      <br />
      {report?.items.length > 0 && (
      <Report ref={ref}>
        <div>Звіт про відвідуваність студентів</div> 
        <div>за групою {selectedStudentGroupName}</div>
        <div>за курсом {selectedCourseName}</div>
        <div>Зареєстровано викладачем: {report?.lecturerRegisteredBy.firstName}
          {report?.lecturerRegisteredBy.middleName}
          {` ${report?.lecturerRegisteredBy.lastName}`}
        </div>
        <div>Зареєстровано в UTC часі: {moment.utc().format()}</div>
        <Table>
          <thead>
            <tr>
              <Th>#</Th>
              <Th>Email</Th>
              <Th>Ім&apos;я</Th>
              <Th>По батькові</Th>
              <Th>Прізвище</Th>
              <Th>Процент відвідування</Th>
            </tr>
          </thead>
          <tbody>
            { report?.items.map(
              ({
                email, firstName, middleName, lastName, attendancesPercent,
              }, index) => (
                <tr key={email}>
                  <Th scope="row">{index + 1}</Th>
                  <Td>{email}</Td>
                  <Td>{firstName}</Td>
                  <Td>{middleName}</Td>
                  <Td>{lastName}</Td>
                  <Td>{`${attendancesPercent} %`}</Td>
                </tr>
              ),
            )}
          </tbody>
        </Table>
        
      </Report>
      )}

      {!report?.items.length > 0 && (
      <Alert color="warning">Не знайдено дані для таких параметрів</Alert>
      )}
    
      <br />
      <Form>
        {report?.items.length > 0 && (
          <ReactToPdf
            targetRef={ref} 
            filename="student_attendances_report.pdf"
            option={options}
          >
            {({ toPdf }) => (
              <Button onClick={toPdf}>Згенерувати PDF</Button>
            )}
          </ReactToPdf>
        )}
      </Form>
    </div>
  ); 
};
