import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import {
  Button, Container, Jumbotron, Table, 
} from 'reactstrap';
import backendApi from '../../api/backend-api';
import { isInteger } from '../../util';

export default ({ getAccessToken }) => {
  const [settingsFromBackend, setSettings] = useState();
  const [settingsToUpdate, setSettingsToUpdate] = useState();

  useEffect(() => {
    setSettingsAsync();
  }, []);
  
  const setSettingValue = (settingCode, settingValueNew) => {
    const parsedSettingValue = parseInt(settingValueNew, 10);
    if (!isInteger(parsedSettingValue)) {
      toast.error('Помилка при виконанні операції. Введіть ненульове ціле число!');
    }
    const newSettings = settingsFromBackend?.userSettings.map((setting) => (
      setting.code === settingCode ? { ...setting, value: settingValueNew } : setting
    ));
    setSettingsToUpdate(newSettings);
  };

  const handleSaveAllSettings = async () => {
    if (isSettingsInvalid(settingsToUpdate)) {
      toast.error('Введіть ненульове натуральне число');
    } else {
      await backendApi.saveAllUserSettings(
        formUserSettingsRequestBody(settingsToUpdate),
      )(await getAccessToken());
      toast.info('Усі налаштування користувача зберігаються...');
      await setSettingsAsync();
      toast.success('Успішно виконана операція!');
    }
  };

  const setSettingsAsync = async () => {
    setSettings(await backendApi.fetchSettings(await getAccessToken()));
  };

  return (
    <>
      <Jumbotron>
        <h1>Керування налаштуваннями користувача</h1>
      </Jumbotron>
      <Container>
        <Table>
          <thead>
            <tr>
              <th>#</th>
              <th>Опис</th>
              <th>Значення</th>
              <th>Значення за замовчуванням</th>
              <th>Нове значення</th>
            </tr>
          </thead>
          <tbody>
            { settingsFromBackend && settingsFromBackend.userSettings.map(
              ({
                code, value, description, defaultValue, 
              }, index) => (
                <tr key={code}>
                  <th scope="row">{index + 1}</th>
                  <td>{description}</td>
                  <td>{value}</td>
                  <td>{defaultValue}</td>
                  <td>
                    <input
                      type="number"
                      min={1}
                      max={2147483647}
                      onChange={(event) => setSettingValue(code, event.target.value)}
                    />
                  </td>
                </tr>
              ),
            )}
          </tbody>
        </Table>
        <Button onClick={() => handleSaveAllSettings(getAccessToken)}>
          Зберегти всі зміни
        </Button>
      </Container>
    </>
  );
};

const formUserSettingsRequestBody = (settings) => ({
  userSettings: settings.map(({ code, value }) => ({
    code,
    newValue: value,
  })),
});

const isSettingsInvalid = (settings) => (
  settings.some(({ value }) => parseInt(value, 10) <= 0)
);
