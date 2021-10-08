import React, { useEffect, useState } from 'react';
import {
  Button, Jumbotron, Form, Label, FormGroup,
} from 'reactstrap';
import readXlsxFile from 'read-excel-file';
import Papa from 'papaparse';
import { toast } from 'react-toastify';
import csvToJsonUtil from '../../../application/csvToJsonUtil';
import backendApi from '../../../api/backend-api';
import { FileInputWrapper, FormWrapper, SelectInput } from '../../../styles/styles';
import schema from './schema';
import 'react-toastify/dist/ReactToastify.css';
import { CoursesResponse } from '../../../types';

const saveAttendancesResponseBodyToMessageMap = {
  'access.token.invalid': 'Cannot authorize!',
  'cannot.extract.parts.from.user.full.name': 'Invalid file!',
  'cannot.get.user.by.full.name': 'Cannot find user with such first name, middle name, last name!',
  'to.frequent.file.uploads': 'To many file uploads from you! Try again later!',
};

export default ({ getAccessToken }: Props) => {
  const [selectedFile, setSelectedFile] = useState({
    file: '',
    fileExtension: '',
  });

  const [courses, setCourses] = useState<CoursesResponse>();
  const [courseId, setCourseId] = useState('1');

  useEffect(() => {
    setCourseOptionsFromBackend();
  }, []);

  return (
    <>
      <div>
        <Jumbotron>
          <div>Зареєструвати студента, надаючи файли від Teams</div>
          <FormWrapper>
            <Form>
              {courses
              && (
                <FormGroup>
                  <Label for="course">Вибрати курс</Label>
                  <SelectInput
                    name="course"
                    onChange={
                    (event) => setCourseId(event.target.value)
                  }
                  >
                    <option value={-1}>Будь ласка, оберіть опцію</option>
                    {courses.map(
                      ({ id, name }) => <option key={id} value={id}>{name}</option>,
                    )}
                  </SelectInput>
                </FormGroup>
              )}
              <FormGroup>
                <Label for="fileInput">Вибрати файл відвідування</Label>
                <FileInputWrapper>
                  <input
                    name="fileInput"
                    type="file"
                    onChange={fileInputChangeHandler}
                    required
                    accept=".xls,.xlsx,.csv"
                  />
                </FileInputWrapper>
              </FormGroup>
              <Button color="primary" onClick={() => handleSubmission()}>Завантажити</Button>
            </Form>
          </FormWrapper>
        </Jumbotron>
      </div>
    </>
  );

  function fileInputChangeHandler(event) {
    const file = event.target.files[0];
    setSelectedFile({ file, fileExtension: file?.name.split('.').pop() ?? '' });
  }

  function handleSubmission() {
    if (isFormInvalid()) {
      toast.error('Помилка при виконанні операції. Недійсне введення форми. Файл, курс слід вибрати!');
    } else {
      ({
        csv: saveCsv,
        xlsx: saveXlsx,
      }[selectedFile.fileExtension] || (() => toast.error('Помилка при виконанні операції. Недійсне вибране розширення файлу!')))();
    }
  }

  function saveCsv() {
    Papa.parse(selectedFile.file, {
      async complete(results) {
        await saveStudentsAttendancesFile(csvToJsonUtil(results.data.slice(1)));
      },
    });
  }

  function saveXlsx() {
    readXlsxFile(selectedFile.file, { schema }).then(async ({ rows }) => {
      await saveStudentsAttendancesFile(rows);
    });
  }

  async function saveStudentsAttendancesFile(rows) {
    const accessToken = await getAccessToken();
    const response = await backendApi.saveStudentsAttendanceFile({
      attendances: rows,
      courseId,
      registeredTimestamp: Date.now(),
    })(accessToken);
    if (response.ok) {
      toast.success('Успішно виконана операція!');
    } else {
      const responseBody = await response.json();
      const errorMessage = saveAttendancesResponseBodyToMessageMap[responseBody.errorCode] || '';
      toast.error(`Server side error! ${errorMessage}`);
    }
  }

  async function setCourseOptionsFromBackend() {
    const accessToken = await getAccessToken();
    const coursesFromBackend = await backendApi.fetchCourses(accessToken);
    setCourses(coursesFromBackend);
    setCourseId(coursesFromBackend[0] && coursesFromBackend[0].id);
  }

  function isFormInvalid() {
    return isInvalidCourseId()
      || isFileUnselected();
  }

  function isInvalidCourseId() {
    return [
      undefined,
      null,
      '-1',
    ].includes(courseId);
  }

  function isFileUnselected() {
    return selectedFile == null
      || selectedFile.fileExtension === ''
      || selectedFile.file === '';
  }
};

interface Props {
  getAccessToken: Function;
}
