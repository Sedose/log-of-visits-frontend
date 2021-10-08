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

export default ({ getAccessToken }) => {
  const [specialities, setSpecialities] = useState();
  const [groups, setGroups] = useState();
  const [specialtyId, setSpecialtyId] = useState();
  
  useEffect(() => {
    setSpecialitiesOptionsFromBackend();
  }, []);

  useEffect(() => {
    setGroupsOptionsFromBackend();
  }, [specialities]);

  return (
    <>
      <div>
        <Jumbotron>
          <div>Зареєструвати студента власноруч</div>
          <FormWrapper>
            <Form>
              {specialities
              && (
                <FormGroup>
                  <Label for="specialty">Вибрати спеціалізацію</Label>
                  <SelectInput
                    name="specialty"
                    onChange={
                    (event) => setSpecialtyId(event.target.value)
                  }
                  >
                    <option value={-1}>Будь ласка, оберіть опцію</option>
                    {specialities.map(
                      ({ id, name }) => <option key={id} value={id}>{name}</option>,
                    )}
                  </SelectInput>
                </FormGroup>
              )}
              {groups
              && (
                  <FormGroup>
                    <Label for="specialty">Вибрати спеціалізацію</Label>
                    <SelectInput
                        name="specialty"
                        onChange={
                          (event) => setSpecialtyId(event.target.value)
                        }
                    >
                      <option value={-1}>Будь ласка, оберіть опцію</option>
                      {specialities.map(
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

  async function setSpecialitiesOptionsFromBackend() {
    const specialtiesFromBackend = await backendApi.fetchSpecialties(
      await getAccessToken(),
    );
    setSpecialities(specialtiesFromBackend);
  }
};
